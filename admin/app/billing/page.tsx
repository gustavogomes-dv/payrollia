'use client';

import { useEffect, useState } from 'react';
import {
  DollarSign, Users, TrendingUp, CreditCard, CheckCircle2, XCircle,
  AlertCircle, Clock, ArrowUpRight, Zap, Package, BarChart2, RefreshCw,
  Tag, Plus, Loader2, ToggleLeft, ToggleRight, Trash2,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PLANO_COR: Record<string, string> = {
  free: '#6b7280', pro: '#4ade80', business: '#a78bfa',
};
const PLANO_PRECO: Record<string, number> = {
  free: 0, pro: 12.9, business: 29.9,
};
const STATUS_COR: Record<string, string> = {
  active: '#4ade80', cancelled: '#ef4444', payment_failed: '#fbbf24', pending: '#6b7280',
};
const STATUS_LABEL: Record<string, string> = {
  active: 'Ativo', cancelled: 'Cancelado', payment_failed: 'Pagamento falhou', pending: 'Pendente',
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

function StatusIcon({ status }: { status: string }) {
  const props = { size: 14, style: { flexShrink: 0 } as React.CSSProperties };
  if (status === 'active') return <CheckCircle2 {...props} color='#4ade80' />;
  if (status === 'cancelled') return <XCircle {...props} color='#ef4444' />;
  if (status === 'payment_failed') return <AlertCircle {...props} color='#fbbf24' />;
  return <Clock {...props} color='#6b7280' />;
}

export default function BillingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulário de cupom
  const [form, setForm] = useState({ code: '', discount: '', maxRedeems: '', notes: '' });
  const [criando, setCriando] = useState(false);
  const [erroForm, setErroForm] = useState('');
  const [sucessoForm, setSucessoForm] = useState('');
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  async function carregarDados() {
    const [s, c, cup] = await Promise.all([
      fetch(`${API_URL}/admin/stats`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/admin/clientes`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/admin/cupons`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]);
    setStats(s);
    setClientes(Array.isArray(c) ? c : []);
    setCupons(Array.isArray(cup) ? cup : []);
    setLoading(false);
  }

  useEffect(() => { carregarDados(); }, []); // eslint-disable-line

  const clientesTyped = clientes;

  const porPlano = {
    free: clientesTyped.filter(c => (c.plano || 'free') === 'free').length,
    pro: clientesTyped.filter(c => c.plano === 'pro').length,
    business: clientesTyped.filter(c => c.plano === 'business').length,
  };

  const mrrCalculado = (porPlano.pro * PLANO_PRECO.pro) + (porPlano.business * PLANO_PRECO.business);
  const mrr = parseFloat(stats.mrr || '0') || mrrCalculado;
  const pagantes = porPlano.pro + porPlano.business;
  const taxaPagantes = clientesTyped.length > 0 ? Math.round((pagantes / clientesTyped.length) * 100) : 0;
  const arpuPagantes = pagantes > 0 ? (mrr / pagantes).toFixed(2) : '0.00';

  const planos = [
    { nome: 'Free', preco: 'R$0', periodo: '/mês', cor: '#6b7280', usuarios: porPlano.free, receita: 0, features: ['3 perguntas/mês', 'Perfil de investidor', 'Acesso via WhatsApp'] },
    { nome: 'Pro', preco: 'R$12,90', periodo: '/mês', cor: '#4ade80', usuarios: porPlano.pro, receita: porPlano.pro * PLANO_PRECO.pro, features: ['Perguntas ilimitadas', 'Cotações em tempo real', 'Suporte via WhatsApp'], destaque: true },
    { nome: 'Business', preco: 'R$29,90', periodo: '/mês', cor: '#a78bfa', usuarios: porPlano.business, receita: porPlano.business * PLANO_PRECO.business, features: ['Tudo do Pro', 'Alertas de mercado', 'Relatórios avançados', 'Suporte prioritário'] },
  ];

  const metricasTopo = [
    { label: 'MRR', value: `R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'receita mensal recorrente', color: '#4ade80', icon: DollarSign },
    { label: 'Clientes pagantes', value: pagantes, sub: `${taxaPagantes}% do total`, color: '#fff', icon: Users },
    { label: 'ARPU', value: `R$ ${arpuPagantes}`, sub: 'receita média por usuário pago', color: '#a78bfa', icon: TrendingUp },
    { label: 'ARR projetado', value: `R$ ${(mrr * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'receita anual projetada', color: '#fbbf24', icon: BarChart2 },
  ];

  const clientesPagantes = clientesTyped
    .filter(c => c.plano && c.plano !== 'free')
    .sort((a, b) => new Date(b.plano_atualizado_em || b.created_at).getTime() - new Date(a.plano_atualizado_em || a.created_at).getTime())
    .slice(0, 8);

  // ── Criar cupom ────────────────────────────────────────────────────────────
  async function criarCupom() {
    setErroForm('');
    setSucessoForm('');

    if (!form.code || !form.discount) {
      setErroForm('Código e desconto são obrigatórios.');
      return;
    }
    const desc = parseFloat(form.discount);
    if (isNaN(desc) || desc <= 0 || desc > 100) {
      setErroForm('O desconto deve ser entre 1% e 100%.');
      return;
    }

    setCriando(true);
    try {
      const res = await fetch(`${API_URL}/admin/cupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          discount: desc,
          maxRedeems: form.maxRedeems ? parseInt(form.maxRedeems) : -1,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErroForm(data.erro || 'Erro ao criar cupom.');
      } else {
        setSucessoForm(`Cupom *${form.code.toUpperCase()}* criado com sucesso!`);
        setForm({ code: '', discount: '', maxRedeems: '', notes: '' });
        await carregarDados();
      }
    } catch {
      setErroForm('Erro de conexão. Tente novamente.');
    } finally {
      setCriando(false);
    }
  }

  // ── Toggle ativo/inativo ───────────────────────────────────────────────────
  async function toggleCupom(id: string) {
    setToggleLoading(id);
    try {
      await fetch(`${API_URL}/admin/cupons/${id}/toggle`, { method: 'PATCH' });
      await carregarDados();
    } finally {
      setToggleLoading(null);
    }
  }

  // ── Deletar cupom ──────────────────────────────────────────────────────────
  async function deletarCupom(id: string) {
    if (!confirm(`Deseja deletar o cupom ${id}? Esta ação não pode ser desfeita.`)) return;
    setDeleteLoading(id);
    try {
      await fetch(`${API_URL}/admin/cupons/${id}`, { method: 'DELETE' });
      await carregarDados();
    } finally {
      setDeleteLoading(null);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
        Carregando...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>Billing</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 4 }}>Receita, assinaturas e monitoramento via AbacatePay</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 8, padding: '8px 14px' }}>
          <CreditCard size={13} color='#4ade80' />
          <span style={{ fontSize: 13, color: '#4ade80' }}>AbacatePay ativo</span>
        </div>
      </div>

      {/* Métricas topo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        {metricasTopo.map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 18px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <Icon size={13} color='rgba(255,255,255,0.22)' />
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
            </div>
            <p style={{ fontSize: label === 'MRR' ? 28 : 24, fontWeight: 700, letterSpacing: '-1px', color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 8 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Planos + Distribuição */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }} className="grid-plans">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="grid-3">
          {planos.map((plano) => (
            <div key={plano.nome} style={{ border: `1px solid ${'destaque' in plano && plano.destaque ? plano.cor + '40' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: 18, background: 'destaque' in plano && plano.destaque ? `${plano.cor}05` : 'rgba(255,255,255,0.02)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {'destaque' in plano && plano.destaque && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: plano.cor, color: '#000', fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100 }}>Popular</div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: plano.cor }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: plano.cor }}>{plano.nome}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1.5px', color: '#fff' }}>{plano.preco}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{plano.periodo}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plano.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <CheckCircle2 size={11} color={plano.cor} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginBottom: 2 }}>USUÁRIOS</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: plano.cor }}>{plano.usuarios}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginBottom: 2 }}>RECEITA</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: plano.nome === 'Free' ? 'rgba(255,255,255,0.25)' : '#fff' }}>R$ {plano.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Distribuição */}
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Package size={14} color='rgba(255,255,255,0.35)' />
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Distribuição de Planos</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {planos.map((plano) => {
              const pct = clientesTyped.length > 0 ? Math.round((plano.usuarios / clientesTyped.length) * 100) : 0;
              return (
                <div key={plano.nome}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: plano.cor }} />
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{plano.nome}</span>
                    </div>
                    <span style={{ color: plano.cor, fontWeight: 600 }}>{plano.usuarios} · {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: plano.cor, borderRadius: 4, opacity: 0.8 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.14)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <ArrowUpRight size={13} color='#4ade80' />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>MRR atual</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>R$ {mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Zap size={13} color='rgba(255,255,255,0.3)' />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Potencial (todos Pro)</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>R$ {(clientesTyped.length * PLANO_PRECO.pro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <CreditCard size={13} color='rgba(255,255,255,0.35)' />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>AbacatePay</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[{ label: 'Método', value: 'PIX' }, { label: 'Webhook', value: 'Ativo' }, { label: 'Ambiente', value: 'Produção' }].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{label}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cupons ─────────────────────────────────────────────────────────── */}
      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', marginBottom: 14 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={14} color='rgba(255,255,255,0.35)' />
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Cupons de Desconto</p>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>{cupons.length} cupons</span>
          </div>
        </div>

        <div style={{ padding: 20 }}>

          {/* Formulário criar cupom */}
          <div style={{ border: '1px solid rgba(74,222,128,0.15)', borderRadius: 12, padding: 18, background: 'rgba(74,222,128,0.02)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
              <Plus size={13} color='#4ade80' />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Criar novo cupom</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }} className="grid-form">
              {/* Código */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Código *</label>
                <input
                  type="text"
                  placeholder="Ex: PAYROLL50"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Desconto % */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Desconto (%) *</label>
                <input
                  type="number"
                  placeholder="Ex: 50"
                  min="1"
                  max="100"
                  value={form.discount}
                  onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Limite de usos */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Limite de usos</label>
                <input
                  type="number"
                  placeholder="Vazio = ilimitado"
                  min="1"
                  value={form.maxRedeems}
                  onChange={e => setForm(f => ({ ...f, maxRedeems: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Descrição */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Cupom de boas-vindas"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Feedback */}
            {erroForm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 10 }}>
                <AlertCircle size={13} color='#ef4444' />
                <span style={{ fontSize: 12, color: '#ef4444' }}>{erroForm}</span>
              </div>
            )}
            {sucessoForm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, marginBottom: 10 }}>
                <CheckCircle2 size={13} color='#4ade80' />
                <span style={{ fontSize: 12, color: '#4ade80' }}>{sucessoForm}</span>
              </div>
            )}

            <button
              onClick={criarCupom}
              disabled={criando}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: criando ? 'rgba(74,222,128,0.1)' : 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, color: '#4ade80', fontSize: 13, fontWeight: 500, cursor: criando ? 'not-allowed' : 'pointer' }}
            >
              {criando ? <Loader2 size={13} /> : <Plus size={13} />}
              {criando ? 'Criando...' : 'Criar cupom'}
            </button>
          </div>

          {/* Lista de cupons */}
          {cupons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Tag size={28} color='rgba(255,255,255,0.1)' style={{ margin: '0 auto 10px' }} />
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Nenhum cupom criado ainda.</p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 80px', padding: '8px 12px', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Código</span>
                <span>Desconto</span>
                <span>Usos</span>
                <span>Status</span>
                <span>Criado em</span>
                <span>Ações</span>
              </div>

              {cupons.map((c, i) => {
                const isAtivo = c.status === 'ACTIVE';
                const usosLabel = c.maxRedeems === -1 ? `${c.redeemsCount} / ∞` : `${c.redeemsCount} / ${c.maxRedeems}`;
                return (
                  <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 80px', padding: '12px', alignItems: 'center', borderBottom: i < cupons.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'monospace' }}>{c.id}</span>
                      {c.notes && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{c.notes}</p>}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>{c.discount}%</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{usosLabel}</span>
                    <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, display: 'inline-block', color: isAtivo ? '#4ade80' : '#6b7280', background: isAtivo ? 'rgba(74,222,128,0.1)' : 'rgba(107,114,128,0.1)', border: `1px solid ${isAtivo ? 'rgba(74,222,128,0.25)' : 'rgba(107,114,128,0.25)'}` }}>
                      {isAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => toggleCupom(c.id)}
                        disabled={toggleLoading === c.id}
                        title={isAtivo ? 'Desativar' : 'Ativar'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: toggleLoading === c.id ? 0.5 : 1 }}
                      >
                        {isAtivo
                          ? <ToggleRight size={18} color='#4ade80' />
                          : <ToggleLeft size={18} color='rgba(255,255,255,0.3)' />
                        }
                      </button>
                      <button
                        onClick={() => deletarCupom(c.id)}
                        disabled={deleteLoading === c.id}
                        title="Deletar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: deleteLoading === c.id ? 0.5 : 1 }}
                      >
                        <Trash2 size={15} color='rgba(239,68,68,0.6)' />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clientes pagantes */}
      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={14} color='rgba(255,255,255,0.35)' />
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Clientes Pagantes</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <RefreshCw size={12} color='rgba(255,255,255,0.2)' />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Atualizado em tempo real</span>
          </div>
        </div>

        {clientesPagantes.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <CreditCard size={32} color='rgba(255,255,255,0.1)' style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>Nenhum cliente pagante ainda.</p>
            <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12, marginTop: 4 }}>Quando um usuário assinar, aparecerá aqui automaticamente.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              <span>Cliente</span><span>Telefone</span><span>Plano</span><span>Status</span><span>Desde</span>
            </div>
            {clientesPagantes.map((c, i) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '13px 20px', borderBottom: i < clientesPagantes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${PLANO_COR[c.plano] || '#6b7280'}18`, border: `1px solid ${PLANO_COR[c.plano] || '#6b7280'}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: PLANO_COR[c.plano] || '#6b7280', flexShrink: 0 }}>
                    {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name || 'Sem nome'}</span>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>+{c.phone}</span>
                <span><span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, color: PLANO_COR[c.plano] || '#6b7280', background: `${PLANO_COR[c.plano] || '#6b7280'}12`, border: `1px solid ${PLANO_COR[c.plano] || '#6b7280'}25`, textTransform: 'capitalize' }}>{c.plano}</span></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StatusIcon status={c.plano_status || 'active'} />
                  <span style={{ fontSize: 11, color: STATUS_COR[c.plano_status || 'active'] }}>{STATUS_LABEL[c.plano_status || 'active']}</span>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>{new Date(c.plano_atualizado_em || c.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            ))}
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) { .grid-plans { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-form { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .grid-form { grid-template-columns: 1fr !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { border-color: rgba(74,222,128,0.4) !important; }
      `}</style>
    </div>
  );
}