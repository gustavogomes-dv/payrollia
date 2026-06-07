import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — Payroll Chatbot',
  description: 'Política de privacidade do Payroll Chatbot, seu assessor de investimentos no WhatsApp.',
}

export default function PoliticaPrivacidade() {
  return (
    <main style={{
      background: '#FAF8F4',
      minHeight: '100vh',
      fontFamily: "'Geist', sans-serif",
    }}>
      {/* NAV */}
      <nav style={{
        background: '#2D2356',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="26" width="24" height="11" rx="5.5" fill="#C8F260"/>
            <rect x="12" y="11" width="40" height="11" rx="5.5" fill="#C8F260"/>
            <rect x="12" y="41" width="32" height="11" rx="5.5" fill="#C8F260"/>
          </svg>
          <span style={{ color: '#FAF8F4', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.01em' }}>
            Payroll Chatbot
          </span>
        </Link>
        <Link href="/" style={{
        color: '#C8F260',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        }}>
          ← Voltar ao início
        </Link>
      </nav>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '64px 32px 96px',
      }}>
        {/* BREADCRUMB */}
        <p style={{
          fontSize: '13px',
          color: '#2D2356',
          opacity: 0.5,
          marginBottom: '32px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Legal
        </p>

        {/* TÍTULO */}
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(36px, 5vw, 52px)',
          color: '#14102A',
          lineHeight: 1.1,
          marginBottom: '8px',
          fontWeight: 400,
        }}>
          Política de Privacidade
        </h1>
        <p style={{
          color: '#2D2356',
          opacity: 0.55,
          fontSize: '14px',
          marginBottom: '48px',
          fontWeight: 500,
        }}>
          Última atualização: maio de 2026
        </p>

        {/* DIVIDER */}
        <div style={{ width: '48px', height: '3px', background: '#C8F260', borderRadius: '2px', marginBottom: '48px' }} />

        {/* INTRO */}
        <p style={pStyle}>
          A <strong>Payroll Chatbot Inova Simples I.S.</strong>, inscrita no CNPJ 66.618.119/0001-30
          <strong>Payroll Chatbot</strong>, opera o assistente educacional de investimentos acessível pelo WhatsApp
          no número (35) 91014-8222 e pelo site payrollia.com.br.
        </p>

        <Section title="1. Dados que coletamos">
          <p style={pStyle}>
            Coletamos seu <strong>número de telefone WhatsApp</strong>, o <strong>nome</strong> informado
            no início da conversa, suas <strong>respostas ao questionário de suitability</strong> e o{' '}
            <strong>histórico de mensagens</strong> necessário para contextualizar as respostas da IA.
          </p>
        </Section>

        <Section title="2. Como usamos seus dados">
          <p style={pStyle}>
            Seus dados são utilizados exclusivamente para personalizar as respostas educacionais do
            assistente, processar pagamentos e enviar comunicações sobre sua conta.{' '}
            <strong>Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.</strong>
          </p>
        </Section>

        <Section title="3. Armazenamento e segurança">
          <p style={pStyle}>
            Dados armazenados em servidores em nuvem com criptografia em trânsito (TLS 1.3). Em caso
            de incidente de segurança, notificaremos os usuários afetados conforme exige a LGPD.
          </p>
        </Section>

        <Section title="4. Pagamentos">
          <p style={pStyle}>
            Transações processadas pela <strong>AbacatePay</strong> via PIX. O Payroll Chatbot não
            armazena dados bancários ou chaves PIX dos usuários.
          </p>
        </Section>

        <Section title="5. Seus direitos (LGPD)">
          <p style={pStyle}>
            Você pode acessar, corrigir ou solicitar a exclusão dos seus dados enviando{' '}
            <strong>PRIVACIDADE</strong> para o bot ou escrevendo para{' '}
            <strong>gustavo.godlive@gmail.com</strong>.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p style={pStyle}>
            Este site utiliza apenas cookies técnicos essenciais. Não utilizamos cookies de
            rastreamento publicitário.
          </p>
        </Section>

        {/* CTA */}
        <div style={{
          marginTop: '64px',
          padding: '32px',
          background: '#2D2356',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <p style={{ color: '#FAF8F4', fontWeight: 600, fontSize: '16px', margin: 0 }}>
              Dúvidas sobre privacidade?
            </p>
            <p style={{ color: '#FAF8F4', opacity: 0.6, fontSize: '14px', margin: '4px 0 0' }}>
              Fale diretamente conosco.
            </p>
          </div>
          <a
            href="mailto:gustavo.godlive@gmail.com"
            style={{
              background: '#C8F260',
              color: '#14102A',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            gustavo.godlive@gmail.com
          </a>
        </div>

        {/* LINK TERMOS */}
        <p style={{ marginTop: '32px', fontSize: '14px', color: '#2D2356', opacity: 0.6 }}>
          Veja também:{' '}
          <a href="/termos" style={{ color: '#2D2356', fontWeight: 600, opacity: 1 }}>
            Termos de uso →
          </a>
        </p>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{
        fontSize: '17px',
        fontWeight: 600,
        color: '#14102A',
        marginBottom: '12px',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

const pStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: '#14102A',
  opacity: 0.8,
  margin: 0,
}