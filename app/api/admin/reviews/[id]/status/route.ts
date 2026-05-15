import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';
import { Types } from 'mongoose';
import { authOptions } from '../../../../auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
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
    const { status } = await request.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
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

    // Update review approval status
    review.isApproved = status === 'approved';
    review.updatedAt = new Date();
    await review.save();

    // Update product rating if review is approved
    if (status === 'approved') {
      const approvedReviews = await Review.find({ 
        productId: review.productId, 
        isApproved: true 
      });
      
      const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = approvedReviews.length > 0 ? totalRating / approvedReviews.length : 0;

      await Product.findByIdAndUpdate(review.productId, {
        rating: averageRating,
        reviews: approvedReviews.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Review ${status} successfully`,
    });
  } catch (error) {
    console.error('Update review status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review status' },
      { status: 500 }
    );
  }
}