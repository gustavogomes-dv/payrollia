'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/lib/api';

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

const PERFIL_COR: Record<string, string> = {
  conservador: '#3b82f6',
  moderado: '#f59e0b',
  arrojado: '#ef4444',
};

function GrowthChart({ crescimento }: { crescimento: { dia: string; total: string }[] }) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hoje = new Date();
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const found = crescimento.find(c => c.dia?.startsWith(key));
    return { dia: key, label: days[d.getDay()], total: found ? parseInt(found.total) : 0 };
  });
  const max = Math.max(...ultimos7.map(d => d.total), 1);
  const totalSemana = ultimos7.reduce((a, b) => a + b.total, 0);

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Novos cadastros — 7 dias</p>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 20 }}>
          {totalSemana} total
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
        {ultimos7.map((d) => {
          const h = d.total > 0 ? Math.max((d.total / max) * 68, 8) : 3;
          const isToday = d.dia === hoje.toISOString().split('T')[0];
          return (
            <div key={d.dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: d.total > 0 ? '#4ade80' : 'transparent', fontWeight: 600 }}>
                {d.total > 0 ? d.total : '·'}
              </span>
              <div style={{
                width: '100%', height: h,
                background: isToday ? '#4ade80' : d.total > 0 ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.05)',
                borderRadius: 4,
              }} />
              <span style={{ fontSize: 10, color: isToday ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)' }}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saudacao, setSaudacao] = useState('');

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
        <div style={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.08)', borderTop: '2px solid #4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Carregando...</p>
      </div>
    );
  }

  const totalUsuarios = stats?.totalUsuarios ?? 0;
  const novosSemana = stats?.novosSemana ?? 0;
  const novosHoje = stats?.novosHoje ?? 0;
  const mrr = stats?.mrr ?? '0.00';
  const completos = stats?.onboardingCompletos ?? 0;
  const taxaConversao = totalUsuarios > 0 ? Math.round((completos / totalUsuarios) * 100) : 0;
  const totalPerfis = stats?.perfis?.reduce((a, p) => a + parseInt(p.total), 0) ?? 0;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 4 }}>
            {saudacao}, Gustavo
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 8, padding: '8px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ fontSize: 13, color: '#4ade80' }}>Sistema operacional</span>
        </div>
      </div>

      {/* Cards topo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        {[
          { label: 'Usuários totais', value: totalUsuarios, sub: `+${novosSemana} esta semana`, color: '#fff' },
          { label: 'Online agora', value: totalUsuarios > 0 ? Math.max(1, Math.floor(totalUsuarios * 0.05)) : 0, sub: 'estimativa ativa', color: '#4ade80' },
          { label: 'Novos hoje', value: novosHoje, sub: 'últimas 24h', color: '#a78bfa' },
          { label: 'Novos na semana', value: novosSemana, sub: 'últimos 7 dias', color: '#fbbf24' },
        ].map((card) => (
          <div key={card.label} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 18px', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{card.label}</p>
            <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1.5px', color: card.color, lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 8 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* MRR + Gráfico */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 14 }} className="grid-mrr">
        <div style={{ border: '1px solid rgba(74,222,128,0.18)', borderRadius: 14, padding: '22px 20px', background: 'rgba(74,222,128,0.02)' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Receita mensal (MRR)</p>
          <p style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-2px', color: '#4ade80', lineHeight: 1 }}>
            R$ {parseFloat(mrr).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 10 }}>calculado pelos planos ativos</p>
        </div>
        {stats?.crescimento && <GrowthChart crescimento={stats.crescimento} />}
      </div>

      {/* Funil + Perfis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-2">

        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Funil de Onboarding</p>
            <span style={{ fontSize: 18, fontWeight: 700, color: taxaConversao >= 50 ? '#4ade80' : '#fbbf24' }}>{taxaConversao}%</span>
          </div>
          {[
            { label: 'Cadastrados', value: totalUsuarios, max: totalUsuarios, color: 'rgba(255,255,255,0.6)' },
            { label: 'Iniciaram suitability', value: totalUsuarios, max: totalUsuarios, color: '#a78bfa' },
            { label: 'Completaram suitability', value: completos, max: totalUsuarios, color: '#4ade80' },
          ].map((item) => {
            const pct = item.max > 0 ? Math.round((item.value / item.max) * 100) : 0;
            return (
              <div key={item.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.value} ({pct}%)</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: 4, opacity: 0.75 }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>taxa de conversão</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: taxaConversao >= 50 ? '#4ade80' : '#fbbf24' }}>{taxaConversao}%</span>
          </div>
        </div>

        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Distribuição de Perfis</p>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>{totalPerfis} perfis</span>
          </div>
          {totalPerfis === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, gap: 8 }}>
              <div style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
              <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 13 }}>Aguardando primeiros perfis</p>
            </div>
          ) : (
            ['conservador', 'moderado', 'arrojado'].map((perfil) => {
              const found = stats?.perfis.find(p => p.perfil === perfil);
              const total = found ? parseInt(found.total) : 0;
              const pct = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
              return (
                <div key={perfil} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{perfil}</span>
                    <span style={{ color: PERFIL_COR[perfil], fontWeight: 600 }}>{total} · {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: PERFIL_COR[perfil], borderRadius: 4, opacity: 0.75 }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Últimos clientes */}
      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Últimos Clientes</p>
          <a href="/clientes" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Ver todos →</a>
        </div>
        {clientes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            Nenhum cliente ainda.
          </div>
        ) : (
          clientes.slice(0, 5).map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: c.perfil ? `${PERFIL_COR[c.perfil]}18` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${c.perfil ? PERFIL_COR[c.perfil] + '35' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                color: c.perfil ? PERFIL_COR[c.perfil] : 'rgba(255,255,255,0.35)',
              }}>
                {c.name ? c.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name || 'Sem nome'}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace' }}>+{c.phone}</p>
              </div>
              {c.perfil && (
                <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, color: PERFIL_COR[c.perfil], background: `${PERFIL_COR[c.perfil]}12`, border: `1px solid ${PERFIL_COR[c.perfil]}28`, textTransform: 'capitalize', flexShrink: 0 }}>
                  {c.perfil}
                </span>
              )}
              <span style={{ fontSize: 11, color: c.onboarding_complete ? 'rgba(74,222,128,0.7)' : 'rgba(251,191,36,0.6)', flexShrink: 0 }}>
                {c.onboarding_complete ? 'completo' : 'pendente'}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>
                {new Date(c.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Responsivo */}
      <style>{`
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-mrr { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}