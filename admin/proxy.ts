import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('payroll_admin_token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiAuth = request.nextUrl.pathname === '/api/auth';

  if (isApiAuth) return NextResponse.next();

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && !isLoginPage) {
    // Valida token no backend
    try {
      const res = await fetch('http://localhost:3000/admin/verify', {
        headers: { 'x-admin-token': token },
      });
      if (!res.ok) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('payroll_admin_token');
        return response;
      }
    } catch {
      // Se backend offline, deixa passar (evita loop)
    }
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};