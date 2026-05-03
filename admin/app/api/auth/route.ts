import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const res = await fetch('http://localhost:3000/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.error || 'Credenciais inválidas' }, { status: 401 });
    }

    const data = await res.json();

    const response = NextResponse.json({ ok: true, name: data.name });
    response.cookies.set('payroll_admin_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Erro ao conectar com o servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('payroll_admin_token')?.value;

  if (token) {
    await fetch('http://localhost:3000/admin/logout', {
      method: 'POST',
      headers: { 'x-admin-token': token },
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete('payroll_admin_token');
  return response;
}