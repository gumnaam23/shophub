import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import Product from '@/models/Product';
import { Types } from 'mongoose';
import { authOptions } from '../auth/[...nextauth]/route';

// Type definitions
interface WishlistItem {
  productId: Types.ObjectId;
  addedAt: Date;
}

interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  images: string[];
  slug: string;
  stock: number;
  isOnSale: boolean;
  comparePrice?: number;
}

interface PopulatedWishlistItem {
  productId: PopulatedProduct;
  addedAt: Date;
}

// GET /api/wishlist - Get user's wishlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    let wishlist = await Wishlist.findOne({ userId: session.user.id })
      .populate<{ items: PopulatedWishlistItem[] }>('items.productId');

    if (!wishlist) {
      wishlist = { items: [] };
    }

    const formattedItems = wishlist.items.map((item) => ({
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.images[0],
      slug: item.productId.slug,
      stock: item.productId.stock,
      isOnSale: item.productId.isOnSale,
      comparePrice: item.productId.comparePrice,
      addedAt: item.addedAt,
    }));

    return NextResponse.json({
      success: true,
      items: formattedItems,
      total: formattedItems.length,
    });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({ userId: session.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: session.user.id, items: [] });
    }

    // Check if already in wishlist
    const existingItem = wishlist.items.find(
      (item: WishlistItem) => item.productId.toString() === productId
    );

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    wishlist.items.push({
      productId: new Types.ObjectId(productId),
      addedAt: new Date(),
    });

    await wishlist.save();

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist',
      wishlistCount: wishlist.items.length,
    });
  } catch (error) {
    console.error('Wishlist add error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const wishlist = await Wishlist.findOne({ userId: session.user.id });

    if (!wishlist) {
      return NextResponse.json(
        { success: false, error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    const itemIndex = wishlist.items.findIndex(
      (item: WishlistItem) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not in wishlist' },
        { status: 404 }
      );
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist',
      wishlistCount: wishlist.items.length,
    });
  } catch (error) {
    console.error('Wishlist remove error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}