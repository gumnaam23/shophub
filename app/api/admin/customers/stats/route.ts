import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
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

    const admin = await User.findById(session.user.id);
    if (admin?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get customers (users with role 'user')
    const customers = await User.find({ role: 'user' }).lean();
    const totalCustomers = customers.length;

    // Get orders for revenue calculation
    const allOrders = await Order.find().lean();
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

    // Average orders per customer
    const totalOrders = allOrders.length;
    const averageOrders = totalCustomers > 0 ? totalOrders / totalCustomers : 0;

    // New customers this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const newCustomersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: firstDayOfMonth },
    });

    // Repeat customers (customers with more than 1 order)
    const ordersByCustomer = allOrders.reduce((acc, order) => {
      acc[order.userId] = (acc[order.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const repeatCustomers = Object.values(ordersByCustomer).filter(count => (count as number) > 1).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalCustomers,
        totalRevenue,
        averageOrders: parseFloat(averageOrders.toFixed(1)),
        newCustomersThisMonth,
        repeatCustomers,
      },
    });
  } catch (error) {
    console.error('Customer stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}