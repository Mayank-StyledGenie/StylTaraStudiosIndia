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
    
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { message: 'User email not found' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
   
    const result = await db.collection('users').updateOne(
      { email: userEmail },
      { 
        $set: { 
          image: null,
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
      message: 'Profile image removed successfully',
      user: {
        email: userEmail,
        image: null
      }
    });
  } catch (error) {
    console.error('Error removing user image:', error);
    return NextResponse.json(
      { message: 'Failed to remove image' },
      { status: 500 }
    );
  }
}