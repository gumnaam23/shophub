import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { Types } from 'mongoose';
import { authOptions } from '../../../auth/[...nextauth]/route';

interface RouteParams {
     params: Promise<{ id: string }>; 
}

// GET /api/account/orders/[id] - Get single order
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid order ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const order = await Order.findOne({ _id: id, userId: session.user.id }).lean();

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        const timeline = [
            { status: 'pending', date: order.createdAt, description: 'Order placed successfully' },
            { status: 'processing', date: order.updatedAt, description: 'Order is being processed' },
            { status: 'shipped', date: order.trackingNumber ? order.updatedAt : null, description: 'Order has been shipped' },
            { status: 'delivered', date: order.orderStatus === 'delivered' ? order.updatedAt : null, description: 'Order delivered successfully' },
        ].filter(t => t.date);

        return NextResponse.json({
            success: true,
            order: {
                ...order,
                timeline,
            },
        });
    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PUT /api/account/orders/[id] - Cancel order
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { action } = await request.json();

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid order ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const order = await Order.findOne({ _id: id, userId: session.user.id });

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        if (action === 'cancel') {
            if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
                return NextResponse.json(
                    { success: false, error: 'Order cannot be cancelled at this stage' },
                    { status: 400 }
                );
            }

            order.orderStatus = 'cancelled';
            await order.save();

            return NextResponse.json({
                success: true,
                message: 'Order cancelled successfully',
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Order update error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}