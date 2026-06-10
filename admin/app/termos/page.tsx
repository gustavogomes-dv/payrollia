export const metadata = {
  title: 'Termos de Uso — Payroll Chatbot',
  description: 'Termos de uso do Payroll Chatbot.',
}

export default function TermosDeUso() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
        :root {
          --bone:#FAF8F4;--bone2:#F2EFE8;--bone3:#E8E4DA;--bone4:#D4CFC2;
          --aubergine:#2D2356;--lime:#C8F260;--coral:#FF8A65;
          --ink:#14102A;--mute:#6B6478;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:var(--bone);font-family:'Geist',sans-serif;color:var(--ink)}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:var(--aubergine)}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo-mark{width:32px;height:32px;background:var(--aubergine);border-radius:6px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:0 5px;gap:2px}
        .bar{background:var(--lime);border-radius:3px;height:5px}
        .bar-s{width:12px}.bar-l{width:20px}.bar-m{width:16px}
        .logo-name{font-size:15px;font-weight:600;color:var(--bone);letter-spacing:-0.01em}
        .back-link{font-size:14px;font-weight:500;color:var(--lime);text-decoration:none}
        .container{max-width:800px;margin:0 auto;padding:64px 32px 96px}
        .breadcrumb{font-size:13px;color:var(--mute);margin-bottom:32px;font-weight:500;letter-spacing:.05em;text-transform:uppercase}
        .page-title{font-family:'Instrument Serif',serif;font-style:italic;font-size:52px;color:var(--ink);line-height:1.1;margin-bottom:8px;font-weight:400}
        .page-date{color:var(--mute);font-size:14px;margin-bottom:48px;font-weight:500}
        .divider{width:48px;height:3px;background:var(--lime);border-radius:2px;margin-bottom:48px}
        .aviso{background:var(--aubergine);border-radius:12px;padding:24px;margin-bottom:40px}
        .aviso-tag{color:var(--lime);font-weight:600;font-size:13px;letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px}
        .aviso-body{color:var(--bone);font-size:14px;line-height:1.7;opacity:.9}
        .aviso-body strong{color:var(--lime)}
        .intro{font-size:15px;line-height:1.7;color:var(--ink);opacity:.8}
        .section-title{font-size:17px;font-weight:600;color:var(--ink);margin:40px 0 12px;letter-spacing:-.01em}
        .section-body{font-size:15px;line-height:1.7;color:var(--ink);opacity:.8}
        .section-body strong{color:var(--ink);opacity:1;font-weight:600}
        .see-also{margin-top:48px;font-size:14px;color:var(--mute)}
        .see-also a{color:var(--ink);font-weight:600;text-decoration:none}
        @media(max-width:600px){.nav{padding:0 20px}.container{padding:40px 20px 64px}.page-title{font-size:36px}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">
          <div className="logo-mark">
            <div className="bar bar-s"></div>
            <div className="bar bar-l"></div>
            <div className="bar bar-m"></div>
          </div>
          <span className="logo-name">Payroll Chatbot</span>
        </a>
        <a href="/" className="back-link">← Voltar ao início</a>
      </nav>

      <div className="container">
        <p className="breadcrumb">Legal</p>
        <h1 className="page-title">Termos de Uso</h1>
        <p className="page-date">Última atualização: maio de 2026</p>
        <div className="divider"></div>

        <div className="aviso">
          <p className="aviso-tag">Aviso importante</p>
          <p className="aviso-body">
            O Payroll Chatbot é um serviço de <strong>educação financeira</strong>.
            As informações fornecidas não constituem recomendação de investimento nos termos da{' '}
            <strong>Resolução CVM n.º 20/2021</strong> e estão em conformidade com as diretrizes
            da <strong>ANBIMA</strong> para educação financeira. Rentabilidade passada não é garantia
            de retorno futuro. Consulte um profissional certificado (CFP/CGA) antes de tomar qualquer
            decisão financeira.
          </p>
        </div>

        <p className="intro">Ao utilizar o Payroll Chatbot, você concorda com os termos abaixo.</p>

        <h2 className="section-title">1. O serviço</h2>
        <p className="section-body">
          O Payroll Chatbot é um assistente virtual de educação financeira que utiliza inteligência
          artificial para responder dúvidas sobre investimentos, fornecer dados de mercado e auxiliar
          no entendimento do perfil de investidor. O conteúdo é estritamente educacional.
        </p>

        <h2 className="section-title">2. Elegibilidade</h2>
        <p className="section-body">
          Destinado a pessoas físicas maiores de 18 anos residentes no Brasil com acesso ao WhatsApp.
        </p>

        <h2 className="section-title">3. Planos e pagamentos</h2>
        <p className="section-body">
          Os planos <strong>Pro (R$ 12,90/mês)</strong> e <strong>Business (R$ 29,90/mês)</strong> são
          cobrados mensalmente via PIX. Acesso liberado automaticamente após confirmação de pagamento.
          Não há reembolso de mensalidades já pagas, exceto por falha técnica comprovada.
        </p>

        <h2 className="section-title">4. Programa de indicação</h2>
        <p className="section-body">
          Códigos de indicação são pessoais e intransferíveis. Digite <strong>INDICAR</strong> no chat
          para gerar o seu. Tentativas de fraude resultarão em cancelamento da conta sem reembolso.
        </p>

        <h2 className="section-title">5. Uso aceitável</h2>
        <p className="section-body">
          É vedado usar o serviço para fins ilegais, enviar spam ou tentar comprometer a segurança
          da plataforma.
        </p>

        <h2 className="section-title">6. Limitação de responsabilidade</h2>
        <p className="section-body">
          O Payroll Chatbot não se responsabiliza por decisões financeiras tomadas com base no
          conteúdo educacional do assistente. Cotações e indicadores são fornecidos por fontes
          externas e podem apresentar atrasos.
        </p>

        <h2 className="section-title">7. Foro</h2>
        <p className="section-body">
          Fica eleito o foro da comarca do domicílio da empresa para dirimir eventuais conflitos.
        </p>

        <p className="see-also">
          Veja também:{' '}
          <a href="/privacidade">Política de Privacidade →</a>
        </p>
      </div>
    </>
  )
}