import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { notificationsEnabled } = await req.json();

    const { db } = await connectToDatabase();
    
    // Update notifications setting
    const result = await db.collection('users').updateOne(
      { email: session.user.email },
      { 
        $set: { 
          notificationsEnabled,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Notification preferences updated successfully'
    });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating notification preferences' },
      { status: 500 }
    );
  }
}