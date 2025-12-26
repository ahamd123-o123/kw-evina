import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { suid, msisdn, gclid, wbraid, gbraid, service_id, country_code, affiliate_name } = body;

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

    // Call backend to record sale
    const response = await fetch(`${BACKEND_API_URL}/api/c`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(salePayload),
    });

    const data = await response.json();

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

    console.log('✅ Sale recorded successfully:', {
      suid,
      maskedMsisdn: msisdn.substring(0, 3) + '***',
      gclid: gclid || 'none',
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Sale API Exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
