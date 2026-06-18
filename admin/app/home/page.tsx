'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/lib/api';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Periodo = '7d' | '30d' | '60d' | '1a';

type Stats = {
  totalUsuarios: number;
  totalMensagens: number;
  novosHoje: number;
  novosSemana: number;
  perfis: { perfil: string; total: string }[];
  mrr: string;
  onboardingCompletos: number;
  onboardingTotal: number;
  crescimento: { dia: string; total: string }[];
  planos: { plan: string; total: string }[];
};

type Cliente = {
  id: string;
  name: string;
  phone: string;
  perfil: string;
  onboarding_complete: boolean;
  created_at: string;
};

// ─── Tokens de cor — tema dark broadsheet ──────────────────────────────────────
const C = {
  bg:       '#14102A',
  aubergine:'#2D2356',
  lime:     '#C8F260',
  coral:    '#FF8A65',
  bone:     '#FAF8F4',
  mute:     '#9C95AD',
  mute2:    '#6B6478',
  purple:   '#534AB7',
  teal:     '#5DCAA5',
  hair:     'rgba(250,248,244,0.1)',
  hairSoft: 'rgba(250,248,244,0.07)',
};

// perfil -> cor de destaque no tema escuro
const PERFIL_COR: Record<string, string> = {
  conservador: C.mute,
  moderado:    C.coral,
  arrojado:    C.lime,
};

// ─── Filtro de período ────────────────────────────────────────────────────────
function FiltroPeriodo({ valor, onChange }: { valor: Periodo; onChange: (p: Periodo) => void }) {
  const opcoes: { label: string; value: Periodo }[] = [
    { label: '7d',  value: '7d' },
    { label: '30d', value: '30d' },
    { label: '60d', value: '60d' },
    { label: '1a',  value: '1a' },
  ];
  return (
    <div style={{ display: 'flex', gap: 2, border: `1px solid ${C.hair}`, borderRadius: 0, padding: 3 }}>
      {opcoes.map(op => (
        <button key={op.value} onClick={() => onChange(op.value)} style={{
          padding: '5px 12px', border: 'none', cursor: 'pointer',
          fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.04em',
          transition: 'all 0.15s',
          background: valor === op.value ? C.lime : 'transparent',
          color: valor === op.value ? C.aubergine : C.mute,
        }}>
          {op.label}
        </button>
      ))}
    </div>
  );
}

// ─── Gráfico de barras dinâmico por período ───────────────────────────────────
function GrowthChart({
  crescimento,
  periodo,
}: {
  crescimento: { dia: string; total: string }[];
  periodo: Periodo;
}) {
  const hoje = new Date();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  let pontos: { label: string; total: number; isHoje: boolean }[] = [];

  if (periodo === '7d') {
    pontos = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoje);
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      const found = crescimento.find(c => c.dia?.startsWith(key));
      return { label: dayNames[d.getDay()], total: found ? parseInt(found.total) : 0, isHoje: i === 6 };
    });
  } else if (periodo === '30d') {
    pontos = Array.from({ length: 4 }, (_, w) => {
      let total = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date(hoje);
        day.setDate(day.getDate() - (27 - w * 7 - d));
        const key = day.toISOString().split('T')[0];
        const found = crescimento.find(c => c.dia?.startsWith(key));
        if (found) total += parseInt(found.total);
      }
      return { label: `S${w + 1}`, total, isHoje: w === 3 };
    });
  } else if (periodo === '60d') {
    pontos = Array.from({ length: 4 }, (_, q) => {
      let total = 0;
      for (let d = 0; d < 15; d++) {
        const day = new Date(hoje);
        day.setDate(day.getDate() - (59 - q * 15 - d));
        const key = day.toISOString().split('T')[0];
        const found = crescimento.find(c => c.dia?.startsWith(key));
        if (found) total += parseInt(found.total);
      }
      return { label: `Q${q + 1}`, total, isHoje: q === 3 };
    });
  } else {
    pontos = Array.from({ length: 12 }, (_, m) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - (11 - m), 1);
      const mesKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const total = crescimento
        .filter(c => c.dia?.startsWith(mesKey))
        .reduce((a, c) => a + parseInt(c.total), 0);
      return {
        label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        total,
        isHoje: m === 11,
      };
    });
  }

  const max = Math.max(...pontos.map(p => p.total), 1);
  const totalPeriodo = pontos.reduce((a, p) => a + p.total, 0);
  const labelPeriodo = { '7d': '7 dias', '30d': '30 dias', '60d': '60 dias', '1a': '12 meses' }[periodo];

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
        <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.mute2 }}>
          Novos cadastros · {labelPeriodo}
        </p>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: C.mute }}>{totalPeriodo} total</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: pontos.length > 8 ? 5 : 9, height: 80 }}>
        {pontos.map((p, i) => {
          const h = p.total > 0 ? Math.max((p.total / max) * 62, 8) : 3;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              {p.total > 0 && (
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, color: p.isHoje ? C.lime : C.mute2, fontWeight: 600 }}>
                  {p.total}
                </span>
              )}
              <div style={{ width: '100%', height: h, background: p.isHoje ? C.lime : p.total > 0 ? 'rgba(250,248,244,0.18)' : C.hairSoft }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, color: p.isHoje ? C.lime : C.mute2 }}>
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Barra de progresso ───────────────────────────────────────────────────────
function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 7 }}>
        <span style={{ color: C.mute }}>{label}</span>
        <span style={{ color, fontFamily: "'Geist Mono', monospace" }}>{value} · {pct}%</span>
      </div>
      <div style={{ height: 3, background: C.hairSoft, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saudacao, setSaudacao] = useState('');
  const [periodo, setPeriodo]   = useState<Periodo>('7d');

  useEffect(() => {
    const h = new Date().getHours();
    setSaudacao(h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite');
    Promise.all([
      fetch(`${API_URL}/admin/stats`).then(r => r.json()).catch(() => null),
      fetch(`${API_URL}/admin/clientes`).then(r => r.json()).catch(() => []),
    ]).then(([s, c]) => {
      setStats(s);
      setClientes(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  const wrap: React.CSSProperties = {
    background: C.bg, minHeight: '100vh', width: '100%',
    fontFamily: "'Geist', sans-serif", color: C.bone,
  };

  if (loading) {
    return (
      <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{ width: 26, height: 26, border: `2px solid ${C.hair}`, borderTop: `2px solid ${C.lime}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: C.mute, fontSize: 13, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em' }}>carregando...</p>
      </div>
    );
  }

  const totalUsuarios = stats?.totalUsuarios ?? 0;
  const novosSemana   = stats?.novosSemana ?? 0;
  const novosHoje     = stats?.novosHoje ?? 0;
  const mrr           = stats?.mrr ?? '0.00';
  const completos     = stats?.onboardingCompletos ?? 0;
  const taxaConversao = totalUsuarios > 0 ? Math.round((completos / totalUsuarios) * 100) : 0;
  const totalPerfis   = stats?.perfis?.reduce((a, p) => a + parseInt(p.total), 0) ?? 0;
  const mrrFmt        = parseFloat(mrr).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div style={wrap}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '34px 40px 60px' }}>

        {/* Masthead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: `1px solid ${C.hair}`, marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.mute }}>
            Painel — Edição diária
          </span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '')}
          </span>
        </div>

        {/* Saudação */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 32, fontWeight: 400, color: C.bone, lineHeight: 1, marginBottom: 6 }}>
              {saudacao}, Gustavo.
            </h1>
            <p style={{ fontSize: 13, color: C.mute2 }}>o que aconteceu enquanto você esteve fora.</p>
          </div>
          <FiltroPeriodo valor={periodo} onChange={setPeriodo} />
        </div>

        {/* Manchete — número herói */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 6 }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 104, lineHeight: 0.78, color: C.bone }}>
            {totalUsuarios}
          </span>
          <div style={{ paddingBottom: 14 }}>
            <div style={{ width: 44, height: 4, background: C.lime, marginBottom: 10 }} />
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, lineHeight: 1.5 }}>
              clientes<br />no total
            </p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: C.lime, marginBottom: 38 }}>↑ {novosSemana} novos nos últimos 7 dias</p>

        {/* Linha de estatísticas — dividida por fios */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1px solid ${C.hair}`, borderBottom: `1px solid ${C.hair}`, marginBottom: 40 }} className="stat-row">
          <div style={{ padding: '22px 0', borderRight: `1px solid ${C.hairSoft}` }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mute2, marginBottom: 12 }}>Novos hoje</p>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 46, lineHeight: 0.8, color: C.bone }}>{novosHoje}</p>
          </div>
          <div style={{ padding: '22px 0 22px 26px', borderRight: `1px solid ${C.hairSoft}` }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mute2, marginBottom: 12 }}>Conversão</p>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 46, lineHeight: 0.8, color: C.bone }}>
              {taxaConversao}<span style={{ fontSize: 24, color: C.mute }}>%</span>
            </p>
          </div>
          <div style={{ padding: '22px 0 22px 26px' }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mute2, marginBottom: 12 }}>Receita · MRR</p>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 30, fontWeight: 500, lineHeight: 1, color: C.lime, letterSpacing: '-1px' }}>R${mrrFmt}</p>
          </div>
        </div>

        {/* Gráfico + Funil/Perfis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, marginBottom: 44 }} className="grid-split">
          <div>
            <GrowthChart crescimento={stats?.crescimento ?? []} periodo={periodo} />
          </div>
          <div>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.mute2, marginBottom: 22 }}>
              Funil de onboarding
            </p>
            <ProgressBar label="Cadastrados"             value={totalUsuarios} max={totalUsuarios} color={C.mute} />
            <ProgressBar label="Iniciaram suitability"   value={totalUsuarios} max={totalUsuarios} color={C.purple} />
            <ProgressBar label="Completaram suitability" value={completos}     max={totalUsuarios} color={C.lime} />
          </div>
        </div>

        {/* Distribuição de perfis */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${C.hair}` }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.mute2 }}>Distribuição de perfis</p>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: C.mute }}>{totalPerfis} perfis</span>
          </div>
          {totalPerfis === 0 ? (
            <p style={{ color: C.mute2, fontSize: 13, padding: '8px 0' }}>aguardando os primeiros perfis.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="perfil-row">
              {['conservador', 'moderado', 'arrojado'].map(perfil => {
                const found = stats?.perfis.find(p => p.perfil === perfil);
                const total = found ? parseInt(found.total) : 0;
                const pct   = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
                const cor   = PERFIL_COR[perfil];
                return (
                  <div key={perfil}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 34, color: C.bone, lineHeight: 0.9 }}>{total}</span>
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: cor }}>{pct}%</span>
                    </div>
                    <div style={{ height: 3, background: C.hairSoft, marginBottom: 8 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: cor }} />
                    </div>
                    <p style={{ fontSize: 12.5, color: C.mute, textTransform: 'capitalize' }}>{perfil}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimos clientes — lista numerada */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.mute2 }}>Últimos clientes</p>
            <a href="/clientes" style={{ fontSize: 12, color: C.mute, textDecoration: 'none' }}>ver todos →</a>
          </div>
          {clientes.length === 0 ? (
            <p style={{ color: C.mute2, fontSize: 13, padding: '18px 0' }}>nenhum cliente ainda.</p>
          ) : (
            clientes.slice(0, 5).map((c, i) => {
              const cor = c.perfil ? PERFIL_COR[c.perfil] : C.mute;
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 0', borderBottom: i < Math.min(clientes.length, 5) - 1 ? `1px solid ${C.hairSoft}` : 'none' }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: C.purple, width: 22, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, color: C.bone, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name || 'Sem nome'}</p>
                    <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10.5, color: C.mute2 }}>+{c.phone}</p>
                  </div>
                  {c.perfil && (
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 15, color: cor, textTransform: 'capitalize', flexShrink: 0 }}>
                      {c.perfil}
                    </span>
                  )}
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.onboarding_complete ? C.teal : C.coral, flexShrink: 0, width: 70, textAlign: 'right' }}>
                    {c.onboarding_complete ? 'completo' : 'pendente'}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 760px) {
          .stat-row   { grid-template-columns: 1fr !important; }
          .stat-row > div { border-right: none !important; border-bottom: 1px solid ${C.hairSoft}; padding-left: 0 !important; }
          .grid-split { grid-template-columns: 1fr !important; gap: 36px !important; }
          .perfil-row { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </div>
  );
}