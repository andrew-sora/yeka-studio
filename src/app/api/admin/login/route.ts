import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const DEFAULT_ADMIN_PIN = process.env.ADMIN_PIN || '1234';

function generateAuthToken(pin: string): string {
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return Buffer.from(`yeka-admin-authenticated-${pin}-${timestamp}`).toString('base64');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ success: false, error: 'PIN tidak valid.' }, { status: 400 });
    }

    if (pin.trim() !== DEFAULT_ADMIN_PIN) {
      return NextResponse.json({ success: false, error: 'PIN yang Anda masukkan salah.' }, { status: 401 });
    }

    const token = generateAuthToken(DEFAULT_ADMIN_PIN);
    const response = NextResponse.json({ success: true, message: 'Berhasil masuk ke dashboard owner.' });

    response.cookies.set('yeka_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
