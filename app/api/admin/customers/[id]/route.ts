import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Address from '@/models/Address';
import { Types } from 'mongoose';
import { authOptions } from '../../../auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
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

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const customer = await User.findOne({ _id: id, role: 'user' }).lean();

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    const orders = await Order.find({ userId: customer._id }).lean();
    const addresses = await Address.find({ userId: customer._id }).lean();

    const ordersCount = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const lastOrder = orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const customerWithData = {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      image: customer.image,
      phone: customer.phone || '',
      createdAt: customer.createdAt,
      ordersCount,
      totalSpent,
      addresses: addresses.length,
      lastOrderDate: lastOrder?.createdAt,
      status: customer.isActive ? 'active' : 'inactive',
      orders: orders.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.orderStatus,
        createdAt: order.createdAt,
      })),
      addresses: addresses.map(address => ({
        _id: address._id,
        fullName: address.fullName,
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.state,
        isDefault: address.isDefault,
      })),
    };

    return NextResponse.json({
      success: true,
      customer: customerWithData,
    });
  } catch (error) {
    console.error('Fetch customer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}