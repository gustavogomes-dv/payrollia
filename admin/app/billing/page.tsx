import API_URL from '@/lib/api';
import {
  DollarSign,
  Users,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Zap,
  Package,
  BarChart2,
  RefreshCw,
} from 'lucide-react';

async function getStats() {
  try {
    const res = await fetch(`${API_URL}/admin/stats`, { cache: 'no-store' });
    return res.json();
  } catch {
    return { totalUsuarios: 0, mrr: '0.00', planos: [] };
  }
}

async function getClientes() {
  try {
    const res = await fetch(`${API_URL}/admin/clientes`, { cache: 'no-store' });
    return res.json();
  } catch {
    return [];
  }
}

async function getAssinaturas() {
  try {
    const res = await fetch(`${API_URL}/admin/assinaturas`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

type Cliente = {
  id: string;
  name: string;
  phone: string;
  plano: string;
  plano_status: string;
  plano_atualizado_em: string;
  perguntas_usadas: number;
  onboarding_complete: boolean;
  created_at: string;
};

const PLANO_COR: Record<string, string> = {
  free: '#6b7280',
  pro: '#4ade80',
  business: '#a78bfa',
};

const PLANO_PRECO: Record<string, number> = {
  free: 0,
  pro: 12.9,
  business: 29.9,
};

const STATUS_COR: Record<string, string> = {
  active: '#4ade80',
  cancelled: '#ef4444',
  payment_failed: '#fbbf24',
  pending: '#6b7280',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Ativo',
  cancelled: 'Cancelado',
  payment_failed: 'Pagamento falhou',
  pending: 'Pendente',
};

function StatusIcon({ status }: { status: string }) {
  const props = { size: 14, style: { flexShrink: 0 } };
  if (status === 'active') return <CheckCircle2 {...props} color='#4ade80' />;
  if (status === 'cancelled') return <XCircle {...props} color='#ef4444' />;
  if (status === 'payment_failed') return <AlertCircle {...props} color='#fbbf24' />;
  return <Clock {...props} color='#6b7280' />;
}

export default async function BillingPage() {
  const [stats, clientes] = await Promise.all([getStats(), getClientes()]);

  // Calcula métricas de billing a partir dos clientes
  const clientesTyped: Cliente[] = Array.isArray(clientes) ? clientes : [];

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
    {
      nome: 'Free',
      preco: 'R$0',
      periodo: '/mês',
      cor: '#6b7280',
      usuarios: porPlano.free,
      receita: 0,
      features: ['3 perguntas/mês', 'Perfil de investidor', 'Acesso via WhatsApp'],
      productId: '—',
    },
    {
      nome: 'Pro',
      preco: 'R$12,90',
      periodo: '/mês',
      cor: '#4ade80',
      usuarios: porPlano.pro,
      receita: porPlano.pro * PLANO_PRECO.pro,
      features: ['Perguntas ilimitadas', 'Cotações em tempo real', 'Suporte via WhatsApp'],
      productId: 'prod_uLrmaCFtjSSp2Lq3QU5Wygcg',
      destaque: true,
    },
    {
      nome: 'Business',
      preco: 'R$29,90',
      periodo: '/mês',
      cor: '#a78bfa',
      usuarios: porPlano.business,
      receita: porPlano.business * PLANO_PRECO.business,
      features: ['Tudo do Pro', 'Alertas de mercado', 'Relatórios avançados', 'Suporte prioritário'],
      productId: 'prod_paPRqMFjyRE2SWDXGsZqrgqE',
    },
  ];

  const metricasTopo = [
    { label: 'MRR', value: `R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'receita mensal recorrente', color: '#4ade80', icon: DollarSign },
    { label: 'Clientes pagantes', value: pagantes, sub: `${taxaPagantes}% do total`, color: '#fff', icon: Users },
    { label: 'ARPU', value: `R$ ${arpuPagantes}`, sub: 'receita média por usuário pago', color: '#a78bfa', icon: TrendingUp },
    { label: 'ARR projetado', value: `R$ ${(mrr * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'receita anual projetada', color: '#fbbf24', icon: BarChart2 },
  ];

  // Clientes pagantes recentes
  const clientesPagantes = clientesTyped
    .filter(c => c.plano && c.plano !== 'free')
    .sort((a, b) => new Date(b.plano_atualizado_em || b.created_at).getTime() - new Date(a.plano_atualizado_em || a.created_at).getTime())
    .slice(0, 8);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>Billing</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 4 }}>
            Receita, assinaturas e monitoramento via AbacatePay
          </p>
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

        {/* Cards de planos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="grid-3">
          {planos.map((plano) => (
            <div key={plano.nome} style={{ border: `1px solid ${plano.destaque ? plano.cor + '40' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: 18, background: plano.destaque ? `${plano.cor}05` : 'rgba(255,255,255,0.02)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {plano.destaque && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: plano.cor, color: '#000', fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100 }}>
                  Popular
                </div>
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
                    <p style={{ fontSize: 14, fontWeight: 700, color: plano.nome === 'Free' ? 'rgba(255,255,255,0.25)' : '#fff' }}>
                      R$ {plano.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
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

          {/* Resumo financeiro */}
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

          {/* AbacatePay info */}
          <div style={{ marginTop: 16, padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <CreditCard size={13} color='rgba(255,255,255,0.35)' />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>AbacatePay</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Método', value: 'PIX' },
                { label: 'Webhook', value: 'Ativo' },
                { label: 'Ambiente', value: 'Produção' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{label}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
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
            {/* Header tabela */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              <span>Cliente</span>
              <span>Telefone</span>
              <span>Plano</span>
              <span>Status</span>
              <span>Desde</span>
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
                <span>
                  <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, color: PLANO_COR[c.plano] || '#6b7280', background: `${PLANO_COR[c.plano] || '#6b7280'}12`, border: `1px solid ${PLANO_COR[c.plano] || '#6b7280'}25`, textTransform: 'capitalize' }}>
                    {c.plano}
                  </span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StatusIcon status={c.plano_status || 'active'} />
                  <span style={{ fontSize: 11, color: STATUS_COR[c.plano_status || 'active'] }}>
                    {STATUS_LABEL[c.plano_status || 'active']}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                  {new Date(c.plano_atualizado_em || c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid-plans { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}   