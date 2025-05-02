import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { ObjectId } from 'mongodb';

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

interface ConnectedAccounts {
  google: boolean;
  facebook: boolean;
  microsoft: boolean;
}

interface DatabaseUser {
  _id: ObjectId;
  name?: string;
  email?: string;
  image?: string;
  mobile?: string;
  provider?: string;
  emailVerified?: Date | null;
  password?: string;
  connectedAccounts?: ConnectedAccounts;
  notificationsEnabled?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  mobile: string;
  provider: string;
  emailVerified: Date | null;
  connectedAccounts: ConnectedAccounts;
  notificationsEnabled: boolean;
  hasPassword: boolean;
}

function createConnectedAccounts(user: DatabaseUser | null, sessionUser: ExtendedUser): ConnectedAccounts {
  const connectedAccounts: ConnectedAccounts = user?.connectedAccounts || {
    google: false,
    facebook: false,
    microsoft: false
  };

  // Update from user provider if present
  if (user?.provider) {
    updateConnectedAccountsFromProvider(connectedAccounts, user.provider);
  }
  
  // Update from session provider if present
  if (sessionUser.provider) {
    updateConnectedAccountsFromProvider(connectedAccounts, sessionUser.provider);
  }
  
  return connectedAccounts;
}

function updateConnectedAccountsFromProvider(accounts: ConnectedAccounts, provider: string): void {
  if (provider === 'google') accounts.google = true;
  if (provider === 'facebook') accounts.facebook = true;
  if (provider === 'azure-ad') accounts.microsoft = true;
}

function createDefaultProfile(sessionUser: ExtendedUser): UserProfile {
  return {
    id: sessionUser.id ?? '',
    name: sessionUser.name ?? '',
    email: sessionUser.email ?? '',
    image: sessionUser.image ?? '',
    mobile: '',
    provider: sessionUser.provider ?? '',
    emailVerified: null,
    connectedAccounts: {
      google: sessionUser.provider === 'google',
      facebook: sessionUser.provider === 'facebook',
      microsoft: sessionUser.provider === 'azure-ad'
    },
    notificationsEnabled: true,
    hasPassword: false
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne(
      { email: session.user.email },
      { projection: { password: 0 } }
    ) as DatabaseUser | null;

    if (!user) {
      return NextResponse.json(createDefaultProfile(session.user));
    }

    const connectedAccounts = createConnectedAccounts(user, session.user);

    const extendedUser = session.user as ExtendedUser;
    const userProfile: UserProfile = {
      id: user._id.toString(),
      name: user.name ?? session.user.name ?? '',
      email: user.email ?? session.user.email ?? '',
      image: user.image ?? session.user.image ?? '',
      mobile: user.mobile ?? '',
      provider: user.provider ?? extendedUser.provider ?? '',
      emailVerified: user.emailVerified || null,
      connectedAccounts: connectedAccounts,
      notificationsEnabled: user.notificationsEnabled !== false,
      hasPassword: !!user.password 
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching profile' },
      { status: 500 }
    );
  }
}