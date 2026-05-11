import { NextRequest, NextResponse } from 'next/server';

// Rotas que não precisam de autenticação
const PUBLIC_ROUTES = ['/', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Deixa passar rotas públicas, API e arquivos estáticos
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Verifica o cookie de autenticação
  const token = request.cookies.get('payroll_admin_token')?.value;

  if (!token) {
    // Sem token → redireciona para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};