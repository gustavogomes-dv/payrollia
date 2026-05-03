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

export default async function BotPage() {
  const [stats, clientes] = await Promise.all([getStats(), getClientes()]);
  const totalPerfis = stats.perfis.reduce((a: number, p: { total: string }) => a + parseInt(p.total), 0);

  const perfilCor: Record<string, string> = {
    conservador: '#3b82f6',
    moderado: '#f59e0b',
    arrojado: '#ef4444',
  };

  const perfilDesc: Record<string, string> = {
    conservador: 'Foco em renda fixa, Tesouro Direto, CDBs e LCI/LCA. Tom cauteloso e tranquilizador, priorizando segurança e previsibilidade.',
    moderado: 'Equilíbrio entre renda fixa e variável, fundos multimercado, FIIs e ETFs. Tom equilibrado, apresentando prós e contras.',
    arrojado: 'Renda variável, ações da B3, ETFs, FIIs e diversificação global. Tom direto e analítico, explorando conceitos avançados.',
  };

  const motorCards = [
    { label: 'MODELO IA', value: 'Sonnet 4.6', sub: 'claude-sonnet-4-6', color: '#a78bfa' },
    { label: 'MAX TOKENS', value: '1.024', sub: 'por resposta', color: '#fff' },
    { label: 'HISTÓRICO', value: '10 msgs', sub: 'contexto por conversa', color: '#fff' },
    { label: 'SUITABILITY', value: '8 perguntas', sub: 'validade de 1 ano', color: '#fff' },
  ];

  const pendencias = [
    { label: 'Adicionar créditos Anthropic API', done: true },
    { label: 'Webhook WhatsApp configurado', done: true },
    { label: 'WHATSAPP_TOKEN e PHONE_ID no .env', done: true },
    { label: 'Token permanente da Meta', done: false },
    { label: 'Modo Live na Meta (produção)', done: false },
    { label: 'Deploy em produção', done: false },
    { label: 'Integração AbacatePay', done: false },
  ];

  const feitas = pendencias.filter(p => p.done).length;
  const pctPronto = Math.round((feitas / pendencias.length) * 100);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>Bot & IA</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
            Motor de inteligência artificial e configurações do assistente Payroll
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: 8, padding: '8px 14px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <span style={{ fontSize: 13, color: '#4ade80' }}>Bot operacional</span>
        </div>
      </div>

      {/* Cards do motor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {motorCards.map((card) => (
          <div key={card.label} style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '20px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 10 }}>{card.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', color: card.color, lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Linha 2: Perfis + Progresso */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Perfis de investidor */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '20px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Perfis de Investidor</p>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{totalPerfis} usuários classificados</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['conservador', 'moderado', 'arrojado'].map((perfil) => {
              const found = stats.perfis.find((p: { perfil: string; total: string }) => p.perfil === perfil);
              const total = found ? parseInt(found.total) : 0;
              const pct = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
              return (
                <div key={perfil} style={{
                  padding: '14px',
                  background: `${perfilCor[perfil]}08`,
                  border: `1px solid ${perfilCor[perfil]}20`,
                  borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: perfilCor[perfil] }} />
                      <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize', color: perfilCor[perfil] }}>{perfil}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: perfilCor[perfil] }}>{total} · {pct}%</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: 10 }}>{perfilDesc[perfil]}</p>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: perfilCor[perfil], borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progresso de implantação */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '20px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 500 }}>Progresso de Implantação</p>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#4ade80' }}>{pctPronto}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${pctPronto}%`, background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendencias.map((p) => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, color: p.done ? '#4ade80' : 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                    {p.done ? '●' : '○'}
                  </span>
                  <span style={{ fontSize: 12, color: p.done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)', textDecoration: p.done ? 'none' : 'none' }}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          }}>
            {[
              { label: 'Total usuários', value: clientes.length, color: '#fff' },
              { label: 'Perfis calculados', value: totalPerfis, color: '#a78bfa' },
              { label: 'Mensagens', value: stats.totalMensagens, color: '#3b82f6' },
              { label: 'Taxa conversão', value: `${clientes.length > 0 ? Math.round((totalPerfis / clientes.length) * 100) : 0}%`, color: '#4ade80' },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 6, letterSpacing: '0.05em' }}>{item.label.toUpperCase()}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Linha 3: Integrações ativas */}
      <div style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 13, fontWeight: 500 }}>Integrações & Serviços</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { name: 'Anthropic Claude', desc: 'Motor de IA principal', status: 'ativo', color: '#4ade80', icon: '🤖' },
            { name: 'Meta WhatsApp', desc: 'Webhook configurado', status: 'dev mode', color: '#fbbf24', icon: '💬' },
            { name: 'Brapi API', desc: 'Cotações B3 em tempo real', status: 'ativo', color: '#4ade80', icon: '📈' },
            { name: 'AbacatePay', desc: 'Billing e pagamentos', status: 'pendente', color: '#6b7280', icon: '💳' },
          ].map((svc, i) => (
            <div key={svc.name} style={{
              padding: '20px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{svc.icon}</span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  color: svc.color,
                  background: `${svc.color}15`,
                  border: `1px solid ${svc.color}30`,
                }}>
                  {svc.status}
                </span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{svc.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}