import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { suid, sale, failedsale } = body;

    console.log('📤 Session Update Request:', { suid, sale, failedsale });

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

    console.log('🔧 Backend API URL:', BACKEND_API_URL);

    // Prepare update payload (backend handles timestamps automatically on its side)
    const updatePayload: any = { suid };
    
    if (sale !== undefined) {
      updatePayload.sale = sale;
    }
    
    if (failedsale !== undefined) {
      updatePayload.failedsale = failedsale;
    }

    console.log('📦 Update Payload:', updatePayload);

    // Call backend to update session
    const response = await fetch(`${BACKEND_API_URL}/api/session/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(updatePayload),
    });

    console.log('📥 Backend Response Status:', response.status);

    const data = await response.json();
    console.log('📥 Backend Response Data:', data);

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

    console.log('✅ Session Updated Successfully');
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
