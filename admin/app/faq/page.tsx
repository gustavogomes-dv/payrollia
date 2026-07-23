import type { Metadata } from "next";

const SITE_URL = "https://payrollia.com.br";

export const metadata: Metadata = {
  title: "Perguntas frequentes sobre investimentos",
  description:
    "O que é Selic, CDI, CDB e Tesouro Direto? Quanto preciso para começar a investir? Respostas simples e sem economês, em linguagem para iniciantes.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "Perguntas frequentes sobre investimentos | Payroll",
    description:
      "O que é Selic, CDI, CDB e Tesouro Direto? Quanto preciso para começar a investir? Respostas simples e sem economês.",
    url: `${SITE_URL}/faq`,
    siteName: "Payroll",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Payroll — Educação financeira no WhatsApp",
      },
    ],
  },
};

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

const GRUPOS = [
  {
    titulo: "Sobre o Payroll",
    itens: [
      {
        q: "O que é o Payroll?",
        a: "O Payroll é um assistente de educação financeira que funciona dentro do WhatsApp. Você manda suas dúvidas sobre dinheiro e investimentos por mensagem e recebe explicações claras, sem jargão. Ele também identifica seu perfil de investidor e consulta dados reais do mercado, como Selic, CDI e cotações da B3.",
      },
      {
        q: "Preciso baixar algum aplicativo?",
        a: "Não. O Payroll funciona no WhatsApp que você já tem instalado. Basta salvar o número (35) 91014-8222 e enviar uma mensagem. Não há cadastro, formulário nem download.",
      },
      {
        q: "Quanto custa?",
        a: "Começar é grátis. O plano gratuito inclui o questionário de perfil de investidor completo, consulta a cotações e um número limitado de perguntas. Para perguntas ilimitadas, os planos pagos começam em R$ 12,90 por mês.",
      },
      {
        q: "O Payroll diz onde eu devo investir?",
        a: "Não. O Payroll é um serviço estritamente educacional e não faz recomendação de investimento. Ele explica como cada tipo de aplicação funciona, quais são os riscos e o que considerar em uma decisão — mas a escolha é sempre sua. Para recomendação personalizada, procure um assessor certificado (CFP ou CGA).",
      },
      {
        q: "Meus dados ficam guardados?",
        a: "Você controla isso. O Payroll só guarda um resumo das conversas se você autorizar expressamente, e a qualquer momento pode enviar ESQUECER para apagar tudo ou O QUE VOCÊ SABE DE MIM para ver o que está armazenado, conforme a LGPD.",
      },
    ],
  },
  {
    titulo: "Primeiros passos",
    itens: [
      {
        q: "Quanto preciso ter para começar a investir?",
        a: "Menos do que a maioria das pessoas imagina. Vários títulos públicos e produtos de renda fixa são acessíveis com valores baixos, na casa de dezenas de reais. O ponto de partida costuma ser menos o valor e mais a organização: entender para que serve o dinheiro e em quanto tempo você pode precisar dele.",
      },
      {
        q: "O que é reserva de emergência?",
        a: "É o dinheiro guardado para imprevistos, como perder o emprego ou uma despesa médica inesperada. Por definição, precisa estar em aplicações de alta liquidez, ou seja, que você consegue resgatar rápido. Uma referência comum é reservar de 3 a 6 meses do seu custo de vida, mas o valor ideal depende da estabilidade da sua renda.",
      },
      {
        q: "O que é perfil de investidor (suitability)?",
        a: "É uma classificação que indica quanto risco faz sentido para a sua situação. Ela leva em conta objetivos, prazo, experiência e como você reagiria a oscilações. Os três perfis mais comuns são conservador, moderado e arrojado. O questionário do Payroll segue as normas da CVM e leva menos de 3 minutos.",
      },
      {
        q: "O que é liquidez?",
        a: "Liquidez é a facilidade de transformar um investimento em dinheiro na conta. Uma aplicação com liquidez diária permite resgate rápido; uma com liquidez no vencimento só devolve o dinheiro na data combinada. Quanto mais rápido você pode precisar do dinheiro, mais a liquidez importa.",
      },
    ],
  },
  {
    titulo: "Conceitos do mercado",
    itens: [
      {
        q: "O que é a Selic?",
        a: "A Selic é a taxa básica de juros da economia brasileira, definida pelo Copom (Comitê de Política Monetária do Banco Central). Ela serve como referência para o custo do crédito e para o rendimento de boa parte das aplicações de renda fixa. Quando a Selic muda, o rendimento de vários investimentos atrelados a ela muda junto.",
      },
      {
        q: "O que é o CDI?",
        a: "O CDI (Certificado de Depósito Interbancário) é a taxa dos empréstimos que os bancos fazem entre si, e costuma ficar bem próxima da Selic. Ele é usado como referência de rendimento na renda fixa: quando um investimento rende 100% do CDI, significa que acompanha essa taxa.",
      },
      {
        q: "O que é o IPCA?",
        a: "O IPCA é o índice oficial de inflação do Brasil, medido pelo IBGE. Ele mostra quanto os preços subiram em média num período. Na prática, serve para calcular o ganho real de um investimento: se uma aplicação rendeu 10% e a inflação foi 5%, o ganho acima da inflação foi de aproximadamente 5%.",
      },
      {
        q: "O que é Tesouro Direto?",
        a: "É o programa que permite a pessoas físicas comprarem títulos públicos, ou seja, emprestar dinheiro ao governo federal e receber juros por isso. Existem títulos atrelados à Selic, à inflação (IPCA) ou com taxa prefixada. É considerado o investimento de menor risco de crédito do país, já que quem garante é o Tesouro Nacional.",
      },
      {
        q: "O que é CDB?",
        a: "CDB (Certificado de Depósito Bancário) é um título em que você empresta dinheiro a um banco e recebe juros. O rendimento pode ser atrelado ao CDI, à inflação ou prefixado. CDBs contam com a proteção do FGC (Fundo Garantidor de Créditos) até o limite vigente por CPF e por instituição.",
      },
      {
        q: "Qual a diferença entre CDB e Tesouro Direto?",
        a: "A principal diferença está em quem toma o dinheiro emprestado: no Tesouro Direto é o governo federal; no CDB é um banco. Isso muda a garantia — o Tesouro é garantido pelo Tesouro Nacional, enquanto o CDB é coberto pelo FGC até o limite vigente. Prazos, liquidez e forma de rendimento também variam conforme o título. Qual faz mais sentido depende do seu objetivo, do prazo e do seu perfil.",
      },
      {
        q: "O que são LCI e LCA?",
        a: "São títulos de renda fixa emitidos por bancos, ligados ao setor imobiliário (LCI) e ao agronegócio (LCA). A característica mais citada é a isenção de Imposto de Renda para pessoa física. Também contam com cobertura do FGC até o limite vigente, e costumam ter prazo mínimo de carência antes do resgate.",
      },
      {
        q: "O que é um FII (fundo imobiliário)?",
        a: "Um FII reúne o dinheiro de vários investidores para aplicar em imóveis ou em títulos ligados ao setor imobiliário. As cotas são negociadas na bolsa, como ações, e parte dos rendimentos costuma ser distribuída periodicamente aos cotistas. Como qualquer renda variável, o valor das cotas oscila.",
      },
      {
        q: "O que significa renda fixa e renda variável?",
        a: "Na renda fixa você conhece de antemão a regra de remuneração — pode ser uma taxa definida ou algo atrelado a um índice, como CDI ou IPCA. Na renda variável, como ações e FIIs, não há regra de retorno definida e o valor oscila conforme o mercado. As duas envolvem riscos, de naturezas diferentes.",
      },
      {
        q: "O que é diversificação?",
        a: "É distribuir o dinheiro entre diferentes tipos de investimento em vez de concentrar tudo em um só. A lógica é que ativos diferentes reagem de formas diferentes aos mesmos eventos, então a oscilação de um pode ser compensada por outro. Diversificar reduz o risco de concentração, mas não elimina o risco.",
      },
      {
        q: "O que são juros compostos?",
        a: "São os juros que incidem não só sobre o valor inicial, mas também sobre os juros que já foram acumulados. Por isso o crescimento acelera com o tempo — o efeito é pequeno no começo e vai ficando mais relevante quanto maior o prazo. É o mesmo mecanismo que funciona a favor em investimentos e contra em dívidas.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GRUPOS.flatMap((g) =>
    g.itens.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <div className="faqpage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
        .faqpage{
          --bone:#FAF8F4;--bone2:#F2EFE8;--bone3:#E8E4DA;--bone4:#D4CFC2;
          --aubergine:#2D2356;--lime:#C8F260;--lime-700:#9CC23F;--coral:#FF8A65;
          --ink:#14102A;--mute:#6B6478;
          background:var(--bone);font-family:'Geist',sans-serif;color:var(--ink);min-height:100vh;
        }
        .faqpage *{box-sizing:border-box;margin:0;padding:0}

        .fq-nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:var(--bone);border-bottom:1px solid var(--bone3);position:sticky;top:0;z-index:100}
        .fq-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .fq-logo-mark{width:34px;height:34px;flex-shrink:0}
        .fq-logo-mark svg{width:100%;height:100%;display:block}
        .fq-logo-name{font-size:15px;font-weight:600;color:var(--aubergine);letter-spacing:-0.01em}
        .fq-logo-name span{font-weight:300;color:var(--mute)}
        .fq-nav-cta{background:var(--aubergine);color:var(--lime);padding:9px 22px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none;white-space:nowrap}

        .fq-hero{background:var(--aubergine);padding:72px 48px 64px}
        .fq-hero-inner{max-width:820px;margin:0 auto}
        .fq-tag{font-family:'Geist Mono',monospace;font-size:11px;color:var(--lime);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:20px;opacity:.8}
        .fq-h1{font-family:'Instrument Serif',serif;font-style:italic;font-size:56px;line-height:1.05;color:var(--bone);letter-spacing:-0.03em;margin-bottom:20px}
        .fq-h1 em{font-style:normal;color:var(--lime)}
        .fq-sub{font-size:17px;color:rgba(250,248,244,.6);line-height:1.7;max-width:560px}

        .fq-body{padding:72px 48px 88px}
        .fq-inner{max-width:820px;margin:0 auto}
        .fq-group{margin-bottom:56px}
        .fq-group:last-of-type{margin-bottom:0}
        .fq-group-h{font-family:'Geist Mono',monospace;font-size:11px;color:var(--lime-700);letter-spacing:.1em;text-transform:uppercase;font-weight:500;margin-bottom:8px}
        .fq-list{border-top:1px solid var(--bone3)}
        .fq-item{border-bottom:1px solid var(--bone3)}
        .fq-item summary{list-style:none;cursor:pointer;padding:22px 44px 22px 0;position:relative;font-size:17px;font-weight:500;color:var(--ink);line-height:1.45}
        .fq-item summary::-webkit-details-marker{display:none}
        .fq-item summary::after{content:'+';position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:24px;font-weight:300;color:var(--lime-700);line-height:1}
        .fq-item[open] summary::after{content:'−'}
        .fq-item summary:hover{color:var(--aubergine)}
        .fq-a{padding:0 44px 24px 0;font-size:15px;color:var(--mute);line-height:1.75}

        .fq-cta{background:var(--lime);border-radius:18px;padding:40px;margin-top:64px;text-align:center}
        .fq-cta-h{font-family:'Instrument Serif',serif;font-style:italic;font-size:32px;color:var(--aubergine);line-height:1.15;margin-bottom:12px;letter-spacing:-0.02em}
        .fq-cta-p{font-size:15px;color:var(--aubergine);opacity:.75;line-height:1.6;margin-bottom:24px;max-width:420px;margin-left:auto;margin-right:auto}
        .fq-cta-btn{background:var(--aubergine);color:var(--lime);padding:15px 32px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none;display:inline-block}

        .fq-note{margin-top:40px;padding:16px 20px;background:var(--bone2);border-left:3px solid var(--coral);border-radius:0 8px 8px 0;font-size:13px;color:var(--mute);line-height:1.65}
        .fq-back{display:inline-block;margin-top:32px;font-size:14px;color:var(--mute);text-decoration:none}
        .fq-back:hover{color:var(--aubergine)}

        @media(max-width:900px){
          .fq-nav{padding:0 20px}
          .fq-logo-name{display:none}
          .fq-hero{padding:48px 20px 44px}
          .fq-h1{font-size:38px}
          .fq-sub{font-size:15px}
          .fq-body{padding:48px 20px 64px}
          .fq-item summary{font-size:16px;padding:18px 36px 18px 0}
          .fq-a{font-size:14px;padding-right:36px}
          .fq-cta{padding:32px 24px}
          .fq-cta-h{font-size:26px}
        }
      `}</style>

      <nav className="fq-nav">
        <a href="/" className="fq-logo">
          <div className="fq-logo-mark"><PayrollLogo/></div>
          <span className="fq-logo-name">Payroll <span>Chatbot</span></span>
        </a>
        <a href="https://wa.me/5535910148222" className="fq-nav-cta" target="_blank" rel="noopener noreferrer">
          Começar grátis →
        </a>
      </nav>

      <header className="fq-hero">
        <div className="fq-hero-inner">
          <p className="fq-tag">Perguntas frequentes</p>
          <h1 className="fq-h1">Dúvidas que todo mundo tem<br/>(e ninguém <em>pergunta.</em>)</h1>
          <p className="fq-sub">
            Do &ldquo;o que é Selic&rdquo; ao &ldquo;quanto preciso pra começar&rdquo;. Respostas diretas, em português, sem economês.
          </p>
        </div>
      </header>

      <main className="fq-body">
        <div className="fq-inner">
          {GRUPOS.map((grupo, gi) => (
            <section key={gi} className="fq-group">
              <p className="fq-group-h">{grupo.titulo}</p>
              <div className="fq-list">
                {grupo.itens.map((item, i) => (
                  <details key={i} className="fq-item">
                    <summary>{item.q}</summary>
                    <p className="fq-a">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="fq-cta">
            <h2 className="fq-cta-h">Ficou outra dúvida?</h2>
            <p className="fq-cta-p">
              Manda no WhatsApp. O Payroll explica qualquer conceito financeiro na hora — e de graça pra começar.
            </p>
            <a href="https://wa.me/5535910148222" className="fq-cta-btn" target="_blank" rel="noopener noreferrer">
              Perguntar no WhatsApp →
            </a>
          </div>

          <p className="fq-note">
            O conteúdo desta página tem finalidade estritamente educacional e não constitui recomendação de investimento, nos termos da Resolução CVM n.º 20/2021 e das diretrizes da ANBIMA. Rentabilidade passada não é garantia de retorno futuro. Decisões de investimento são de exclusiva responsabilidade do investidor.
          </p>

          <a href="/" className="fq-back">← Voltar para a página inicial</a>
        </div>
      </main>
    </div>
  );
}