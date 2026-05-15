import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, description, price, comparePrice, images, category, tags, stock, isFeatured, isNew, isOnSale, status } = body;

    // Validate required fields
    if (!name || !description || !price || !images || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with similar name already exists' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      comparePrice: comparePrice || null,
      images,
      category,
      tags: tags || [],
      stock: stock || 0,
      isFeatured: isFeatured || false,
      isNew: isNew || false,
      isOnSale: isOnSale || false,
      status: status || 'draft',
      rating: 0,
      reviews: 0,
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}