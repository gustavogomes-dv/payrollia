'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  aubergine: '#2D2356', aubergineL: '#4A3B82', lime: '#C8F260',
  coral: '#FF8A65', bone: '#FAF8F4', bone2: '#F2EFE8',
  bone3: '#E8E4DA', bone4: '#D4CFC2', mute: '#6B6478', ink: '#14102A',
  success: '#4ADE80', warning: '#FBBF24', danger: '#F87171',
};

const PERFIL_COR: Record<string, { text: string; bg: string; border: string }> = {
  conservador: { text: C.aubergine,  bg: 'rgba(45,35,86,0.08)',    border: 'rgba(45,35,86,0.18)' },
  moderado:    { text: '#C4612A',    bg: 'rgba(255,138,101,0.08)', border: 'rgba(255,138,101,0.2)' },
  arrojado:    { text: '#5A7A10',    bg: 'rgba(200,242,96,0.12)',  border: 'rgba(200,242,96,0.3)' },
};

const PLANO_COR: Record<string, string> = {
  free: C.mute, pro: C.success, business: C.aubergineL,
};

type Cliente = {
  id: string; name: string; phone: string; perfil: string;
  plano: string; plano_status: string; onboarding_complete: boolean;
  perguntas_usadas: number; created_at: string;
};

// ─── Modal de edição / criação ────────────────────────────────────────────────
function Modal({ cliente, onClose, onSave }: {
  cliente: Partial<Cliente> | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const isNew = !cliente?.id;
  const [form, setForm] = useState({
    name: cliente?.name || '',
    phone: cliente?.phone || '',
    perfil: cliente?.perfil || '',
    plano: cliente?.plano || 'free',
    onboarding_complete: cliente?.onboarding_complete ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSave() {
    setErro('');
    if (!form.phone) { setErro('Telefone é obrigatório.'); return; }
    setLoading(true);
    try {
      const url = isNew ? `${API_URL}/admin/clientes` : `${API_URL}/admin/clientes/${cliente!.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.erro || 'Erro ao salvar.'); return; }
      onSave();
    } catch { setErro('Erro de conexão.'); }
    finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: C.bone, border: `1px solid ${C.bone3}`,
    borderRadius: 8, color: C.ink, fontSize: 13,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontFamily: "'Geist Mono', monospace",
    color: C.mute, letterSpacing: '0.1em',
    textTransform: 'uppercase', display: 'block', marginBottom: 6,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(20,16,42,0.6)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: C.bone2, border: `1px solid ${C.bone3}`,
        borderRadius: 16, padding: 28, width: '100%', maxWidth: 480,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: C.ink, letterSpacing: '-0.3px' }}>
            {isNew ? 'Novo cliente' : 'Editar cliente'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.mute, fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Nome</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nome completo"
              onFocus={e => e.target.style.borderColor = C.aubergine}
              onBlur={e => e.target.style.borderColor = C.bone3} />
          </div>
          <div>
            <label style={labelStyle}>Telefone *</label>
            <input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="5535910148222"
              onFocus={e => e.target.style.borderColor = C.aubergine}
              onBlur={e => e.target.style.borderColor = C.bone3} />
          </div>
          <div>
            <label style={labelStyle}>Perfil</label>
            <select style={{ ...inputStyle, appearance: 'none' as const }}
              value={form.perfil} onChange={e => setForm(f => ({ ...f, perfil: e.target.value }))}>
              <option value="">— sem perfil —</option>
              <option value="conservador">Conservador</option>
              <option value="moderado">Moderado</option>
              <option value="arrojado">Arrojado</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Plano</label>
            <select style={{ ...inputStyle, appearance: 'none' as const }}
              value={form.plano} onChange={e => setForm(f => ({ ...f, plano: e.target.value }))}>
              <option value="free">Free</option>
              <option value="pro">Pro — R$12,90</option>
              <option value="business">Business — R$29,90</option>
            </select>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
          <input type="checkbox" checked={form.onboarding_complete}
            onChange={e => setForm(f => ({ ...f, onboarding_complete: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: C.aubergine }} />
          <span style={{ fontSize: 13, color: C.mute }}>Onboarding completo</span>
        </label>

        {erro && (
          <div style={{ padding: '9px 12px', background: 'rgba(248,113,113,0.06)', border: `1px solid rgba(248,113,113,0.2)`, borderRadius: 8, fontSize: 12, color: C.danger, marginBottom: 16 }}>
            {erro}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 8, border: `1px solid ${C.bone3}`, background: 'transparent', color: C.mute, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading} style={{
            padding: '9px 20px', borderRadius: 8, border: 'none',
            background: loading ? C.bone3 : C.aubergine,
            color: loading ? C.mute : C.lime,
            fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}>
            {loading ? 'Salvando...' : isNew ? 'Criar cliente' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroPerfil, setFiltroPerfil] = useState('');
  const [filtroPlano, setFiltroPlano] = useState('');
  const [modalCliente, setModalCliente] = useState<Partial<Cliente> | null | undefined>(undefined);
  const [deletandoId, setDeletandoId] = useState<string | null>(null);
  const [resetandoId, setResetandoId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/clientes`, { cache: 'no-store' });
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch { setClientes([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { carregar(); }, []);

  function mostrarFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  }

  async function deletar(id: string, nome: string) {
    if (!confirm(`Excluir ${nome || 'este usuário'}? Esta ação não pode ser desfeita.`)) return;
    setDeletandoId(id);
    try {
      const res = await fetch(`${API_URL}/admin/clientes/${id}`, { method: 'DELETE' });
      if (res.ok) { await carregar(); mostrarFeedback('Usuário excluído.'); }
    } finally { setDeletandoId(null); }
  }

  async function resetarPerguntas(id: string) {
    setResetandoId(id);
    try {
      await fetch(`${API_URL}/admin/clientes/${id}/reset-perguntas`, { method: 'PATCH' });
      await carregar();
      mostrarFeedback('Contador de perguntas zerado.');
    } finally { setResetandoId(null); }
  }

  async function alterarPlano(id: string, plano: string) {
    await fetch(`${API_URL}/admin/clientes/${id}/plano`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plano }),
    });
    await carregar();
    mostrarFeedback(`Plano alterado para ${plano}.`);
  }

  const filtrados = clientes.filter(c => {
    const termo = busca.toLowerCase();
    const matchBusca = !busca || (c.name?.toLowerCase().includes(termo) || c.phone?.includes(termo));
    const matchPerfil = !filtroPerfil || c.perfil === filtroPerfil;
    const matchPlano = !filtroPlano || (c.plano || 'free') === filtroPlano;
    return matchBusca && matchPerfil && matchPlano;
  });

  const total = clientes.length;
  const completos = clientes.filter(c => c.onboarding_complete).length;
  const pendentes = total - completos;

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', borderRadius: 8,
    border: `1px solid ${C.bone3}`, background: C.bone2,
    color: C.ink, fontSize: 12, cursor: 'pointer',
    fontFamily: 'inherit', outline: 'none',
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: `2px solid ${C.bone3}`, borderTop: `2px solid ${C.aubergine}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: C.mute, fontSize: 13 }}>Carregando...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Modal */}
      {modalCliente !== undefined && (
        <Modal
          cliente={modalCliente}
          onClose={() => setModalCliente(undefined)}
          onSave={async () => { await carregar(); setModalCliente(undefined); mostrarFeedback(modalCliente?.id ? 'Cliente atualizado.' : 'Cliente criado.'); }}
        />
      )}

      {/* Feedback toast */}
      {feedback && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 400,
          background: C.aubergine, color: C.lime,
          padding: '10px 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(45,35,86,0.3)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {feedback}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 38, fontWeight: 400, color: C.aubergine, lineHeight: 1, marginBottom: 6,
          }}>Clientes.</h1>
          <p style={{ color: C.mute, fontSize: 13 }}>Gerencie todos os usuários do Payroll</p>
        </div>
        <button onClick={() => setModalCliente({})} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', borderRadius: 10,
          background: C.aubergine, border: 'none',
          color: C.lime, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'opacity 0.15s',
        }}>
          + Novo cliente
        </button>
      </div>

      {/* Cards resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 20 }} className="grid-resumo">
        {[
          { label: 'Total', value: total, color: C.aubergine },
          { label: 'Completos', value: completos, color: C.success },
          { label: 'Pendentes', value: pendentes, color: C.warning },
          { label: 'Conservador', value: clientes.filter(c => c.perfil === 'conservador').length, color: C.aubergine },
          { label: 'Pagantes', value: clientes.filter(c => c.plano && c.plano !== 'free').length, color: C.coral },
        ].map(item => (
          <div key={item.label} style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontSize: 26, fontWeight: 600, color: item.color, letterSpacing: '-0.5px' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          style={{
            flex: 1, minWidth: 200, padding: '9px 14px',
            background: C.bone2, border: `1px solid ${C.bone3}`,
            borderRadius: 8, color: C.ink, fontSize: 13,
            fontFamily: 'inherit', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = C.aubergine}
          onBlur={e => e.target.style.borderColor = C.bone3}
        />
        <select value={filtroPerfil} onChange={e => setFiltroPerfil(e.target.value)} style={selectStyle}>
          <option value="">Todos os perfis</option>
          <option value="conservador">Conservador</option>
          <option value="moderado">Moderado</option>
          <option value="arrojado">Arrojado</option>
        </select>
        <select value={filtroPlano} onChange={e => setFiltroPlano(e.target.value)} style={selectStyle}>
          <option value="">Todos os planos</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
        <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: C.mute }}>
          {filtrados.length} de {total}
        </span>
      </div>

      {/* Tabela */}
      <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, overflow: 'hidden' }}>
        {/* Cabeçalho */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 120px',
          padding: '11px 20px', borderBottom: `1px solid ${C.bone3}`,
          fontSize: 10, fontFamily: "'Geist Mono', monospace",
          color: C.mute, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span>Nome</span><span>Telefone</span><span>Perfil</span>
          <span>Plano</span><span>Status</span><span>Pergs.</span><span>Ações</span>
        </div>

        {filtrados.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: C.mute, fontSize: 14 }}>Nenhum cliente encontrado.</p>
          </div>
        ) : (
          filtrados.map((c, i) => {
            const corPerfil = c.perfil ? PERFIL_COR[c.perfil] : null;
            const corPlano = PLANO_COR[c.plano || 'free'] || C.mute;
            return (
              <div key={c.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 120px',
                padding: '13px 20px', alignItems: 'center',
                borderBottom: i < filtrados.length - 1 ? `1px solid ${C.bone3}` : 'none',
                background: i % 2 === 0 ? C.bone2 : C.bone,
              }}>
                {/* Nome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: corPerfil ? corPerfil.bg : C.bone3,
                    border: `1px solid ${corPerfil ? corPerfil.border : C.bone4}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: corPerfil ? corPerfil.text : C.mute,
                  }}>
                    {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{c.name || '—'}</p>
                    <p style={{ fontSize: 10, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>
                      {new Date(c.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Telefone */}
                <span style={{ fontSize: 12, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>+{c.phone}</span>

                {/* Perfil */}
                <span>
                  {c.perfil && corPerfil ? (
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, color: corPerfil.text, background: corPerfil.bg, border: `1px solid ${corPerfil.border}`, textTransform: 'capitalize', fontWeight: 500 }}>
                      {c.perfil}
                    </span>
                  ) : <span style={{ color: C.bone4, fontSize: 13 }}>—</span>}
                </span>

                {/* Plano — clicável para alterar */}
                <div>
                  <select
                    value={c.plano || 'free'}
                    onChange={e => alterarPlano(c.id, e.target.value)}
                    style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 20,
                      color: corPlano, background: `${corPlano}10`,
                      border: `1px solid ${corPlano}30`,
                      cursor: 'pointer', fontFamily: 'inherit',
                      textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
                      outline: 'none', appearance: 'none',
                    }}
                  >
                    <option value="free">FREE</option>
                    <option value="pro">PRO</option>
                    <option value="business">BUSINESS</option>
                  </select>
                </div>

                {/* Status onboarding */}
                <span style={{
                  fontSize: 10, fontFamily: "'Geist Mono', monospace",
                  color: c.onboarding_complete ? '#166534' : '#92400E',
                  fontWeight: 500,
                }}>
                  {c.onboarding_complete ? 'completo' : 'pendente'}
                </span>

                {/* Perguntas usadas */}
                <span style={{ fontSize: 12, fontFamily: "'Geist Mono', monospace", color: C.mute }}>
                  {c.perguntas_usadas ?? 0}
                </span>

                {/* Ações */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {/* Editar */}
                  <button
                    onClick={() => setModalCliente(c)}
                    title="Editar"
                    style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(45,35,86,0.06)', border: `1px solid rgba(45,35,86,0.12)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(45,35,86,0.14)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(45,35,86,0.06)'; }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.aubergine} strokeWidth={2} strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>

                  {/* Reset perguntas */}
                  <button
                    onClick={() => resetarPerguntas(c.id)}
                    disabled={resetandoId === c.id}
                    title="Zerar perguntas"
                    style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(200,242,96,0.08)', border: `1px solid rgba(200,242,96,0.2)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: resetandoId === c.id ? 0.5 : 1, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,242,96,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,242,96,0.08)'; }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#5A7A10" strokeWidth={2} strokeLinecap="round">
                      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.17"/>
                    </svg>
                  </button>

                  {/* Excluir */}
                  <button
                    onClick={() => deletar(c.id, c.name)}
                    disabled={deletandoId === c.id}
                    title="Excluir"
                    style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(248,113,113,0.06)', border: `1px solid rgba(248,113,113,0.18)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deletandoId === c.id ? 0.5 : 1, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.14)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.danger} strokeWidth={2} strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid-resumo { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 768px) {
          .grid-resumo { grid-template-columns: repeat(2,1fr) !important; }
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color: ${C.bone4}; }
      `}</style>
    </div>
  );
}