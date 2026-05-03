async function getStats() {
  try {
    const res = await fetch('http://localhost:3000/admin/stats', { cache: 'no-store' });
    return res.json();
  } catch {
    return { totalUsuarios: 0, totalMensagens: 0, perfis: [] };
  }
}

async function getClientes() {
  try {
    const res = await fetch('http://localhost:3000/admin/clientes', { cache: 'no-store' });
    return res.json();
  } catch {
    return [];
  }
}

const perfilCor: Record<string, string> = {
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
  const totalPerfis = stats.perfis.reduce((a: number, p: { total: string }) => a + parseInt(p.total), 0);

  const cards = [
    { label: 'USUÁRIOS TOTAIS', value: clientes.length, sub: `+${clientes.filter((c: Cliente) => {
      const d = new Date(c.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth();
    }).length} este mês`, color: '#fff' },
    { label: 'ONBOARDING COMPLETO', value: completos, sub: `${taxaConversao}% de conversão`, color: '#4ade80' },
    { label: 'PENDENTES', value: pendentes, sub: 'aguardando suitability', color: '#fbbf24' },
    { label: 'PERFIS CALCULADOS', value: totalPerfis, sub: 'suitability válido', color: '#a78bfa' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>Overview</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: 8, padding: '8px 14px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <span style={{ fontSize: 13, color: '#4ade80' }}>Sistema operacional</span>
        </div>
      </div>

      {/* Cards principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '20px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 10 }}>{card.label}</p>
            <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', color: card.color, lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Linha 2: Perfis + Atividade recente */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Distribuição de perfis com barras */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '20px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Distribuição de Perfis</p>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{totalPerfis} total</span>
          </div>

          {totalPerfis === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Nenhum perfil calculado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['conservador', 'moderado', 'arrojado'].map((perfil) => {
                const found = stats.perfis.find((p: { perfil: string; total: string }) => p.perfil === perfil);
                const total = found ? parseInt(found.total) : 0;
                const pct = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
                return (
                  <div key={perfil}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{perfil}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>{total} · {pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: `linear-gradient(90deg, ${perfilCor[perfil]}, ${perfilCor[perfil]}aa)`,
                        borderRadius: 4, transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mini donut visual */}
          {totalPerfis > 0 && (
            <div style={{ marginTop: 20, display: 'flex', gap: 16, justifyContent: 'center' }}>
              {['conservador', 'moderado', 'arrojado'].map((perfil) => {
                const found = stats.perfis.find((p: { perfil: string; total: string }) => p.perfil === perfil);
                const total = found ? parseInt(found.total) : 0;
                return (
                  <div key={perfil} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: perfilCor[perfil] }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                      {perfil} ({total})
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Taxa de conversão + funil */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '20px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 20 }}>Funil de Onboarding</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Usuários cadastrados', value: clientes.length, pct: 100, color: '#fff' },
              { label: 'Iniciaram suitability', value: clientes.length, pct: 100, color: '#a78bfa' },
              { label: 'Completaram suitability', value: completos, pct: taxaConversao, color: '#4ade80' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.value} ({item.pct}%)</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${item.pct}%`,
                    background: item.color, borderRadius: 4, opacity: 0.7,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Taxa de conversão destaque */}
          <div style={{
            marginTop: 20, padding: '14px',
            background: taxaConversao >= 50 ? 'rgba(74,222,128,0.05)' : 'rgba(251,191,36,0.05)',
            border: `1px solid ${taxaConversao >= 50 ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)'}`,
            borderRadius: 8, textAlign: 'center',
          }}>
            <p style={{ fontSize: 32, fontWeight: 700, color: taxaConversao >= 50 ? '#4ade80' : '#fbbf24', letterSpacing: '-1px' }}>
              {taxaConversao}%
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>taxa de conversão geral</p>
          </div>
        </div>
      </div>

      {/* Linha 3: Últimos clientes + Status serviços */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>

        {/* Últimos clientes */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Últimos Clientes</p>
            <a href="/clientes" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Ver todos →</a>
          </div>
          {clientes.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
              Nenhum cliente ainda.
            </div>
          ) : (
            clientes.slice(0, 5).map((c: Cliente, i: number) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: c.perfil ? `${perfilCor[c.perfil]}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${c.perfil ? perfilCor[c.perfil] + '40' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  color: c.perfil ? perfilCor[c.perfil] : 'rgba(255,255,255,0.4)',
                  flexShrink: 0,
                }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{c.name || 'Sem nome'}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>+{c.phone}</p>
                </div>
                {c.perfil && (
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 20,
                    color: perfilCor[c.perfil],
                    background: `${perfilCor[c.perfil]}15`,
                    border: `1px solid ${perfilCor[c.perfil]}30`,
                    textTransform: 'capitalize',
                  }}>
                    {c.perfil}
                  </span>
                )}
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Status dos serviços */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '20px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Status dos Serviços</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Express API', status: 'online', color: '#4ade80' },
              { name: 'PostgreSQL', status: 'online', color: '#4ade80' },
              { name: 'Redis', status: 'online', color: '#4ade80' },
              { name: 'Claude API', status: 'online', color: '#4ade80' },
              { name: 'Brapi (cotações)', status: 'online', color: '#4ade80' },
              { name: 'WhatsApp Webhook', status: 'configurado', color: '#fbbf24' },
              { name: 'AbacatePay', status: 'pendente', color: '#6b7280' },
            ].map((svc) => (
              <div key={svc.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{svc.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: svc.color,
                    boxShadow: svc.status === 'online' ? `0 0 6px ${svc.color}` : 'none',
                  }} />
                  <span style={{ fontSize: 11, color: svc.color }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Plano atual */}
          <div style={{
            marginTop: 16, padding: '12px',
            background: 'rgba(167,139,250,0.05)',
            border: '1px solid rgba(167,139,250,0.15)',
            borderRadius: 8,
          }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>PLANO ATUAL</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa' }}>Free — Desenvolvimento</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Deploy pendente</p>
          </div>
        </div>
      </div>
    </div>
  );
}