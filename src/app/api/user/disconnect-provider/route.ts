import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { provider } = body;

    if (!provider || !['google', 'facebook', 'azure-ad'].includes(provider)) {
      return NextResponse.json(
        { message: 'Invalid provider specified' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const hasPassword = !!user.password;
    const connectedAccounts = user.connectedAccounts ?? {};
    
    const providerMap: Record<string, string> = {
      'google': 'google',
      'facebook': 'facebook',
      'azure-ad': 'microsoft'
    };
    
    let connectedProvidersCount = 0;
    if (user.provider === 'google' || connectedAccounts.google) connectedProvidersCount++;
    if (user.provider === 'facebook' || connectedAccounts.facebook) connectedProvidersCount++;
    if (user.provider === 'azure-ad' || connectedAccounts.microsoft) connectedProvidersCount++;

    if (connectedProvidersCount <= 1 && !hasPassword) {
      return NextResponse.json(
        { 
          message: 'Cannot disconnect the only authentication method. Please set a password first.' 
        },
        { status: 400 }
      );
    }

    interface UpdateData {
      provider?: null;
      [key: string]: unknown; // Changed from any to unknown
    }

    const updateData: UpdateData = {};
    
    if (user.provider === provider) {
      updateData.provider = null;
    }
    
    updateData[`connectedAccounts.${providerMap[provider]}`] = false;

    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    return NextResponse.json({
      message: 'Provider disconnected successfully'
    });
  } catch (error: unknown) { // Added type for error parameter
    console.error('Error disconnecting provider:', error);
    return NextResponse.json(
      { message: 'An error occurred while disconnecting provider' },
      { status: 500 }
    );
  }
}