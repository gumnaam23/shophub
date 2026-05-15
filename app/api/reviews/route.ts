import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';
import mongoose from 'mongoose';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const skip = (page - 1) * limit;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Build sort query
    let sortQuery = {};
    switch (sortBy) {
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'highest':
        sortQuery = { rating: -1 };
        break;
      case 'lowest':
        sortQuery = { rating: 1 };
        break;
      case 'helpful':
        sortQuery = { helpful: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const reviews = await Review.find({ 
      productId: new mongoose.Types.ObjectId(productId), 
      isApproved: true 
    })
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({ 
      productId: new mongoose.Types.ObjectId(productId), 
      isApproved: true 
    });

    // Calculate rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), isApproved: true } },
      { $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      }}
    ]);

    const averageRating = ratingStats[0]?.averageRating || 0;

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
      const count = reviews.filter(r => Math.floor(r.rating) === stars).length;
      return {
        stars,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        averageRating: averageRating.toFixed(1),
        totalReviews: total,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('GET Reviews Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const body = await request.json();
    const { productId, rating, title, comment, images } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, error: 'Product ID, rating, title, and comment are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get user from database using session user id
    let user = await User.findOne({ _id: session.user.id });
    
    // If user not found in database, create from session
    if (!user) {
      user = await User.create({
        _id: session.user.id,
        email: session.user.email,
        name: session.user.name || 'User',
        avatar: session.user?.image,
        role: 'user',
        isActive: true,
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      productId: new mongoose.Types.ObjectId(productId), 
      userId: user._id 
    });
    
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      productId: new mongoose.Types.ObjectId(productId),
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      rating,
      title,
      comment,
      images: images || [],
      verified: false,
      isApproved: true,
    });

    // Update product rating and reviews count
    const allReviews = await Review.find({ 
      productId: new mongoose.Types.ObjectId(productId), 
      isApproved: true 
    });
    
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviews: allReviews.length,
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('POST Review Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}