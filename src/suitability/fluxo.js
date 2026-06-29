const PERGUNTAS = require('./perguntas');
const calcularPerfil = require('./calcularPerfil');
const { askClaude } = require('../ai/claude');
const { getMarketData } = require('../services/market');
const jurosCompostos = require('../services/jurosCompostos');
const { getOrCreateReferralCode, getReferralByCode } = require('../db/referrals');
const {
  updateSession,
  updateUser,
  saveInvestorProfile,
  getInvestorProfile,
  saveMessage,
  getRecentMessages,
} = require('../db/users');

// ─── Constantes ────────────────────────────────────────────────────────────────
const LIMITE_FREE_PADRAO = 3; // fallback se a tabela settings não responder

// Lê o limite do plano free da tabela `settings`, com cache em memória (60s)
// para não consultar o banco a cada mensagem.
let _limiteCache = { value: LIMITE_FREE_PADRAO, ts: 0 };
async function getLimiteFree() {
  const agora = Date.now();
  if (agora - _limiteCache.ts < 60000) return _limiteCache.value;

  try {
    const { pool } = require('../db/index');
    const { rows } = await pool.query(
      `SELECT value FROM settings WHERE key = 'free_question_limit' LIMIT 1`
    );
    const v = rows[0] ? parseInt(rows[0].value) : LIMITE_FREE_PADRAO;
    _limiteCache = { value: Number.isNaN(v) ? LIMITE_FREE_PADRAO : v, ts: agora };
  } catch (err) {
    console.warn('[Fluxo] Erro ao ler limite free das settings, usando padrão:', err.message);
    _limiteCache = { value: LIMITE_FREE_PADRAO, ts: agora };
  }
  return _limiteCache.value;
}

const DISCLAIMER = `⚠️ *Aviso Importante — CVM*

O *Payroll* é um assistente *educacional* de investimentos. Não somos uma corretora, banco ou assessor de investimentos certificado pela CVM.

As informações fornecidas *não constituem recomendação de investimento*. Antes de tomar qualquer decisão financeira, consulte um profissional devidamente certificado.

Ao continuar, você declara que leu e compreendeu este aviso.

Responda *1* para confirmar e prosseguir.`;

// ─── Gerar link de pagamento via AbacatePay ────────────────────────────────────
async function gerarLinkPagamento(user, plano, cupom = null) {
  try {
    const PLANOS_CONFIG = {
      pro:      { id: 'prod_uLrmaCFtjSSp2Lq3QU5Wygcg', quantity: 1 },
      business: { id: 'prod_paPRqMFjyRE2SWDXGsZqrgqE', quantity: 1 },
    };

    const config = PLANOS_CONFIG[plano];
    if (!config) throw new Error(`Plano inválido: ${plano}`);

    const body = {
      items: [{ id: config.id, quantity: config.quantity }],
      methods: ['PIX', 'CARD'],
      returnUrl: 'https://payrollia.com.br',
      completionUrl: 'https://payrollia.com.br',
      metadata: {
        phone: user.phone,
        plano: plano,
        cupom_indicacao: cupom || null,
      },
    };

    if (cupom) body.coupons = [cupom];

    console.log('[AbacatePay] Enviando:', JSON.stringify(body));

    const response = await fetch('https://api.abacatepay.com/v2/checkouts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[AbacatePay] Resposta:', JSON.stringify(data));

    if (!response.ok || !data.success) {
      console.error('[AbacatePay] Erro ao gerar link:', data);
      return null;
    }

    return data?.data?.url || null;
  } catch (err) {
    console.error('[AbacatePay] Exceção ao gerar link:', err.message);
    return null;
  }
}

// ─── Validar cupom na AbacatePay ───────────────────────────────────────────────
async function validarCupom(cupom) {
  try {
    const response = await fetch(`https://api.abacatepay.com/v2/coupons/${cupom}`, {
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Verificar se usuário atingiu limite do plano Free ────────────────────────
function atingiuLimite(user, limite) {
  if ((user.plano || 'free') !== 'free') return false;
  return (user.perguntas_usadas || 0) >= limite;
}

// ─── Incrementar contador de perguntas usadas ─────────────────────────────────
async function incrementarPerguntas(userId) {
  const { pool, redisClient } = require('../db/index');

  const { rows } = await pool.query(
    `UPDATE users SET perguntas_usadas = COALESCE(perguntas_usadas, 0) + 1
     WHERE id = $1 RETURNING tenant_id, phone`,
    [userId]
  );

  if (rows[0]) {
    const { tenant_id, phone } = rows[0];
    await redisClient.del(`user:${tenant_id}:${phone}`);
  }
}

// ─── Mensagem de limite atingido ───────────────────────────────────────────────
function mensagemLimite(userName, limite) {
  const nome = userName ? `, ${userName}` : '';
  return `Você atingiu o limite de *${limite} perguntas* do plano gratuito${nome}. 😕

Para continuar aprendendo sobre investimentos sem restrições, escolha um dos planos abaixo:

*1️⃣ Plano Pro — R$ 12,90/mês*
✅ Perguntas ilimitadas
✅ Análise completa do seu perfil de investidor

*2️⃣ Plano Business — R$ 29,90/mês*
✅ Tudo do plano Pro
✅ Alertas de mercado em tempo real
✅ Suporte prioritário

Responda *1* ou *2* para escolher seu plano.`;
}

// ─── Normalizar texto — remove acentos e coloca em minúsculo ──────────────────
function normalizar(texto) {
  return texto.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ─── Processamento principal ───────────────────────────────────────────────────
async function processarFluxo(user, session, mensagem) {
  const texto = mensagem.trim();
  const step = session.step || 'inicio';
  const context = session.context || {};

  // ── Comando global de indicação — funciona em qualquer step após onboarding ──
  if (step === 'concluido' && ['indicar', 'indicacao', 'indicação', 'referral'].includes(normalizar(texto))) {
    const referral = await getOrCreateReferralCode(user);
    const expira = new Date(referral.expires_at).toLocaleDateString('pt-BR');
    return `🎁 *Programa de Indicação Payroll*\n\nCompartilhe seu código com amigos e ambos ganham!\n\n*Seu código:* \`${referral.code}\`\n\n✅ Seu amigo ganha *10% de desconto* na primeira assinatura\n🎉 Você ganha *50% de desconto* quando ele assinar\n\n⏰ Código válido até *${expira}*\n\nBasta enviar este código para seu amigo. Quando ele for assinar, é só digitar o código no campo de cupom!\n\n_Quanto mais amigos você indicar, mais você economiza!_ 😊`;
  }

  // ── Boas-vindas ──────────────────────────────────────────────────────────────
  if (step === 'inicio') {
    await updateSession(user.id, 'aguardando_nome', {});
    return `👋 Olá! Bem-vindo ao *Payroll*, seu assistente educacional de investimentos.\n\nEstou aqui para te ajudar a entender o mercado financeiro de forma simples, clara e segura.\n\nPara começar, qual é o seu nome?`;
  }

  // ── Coleta o nome ────────────────────────────────────────────────────────────
  if (step === 'aguardando_nome') {
    await updateUser(user.id, { name: texto });
    await updateSession(user.id, 'aguardando_disclaimer', { nome: texto });
    return `Prazer em conhecê-lo, *${texto}*! 😊\n\n${DISCLAIMER}`;
  }

  // ── Confirmação do disclaimer ────────────────────────────────────────────────
  if (step === 'aguardando_disclaimer') {
    if (texto !== '1') {
      return `Para utilizar o Payroll, é necessário confirmar que você leu e compreendeu o aviso acima. Responda *1* para continuar.`;
    }
    await updateSession(user.id, 'suitability_0', { ...context, respostas: {} });
    return `Ótimo! Antes de começar, vou fazer *8 perguntas rápidas* para identificar o seu perfil de investidor.\n\nIsso leva menos de 2 minutos. Vamos lá! 🚀\n\n${PERGUNTAS[0].texto}`;
  }

  // ── Questionário suitability ─────────────────────────────────────────────────
  if (step.startsWith('suitability_')) {
    const index = parseInt(step.split('_')[1]);
    const perguntaAtual = PERGUNTAS[index];

    if (!perguntaAtual.opcoes[texto]) {
      const maxOpcao = Object.keys(perguntaAtual.opcoes).length;
      return `Resposta inválida. Por favor, responda com um número entre *1* e *${maxOpcao}*.`;
    }

    const respostas = context.respostas || {};
    respostas[perguntaAtual.id] = perguntaAtual.opcoes[texto];

    const pontos = context.pontos || 0;
    const novosPontos = pontos + perguntaAtual.pontos[texto];
    const proximoIndex = index + 1;

    if (proximoIndex < PERGUNTAS.length) {
      await updateSession(user.id, `suitability_${proximoIndex}`, {
        ...context,
        respostas,
        pontos: novosPontos,
      });
      return PERGUNTAS[proximoIndex].texto;
    }

    const resultado = calcularPerfil(novosPontos);
    await saveInvestorProfile(user.id, respostas, resultado.perfil, novosPontos);
    await updateUser(user.id, { onboarding_complete: true });
    await updateSession(user.id, 'concluido', {});

    return `✅ *Questionário concluído!*

${resultado.descricao}

${resultado.explicacao}

${resultado.aviso}

---
Agora você pode me perguntar sobre investimentos! Estou aqui para te *orientar e educar* com base no seu perfil de investidor.

💬 Experimente perguntar:
• "O que é Tesouro Direto?"
• "Como funcionam os FIIs?"
• "Qual a diferença entre CDB e LCI?"

💡 Dica: Digite *INDICAR* para ganhar descontos indicando amigos!`;
  }

  // ── Chat principal ────────────────────────────────────────────────────────────
  if (step === 'concluido') {

    const saudacoes = ['oi', 'ola', 'hey', 'hi', 'bom dia', 'boa tarde', 'boa noite'];
    if (saudacoes.includes(normalizar(texto))) {
      const perfil = user.perfil || (await getInvestorProfile(user.id))?.perfil || 'moderado';
      const nome = user.name ? `, ${user.name.split(' ')[0]}` : '';
      return `Olá novamente${nome}! 👋 Seu perfil de investidor é *${perfil}*.\n\nComo posso te ajudar hoje? Fique à vontade para perguntar sobre investimentos, mercado financeiro ou qualquer dúvida relacionada! 😊\n\n💡 Digite *INDICAR* para ganhar descontos indicando amigos!`;
    }

    // ── Calculadora de juros compostos (detecção automática + fluxo guiado) ──
    // Se a mensagem tem intenção de simular juros, tenta extrair os parâmetros.
    // Completo → calcula na hora. Incompleto → entra no fluxo guiado (step 'calculadora').
    // Cálculo é 100% determinístico (jurosCompostos.js) — o Claude NUNCA calcula isto.
    if (jurosCompostos.pedeCalculadora(texto)) {
      const params = jurosCompostos.parseFraseJuros(texto);
      const validacao = jurosCompostos.validarParametros(params);

      if (validacao.ok) {
        // Tudo presente já na primeira frase → calcula direto
        const resposta = jurosCompostos.simular(validacao.params);
        if ((user.plano || 'free') === 'free') await incrementarPerguntas(user.id);
        return resposta;
      }

      if (validacao.erro) {
        // Número absurdo (taxa/prazo fora da faixa) — orienta sem entrar no fluxo
        return `Hmm, encontrei um valor que não parece certo para a simulação 🤔\n\nPode tentar de novo? Exemplo: _"simular 10 mil a 12% ao ano por 5 anos"_.`;
      }

      // Faltam dados → entra no fluxo guiado, guardando o que já temos
      await updateSession(user.id, 'calculadora', { calcParams: params });
      const prox = jurosCompostos.proximaPergunta(validacao.faltando);
      return `Vamos simular juros compostos! 🧮\n\n${prox.pergunta}\n\n_(Digite *cancelar* a qualquer momento para sair.)_`;
    }

    const limiteFree = await getLimiteFree();
    if (atingiuLimite(user, limiteFree)) {
      await updateSession(user.id, 'aguardando_escolha_plano', {});
      return mensagemLimite(user.name, limiteFree);
    }

    try {
      const perfil = user.perfil || (await getInvestorProfile(user.id))?.perfil || 'moderado';
      const marketContext = await getMarketData(texto);
      const historico = await getRecentMessages(user.id, 10);

      await saveMessage(user.id, 'user', texto);
      // Camada 1 — "companheiro financeiro": passa o nome do usuário para o Claude
      // personalizar o tom. O perfil (suitability) já era injetado; agora o nome também.
      const resposta = await askClaude(texto, marketContext, perfil, historico, user.name);
      await saveMessage(user.id, 'assistant', resposta);

      if ((user.plano || 'free') === 'free') {
        await incrementarPerguntas(user.id);
      }

      return resposta;
    } catch (error) {
      console.error('[Fluxo] Erro ao chamar Claude:', error);
      return `Desculpe, ocorreu um problema ao processar sua pergunta. Por favor, tente novamente em instantes. 🙏`;
    }
  }

  // ── Calculadora de juros: fluxo guiado (pergunta o que faltou) ────────────────
  if (step === 'calculadora') {
    // Escape: usuário pode cancelar a qualquer momento
    if (['cancelar', 'sair', 'cancela', 'para', 'parar'].includes(normalizar(texto))) {
      await updateSession(user.id, 'concluido', {});
      return `Tudo bem, simulação cancelada! 😊\n\nQuando quiser, é só me pedir de novo ou perguntar qualquer outra coisa sobre investimentos.`;
    }

    // Mescla a nova resposta com o que já tínhamos
    const acumulado = jurosCompostos.mesclarParams(context.calcParams || {}, texto);
    const validacao = jurosCompostos.validarParametros(acumulado);

    if (validacao.ok) {
      // Completou! Calcula e volta pro chat normal
      await updateSession(user.id, 'concluido', {});
      const resposta = jurosCompostos.simular(validacao.params);
      if ((user.plano || 'free') === 'free') await incrementarPerguntas(user.id);
      return resposta;
    }

    if (validacao.erro) {
      // Valor absurdo numa das respostas — pede de novo o mesmo campo, sem avançar
      await updateSession(user.id, 'calculadora', { calcParams: context.calcParams || {} });
      return `Esse valor não parece certo 🤔 Pode tentar de novo?\n\n_(Ou digite *cancelar* para sair.)_`;
    }

    // Ainda falta algo → pergunta o próximo, guardando o progresso
    await updateSession(user.id, 'calculadora', { calcParams: acumulado });
    const prox = jurosCompostos.proximaPergunta(validacao.faltando);
    return `${prox.pergunta}\n\n_(Digite *cancelar* para sair.)_`;
  }

  // ── Upgrade: escolha do plano ─────────────────────────────────────────────────
  if (step === 'aguardando_escolha_plano') {
    if (texto !== '1' && texto !== '2') {
      return `Por favor, responda *1* para o Plano Pro ou *2* para o Plano Business.`;
    }
    const plano = texto === '1' ? 'pro' : 'business';
    await updateSession(user.id, 'aguardando_cupom', { plano });
    return `Ótima escolha! 🎉\n\nVocê possui algum *cupom de desconto* ou *código de indicação*?\n\nResponda *SIM* ou *NÃO*.`;
  }

  // ── Upgrade: tem cupom? ───────────────────────────────────────────────────────
  if (step === 'aguardando_cupom') {
    const { plano } = context;
    const resposta = normalizar(texto);

    if (resposta === 'sim' || resposta === 's') {
      await updateSession(user.id, 'aguardando_codigo_cupom', { plano });
      return `Ótimo! Por favor, digite o seu código de cupom ou de indicação:`;
    }

    if (resposta === 'nao' || resposta === 'n' || resposta === 'no') {
      const link = await gerarLinkPagamento(user, plano);

      if (!link) {
        await updateSession(user.id, 'concluido', {});
        return `Ops! Tive um problema ao gerar seu link de pagamento. Por favor, tente novamente em instantes ou entre em contato com o suporte. 🙏`;
      }

      await updateSession(user.id, 'aguardando_pagamento', { plano });
      const nomeExibicao = plano === 'pro' ? 'Pro — R$ 12,90/mês' : 'Business — R$ 29,90/mês';
      return `Perfeito! Acesse o link abaixo para assinar o plano *${nomeExibicao}*:\n\n🔗 ${link}\n\nVocê pode pagar via *Pix* ou *cartão de crédito*. Assim que o pagamento for confirmado, seu acesso será liberado automaticamente. ✅`;
    }

    return `Por favor, responda *SIM* ou *NÃO*.`;
  }

  // ── Upgrade: validar código do cupom ou indicação ─────────────────────────────
  if (step === 'aguardando_codigo_cupom') {
    const { plano } = context;
    const cupom = texto.toUpperCase().trim();

    // Verifica se é código de indicação (formato XXXX-XXXX)
    const referral = await getReferralByCode(cupom);
    if (referral) {
      // Não pode usar o próprio código
      if (referral.referrer_id === user.id) {
        return `Ops! Você não pode usar o seu próprio código de indicação. 😅\n\nDigite outro código ou responda *NÃO* para continuar sem desconto.`;
      }

      // Cria cupom de 10% na AbacatePay para esse usuário
      const cupomIndicacao = await criarCupomIndicacao(cupom, referral.discount_pct);

      if (!cupomIndicacao) {
        // Se não conseguir criar o cupom, prossegue sem desconto
        const link = await gerarLinkPagamento(user, plano);
        await updateSession(user.id, 'aguardando_pagamento', { plano, referral_code: cupom });
        const nomeExibicao = plano === 'pro' ? 'Pro — R$ 12,90/mês' : 'Business — R$ 29,90/mês';
        return `Código de indicação reconhecido! Porém tive um problema ao aplicar o desconto. Acesse o link para assinar o plano *${nomeExibicao}*:\n\n🔗 ${link}\n\nVocê pode pagar via *Pix* ou *cartão de crédito*. Assim que o pagamento for confirmado, seu acesso será liberado. ✅`;
      }

      const link = await gerarLinkPagamento(user, plano, cupomIndicacao);
      await updateSession(user.id, 'aguardando_pagamento', { plano, referral_code: cupom });
      const nomeExibicao = plano === 'pro' ? 'Pro' : 'Business';
      return `🎉 Código de indicação *${cupom}* aplicado!\n\nVocê ganhou *${referral.discount_pct}% de desconto* na assinatura!\n\nAcesse o link abaixo para assinar o plano *${nomeExibicao}*:\n\n🔗 ${link}\n\nVocê pode pagar via *Pix* ou *cartão de crédito*. Assim que o pagamento for confirmado, seu acesso será liberado automaticamente. ✅`;
    }

    // Tenta como cupom normal da AbacatePay
    const cupomValido = await validarCupom(cupom);

    if (!cupomValido) {
      await updateSession(user.id, 'aguardando_cupom', { plano });
      return `O código *${cupom}* não foi encontrado ou já expirou. 😕\n\nDeseja tentar outro código? Responda *SIM* ou *NÃO* para continuar sem desconto.`;
    }

    const link = await gerarLinkPagamento(user, plano, cupom);

    if (!link) {
      await updateSession(user.id, 'concluido', {});
      return `Ops! Tive um problema ao gerar seu link de pagamento. Por favor, tente novamente em instantes. 🙏`;
    }

    await updateSession(user.id, 'aguardando_pagamento', { plano, cupom });
    const nomeExibicao = plano === 'pro' ? 'Pro' : 'Business';
    return `Cupom *${cupom}* aplicado com sucesso! 🎉\n\nAcesse o link abaixo para assinar o plano *${nomeExibicao}* com desconto:\n\n🔗 ${link}\n\nVocê pode pagar via *Pix* ou *cartão de crédito*. Assim que o pagamento for confirmado, seu acesso será liberado automaticamente. ✅`;
  }

  // ── Upgrade: aguardando pagamento ─────────────────────────────────────────────
  if (step === 'aguardando_pagamento') {
    if (normalizar(texto) === 'novo link') {
      const { plano, cupom } = context;
      const link = await gerarLinkPagamento(user, plano, cupom || null);

      if (!link) {
        return `Não foi possível gerar um novo link no momento. Por favor, tente novamente em instantes. 🙏`;
      }

      return `Aqui está o seu novo link de pagamento:\n\n🔗 ${link}`;
    }

    return `Seu link de pagamento já foi enviado! 😊\n\nVocê pode pagar via *Pix* ou *cartão de crédito*. Assim que o pagamento for confirmado, seu acesso ao plano será liberado automaticamente.\n\nCaso precise de um novo link, responda *NOVO LINK*.`;
  }

  // ── Fallback ──────────────────────────────────────────────────────────────────
  return `Não consegui entender sua mensagem. Poderia reformulá-la? 😊`;
}

// ─── Criar cupom temporário de indicação na AbacatePay ───────────────────────
async function criarCupomIndicacao(referralCode, discountPct) {
  try {
    const code = `IND-${referralCode}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
    const response = await fetch('https://api.abacatepay.com/v2/coupons/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        discountKind: 'PERCENTAGE',
        discount: discountPct,
        maxRedeems: 1,
        notes: `Indicação ${referralCode}`,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) return null;
    return data.data.id;
  } catch {
    return null;
  }
}

module.exports = processarFluxo;