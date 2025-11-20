import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Call ERPNext logout
    await fetch('https://erp.ihgind.com/api/method/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  }
}
