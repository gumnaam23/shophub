import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Address from '@/models/Address';
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

    const admin = await User.findById(session.user.id);
    if (admin?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get all users with role 'user'
    const users = await User.find({ role: 'user' }).lean();


    // Get orders and addresses for each user
    const customersWithData = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ userId: user._id }).lean();
        const addresses = await Address.find({ userId: user._id }).lean();

        const ordersCount = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        const lastOrder = orders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone || '',
          createdAt: user.createdAt,
          ordersCount,
          totalSpent,
          addresses: addresses.length,
          lastOrderDate: lastOrder?.createdAt,
          status: user.isActive ? 'active' : 'inactive',
        };
      })
    );

    // Sort by orders count descending by default
    customersWithData.sort((a, b) => b.ordersCount - a.ordersCount);

    return NextResponse.json({
      success: true,
      customers: customersWithData,
    });
  } catch (error) {
    console.error('Fetch customers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}