'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const C = {
  aubergine: '#2D2356', aubergineL: '#4A3B82', lime: '#C8F260',
  coral: '#FF8A65', bone: '#FAF8F4', bone2: '#F2EFE8',
  bone3: '#E8E4DA', bone4: '#D4CFC2', mute: '#6B6478', ink: '#14102A',
  success: '#4ADE80', warning: '#FBBF24', danger: '#F87171',
};

const PERFIL_COR: Record<string, { text: string; bg: string; border: string }> = {
  conservador: { text: C.aubergine,  bg: 'rgba(45,35,86,0.08)',    border: 'rgba(45,35,86,0.18)' },
  moderado:    { text: '#C4612A',    bg: 'rgba(255,138,101,0.08)', border: 'rgba(255,138,101,0.2)' },
  arrojado:    { text: '#5A7A10',    bg: 'rgba(200,242,96,0.12)',  border: 'rgba(200,242,96,0.3)' },
};

const PERFIL_DESC: Record<string, string> = {
  conservador: 'Foco em renda fixa, Tesouro Direto, CDBs e LCI/LCA. Tom cauteloso, priorizando segurança.',
  moderado:    'Equilíbrio entre renda fixa e variável, fundos multimercado, FIIs e ETFs.',
  arrojado:    'Renda variável, ações da B3, ETFs, FIIs e diversificação global. Tom analítico.',
};

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}

export default function BotPage() {
  const [stats, setStats] = useState<any>(null);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: `2px solid ${C.bone3}`, borderTop: `2px solid ${C.aubergine}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: C.mute, fontSize: 13 }}>Carregando...</p>
    </div>
  );

  const totalPerfis = stats?.perfis?.reduce((a: number, p: any) => a + parseInt(p.total), 0) ?? 0;
  const taxaConversao = clientes.length > 0 ? Math.round((totalPerfis / clientes.length) * 100) : 0;

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
    { name: 'Anthropic Claude', desc: 'Motor de IA principal', status: 'ativo', color: C.success },
    { name: 'Meta WhatsApp', desc: 'Webhook configurado', status: 'dev mode', color: C.warning },
    { name: 'Brapi API', desc: 'Cotações B3 em tempo real', status: 'ativo', color: C.success },
    { name: 'AbacatePay', desc: 'Billing e pagamentos Pix', status: 'ativo', color: C.success },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
          fontSize: 38, fontWeight: 400, color: C.aubergine, lineHeight: 1, marginBottom: 6,
        }}>Bot & IA.</h1>
        <p style={{ color: C.mute, fontSize: 13 }}>Motor de inteligência artificial e configurações do assistente Payroll</p>
      </div>

      {/* Cards motor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }} className="grid-4">
        {[
          { label: 'Modelo IA',    value: 'Sonnet 4.6', sub: 'claude-sonnet-4-6',    color: C.aubergineL },
          { label: 'Max tokens',   value: '1.024',      sub: 'por resposta',          color: C.ink },
          { label: 'Histórico',    value: '10 msgs',    sub: 'contexto por conversa', color: C.ink },
          { label: 'Suitability',  value: '8 pergs',    sub: 'validade de 1 ano',     color: C.ink },
        ].map(card => (
          <Card key={card.label}>
            <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{card.label}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: card.color, letterSpacing: '-0.5px', lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 12, color: C.mute, marginTop: 8 }}>{card.sub}</p>
          </Card>
        ))}
      </div>

      {/* Perfis + Progresso */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="grid-2">

        {/* Perfis */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Perfis de Investidor</p>
            <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: C.mute }}>{totalPerfis} classificados</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['conservador', 'moderado', 'arrojado'].map(perfil => {
              const found = stats?.perfis?.find((p: any) => p.perfil === perfil);
              const total = found ? parseInt(found.total) : 0;
              const pct = totalPerfis > 0 ? Math.round((total / totalPerfis) * 100) : 0;
              const cor = PERFIL_COR[perfil];
              return (
                <div key={perfil} style={{ padding: 14, background: cor.bg, border: `1px solid ${cor.border}`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: cor.text }} />
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize', color: cor.text }}>{perfil}</span>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", fontWeight: 600, color: cor.text }}>{total} · {pct}%</span>
                  </div>
                  <p style={{ fontSize: 11, color: C.mute, lineHeight: 1.5, marginBottom: 8 }}>{PERFIL_DESC[perfil]}</p>
                  <div style={{ height: 3, background: C.bone3, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cor.text, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Progresso + Quick stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Progresso de Implantação</p>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: pctPronto >= 70 ? C.success : C.warning }}>
                {pctPronto}%
              </span>
            </div>
            <div style={{ height: 5, background: C.bone3, borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${pctPronto}%`, background: C.aubergine, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendencias.map(p => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: p.done ? C.aubergine : 'transparent', border: `1.5px solid ${p.done ? C.aubergine : C.bone4}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.done && <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth={3} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ fontSize: 12, color: p.done ? C.ink : C.bone4 }}>{p.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick stats */}
          <Card style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16 }}>
            {[
              { label: 'Total usuários',  value: clientes.length, color: C.aubergine },
              { label: 'Perfis calc.',    value: totalPerfis,     color: C.aubergineL },
              { label: 'Mensagens',       value: stats?.totalMensagens ?? 0, color: C.ink },
              { label: 'Taxa conversão',  value: `${taxaConversao}%`, color: C.success },
            ].map(item => (
              <div key={item.label} style={{ padding: '12px', borderRadius: 10, background: C.bone, border: `1px solid ${C.bone3}` }}>
                <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</p>
                <p style={{ fontSize: 22, fontWeight: 600, color: item.color }}>{item.value}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Integrações */}
      <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bone3}` }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Integrações & Serviços</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="grid-integracoes">
          {integracoes.map(({ name, desc, status, color }, i) => (
            <div key={name} style={{
              padding: 20,
              borderRight: i < 3 ? `1px solid ${C.bone3}` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}10`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                </div>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, color, background: `${color}10`, border: `1px solid ${color}25`, fontFamily: "'Geist Mono', monospace" }}>
                  {status}
                </span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4 }}>{name}</p>
              <p style={{ fontSize: 11, color: C.mute }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-integracoes { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .grid-integracoes { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}