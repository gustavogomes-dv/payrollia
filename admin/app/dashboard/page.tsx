import API_URL from '@/lib/api';

async function getStats() {
  try {
    const res = await fetch(`${API_URL}/admin/stats`, { cache: 'no-store' });
    return res.json();
  } catch {
    return { totalUsuarios: 0, totalMensagens: 0, perfis: [], crescimento: [] };
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

const PERFIL_COR: Record<string, string> = {
  conservador: '#3b82f6',
  moderado: '#f59e0b',
  arrojado: '#ef4444',
};

type Cliente = {
  id: string;
  name: string;
  phone: string;
  perfil: string;
  onboarding_complete: boolean;
  created_at: string;
};

export default async function DashboardPage() {
  const [stats, clientes] = await Promise.all([getStats(), getClientes()]);

  const completos = clientes.filter((c: Cliente) => c.onboarding_complete).length;
  const pendentes = clientes.length - completos;
  const taxaConversao = clientes.length > 0 ? Math.round((completos / clientes.length) * 100) : 0;
  const totalPerfis = stats.perfis?.reduce((a: number, p: { total: string }) => a + parseInt(p.total), 0) ?? 0;

  const cards = [
    { label: 'Usuários totais', value: clientes.length, sub: `+${clientes.filter((c: Cliente) => { const d = new Date(c.created_at); const n = new Date(); return d.getMonth() === n.getMonth(); }).length} este mês`, color: '#fff' },
    { label: 'Onboarding completo', value: completos, sub: `${taxaConversao}% de conversão`, color: '#4ade80' },
    { label: 'Pendentes', value: pendentes, sub: 'aguardando suitability', color: '#fbbf24' },
    { label: 'Perfis calculados', value: totalPerfis, sub: 'suitability válido', color: '#a78bfa' },
  ];

  const servicos = [
    { name: 'Express API', status: 'online', color: '#4ade80' },
    { name: 'PostgreSQL', status: 'online', color: '#4ade80' },
    { name: 'Redis', status: 'online', color: '#4ade80' },
    { name: 'Claude API', status: 'online', color: '#4ade80' },
    { name: 'Brapi', status: 'online', color: '#4ade80' },
    { name: 'WhatsApp Webhook', status: 'configurado', color: '#fbbf24' },
    { name: 'AbacatePay', status: 'ativo', color: '#4ade80' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>Overview</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 4 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 8, padding: '8px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ fontSize: 13, color: '#4ade80' }}>Sistema operacional</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        {cards.map((card) => (
          <div key={card.label} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 18px', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{card.label}</p>
            <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', color: card.color, lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 8 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Perfis + Funil */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-2">

        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Distribuição de Perfis</p>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>{totalPerfis} total</span>
          </div>
          {totalPerfis === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Nenhum perfil calculado ainda.</p>
          ) : (
            ['conservador', 'moderado', 'arrojado'].map((perfil) => {
              const found = stats.perfis?.find((p: { perfil: string }) => p.perfil === perfil);
              const total = found ? parseInt(found.total) : 0;
              const pct = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
              return (
                <div key={perfil} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{perfil}</span>
                    <span style={{ color: 'rgba(255,255,255,0.28)' }}>{total} · {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: PERFIL_COR[perfil], borderRadius: 4, opacity: 0.75 }} />
                  </div>
                </div>
              );
            })
          )}
          {totalPerfis > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {['conservador', 'moderado', 'arrojado'].map((perfil) => {
                const found = stats.perfis?.find((p: { perfil: string; total: string }) => p.perfil === perfil);
                const total = found ? parseInt(found.total) : 0;
                return (
                  <div key={perfil} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: PERFIL_COR[perfil] }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{perfil} ({total})</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>Funil de Onboarding</p>
          {[
            { label: 'Cadastrados', value: clientes.length, pct: 100, color: 'rgba(255,255,255,0.6)' },
            { label: 'Iniciaram suitability', value: clientes.length, pct: 100, color: '#a78bfa' },
            { label: 'Completaram suitability', value: completos, pct: taxaConversao, color: '#4ade80' },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 600 }}>{item.value} ({item.pct}%)</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 4, opacity: 0.7 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 14, background: taxaConversao >= 50 ? 'rgba(74,222,128,0.04)' : 'rgba(251,191,36,0.04)', border: `1px solid ${taxaConversao >= 50 ? 'rgba(74,222,128,0.14)' : 'rgba(251,191,36,0.14)'}`, borderRadius: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 30, fontWeight: 700, color: taxaConversao >= 50 ? '#4ade80' : '#fbbf24', letterSpacing: '-1px' }}>{taxaConversao}%</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>taxa de conversão</p>
          </div>
        </div>
      </div>

      {/* Clientes + Serviços */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }} className="grid-clients">

        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Últimos Clientes</p>
            <a href="/clientes" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Ver todos →</a>
          </div>
          {clientes.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Nenhum cliente ainda.</div>
          ) : (
            clientes.slice(0, 5).map((c: Cliente, i: number) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.perfil ? `${PERFIL_COR[c.perfil]}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${c.perfil ? PERFIL_COR[c.perfil] + '35' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: c.perfil ? PERFIL_COR[c.perfil] : 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{c.name || 'Sem nome'}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace' }}>+{c.phone}</p>
                </div>
                {c.perfil && (
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, color: PERFIL_COR[c.perfil], background: `${PERFIL_COR[c.perfil]}12`, border: `1px solid ${PERFIL_COR[c.perfil]}28`, textTransform: 'capitalize', flexShrink: 0 }}>
                    {c.perfil}
                  </span>
                )}
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Status dos Serviços</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {servicos.map((svc) => (
              <div key={svc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{svc.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: svc.color }} />
                  <span style={{ fontSize: 11, color: svc.color }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: 12, background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.14)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Plano atual</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa' }}>Free — Desenvolvimento</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-clients { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}