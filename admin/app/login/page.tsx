'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/home';

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Esconde sidebar e ajusta padding do main */}
      <style>{`
        aside { display: none !important; }
        main { padding: 0 !important; }
      `}</style>

      {/* Glow de fundo */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Card central */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 32, height: 32, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontSize: 15, fontWeight: 800 }}>P</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}>Payroll</span>
        </div>

        {/* Título */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Acesso ao painel
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
            Insira suas credenciais para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Email */}
          <div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoFocus
              required
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {/* Senha */}
          <div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{
                  width: '100%', padding: '12px 42px 12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10, color: '#fff', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', fontSize: 13, color: '#f87171' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%', padding: '13px',
              background: canSubmit ? '#fff' : 'rgba(255,255,255,0.06)',
              color: canSubmit ? '#000' : 'rgba(255,255,255,0.2)',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s', letterSpacing: '-0.2px',
              marginTop: 4,
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Rodapé */}
        <div style={{ marginTop: 32, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={12} color='rgba(255,255,255,0.2)' style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
            Acesso restrito ao administrador do Payroll. Acessos não autorizados são registrados.
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.1)', marginTop: 24 }}>
          Payroll v1.0.0 · {new Date().getFullYear()}
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