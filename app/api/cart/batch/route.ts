import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { Types } from 'mongoose';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ICartItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      cart = new Cart({ userId: session.user.id, items: [] });
    }

    const addedItems = [];

    for (const item of items) {
      // Verify product exists and has stock
      const product = await Product.findById(item.productId);
      if (!product) {
        continue;
      }

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem: ICartItem) => cartItem.productId.toString() === item.productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity || 1;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(item.productId),
          quantity: item.quantity || 1,
          addedAt: new Date(),
        });
      }
      
      addedItems.push(item.productId);
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json({
      success: true,
      message: `${addedItems.length} items added to cart`,
      addedCount: addedItems.length,
    });
  } catch (error) {
    console.error('Batch add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add items to cart' },
      { status: 500 }
    );
  }
}