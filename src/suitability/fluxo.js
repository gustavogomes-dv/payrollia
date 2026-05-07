const PERGUNTAS = require('./perguntas');
const calcularPerfil = require('./calcularPerfil');
const { askClaude } = require('../ai/claude');
const { getMarketData } = require('../services/market');
const { updateSession, updateUser, saveInvestorProfile, getInvestorProfile, saveMessage, getRecentMessages } = require('../db/users');

const DISCLAIMER = `⚠️ *Aviso importante (CVM)*

O Payroll é um assistente *educacional* de investimentos. Não somos uma corretora, banco ou assessor de investimentos certificado.

As informações fornecidas *não constituem recomendação de investimento*. Sempre consulte um profissional certificado pela CVM antes de tomar decisões financeiras.

Para continuar, você confirma que entendeu? (responda *1 para Sim*)`;

async function processarFluxo(user, session, mensagem) {
  const texto = mensagem.trim();
  const step = session.step || 'inicio';
  const context = session.context || {};

  // Boas vindas — primeira mensagem
  if (step === 'inicio') {
    await updateSession(user.id, 'aguardando_nome', {});
    return `Olá! 👋 Bem-vindo ao *Payroll*, seu assistente educacional de investimentos!\n\nPara começar, qual é o seu nome?`;
  }

  // Coleta o nome
  if (step === 'aguardando_nome') {
    const nome = texto;
    await updateUser(user.id, { name: nome });
    await updateSession(user.id, 'aguardando_disclaimer', { nome });
    return `Prazer, *${nome}*! 😊\n\n${DISCLAIMER}`;
  }

  // Confirmação do disclaimer
  if (step === 'aguardando_disclaimer') {
    if (texto !== '1') {
      return `Para usar o Payroll você precisa confirmar que entendeu o aviso. Responda *1* para continuar.`;
    }
    await updateSession(user.id, 'suitability_0', { ...context, respostas: {} });
    return `Ótimo! Antes de começar, vou fazer *8 perguntas rápidas* para entender seu perfil de investidor.\n\nIsso leva menos de 2 minutos! 😊\n\n${PERGUNTAS[0].texto}`;
  }

  // Fluxo do questionário
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

    // Questionário finalizado — calcula o perfil
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

  // Usuário já tem perfil e manda saudação
if (step === 'concluido' && ['oi', 'olá', 'ola', 'hey', 'hi', 'bom dia', 'boa tarde', 'boa noite'].includes(texto.toLowerCase())) {
  const perfil = user.perfil || (await getInvestorProfile(user.id))?.perfil || 'moderado';
  return `Olá de novo! 👋 Seu perfil é *${perfil}*.\n\nComo posso te ajudar hoje? Pode me perguntar sobre investimentos, mercado, ou qualquer dúvida financeira! 😊`;
}

if (step === 'concluido') {
  try {
    const perfil = user.perfil || (await getInvestorProfile(user.id))?.perfil || 'moderado';
    const marketContext = await getMarketData(texto);

    // Busca histórico e salva mensagem do usuário
    const historico = await getRecentMessages(user.id, 10);
    await saveMessage(user.id, 'user', texto);

    const resposta = await askClaude(texto, marketContext, perfil, historico);

    // Salva resposta do bot
    await saveMessage(user.id, 'assistant', resposta);

    return resposta;
  } catch (error) {
    console.error('Erro ao chamar Claude:', error);
    return `Desculpe, tive um problema ao processar sua pergunta. Tente novamente em instantes. 🙏`;
  }
}

  // Fallback — não deveria chegar aqui
  return `Não entendi. Pode reformular sua pergunta? 😊`;
}

module.exports = processarFluxo;