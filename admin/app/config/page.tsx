'use client';
import { useState } from 'react';

const TABS = ['Geral', 'IA & Motor', 'WhatsApp', 'Suitability', 'Integrações', 'Danger Zone'];

const perfilCor: Record<string, string> = {
  conservador: '#3b82f6',
  moderado: '#f59e0b',
  arrojado: '#ef4444',
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, padding: '2px 10px', borderRadius: 20,
      color, background: `${color}15`, border: `1px solid ${color}30`,
    }}>{label}</span>
  );
}

function Row({ label, value, mono, type = 'text' }: { label: string; value: string; mono?: boolean; type?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      {type === 'password' ? (
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>{'•'.repeat(24)}</span>
      ) : type === 'status' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <span style={{ fontSize: 13, color: '#4ade80' }}>{value}</span>
        </div>
      ) : (
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', marginBottom: 16 }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('Geral');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>Config</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
            Configurações e parâmetros do sistema Payroll
          </p>
        </div>
        <Badge label="somente leitura" color="rgba(255,255,255,0.4)" />
      </div>

      {/* Aviso */}
      <div style={{
        border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10,
        padding: '12px 16px', background: 'rgba(251,191,36,0.03)',
        marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span>⚠️</span>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          Para alterar configurações, edite o arquivo{' '}
          <code style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>src/.env</code>
          {' '}e reinicie o servidor.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 500, transition: 'all 0.15s',
            background: activeTab === tab ? (tab === 'Danger Zone' ? '#ef444420' : 'rgba(255,255,255,0.08)') : 'transparent',
            color: activeTab === tab ? (tab === 'Danger Zone' ? '#ef4444' : '#fff') : 'rgba(255,255,255,0.35)',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Geral */}
      {activeTab === 'Geral' && (
        <div>
          <Section title="Identidade">
            <Row label="Nome do produto" value="Payroll" />
            <Row label="Versão" value="1.0.0-dev" />
            <Row label="Ambiente" value="development" />
            <Row label="Tenant padrão" value="Payroll Default" />
            <Row label="Tenant ID" value="00000000-0000-0000-0000-000000000001" mono />
          </Section>
          <Section title="Banco de Dados">
            <Row label="Host" value="localhost" />
            <Row label="Porta" value="5432" />
            <Row label="Banco" value="payroll" />
            <Row label="Usuário" value="payroll" />
            <Row label="Senha" value="" type="password" />
            <Row label="Status PostgreSQL" value="Conectado" type="status" />
          </Section>
          <Section title="Cache">
            <Row label="Redis Host" value="localhost" />
            <Row label="Redis Porta" value="6379" />
            <Row label="TTL do cache de usuário" value="1 hora" />
            <Row label="Status Redis" value="Conectado" type="status" />
          </Section>
        </div>
      )}

      {/* Tab: IA & Motor */}
      {activeTab === 'IA & Motor' && (
        <div>
          <Section title="Modelo de IA">
            <Row label="Provedor" value="Anthropic" />
            <Row label="Modelo" value="claude-sonnet-4-6" mono />
            <Row label="Máximo de tokens por resposta" value="1.024" />
            <Row label="Chave API" value="" type="password" />
            <Row label="Status API" value="Operacional" type="status" />
          </Section>
          <Section title="Comportamento">
            <Row label="Mensagens no histórico de contexto" value="Últimas 10" />
            <Row label="Detecção de ticker automática" value="Ativada" />
            <Row label="Cotações em tempo real (Brapi)" value="Ativada" />
            <Row label="Idioma padrão" value="Português (BR)" />
          </Section>
          <Section title="Perfis de Investidor">
            {['conservador', 'moderado', 'arrojado'].map((perfil) => (
              <div key={perfil} style={{
                padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <span style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 20, flexShrink: 0,
                  color: perfilCor[perfil], background: `${perfilCor[perfil]}15`,
                  border: `1px solid ${perfilCor[perfil]}30`, textTransform: 'capitalize',
                }}>{perfil}</span>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                  {{
                    conservador: 'Tom cauteloso. Foco em renda fixa, Tesouro Direto, CDBs e LCI/LCA.',
                    moderado: 'Tom equilibrado. Foco em fundos multimercado, FIIs e ETFs.',
                    arrojado: 'Tom analítico. Foco em renda variável, ações, ETFs e diversificação global.',
                  }[perfil]}
                </p>
              </div>
            ))}
          </Section>
          <Section title="Diretrizes CVM">
            <Row label="Bot educacional (não recomenda ativos)" value="Ativado" />
            <Row label="Disclaimer obrigatório no onboarding" value="Ativado" />
            <Row label="Sugere consulta a assessor certificado" value="Ativado" />
          </Section>
        </div>
      )}

      {/* Tab: WhatsApp */}
      {activeTab === 'WhatsApp' && (
        <div>
          <Section title="Meta Cloud API">
            <Row label="App ID" value="1247920137088263" mono />
            <Row label="Phone Number ID" value="1132009879990618" mono />
            <Row label="WhatsApp Business Account ID" value="2420630865075595" mono />
            <Row label="Access Token" value="" type="password" />
            <Row label="Verify Token" value="" type="password" />
            <Row label="Modo do App" value="Development" />
          </Section>
          <Section title="Webhook">
            <Row label="URL" value="https://orobanchaceous-flittingly-latrisha.ngrok-free.dev/webhook" mono />
            <Row label="Campo inscrito" value="messages ✓" />
            <Row label="Versão da API" value="v25.0" />
            <Row label="Status do webhook" value="Verificado" type="status" />
          </Section>
          <Section title="Limitações (modo Development)">
            <div style={{ padding: '16px 20px' }}>
              {[
                'Mensagens reais não chegam no webhook em modo Development',
                'Apenas webhooks de teste enviados pelo dashboard funcionam',
                'Token de acesso é temporário — expira periodicamente',
                'Necessário criar token permanente via Meta Business Manager',
                'Para receber mensagens reais, migrar para modo Live',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: '#fbbf24', flexShrink: 0 }}>○</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Tab: Suitability */}
      {activeTab === 'Suitability' && (
        <div>
          <Section title="Questionário">
            <Row label="Total de perguntas" value="8 perguntas" />
            <Row label="Formato de resposta" value="Número (1, 2, 3...)" />
            <Row label="Validade do perfil calculado" value="1 ano" />
            <Row label="Segue diretrizes" value="CVM (educacional)" />
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
              <div key={q.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 20px', borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: 'rgba(255,255,255,0.4)', flexShrink: 0,
                  }}>{q.id}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{q.tema}</span>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{q.opcoes} opções</span>
              </div>
            ))}
          </Section>
        </div>
      )}

      {/* Tab: Integrações */}
      {activeTab === 'Integrações' && (
        <div>
          {[
            {
              name: 'Anthropic Claude API', icon: '🤖', status: 'ativo', statusColor: '#4ade80',
              items: [
                { label: 'Endpoint', value: 'https://api.anthropic.com/v1/messages' },
                { label: 'Modelo', value: 'claude-sonnet-4-6' },
                { label: 'Custo estimado', value: '~$0,001 por mensagem' },
                { label: 'Status', value: 'Operacional', type: 'status' },
              ]
            },
            {
              name: 'Brapi (Cotações B3)', icon: '📈', status: 'ativo', statusColor: '#4ade80',
              items: [
                { label: 'Endpoint', value: 'https://brapi.dev/api/quote/{ticker}' },
                { label: 'Detecção', value: 'Automática por regex no texto' },
                { label: 'Plano', value: 'Gratuito' },
                { label: 'Status', value: 'Operacional', type: 'status' },
              ]
            },
            {
              name: 'Meta WhatsApp API', icon: '💬', status: 'dev mode', statusColor: '#fbbf24',
              items: [
                { label: 'Endpoint', value: 'https://graph.facebook.com/v25.0' },
                { label: 'Modo', value: 'Development' },
                { label: 'Webhook', value: 'Verificado ✓' },
                { label: 'Status', value: 'Configurado', type: 'status' },
              ]
            },
            {
              name: 'AbacatePay', icon: '💳', status: 'pendente', statusColor: '#6b7280',
              items: [
                { label: 'Endpoint', value: 'https://api.abacatepay.com' },
                { label: 'Funcionalidade', value: 'Pix recorrente + planos' },
                { label: 'Plano sugerido', value: 'Free / Pro R$12,90 / Business R$29,90' },
                { label: 'Status', value: 'Não implementado' },
              ]
            },
          ].map((integ) => (
            <Section key={integ.name} title={`${integ.icon} ${integ.name}`}>
              <div style={{ padding: '8px 20px 4px', display: 'flex', justifyContent: 'flex-end' }}>
                <Badge label={integ.status} color={integ.statusColor} />
              </div>
              {integ.items.map((item) => (
                <Row key={item.label} label={item.label} value={item.value} mono={item.label === 'Endpoint'} type={item.type} />
              ))}
            </Section>
          ))}
        </div>
      )}

      {/* Tab: Danger Zone */}
      {activeTab === 'Danger Zone' && (
        <div>
          <div style={{
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12,
            padding: '20px', background: 'rgba(239,68,68,0.03)', marginBottom: 16,
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>⚠️ Zona de Perigo</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              As ações abaixo são irreversíveis e afetam dados reais do banco. Use somente em ambiente de desenvolvimento.
            </p>
          </div>

          {[
            {
              title: 'Limpar dados de teste',
              desc: 'Remove todos os usuários, sessões e perfis. Mantém o tenant padrão.',
              cmd: 'docker exec -i payroll_postgres psql -U payroll -d payroll -c "DELETE FROM sessions; DELETE FROM investor_profiles; DELETE FROM users;"',
              color: '#fbbf24',
            },
            {
              title: 'Recriar tenant padrão',
              desc: 'Necessário após limpar o banco. Recria o tenant de desenvolvimento.',
              cmd: `docker exec -i payroll_postgres psql -U payroll -d payroll -c "INSERT INTO tenants (id, name, whatsapp_phone_id) VALUES ('00000000-0000-0000-0000-000000000001', 'Payroll Default', 'default') ON CONFLICT DO NOTHING;"`,
              color: '#3b82f6',
            },
            {
              title: 'Resetar banco completo',
              desc: 'Para o Docker, remove os volumes e recria do zero. Todos os dados são perdidos.',
              cmd: 'docker-compose down -v && docker-compose up -d',
              color: '#ef4444',
            },
          ].map((action) => (
            <div key={action.title} style={{
              border: `1px solid ${action.color}20`,
              borderRadius: 12, padding: '20px',
              background: `${action.color}05`, marginBottom: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: action.color }}>{action.title}</p>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, lineHeight: 1.5 }}>{action.desc}</p>
              <div style={{
                background: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: '10px 14px',
                fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.06)', wordBreak: 'break-all', lineHeight: 1.6,
              }}>
                {action.cmd}
              </div>
            </div>
          ))}

          {/* Confirmação visual */}
          <div style={{
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
            padding: '20px', background: 'rgba(255,255,255,0.02)',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
              Os comandos acima devem ser executados no terminal Git Bash dentro de <code style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>C:\Payroll</code>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fbbf24' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Sempre faça backup antes de resetar o banco em produção</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}