import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { Types } from 'mongoose';
import { authOptions } from '../../auth/[...nextauth]/route';

interface RouteParams {
      params: Promise<{ id: string }>; 

}

// GET /api/orders/[id] - Get single order
export async function GET(
    req: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
        }

        await connectToDatabase();

        const order = await Order.findOne({ _id: id, userId: session.user.id }).lean();

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

// PUT /api/orders/[id] - Cancel order
export async function PUT(
    req: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
        }

        await connectToDatabase();

        const order = await Order.findOne({ _id: id, userId: session.user.id });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Only allow cancelling pending or processing orders
        if (body.action === 'cancel') {
            if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
                return NextResponse.json(
                    { error: 'Order cannot be cancelled at this stage' },
                    { status: 400 }
                );
            }

            order.orderStatus = 'cancelled';
            
            // Restore product stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity }
                });
            }
            
            await order.save();
            
            return NextResponse.json({
                success: true,
                message: 'Order cancelled successfully'
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Order update error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}