import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Address from '@/models/Address';
import { Types } from 'mongoose';
import { authOptions } from '../../../../auth/[...nextauth]/route';

// ✅ Fix: params ab Promise mein wrapped hai
interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/account/addresses/[id]/default - Set address as default
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

    const { id } = await params; // ✅ Already await kar rahe ho, sahi hai

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if address exists and belongs to user
    const address = await Address.findOne({ _id: id, userId: session.user.id });
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // Remove default from all addresses
    await Address.updateMany(
      { userId: session.user.id },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
    });
  } catch (error) {
    console.error('Set default address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}