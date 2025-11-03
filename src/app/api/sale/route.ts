import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { suid, msisdn, gclid, wbraid, gbraid, service_id, country_code, affiliate_name } = body;

    console.log('📤 Sale Recording Request:', body);

    if (!suid || !msisdn) {
      console.error('❌ Missing required fields (suid, msisdn)');
      return NextResponse.json(
        { error: 'SUID and MSISDN are required' },
        { status: 400 }
      );
    }

    // Backend API URL
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
    const API_KEY = process.env.API_KEY || 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op';

    console.log('🔧 Backend API URL:', BACKEND_API_URL);

    // Prepare sale payload
    const salePayload = {
      suid,
      msisdn,
      gclid,
      wbraid,
      gbraid,
      service_id,
      country_code,
      affiliate_name,
    };

    console.log('📦 Sale Payload:', salePayload);

    // Call backend to record sale
    const response = await fetch(`${BACKEND_API_URL}/api/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(salePayload),
    });

    console.log('📥 Backend Response Status:', response.status);

    const data = await response.json();
    console.log('📥 Backend Response Data:', data);

    if (!response.ok) {
      console.error('❌ Backend API Error:', {
        status: response.status,
        error: data.error || 'Failed to record sale',
        data: data
      });
      return NextResponse.json(
        { error: data.error || 'Failed to record sale' },
        { status: response.status }
      );
    }

    console.log('✅ Sale Recorded Successfully');
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error recording sale:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
