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

// ─── Filtro de período ────────────────────────────────────────────────────────
function FiltroPeriodo({ valor, onChange }: { valor: Periodo; onChange: (p: Periodo) => void }) {
  const opcoes: { label: string; value: Periodo }[] = [
    { label: '7 dias',  value: '7d' },
    { label: '30 dias', value: '30d' },
    { label: '60 dias', value: '60d' },
    { label: '1 ano',   value: '1a' },
  ];
  return (
    <div style={{ display: 'flex', gap: 3, background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 8, padding: 3 }}>
      {opcoes.map(op => (
        <button key={op.value} onClick={() => onChange(op.value)} style={{
          padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.15s',
          background: valor === op.value ? C.aubergine : 'transparent',
          color: valor === op.value ? C.lime : C.mute,
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
  const dias = { '7d': 7, '30d': 30, '60d': 60, '1a': 365 }[periodo];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Para períodos longos, agrupa por semana ou mês
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
    // Agrupa por semana (4 semanas)
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
    // Agrupa por quinzena (4 quinzenas)
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
    // 1 ano: agrupa por mês (12 meses)
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
    <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Novos cadastros</p>
          <p style={{ fontSize: 11, color: C.mute, marginTop: 2 }}>últimos {labelPeriodo}</p>
        </div>
        <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: C.mute, background: C.bone3, padding: '3px 10px', borderRadius: 20 }}>
          {totalPeriodo} total
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: pontos.length > 8 ? 4 : 8, height: 72 }}>
        {pontos.map((p, i) => {
          const h = p.total > 0 ? Math.max((p.total / max) * 56, 8) : 3;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {p.total > 0 && (
                <span style={{ fontSize: 9, fontFamily: "'Geist Mono', monospace", color: p.isHoje ? C.aubergine : C.mute, fontWeight: 600 }}>
                  {p.total}
                </span>
              )}
              <div style={{ width: '100%', height: h, background: p.isHoje ? C.lime : p.total > 0 ? 'rgba(45,35,86,0.3)' : C.bone3, borderRadius: 4 }} />
              <span style={{ fontSize: 9, fontFamily: "'Geist Mono', monospace", color: p.isHoje ? C.aubergine : C.mute }}>
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card de métrica ──────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, padding: '20px 18px' }}>
      <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </p>
      <p style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-1.5px', color, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: C.mute, marginTop: 8 }}>{sub}</p>
    </div>
  );
}

// ─── Barra de progresso ───────────────────────────────────────────────────────
function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: C.mute }}>{label}</span>
        <span style={{ color, fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>
          {value} ({pct}%)
        </span>
      </div>
      <div style={{ height: 5, background: C.bone3, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 28, height: 28, border: `2px solid ${C.bone3}`, borderTop: `2px solid ${C.aubergine}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: C.mute, fontSize: 13 }}>Carregando...</p>
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

  const cardStyle: React.CSSProperties = {
    background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, padding: 20,
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
            fontSize: 38, fontWeight: 400, color: C.aubergine, lineHeight: 1, marginBottom: 6,
          }}>
            {saudacao}, Gustavo.
          </h1>
          <p style={{ color: C.mute, fontSize: 13 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <FiltroPeriodo valor={periodo} onChange={setPeriodo} />
      </div>

      {/* Cards métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        <MetricCard label="Usuários totais" value={totalUsuarios} sub={`+${novosSemana} esta semana`}         color={C.aubergine} />
        <MetricCard label="Online agora"    value={totalUsuarios > 0 ? Math.max(1, Math.floor(totalUsuarios * 0.05)) : 0} sub="estimativa ativa" color={C.success} />
        <MetricCard label="Novos hoje"      value={novosHoje}     sub="últimas 24h"                           color={C.coral} />
        <MetricCard label="Novos na semana" value={novosSemana}   sub="últimos 7 dias"                        color={C.aubergine} />
      </div>

      {/* MRR + Gráfico */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 14 }} className="grid-mrr">
        <div style={{ background: C.aubergine, borderRadius: 14, padding: '22px 20px' }}>
          <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: 'rgba(200,242,96,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Receita mensal · MRR
          </p>
          <p style={{ fontSize: 38, fontWeight: 600, fontFamily: "'Geist Mono', monospace", letterSpacing: '-2px', color: C.lime, lineHeight: 1 }}>
            R$ {parseFloat(mrr).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 10 }}>calculado pelos planos ativos</p>
        </div>
        {stats?.crescimento && (
          <GrowthChart crescimento={stats.crescimento} periodo={periodo} />
        )}
      </div>

      {/* Funil + Perfis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-2">

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Funil de Onboarding</p>
            <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Geist Mono', monospace", color: taxaConversao >= 50 ? C.success : C.warning }}>
              {taxaConversao}%
            </span>
          </div>
          <ProgressBar label="Cadastrados"             value={totalUsuarios} max={totalUsuarios} color={C.bone4} />
          <ProgressBar label="Iniciaram suitability"   value={totalUsuarios} max={totalUsuarios} color={C.aubergineL} />
          <ProgressBar label="Completaram suitability" value={completos}     max={totalUsuarios} color={C.success} />
          <div style={{ marginTop: 8, padding: '10px 14px', background: C.bone, border: `1px solid ${C.bone3}`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: C.mute }}>taxa de conversão</span>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: taxaConversao >= 50 ? C.success : C.warning }}>
              {taxaConversao}%
            </span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Distribuição de Perfis</p>
            <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: C.mute }}>{totalPerfis} perfis</span>
          </div>
          {totalPerfis === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, gap: 8 }}>
              <div style={{ width: 32, height: 32, border: `1px solid ${C.bone3}`, borderRadius: 8 }} />
              <p style={{ color: C.mute, fontSize: 13 }}>Aguardando primeiros perfis</p>
            </div>
          ) : (
            ['conservador', 'moderado', 'arrojado'].map(perfil => {
              const found = stats?.perfis.find(p => p.perfil === perfil);
              const total = found ? parseInt(found.total) : 0;
              const pct   = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
              const cor   = PERFIL_COR[perfil];
              return (
                <div key={perfil} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: C.mute, textTransform: 'capitalize' }}>{perfil}</span>
                    <span style={{ color: cor.text, fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>{total} · {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: C.bone3, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cor.text, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Últimos clientes */}
      <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bone3}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Últimos Clientes</p>
          <a href="/clientes" style={{ fontSize: 12, color: C.mute, textDecoration: 'none' }}>Ver todos →</a>
        </div>
        {clientes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: C.mute, fontSize: 13 }}>
            Nenhum cliente ainda.
          </div>
        ) : (
          clientes.slice(0, 5).map((c, i) => {
            const cor = c.perfil ? PERFIL_COR[c.perfil] : null;
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: i < Math.min(clientes.length, 5) - 1 ? `1px solid ${C.bone3}` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: cor ? cor.bg : C.bone3, border: `1px solid ${cor ? cor.border : C.bone4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: cor ? cor.text : C.mute }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name || 'Sem nome'}</p>
                  <p style={{ fontSize: 11, color: C.mute, fontFamily: "'Geist Mono', monospace" }}>+{c.phone}</p>
                </div>
                {c.perfil && cor && (
                  <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, color: cor.text, background: cor.bg, border: `1px solid ${cor.border}`, textTransform: 'capitalize', flexShrink: 0, fontWeight: 500 }}>
                    {c.perfil}
                  </span>
                )}
                <span style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: c.onboarding_complete ? '#166534' : '#92400E', flexShrink: 0 }}>
                  {c.onboarding_complete ? 'completo' : 'pendente'}
                </span>
                <span style={{ fontSize: 11, color: C.mute, flexShrink: 0, fontFamily: "'Geist Mono', monospace" }}>
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-4   { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-mrr { grid-template-columns: 1fr !important; }
          .grid-2   { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}