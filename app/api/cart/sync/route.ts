import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { Types } from 'mongoose';
import { authOptions } from '../../auth/[...nextauth]/route';

interface CartItemFrontend {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: number;
  isOnSale?: boolean;
  comparePrice?: number;
}

interface SyncBody {
  items: CartItemFrontend[];
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SyncBody = await req.json();
    const { items } = body;

    await connectToDatabase();

    // Format items for database
    const dbItems = items.map((item: CartItemFrontend) => ({
      productId: new Types.ObjectId(item._id),
      quantity: item.quantity,
      addedAt: new Date()
    }));

    // Find or create cart
    let cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      cart = new Cart({ 
        userId: session.user.id, 
        items: dbItems,
        updatedAt: new Date()
      });
    } else {
      cart.items = dbItems;
      cart.updatedAt = new Date();
    }

    await cart.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}