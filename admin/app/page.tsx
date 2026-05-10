'use client';

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #00C853;
          --green-dark: #009c3e;
          --black: #0a0a0a;
          --white: #ffffff;
          --off-white: #f8f8f5;
          --gray-1: #f0f0ec;
          --gray-2: #e0e0db;
          --gray-text: #777;
          --dark-text: #111;
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-text);
          background: var(--white);
          overflow-x: hidden;
        }
        a { text-decoration: none; color: inherit; }

        /* ─── NAV ──────────────────────────────────────────── */
        nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--gray-2);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 64px;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 20px; letter-spacing: -0.5px; color: var(--black);
        }
        .nav-logo span { color: var(--green); }
        .nav-links { display: flex; gap: 28px; list-style: none; }
        .nav-links a { font-size: 14px; color: var(--gray-text); transition: color 0.2s; }
        .nav-links a:hover { color: var(--dark-text); }
        .btn-nav {
          background: var(--green); color: #fff;
          padding: 9px 22px; border-radius: 100px;
          font-size: 14px; font-weight: 500;
          transition: opacity 0.2s, transform 0.2s;
        }
        .btn-nav:hover { opacity: 0.85; transform: translateY(-1px); }

        /* ─── HERO ─────────────────────────────────────────── */
        .hero {
          background: var(--black); color: var(--white);
          padding: 96px 48px 80px; text-align: center; position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 55% at 50% -10%, rgba(0,200,83,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,200,83,0.1); border: 1px solid rgba(0,200,83,0.25);
          border-radius: 100px; padding: 6px 16px;
          font-size: 11px; font-weight: 500; letter-spacing: 2px;
          text-transform: uppercase; color: var(--green); margin-bottom: 28px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--green);
          animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }

        .hero h1 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(38px, 7vw, 78px);
          line-height: 1.04; letter-spacing: -3px;
          margin-bottom: 24px;
        }
        .hero h1 em { font-style: normal; color: var(--green); display: block; }

        .hero-sub {
          font-size: clamp(15px, 2vw, 18px); color: rgba(255,255,255,0.5);
          font-weight: 300; max-width: 500px; margin: 0 auto 40px; line-height: 1.75;
        }
        .hero-actions {
          display: flex; gap: 14px; justify-content: center;
          align-items: center; flex-wrap: wrap; margin-bottom: 64px;
        }
        .btn-hero {
          background: var(--green); color: #000;
          padding: 15px 36px; border-radius: 100px;
          font-size: 16px; font-weight: 600;
          transition: all 0.2s; letter-spacing: -0.2px;
        }
        .btn-hero:hover { opacity: 0.88; transform: translateY(-2px); }
        .btn-ghost {
          color: rgba(255,255,255,0.45); font-size: 15px;
          display: inline-flex; align-items: center; gap: 5px;
          transition: color 0.2s;
        }
        .btn-ghost:hover { color: var(--white); }

        /* chat mockup */
        .mockup-wrap {
          max-width: 340px; margin: 0 auto;
          background: #161616; border-radius: 28px; padding: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 48px 96px rgba(0,0,0,0.55);
        }
        .mockup-header {
          display: flex; align-items: center; gap: 12px;
          padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 16px;
        }
        .mockup-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--green); display: flex; align-items: center;
          justify-content: center; font-size: 16px;
        }
        .mockup-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #eee; }
        .mockup-status { font-size: 11px; color: var(--green); }

        .bubble { border-radius: 16px; padding: 12px 16px; margin-bottom: 8px; font-size: 13px; line-height: 1.55; text-align: left; }
        .bubble-bot { background: #252525; color: #ddd; border-bottom-left-radius: 4px; }
        .bubble-user {
          background: var(--green); color: #000; font-weight: 500;
          border-bottom-right-radius: 4px; margin-left: auto; max-width: 80%;
        }

        /* ─── STATS ────────────────────────────────────────── */
        .stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid var(--gray-2);
        }
        .stat {
          padding: 40px 32px; text-align: center;
          border-right: 1px solid var(--gray-2);
        }
        .stat:last-child { border-right: none; }
        .stat-num {
          font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; color: var(--dark-text); letter-spacing: -2px;
        }
        .stat-num span { color: var(--green); }
        .stat-label { font-size: 13px; color: var(--gray-text); margin-top: 4px; }

        /* ─── COMO FUNCIONA ────────────────────────────────── */
        .section { padding: 96px 48px; }
        .section-tag {
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: var(--green);
          margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(28px, 4vw, 50px); letter-spacing: -2px;
          line-height: 1.1; margin-bottom: 16px; color: var(--dark-text);
        }
        .section-sub {
          font-size: 16px; color: var(--gray-text); max-width: 480px; line-height: 1.7;
        }

        .steps { display: flex; flex-direction: column; gap: 0; margin-top: 64px; }
        .step {
          display: grid; grid-template-columns: 64px 1fr;
          gap: 24px; padding: 36px 0;
          border-top: 1px solid var(--gray-2);
          align-items: flex-start;
        }
        .step:last-child { border-bottom: 1px solid var(--gray-2); }
        .step-num {
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          color: var(--gray-text); padding-top: 4px;
        }
        .step-content h3 {
          font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
          margin-bottom: 8px; color: var(--dark-text);
        }
        .step-content p { font-size: 15px; color: var(--gray-text); line-height: 1.65; }

        /* ─── PLANOS ───────────────────────────────────────── */
        .plans-section { padding: 96px 48px; background: var(--off-white); }
        .plans-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-top: 56px;
        }
        .plan {
          background: var(--white); border: 1px solid var(--gray-2);
          border-radius: 20px; padding: 36px 32px;
          display: flex; flex-direction: column; gap: 24px;
          position: relative; transition: border-color 0.2s, transform 0.2s;
        }
        .plan:hover { border-color: var(--green); transform: translateY(-4px); }
        .plan.featured { border-color: var(--green); background: #fff; }
        .plan-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: var(--green); color: #000; font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 4px 16px; border-radius: 100px;
        }
        .plan-name {
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: var(--gray-text);
        }
        .plan-price {
          display: flex; align-items: baseline; gap: 2px;
        }
        .plan-price-val {
          font-family: 'Syne', sans-serif; font-size: 44px;
          font-weight: 800; letter-spacing: -3px; color: var(--dark-text);
        }
        .plan-price-per { font-size: 14px; color: var(--gray-text); }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .plan-features li {
          font-size: 14px; color: var(--gray-text);
          display: flex; align-items: flex-start; gap: 10px;
        }
        .plan-features li::before {
          content: '✓'; color: var(--green); font-weight: 700;
          font-size: 13px; flex-shrink: 0; margin-top: 1px;
        }
        .btn-plan {
          display: block; text-align: center; padding: 13px;
          border-radius: 12px; font-size: 14px; font-weight: 600;
          transition: all 0.2s;
        }
        .btn-plan-outline {
          border: 1px solid var(--gray-2); color: var(--dark-text);
        }
        .btn-plan-outline:hover { border-color: var(--green); color: var(--green); }
        .btn-plan-filled { background: var(--green); color: #000; }
        .btn-plan-filled:hover { opacity: 0.88; }

        /* ─── DEPOIMENTOS ──────────────────────────────────── */
        .testimonials-section { padding: 96px 48px; }
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-top: 56px;
        }
        .testimonial {
          background: var(--off-white); border-radius: 20px; padding: 32px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .testimonial-quote { font-size: 15px; color: var(--dark-text); line-height: 1.7; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--green); display: flex; align-items: center;
          justify-content: center; font-size: 18px; flex-shrink: 0;
        }
        .testimonial-name { font-weight: 600; font-size: 14px; }
        .testimonial-role { font-size: 12px; color: var(--gray-text); margin-top: 2px; }

        /* ─── FAQ ──────────────────────────────────────────── */
        .faq-section { padding: 96px 48px; background: var(--off-white); }
        .faq-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin-top: 56px;
        }
        .faq-item {
          background: var(--white); border-radius: 16px; padding: 28px 32px;
        }
        .faq-q {
          font-family: 'Syne', sans-serif; font-size: 16px;
          font-weight: 700; margin-bottom: 12px; color: var(--dark-text);
        }
        .faq-a { font-size: 14px; color: var(--gray-text); line-height: 1.7; }

        /* ─── CTA FINAL ────────────────────────────────────── */
        .cta-section {
          background: var(--black); padding: 96px 48px;
          text-align: center; position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,200,83,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-section h2 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(32px, 5vw, 60px); letter-spacing: -2.5px;
          color: var(--white); margin-bottom: 20px; line-height: 1.1;
        }
        .cta-section h2 em { font-style: normal; color: var(--green); }
        .cta-section p {
          font-size: 16px; color: rgba(255,255,255,0.45);
          margin-bottom: 40px; max-width: 420px; margin-left: auto; margin-right: auto;
        }

        /* ─── FOOTER ───────────────────────────────────────── */
        footer {
          background: var(--black); border-top: 1px solid rgba(255,255,255,0.06);
          padding: 40px 48px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-logo {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 18px; color: var(--white); letter-spacing: -0.5px;
        }
        .footer-logo span { color: var(--green); }
        .footer-center { text-align: center; }
        .footer-cnpj { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 4px; }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { font-size: 13px; color: rgba(255,255,255,0.35); transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }

        /* ─── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 900px) {
          nav { padding: 0 24px; }
          .nav-links { display: none; }
          .hero { padding: 72px 24px 60px; }
          .section { padding: 64px 24px; }
          .plans-section, .testimonials-section, .faq-section, .cta-section { padding: 64px 24px; }
          .stats { grid-template-columns: 1fr; }
          .stat { border-right: none; border-bottom: 1px solid var(--gray-2); padding: 28px 24px; }
          .stat:last-child { border-bottom: none; }
          .plans-grid { grid-template-columns: 1fr; max-width: 400px; margin-left: auto; margin-right: auto; }
          .testimonials-grid { grid-template-columns: 1fr; max-width: 480px; margin-left: auto; margin-right: auto; }
          .faq-grid { grid-template-columns: 1fr; }
          footer { padding: 32px 24px; flex-direction: column; align-items: flex-start; gap: 20px; }
          .footer-center { text-align: left; }
        }

        @media (max-width: 600px) {
          .hero h1 { letter-spacing: -2px; }
          .hero-actions { flex-direction: column; }
          .btn-hero { width: 100%; text-align: center; }
          .step { grid-template-columns: 48px 1fr; gap: 16px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">Payroll <span>Chatbot</span></div>
        <ul className="nav-links">
          <li><a href="#como-funciona">Como funciona</a></li>
          <li><a href="#planos">Planos</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="/login" className="btn-nav">Painel Admin</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">
          <div className="dot" />
          Disponível no WhatsApp
        </div>
        <h1>
          Seu assistente de
          <em>investimentos.</em>
        </h1>
        <p className="hero-sub">
          Perfil de investidor, cotações em tempo real e orientação personalizada com IA.
          Tudo pelo WhatsApp. Sem app, sem cadastro.
        </p>
        <div className="hero-actions">
          <a
            href="https://wa.me/5535910148222"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero"
          >
            💬 Começar no WhatsApp
          </a>
          <a href="#planos" className="btn-ghost">Ver planos ↓</a>
        </div>

        {/* Chat mockup */}
        <div className="mockup-wrap">
          <div className="mockup-header">
            <div className="mockup-avatar">💰</div>
            <div>
              <div className="mockup-name">Payroll Chatbot</div>
              <div className="mockup-status">● Online agora</div>
            </div>
          </div>
          <div className="bubble bubble-bot">
            Olá! 👋 Sou o Payroll, seu assistente de investimentos.<br />
            Qual é o seu nome?
          </div>
          <div className="bubble bubble-user">Gustavo</div>
          <div className="bubble bubble-bot">
            Prazer, <strong>Gustavo</strong>! 😊<br />
            Vou fazer 8 perguntas rápidas para entender seu perfil de investidor. Menos de 2 minutos!
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <div className="stat-num">3<span>+</span></div>
          <div className="stat-label">Perfis de investidor</div>
        </div>
        <div className="stat">
          <div className="stat-num">100<span>%</span></div>
          <div className="stat-label">Via WhatsApp, sem app</div>
        </div>
        <div className="stat">
          <div className="stat-num">B3<span> ao vivo</span></div>
          <div className="stat-label">Cotações em tempo real</div>
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <section className="section" id="como-funciona">
        <div className="section-tag">Como funciona</div>
        <h2 className="section-title">Do primeiro oi ao<br />investimento consciente.</h2>
        <p className="section-sub">
          Seu assistente de investimentos funciona do começo ao fim pelo WhatsApp.
        </p>
        <div className="steps">
          {[
            {
              num: '01',
              title: 'Mande um "oi" no WhatsApp',
              desc: 'Sem app, sem cadastro, sem formulário. Basta mandar uma mensagem para o número da Payroll e começar.',
            },
            {
              num: '02',
              title: 'Descubra seu perfil de investidor',
              desc: 'Responda 8 perguntas rápidas baseadas nas normas da CVM. Em menos de 2 minutos você sabe se é conservador, moderado ou arrojado.',
            },
            {
              num: '03',
              title: 'Pergunte qualquer coisa sobre investimentos',
              desc: 'Tesouro Direto, FIIs, CDB, ações, criptomoedas — tire todas as suas dúvidas com uma IA treinada para o seu perfil.',
            },
            {
              num: '04',
              title: 'Acompanhe o mercado em tempo real',
              desc: 'Cotações da B3, Tesouro Direto e índices atualizados direto no chat. Sem precisar abrir nenhum outro app.',
            },
          ].map((s) => (
            <div key={s.num} className="step">
              <div className="step-num">{s.num}</div>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS */}
      <section className="plans-section" id="planos">
        <div className="section-tag">Planos</div>
        <h2 className="section-title">Simples e transparente.</h2>
        <div className="plans-grid">
          <div className="plan">
            <div className="plan-name">Free</div>
            <div className="plan-price">
              <div className="plan-price-val">R$0</div>
              <div className="plan-price-per">/mês</div>
            </div>
            <ul className="plan-features">
              <li>3 perguntas por mês</li>
              <li>Análise de perfil completa</li>
              <li>Acesso via WhatsApp</li>
            </ul>
            <a
              href="https://wa.me/5535910148222"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-plan btn-plan-outline"
            >
              Começar grátis
            </a>
          </div>

          <div className="plan featured">
            <div className="plan-badge">Mais popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">
              <div className="plan-price-val">R$12</div>
              <div className="plan-price-per">,90/mês</div>
            </div>
            <ul className="plan-features">
              <li>Perguntas ilimitadas</li>
              <li>Análise de perfil completa</li>
              <li>Cotações B3 em tempo real</li>
              <li>Suporte via WhatsApp</li>
            </ul>
            <a
              href="https://wa.me/5535910148222"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-plan btn-plan-filled"
            >
              Assinar Pro
            </a>
          </div>

          <div className="plan">
            <div className="plan-name">Business</div>
            <div className="plan-price">
              <div className="plan-price-val">R$29</div>
              <div className="plan-price-per">,90/mês</div>
            </div>
            <ul className="plan-features">
              <li>Tudo do Pro</li>
              <li>Alertas de mercado</li>
              <li>Relatórios avançados</li>
              <li>Suporte prioritário</li>
            </ul>
            <a
              href="https://wa.me/5535910148222"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-plan btn-plan-outline"
            >
              Assinar Business
            </a>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="testimonials-section">
        <div className="section-tag">Depoimentos</div>
        <h2 className="section-title">Quem já investe<br />com a Payroll.</h2>
        <div className="testimonials-grid">
          {[
            {
              emoji: '👩‍💼',
              quote: '"Finalmente entendi a diferença entre CDB e Tesouro Direto! O bot explica de um jeito muito claro e personalizado pro meu perfil."',
              name: 'Ana Flávia',
              role: 'Professora',
            },
            {
              emoji: '👨‍💻',
              quote: '"Uso todo dia pra acompanhar as cotações e tirar dúvidas sobre FIIs. É muito mais prático do que abrir vários apps."',
              name: 'Carlos Eduardo',
              role: 'Desenvolvedor',
            },
            {
              emoji: '👩‍🍳',
              quote: '"Nunca tinha investido antes. O questionário de perfil me ajudou a entender que sou conservadora e onde devo colocar meu dinheiro."',
              name: 'Mariana Costa',
              role: 'Empreendedora',
            },
          ].map((t) => (
            <div key={t.name} className="testimonial">
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.emoji}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="section-tag">Perguntas frequentes</div>
        <h2 className="section-title">Tudo que você<br />precisa saber.</h2>
        <div className="faq-grid">
          {[
            {
              q: 'Precisa baixar algum app?',
              a: 'Não. A Payroll funciona 100% pelo WhatsApp. Basta mandar uma mensagem para o nosso número e começar. Sem download, sem cadastro.',
            },
            {
              q: 'A Payroll é uma corretora?',
              a: 'Não. Somos um assistente educacional de investimentos regulamentado pelo formato da CVM. Não executamos operações nem gerenciamos seu dinheiro.',
            },
            {
              q: 'Como funciona o plano Free?',
              a: 'No plano gratuito você pode fazer até 3 perguntas por mês, além de completar o questionário de perfil sem custo.',
            },
            {
              q: 'As cotações são em tempo real?',
              a: 'Sim. Integramos com a API da Brapi para trazer cotações atualizadas da B3, Tesouro Direto e outros ativos direto no chat.',
            },
            {
              q: 'Posso cancelar quando quiser?',
              a: 'Sim. Você pode cancelar sua assinatura a qualquer momento pelo próprio WhatsApp. Sem multa, sem burocracia.',
            },
            {
              q: 'Meus dados estão seguros?',
              a: 'Sim. Seus dados são armazenados de forma segura e nunca compartilhados com terceiros. Seguimos as diretrizes da LGPD.',
            },
          ].map((f) => (
            <div key={f.q} className="faq-item">
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section">
        <h2>Pronto para investir<br /><em>com inteligência?</em></h2>
        <p>Mande uma mensagem agora e descubra seu perfil de investidor em menos de 2 minutos.</p>
        <a
          href="https://wa.me/5535910148222"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hero"
        >
          💬 Começar no WhatsApp
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="footer-logo">Payroll <span>Chatbot</span></div>
          <div className="footer-cnpj">CNPJ: 66.618.119/0001-30 · Payroll Chatbot Inova Simples (I.S.)</div>
        </div>
        <div className="footer-center">
          <div className="footer-copy">© 2026 Payroll Chatbot. Todos os direitos reservados.</div>
          <div className="footer-cnpj">Assistente educacional de investimentos · Não somos corretora ou assessor CVM</div>
        </div>
        <div className="footer-links">
          <a href="https://wa.me/5535910148222" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="/login">Admin</a>
        </div>
      </footer>
    </>
  );
}