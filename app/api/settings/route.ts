import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Settings from '@/models/Settings';

// GET /api/settings - Get public store settings (no auth required)
export async function GET() {
  try {
    await connectToDatabase();

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }

    // Return only public settings (no sensitive data)
    return NextResponse.json({
      success: true,
      settings: {
        general: {
          storeName: settings.general.storeName,
          currency: settings.general.currency,
        },
        shipping: {
          freeShippingThreshold: settings.shipping.freeShippingThreshold,
          domesticRate: settings.shipping.domesticRate,
          internationalRate: settings.shipping.internationalRate,
          estimatedDays: settings.shipping.estimatedDays,
        },
        tax: {
          rate: 10, // Can be stored in settings
          enabled: true,
        },
      },
    });
  } catch (error) {
    console.error('Fetch public settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}