import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const admin = await User.findById(session.user.id);
    if (admin?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get customer names
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await User.findById(order.userId).lean();
        return {
          _id: order._id,
          orderNumber: order.orderNumber,
          customer: customer?.name || 'Guest',
          total: order.total,
          status: order.orderStatus,
          date: order.createdAt,
        };
      })
    );

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Recent orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
}