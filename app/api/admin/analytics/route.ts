import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
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
    const period = searchParams.get('period') || 'monthly';

    // Get date ranges
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    if (period === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60);
    } else if (period === 'weekly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
      previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 180);
    } else {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      previousStartDate = new Date(now.getFullYear() - 2, now.getMonth(), 1);
    }

    // Revenue data
    const currentRevenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: period === 'daily' ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } :
                period === 'weekly' ? { $isoWeek: '$createdAt' } :
                { $month: '$createdAt' },
          amount: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const previousRevenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: previousStartDate, $lt: startDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: period === 'daily' ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } :
                period === 'weekly' ? { $isoWeek: '$createdAt' } :
                { $month: '$createdAt' },
          amount: { $sum: '$total' }
        }
      }
    ]);

    const totalRevenue = currentRevenueData.reduce((sum, d) => sum + d.amount, 0);
    const previousRevenue = previousRevenueData.reduce((sum, d) => sum + d.amount, 0);
    const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Format chart data
    let chartData;
    if (period === 'daily') {
      chartData = currentRevenueData.map(d => ({
        date: d._id,
        amount: d.amount
      }));
    } else if (period === 'weekly') {
      chartData = currentRevenueData.map((d) => ({
        week: `Week ${d._id}`,
        amount: d.amount
      }));
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartData = currentRevenueData.map(d => ({
        month: months[(d._id as number) - 1],
        amount: d.amount
      }));
    }

    // Orders data
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: startDate } });
    const previousOrders = await Order.countDocuments({ 
      createdAt: { $gte: previousStartDate, $lt: startDate } 
    });
    const ordersChange = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const ordersByStatus = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Customers data
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const previousCustomers = await User.countDocuments({ 
      role: 'user',
      createdAt: { $lt: startDate }
    });
    const customersChange = previousCustomers > 0 ? ((totalCustomers - previousCustomers) / previousCustomers) * 100 : 0;

    const newCustomers = await User.countDocuments({ 
      role: 'user',
      createdAt: { $gte: startDate }
    });
    const returningCustomers = totalCustomers - newCustomers;

    // Top selling products
    const topSelling = await Order.aggregate([
      { $unwind: '$items' },
      { $group: {
        _id: '$items.name',
        sales: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    // Top rated products
    const topRated = await Product.find({ rating: { $gt: 0 } })
      .sort({ rating: -1 })
      .limit(5)
      .select('name rating reviews');

    // Low stock products
    const lowStock = await Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .select('name stock');

    // Traffic data (mock - would come from analytics service)
    const traffic = {
      views: 12500,
      uniqueVisitors: 3450,
      bounceRate: 42.5,
      averageSession: 3.2
    };

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        percentageChange: parseFloat(revenueChange.toFixed(1)),
        [period]: chartData
      },
      orders: {
        total: totalOrders,
        percentageChange: parseFloat(ordersChange.toFixed(1)),
        averageValue: averageOrderValue,
        byStatus: ordersByStatus.map(s => ({ status: s._id, count: s.count }))
      },
      customers: {
        total: totalCustomers,
        percentageChange: parseFloat(customersChange.toFixed(1)),
        newCustomers,
        returningCustomers
      },
      products: {
        topSelling: topSelling.map(p => ({ name: p._id, sales: p.sales, revenue: p.revenue })),
        topRated: topRated.map(p => ({ name: p.name, rating: p.rating, reviews: p.reviews })),
        lowStock: lowStock.map(p => ({ name: p.name, stock: p.stock }))
      },
      traffic
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}