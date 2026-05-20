import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Order from '@/models/Order';
import User from '@/models/User';
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

    const admin = await User.findById(session.user.id);
    if (admin?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { amount, reason } = await request.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid refund amount required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const payment = await Payment.findById(id);
    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Only completed payments can be refunded' },
        { status: 400 }
      );
    }

    if (amount > payment.amount) {
      return NextResponse.json(
        { success: false, error: 'Refund amount cannot exceed payment amount' },
        { status: 400 }
      );
    }

    // Update payment status
    payment.status = 'refunded';
    payment.refundAmount = amount;
    payment.refundReason = reason || 'No reason provided';
    payment.refundedAt = new Date();
    await payment.save();

    // Optionally update order status
    await Order.findByIdAndUpdate(payment.orderId, {
      orderStatus: 'cancelled',
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      payment,
      message: 'Refund processed successfully',
    });
  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}