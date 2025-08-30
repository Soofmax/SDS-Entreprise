import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin');
    
    // Protéger les routes admin
    if (isAdminRoute || isApiAdminRoute) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      
      if (token.role !== 'ADMIN' && token.role !== 'EDITOR') {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
        const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin');
        
        // Permettre l'accès aux routes publiques
        if (!isAdminRoute && !isApiAdminRoute) {
          return true;
        }
        
        // Vérifier l'authentification pour les routes admin
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};

