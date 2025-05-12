import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { uploadToStorage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('profileImage') as File;
    if (!file) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!session.user.email) {
      return NextResponse.json(
        { message: 'User email is required' },
        { status: 400 }
      );
    }
    
    const imageUrl = await uploadToStorage(file, session.user.email);
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection('users').updateOne(
      { email: session.user.email },
      { 
        $set: {
          image: imageUrl,
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
      message: 'Profile image updated successfully',
      imageUrl
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { message: 'An error occurred while uploading image' },
      { status: 500 }
    );
  }
}
