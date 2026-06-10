import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — Payroll Chatbot',
  description: 'Política de privacidade do Payroll Chatbot.',
}

export default function PoliticaPrivacidade() {
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
        .intro{font-size:15px;line-height:1.7;color:var(--ink);opacity:.8}
        .section-title{font-size:17px;font-weight:600;color:var(--ink);margin:40px 0 12px;letter-spacing:-.01em}
        .section-body{font-size:15px;line-height:1.7;color:var(--ink);opacity:.8}
        .section-body strong{color:var(--ink);opacity:1;font-weight:600}
        .cta-box{margin-top:64px;padding:32px;background:var(--aubergine);border-radius:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        .cta-title{color:var(--bone);font-weight:600;font-size:16px;margin-bottom:4px}
        .cta-sub{color:var(--bone);opacity:.6;font-size:14px}
        .cta-btn{background:var(--lime);color:var(--ink);padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none}
        .see-also{margin-top:32px;font-size:14px;color:var(--mute)}
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
        <h1 className="page-title">Política de Privacidade</h1>
        <p className="page-date">Última atualização: maio de 2026</p>
        <div className="divider"></div>

        <p className="intro">
          A <strong>Payroll Chatbot Inova Simples I.S.</strong>, inscrita no CNPJ 66.618.119/0001-30
          <strong>Payroll Chatbot</strong>, opera o assistente educacional de investimentos acessível pelo WhatsApp
          no número (35) 91014-8222 e pelo site payrollia.com.br.
        </p>

        <h2 className="section-title">1. Dados que coletamos</h2>
        <p className="section-body">
          Coletamos seu <strong>número de telefone WhatsApp</strong>, o <strong>nome</strong> informado
          no início da conversa, suas <strong>respostas ao questionário de suitability</strong> e o{' '}
          <strong>histórico de mensagens</strong> necessário para contextualizar as respostas da IA.
        </p>

        <h2 className="section-title">2. Como usamos seus dados</h2>
        <p className="section-body">
          Seus dados são utilizados exclusivamente para personalizar as respostas educacionais do
          assistente, processar pagamentos e enviar comunicações sobre sua conta.{' '}
          <strong>Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.</strong>
        </p>

        <h2 className="section-title">3. Armazenamento e segurança</h2>
        <p className="section-body">
          Dados armazenados em servidores em nuvem com criptografia em trânsito (TLS 1.3). Em caso
          de incidente de segurança, notificaremos os usuários afetados conforme exige a LGPD.
        </p>

        <h2 className="section-title">4. Pagamentos</h2>
        <p className="section-body">
          Transações processadas pela <strong>AbacatePay</strong> via PIX. O Payroll Chatbot não
          armazena dados bancários ou chaves PIX dos usuários.
        </p>

        <h2 className="section-title">5. Seus direitos (LGPD)</h2>
        <p className="section-body">
          Você pode acessar, corrigir ou solicitar a exclusão dos seus dados enviando{' '}
          <strong>PRIVACIDADE</strong> para o bot ou escrevendo para{' '}
          <strong>gustavo.godlive@gmail.com</strong>.
        </p>

        <h2 className="section-title">6. Cookies</h2>
        <p className="section-body">
          Este site utiliza apenas cookies técnicos essenciais. Não utilizamos cookies de
          rastreamento publicitário.
        </p>

        <div className="cta-box">
          <div>
            <p className="cta-title">Dúvidas sobre privacidade?</p>
            <p className="cta-sub">Fale diretamente conosco.</p>
          </div>
          <a href="mailto:gustavo.godlive@gmail.com" className="cta-btn">
            gustavo.godlive@gmail.com
          </a>
        </div>

        <p className="see-also">
          Veja também:{' '}
          <a href="/termos">Termos de uso →</a>
        </p>
      </div>
    </>
  )
}