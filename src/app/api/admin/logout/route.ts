import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Berhasil keluar.' });
  response.cookies.set('yeka_admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
