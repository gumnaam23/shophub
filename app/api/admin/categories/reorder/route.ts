import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import User from '@/models/User';
import { authOptions } from '../../../auth/[...nextauth]/route';

interface ReorderCategory {
  _id: string;
  order: number;
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

    const { categories } = await request.json();

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, error: 'Invalid categories data' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Update order for each category
    const updates = categories.map((cat: ReorderCategory) =>
      Category.findByIdAndUpdate(cat._id, { order: cat.order })
    );

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: 'Categories reordered successfully',
    });
  } catch (error) {
    console.error('Reorder categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder categories' },
      { status: 500 }
    );
  }
}