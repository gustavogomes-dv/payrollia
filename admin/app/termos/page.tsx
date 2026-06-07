export const metadata = {
  title: 'Termos de Uso — Payroll Chatbot',
  description: 'Termos de uso do Payroll Chatbot, seu assessor de investimentos no WhatsApp.',
}

export default function TermosDeUso() {
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
        <link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="26" width="24" height="11" rx="5.5" fill="#C8F260"/>
            <rect x="12" y="11" width="40" height="11" rx="5.5" fill="#C8F260"/>
            <rect x="12" y="41" width="32" height="11" rx="5.5" fill="#C8F260"/>
          </svg>
          <span style={{ color: '#FAF8F4', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.01em' }}>
            Payroll Chatbot
          </span>
        </link>
        <link href="/" style={{
          color: '#C8F260',
          fontSize: '14px',
          fontWeight: 500,
          textDecoration: 'none',
        }}>
          ← Voltar ao início
        </link>
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
          Termos de Uso
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

        {/* AVISO CVM */}
        <div style={{
          background: '#2D2356',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '40px',
        }}>
          <p style={{ color: '#C8F260', fontWeight: 600, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Aviso importante
          </p>
          <p style={{ color: '#FAF8F4', fontSize: '14px', lineHeight: 1.7, margin: 0, opacity: 0.9 }}>
            O Payroll Chatbot é um serviço de <strong style={{ color: '#C8F260' }}>educação financeira</strong>.
            As informações fornecidas não constituem recomendação de investimento nos termos da{' '}
            <strong style={{ color: '#FAF8F4' }}>Resolução CVM n.º 20/2021</strong> e estão em conformidade
            com as diretrizes da <strong style={{ color: '#FAF8F4' }}>ANBIMA</strong> para educação financeira.
            Rentabilidade passada não é garantia de retorno futuro. Consulte um profissional certificado
            (CFP/CGA) antes de tomar qualquer decisão financeira.
          </p>
        </div>

        {/* INTRO */}
        <p style={pStyle}>
          Ao utilizar o Payroll Chatbot, você concorda com os termos abaixo.
        </p>

        <Section title="1. O serviço">
          <p style={pStyle}>
            O Payroll Chatbot é um assistente virtual de educação financeira que utiliza inteligência
            artificial para responder dúvidas sobre investimentos, fornecer dados de mercado e auxiliar
            no entendimento do perfil de investidor. O conteúdo é estritamente educacional.
          </p>
        </Section>

        <Section title="2. Elegibilidade">
          <p style={pStyle}>
            Destinado a pessoas físicas maiores de 18 anos residentes no Brasil com acesso ao WhatsApp.
          </p>
        </Section>

        <Section title="3. Planos e pagamentos">
          <p style={pStyle}>
            Os planos <strong>Pro (R$ 12,90/mês)</strong> e <strong>Business (R$ 29,90/mês)</strong> são
            cobrados mensalmente via PIX. Acesso liberado automaticamente após confirmação de pagamento.
            Não há reembolso de mensalidades já pagas, exceto por falha técnica comprovada.
          </p>
        </Section>

        <Section title="4. Programa de indicação">
          <p style={pStyle}>
            Códigos de indicação são pessoais e intransferíveis. Digite <strong>INDICAR</strong> no chat
            para gerar o seu. Tentativas de fraude resultarão em cancelamento da conta sem reembolso.
          </p>
        </Section>

        <Section title="5. Uso aceitável">
          <p style={pStyle}>
            É vedado usar o serviço para fins ilegais, enviar spam ou tentar comprometer a segurança
            da plataforma.
          </p>
        </Section>

        <Section title="6. Limitação de responsabilidade">
          <p style={pStyle}>
            O Payroll Chatbot não se responsabiliza por decisões financeiras tomadas com base no
            conteúdo educacional do assistente. Cotações e indicadores são fornecidos por fontes
            externas e podem apresentar atrasos.
          </p>
        </Section>

        <Section title="7. Foro">
          <p style={pStyle}>
            Fica eleito o foro da comarca do domicílio da empresa para dirimir eventuais conflitos.
          </p>
        </Section>

        {/* LINK PRIVACIDADE */}
        <p style={{ marginTop: '48px', fontSize: '14px', color: '#2D2356', opacity: 0.6 }}>
          Veja também:{' '}
          <a href="/privacidade" style={{ color: '#2D2356', fontWeight: 600, opacity: 1 }}>
            Política de Privacidade →
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