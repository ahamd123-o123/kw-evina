import { NextRequest, NextResponse } from 'next/server';

/**
 * Track API Proxy - POST /api/track (proxies to /api/e on backend)
 * Tracks user events in pyxis-track backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call the actual pyxis-track backend
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op';
    const response = await fetch(`${backendUrl}/api/e`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[API] Event tracking failed:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to track event' },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Event error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
