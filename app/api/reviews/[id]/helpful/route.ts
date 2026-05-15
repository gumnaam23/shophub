import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import mongoose from 'mongoose';
import { authOptions } from '../../../auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  req: NextRequest,
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

    await connectToDatabase();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user already marked as helpful
    if (review.helpfulUsers && review.helpfulUsers.includes(session.user.id)) {
      return NextResponse.json(
        { success: false, error: 'You already marked this review as helpful' },
        { status: 400 }
      );
    }

    // Update helpful count
    review.helpful = (review.helpful || 0) + 1;
    review.helpfulUsers = review.helpfulUsers || [];
    review.helpfulUsers.push(session.user.id);
    await review.save();

    return NextResponse.json({
      success: true,
      helpful: review.helpful,
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Helpful Review Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark review as helpful' },
      { status: 500 }
    );
  }
}