
export const metadata = {
  title: 'Programa de Indicação — Payroll Chatbot',
  description: 'Indique amigos para o Payroll Chatbot e ganhe descontos. Seu amigo ganha 10% e você ganha 50% de cupom.',
};

export default function ProgramaIndicacao() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
        :root {
          --bone:#FAF8F4;--bone2:#F2EFE8;--bone3:#E8E4DA;--bone4:#D4CFC2;
          --aubergine:#2D2356;--aubergine-400:#7561AF;--lime:#C8F260;--coral:#FF8A65;
          --ink:#14102A;--mute:#6B6478;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:var(--bone);font-family:'Geist',sans-serif;color:var(--ink)}

        .nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:var(--aubergine)}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo-mark{width:32px;height:32px;flex-shrink:0}
        .logo-mark svg{width:100%;height:100%;display:block}
        .logo-name{font-size:15px;font-weight:600;color:var(--bone);letter-spacing:-0.01em}
        .back-link{font-size:14px;font-weight:500;color:var(--lime);text-decoration:none}

        /* HERO */
        .hero{background:var(--aubergine);padding:72px 32px 88px;text-align:center}
        .hero-inner{max-width:720px;margin:0 auto}
        .hero-tag{font-family:'Geist Mono',monospace;font-size:11px;color:var(--lime);letter-spacing:.12em;text-transform:uppercase;margin-bottom:20px;opacity:.85}
        .hero-h{font-family:'Instrument Serif',serif;font-style:italic;font-size:60px;color:var(--bone);line-height:1.02;letter-spacing:-0.03em;margin-bottom:20px}
        .hero-h em{font-style:normal;color:var(--lime)}
        .hero-p{font-size:17px;color:rgba(250,248,244,.65);line-height:1.7;max-width:520px;margin:0 auto 36px}
        .hero-cta{display:inline-flex;align-items:center;gap:8px;background:var(--lime);color:var(--aubergine);padding:14px 32px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none}

        /* container */
        .container{max-width:860px;margin:0 auto;padding:72px 32px 96px}

        /* cards de recompensa */
        .rewards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:72px}
        .reward{background:var(--bone2);border:1px solid var(--bone3);border-radius:18px;padding:32px 28px}
        .reward-badge{display:inline-block;font-family:'Geist Mono',monospace;font-size:11px;font-weight:500;padding:4px 12px;border-radius:100px;letter-spacing:.05em;margin-bottom:18px}
        .reward-badge.you{background:var(--lime);color:var(--aubergine)}
        .reward-badge.friend{background:rgba(45,35,86,.08);color:var(--aubergine);border:1px solid rgba(45,35,86,.15)}
        .reward-pct{font-family:'Instrument Serif',serif;font-style:italic;font-size:56px;color:var(--aubergine);line-height:1;margin-bottom:10px}
        .reward-title{font-size:16px;font-weight:600;color:var(--ink);margin-bottom:6px}
        .reward-desc{font-size:14px;color:var(--mute);line-height:1.6}

        /* section */
        .section-tag{font-family:'Geist Mono',monospace;font-size:11px;color:var(--mute);letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px}
        .section-h{font-family:'Instrument Serif',serif;font-style:italic;font-size:38px;color:var(--ink);line-height:1.1;margin-bottom:40px;font-weight:400}

        /* passos */
        .steps{display:flex;flex-direction:column;gap:2px;margin-bottom:72px}
        .step{display:flex;gap:20px;align-items:flex-start;background:var(--bone2);border:1px solid var(--bone3);padding:24px 28px}
        .step:first-child{border-radius:16px 16px 0 0}
        .step:last-child{border-radius:0 0 16px 16px}
        .step:not(:last-child){border-bottom:none}
        .step-num{flex-shrink:0;width:36px;height:36px;background:var(--aubergine);color:var(--lime);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:15px;font-weight:600}
        .step-content h3{font-size:16px;font-weight:600;color:var(--ink);margin-bottom:5px}
        .step-content p{font-size:14px;color:var(--mute);line-height:1.6}
        .step-content code{background:var(--aubergine);color:var(--lime);padding:2px 8px;border-radius:6px;font-family:'Geist Mono',monospace;font-size:13px;font-weight:500}

        /* regras */
        .rules{background:var(--bone2);border:1px solid var(--bone3);border-radius:16px;padding:32px;margin-bottom:48px}
        .rules h3{font-size:15px;font-weight:600;color:var(--ink);margin-bottom:16px}
        .rule{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:var(--mute);line-height:1.6;padding:7px 0}
        .rule-check{flex-shrink:0;color:var(--lime);font-weight:700;margin-top:1px}
        .rule strong{color:var(--ink);font-weight:600}

        /* CTA box */
        .cta-box{margin-top:8px;padding:36px 32px;background:var(--aubergine);border-radius:16px;text-align:center}
        .cta-box .cta-title{color:var(--bone);font-weight:600;font-size:20px;margin-bottom:6px;font-family:'Instrument Serif',serif;font-style:italic}
        .cta-box .cta-sub{color:rgba(250,248,244,.6);font-size:14px;margin-bottom:24px}
        .cta-box .cta-btn{display:inline-flex;align-items:center;gap:8px;background:var(--lime);color:var(--aubergine);padding:14px 32px;border-radius:100px;font-weight:600;font-size:15px;text-decoration:none}

        .see-also{margin-top:32px;font-size:14px;color:var(--mute);text-align:center}
        .see-also a{color:var(--ink);font-weight:600;text-decoration:none}

        .disclaimer{margin-top:40px;font-size:12px;color:var(--mute);line-height:1.6;opacity:.7;text-align:center;max-width:600px;margin-left:auto;margin-right:auto}

        @media(max-width:600px){
          .nav{padding:0 20px}
          .hero{padding:48px 20px 64px}.hero-h{font-size:40px}
          .container{padding:48px 20px 64px}
          .rewards{grid-template-columns:1fr}
          .section-h{font-size:30px}
        }
      `}</style>

      <nav className="nav">
        <a href="" className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Payroll Chatbot">
              <rect width="64" height="64" rx="14" fill="#FAF8F4" />
              <rect x="12" y="14" width="24" height="11" rx="5.5" fill="#2D2356" />
              <rect x="12" y="27" width="40" height="11" rx="5.5" fill="#2D2356" />
              <rect x="12" y="40" width="32" height="11" rx="5.5" fill="#2D2356" />
            </svg>
          </div>
          <span className="logo-name">Payroll Chatbot</span>
        </a>
        <a href="" className="back-link">← Voltar ao início</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-tag">Programa de indicação</p>
          <h1 className="hero-h">Indique amigos.<br/>Ganhem <em>juntos.</em></h1>
          <p className="hero-p">
            Compartilhe o Payroll Chatbot com quem você gosta. Seu amigo entra com desconto,
            e você ganha um cupom toda vez que alguém assina com o seu código.
          </p>
          <a href="https://wa.me/5535910148222?text=INDICAR" className="hero-cta" target="_blank" rel="noopener noreferrer">
            Gerar meu código →
          </a>
        </div>
      </section>

      <div className="container">

        {/* RECOMPENSAS */}
        <div className="rewards">
          <div className="reward">
            <span className="reward-badge friend">Para quem você indica</span>
            <div className="reward-pct">10%</div>
            <div className="reward-title">de desconto na assinatura</div>
            <p className="reward-desc">
              Seu amigo usa o seu código e ganha 10% de desconto ao assinar qualquer plano pago.
            </p>
          </div>
          <div className="reward">
            <span className="reward-badge you">Para você</span>
            <div className="reward-pct">50%</div>
            <div className="reward-title">de cupom de recompensa</div>
            <p className="reward-desc">
              Quando seu amigo assina usando seu código, você recebe um cupom de 50% para usar na
              sua próxima renovação.
            </p>
          </div>
        </div>

        {/* COMO FUNCIONA */}
        <p className="section-tag">Como funciona</p>
        <h2 className="section-h">Três passos.</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-content">
              <h3>Gere o seu código</h3>
              <p>Mande <code>INDICAR</code> para o Payroll Chatbot no WhatsApp. Ele cria um código único só seu, tipo <code>GUST-X7K2</code>.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-content">
              <h3>Compartilhe com amigos</h3>
              <p>Envie o seu código para quem quiser. Quando eles forem assinar um plano, é só informar o código para garantir os 10% de desconto.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-content">
              <h3>Ganhe sua recompensa</h3>
              <p>Assim que o seu amigo assina, você recebe automaticamente no WhatsApp um cupom de 50% para a sua próxima assinatura ou renovação.</p>
            </div>
          </div>
        </div>

        {/* REGRAS */}
        <div className="rules">
          <h3>Regras do programa</h3>
          <div className="rule"><span className="rule-check">✓</span><span>O código de indicação é <strong>pessoal e intransferível</strong>.</span></div>
          <div className="rule"><span className="rule-check">✓</span><span>O desconto do indicado é de <strong>10%</strong> e o cupom de recompensa do indicador é de <strong>50%</strong>.</span></div>
          <div className="rule"><span className="rule-check">✓</span><span>Cada código tem <strong>validade de 30 dias</strong> a partir da geração.</span></div>
          <div className="rule"><span className="rule-check">✓</span><span>A recompensa é liberada somente após a <strong>confirmação do pagamento</strong> do indicado.</span></div>
          <div className="rule"><span className="rule-check">✓</span><span>Os cupons são processados de forma segura pela <strong>AbacatePay</strong>.</span></div>
        </div>

        {/* CTA */}
        <div className="cta-box">
          <p className="cta-title">Pronto para começar?</p>
          <p className="cta-sub">Mande INDICAR no WhatsApp e gere o seu código agora.</p>
          <a href="https://wa.me/5535910148222?text=INDICAR" className="cta-btn" target="_blank" rel="noopener noreferrer">
            Gerar meu código →
          </a>
        </div>

        <p className="see-also">
          Veja também:{' '}
          <a href="">Início →</a>{'  ·  '}
          <a href="/termos">Termos de uso →</a>
        </p>

        <p className="disclaimer">
          O Payroll Chatbot é um serviço de educação financeira em conformidade com a Resolução CVM
          n.º 20/2021 e as diretrizes da ANBIMA. O programa de indicação pode ser alterado ou
          encerrado a qualquer momento, mediante aviso aos usuários.
        </p>
      </div>
    </>
  );
}