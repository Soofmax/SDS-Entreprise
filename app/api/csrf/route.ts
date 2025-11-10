import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  const token = crypto.randomBytes(16).toString('hex');
  const res = NextResponse.json({ csrfToken: token });
  res.headers.append(
    'Set-Cookie',
    `csrfToken=${token}; Path=/; Max-Age=1800; SameSite=Strict; Secure;`
  );
  return res;
}