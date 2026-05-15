import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/account/settings - Get user settings
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

    const user = await User.findOne({ _id: session.user.id }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return settings
    const settings = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      newsletter: user.newsletter ?? true,
      emailNotifications: user.emailNotifications ?? true,
      smsNotifications: user.smsNotifications ?? false,
      language: user.language || 'en',
      currency: user.currency || 'USD',
      theme: user.theme || 'light',
      twoFactorAuth: user.twoFactorAuth ?? false,
    };

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/account/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const body = await request.json();
    const {
      name,
      phone,
      bio,
      newsletter,
      emailNotifications,
      smsNotifications,
      language,
      currency,
      theme,
      twoFactorAuth,
    } = body;

    await connectToDatabase();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name,
        phone,
        bio,
        newsletter,
        emailNotifications,
        smsNotifications,
        language,
        currency,
        theme,
        twoFactorAuth,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        newsletter: updatedUser.newsletter,
        emailNotifications: updatedUser.emailNotifications,
        smsNotifications: updatedUser.smsNotifications,
        language: updatedUser.language,
        currency: updatedUser.currency,
        theme: updatedUser.theme,
        twoFactorAuth: updatedUser.twoFactorAuth,
      },
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}