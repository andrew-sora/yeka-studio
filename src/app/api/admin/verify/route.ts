import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const DEFAULT_ADMIN_PIN = process.env.ADMIN_PIN || '1234';

function generateAuthToken(pin: string): string {
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return Buffer.from(`yeka-admin-authenticated-${pin}-${timestamp}`).toString('base64');
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const sessionCookie = cookieHeader
      ?.split(';')
      .find((c) => c.trim().startsWith('yeka_admin_session='))
      ?.split('=')[1];

    const expectedToken = generateAuthToken(DEFAULT_ADMIN_PIN);

    if (sessionCookie && sessionCookie === expectedToken) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
