import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber } = await request.json();

    if (!mobileNumber) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Get environment variables
    const IDEX_API_URL = process.env.IDEX_API_URL;
    const IDEX_USERNAME = process.env.IDEX_USERNAME;
    const IDEX_PASSWORD = process.env.IDEX_PASSWORD;
    const IDEX_CHANNEL_ID = process.env.IDEX_CHANNEL_ID;

    if (!IDEX_API_URL || !IDEX_USERNAME || !IDEX_PASSWORD || !IDEX_CHANNEL_ID) {
      console.error('Missing IDEX environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Basic Auth header
    const basicAuth = Buffer.from(`${IDEX_USERNAME}:${IDEX_PASSWORD}`).toString('base64');

    // Call IDEX API
    const response = await fetch(`${IDEX_API_URL}/rest/s1/gateway/subscribe/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        channelId: IDEX_CHANNEL_ID,
        mobileNumber: mobileNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log IDEX error for debugging
      console.error('❌ IDEX API Error:', {
        status: response.status,
        statusText: response.statusText,
        responseData: data,
        requestUrl: `${IDEX_API_URL}/rest/s1/gateway/subscribe/otp`,
        channelId: IDEX_CHANNEL_ID,
        mobileNumber: mobileNumber
      });
      
      // Extract error code from IDEX response
      // IDEX API returns: { errorCode: "8001022", errors: "..." } or { code: "8001022", ... }
      const errorCode = data.errorCode || data.code || String(response.status);
      
      // Return IDEX error response with specific error code
      return NextResponse.json(
        {
          error: data.errors || data.message || 'Failed to send OTP',
          errorCode: errorCode,
        },
        { status: response.status }
      );
    }

    // Return success with trxId
    console.log('📥 IDEX Send OTP Success:', {
      status: response.status,
      trxId: data.trxId
    });
    
    return NextResponse.json({
      trxId: data.trxId,
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
