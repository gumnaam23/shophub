import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import { Types } from 'mongoose';
import { authOptions } from '../../../../auth/[...nextauth]/route';

interface RouteParams {
    params: Promise<{ id: string }>; 

}

export async function POST(
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

    const { id } = await params;
    const { reason } = await request.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    review.reported = true;
    review.reportReason = reason;
    await review.save();

    return NextResponse.json({
      success: true,
      message: 'Review reported successfully',
    });
  } catch (error) {
    console.error('Report review error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to report review' },
      { status: 500 }
    );
  }
}