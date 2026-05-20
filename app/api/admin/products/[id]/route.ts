import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { Types } from 'mongoose';
import { authOptions } from '../../../auth/[...nextauth]/route';

interface RouteParams {
      params: Promise<{ id: string }>; 

}

// GET single product
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

        const admin = await User.findById(session.user.id);
        if (admin?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            );
        }

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT update product
// Add specifications support in PUT method
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

        const admin = await User.findById(session.user.id);
        if (admin?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Generate slug from name if name changed
        let slug = body.slug;
        if (body.name && (!body.slug || body.slug === '')) {
            slug = body.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name: body.name,
                slug,
                description: body.description,
                longDescription: body.longDescription,
                price: body.price,
                comparePrice: body.comparePrice,
                category: body.category,
                tags: body.tags,
                stock: body.stock,
                images: body.images,
                isFeatured: body.isFeatured,
                isNew: body.isNew,
                isOnSale: body.isOnSale,
                status: body.status,
                specifications: body.specifications,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            product,
            message: 'Product updated successfully',
        });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE product
export async function DELETE(
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

        const admin = await User.findById(session.user.id);
        if (admin?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            );
        }

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}