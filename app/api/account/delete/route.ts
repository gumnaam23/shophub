import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Wishlist from '@/models/Wishlist';
import Address from '@/models/Address';
import Review from '@/models/Review';
import { authOptions } from '../../auth/[...nextauth]/route';

// DELETE /api/account/delete - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { confirm } = await request.json();

    if (confirm !== 'DELETE') {
      return NextResponse.json(
        { success: false, error: 'Please type DELETE to confirm' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userId = session.user.id;

    // Delete all user data
    await Promise.all([
      User.findByIdAndDelete(userId),
      Order.deleteMany({ userId }),
      Cart.deleteMany({ userId }),
      Wishlist.deleteMany({ userId }),
      Address.deleteMany({ userId }),
      Review.deleteMany({ userId }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}