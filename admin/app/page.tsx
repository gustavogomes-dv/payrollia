"use client";

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
        .nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:var(--bone);border-bottom:1px solid var(--bone3);position:sticky;top:0;z-index:100}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo-mark{width:34px;height:34px;background:var(--aubergine);border-radius:7px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:0 6px;gap:1px}
        .bar{background:var(--lime);border-radius:3px;height:6px}
        .bar-s{width:13px}.bar-l{width:21px}.bar-m{width:17px}
        .logo-name{font-size:15px;font-weight:600;color:var(--aubergine);letter-spacing:-0.01em}
        .logo-name span{font-weight:300;color:var(--mute)}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-link{font-size:14px;color:var(--mute);text-decoration:none}
        .nav-pill{background:var(--aubergine);color:var(--lime);padding:9px 22px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none}

        /* HERO */
        .hero{background:var(--aubergine);padding:96px 48px 80px;display:grid;grid-template-columns:1fr 420px;gap:56px;align-items:center;max-width:1280px;margin:0 auto}
        .hero-outer{background:var(--aubergine)}
        .hero-tag{font-family:'Geist Mono',monospace;font-size:11px;color:var(--lime);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px;opacity:.85}
        .hero-h{font-family:'Instrument Serif',serif;font-style:italic;font-size:70px;line-height:1.02;color:var(--bone);letter-spacing:-0.025em;margin-bottom:28px}
        .hero-h em{font-style:normal;color:var(--lime)}
        .hero-p{font-size:17px;color:var(--bone3);line-height:1.65;max-width:430px;margin-bottom:40px}
        .hero-btns{display:flex;gap:14px;align-items:center}
        .btn-lime{background:var(--lime);color:var(--aubergine);padding:14px 32px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none;display:inline-block}
        .btn-outline{border:1px solid rgba(250,248,244,.2);color:var(--bone);padding:14px 28px;border-radius:100px;font-size:15px;text-decoration:none;display:inline-block}
        .hero-note{margin-top:24px;font-family:'Geist Mono',monospace;font-size:11px;color:var(--bone4);letter-spacing:.05em}

        /* ── CHAT MOCKUP REAL ── */
        .chat-wrap{
          width:100%;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 24px 60px rgba(0,0,0,.45);
          border:1px solid rgba(255,255,255,.06);
        }

        /* Header WhatsApp */
        .chat-header{
          background:#1F1B3A;
          padding:10px 14px;
          display:flex;
          align-items:center;
          gap:10px;
        }
        .chat-av{
          width:34px;height:34px;
          background:var(--lime);
          border-radius:50%;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          padding:0 7px;gap:2px;
          flex-shrink:0;
        }
        .chat-av .bar{background:var(--aubergine);height:4px;border-radius:2px}
        .chat-av .bar-s{width:9px}.chat-av .bar-l{width:17px}.chat-av .bar-m{width:13px}
        .chat-hinfo{flex:1}
        .chat-hname{font-size:13px;font-weight:600;color:#E8E8E8;line-height:1.2}
        .chat-hsub{font-size:11px;color:#8696A0;display:flex;align-items:center;gap:4px}
        .online-dot{width:5px;height:5px;background:#25D366;border-radius:50%}
        .chat-icons{color:#8696A0;font-size:16px;display:flex;gap:14px}

        /* Corpo */
        .chat-body{
          background:#0B141A;
          padding:12px 10px;
          display:flex;
          flex-direction:column;
          gap:5px;
        }

        /* Data */
        .chat-date{
          align-self:center;
          background:rgba(17,27,33,.85);
          color:#8696A0;
          font-size:10px;
          font-family:'Geist Mono',monospace;
          padding:3px 10px;
          border-radius:6px;
          margin:4px 0;
        }

        /* Separador de etapa */
        .chat-step{
          align-self:center;
          background:rgba(200,242,96,.07);
          border:1px solid rgba(200,242,96,.15);
          color:rgba(200,242,96,.6);
          font-size:9px;
          font-family:'Geist Mono',monospace;
          letter-spacing:.08em;
          text-transform:uppercase;
          padding:3px 10px;
          border-radius:6px;
          margin:6px 0 2px;
        }

        /* Mensagem bot */
        .msg-bot{max-width:88%;align-self:flex-start;}
        .msg-bot-b{
          background:#202C33;
          color:#E8E8E8;
          padding:8px 11px;
          border-radius:0 8px 8px 8px;
          font-size:12px;
          line-height:1.55;
        }
        .msg-bot-b strong{color:#C8F260;font-weight:600}
        .msg-bot-b .warn{color:#FFD700}
        .msg-meta{
          font-size:10px;color:#8696A0;
          text-align:right;margin-top:3px;
          font-family:'Geist Mono',monospace;
        }

        /* Mensagem usuário */
        .msg-user{align-self:flex-end;max-width:72%;}
        .msg-user-b{
          background:#005C4B;
          color:#E8E8E8;
          padding:8px 11px;
          border-radius:8px 0 8px 8px;
          font-size:12px;
          line-height:1.5;
          display:flex;flex-direction:column;
        }
        .msg-user-meta{
          display:flex;align-items:center;
          justify-content:flex-end;gap:3px;
          margin-top:3px;
        }
        .check{font-size:10px;color:#53BDEB}

        /* Opções numeradas */
        .opt-list{margin-top:5px;display:flex;flex-direction:column;gap:3px;}
        .opt{display:flex;align-items:flex-start;gap:5px;font-size:11.5px;}
        .opt-n{
          width:16px;height:16px;
          background:#1E4A6E;border:1px solid #2D6FA3;
          border-radius:3px;
          display:flex;align-items:center;justify-content:center;
          font-size:9px;font-weight:600;color:#6BB5F0;
          flex-shrink:0;margin-top:1px;
        }

        /* Resultado perfil */
        .perfil-box{
          background:rgba(45,35,86,.3);
          border:1px solid rgba(200,242,96,.15);
          border-radius:6px;
          padding:8px 10px;
          margin-top:5px;
        }
        .perfil-title{
          font-size:12px;font-weight:600;
          color:#C8F260;margin-bottom:4px;
        }
        .perfil-body{font-size:11.5px;color:#D0D0D0;line-height:1.5;}

        /* Input fake */
        .chat-input{
          background:#1F2C34;
          padding:8px 12px;
          display:flex;align-items:center;gap:8px;
        }
        .chat-input-fake{
          flex:1;background:#2A3942;
          border-radius:18px;padding:7px 12px;
          font-size:12px;color:#8696A0;
          font-family:'Geist',sans-serif;
        }
        .send-btn{
          width:32px;height:32px;background:#00A884;
          border-radius:50%;display:flex;align-items:center;
          justify-content:center;font-size:14px;flex-shrink:0;
        }

        /* restante da página igual ao original */
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
        .section{padding:88px 48px}
        .section-alt{background:var(--bone2)}
        .sec-tag{font-family:'Geist Mono',monospace;font-size:11px;color:var(--mute);letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px}
        .sec-h{font-size:38px;font-weight:600;color:var(--ink);letter-spacing:-0.025em;line-height:1.15;margin-bottom:12px}
        .sec-p{font-size:17px;color:var(--mute);line-height:1.6;max-width:500px}
        .feats{display:grid;grid-template-columns:repeat(2,1fr);gap:2px;margin-top:48px}
        .feat{padding:32px 28px;background:var(--bone);border:1px solid var(--bone3)}
        .feat:first-child{border-radius:16px 0 0 0}.feat:nth-child(2){border-radius:0 16px 0 0}
        .feat:nth-child(3){border-radius:0 0 0 16px}.feat:last-child{border-radius:0 0 16px 0}
        .feat-ico{width:46px;height:46px;background:var(--lime);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--aubergine);margin-bottom:18px}
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
        .footer-link:hover{color:var(--bone)}
        .footer-social{display:flex;gap:10px;margin-top:16px}
        .social-btn{display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);text-decoration:none;transition:all 0.15s}
        .social-btn:hover{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.08)}
        .social-btn svg{width:14px;height:14px;flex-shrink:0}
        .social-btn span{font-size:12px;color:var(--mute);font-family:'Geist',sans-serif}
        .footer-bottom{border-top:1px solid rgba(255,255,255,.06);padding-top:24px;display:flex;justify-content:space-between;align-items:flex-start;gap:32px}
        .footer-copy{font-family:'Geist Mono',monospace;font-size:11px;color:var(--mute);white-space:nowrap}
        .footer-cvm{font-size:12px;color:var(--mute);max-width:520px;line-height:1.6;opacity:.55}
        @media(max-width:900px){
          .nav{padding:0 20px}.nav-links .nav-link{display:none}
          .hero-outer > .hero{grid-template-columns:1fr;padding:56px 20px}.hero-h{font-size:48px}.chat-wrap{display:none}
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
          .pill{padding:6px 12px 6px 6px}.pill-text{font-size:12px}.pill-icon{width:22px;height:22px}.pill-icon img{width:16px;height:16px}
          .quote-section,.pricing-section{padding:56px 20px}
          .footer-social{flex-direction:column}
        }
      `}</style>

      <div className="lp">
        {/* NAV */}
        <nav className="nav">
          <a href="#" className="logo">
            <div className="logo-mark"><div className="bar bar-s"/><div className="bar bar-l"/><div className="bar bar-m"/></div>
            <span className="logo-name">Payroll <span>Chatbot</span></span>
          </a>
          <div className="nav-links">
            <a href="#como-funciona" className="nav-link">Como funciona</a>
            <a href="#planos" className="nav-link">Planos</a>
            <a href="#privacidade" className="nav-link">Legal</a>
            <a href="https://wa.me/5535910148222" className="nav-pill" target="_blank" rel="noopener noreferrer">Começar grátis →</a>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero-outer">
          <div className="hero">
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

            {/* ── CHAT MOCKUP REAL ── */}
            <div className="chat-wrap">

              {/* Header */}
              <div className="chat-header">
                <div className="chat-av">
                  <div className="bar bar-s"/><div className="bar bar-l"/><div className="bar bar-m"/>
                </div>
                <div className="chat-hinfo">
                  <div className="chat-hname">Payroll</div>
                  <div className="chat-hsub"><div className="online-dot"/><span>online</span></div>
                </div>
                <div className="chat-icons"><span>📹</span><span>📞</span></div>
              </div>

              {/* Body */}
              <div className="chat-body">

                <div className="chat-date">ter., 12 de maio</div>

                {/* ── ETAPA 1: Boas-vindas ── */}
                <div className="chat-step">01 · boas-vindas</div>

                {/* Usuário manda Oi */}
                <div className="msg-user">
                  <div className="msg-user-b">
                    <span>Oi</span>
                    <div className="msg-user-meta">
                      <span style={{fontSize:'10px',color:'#8696A0',fontFamily:'Geist Mono,monospace'}}>12:03</span>
                      <span className="check">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Bot: boas-vindas */}
                <div className="msg-bot">
                  <div className="msg-bot-b">
                    👋 Olá! Bem-vindo ao <strong>Payrollia</strong>, seu assistente educacional de investimentos.<br/><br/>
                    Estou aqui para te ajudar a entender o mercado financeiro de forma simples, clara e segura.<br/><br/>
                    Para começar, qual é o seu nome?
                    <div className="msg-meta">12:03</div>
                  </div>
                </div>

                {/* Usuário responde nome */}
                <div className="msg-user">
                  <div className="msg-user-b">
                    <span>Gustavo Gomes</span>
                    <div className="msg-user-meta">
                      <span style={{fontSize:'10px',color:'#8696A0',fontFamily:'Geist Mono,monospace'}}>12:03</span>
                      <span className="check">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* ── ETAPA 2: Suitability ── */}
                <div className="chat-step">02 · suitability CVM</div>

                {/* Bot: aviso + pergunta 1 */}
                <div className="msg-bot">
                  <div className="msg-bot-b">
                    Prazer, <strong>Gustavo Gomes!</strong> 😊<br/><br/>
                    <span className="warn">⚠️</span> <strong>Aviso CVM</strong> — O Payrollia é um assistente <strong>educacional</strong>. As informações não constituem recomendação de investimento. Responda <strong>1</strong> para confirmar.
                    <div className="msg-meta">12:04</div>
                  </div>
                </div>

                {/* Usuário confirma */}
                <div className="msg-user">
                  <div className="msg-user-b">
                    <span>1</span>
                    <div className="msg-user-meta">
                      <span style={{fontSize:'10px',color:'#8696A0',fontFamily:'Geist Mono,monospace'}}>12:04</span>
                      <span className="check">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Bot: pergunta 1 */}
                <div className="msg-bot">
                  <div className="msg-bot-b">
                    📌 <strong>Pergunta 1 de 8 — Objetivo</strong><br/><br/>
                    Qual é o seu principal objetivo ao investir?
                    <div className="opt-list">
                      <div className="opt"><span className="opt-n">1</span><span>Preservar meu dinheiro com segurança</span></div>
                      <div className="opt"><span className="opt-n">2</span><span>Crescer meu patrimônio no longo prazo</span></div>
                      <div className="opt"><span className="opt-n">3</span><span>Gerar renda passiva (dividendos, juros)</span></div>
                      <div className="opt"><span className="opt-n">4</span><span>Multiplicar capital, mesmo com mais risco</span></div>
                    </div>
                    <div className="msg-meta">12:04</div>
                  </div>
                </div>

                {/* ── ETAPA 3: Resultado ── */}
                <div className="chat-step">03 · resultado do perfil</div>

                {/* Bot: resultado */}
                <div className="msg-bot">
                  <div className="msg-bot-b">
                    ✅ <strong>Questionário concluído!</strong>
                    <div className="perfil-box">
                      <div className="perfil-title">🛡️ Perfil Conservador</div>
                      <div className="perfil-body">
                        Você prioriza a segurança do seu patrimônio. Indicados para você: <strong>Tesouro Selic, CDBs, LCI/LCA</strong> e fundos de renda fixa.
                      </div>
                    </div>
                    <br/>
                    Agora você pode me perguntar sobre investimentos! 💬 Experimente: <strong>O que é Tesouro Direto?</strong>
                    <div className="msg-meta">12:04</div>
                  </div>
                </div>

              </div>

              {/* Input fake */}
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
              {icon:"ti-messages",title:"Tudo no chat",desc:"Tire dúvidas sobre finanças diretamente no WhatsApp, a qualquer hora, sem formulários nem espera."},
              {icon:"ti-shield-check",title:"Conceitos de renda fixa",desc:"Entenda como funcionam Tesouro Direto, CDB, LCI e LCA — taxas, prazos, liquidez e tributação explicados de forma clara."},
              {icon:"ti-chart-line",title:"Dados de mercado",desc:"Consulte cotações, índices fundamentalistas e indicadores econômicos em tempo real para embasar seu estudo."},
              {icon:"ti-target",title:"Perfil de investidor",desc:"Descubra se você é conservador, moderado ou arrojado com base no questionário oficial de suitability da CVM."},
            ].map((f,i)=>(
              <div key={i} className="feat">
                <div className="feat-ico"><i className={`ti ${f.icon}`} aria-hidden="true"/></div>
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
                <li>3 perguntas por mês</li><li>Suitability CVM completo</li><li>Cotações em tempo real</li>
                <li className="off">Perguntas ilimitadas</li><li className="off">Dados fundamentalistas</li>
              </ul>
              <a href="https://wa.me/5535910148222" className="plan-btn plan-btn-ghost" target="_blank" rel="noopener noreferrer">Começar grátis</a>
            </div>
            <div className="plan pop">
              <div className="plan-tag">MAIS POPULAR</div>
              <div className="plan-name">Pro</div>
              <div className="plan-price">R$ 12,90</div>
              <div className="plan-cycle">/mês · via PIX</div>
              <ul className="plan-items">
                <li>Perguntas ilimitadas</li><li>Suitability CVM completo</li><li>Cotações B3 em tempo real</li>
                <li>Dados fundamentalistas</li><li>Selic · CDI · IPCA ao vivo</li>
              </ul>
              <a href="https://wa.me/5535910148222" className="plan-btn plan-btn-solid" target="_blank" rel="noopener noreferrer">Assinar Pro →</a>
            </div>
            <div className="plan">
              <div className="plan-name">Business</div>
              <div className="plan-price">R$ 29,90</div>
              <div className="plan-cycle">/mês · via PIX</div>
              <ul className="plan-items">
                <li>Tudo do plano Pro</li><li>Prioridade de resposta</li><li>Programa de indicação</li>
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
                <div className="logo-mark"><div className="bar bar-s"/><div className="bar bar-l"/><div className="bar bar-m"/></div>
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