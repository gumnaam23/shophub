import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { Types } from 'mongoose';
import Coupon from '@/models/Coupon';
import { authOptions } from '../auth/[...nextauth]/route';

interface OrderItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface OrderSummary {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
}

interface OrderBody {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: 'card' | 'paypal';
    orderSummary: OrderSummary;
    couponCode?: string;
    couponId?: string;
}

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: OrderBody = await req.json();
        const { items, shippingAddress, paymentMethod, orderSummary, couponCode, couponId } = body;

        // Validate required fields
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        if (!shippingAddress || !paymentMethod || !orderSummary) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        // Verify stock availability
        for (const item of items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                }, { status: 400 });
            }
        }

        // Create order with discount
        const order = await Order.create({
            userId: session.user.id,
            items: items.map((item: OrderItem) => ({
                productId: new Types.ObjectId(item._id),
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),
            shippingAddress,
            paymentMethod,
            subtotal: orderSummary.subtotal,
            discount: orderSummary.discount,
            shipping: orderSummary.shipping,
            tax: orderSummary.tax,
            total: orderSummary.total,
            couponCode: couponCode || null,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            paymentStatus: 'paid',
            orderStatus: 'processing',
        });

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Update coupon usage count if provided
        if (couponId) {
            await Coupon.findByIdAndUpdate(couponId, {
                $inc: { usedCount: 1 }
            });
        }

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { userId: session.user.id },
            { $set: { items: [], updatedAt: new Date() } }
        );

        return NextResponse.json({
            success: true,
            order,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');
        const page = parseInt(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Order.countDocuments({ userId: session.user.id });

        return NextResponse.json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}