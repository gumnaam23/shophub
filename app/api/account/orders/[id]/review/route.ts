import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order, { IOrderItem } from '@/models/Order';
import Review from '@/models/Review';
import { Types } from 'mongoose';
import { authOptions } from '../../../../auth/[...nextauth]/route';

interface RouteParams {
    params: Promise<{ id: string }>; 
}

// POST /api/account/orders/[id]/review - Add review for order items
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
    const { productId, rating, title, comment } = await request.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify order exists and is delivered
    const order = await Order.findOne({ _id: id, userId: session.user.id });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.orderStatus !== 'delivered') {
      return NextResponse.json(
        { success: false, error: 'You can only review delivered orders' },
        { status: 400 }
      );
    }

    // Verify product was in the order
    const orderedItem = order.items.find(
      (item: IOrderItem) => item.productId.toString() === productId
    );

    if (!orderedItem) {
      return NextResponse.json(
        { success: false, error: 'Product not found in this order' },
        { status: 404 }
      );
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      productId: new Types.ObjectId(productId),
      userId: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review with verified purchase
    const review = await Review.create({
      productId: new Types.ObjectId(productId),
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      rating,
      title,
      comment,
      verified: true, // Verified purchase since it's from order
      isApproved: true,
    });

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}