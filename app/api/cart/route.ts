import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { Types } from 'mongoose';
import { authOptions } from '../auth/[...nextauth]/route';

interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

interface IProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  images: string[];
  slug: string;
  stock: number;
  isOnSale?: boolean;
  comparePrice?: number;
}

interface ICartItemPopulated {
  productId: IProduct;
  quantity: number;
  addedAt: Date;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] });
    }

    await connectToDatabase();
    
    let cart = await Cart.findOne({ userId: session.user.id }).populate('items.productId');
    
    if (!cart) {
      cart = { items: [] };
    }
    
    const formattedItems = cart.items.map((item: ICartItemPopulated) => ({
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.images[0],
      slug: item.productId.slug,
      stock: item.productId.stock,
      isOnSale: item.productId.isOnSale,
      comparePrice: item.productId.comparePrice,
    }));
    
    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid productId or quantity' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Verify product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }
    
    let cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      cart = new Cart({ userId: session.user.id, items: [] });
    }
    
    const itemIndex = cart.items.findIndex(
      (item: ICartItem) => item.productId.toString() === productId
    );
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ 
        productId: new Types.ObjectId(productId), 
        quantity,
        addedAt: new Date()
      });
    }
    
    cart.updatedAt = new Date();
    await cart.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
        (item: ICartItem) => item.productId.toString() !== productId
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