import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Wishlist, { IWishlistItem } from '@/models/Wishlist';
import Product from '@/models/Product';
import { Types } from 'mongoose';
import { authOptions } from '../../auth/[...nextauth]/route';

interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category: string;
    rating: number;
    reviews: number;
    stock: number;
  };
  addedAt: string;
}

// GET /api/account/wishlist - Get user's wishlist
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
      .populate('items.productId');

    if (!wishlist) {
      wishlist = { items: [] };
    }

    const formattedItems = wishlist.items.map((item: WishlistItem) => ({
      productId: item.productId._id,
      name: item.productId.name,
      slug: item.productId.slug,
      price: item.productId.price,
      comparePrice: item.productId.comparePrice,
      image: item.productId.images[0],
      category: item.productId.category,
      rating: item.productId.rating,
      reviews: item.productId.reviews,
      inStock: item.productId.stock > 0,
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

// POST /api/account/wishlist - Add item to wishlist
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
      (item: IWishlistItem) => item.productId.toString() === productId
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

    // Get updated count
    const updatedWishlist = await Wishlist.findOne({ userId: session.user.id });
    const wishlistCount = updatedWishlist?.items.length || 0;

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist',
      wishlistCount,
    });
  } catch (error) {
    console.error('Wishlist add error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/account/wishlist - Remove item from wishlist
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

    const initialLength = wishlist.items.length;
    
    wishlist.items = wishlist.items.filter(
      (item: IWishlistItem) => item.productId.toString() !== productId
    );

    if (wishlist.items.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

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