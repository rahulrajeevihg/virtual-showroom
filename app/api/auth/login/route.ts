import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with ERPNext
    const response = await fetch('https://erp.ihgind.com/api/method/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usr: username,
        pwd: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Extract user information
    const user = {
      full_name: data.full_name || username,
      email: data.message || username,
      username: username,
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
