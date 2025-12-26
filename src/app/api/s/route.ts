import { NextRequest, NextResponse } from 'next/server';

/**
 * Session API Proxy - POST /api/s (proxies to /api/s on backend)
 * Creates/updates user session in pyxis-track backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call the actual pyxis-track backend
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op';
    const response = await fetch(`${backendUrl}/api/s`, {
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Session error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
