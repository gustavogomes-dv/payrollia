'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const C = {
  aubergine: '#2D2356', aubergineL: '#4A3B82', lime: '#C8F260',
  coral: '#FF8A65', bone: '#FAF8F4', bone2: '#F2EFE8',
  bone3: '#E8E4DA', bone4: '#D4CFC2', mute: '#6B6478', ink: '#14102A',
  success: '#4ADE80', warning: '#FBBF24', danger: '#F87171',
};

const PLANO_COR: Record<string, string> = { free: C.mute, pro: C.success, business: C.aubergineL };
const PLANO_PRECO: Record<string, number> = { free: 0, pro: 12.9, business: 29.9 };
const STATUS_COR: Record<string, string> = {
  active: C.success, cancelled: C.danger, payment_failed: C.warning, pending: C.mute,
};
const STATUS_LABEL: Record<string, string> = {
  active: 'Ativo', cancelled: 'Cancelado', payment_failed: 'Falhou', pending: 'Pendente',
};

type Cliente = {
  id: string; name: string; phone: string; plano: string;
  plano_status: string; plano_atualizado_em: string;
  perguntas_usadas: number; onboarding_complete: boolean; created_at: string;
};
type Cupom = {
  id: string; code?: string; discount: number; discountKind: string;
  status: string; maxRedeems: number; redeemsCount: number;
  notes?: string; createdAt: string;
};

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function MonoTag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, color, background: `${color}10`, border: `1px solid ${color}25`, fontFamily: "'Geist Mono', monospace", fontWeight: 600 }}>
      {children}
    </span>
  );
}

export default function BillingPage() {
  const [stats, setStats] = useState<any>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', discount: '', maxRedeems: '', notes: '' });
  const [criando, setCriando] = useState(false);
  const [erroForm, setErroForm] = useState('');
  const [sucessoForm, setSucessoForm] = useState('');
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  async function carregar() {
    const [s, c, cup] = await Promise.all([
      fetch(`${API_URL}/admin/stats`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/admin/clientes`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/admin/cupons`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]);
    setStats(s); setClientes(Array.isArray(c) ? c : []); setCupons(Array.isArray(cup) ? cup : []);
    setLoading(false);
  }
  useEffect(() => { carregar(); }, []);

  const porPlano = {
    free: clientes.filter(c => (c.plano || 'free') === 'free').length,
    pro: clientes.filter(c => c.plano === 'pro').length,
    business: clientes.filter(c => c.plano === 'business').length,
  };
  const mrr = parseFloat(stats.mrr || '0') || (porPlano.pro * 12.9 + porPlano.business * 29.9);
  const pagantes = porPlano.pro + porPlano.business;
  const taxaPagantes = clientes.length > 0 ? Math.round((pagantes / clientes.length) * 100) : 0;
  const arpuPagantes = pagantes > 0 ? (mrr / pagantes).toFixed(2) : '0.00';

  const planos = [
    { nome: 'Free',     preco: 'R$ 0',     cor: C.mute,       usuarios: porPlano.free,     receita: 0, features: ['3 perguntas/mês', 'Perfil de investidor', 'Acesso via WhatsApp'] },
    { nome: 'Pro',      preco: 'R$ 12,90', cor: C.success,    usuarios: porPlano.pro,      receita: porPlano.pro * 12.9, features: ['Perguntas ilimitadas', 'Cotações em tempo real', 'Suporte via WhatsApp'], destaque: true },
    { nome: 'Business', preco: 'R$ 29,90', cor: C.aubergineL, usuarios: porPlano.business, receita: porPlano.business * 29.9, features: ['Tudo do Pro', 'Alertas de mercado', 'Suporte prioritário'] },
  ];

  async function criarCupom() {
    setErroForm(''); setSucessoForm('');
    if (!form.code || !form.discount) { setErroForm('Código e desconto são obrigatórios.'); return; }
    const desc = parseFloat(form.discount);
    if (isNaN(desc) || desc <= 0 || desc > 100) { setErroForm('Desconto deve ser entre 1% e 100%.'); return; }
    setCriando(true);
    try {
      const res = await fetch(`${API_URL}/admin/cupons`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.code, discount: desc, maxRedeems: form.maxRedeems ? parseInt(form.maxRedeems) : -1, notes: form.notes }),
      });
      const data = await res.json();
      if (!res.ok) { setErroForm(data.erro || 'Erro ao criar cupom.'); }
      else { setSucessoForm(`Cupom ${form.code.toUpperCase()} criado!`); setForm({ code: '', discount: '', maxRedeems: '', notes: '' }); await carregar(); }
    } catch { setErroForm('Erro de conexão.'); }
    finally { setCriando(false); }
  }

  async function toggleCupom(id: string) {
    setToggleLoading(id);
    try { await fetch(`${API_URL}/admin/cupons/${id}/toggle`, { method: 'PATCH' }); await carregar(); }
    finally { setToggleLoading(null); }
  }

  async function deletarCupom(id: string) {
    if (!confirm(`Deletar o cupom ${id}?`)) return;
    setDeleteLoading(id);
    try { await fetch(`${API_URL}/admin/cupons/${id}`, { method: 'DELETE' }); await carregar(); }
    finally { setDeleteLoading(null); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
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

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: `2px solid ${C.bone3}`, borderTop: `2px solid ${C.aubergine}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: C.mute, fontSize: 13 }}>Carregando...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 38, fontWeight: 400, color: C.aubergine, lineHeight: 1, marginBottom: 6 }}>Billing.</h1>
          <p style={{ color: C.mute, fontSize: 13 }}>Receita, assinaturas e monitoramento via AbacatePay</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, padding: '8px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
          <span style={{ fontSize: 12, color: C.success, fontWeight: 500 }}>AbacatePay ativo</span>
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        {[
          { label: 'MRR',           value: `R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'receita mensal recorrente', color: C.success },
          { label: 'Pagantes',      value: pagantes,          sub: `${taxaPagantes}% do total`,         color: C.ink },
          { label: 'ARPU',          value: `R$ ${arpuPagantes}`, sub: 'média por usuário pago',         color: C.aubergineL },
          { label: 'ARR projetado', value: `R$ ${(mrr * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'receita anual projetada', color: C.warning },
        ].map(card => (
          <Card key={card.label}>
            <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{card.label}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: card.color, letterSpacing: '-0.5px', lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 11, color: C.mute, marginTop: 8 }}>{card.sub}</p>
          </Card>
        ))}
      </div>

      {/* Planos + Distribuição */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }} className="grid-plans">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }} className="grid-3">
          {planos.map(plano => (
            <div key={plano.nome} style={{
              background: C.bone2, border: `1.5px solid ${'destaque' in plano && plano.destaque ? plano.cor + '50' : C.bone3}`,
              borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
            }}>
              {'destaque' in plano && plano.destaque && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: C.lime, color: C.ink, fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100 }}>
                  Popular
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: plano.cor }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: plano.cor, fontFamily: "'Geist Mono', monospace" }}>{plano.nome}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-1px', color: C.ink }}>{plano.preco}</span>
                  <span style={{ fontSize: 11, color: C.mute }}>/mês</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plano.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: `${plano.cor}12`, border: `1px solid ${plano.cor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke={plano.cor} strokeWidth={3} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 11, color: C.mute }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${C.bone3}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, marginBottom: 2, textTransform: 'uppercase' }}>Usuários</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: plano.cor }}>{plano.usuarios}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, marginBottom: 2, textTransform: 'uppercase' }}>Receita</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: plano.nome === 'Free' ? C.bone4 : C.ink }}>
                    R$ {plano.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 18 }}>Distribuição de Planos</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {planos.map(plano => {
              const pct = clientes.length > 0 ? Math.round((plano.usuarios / clientes.length) * 100) : 0;
              return (
                <div key={plano.nome}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: plano.cor }} />
                      <span style={{ color: C.mute }}>{plano.nome}</span>
                    </div>
                    <span style={{ color: plano.cor, fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>{plano.usuarios} · {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: C.bone3, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: plano.cor, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '12px 14px', background: C.bone, border: `1px solid ${C.bone3}`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: C.mute }}>MRR atual</span>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: C.success }}>
              R$ {mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div style={{ marginTop: 12, padding: 14, background: C.bone, border: `1px solid ${C.bone3}`, borderRadius: 10 }}>
            <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>AbacatePay</p>
            {[{ label: 'Método', value: 'PIX' }, { label: 'Webhook', value: 'Ativo' }, { label: 'Ambiente', value: 'Produção' }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.mute }}>{label}</span>
                <span style={{ fontSize: 11, color: C.ink, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cupons */}
      <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bone3}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Cupons de Desconto</p>
            <span style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, background: C.bone3, padding: '2px 8px', borderRadius: 20 }}>{cupons.length}</span>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {/* Form criar cupom */}
          <div style={{ background: C.bone, border: `1px solid ${C.bone3}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: C.ink, marginBottom: 14 }}>Criar novo cupom</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-form">
              {[
                { key: 'code', label: 'Código *', placeholder: 'PAYROLL50', upper: true },
                { key: 'discount', label: 'Desconto (%) *', placeholder: '50', type: 'number' },
                { key: 'maxRedeems', label: 'Limite de usos', placeholder: 'Vazio = ilimitado', type: 'number' },
                { key: 'notes', label: 'Descrição', placeholder: 'Cupom de boas-vindas' },
              ].map(({ key, label, placeholder, upper, type }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type={type || 'text'}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: upper ? e.target.value.toUpperCase() : e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.aubergine}
                    onBlur={e => e.target.style.borderColor = C.bone3}
                  />
                </div>
              ))}
            </div>
            {erroForm && <div style={{ padding: '8px 12px', background: 'rgba(248,113,113,0.06)', border: `1px solid rgba(248,113,113,0.2)`, borderRadius: 8, fontSize: 12, color: C.danger, marginBottom: 12 }}>{erroForm}</div>}
            {sucessoForm && <div style={{ padding: '8px 12px', background: 'rgba(74,222,128,0.06)', border: `1px solid rgba(74,222,128,0.2)`, borderRadius: 8, fontSize: 12, color: C.success, marginBottom: 12 }}>{sucessoForm}</div>}
            <button onClick={criarCupom} disabled={criando} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: criando ? C.bone3 : C.aubergine, border: 'none', borderRadius: 8, color: criando ? C.mute : C.lime, fontSize: 13, fontWeight: 600, cursor: criando ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {criando ? 'Criando...' : '+ Criar cupom'}
            </button>
          </div>

          {/* Lista cupons */}
          {cupons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: C.mute, fontSize: 13 }}>Nenhum cupom criado ainda.</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 80px', padding: '8px 12px', fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.bone3}` }}>
                <span>Código</span><span>Desconto</span><span>Usos</span><span>Status</span><span>Criado</span><span>Ações</span>
              </div>
              {cupons.map((c, i) => {
                const isAtivo = c.status === 'ACTIVE';
                return (
                  <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 80px', padding: '12px', alignItems: 'center', borderBottom: i < cupons.length - 1 ? `1px solid ${C.bone3}` : 'none' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: "'Geist Mono', monospace" }}>{c.id}</span>
                      {c.notes && <p style={{ fontSize: 11, color: C.mute, marginTop: 2 }}>{c.notes}</p>}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.success, fontFamily: "'Geist Mono', monospace" }}>{c.discount}%</span>
                    <span style={{ fontSize: 12, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>
                      {c.redeemsCount} / {c.maxRedeems === -1 ? '∞' : c.maxRedeems}
                    </span>
                    <MonoTag color={isAtivo ? C.success : C.mute}>{isAtivo ? 'Ativo' : 'Inativo'}</MonoTag>
                    <span style={{ fontSize: 11, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => toggleCupom(c.id)} disabled={toggleLoading === c.id} title={isAtivo ? 'Desativar' : 'Ativar'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: toggleLoading === c.id ? 0.5 : 1 }}>
                        <div style={{ width: 28, height: 16, borderRadius: 8, background: isAtivo ? C.aubergine : C.bone3, position: 'relative', transition: 'background 0.15s' }}>
                          <div style={{ position: 'absolute', top: 2, left: isAtivo ? 14 : 2, width: 12, height: 12, borderRadius: '50%', background: isAtivo ? C.lime : C.bone4, transition: 'left 0.15s' }} />
                        </div>
                      </button>
                      <button onClick={() => deletarCupom(c.id)} disabled={deleteLoading === c.id} title="Deletar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: deleteLoading === c.id ? 0.5 : 1 }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.danger} strokeWidth={2} strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Clientes pagantes */}
      <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bone3}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Clientes Pagantes</p>
          <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: C.mute }}>{pagantes} ativos</span>
        </div>
        {clientes.filter(c => c.plano && c.plano !== 'free').length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: C.mute, fontSize: 13 }}>
            Nenhum cliente pagante ainda.
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '10px 20px', borderBottom: `1px solid ${C.bone3}`, fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span>Cliente</span><span>Telefone</span><span>Plano</span><span>Status</span><span>Desde</span>
            </div>
            {clientes.filter(c => c.plano && c.plano !== 'free').slice(0, 8).map((c, i, arr) => {
              const corPlano = PLANO_COR[c.plano] || C.mute;
              return (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '13px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bone3}` : 'none', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${corPlano}10`, border: `1px solid ${corPlano}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: corPlano, flexShrink: 0 }}>
                      {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{c.name || 'Sem nome'}</span>
                  </div>
                  <span style={{ fontSize: 12, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>+{c.phone}</span>
                  <MonoTag color={corPlano}>{c.plano.toUpperCase()}</MonoTag>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COR[c.plano_status || 'active'] }} />
                    <span style={{ fontSize: 11, color: STATUS_COR[c.plano_status || 'active'], fontFamily: "'Geist Mono', monospace" }}>
                      {STATUS_LABEL[c.plano_status || 'active']}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>
                    {new Date(c.plano_atualizado_em || c.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) { .grid-plans { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-form { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .grid-form { grid-template-columns: 1fr !important; }
        }
        input::placeholder { color: ${C.bone4}; }
        input:focus { border-color: ${C.aubergine} !important; }
      `}</style>
    </div>
  );
}