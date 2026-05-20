import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Types } from 'mongoose';

export async function DELETE(req: NextRequest) {
  try {

        const session = await getServerSession(authOptions);
    
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, clearAll } = await req.json();
    
    await connectToDatabase();
    
    const cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      return NextResponse.json({ success: true });
    }
    
    if (clearAll || productId === 'all') {
      // Clear entire cart
      cart.items = [];
    } else if (productId) {
      // Remove specific item
      cart.items = cart.items.filter(
        (item: { productId: Types.ObjectId }) => item.productId.toString() !== productId
      );
    }
    
    cart.updatedAt = new Date();
    await cart.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart remove error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}