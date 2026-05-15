import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
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

    const products = await Product.find()
      .sort({ name: 1 })
      .lean();

    const inventory = products.map(product => ({
      _id: product._id,
      name: product.name,
      sku: product.slug?.toUpperCase() || product._id.toString().slice(-8),
      images: product.images,
      price: product.price,
      stock: product.stock,
      lowStockThreshold: 10,
      status: product.stock === 0 ? 'out_of_stock' : product.stock < 10 ? 'low_stock' : 'in_stock',
      category: product.category,
      lastUpdated: product.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const { productId, stock } = await request.json();

    await connectToDatabase();

    const product = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      product,
      message: 'Stock updated',
    });
  } catch (error) {
    console.error('Update stock error:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}