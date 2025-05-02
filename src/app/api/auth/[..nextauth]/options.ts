import { AuthOptions, Session,User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import clientPromise, { connectToDatabase } from '@/lib/mongodb';

interface UserWithId extends User {
  id: string;
}

interface CustomSessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
  emailVerified?: Date;
  createdAt?: Date;
}

export const authOptions: AuthOptions = { 
  adapter: MongoDBAdapter(clientPromise),
  providers: [     
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
         emailVerified: profile.email_verified,
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        try {
          const { db } = await connectToDatabase();
          const user = await db.collection('users').findOne({ email: credentials.email });

          if (!user) {
            console.log(`No user found with email: ${credentials.email}`);
            return null;
          }

          if (!user.password) {
            console.log("User has no password (possibly registered through OAuth)");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) {
        return false;
      }

      try {
        const { db } = await connectToDatabase();
        
        const existingUser = await db.collection('users').findOne({ email: user.email });
        
        if (!existingUser) {
          await db.collection('users').insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account?.provider,
            emailVerified: new Date(),
            createdAt: new Date()
          });
          console.log(`New user created: ${user.email}`);
        } else {
          await db.collection('users').updateOne(
            { email: user.email },
            { 
              $set: { 
                name: user.name,
                image: user.image,
                lastLogin: new Date(),
                provider: account?.provider ?? existingUser.provider
              } 
            }
          );
          console.log(`User updated: ${user.email}`);
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return true; 
      }
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as CustomSessionUser).id = token.sub as string;
        
        try {
          const { db } = await connectToDatabase();
          const userData = await db.collection('users').findOne({ email: session.user.email });
          
          if (userData) {
            const customSession = session as Session & { 
              user: CustomSessionUser
            };
            
            customSession.user.id = userData._id.toString();
            customSession.user.provider = userData.provider;
            customSession.user.emailVerified = userData.emailVerified;
            customSession.user.createdAt = userData.createdAt;
            
            return customSession;
          }
        } catch (error) {
          console.error("Error fetching user data for session:", error);
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const userId = (user as UserWithId).id;
        if (userId) {
          token.id = userId;
        }
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, 
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
