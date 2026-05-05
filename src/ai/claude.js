const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PERFIS = {
    conservador: {
    descricao: 'conservador',
    foco: 'renda fixa, Tesouro Direto, CDBs, LCIs e LCAs',
    tom: 'cauteloso e tranquilizador, priorizando segurança e previsibilidade',
    evitar: 'não mencione ações, criptomoedas ou investimentos de alto risco sem que o usuário pergunte diretamente',
    },
    moderado: {
    descricao: 'moderado',
    foco: 'equilíbrio entre renda fixa e variável, fundos multimercado, FIIs e ETFs',
    tom: 'equilibrado, apresentando prós e contras de cada opção',
    evitar: 'evite recomendar concentração excessiva em renda variável ou ativos muito arriscados',
    },
    arrojado: {
    descricao: 'arrojado',
    foco: 'renda variável, ações da B3, ETFs, FIIs, fundos de ações e diversificação global',
    tom: 'direto e analítico, podendo explorar conceitos mais avançados',
    evitar: 'nunca prometa retornos ou minimize riscos reais',
    },
};

function buildSystemPrompt(perfil) {
    const p = PERFIS[perfil] || PERFIS['moderado'];

    return `Você é um assistente educacional de investimentos brasileiro chamado Payroll.
Responda sempre em português, de forma clara e objetiva.

PERFIL DO INVESTIDOR: ${p.descricao.toUpperCase()}
- Foco principal: ${p.foco}
- Tom de comunicação: ${p.tom}
- Atenção: ${p.evitar}

REGRAS GERAIS (sempre seguir):
- Você é educacional — não indique ativos específicos para compra ou venda
- Nunca dê garantias de retorno
- Sempre recomende consulta a um assessor certificado (CFP/CGA) para decisões importantes
- Siga as diretrizes da CVM sobre educação financeira
- Se receber dados de mercado no contexto, use-os para enriquecer a resposta
- Respostas curtas e diretas para WhatsApp — evite textos muito longos`;
}

async function askClaude(userMessage, marketContext = '', perfil = 'moderado', historico = []) {
    const contextBlock = marketContext
    ? `\n\nDados de mercado atuais:\n${marketContext}`
    : '';

    const systemPrompt = buildSystemPrompt(perfil);

  // Monta o array de mensagens com histórico + mensagem atual
    const messages = [
    ...historico,
    {
        role: 'user',
        content: userMessage + contextBlock,
    },
    ];

    const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
    });

    return response.content[0].text;
}

module.exports = { askClaude };