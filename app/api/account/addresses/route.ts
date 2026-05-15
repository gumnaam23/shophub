import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Address from '@/models/Address';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/account/addresses - Get all addresses for user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const addresses = await Address.find({ userId: session.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      addresses,
      total: addresses.length,
    });
  } catch (error) {
    console.error('Addresses fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST /api/account/addresses - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, addressLine1, addressLine2, city, state, zipCode, country, type, isDefault } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !addressLine1 || !city || !state || !zipCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // If this is the first address, make it default
    const addressCount = await Address.countDocuments({ userId: session.user.id });
    const shouldBeDefault = addressCount === 0 ? true : isDefault;

    const address = await Address.create({
      userId: session.user.id,
      fullName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country: country || 'US',
      type: type || 'home',
      isDefault: shouldBeDefault,
    });

    return NextResponse.json({
      success: true,
      address,
      message: 'Address added successfully',
    });
  } catch (error) {
    console.error('Address create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create address' },
      { status: 500 }
    );
  }
}