import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CookiePreference from '@/models/CookiePreference';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { preferences } = body;

    // Get session ID from cookies or generate one
    const sessionId = request.cookies.get('session_id')?.value || 
      `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await connectToDatabase();

    // Save or update cookie preferences
    const cookiePreference = await CookiePreference.findOneAndUpdate(
      { sessionId },
      {
        userId: session?.user?.id,
        sessionId,
        preferences: {
          essential: true, // Essential always true
          analytics: preferences?.analytics ?? true,
          functional: preferences?.functional ?? true,
          marketing: preferences?.marketing ?? false,
        },
        ipAddress,
        userAgent,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Set cookie for session
    const response = NextResponse.json({
      success: true,
      message: 'Cookie preferences saved successfully',
      preferences: cookiePreference.preferences,
    });

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    // Also set client-side cookies for analytics
    if (preferences?.analytics) {
      response.cookies.set('analytics_enabled', 'true', { maxAge: 60 * 60 * 24 * 365 });
    } else {
      response.cookies.delete('analytics_enabled');
    }

    if (preferences?.marketing) {
      response.cookies.set('marketing_enabled', 'true', { maxAge: 60 * 60 * 24 * 365 });
    } else {
      response.cookies.delete('marketing_enabled');
    }

    return response;
  } catch (error) {
    console.error('Save cookie preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({
        success: true,
        preferences: {
          essential: true,
          analytics: true,
          functional: true,
          marketing: false,
        },
      });
    }

    await connectToDatabase();

    const cookiePreference = await CookiePreference.findOne({ sessionId });

    if (!cookiePreference) {
      return NextResponse.json({
        success: true,
        preferences: {
          essential: true,
          analytics: true,
          functional: true,
          marketing: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      preferences: cookiePreference.preferences,
    });
  } catch (error) {
    console.error('Get cookie preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
}