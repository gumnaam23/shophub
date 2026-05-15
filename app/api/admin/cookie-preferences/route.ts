import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CookiePreference from '@/models/CookiePreference';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/admin/cookie-preferences - Get all cookie preferences (admin)
export async function GET(request: NextRequest) {
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

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [preferences, total] = await Promise.all([
      CookiePreference.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CookiePreference.countDocuments(),
    ]);

    // Get user emails for preferences with userId
    const preferencesWithUsers = await Promise.all(
      preferences.map(async (pref) => {
        if (pref.userId) {
          const user = await User.findById(pref.userId).lean();
          return {
            ...pref,
            userEmail: user?.email,
            userName: user?.name,
          };
        }
        return pref;
      })
    );

    // Calculate statistics
    const stats = {
      total: total,
      analyticsEnabled: await CookiePreference.countDocuments({ 'preferences.analytics': true }),
      functionalEnabled: await CookiePreference.countDocuments({ 'preferences.functional': true }),
      marketingEnabled: await CookiePreference.countDocuments({ 'preferences.marketing': true }),
    };

    return NextResponse.json({
      success: true,
      preferences: preferencesWithUsers,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch cookie preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}