import { NextRequest, NextResponse } from 'next/server';

// URL do backend (server-side, NUNCA exposta ao navegador)
const API_URL = process.env.API_URL || 'https://payrollia-production.up.railway.app';

async function handler(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  // Lê o token do cookie httpOnly — só o servidor consegue
  const token = request.cookies.get('payroll_admin_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // Monta a URL de destino: /api/proxy/admin/clientes → {API_URL}/admin/clientes
  const { path } = await ctx.params;
  const targetPath = (path || []).join('/');
  const search = request.nextUrl.search || '';
  const url = `${API_URL}/${targetPath}${search}`;

  // Encaminha o token pro backend
  const headers: Record<string, string> = { 'x-admin-token': token };

  const method = request.method;
  let body: string | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    const text = await request.text();
    if (text) {
      body = text;
      headers['Content-Type'] = request.headers.get('content-type') || 'application/json';
    }
  }

  try {
    const res = await fetch(url, { method, headers, body, cache: 'no-store' });
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': contentType || 'text/plain' },
    });
  } catch {
    return NextResponse.json({ error: 'Erro ao conectar com o servidor' }, { status: 502 });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};