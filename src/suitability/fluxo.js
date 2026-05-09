const PERGUNTAS = require('./perguntas');
const calcularPerfil = require('./calcularPerfil');
const { askClaude } = require('../ai/claude');
const { getMarketData } = require('../services/market');
const {
  updateSession,
  updateUser,
  saveInvestorProfile,
  getInvestorProfile,
  saveMessage,
  getRecentMessages,
} = require('../db/users');

// ─── Constantes ────────────────────────────────────────────────────────────────
const LIMITE_FREE = 3;

const PRODUTO_IDS = {
  pro: 'prod_gPsYzrzDUgnJLcJCsZWSMc0a',
  business: 'prod_b0gGP0CH4t6nyQETnyPAQDaz',
};

const DISCLAIMER = `⚠️ *Aviso importante (CVM)*

O Payroll é um assistente *educacional* de investimentos. Não somos uma corretora, banco ou assessor de investimentos certificado.

As informações fornecidas *não constituem recomendação de investimento*. Sempre consulte um profissional certificado pela CVM antes de tomar decisões financeiras.

Para continuar, você confirma que entendeu? (responda *1 para Sim*)`;

// ─── Gerar link de pagamento via AbacatePay ────────────────────────────────────
async function gerarLinkPagamento(user, plano, cupom = null) {
  try {
    // sem SDK — fetch direto na API v2

    const PLANOS_CONFIG = {
      pro:      { externalId: 'prod_gPsYzrzDUgnJLcJCsZWSMc0a', name: 'Plano Pro',      price: 1290 },
      business: { externalId: 'prod_b0gGP0CH4t6nyQETnyPAQDaz', name: 'Plano Business', price: 2990 },
    };

    const config = PLANOS_CONFIG[plano];
    if (!config) throw new Error(`Plano inválido: ${plano}`);

    const body = {
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [{
        externalId: config.externalId,
        name: config.name,
        quantity: 1,
        price: config.price,
      }],
      returnUrl: 'https://payrollia.com.br',
      completionUrl: 'https://payrollia.com.br',
      customer: {
        name: user.name || 'Cliente',
        email: user.email || `${user.phone}@payrollia.com.br`,
        cellphone: user.phone,
        taxId: '',
      },
    };

    if (cupom) body.coupon = cupom;

    const billing = await abacate.billing.create(body);
    return billing?.url || billing?.data?.url || null;
  } catch (err) {
    console.error('[AbacatePay] Exceção ao gerar link:', err.message);
    return null;
  }
}
// ─── Validar cupom na AbacatePay ───────────────────────────────────────────────
async function validarCupom(cupom) {
  try {
    const response = await fetch(`https://api.abacatepay.com/v1/coupon/${cupom}`, {
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
function atingiuLimite(user) {
  if ((user.plano || 'free') !== 'free') return false;
  return (user.perguntas_usadas || 0) >= LIMITE_FREE;
}

// ─── Incrementar contador de perguntas usadas ─────────────────────────────────
async function incrementarPerguntas(userId) {
  const { pool, redisClient } = require('../db/index');

  const { rows } = await pool.query(
    `UPDATE users SET perguntas_usadas = COALESCE(perguntas_usadas, 0) + 1
    WHERE id = $1 RETURNING tenant_id, phone`,
    [userId]
  );

  // Invalida o cache do Redis para a próxima mensagem buscar do banco
  if (rows[0]) {
    const { tenant_id, phone } = rows[0];
    await redisClient.del(`user:${tenant_id}:${phone}`);
  }
}

// ─── Mensagem de limite atingido ───────────────────────────────────────────────
function mensagemLimite(userName) {
  const nome = userName ? `, ${userName}` : '';
  return `Você atingiu o limite de *${LIMITE_FREE} perguntas* do plano gratuito${nome}. 😕

Para continuar aprendendo sobre investimentos sem limites, escolha um plano:

*1 - Plano Pro* — R$12,90/mês
✅ Perguntas ilimitadas
✅ Análise completa do seu perfil

*2 - Plano Business* — R$29,90/mês
✅ Tudo do Pro
✅ Alertas de mercado
✅ Suporte prioritário

Responda *1* ou *2* para continuar.`;
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

  // ── Boas vindas ──────────────────────────────────────────────────────────────
  if (step === 'inicio') {
    await updateSession(user.id, 'aguardando_nome', {});
    return `Olá! 👋 Bem-vindo ao *Payroll*, seu assistente educacional de investimentos!\n\nPara começar, qual é o seu nome?`;
  }

  // ── Coleta o nome ────────────────────────────────────────────────────────────
  if (step === 'aguardando_nome') {
    await updateUser(user.id, { name: texto });
    await updateSession(user.id, 'aguardando_disclaimer', { nome: texto });
    return `Prazer, *${texto}*! 😊\n\n${DISCLAIMER}`;
  }
async function gerarLinkPagamento(user, plano, cupom = null) {
  try {
    const PLANOS_CONFIG = {
      pro:      { externalId: 'prod_gPsYzrzDUgnJLcJCsZWSMc0a', name: 'Plano Pro',      price: 1290 },
      business: { externalId: 'prod_b0gGP0CH4t6nyQETnyPAQDaz', name: 'Plano Business', price: 2990 },
    };

    const config = PLANOS_CONFIG[plano];
    if (!config) throw new Error(`Plano inválido: ${plano}`);

    const body = {
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [{
        externalId: config.externalId,
        name: config.name,
        quantity: 1,
        price: config.price,
      }],
      returnUrl: 'https://payrollia.com.br',
      completionUrl: 'https://payrollia.com.br',
      customer: {
        name: user.name || 'Cliente',
        email: user.email || `${user.phone}@payrollia.com.br`,
        cellphone: user.phone,
        taxId: '',
      },
    };

    if (cupom) body.coupon = cupom;

    console.log('[AbacatePay] Enviando:', JSON.stringify(body));

    const response = await fetch('https://api.abacatepay.com/v2/billings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[AbacatePay] Resposta:', JSON.stringify(data));

    if (!response.ok) {
      console.error('[AbacatePay] Erro ao gerar link:', data);
      return null;
    }

    return data?.url || data?.data?.url || null;
  } catch (err) {
    console.error('[AbacatePay] Exceção ao gerar link:', err.message);
    return null;
  }
}
  // ── Confirmação do disclaimer ────────────────────────────────────────────────
  if (step === 'aguardando_disclaimer') {
    if (texto !== '1') {
      return `Para usar o Payroll você precisa confirmar que entendeu o aviso. Responda *1* para continuar.`;
    }
    await updateSession(user.id, 'suitability_0', { ...context, respostas: {} });
    return `Ótimo! Antes de começar, vou fazer *8 perguntas rápidas* para entender seu perfil de investidor.\n\nIsso leva menos de 2 minutos! 😊\n\n${PERGUNTAS[0].texto}`;
  }

  // ── Questionário suitability ─────────────────────────────────────────────────
  if (step.startsWith('suitability_')) {
    const index = parseInt(step.split('_')[1]);
    const perguntaAtual = PERGUNTAS[index];

    if (!perguntaAtual.opcoes[texto]) {
      const maxOpcao = Object.keys(perguntaAtual.opcoes).length;
      return `Resposta inválida. Por favor, responda com um número entre 1 e ${maxOpcao}.`;
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

    // Questionário finalizado — calcula e salva perfil
    const resultado = calcularPerfil(novosPontos);
    await saveInvestorProfile(user.id, respostas, resultado.perfil, novosPontos);
    await updateUser(user.id, { onboarding_complete: true });
    await updateSession(user.id, 'concluido', {});

    return `✅ *Questionário concluído!*

${resultado.descricao}

${resultado.explicacao}

${resultado.aviso}

---
Agora você pode me perguntar sobre investimentos! Estou aqui para te *educar e orientar* com base no seu perfil.

💬 Experimente perguntar:
- "O que é Tesouro Direto?"
- "Como funciona um FII?"
- "Qual a diferença entre CDB e LCI?"`;
  }

  // ── Chat principal ────────────────────────────────────────────────────────────
  if (step === 'concluido') {

    // Saudação simples — não consome pergunta
    const saudacoes = ['oi', 'ola', 'hey', 'hi', 'bom dia', 'boa tarde', 'boa noite'];
    if (saudacoes.includes(normalizar(texto))) {
      const perfil = user.perfil || (await getInvestorProfile(user.id))?.perfil || 'moderado';
      return `Olá de novo! 👋 Seu perfil é *${perfil}*.\n\nComo posso te ajudar hoje? Pode me perguntar sobre investimentos, mercado, ou qualquer dúvida financeira! 😊`;
    }

    // Usuário atingiu o limite do plano Free
    if (atingiuLimite(user)) {
      await updateSession(user.id, 'aguardando_escolha_plano', {});
      return mensagemLimite(user.name);
    }

    // Responder com IA
    try {
      const perfil = user.perfil || (await getInvestorProfile(user.id))?.perfil || 'moderado';
      const marketContext = await getMarketData(texto);
      const historico = await getRecentMessages(user.id, 10);

      await saveMessage(user.id, 'user', texto);
      const resposta = await askClaude(texto, marketContext, perfil, historico);
      await saveMessage(user.id, 'assistant', resposta);

      // Incrementa contador apenas no plano Free
      if ((user.plano || 'free') === 'free') {
        await incrementarPerguntas(user.id);
      }

      return resposta;
    } catch (error) {
      console.error('[Fluxo] Erro ao chamar Claude:', error);
      return `Desculpe, tive um problema ao processar sua pergunta. Tente novamente em instantes. 🙏`;
    }
  }

  // ── Upgrade: escolha do plano ─────────────────────────────────────────────────
  if (step === 'aguardando_escolha_plano') {
    if (texto !== '1' && texto !== '2') {
      return `Por favor, responda *1* para o plano Pro ou *2* para o plano Business.`;
    }
    const plano = texto === '1' ? 'pro' : 'business';
    await updateSession(user.id, 'aguardando_cupom', { plano });
    return `Ótima escolha! 🎉\n\nVocê possui um *cupom de desconto*?\n\nResponda *SIM* ou *NÃO*.`;
  }

  // ── Upgrade: tem cupom? ───────────────────────────────────────────────────────
  if (step === 'aguardando_cupom') {
    const { plano } = context;
    const resposta = normalizar(texto);

    if (resposta === 'sim' || resposta === 's') {
      await updateSession(user.id, 'aguardando_codigo_cupom', { plano });
      return `Ótimo! Digite o seu código de cupom:`;
    }

    if (resposta === 'nao' || resposta === 'n' || resposta === 'no') {
      const link = await gerarLinkPagamento(user, plano);

      if (!link) {
        await updateSession(user.id, 'concluido', {});
        return `Ops! Tive um problema ao gerar seu link de pagamento. Tente novamente em instantes ou entre em contato com o suporte. 🙏`;
      }

      await updateSession(user.id, 'aguardando_pagamento', { plano });
      const nomeExibicao = plano === 'pro' ? 'Pro — R$12,90/mês' : 'Business — R$29,90/mês';
      return `Perfeito! Acesse o link abaixo para assinar o plano *${nomeExibicao}*:\n\n🔗 ${link}\n\nAssim que o pagamento for confirmado, seu acesso será liberado automaticamente! ✅`;
    }

    return `Por favor, responda *SIM* ou *NÃO*.`;
  }

  // ── Upgrade: validar código do cupom ─────────────────────────────────────────
  if (step === 'aguardando_codigo_cupom') {
    const { plano } = context;
    const cupom = texto.toUpperCase().trim();

    const cupomValido = await validarCupom(cupom);

    if (!cupomValido) {
      await updateSession(user.id, 'aguardando_cupom', { plano });
      return `Cupom *${cupom}* não encontrado ou expirado. 😕\n\nDeseja tentar outro cupom? Responda *SIM* ou *NÃO* para continuar sem desconto.`;
    }

    const link = await gerarLinkPagamento(user, plano, cupom);

    if (!link) {
      await updateSession(user.id, 'concluido', {});
      return `Ops! Tive um problema ao gerar seu link de pagamento. Tente novamente em instantes. 🙏`;
    }

    await updateSession(user.id, 'aguardando_pagamento', { plano, cupom });
    const nomeExibicao = plano === 'pro' ? 'Pro' : 'Business';
    return `Cupom *${cupom}* aplicado com sucesso! 🎉\n\nAcesse o link abaixo para assinar o plano *${nomeExibicao}* com desconto:\n\n🔗 ${link}\n\nAssim que o pagamento for confirmado, seu acesso será liberado automaticamente! ✅`;
  }

  // ── Upgrade: aguardando pagamento ─────────────────────────────────────────────
  if (step === 'aguardando_pagamento') {
    if (normalizar(texto) === 'novo link') {
      const { plano, cupom } = context;
      const link = await gerarLinkPagamento(user, plano, cupom || null);

      if (!link) {
        return `Não consegui gerar um novo link agora. Tente novamente em instantes. 🙏`;
      }

      return `Aqui está seu novo link:\n\n🔗 ${link}`;
    }

    return `Seu link de pagamento já foi enviado! 😊\n\nAssim que o Pix for confirmado, seu acesso será liberado automaticamente.\n\nPrecisa de um novo link? Responda *NOVO LINK*.`;
  }

  // ── Fallback ──────────────────────────────────────────────────────────────────
  return `Não entendi. Pode reformular sua pergunta? 😊`;
}

module.exports = processarFluxo;