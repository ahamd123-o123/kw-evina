import { NextRequest, NextResponse } from 'next/server';

/**
 * Session API Proxy - POST /api/session
 * Creates/updates user session in pyxis-track backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 🔍 LOG ALL DATA BEING SENT TO BACKEND (Server-side terminal log)
    console.log('\n========================================');
    console.log('📤 SESSION DATA BEING SENT TO BACKEND:');
    console.log('========================================');
    console.log(JSON.stringify(body, null, 2));
    console.log('========================================\n');

    // Call the actual pyxis-track backend
    const backendUrl = process.env.NEXT_PUBLIC_PYXIS_TRACK_URL || 'http://localhost:3000';
    const apiKey = process.env.NEXT_PUBLIC_PYXIS_API_KEY || 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op';
    const response = await fetch(`${backendUrl}/api/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[API] Session creation failed:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create session' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('[API] Session created:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Session error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
