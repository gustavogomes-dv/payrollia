'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const C = {
  aubergine: '#2D2356', aubergineL: '#4A3B82', lime: '#C8F260',
  coral: '#FF8A65', bone: '#FAF8F4', bone2: '#F2EFE8',
  bone3: '#E8E4DA', bone4: '#D4CFC2', mute: '#6B6478', ink: '#14102A',
  success: '#16915C', warning: '#B45309', danger: '#DC2626',
};

// ─── Seção (cartão) ─────────────────────────────────────────────────────────
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bone3}`, background: C.bone }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{title}</p>
        {desc && <p style={{ fontSize: 12, color: C.mute, marginTop: 3 }}>{desc}</p>}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

// ─── Campo de texto ─────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, mono, suffix }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; mono?: boolean; suffix?: React.ReactNode;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{ display: 'block', fontSize: 12, color: C.mute, marginBottom: 6 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 8,
            border: `1px solid ${C.bone3}`, background: C.bone,
            fontSize: 13, color: C.ink, fontFamily: mono ? "'Geist Mono', monospace" : 'inherit',
            outline: 'none',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = C.aubergine; }}
          onBlur={e => { e.currentTarget.style.borderColor = C.bone3; }}
        />
        {suffix}
      </div>
    </label>
  );
}

// ─── Botão ──────────────────────────────────────────────────────────────────
function Botao({ children, onClick, variant = 'primary', disabled }: {
  children: React.ReactNode; onClick: () => void; variant?: 'primary' | 'danger' | 'ghost'; disabled?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: C.aubergine, color: C.lime, border: 'none' },
    danger:  { background: 'transparent', color: C.danger, border: `1px solid ${C.danger}40` },
    ghost:   { background: 'transparent', color: C.mute, border: `1px solid ${C.bone3}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '9px 18px', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit', opacity: disabled ? 0.5 : 1,
      transition: 'all 0.15s', ...styles[variant],
    }}>
      {children}
    </button>
  );
}

// ─── Mensagem inline (feedback) ───────────────────────────────────────────────
function Msg({ msg }: { msg: { type: 'ok' | 'err'; text: string } | null }) {
  if (!msg) return null;
  const cor = msg.type === 'ok' ? C.success : C.danger;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '8px 12px', borderRadius: 8, background: `${cor}0D`, border: `1px solid ${cor}33` }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: cor, flexShrink: 0 }} />
      <span style={{ fontSize: 12.5, color: cor }}>{msg.text}</span>
    </div>
  );
}

type Feedback = { type: 'ok' | 'err'; text: string } | null;

export default function ConfigPage() {
  // Trocar senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova]   = useState('');
  const [senhaConf, setSenhaConf]   = useState('');
  const [verSenha, setVerSenha]     = useState(false);
  const [msgSenha, setMsgSenha]     = useState<Feedback>(null);
  const [loadingSenha, setLoadingSenha] = useState(false);

  // Limite plano free
  const [limite, setLimite]         = useState('3');
  const [msgLimite, setMsgLimite]   = useState<Feedback>(null);
  const [loadingLimite, setLoadingLimite] = useState(false);

  // Danger zone — confirmações + loading
  const [confirmCache, setConfirmCache]   = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loadingCache, setLoadingCache]   = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [msgDanger, setMsgDanger]         = useState<Feedback>(null);

  // ── Carrega o limite atual do backend ao montar ─────────────────────────────
  async function carregarSettings() {
    try {
      const res = await fetch(`${API_URL}/admin/settings`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.free_question_limit !== undefined) {
        setLimite(String(data.free_question_limit));
      }
    } catch {
      /* mantém o valor padrão se falhar */
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { carregarSettings(); }, []);

  // ── Trocar senha ────────────────────────────────────────────────────────────
  async function trocarSenha() {
    setMsgSenha(null);
    if (senhaNova.length < 8) { setMsgSenha({ type: 'err', text: 'A nova senha precisa ter ao menos 8 caracteres.' }); return; }
    if (senhaNova !== senhaConf) { setMsgSenha({ type: 'err', text: 'A confirmação não bate com a nova senha.' }); return; }
    setLoadingSenha(true);
    try {
      const res = await fetch(`${API_URL}/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, senhaNova }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsgSenha({ type: 'err', text: data.error || 'Erro ao trocar a senha.' });
        return;
      }
      setSenhaAtual(''); setSenhaNova(''); setSenhaConf('');
      setMsgSenha({ type: 'ok', text: 'Senha atualizada! Você será redirecionado para o login...' });
      // A troca de senha encerra a sessão atual no backend → relogin
      setTimeout(() => { window.location.href = '/login'; }, 1800);
    } catch {
      setMsgSenha({ type: 'err', text: 'Erro de conexão.' });
    } finally {
      setLoadingSenha(false);
    }
  }

  // ── Salvar limite do plano free ─────────────────────────────────────────────
  async function salvarLimite() {
    setMsgLimite(null);
    const n = parseInt(limite);
    if (isNaN(n) || n < 0) { setMsgLimite({ type: 'err', text: 'Informe um número válido.' }); return; }
    setLoadingLimite(true);
    try {
      const res = await fetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ free_question_limit: n }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsgLimite({ type: 'err', text: data.error || 'Erro ao salvar.' });
        return;
      }
      setMsgLimite({ type: 'ok', text: `Limite salvo: ${data.free_question_limit ?? n} perguntas/mês.` });
    } catch {
      setMsgLimite({ type: 'err', text: 'Erro de conexão.' });
    } finally {
      setLoadingLimite(false);
    }
  }

  // ── Limpar cache (FLUSHALL) ─────────────────────────────────────────────────
  async function limparCache() {
    if (!confirmCache) { setConfirmCache(true); return; }
    setConfirmCache(false);
    setMsgDanger(null);
    setLoadingCache(true);
    try {
      const res = await fetch(`${API_URL}/admin/cache/flush`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsgDanger({ type: 'err', text: data.error || 'Erro ao limpar o cache.' });
        return;
      }
      setMsgDanger({ type: 'ok', text: 'Cache limpo (FLUSHALL). O bot recarrega tudo do banco.' });
    } catch {
      setMsgDanger({ type: 'err', text: 'Erro de conexão.' });
    } finally {
      setLoadingCache(false);
    }
  }

  // ── Encerrar todas as sessões ───────────────────────────────────────────────
  async function logoutSessoes() {
    if (!confirmLogout) { setConfirmLogout(true); return; }
    setConfirmLogout(false);
    setMsgDanger(null);
    setLoadingLogout(true);
    try {
      const res = await fetch(`${API_URL}/admin/sessions/revoke-all`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsgDanger({ type: 'err', text: data.error || 'Erro ao encerrar sessões.' });
        return;
      }
      setMsgDanger({ type: 'ok', text: 'Todas as sessões encerradas. Redirecionando para o login...' });
      // Você também foi deslogado → manda pro login
      setTimeout(() => { window.location.href = '/login'; }, 1800);
    } catch {
      setMsgDanger({ type: 'err', text: 'Erro de conexão.' });
    } finally {
      setLoadingLogout(false);
    }
  }

  const olho = (
    <button onClick={() => setVerSenha(v => !v)} aria-label={verSenha ? 'Ocultar' : 'Mostrar'} style={{ background: 'none', border: `1px solid ${C.bone3}`, borderRadius: 8, padding: '9px 11px', cursor: 'pointer', color: C.mute, display: 'flex' }}>
      {verSenha ? (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ) : (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  );

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 38, fontWeight: 400, color: C.aubergine, lineHeight: 1, marginBottom: 6 }}>Config.</h1>
          <p style={{ color: C.mute, fontSize: 13 }}>Conta, operação do bot e ações administrativas</p>
        </div>
      </div>

      {/* Conta — trocar senha */}
      <Section title="Conta do admin" desc="Altere a senha de acesso ao painel">
        <Field label="Senha atual" type={verSenha ? 'text' : 'password'} value={senhaAtual} onChange={setSenhaAtual} placeholder="••••••••" suffix={olho} />
        <Field label="Nova senha" type={verSenha ? 'text' : 'password'} value={senhaNova} onChange={setSenhaNova} placeholder="mínimo 8 caracteres" />
        <Field label="Confirmar nova senha" type={verSenha ? 'text' : 'password'} value={senhaConf} onChange={setSenhaConf} placeholder="repita a nova senha" />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Botao onClick={trocarSenha} disabled={loadingSenha}>{loadingSenha ? 'Salvando...' : 'Trocar senha'}</Botao>
        </div>
        <Msg msg={msgSenha} />
      </Section>

      {/* Operação — limite plano free */}
      <Section title="Plano gratuito" desc="Quantas perguntas um usuário free pode fazer por mês">
        <Field label="Limite de perguntas (free)" type="number" value={limite} onChange={setLimite} mono suffix={<span style={{ fontSize: 12, color: C.mute, whiteSpace: 'nowrap' }}>/ mês</span>} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Botao onClick={salvarLimite} disabled={loadingLimite}>{loadingLimite ? 'Salvando...' : 'Salvar limite'}</Botao>
        </div>
        <Msg msg={msgLimite} />
      </Section>

      {/* Danger zone */}
      <div style={{ border: `1px solid ${C.danger}33`, borderRadius: 12, padding: '16px 20px', background: `${C.danger}08`, marginTop: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.danger, marginBottom: 4 }}>Zona de perigo</p>
        <p style={{ fontSize: 12.5, color: C.mute, lineHeight: 1.6, marginBottom: 16 }}>
          Ações imediatas que afetam o sistema. Clique uma vez para confirmar.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: `1px solid ${C.bone3}` }}>
          <div>
            <p style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>Limpar cache (Redis)</p>
            <p style={{ fontSize: 12, color: C.mute }}>Executa FLUSHALL. O bot recarrega tudo do banco.</p>
          </div>
          <Botao onClick={limparCache} variant="danger" disabled={loadingCache}>{loadingCache ? 'Limpando...' : confirmCache ? 'Confirmar?' : 'Limpar'}</Botao>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: `1px solid ${C.bone3}` }}>
          <div>
            <p style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>Encerrar todas as sessões</p>
            <p style={{ fontSize: 12, color: C.mute }}>Faz logout de todos os admins (você incluso).</p>
          </div>
          <Botao onClick={logoutSessoes} variant="danger" disabled={loadingLogout}>{loadingLogout ? 'Encerrando...' : confirmLogout ? 'Confirmar?' : 'Encerrar'}</Botao>
        </div>

        <Msg msg={msgDanger} />
      </div>

    </div>
  );
}