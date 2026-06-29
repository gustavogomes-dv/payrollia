import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas que não precisam de autenticação
const PUBLIC_PATHS = ['/', '/login', '/privacidade', '/termos', '/indicacao', '/og-image.png'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('payroll_admin_token')?.value;

  // Deixa passar rotas públicas e API
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/api')) {
    // Se já tem token e tenta acessar login → manda pro home
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  // Sem token → redireciona pro login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Com token → valida no backend
  try {
    const apiUrl = process.env.API_URL || 'https://payrollia-production.up.railway.app';
    const res = await fetch(`${apiUrl}/admin/verify`, {
      headers: { 'x-admin-token': token },
    });

    if (!res.ok) {
      // Token inválido → apaga cookie e manda pro login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('payroll_admin_token');
      return response;
    }
  } catch {
    // Backend offline → deixa passar pra não travar o painel
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};