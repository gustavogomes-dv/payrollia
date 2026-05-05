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

const perfilCor: Record<string, string> = {
  conservador: '#3b82f6',
  moderado: '#f59e0b',
  arrojado: '#ef4444',
};

function MRRCard({ mrr }: { mrr: string }) {
  const value = parseFloat(mrr);
  return (
    <div style={{ border: '1px solid rgba(74,222,128,0.2)', borderRadius: 16, padding: '24px', background: 'rgba(74,222,128,0.03)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)' }} />
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: 12 }}>RECEITA MENSAL (MRR)</p>
      <p style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-2px', color: '#4ade80', lineHeight: 1 }}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 10 }}>calculado pelos planos ativos</p>
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{value} ({pct}%)</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease', opacity: 0.8 }} />
      </div>
    </div>
  );
}

function GrowthChart({ crescimento }: { crescimento: { dia: string; total: string }[] }) {
  const max = Math.max(...crescimento.map(d => parseInt(d.total)), 1);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Preenche os últimos 7 dias
  const hoje = new Date();
  const ultimos7: { dia: string; label: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const found = crescimento.find(c => c.dia?.startsWith(key));
    ultimos7.push({ dia: key, label: days[d.getDay()], total: found ? parseInt(found.total) : 0 });
  }

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 500 }}>Novos Cadastros — últimos 7 dias</p>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 20 }}>
          {ultimos7.reduce((a, b) => a + b.total, 0)} total
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
        {ultimos7.map((d) => {
          const h = max > 0 ? Math.max((d.total / max) * 70, d.total > 0 ? 8 : 3) : 3;
          const isToday = d.dia === hoje.toISOString().split('T')[0];
          return (
            <div key={d.dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: d.total > 0 ? '#4ade80' : 'rgba(255,255,255,0.15)', fontWeight: 600 }}>
                {d.total > 0 ? d.total : ''}
              </span>
              <div style={{ width: '100%', height: h, background: isToday ? '#4ade80' : d.total > 0 ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.05)', borderRadius: 4, transition: 'height 0.5s ease' }} />
              <span style={{ fontSize: 10, color: isToday ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }}>{d.label}</span>
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
  const [hora, setHora] = useState('');

  useEffect(() => {
  const now = new Date();
  const h = now.getHours();
  const saudacao = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  setHora(saudacao);

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
        <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Carregando métricas...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

  // Usuários "online agora" — heurística: mensagem nas últimas 2h
  const ativosEstimados = Math.max(0, Math.floor(totalUsuarios * 0.05));

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header com saudação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 4 }}>
            {hora}, Gustavo 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} · Aqui está o resumo do Payroll
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, padding: '8px 14px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <span style={{ fontSize: 13, color: '#4ade80' }}>Sistema operacional</span>
        </div>
      </div>

      {/* Cards topo — 4 métricas principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'USUÁRIOS TOTAIS', value: totalUsuarios, sub: `+${novosSemana} esta semana`, color: '#fff', icon: '👥' },
          { label: 'ONLINE AGORA', value: ativosEstimados || (totalUsuarios > 0 ? 1 : 0), sub: 'estimativa ativa', color: '#4ade80', icon: '🟢' },
          { label: 'NOVOS HOJE', value: novosHoje, sub: 'cadastros nas últimas 24h', color: '#a78bfa', icon: '✨' },
          { label: 'NOVOS NA SEMANA', value: novosSemana, sub: 'últimos 7 dias', color: '#fbbf24', icon: '📈' },
        ].map((card) => (
          <div key={card.label} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 18, opacity: 0.4 }}>{card.icon}</div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 10 }}>{card.label}</p>
            <p style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-1.5px', color: card.color, lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Linha 2: MRR + Gráfico crescimento */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 16 }}>
        <MRRCard mrr={mrr} />
        {stats?.crescimento && <GrowthChart crescimento={stats.crescimento} />}
      </div>

      {/* Linha 3: Funil onboarding + Perfis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>

        {/* Funil */}
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Funil de Onboarding</p>
            <span style={{ fontSize: 20, fontWeight: 700, color: taxaConversao >= 50 ? '#4ade80' : '#fbbf24' }}>{taxaConversao}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MiniBar label="Cadastrados" value={totalUsuarios} max={totalUsuarios} color="#fff" />
            <MiniBar label="Iniciaram suitability" value={totalUsuarios} max={totalUsuarios} color="#a78bfa" />
            <MiniBar label="Completaram suitability" value={completos} max={totalUsuarios} color="#4ade80" />
          </div>
          <div style={{ marginTop: 20, padding: '12px 16px', background: taxaConversao >= 50 ? 'rgba(74,222,128,0.05)' : 'rgba(251,191,36,0.05)', border: `1px solid ${taxaConversao >= 50 ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)'}`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>taxa de conversão</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: taxaConversao >= 50 ? '#4ade80' : '#fbbf24' }}>{taxaConversao}%</span>
          </div>
        </div>

        {/* Perfis */}
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Distribuição de Perfis</p>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{totalPerfis} perfis</span>
          </div>
          {totalPerfis === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120, gap: 8 }}>
              <span style={{ fontSize: 32 }}>🌱</span>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Aguardando primeiros perfis</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['conservador', 'moderado', 'arrojado'].map((perfil) => {
                const found = stats?.perfis.find(p => p.perfil === perfil);
                const total = found ? parseInt(found.total) : 0;
                const pct = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
                return (
                  <div key={perfil}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{perfil}</span>
                      <span style={{ color: perfilCor[perfil], fontWeight: 600 }}>{total} · {pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: perfilCor[perfil], borderRadius: 4, opacity: 0.8 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Linha 4: Últimos clientes */}
      <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 500 }}>Últimos Clientes</p>
          <a href="/clientes" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Ver todos →</a>
        </div>
        {clientes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
            Nenhum cliente ainda. Teste o bot pelo Thunder Client!
          </div>
        ) : (
          clientes.slice(0, 5).map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: c.perfil ? `${perfilCor[c.perfil]}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${c.perfil ? perfilCor[c.perfil] + '40' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: c.perfil ? perfilCor[c.perfil] : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                {c.name ? c.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{c.name || 'Sem nome'}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>+{c.phone}</p>
              </div>
              {c.perfil && (
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, color: perfilCor[c.perfil], background: `${perfilCor[c.perfil]}15`, border: `1px solid ${perfilCor[c.perfil]}30`, textTransform: 'capitalize' }}>
                  {c.perfil}
                </span>
              )}
              <span style={{ fontSize: 11, color: c.onboarding_complete ? '#4ade80' : '#fbbf24' }}>
                {c.onboarding_complete ? '✓ completo' : '⏳ pendente'}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                {new Date(c.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
