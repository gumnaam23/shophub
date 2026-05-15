import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Address from '@/models/Address';
import { Types } from 'mongoose';
import { authOptions } from '../../../auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
}

// Add this GET method to the same file
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
        { success: false, error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const address = await Address.findOne({ _id: id, userId: session.user.id }).lean();

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Address fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch address' },
      { status: 500 }
    );
  }
}

// PUT /api/account/addresses/[id] - Update address
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

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, addressLine1, addressLine2, city, state, zipCode, country, type, isDefault } = body;

    await connectToDatabase();

    // Check if address exists and belongs to user
    const existingAddress = await Address.findOne({ _id: id, userId: session.user.id });
    if (!existingAddress) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // Update address
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        type,
        isDefault: isDefault || false,
      },
      { new: true, runValidators: true }
    );

    // If this address is set as default, update others
    if (isDefault) {
      await Address.updateMany(
        { userId: session.user.id, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: 'Address updated successfully',
    });
  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE /api/account/addresses/[id] - Delete address
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

    const { id } = await params;

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

    const wasDefault = address.isDefault;

    await Address.findByIdAndDelete(id);

    // If deleted address was default, set another address as default
    if (wasDefault) {
      const anotherAddress = await Address.findOne({ userId: session.user.id });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Address delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}