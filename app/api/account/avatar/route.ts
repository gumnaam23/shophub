import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

// POST /api/account/avatar - Update profile picture
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { image: imageUrl },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile picture updated',
      image: user?.image,
    });
  } catch (error) {
    console.error('Avatar update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile picture' },
      { status: 500 }
    );
  }
}