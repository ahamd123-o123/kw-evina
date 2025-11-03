import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber, authCode, trxId } = await request.json();

    if (!mobileNumber || !authCode || !trxId) {
      return NextResponse.json(
        { error: 'Mobile number, auth code, and transaction ID are required' },
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

    // Log request details
    console.log('📤 IDEX Subscribe Request:', {
      url: `${IDEX_API_URL}/rest/s1/gateway/subscribe`,
      username: IDEX_USERNAME,
      channelId: IDEX_CHANNEL_ID,
      mobileNumber: mobileNumber,
      authCode: authCode,
      trxId: trxId
    });

    // Call IDEX Subscribe API
    const response = await fetch(`${IDEX_API_URL}/rest/s1/gateway/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        channelId: IDEX_CHANNEL_ID,
        mobileNumber: mobileNumber,
        authCode: authCode,
        trxId: trxId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log detailed error
      console.error('❌ IDEX Subscribe API Error:', {
        status: response.status,
        statusText: response.statusText,
        responseData: data,
        requestUrl: `${IDEX_API_URL}/rest/s1/gateway/subscribe`,
        channelId: IDEX_CHANNEL_ID,
        mobileNumber: mobileNumber,
        authCode: authCode,
        trxId: trxId
      });
      
      // Return IDEX error response with specific error codes
      return NextResponse.json(
        {
          error: data.errors || 'Subscription failed',
          errorCode: data.errorCode || response.status,
        },
        { status: response.status }
      );
    }

    // Log success
    console.log('✅ IDEX Subscribe Success:', {
      trxId: data.trxId,
      responseData: data
    });

    // Success - return trxId
    return NextResponse.json({
      trxId: data.trxId,
      success: true,
    });

  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
