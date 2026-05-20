import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';
import { Types } from 'mongoose';
import { authOptions } from '../../../../../auth/[...nextauth]/route';

interface RouteParams {
    params: Promise<{ id: string }>; 
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const admin = await User.findById(session.user.id);
    if (admin?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { isFeatured } = await request.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // If setting as featured, remove featured from others
    if (isFeatured) {
      await BlogPost.updateMany(
        { _id: { $ne: id }, isFeatured: true },
        { $set: { isFeatured: false } }
      );
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
      { isFeatured },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      post,
      message: isFeatured ? 'Post featured' : 'Post unfeatured',
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update featured status' },
      { status: 500 }
    );
  }
}