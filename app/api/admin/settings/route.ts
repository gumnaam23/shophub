import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/admin/settings - Get store settings
export async function GET() {
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

    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }

    return NextResponse.json({
      success: true,
      settings: {
        general: settings.general,
        appearance: settings.appearance,
        email: {
          smtpHost: settings.email.smtpHost,
          smtpPort: settings.email.smtpPort,
          smtpUser: settings.email.smtpUser,
          smtpPass: settings.email.smtpPass,
          fromEmail: settings.email.fromEmail,
          fromName: settings.email.fromName,
        },
        payment: {
          stripeKey: settings.payment.stripeKey,
          stripeSecret: settings.payment.stripeSecret,
          paypalClientId: settings.payment.paypalClientId,
          paypalSecret: settings.payment.paypalSecret,
          currency: settings.payment.currency,
        },
        shipping: settings.shipping,
        notifications: settings.notifications,
      },
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update store settings
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { general, appearance, email, payment, shipping, notifications } = body;

    await connectToDatabase();

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }

    // Update settings
    if (general) settings.general = { ...settings.general, ...general };
    if (appearance) settings.appearance = { ...settings.appearance, ...appearance };
    if (email) settings.email = { ...settings.email, ...email };
    if (payment) settings.payment = { ...settings.payment, ...payment };
    if (shipping) settings.shipping = { ...settings.shipping, ...shipping };
    if (notifications) settings.notifications = { ...settings.notifications, ...notifications };

    await settings.save();

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings,
    });
  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}