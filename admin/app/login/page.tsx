'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/home');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Credenciais inválidas.');
      }
    } catch {
      setError('Erro ao conectar. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`aside { display: none !important; } main { padding: 0 !important; }`}</style>

      {/* Decorativos */}
      <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Esquerda — branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontSize: 18, fontWeight: 800 }}>P</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px' }}>Payroll</span>
        </div>

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 20, padding: '4px 12px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ fontSize: 12, color: '#4ade80' }}>Sistema operacional</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16, background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Assistente de<br />investimentos<br />inteligente.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, maxWidth: 340 }}>
            Painel administrativo do Payroll — gerencie usuários, perfis de investidor e configurações do bot via WhatsApp.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          {[{ label: 'Perfis suportados', value: '3' }, { label: 'Perguntas suitability', value: '8' }, { label: 'Diretrizes', value: 'CVM' }].map((stat) => (
            <div key={stat.label}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Direita — formulário */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px' }}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 6 }}>Bem-vindo de volta</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Acesse o painel administrativo</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8, letterSpacing: '0.08em' }}>E-MAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoFocus
                style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Senha */}
            <div style={{ marginBottom: 20, position: 'relative' }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8, letterSpacing: '0.08em' }}>SENHA</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '13px 44px 13px 16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={(e) => e.target.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: 13, padding: 0 }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', fontSize: 13, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password || !email}
              style={{ width: '100%', padding: '13px', background: loading || !password || !email ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #fff 0%, #e5e5e5 100%)', color: loading || !password || !email ? 'rgba(255,255,255,0.2)' : '#000', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: loading || !password || !email ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '-0.2px' }}
            >
              {loading ? 'Entrando...' : 'Entrar no painel →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>acesso restrito</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
              🔐 Este painel é de uso exclusivo do administrador do Payroll. Tentativas de acesso não autorizado são registradas.
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.1)', marginTop: 28 }}>
            Payroll v1.0.0 · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
