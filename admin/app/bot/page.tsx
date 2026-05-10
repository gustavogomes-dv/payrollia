import API_URL from '@/lib/api';
import {
  Brain,
  MessageSquare,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Circle,
  Cpu,
  Hash,
  Clock,
  ClipboardList,
  Zap,
  Users,
  BarChart2,
  ArrowUpRight,
} from 'lucide-react';

async function getStats() {
  try {
    const res = await fetch(`${API_URL}/admin/stats`, { cache: 'no-store' });
    return res.json();
  } catch {
    return { totalUsuarios: 0, totalMensagens: 0, perfis: [] };
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

const PERFIL_DESC: Record<string, string> = {
  conservador: 'Foco em renda fixa, Tesouro Direto, CDBs e LCI/LCA. Tom cauteloso, priorizando segurança e previsibilidade.',
  moderado: 'Equilíbrio entre renda fixa e variável, fundos multimercado, FIIs e ETFs. Tom equilibrado, apresentando prós e contras.',
  arrojado: 'Renda variável, ações da B3, ETFs, FIIs e diversificação global. Tom direto e analítico, explorando conceitos avançados.',
};

export default async function BotPage() {
  const [stats, clientes] = await Promise.all([getStats(), getClientes()]);
  const totalPerfis = stats.perfis?.reduce((a: number, p: { total: string }) => a + parseInt(p.total), 0) ?? 0;
  const taxaConversao = clientes.length > 0 ? Math.round((totalPerfis / clientes.length) * 100) : 0;

  const motorCards = [
    { label: 'Modelo IA', value: 'Sonnet 4.6', sub: 'claude-sonnet-4-6', color: '#a78bfa', icon: Cpu },
    { label: 'Max tokens', value: '1.024', sub: 'por resposta', color: '#fff', icon: Hash },
    { label: 'Histórico', value: '10 msgs', sub: 'contexto por conversa', color: '#fff', icon: Clock },
    { label: 'Suitability', value: '8 perguntas', sub: 'validade de 1 ano', color: '#fff', icon: ClipboardList },
  ];

  const pendencias = [
    { label: 'Créditos Anthropic API configurados', done: true },
    { label: 'Webhook WhatsApp configurado', done: true },
    { label: 'WHATSAPP_TOKEN e PHONE_ID no Railway', done: true },
    { label: 'AbacatePay integrado', done: true },
    { label: 'Token permanente da Meta', done: false },
    { label: 'Modo Live na Meta', done: false },
    { label: 'Verificação do negócio Meta aprovada', done: false },
  ];

  const feitas = pendencias.filter(p => p.done).length;
  const pctPronto = Math.round((feitas / pendencias.length) * 100);

  const integracoes = [
    { name: 'Anthropic Claude', desc: 'Motor de IA principal', status: 'ativo', color: '#4ade80', icon: Brain },
    { name: 'Meta WhatsApp', desc: 'Webhook configurado', status: 'dev mode', color: '#fbbf24', icon: MessageSquare },
    { name: 'Brapi API', desc: 'Cotações B3 em tempo real', status: 'ativo', color: '#4ade80', icon: TrendingUp },
    { name: 'AbacatePay', desc: 'Billing e pagamentos', status: 'ativo', color: '#4ade80', icon: CreditCard },
  ];

  const quickStats = [
    { label: 'Total usuários', value: clientes.length, color: '#fff', icon: Users },
    { label: 'Perfis calculados', value: totalPerfis, color: '#a78bfa', icon: BarChart2 },
    { label: 'Mensagens', value: stats.totalMensagens ?? 0, color: '#3b82f6', icon: MessageSquare },
    { label: 'Taxa conversão', value: `${taxaConversao}%`, color: '#4ade80', icon: ArrowUpRight },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>Bot & IA</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 4 }}>
            Motor de inteligência artificial e configurações do assistente Payroll
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 8, padding: '8px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ fontSize: 13, color: '#4ade80' }}>Bot operacional</span>
        </div>
      </div>

      {/* Cards motor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        {motorCards.map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 18px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <Icon size={14} color='rgba(255,255,255,0.25)' />
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 8 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Perfis + Progresso */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-2">

        {/* Perfis */}
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Perfis de Investidor</p>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>{totalPerfis} classificados</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['conservador', 'moderado', 'arrojado'].map((perfil) => {
              const found = stats.perfis?.find((p: { perfil: string; total: string }) => p.perfil === perfil);
              const total = found ? parseInt(found.total) : 0;
              const pct = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
              return (
                <div key={perfil} style={{ padding: 14, background: `${PERFIL_COR[perfil]}07`, border: `1px solid ${PERFIL_COR[perfil]}18`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: PERFIL_COR[perfil] }} />
                      <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize', color: PERFIL_COR[perfil] }}>{perfil}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: PERFIL_COR[perfil] }}>{total} · {pct}%</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', lineHeight: 1.55, marginBottom: 10 }}>{PERFIL_DESC[perfil]}</p>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: PERFIL_COR[perfil], borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progresso + Quick stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Progresso */}
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Progresso de Implantação</p>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>{pctPronto}%</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${pctPronto}%`, background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {pendencias.map((p) => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {p.done
                    ? <CheckCircle2 size={14} color='#4ade80' style={{ flexShrink: 0 }} />
                    : <Circle size={14} color='rgba(255,255,255,0.18)' style={{ flexShrink: 0 }} />
                  }
                  <span style={{ fontSize: 12, color: p.done ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)' }}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickStats.map(({ label, value, color, icon: Icon }) => (
              <div key={label} style={{ padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Icon size={12} color='rgba(255,255,255,0.22)' />
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</p>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrações */}
      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={14} color='rgba(255,255,255,0.4)' />
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Integrações & Serviços</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="grid-integracoes">
          {integracoes.map(({ name, desc, status, color, icon: Icon }, i) => (
            <div key={name} style={{ padding: 20, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }} className="integracao-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}10`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={color} />
                </div>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, color, background: `${color}12`, border: `1px solid ${color}25` }}>
                  {status}
                </span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-integracoes { grid-template-columns: repeat(2, 1fr) !important; }
          .integracao-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .grid-integracoes { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}