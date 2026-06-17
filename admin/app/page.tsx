"use client";

// Logo oficial Payroll — SVG fiel ao design system (viewBox 64, barras curta·longa·média, ordem FIXA)
function PayrollLogo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Payroll Chatbot">
      <rect width="64" height="64" rx="14" fill="#2D2356"/>
      <rect x="12" y="14" width="24" height="11" rx="5.5" fill="#C8F260"/>
      <rect x="12" y="27" width="40" height="11" rx="5.5" fill="#C8F260"/>
      <rect x="12" y="40" width="32" height="11" rx="5.5" fill="#C8F260"/>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
        :root {
          --bone:#FAF8F4;--bone2:#F2EFE8;--bone3:#E8E4DA;--bone4:#D4CFC2;
          --aubergine:#2D2356;--aubergine-500:#4A3B82;--aubergine-400:#7561AF;
          --lime:#C8F260;--lime-700:#9CC23F;--coral:#FF8A65;
          --ink:#14102A;--mute:#6B6478;--white:#FFFFFF;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        .lp{background:var(--bone);font-family:'Geist',sans-serif;color:var(--ink)}

        /* NAV */
        .nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:var(--bone);border-bottom:1px solid var(--bone3);position:sticky;top:0;z-index:100}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo-mark{width:34px;height:34px;flex-shrink:0}
        .logo-mark svg{width:100%;height:100%;display:block}
        .logo-name{font-size:15px;font-weight:600;color:var(--aubergine);letter-spacing:-0.01em}
        .logo-name span{font-weight:300;color:var(--mute)}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-link{font-size:14px;color:var(--mute);text-decoration:none}
        .nav-pill{background:var(--aubergine);color:var(--lime);padding:9px 22px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none}

        /* HERO */
        .hero-outer{background:var(--aubergine)}
        .hero{
          max-width:1400px;margin:0 auto;
          padding:96px 48px 88px;
          display:grid;
          grid-template-columns:1fr 500px;
          gap:48px;
          align-items:center;
        }
        .hero-tag{font-family:'Geist Mono',monospace;font-size:11px;color:var(--lime);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px;opacity:.8}
        .hero-h{font-family:'Instrument Serif',serif;font-style:italic;font-size:72px;line-height:1.0;color:var(--bone);letter-spacing:-0.03em;margin-bottom:28px}
        .hero-h em{font-style:normal;color:var(--lime)}
        .hero-p{font-size:17px;color:rgba(250,248,244,.6);line-height:1.7;max-width:400px;margin-bottom:44px}
        .hero-btns{display:flex;gap:12px;align-items:center}
        .btn-lime{background:var(--lime);color:var(--aubergine);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;display:inline-block;letter-spacing:-0.01em}
        .btn-outline{border:1px solid rgba(250,248,244,.15);color:rgba(250,248,244,.7);padding:14px 28px;border-radius:100px;font-size:14px;text-decoration:none;display:inline-block}
        .hero-note{margin-top:20px;font-size:12px;color:rgba(250,248,244,.25);letter-spacing:.02em}

        /* CHAT CARD — estilo fintech limpo */
        .chat-card{
          background:#FFFFFF;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 40px 100px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.06);
          width:100%;
        }

        .chat-header{
          background:#FFFFFF;
          padding:16px 20px;
          display:flex;align-items:center;gap:12px;
          border-bottom:1px solid #F0EEF8;
        }
        .chat-av{width:38px;height:38px;flex-shrink:0}
        .chat-av svg{width:100%;height:100%;display:block}
        .chat-hinfo{flex:1}
        .chat-hname{font-size:14px;font-weight:600;color:var(--ink);line-height:1.2}
        .chat-hsub{font-size:11px;color:var(--mute);display:flex;align-items:center;gap:5px;margin-top:1px}
        .online-dot{width:6px;height:6px;background:#22C55E;border-radius:50%;flex-shrink:0}
        .chat-more{color:var(--bone4);font-size:18px;letter-spacing:1px;line-height:1;padding-bottom:4px}

        .chat-body{
          padding:20px 18px;
          display:flex;flex-direction:column;gap:10px;
          background:#FAFAFA;
        }

        /* Bot bubble */
        .msg-bot{max-width:84%;align-self:flex-start}
        .msg-bot-b{
          background:#FFFFFF;
          border:1px solid #EEE;
          color:#1a1a2e;
          padding:12px 14px;
          border-radius:4px 16px 16px 16px;
          font-size:13px;line-height:1.65;
          box-shadow:0 1px 4px rgba(0,0,0,.05);
        }
        .msg-bot-b strong{color:var(--aubergine);font-weight:600}
        .msg-time{font-size:10px;color:#B0B0C0;text-align:right;margin-top:5px;font-family:'Geist Mono',monospace}

        /* User bubble */
        .msg-user{align-self:flex-end;max-width:72%}
        .msg-user-b{
          background:var(--aubergine);
          color:rgba(250,248,244,.9);
          padding:12px 14px;
          border-radius:16px 4px 16px 16px;
          font-size:13px;line-height:1.5;
        }
        .msg-user-meta{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:5px}
        .msg-user-time{font-size:10px;color:rgba(200,242,96,.5);font-family:'Geist Mono',monospace}
        .check{font-size:11px;color:var(--lime);opacity:.7}

        /* Step label */
        .step-pill{
          align-self:center;
          background:#F0EEF8;
          color:var(--aubergine-400);
          font-size:9px;font-family:'Geist Mono',monospace;
          letter-spacing:.1em;text-transform:uppercase;
          padding:3px 10px;border-radius:20px;
          margin:2px 0;
        }

        /* Options */
        .opt-list{margin-top:8px;display:flex;flex-direction:column;gap:4px}
        .opt{display:flex;align-items:flex-start;gap:7px;font-size:12.5px;color:#333}
        .opt-n{
          min-width:18px;height:18px;
          background:#F0EEF8;border:1px solid #D8D4F0;
          border-radius:5px;display:flex;align-items:center;justify-content:center;
          font-size:9px;font-weight:600;color:var(--aubergine);margin-top:1px;
        }

        /* Selic data */
        .selic-box{
          background:#F7F6FD;
          border:1px solid #E8E4F5;
          border-radius:10px;padding:10px 12px;margin-top:8px;
        }
        .selic-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #EEE}
        .selic-row:last-child{border-bottom:none}
        .selic-label{font-size:11px;color:var(--mute);font-family:'Geist Mono',monospace}
        .selic-val{font-size:12px;font-weight:600;color:var(--aubergine);font-family:'Geist Mono',monospace}

        /* Perfil result */
        .perfil-box{
          background:#F0FDE4;
          border:1px solid #D4F5A0;
          border-radius:10px;padding:10px 12px;margin-top:8px;
        }
        .perfil-title{font-size:12px;font-weight:600;color:#3A7A0A;margin-bottom:3px}
        .perfil-body{font-size:11.5px;color:#4A6A20;line-height:1.5}

        /* Input bar */
        .chat-input{
          background:#FFFFFF;
          padding:12px 16px;
          display:flex;align-items:center;gap:10px;
          border-top:1px solid #F0EEF8;
        }
        .chat-input-fake{
          flex:1;background:#F5F4FA;border-radius:20px;
          padding:9px 14px;font-size:13px;color:#C0BDD0;
          font-family:'Geist',sans-serif;border:1px solid #EAE8F5;
        }
        .send-btn{
          width:36px;height:36px;background:var(--aubergine);border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:14px;flex-shrink:0;color:var(--lime);
        }

        /* INTEGRATIONS */
        .integrations{background:var(--bone2);border-bottom:1px solid var(--bone3);padding:28px 48px}
        .int-label{text-align:center;font-family:'Geist Mono',monospace;font-size:11px;color:var(--mute);letter-spacing:.1em;text-transform:uppercase;margin-bottom:20px}
        .pills-grid{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:860px;margin:0 auto}
        .pill{display:inline-flex;align-items:center;gap:8px;background:white;border:1px solid var(--bone3);border-radius:100px;padding:7px 16px 7px 8px;box-shadow:0 1px 6px rgba(20,16,42,.05);white-space:nowrap;animation:pfloat 6s ease-in-out infinite}
        .pill-icon{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;background:var(--bone2)}
        .pill-icon img{width:20px;height:20px;object-fit:contain}
        .pill-text{font-family:'Geist',sans-serif;font-size:13px;font-weight:500;color:var(--ink)}
        .p1{animation-delay:0s;animation-duration:5.5s}.p2{animation-delay:-1.2s;animation-duration:6.2s}
        .p3{animation-delay:-2.5s;animation-duration:5.8s}.p4{animation-delay:-.8s;animation-duration:6.5s}
        .p5{animation-delay:-3.2s;animation-duration:6s}.p6{animation-delay:-1.8s;animation-duration:5.6s}
        .p7{animation-delay:-4s;animation-duration:6.3s}.p8{animation-delay:-2.2s;animation-duration:5.4s}
        .p9{animation-delay:-.5s;animation-duration:6.8s}.p10{animation-delay:-3.5s;animation-duration:5.9s}
        .p11{animation-delay:-2.8s;animation-duration:6.1s}
        @keyframes pfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

        /* SECTIONS */
        .section{padding:88px 48px}
        .section-alt{background:var(--bone2)}
        .sec-tag{font-family:'Geist Mono',monospace;font-size:11px;color:var(--mute);letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px}
        .sec-h{font-size:38px;font-weight:600;color:var(--ink);letter-spacing:-0.025em;line-height:1.15;margin-bottom:12px}
        .sec-p{font-size:17px;color:var(--mute);line-height:1.6;max-width:500px}
        .feats{display:grid;grid-template-columns:repeat(2,1fr);gap:2px;margin-top:48px}
        .feat{padding:32px 28px;background:var(--bone);border:1px solid var(--bone3)}
        .feat:first-child{border-radius:16px 0 0 0}.feat:nth-child(2){border-radius:0 16px 0 0}
        .feat:nth-child(3){border-radius:0 0 0 16px}.feat:last-child{border-radius:0 0 16px 0}
        .feat-ico{width:46px;height:46px;background:var(--lime);border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:18px}
        .feat-ico svg{width:22px;height:22px;stroke:var(--aubergine)}
        .feat-h{font-size:16px;font-weight:600;color:var(--ink);margin-bottom:7px}
        .feat-p{font-size:14px;color:var(--mute);line-height:1.55}
        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:48px}
        .step{padding:36px 28px;background:var(--bone2)}
        .step:first-child{border-radius:16px 0 0 16px;border:1px solid var(--bone3);border-right:none}
        .step:nth-child(2){border-top:1px solid var(--bone3);border-bottom:1px solid var(--bone3)}
        .step:last-child{border-radius:0 16px 16px 0;border:1px solid var(--bone3);border-left:none}
        .step-n{font-family:'Geist Mono',monospace;font-size:11px;color:var(--lime-700);letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px;font-weight:500}
        .step-h{font-size:18px;font-weight:600;color:var(--ink);margin-bottom:10px}
        .step-p{font-size:14px;color:var(--mute);line-height:1.55}
        .quote-section{background:var(--aubergine);padding:72px 48px;text-align:center}
        .quote-text{font-family:'Instrument Serif',serif;font-style:italic;font-size:36px;color:var(--bone);max-width:640px;margin:0 auto 20px;line-height:1.25;letter-spacing:-0.01em}
        .quote-by{font-family:'Geist Mono',monospace;font-size:11px;color:var(--aubergine-400);letter-spacing:.1em;text-transform:uppercase}
        .stats{background:var(--bone);padding:48px;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--bone3);border-bottom:1px solid var(--bone3)}
        .stat{text-align:center;padding:20px;border-right:1px solid var(--bone3)}.stat:last-child{border-right:none}
        .stat-n{font-family:'Geist Mono',monospace;font-size:34px;font-weight:500;color:var(--aubergine);display:block;margin-bottom:6px;letter-spacing:-0.02em}
        .stat-l{font-size:13px;color:var(--mute)}
        .pricing-section{background:var(--ink);padding:88px 48px}
        .plans{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .plan{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:32px 28px}
        .plan.pop{background:var(--bone);border:2px solid var(--lime)}
        .plan-tag{font-family:'Geist Mono',monospace;font-size:10px;font-weight:500;background:var(--lime);color:var(--aubergine);padding:4px 10px;border-radius:100px;display:inline-block;letter-spacing:.05em;margin-bottom:20px}
        .plan-name{font-family:'Geist Mono',monospace;font-size:12px;color:var(--bone4);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}
        .plan.pop .plan-name{color:var(--mute)}
        .plan-price{font-family:'Geist Mono',monospace;font-size:40px;font-weight:500;color:var(--bone);letter-spacing:-0.03em;line-height:1}
        .plan.pop .plan-price{color:var(--aubergine)}
        .plan-cycle{font-size:13px;color:var(--bone4);margin-top:4px;margin-bottom:28px}
        .plan.pop .plan-cycle{color:var(--mute)}
        .plan-items{list-style:none;margin-bottom:32px}
        .plan-items li{font-size:14px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);color:var(--bone3);display:flex;gap:10px;align-items:flex-start}
        .plan.pop .plan-items li{color:var(--ink);border-bottom-color:var(--bone3)}
        .plan-items li.off{opacity:.4}
        .plan-items li::before{content:'✓';color:var(--lime);font-weight:700;flex-shrink:0}
        .plan-items li.off::before{content:'–';color:var(--mute)}
        .plan-btn{display:block;width:100%;padding:13px;border-radius:100px;font-size:14px;font-weight:600;font-family:'Geist',sans-serif;text-align:center;text-decoration:none;border:none;cursor:pointer}
        .plan-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--bone)}
        .plan-btn-solid{background:var(--lime);color:var(--aubergine)}
        .cta-section{background:var(--lime);padding:88px 48px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
        .cta-h{font-family:'Instrument Serif',serif;font-style:italic;font-size:52px;color:var(--aubergine);line-height:1.05;letter-spacing:-0.02em}
        .cta-right{display:flex;flex-direction:column;gap:20px}
        .cta-p{font-size:17px;color:var(--aubergine);opacity:.75;line-height:1.6}
        .btn-dark{background:var(--aubergine);color:var(--lime);padding:15px 32px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none;display:inline-block}
        .cta-num{font-family:'Geist Mono',monospace;font-size:12px;color:var(--aubergine);opacity:.55;letter-spacing:.04em}
        .legal{background:var(--bone2);padding:80px 48px;border-top:1px solid var(--bone3)}
        .legal-cols{display:grid;grid-template-columns:260px 1fr;gap:64px}
        .legal-nav-title{font-size:11px;font-weight:600;color:var(--mute);text-transform:uppercase;letter-spacing:.07em;font-family:'Geist Mono',monospace;margin-bottom:16px}
        .legal-nav-link{display:block;font-size:14px;color:var(--mute);text-decoration:none;margin-bottom:10px;padding:7px 0;border-bottom:1px solid var(--bone3)}
        .legal-h1{font-size:26px;font-weight:600;color:var(--ink);margin-bottom:24px;padding-top:48px;border-top:1px solid var(--bone3)}
        .legal-h1.first{padding-top:0;border-top:none}
        .legal-h2{font-size:15px;font-weight:600;color:var(--ink);margin:24px 0 8px}
        .legal-p{font-size:14px;color:var(--mute);line-height:1.75;margin-bottom:10px}
        .legal-p strong{color:var(--ink);font-weight:600}
        .legal-box{background:var(--bone);border-left:3px solid var(--coral);border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0}
        .legal-box p{font-size:13px;color:var(--mute);line-height:1.65}
        .legal-box p strong{color:var(--ink)}
        .footer{background:var(--ink);padding:56px 48px 32px}
        .footer-top{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px}
        .footer-brand-name{font-size:15px;font-weight:600;color:var(--bone);margin-top:12px;margin-bottom:8px}
        .footer-brand-p{font-size:13px;color:var(--mute);line-height:1.6;margin-bottom:12px}
        .footer-cnpj{font-family:'Geist Mono',monospace;font-size:11px;color:var(--mute);line-height:1.7}
        .footer-col-h{font-family:'Geist Mono',monospace;font-size:11px;font-weight:500;color:var(--bone4);text-transform:uppercase;letter-spacing:.07em;margin-bottom:14px}
        .footer-link{display:block;font-size:13px;color:var(--mute);text-decoration:none;margin-bottom:9px}
        .footer-social{display:flex;gap:10px;margin-top:16px;flex-direction:column}
        .social-btn{display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);text-decoration:none}
        .social-btn svg{width:14px;height:14px;flex-shrink:0}
        .social-btn span{font-size:12px;color:var(--mute);font-family:'Geist',sans-serif}
        .footer-bottom{border-top:1px solid rgba(255,255,255,.06);padding-top:24px;display:flex;justify-content:space-between;align-items:flex-start;gap:32px}
        .footer-copy{font-family:'Geist Mono',monospace;font-size:11px;color:var(--mute);white-space:nowrap}
        .footer-cvm{font-size:12px;color:var(--mute);max-width:520px;line-height:1.6;opacity:.55}

        @media(max-width:1024px){
          .hero{grid-template-columns:1fr;padding:64px 32px 56px}
          .chat-card{display:none}
        }
        @media(max-width:900px){
          .nav{padding:0 20px}.nav-links .nav-link{display:none}
          .hero{padding:56px 20px}.hero-h{font-size:48px}
          .section{padding:56px 20px}
          .feats{grid-template-columns:1fr}
          .feat:first-child{border-radius:16px 16px 0 0}.feat:last-child{border-radius:0 0 16px 16px}
          .feat:nth-child(2),.feat:nth-child(3){border-radius:0}
          .steps{grid-template-columns:1fr}
          .step:first-child,.step:last-child{border-radius:0;border:1px solid var(--bone3)}
          .stats{grid-template-columns:repeat(2,1fr);padding:32px 20px}
          .plans{grid-template-columns:1fr}
          .cta-section{grid-template-columns:1fr;padding:56px 20px}.cta-h{font-size:36px}
          .legal-cols{grid-template-columns:1fr}
          .footer-top{grid-template-columns:1fr 1fr}.footer{padding:40px 20px 24px}
          .integrations{padding:20px 16px}.pills-grid{gap:8px}
          .pill{padding:6px 12px 6px 6px}.pill-text{font-size:12px}
          .pill-icon{width:22px;height:22px}.pill-icon img{width:16px;height:16px}
          .quote-section,.pricing-section{padding:56px 20px}
        }
      `}</style>

      <div className="lp">
        {/* NAV */}
        <nav className="nav">
          <a href="#" className="logo">
            <div className="logo-mark">
              <PayrollLogo/>
            </div>
            <span className="logo-name">Payroll <span>Chatbot</span></span>
          </a>
          <div className="nav-links">
            <a href="#como-funciona" className="nav-link">Como funciona</a>
            <a href="#planos" className="nav-link">Planos</a>
            <a href="#indicacao" className="nav-link">Programa de indicação</a>
            <a href="#privacidade" className="nav-link">Política e Privacidade</a>
            <a href="https://wa.me/5535910148222" className="nav-pill" target="_blank" rel="noopener noreferrer">Começar grátis →</a>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero-outer">
          <div className="hero">
            {/* Esquerda */}
            <div>
              <p className="hero-tag">Educação financeira · WhatsApp</p>
              <h1 className="hero-h">Da conversa<br/>ao <em>conhecimento.</em></h1>
              <p className="hero-p">Entenda investimentos, conheça seu perfil de investidor e acesse dados do mercado — tudo pelo WhatsApp, sem app, sem burocracia.</p>
              <div className="hero-btns">
                <a href="https://wa.me/5535910148222" className="btn-lime" target="_blank" rel="noopener noreferrer">Começar grátis →</a>
                <a href="#planos" className="btn-outline">Ver planos</a>
              </div>
              <p className="hero-note">Disponível no WhatsApp · Grátis para começar</p>
            </div>

            {/* Direita — Chat card estilo fintech */}
            <div className="chat-card">
              <div className="chat-header">
                <div className="chat-av">
                  <PayrollLogo/>
                </div>
                <div className="chat-hinfo">
                  <div className="chat-hname">Payroll Chatbot</div>
                  <div className="chat-hsub"><div className="online-dot"/><span>assistente educacional</span></div>
                </div>
                <div className="chat-more">···</div>
              </div>

              <div className="chat-body">

                {/* Boas-vindas */}

                <div className="msg-bot">
                  <div className="msg-bot-b">
                    Olá! Sou o <strong>Payroll Chatbot</strong>, seu assistente de <strong>educação financeira</strong>. Posso te ajudar a entender investimentos, conhecer seu perfil e consultar dados do mercado. Por onde quer começar?
                    <div className="msg-time">12:03</div>
                  </div>
                </div>

                <div className="msg-user">
                  <div className="msg-user-b">
                    Quero entender meu perfil de investidor
                    <div className="msg-user-meta">
                      <span className="msg-user-time">12:03</span>
                      <span className="check">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Suitability */}

                <div className="msg-bot">
                  <div className="msg-bot-b">
                    Ótimo ponto de partida! Vou te fazer <strong>8 perguntas</strong> baseadas nas normas da CVM para mapear seu perfil. Leva menos de 3 minutos. Pode começar?
                    <div className="msg-time">12:04</div>
                  </div>
                </div>

                <div className="msg-user">
                  <div className="msg-user-b">
                    Como está a Selic hoje?
                    <div className="msg-user-meta">
                      <span className="msg-user-time">12:05</span>
                      <span className="check">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Resposta Selic */}
                <div className="msg-bot">
                  <div className="msg-bot-b">
                    📊 Dados do <strong>Banco Central</strong> (BCB):
                    <div className="selic-box">
                      <div className="selic-row">
                        <span className="selic-label">Selic</span>
                        <span className="selic-val">10,50% a.a.</span>
                      </div>
                      <div className="selic-row">
                        <span className="selic-label">CDI</span>
                        <span className="selic-val">10,40% a.a.</span>
                      </div>
                      <div className="selic-row">
                        <span className="selic-label">IPCA 12m</span>
                        <span className="selic-val">4,83%</span>
                      </div>
                    </div>
                    O retorno real (acima da inflação) é de aproximadamente <strong>5,4% ao ano</strong>.
                    <div className="msg-time">12:05</div>
                  </div>
                </div>

              </div>

              <div className="chat-input">
                <div className="chat-input-fake">Mensagem</div>
                <div className="send-btn">➤</div>
              </div>
            </div>
          </div>
        </div>

        {/* INTEGRATIONS */}
        <div className="integrations">
          <p className="int-label">Integrado com</p>
          <div className="pills-grid">
            <div className="pill p1"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=whatsapp.com&sz=64" alt="WhatsApp"/></div><span className="pill-text">WhatsApp</span></div>
            <div className="pill p2"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=anthropic.com&sz=64" alt="Claude AI"/></div><span className="pill-text">Claude AI</span></div>
            <div className="pill p3"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=b3.com.br&sz=64" alt="B3"/></div><span className="pill-text">B3</span></div>
            <div className="pill p4"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=bcb.gov.br&sz=64" alt="BCB"/></div><span className="pill-text">Banco Central</span></div>
            <div className="pill p5"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=brapi.dev&sz=64" alt="Brapi"/></div><span className="pill-text">Brapi</span></div>
            <div className="pill p6"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=cvm.gov.br&sz=64" alt="CVM"/></div><span className="pill-text">CVM</span></div>
            <div className="pill p7"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=anbima.com.br&sz=64" alt="ANBIMA"/></div><span className="pill-text">ANBIMA</span></div>
            <div className="pill p8"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=abacatepay.com&sz=64" alt="AbacatePay"/></div><span className="pill-text">AbacatePay</span></div>
            <div className="pill p9"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=railway.app&sz=64" alt="Railway"/></div><span className="pill-text">Railway</span></div>
            <div className="pill p10"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=postgresql.org&sz=64" alt="PostgreSQL"/></div><span className="pill-text">PostgreSQL</span></div>
            <div className="pill p11"><div className="pill-icon"><img src="https://www.google.com/s2/favicons?domain=redis.io&sz=64" alt="Redis"/></div><span className="pill-text">Redis</span></div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="section" id="features">
          <p className="sec-tag">O que você aprende</p>
          <h2 className="sec-h">Educação financeira<br/>no seu ritmo.</h2>
          <p className="sec-p">Pergunte, entenda, compare. O Payroll Chatbot explica — a decisão é sempre sua.</p>
          <div className="feats">
            {[
              {
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
                title:"Tudo no chat",
                desc:"Tire dúvidas sobre finanças diretamente no WhatsApp, a qualquer hora, sem formulários nem espera."
              },
              {
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 7v2a9 9 0 0 0 18 0V7z"/><path d="m9 12 2 2 4-4"/></svg>,
                title:"Conceitos de renda fixa",
                desc:"Entenda como funcionam Tesouro Direto, CDB, LCI e LCA — taxas, prazos, liquidez e tributação explicados de forma clara."
              },
              {
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>,
                title:"Dados de mercado",
                desc:"Consulte cotações, índices fundamentalistas e indicadores econômicos em tempo real para embasar seu estudo."
              },
              {
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>,
                title:"Perfil de investidor",
                desc:"Descubra se você é conservador, moderado ou arrojado com base no questionário oficial de suitability da CVM."
              },
            ].map((f,i)=>(
              <div key={i} className="feat">
                <div className="feat-ico">{f.icon}</div>
                <div className="feat-h">{f.title}</div>
                <div className="feat-p">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="section section-alt" id="como-funciona">
          <p className="sec-tag">Como funciona</p>
          <h2 className="sec-h">Três passos.<br/>Começa agora.</h2>
          <div className="steps">
            {[
              {n:"01 · salve o número",h:"Mande um oi",p:"Salve (35) 91014-8222 e envie qualquer mensagem. O Payroll Chatbot responde na hora, todos os dias da semana."},
              {n:"02 · suitability CVM",h:"Conheça seu perfil",p:"Oito perguntas baseadas nas normas da CVM. Conservador, moderado ou arrojado — você entende seu perfil em menos de 3 minutos."},
              {n:"03 · estude e pergunte",h:"Aprenda no seu ritmo",p:"Tire dúvidas sobre qualquer ativo, taxa ou conceito financeiro. O bot explica com dados reais e linguagem acessível."},
            ].map((s,i)=>(
              <div key={i} className="step">
                <div className="step-n">{s.n}</div>
                <div className="step-h">{s.h}</div>
                <div className="step-p">{s.p}</div>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <div className="stats">
          {[{n:"24/7",l:"sempre disponível"},{n:"8",l:"perguntas de perfil CVM"},{n:"B3+BCB",l:"dados em tempo real"},{n:"PIX",l:"ativação instantânea"}].map((s,i)=>(
            <div key={i} className="stat"><span className="stat-n">{s.n}</span><span className="stat-l">{s.l}</span></div>
          ))}
        </div>

        {/* QUOTE */}
        <div className="quote-section">
          <p className="quote-text">&ldquo;Finalmente entendo a diferença entre CDB e Tesouro Direto — sem precisar assistir horas de vídeo no YouTube.&rdquo;</p>
          <p className="quote-by">Plano Free · Plano Pro · Plano Business</p>
        </div>

        {/* PRICING */}
        <section className="pricing-section" id="planos">
          <p className="sec-tag" style={{color:"var(--lime)",opacity:.7}}>Planos</p>
          <h2 className="sec-h" style={{color:"var(--bone)"}}>Simples assim.</h2>
          <p className="sec-p" style={{color:"var(--bone3)"}}>Comece grátis. Evolua quando fizer sentido para você.</p>
          <div className="plans">
            <div className="plan">
              <div className="plan-name">Free</div>
              <div className="plan-price">R$ 0</div>
              <div className="plan-cycle">para sempre</div>
              <ul className="plan-items">
                <li>3 perguntas por mês</li>
                <li>Suitability CVM completo</li>
                <li>Cotações em tempo real</li>
                <li className="off">Perguntas ilimitadas</li>
                <li className="off">Dados fundamentalistas</li>
              </ul>
              <a href="https://wa.me/5535910148222" className="plan-btn plan-btn-ghost" target="_blank" rel="noopener noreferrer">Começar grátis</a>
            </div>
            <div className="plan pop">
              <div className="plan-tag">MAIS POPULAR</div>
              <div className="plan-name">Pro</div>
              <div className="plan-price">R$ 12,90</div>
              <div className="plan-cycle">/mês · via PIX</div>
              <ul className="plan-items">
                <li>Perguntas ilimitadas</li>
                <li>Suitability CVM completo</li>
                <li>Cotações B3 em tempo real</li>
                <li>Dados fundamentalistas</li>
                <li>Selic · CDI · IPCA ao vivo</li>
              </ul>
              <a href="https://wa.me/5535910148222" className="plan-btn plan-btn-solid" target="_blank" rel="noopener noreferrer">Assinar Pro →</a>
            </div>
            <div className="plan">
              <div className="plan-name">Business</div>
              <div className="plan-price">R$ 29,90</div>
              <div className="plan-cycle">/mês · via PIX</div>
              <ul className="plan-items">
                <li>Tudo do plano Pro</li>
                <li>Prioridade de resposta</li>
                <li>Programa de indicação</li>
                <li>Suporte prioritário</li>
              </ul>
              <a href="https://wa.me/5535910148222" className="plan-btn plan-btn-ghost" target="_blank" rel="noopener noreferrer">Assinar Business</a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div><h2 className="cta-h">Comece a entender melhor seu dinheiro.</h2></div>
          <div className="cta-right">
            <p className="cta-p">Grátis para começar. Sem download, sem cadastro complicado. Só o WhatsApp que você já usa.</p>
            <div><a href="https://wa.me/5535910148222" className="btn-dark" target="_blank" rel="noopener noreferrer">Falar com o Payroll Chatbot →</a></div>
            <span className="cta-num">(35) 91014-8222</span>
          </div>
        </section>

        {/* LEGAL */}
        <section className="legal" id="privacidade">
          <div className="legal-cols">
            <div>
              <p className="legal-nav-title">Nesta página</p>
              <a href="#privacidade" className="legal-nav-link">Política de privacidade</a>
              <a href="#termos" className="legal-nav-link">Termos de uso</a>
              <a href="#contato" className="legal-nav-link">Contato</a>
            </div>
            <div>
              <h2 className="legal-h1 first">Política de privacidade</h2>
              <p className="legal-p"><strong>Última atualização: maio de 2026.</strong> A Payroll Chatbot Inova Simples I.S., inscrita no CNPJ 66.618.119/0001-30, opera o assistente educacional acessível pelo WhatsApp no número (35) 91014-8222 e pelo site payrollia.com.br.</p>
              <h3 className="legal-h2">1. Dados que coletamos</h3>
              <p className="legal-p">Coletamos seu <strong>número de telefone WhatsApp</strong>, o <strong>nome</strong> informado no início da conversa, suas <strong>respostas ao questionário de suitability</strong> e o <strong>histórico de mensagens</strong> necessário para contextualizar as respostas da IA.</p>
              <h3 className="legal-h2">2. Como usamos seus dados</h3>
              <p className="legal-p">Seus dados são utilizados exclusivamente para personalizar as respostas educacionais do assistente, processar pagamentos e enviar comunicações sobre sua conta. <strong>Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.</strong></p>
              <h3 className="legal-h2">3. Armazenamento e segurança</h3>
              <p className="legal-p">Dados armazenados em servidores em nuvem com criptografia em trânsito (TLS 1.3). Em caso de incidente de segurança, notificaremos os usuários afetados conforme exige a LGPD.</p>
              <h3 className="legal-h2">4. Pagamentos</h3>
              <p className="legal-p">Transações processadas pela <strong>AbacatePay</strong> via PIX. O Payroll Chatbot não armazena dados bancários ou chaves PIX dos usuários.</p>
              <h3 className="legal-h2">5. Seus direitos (LGPD)</h3>
              <p className="legal-p">Você pode acessar, corrigir ou solicitar a exclusão dos seus dados enviando <strong>PRIVACIDADE</strong> para o bot ou escrevendo para <strong>gustavo.godlive@gmail.com</strong>.</p>
              <h3 className="legal-h2">6. Cookies</h3>
              <p className="legal-p">Este site utiliza apenas cookies técnicos essenciais. Não utilizamos cookies de rastreamento publicitário.</p>
              <h2 className="legal-h1" id="termos" style={{marginTop:"48px"}}>Termos de uso</h2>
              <p className="legal-p"><strong>Última atualização: maio de 2026.</strong></p>
              <div className="legal-box">
                <p><strong>Aviso importante:</strong> o Payroll Chatbot é um serviço de <strong>educação financeira</strong>. As informações fornecidas não constituem recomendação de investimento nos termos da Resolução CVM n.º 20/2021 e estão em conformidade com as diretrizes da ANBIMA. Rentabilidade passada não é garantia de retorno futuro. Consulte um profissional certificado (CFP/CGA) antes de tomar qualquer decisão financeira.</p>
              </div>
              <h3 className="legal-h2">1. O serviço</h3>
              <p className="legal-p">O Payroll Chatbot é um assistente virtual de educação financeira que utiliza inteligência artificial para responder dúvidas sobre investimentos, fornecer dados de mercado e auxiliar no entendimento do perfil de investidor. O conteúdo é estritamente educacional.</p>
              <h3 className="legal-h2">2. Elegibilidade</h3>
              <p className="legal-p">Destinado a pessoas físicas maiores de 18 anos residentes no Brasil com acesso ao WhatsApp.</p>
              <h3 className="legal-h2">3. Planos e pagamentos</h3>
              <p className="legal-p">Os planos Pro (R$ 12,90/mês) e Business (R$ 29,90/mês) são cobrados mensalmente via PIX. Acesso liberado automaticamente após confirmação de pagamento. Não há reembolso de mensalidades já pagas, exceto por falha técnica comprovada.</p>
              <h3 className="legal-h2">4. Programa de indicação</h3>
              <p className="legal-p">Códigos de indicação são pessoais e intransferíveis. Digite <strong>INDICAR</strong> no chat para gerar o seu.</p>
              <h3 className="legal-h2">5. Limitação de responsabilidade</h3>
              <p className="legal-p">O Payroll Chatbot não se responsabiliza por decisões financeiras tomadas com base no conteúdo educacional do assistente.</p>
              <h3 className="legal-h2">6. Foro</h3>
              <p className="legal-p">Fica eleito o foro da comarca do domicílio da empresa para dirimir eventuais conflitos.</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer" id="contato">
          <div className="footer-top">
            <div>
              <div className="logo">
                <div className="logo-mark">
                  <PayrollLogo/>
                </div>
              </div>
              <p className="footer-brand-name">Payroll Chatbot</p>
              <p className="footer-brand-p">Educação financeira no WhatsApp.</p>
              <p className="footer-cnpj">CNPJ 66.618.119/0001-30<br/>Payroll Chatbot Inova Simples I.S.</p>
            </div>
            <div>
              <p className="footer-col-h">Produto</p>
              <a href="#features" className="footer-link">Funcionalidades</a>
              <a href="#como-funciona" className="footer-link">Como funciona</a>
              <a href="#planos" className="footer-link">Planos</a>
              <a href="https://wa.me/5535910148222" className="footer-link" target="_blank" rel="noopener noreferrer">Falar com o bot</a>
            </div>
            <div>
              <p className="footer-col-h">Legal</p>
              <a href="#privacidade" className="footer-link">Política de privacidade</a>
              <a href="#termos" className="footer-link">Termos de uso</a>
            </div>
            <div>
              <p className="footer-col-h">Contato</p>
              <a href="mailto:gustavo.godlive@gmail.com" className="footer-link">gustavo.godlive@gmail.com</a>
              <a href="https://wa.me/5535910148222" className="footer-link" target="_blank" rel="noopener noreferrer">(35) 91014-8222</a>
              <a href="https://payrollia.com.br" className="footer-link">payrollia.com.br</a>
            </div>
            <div>
              <p className="footer-col-h">Redes sociais</p>
              <a href="https://www.instagram.com/payroll.ia/" className="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/company/payroll-ia/" className="footer-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <div className="footer-social">
                <a href="https://www.instagram.com/payroll.ia/" className="social-btn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--mute)'}}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                  <span>@payroll.ia</span>
                </a>
                <a href="https://www.linkedin.com/company/payroll-ia/" className="social-btn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--mute)'}}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  <span>payroll-ia</span>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">&copy; 2026 Payroll Chatbot · Todos os direitos reservados</span>
            <span className="footer-cvm">Serviço de educação financeira em conformidade com a Resolução CVM n.º 20/2021 e diretrizes da ANBIMA. Rentabilidade passada não é garantia de retorno futuro. Decisões de investimento são de exclusiva responsabilidade do investidor.</span>
          </div>
        </footer>
      </div>
    </>
  );
}