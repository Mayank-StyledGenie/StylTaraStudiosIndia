import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('users').deleteOne({ email: session.user.email });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    await db.collection('sessions').deleteMany({ 
      userEmail: session.user.email 
    });

    return NextResponse.json({
      message: 'Account deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting account' },
      { status: 500 }
    );
  }
}