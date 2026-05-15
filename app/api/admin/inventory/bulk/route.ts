import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { Types } from 'mongoose';
import { authOptions } from '../../../auth/[...nextauth]/route';

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

    const { productIds, stock } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product IDs required' },
        { status: 400 }
      );
    }

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid stock value' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Validate all product IDs
    const validIds = productIds.filter(id => Types.ObjectId.isValid(id));
    
    const result = await Product.updateMany(
      { _id: { $in: validIds } },
      { 
        $set: { 
          stock, 
          updatedAt: new Date(),
          ...(stock === 0 && { isNew: false })
        } 
      }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} products updated successfully`,
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to bulk update stock' },
      { status: 500 }
    );
  }
}