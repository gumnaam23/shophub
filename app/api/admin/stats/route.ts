import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Review from '@/models/Review';
import { authOptions } from '../../auth/[...nextauth]/route';

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
    const user = await User.findById(session.user.id);
    if (user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Current month and last month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get orders for current month and last month
    const [currentMonthOrders, lastMonthOrders] = await Promise.all([
      Order.find({ createdAt: { $gte: currentMonthStart } }),
      Order.find({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
    ]);

    // Calculate revenue
    const currentRevenue = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const lastRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;

    // Calculate orders count
    const currentOrders = currentMonthOrders.length;
    const lastOrders = lastMonthOrders.length;
    const ordersChange = lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : 0;

    // Get total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const lastMonthCustomers = await User.countDocuments({
      createdAt: { $lte: lastMonthEnd },
      role: 'user',
    });
    const customersChange = lastMonthCustomers > 0 
      ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 
      : 0;

    // Get average rating
    const reviews = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const averageRating = reviews[0]?.avgRating || 0;
    const lastMonthReviews = await Review.find({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });
    const lastAvgRating = lastMonthReviews.length > 0
      ? lastMonthReviews.reduce((sum, r) => sum + r.rating, 0) / lastMonthReviews.length
      : 0;
    const ratingChange = lastAvgRating > 0 ? ((averageRating - lastAvgRating) / lastAvgRating) * 100 : 0;

    return NextResponse.json({
      totalRevenue: currentRevenue,
      totalOrders: currentOrders,
      totalCustomers,
      averageRating,
      revenueChange: parseFloat(revenueChange.toFixed(1)),
      ordersChange: parseFloat(ordersChange.toFixed(1)),
      customersChange: parseFloat(customersChange.toFixed(1)),
      ratingChange: parseFloat(ratingChange.toFixed(1)),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}