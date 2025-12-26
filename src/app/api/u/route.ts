import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { suid, sale, failedsale, pubid } = body;

    if (!suid) {
      console.error('❌ Missing SUID in request');
      return NextResponse.json(
        { error: 'SUID is required' },
        { status: 400 }
      );
    }

    // Backend API URL
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
    const API_KEY = process.env.API_KEY || 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op';

    // Prepare update payload (backend handles timestamps automatically on its side)
    const updatePayload: any = { suid };
    
    if (sale !== undefined) {
      updatePayload.sale = sale;
    }
    
    if (failedsale !== undefined) {
      updatePayload.failedsale = failedsale;
    }

    if (pubid !== undefined) {
      updatePayload.pubid = pubid;
    }

    // Call backend to update session
    const response = await fetch(`${BACKEND_API_URL}/api/u`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(updatePayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Backend API Error:', {
        status: response.status,
        error: data.error || 'Failed to update session',
        data: data
      });
      return NextResponse.json(
        { error: data.error || 'Failed to update session' },
        { status: response.status }
      );
    }

    console.log('✅ Session updated successfully:', {
      suid,
      sale: sale !== undefined ? sale : 'unchanged',
      failedsale: failedsale !== undefined ? failedsale : 'unchanged',
      pubid: pubid !== undefined ? pubid : 'unchanged',
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Session Update Exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
