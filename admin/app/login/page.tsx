'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ─── Logo oficial ─────────────────────────────────────────────────────────────
function PayrollLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#372A66" />
      <rect x="12" y="14" width="24" height="11" rx="5.5" fill="#C8F260" />
      <rect x="12" y="27" width="40" height="11" rx="5.5" fill="#C8F260" />
      <rect x="12" y="40" width="32" height="11" rx="5.5" fill="#C8F260" />
    </svg>
  );
}

function LoginForm() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const redirect      = searchParams.get('redirect') || '/home';

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
        router.push(redirect);
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

  const canSubmit = email && password && !loading;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#FAF8F4',
    fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#14102A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Esconde sidebar */}
      <style>{`
        aside { display: none !important; }
        main  { padding: 0 !important; }
      `}</style>

      {/* Glow sutil Aubergine */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,35,86,0.6) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Detalhe geométrico canto */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 280, height: 280,
        borderTop: '1px solid rgba(200,242,96,0.06)',
        borderLeft: '1px solid rgba(200,242,96,0.06)',
        borderRadius: '140px 0 0 0',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* Logo + nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <PayrollLogo size={40} />
          <span style={{
            fontSize: 20, fontWeight: 600,
            letterSpacing: '-0.4px', color: '#FAF8F4',
          }}>
            payroll
          </span>
        </div>

        {/* Título editorial */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 34,
            fontWeight: 400,
            color: '#FAF8F4',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            Acesso ao painel.
          </h1>
          <p style={{ fontSize: 13, color: '#6B6478' }}>
            Insira suas credenciais para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div>
            <label style={{
              fontSize: 10, color: 'rgba(250,248,244,0.3)',
              display: 'block', marginBottom: 7,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: "'Geist Mono', monospace",
            }}>
              E-mail
            </label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoFocus required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#C8F260'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{
              fontSize: 10, color: 'rgba(250,248,244,0.3)',
              display: 'block', marginBottom: 7,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: "'Geist Mono', monospace",
            }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{
                  ...inputStyle,
                  paddingRight: 42,
                  borderColor: error ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)',
                }}
                onFocus={e => e.target.style.borderColor = '#C8F260'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(250,248,244,0.25)', display: 'flex', alignItems: 'center',
                }}
              >
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  {showPassword
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(248,113,113,0.06)',
              border: '1px solid rgba(248,113,113,0.18)',
              fontSize: 13, color: '#F87171',
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%', padding: '13px',
              background: canSubmit ? '#C8F260' : 'rgba(255,255,255,0.05)',
              color: canSubmit ? '#14102A' : 'rgba(255,255,255,0.2)',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              letterSpacing: '-0.2px',
              marginTop: 4,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>

        {/* Rodapé */}
        <div style={{
          marginTop: 28,
          padding: '12px 14px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', lineHeight: 1.5 }}>
            Acesso restrito ao administrador do Payroll. Acessos não autorizados são registrados.
          </p>
        </div>

        <p style={{
          textAlign: 'center', fontSize: 10,
          fontFamily: "'Geist Mono', monospace",
          color: 'rgba(255,255,255,0.1)',
          marginTop: 20, letterSpacing: '0.05em',
        }}>
          PAYROLL v1.0.0 · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}