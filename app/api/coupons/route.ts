import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

interface ApplyCouponBody {
  code: string;
  subtotal: number;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body: ApplyCouponBody = await req.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!subtotal || subtotal <= 0) {
      return NextResponse.json(
        { error: 'Invalid subtotal' },
        { status: 400 }
      );
    }

    // Find coupon in database
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() }
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid or expired coupon code' },
        { status: 400 }
      );
    }

    // Check minimum purchase requirement
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return NextResponse.json(
        { error: `Minimum purchase of $${coupon.minPurchase} required` },
        { status: 400 }
      );
    }

    // Check maximum discount limit
    let discountAmount = 0;

    if (coupon.type === 'percentage') {
      discountAmount = (coupon.value / 100) * subtotal;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      // Fixed discount
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return NextResponse.json({
      success: true,
      discount: discountAmount,
      couponCode: coupon.code,
      couponId: coupon._id,
      message: `Coupon applied successfully! ${coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`}`
    });

  } catch (error) {
    console.error('Apply coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}

// GET all available coupons (for admin or display)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const isActive = searchParams.get('isActive') === 'true';

    const query: {
      isActive?: boolean;
      validFrom?: { $lte: Date };
      validTo?: { $gte: Date };
    } = {};

    if (isActive) {
      query.isActive = true;
      query.validFrom = { $lte: new Date() };
      query.validTo = { $gte: new Date() };
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Fetch coupons error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}