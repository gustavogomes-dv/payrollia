'use client';
import { useState } from 'react';

const C = {
  aubergine: '#2D2356', aubergineL: '#4A3B82', lime: '#C8F260',
  coral: '#FF8A65', bone: '#FAF8F4', bone2: '#F2EFE8',
  bone3: '#E8E4DA', bone4: '#D4CFC2', mute: '#6B6478', ink: '#14102A',
  success: '#4ADE80', warning: '#FBBF24', danger: '#F87171',
};

const TABS = ['Geral', 'IA & Motor', 'WhatsApp', 'Suitability', 'Integrações', 'Danger Zone'];

const PERFIL_COR: Record<string, { text: string; bg: string; border: string }> = {
  conservador: { text: C.aubergine, bg: 'rgba(45,35,86,0.08)', border: 'rgba(45,35,86,0.18)' },
  moderado:    { text: '#C4612A', bg: 'rgba(255,138,101,0.08)', border: 'rgba(255,138,101,0.2)' },
  arrojado:    { text: '#5A7A10', bg: 'rgba(200,242,96,0.12)', border: 'rgba(200,242,96,0.3)' },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ padding: '10px 20px', borderBottom: `1px solid ${C.bone3}`, background: C.bone }}>
        <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, mono, type = 'text' }: { label: string; value?: string; mono?: boolean; type?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', borderBottom: `1px solid ${C.bone3}` }}>
      <span style={{ fontSize: 13, color: C.mute }}>{label}</span>
      {type === 'password' ? (
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: C.bone4, letterSpacing: '0.1em' }}>{'•'.repeat(20)}</span>
      ) : type === 'status' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
          <span style={{ fontSize: 13, color: C.success }}>{value}</span>
        </div>
      ) : (
        <span style={{ fontSize: 13, color: C.ink, fontFamily: mono ? "'Geist Mono', monospace" : 'inherit', fontWeight: mono ? 400 : 500 }}>{value}</span>
      )}
    </div>
  );
}

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('Geral');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 38, fontWeight: 400, color: C.aubergine, lineHeight: 1, marginBottom: 6 }}>Config.</h1>
          <p style={{ color: C.mute, fontSize: 13 }}>Configurações e parâmetros do sistema Payroll</p>
        </div>
        <span style={{ fontSize: 10, padding: '4px 12px', borderRadius: 20, color: C.mute, background: C.bone3, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.06em' }}>
          somente leitura
        </span>
      </div>

      {/* Aviso */}
      <div style={{ border: `1px solid rgba(251,191,36,0.25)`, borderRadius: 10, padding: '12px 16px', background: 'rgba(251,191,36,0.04)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.warning} strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <p style={{ fontSize: 13, color: C.mute }}>
          Para alterar configurações, edite{' '}
          <code style={{ fontFamily: "'Geist Mono', monospace", color: C.ink, background: C.bone3, padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>src/.env</code>
          {' '}e reinicie o servidor no Railway.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: C.bone2, borderRadius: 10, padding: 4, border: `1px solid ${C.bone3}`, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '8px 6px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 500, transition: 'all 0.15s', whiteSpace: 'nowrap',
            background: activeTab === tab
              ? (tab === 'Danger Zone' ? 'rgba(248,113,113,0.1)' : C.aubergine)
              : 'transparent',
            color: activeTab === tab
              ? (tab === 'Danger Zone' ? C.danger : C.lime)
              : (tab === 'Danger Zone' ? C.danger : C.mute),
            fontFamily: 'inherit',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Geral */}
      {activeTab === 'Geral' && (
        <>
          <Section title="Identidade">
            <Row label="Nome do produto" value="Payroll" />
            <Row label="Versão" value="1.0.0-dev" />
            <Row label="Ambiente" value="production" />
            <Row label="Tenant ID" value="00000000-0000-0000-0000-000000000001" mono />
          </Section>
          <Section title="Banco de Dados">
            <Row label="Provider" value="PostgreSQL 15 — Railway" />
            <Row label="Senha" type="password" />
            <Row label="Status" value="Conectado" type="status" />
          </Section>
          <Section title="Cache">
            <Row label="Provider" value="Redis 7 — Railway" />
            <Row label="TTL usuário" value="1 hora" />
            <Row label="Status" value="Conectado" type="status" />
          </Section>
        </>
      )}

      {/* Tab: IA & Motor */}
      {activeTab === 'IA & Motor' && (
        <>
          <Section title="Modelo de IA">
            <Row label="Provedor" value="Anthropic" />
            <Row label="Modelo" value="claude-sonnet-4-6" mono />
            <Row label="Máximo de tokens" value="1.024 por resposta" />
            <Row label="Chave API" type="password" />
            <Row label="Status" value="Operacional" type="status" />
          </Section>
          <Section title="Comportamento">
            <Row label="Mensagens no contexto" value="Últimas 10" />
            <Row label="Detecção de ticker" value="Ativada (automática)" />
            <Row label="Cotações em tempo real" value="Ativada (Brapi)" />
            <Row label="Idioma" value="Português (BR)" />
          </Section>
          <Section title="Perfis de Investidor">
            {['conservador', 'moderado', 'arrojado'].map(perfil => {
              const cor = PERFIL_COR[perfil];
              return (
                <div key={perfil} style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bone3}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, color: cor.text, background: cor.bg, border: `1px solid ${cor.border}`, textTransform: 'capitalize', flexShrink: 0, fontWeight: 500 }}>
                    {perfil}
                  </span>
                  <p style={{ fontSize: 12, color: C.mute, lineHeight: 1.5 }}>
                    {{ conservador: 'Tom cauteloso. Foco em renda fixa, Tesouro Direto, CDBs e LCI/LCA.', moderado: 'Tom equilibrado. Foco em fundos multimercado, FIIs e ETFs.', arrojado: 'Tom analítico. Foco em renda variável, ações, ETFs e diversificação global.' }[perfil]}
                  </p>
                </div>
              );
            })}
          </Section>
          <Section title="Diretrizes CVM">
            <Row label="Bot educacional (não recomenda ativos)" value="Ativado" />
            <Row label="Disclaimer obrigatório no onboarding" value="Ativado" />
            <Row label="Sugere consulta a assessor" value="Ativado" />
          </Section>
        </>
      )}

      {/* Tab: WhatsApp */}
      {activeTab === 'WhatsApp' && (
        <>
          <Section title="Meta Cloud API">
            <Row label="App ID" value="1641374667155681" mono />
            <Row label="Phone Number ID" value="1103477599518286" mono />
            <Row label="Número" value="(35) 91014-8222" />
            <Row label="WABA ID" value="8095055753583375" mono />
            <Row label="Access Token" type="password" />
            <Row label="Verify Token" type="password" />
            <Row label="Modo do App" value="Development" />
          </Section>
          <Section title="Webhook">
            <Row label="URL" value="https://payrollia-production.up.railway.app/webhook" mono />
            <Row label="Campo inscrito" value="messages" />
            <Row label="Versão da API" value="v25.0" />
            <Row label="Status" value="Verificado" type="status" />
          </Section>
          <Section title="Limitações (modo Development)">
            <div style={{ padding: '16px 20px' }}>
              {[
                'Token de acesso é temporário — expira periodicamente',
                'Necessário criar token permanente via Meta Business Manager',
                'Verificação do negócio pendente — documentos enviados',
                'Para receber mensagens reais, migrar para modo Live após aprovação',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.warning, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 12, color: C.mute }}>{item}</span>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* Tab: Suitability */}
      {activeTab === 'Suitability' && (
        <>
          <Section title="Questionário">
            <Row label="Total de perguntas" value="8 perguntas" />
            <Row label="Formato de resposta" value="Número (1, 2, 3...)" />
            <Row label="Validade do perfil" value="1 ano" />
            <Row label="Segue diretrizes" value="CVM + ANBIMA (educacional)" />
          </Section>
          <Section title="Cálculo de Perfil">
            <Row label="Pontuação mínima" value="8 pontos" />
            <Row label="Pontuação máxima" value="23 pontos" />
            <Row label="Conservador" value="8 a 12 pontos" />
            <Row label="Moderado" value="13 a 18 pontos" />
            <Row label="Arrojado" value="19 a 23 pontos" />
          </Section>
          <Section title="Perguntas do Questionário">
            {[
              { id: 1, tema: 'Objetivo de investimento', opcoes: 4 },
              { id: 2, tema: 'Horizonte de investimento', opcoes: 4 },
              { id: 3, tema: 'Reação a quedas', opcoes: 4 },
              { id: 4, tema: 'Experiência com investimentos', opcoes: 4 },
              { id: 5, tema: 'Renda mensal', opcoes: 4 },
              { id: 6, tema: 'Patrimônio total', opcoes: 4 },
              { id: 7, tema: 'Dependentes financeiros', opcoes: 2 },
              { id: 8, tema: 'Tolerância ao risco', opcoes: 3 },
            ].map((q, i) => (
              <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: i < 7 ? `1px solid ${C.bone3}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: C.aubergine, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: C.lime, flexShrink: 0, fontFamily: "'Geist Mono', monospace" }}>
                    {q.id}
                  </span>
                  <span style={{ fontSize: 13, color: C.ink }}>{q.tema}</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: C.mute }}>{q.opcoes} opções</span>
              </div>
            ))}
          </Section>
        </>
      )}

      {/* Tab: Integrações */}
      {activeTab === 'Integrações' && (
        <>
          {[
            { name: 'Anthropic Claude API', status: 'ativo', statusColor: C.success, items: [{ label: 'Modelo', value: 'claude-sonnet-4-6' }, { label: 'Custo estimado', value: '~$0,001 por mensagem' }, { label: 'Status', value: 'Operacional', type: 'status' }] },
            { name: 'Brapi (Cotações B3)', status: 'ativo', statusColor: C.success, items: [{ label: 'Endpoint', value: 'brapi.dev/api/quote/{ticker}', mono: true }, { label: 'Plano', value: 'Gratuito' }, { label: 'Status', value: 'Operacional', type: 'status' }] },
            { name: 'Meta WhatsApp API', status: 'dev mode', statusColor: C.warning, items: [{ label: 'Versão', value: 'v25.0' }, { label: 'Modo', value: 'Development' }, { label: 'Status', value: 'Configurado', type: 'status' }] },
            { name: 'AbacatePay (Pix)', status: 'ativo', statusColor: C.success, items: [{ label: 'Produto Pro', value: 'R$ 12,90 / avulso' }, { label: 'Produto Business', value: 'R$ 29,90 / avulso' }, { label: 'Webhook', value: 'Ativo' }] },
          ].map(integ => (
            <Section key={integ.name} title={integ.name}>
              <div style={{ padding: '10px 20px 6px', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, color: integ.statusColor, background: `${integ.statusColor}10`, border: `1px solid ${integ.statusColor}25`, fontFamily: "'Geist Mono', monospace" }}>
                  {integ.status}
                </span>
              </div>
              {integ.items.map(item => (
                <Row key={item.label} label={item.label} value={item.value} mono={'mono' in item ? !!item.mono : false} type={'type' in item ? item.type : 'text'} />
              ))}
            </Section>
          ))}
        </>
      )}

      {/* Tab: Danger Zone */}
      {activeTab === 'Danger Zone' && (
        <>
          <div style={{ border: `1px solid rgba(248,113,113,0.2)`, borderRadius: 12, padding: '16px 20px', background: 'rgba(248,113,113,0.03)', marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.danger, marginBottom: 6 }}>Zona de Perigo</p>
            <p style={{ fontSize: 13, color: C.mute, lineHeight: 1.6 }}>
              As ações abaixo são irreversíveis e afetam dados reais do banco. Use somente em desenvolvimento.
            </p>
          </div>

          {[
            { title: 'Limpar dados de teste', desc: 'Remove usuários, sessões e perfis. Mantém o tenant padrão.', cmd: 'psql -U payroll -d payroll -c "DELETE FROM sessions; DELETE FROM investor_profiles; DELETE FROM users;"', color: C.warning },
            { title: 'Recriar tenant padrão', desc: 'Recria o tenant após limpar o banco.', cmd: `INSERT INTO tenants (id, name, whatsapp_phone_id) VALUES ('00000000-...', 'Payroll Default', 'default') ON CONFLICT DO NOTHING;`, color: C.aubergineL },
            { title: 'Resetar banco completo', desc: 'Para o Railway Postgres, reinicia do zero. Todos os dados são perdidos.', cmd: 'Execute via Railway Dashboard → PostgreSQL → Query', color: C.danger },
          ].map(action => (
            <div key={action.title} style={{ border: `1px solid ${action.color}20`, borderRadius: 12, padding: 18, background: `${action.color}04`, marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: action.color, marginBottom: 6 }}>{action.title}</p>
              <p style={{ fontSize: 12, color: C.mute, marginBottom: 12, lineHeight: 1.5 }}>{action.desc}</p>
              <div style={{ background: C.ink, borderRadius: 8, padding: '10px 14px', fontFamily: "'Geist Mono', monospace", fontSize: 11, color: 'rgba(250,248,244,0.6)', wordBreak: 'break-all', lineHeight: 1.6 }}>
                {action.cmd}
              </div>
            </div>
          ))}

          <div style={{ background: C.bone2, border: `1px solid ${C.bone3}`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.warning, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: C.mute }}>Sempre faça backup antes de resetar o banco em produção</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}