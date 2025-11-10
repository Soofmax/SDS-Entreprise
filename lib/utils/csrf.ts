import type { NextRequest } from 'next/server';

export function parseCookiesFromHeader(header: string | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  const parts = header.split(';');
  for (const part of parts) {
    const [name, ...rest] = part.trim().split('=');
    if (!name) continue;
    result[name] = decodeURIComponent(rest.join('=') || '');
  }
  return result;
}

export function getCookie(request: NextRequest, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookiesFromHeader(cookieHeader);
  return cookies[name];
}

export function verifyCsrf(request: NextRequest): boolean {
  const headerToken = request.headers.get('x-csrf-token') || '';
  const cookieToken = getCookie(request, 'csrfToken') || '';
  return Boolean(headerToken) && headerToken === cookieToken;
}