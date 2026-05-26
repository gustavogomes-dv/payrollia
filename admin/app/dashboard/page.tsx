'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Tokens de cor ────────────────────────────────────────────────────────────
const C = {
  aubergine:  '#2D2356',
  aubergineL: '#4A3B82',
  lime:       '#C8F260',
  coral:      '#FF8A65',
  bone:       '#FAF8F4',
  bone2:      '#F2EFE8',
  bone3:      '#E8E4DA',
  bone4:      '#D4CFC2',
  mute:       '#6B6478',
  ink:        '#14102A',
  success:    '#4ADE80',
  warning:    '#FBBF24',
  danger:     '#F87171',
};

const PERFIL_COR: Record<string, { text: string; bg: string; border: string }> = {
  conservador: { text: C.aubergine,  bg: 'rgba(45,35,86,0.08)',    border: 'rgba(45,35,86,0.18)' },
  moderado:    { text: '#C4612A',    bg: 'rgba(255,138,101,0.08)', border: 'rgba(255,138,101,0.2)' },
  arrojado:    { text: '#5A7A10',    bg: 'rgba(200,242,96,0.12)',  border: 'rgba(200,242,96,0.3)' },
};

const PLANO_PRECO: Record<string, number> = { free: 0, pro: 12.9, business: 29.9 };

type Cliente = {
  id: string; name: string; phone: string;
  perfil: string; plano: string;
  onboarding_complete: boolean; created_at: string;
};

// ─── Gráfico de barras SVG ────────────────────────────────────────────────────
function BarChart({ dados, cor, formatLabel }: {
  dados: { label: string; value: number }[];
  cor: string;
  formatLabel: (v: number) => string;
}) {
  const maxVal = Math.max(...dados.map(d => d.value), 1);
  const W = 100; const H = 72;
  const barW = Math.min(16, (W / dados.length) * 0.5);
  const gap  = W / dados.length;
  return (
    <svg viewBox={`0 0 100 ${H + 18}`} style={{ width: '100%', height: 130, overflow: 'visible' }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={0} y1={H - f * H} x2={100} y2={H - f * H}
          stroke={C.bone3} strokeWidth={0.4} />
      ))}
      {dados.map((d, i) => {
        const x    = gap * i + gap / 2;
        const barH = maxVal > 0 ? (d.value / maxVal) * H : 0;
        const y    = H - barH;
        return (
          <g key={i}>
            <rect x={x - barW / 2} y={y} width={barW} height={barH} rx={2} fill={cor} opacity={0.85} />
            {d.value > 0 && (
              <text x={x} y={y - 2} textAnchor="middle" fontSize={3.8} fill={C.mute}>
                {formatLabel(d.value)}
              </text>
            )}
            <text x={x} y={H + 7} textAnchor="middle" fontSize={3.5}
              fill={C.mute} fontFamily="'Geist Mono', monospace">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function gerarMeses(n: number) {
  const meses = [];
  const agora = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    meses.push({
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
    });
  }
  return meses;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{title}</p>
        {sub && <p style={{ fontSize: 11, color: C.mute, marginTop: 2 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function MonoValue({ children, color, size = 16 }: { children: React.ReactNode; color?: string; size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 600, fontFamily: "'Geist Mono', monospace", color: color || C.ink }}>
      {children}
    </span>
  );
}

function ProgressBar({ label, value, pct, color }: { label: string; value: number; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: C.mute }}>{label}</span>
        <MonoValue color={color} size={12}>{value} ({pct}%)</MonoValue>
      </div>
      <div style={{ height: 5, background: C.bone3, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats]       = useState<any>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/admin/stats`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/admin/clientes`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]).then(([s, c]) => {
      setStats(s);
      setClientes(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 28, height: 28, border: `2px solid ${C.bone3}`, borderTop: `2px solid ${C.aubergine}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: C.mute, fontSize: 13 }}>Carregando...</p>
      </div>
    );
  }

  const completos      = clientes.filter(c => c.onboarding_complete).length;
  const pendentes      = clientes.length - completos;
  const taxaConversao  = clientes.length > 0 ? Math.round((completos / clientes.length) * 100) : 0;
  const totalPerfis    = stats?.perfis?.reduce((a: number, p: { total: string }) => a + parseInt(p.total), 0) ?? 0;

  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d   = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const lbl = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const found = stats?.crescimento?.find((c: any) => c.dia?.slice(0, 10) === key);
    return { label: lbl, value: found ? parseInt(found.total) : 0 };
  });

  const meses = gerarMeses(6);
  const receitaMensal = meses.map(mes => {
    const rec = clientes
      .filter(c => new Date(c.created_at).toISOString().slice(0, 7) === mes.key && c.plano !== 'free')
      .reduce((acc, c) => acc + (PLANO_PRECO[c.plano] || 0), 0);
    return { label: mes.label, value: rec };
  });

  const servicos = [
    { name: 'Express API',      status: 'online',       color: C.success },
    { name: 'PostgreSQL',       status: 'online',       color: C.success },
    { name: 'Redis',            status: 'online',       color: C.success },
    { name: 'Claude API',       status: 'online',       color: C.success },
    { name: 'Brapi',            status: 'online',       color: C.success },
    { name: 'WhatsApp Webhook', status: 'configurado',  color: C.warning },
    { name: 'AbacatePay',       status: 'ativo',        color: C.success },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 38, fontWeight: 400,
            letterSpacing: '-0.5px', color: C.aubergine,
            lineHeight: 1, marginBottom: 6,
          }}>
            Overview.
          </h1>
          <p style={{ color: C.mute, fontSize: 13 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: 8, padding: '8px 14px',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
          <span style={{ fontSize: 12, color: C.success, fontWeight: 500 }}>Sistema operacional</span>
        </div>
      </div>

      {/* Cards topo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        {[
          { label: 'Usuários totais',     value: clientes.length, sub: `+${clientes.filter(c => { const d = new Date(c.created_at); const n = new Date(); return d.getMonth() === n.getMonth(); }).length} este mês`, color: C.aubergine },
          { label: 'Onboarding completo', value: completos,        sub: `${taxaConversao}% de conversão`,   color: C.success },
          { label: 'Pendentes',           value: pendentes,        sub: 'aguardando suitability',           color: C.warning },
          { label: 'Perfis calculados',   value: totalPerfis,      sub: 'suitability válido',               color: C.coral },
        ].map(card => (
          <Card key={card.label}>
            <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              {card.label}
            </p>
            <p style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-1px', color: card.color, lineHeight: 1 }}>
              {card.value}
            </p>
            <p style={{ fontSize: 12, color: C.mute, marginTop: 8 }}>{card.sub}</p>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-2">
        <Card>
          <CardHeader
            title="Receita Mensal"
            sub="últimos 6 meses"
            right={<MonoValue color={C.success}>{`R$ ${receitaMensal.reduce((a, b) => a + b.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</MonoValue>}
          />
          <BarChart dados={receitaMensal} cor={C.aubergine} formatLabel={v => `R$${v.toFixed(0)}`} />
        </Card>
        <Card>
          <CardHeader
            title="Novos Usuários"
            sub="últimos 7 dias"
            right={<MonoValue color={C.aubergineL}>{`${ultimos7.reduce((a, b) => a + b.value, 0)} total`}</MonoValue>}
          />
          <BarChart dados={ultimos7} cor={C.coral} formatLabel={v => `${v}`} />
        </Card>
      </div>

      {/* Perfis + Funil */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-2">

        <Card>
          <CardHeader
            title="Distribuição de Perfis"
            right={<span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: C.mute }}>{totalPerfis} total</span>}
          />
          {totalPerfis === 0 ? (
            <p style={{ color: C.mute, fontSize: 13 }}>Nenhum perfil calculado ainda.</p>
          ) : (
            <>
              {['conservador', 'moderado', 'arrojado'].map(perfil => {
                const found = stats?.perfis?.find((p: any) => p.perfil === perfil);
                const total = found ? parseInt(found.total) : 0;
                const pct   = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
                const cor   = PERFIL_COR[perfil];
                return (
                  <div key={perfil} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                      <span style={{ color: C.mute, textTransform: 'capitalize' }}>{perfil}</span>
                      <MonoValue color={cor.text} size={12}>{total} · {pct}%</MonoValue>
                    </div>
                    <div style={{ height: 5, background: C.bone3, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: cor.text, borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 8, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {['conservador', 'moderado', 'arrojado'].map(perfil => {
                  const found = stats?.perfis?.find((p: any) => p.perfil === perfil);
                  const total = found ? parseInt(found.total) : 0;
                  const cor   = PERFIL_COR[perfil];
                  return (
                    <div key={perfil} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: cor.text }} />
                      <span style={{ fontSize: 11, color: C.mute, textTransform: 'capitalize' }}>{perfil} ({total})</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Funil de Onboarding</p>
          </div>
          <ProgressBar label="Cadastrados"             value={clientes.length} pct={100}           color={C.bone4} />
          <ProgressBar label="Iniciaram suitability"   value={clientes.length} pct={100}           color={C.aubergineL} />
          <ProgressBar label="Completaram suitability" value={completos}       pct={taxaConversao} color={C.success} />
          <div style={{
            marginTop: 12, padding: 14,
            background: taxaConversao >= 50 ? 'rgba(74,222,128,0.05)' : 'rgba(251,191,36,0.05)',
            border: `1px solid ${taxaConversao >= 50 ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)'}`,
            borderRadius: 10, textAlign: 'center',
          }}>
            <p style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: taxaConversao >= 50 ? C.success : C.warning, letterSpacing: '-1px' }}>
              {taxaConversao}%
            </p>
            <p style={{ fontSize: 12, color: C.mute, marginTop: 4 }}>taxa de conversão</p>
          </div>
        </Card>
      </div>

      {/* Clientes + Serviços */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }} className="grid-clients">

        <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bone3}`, display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Últimos Clientes</p>
            <a href="/clientes" style={{ fontSize: 12, color: C.mute, textDecoration: 'none' }}>Ver todos →</a>
          </div>
          {clientes.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.mute, fontSize: 13 }}>Nenhum cliente ainda.</div>
          ) : (
            clientes.slice(0, 5).map((c, i) => {
              const cor = c.perfil ? PERFIL_COR[c.perfil] : null;
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                  borderBottom: i < Math.min(clientes.length, 5) - 1 ? `1px solid ${C.bone3}` : 'none',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: cor ? cor.bg : C.bone3,
                    border: `1px solid ${cor ? cor.border : C.bone4}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: cor ? cor.text : C.mute, flexShrink: 0,
                  }}>
                    {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{c.name || 'Sem nome'}</p>
                    <p style={{ fontSize: 11, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>+{c.phone}</p>
                  </div>
                  {c.perfil && cor && (
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 20,
                      color: cor.text, background: cor.bg, border: `1px solid ${cor.border}`,
                      textTransform: 'capitalize', flexShrink: 0, fontWeight: 500,
                    }}>
                      {c.perfil}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: C.mute, flexShrink: 0, fontFamily: "'Geist Mono', monospace" }}>
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <Card>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 14 }}>Status dos Serviços</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {servicos.map(svc => (
              <div key={svc.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 8,
                background: C.bone, border: `1px solid ${C.bone3}`,
              }}>
                <span style={{ fontSize: 12, color: C.mute }}>{svc.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: svc.color }} />
                  <span style={{ fontSize: 11, color: svc.color, fontFamily: "'Geist Mono', monospace" }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 12, padding: 12,
            background: 'rgba(45,35,86,0.05)',
            border: `1px solid rgba(45,35,86,0.12)`,
            borderRadius: 10,
          }}>
            <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Plano atual
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.aubergine }}>Free · Desenvolvimento</p>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-4       { grid-template-columns: repeat(2,1fr) !important; }
          .grid-2       { grid-template-columns: 1fr !important; }
          .grid-clients { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}