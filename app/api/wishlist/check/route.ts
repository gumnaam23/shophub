import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Wishlist, { IWishlistItem } from '@/models/Wishlist';
import { authOptions } from '../../auth/[...nextauth]/route';

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

    const wishlist = await Wishlist.findOne({ userId: session.user.id });

    const isInWishlist = wishlist?.items.some(
      (item: IWishlistItem) => item.productId.toString() === productId
    ) || false;

    return NextResponse.json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    console.error('Wishlist check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check wishlist' },
      { status: 500 }
    );
  }
}