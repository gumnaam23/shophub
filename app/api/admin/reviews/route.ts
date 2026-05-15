import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
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

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: {
      isApproved?: boolean | null;
      rating?: number;
    } = {};

    if (status && status !== 'all') {
      query.isApproved = status === 'approved';
      if (status === 'pending') query.isApproved = null;
    }
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(query);

    // Get product and user details for each review
    const reviewsWithDetails = await Promise.all(
      reviews.map(async (review) => {
        const product = await Product.findById(review.productId).lean();
        const user = await User.findById(review.userId).lean();

        // Determine status based on isApproved
        let reviewStatus = 'pending';
        if (review.isApproved === true) reviewStatus = 'approved';
        if (review.isApproved === false) reviewStatus = 'rejected';

        return {
          _id: review._id,
          productId: review.productId,
          productName: product?.name || 'Unknown Product',
          productImage: product?.images?.[0] || '/images/placeholder.jpg',
          productSlug: product?.slug || '',
          userId: review.userId,
          userName: user?.name || 'Anonymous User',
          userAvatar: user?.image,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          images: review.images || [],
          verified: review.verified || false,
          helpful: review.helpful || 0,
          status: reviewStatus,
          reported: review.reported || false,
          reportReason: review.reportReason,
          createdAt: review.createdAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      reviews: reviewsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}