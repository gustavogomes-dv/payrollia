const axios = require('axios');

const BRAPI_TOKEN = process.env.BRAPI_TOKEN;
const BRAPI_BASE = 'https://brapi.dev/api';
const BCB_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';

// Quantos ativos no máximo o bot resolve numa única mensagem (anti-spam).
const MAX_TICKERS = 3;

// ─── Dicionário nome da empresa → ticker (FAST PATH / rede de segurança) ──────
// Serve pra dois fins: (1) atalho de performance (evita roundtrip de API) e
// (2) rede de segurança pros nomes que a busca dinâmica resolve mal — ex.:
// "porto seguro", que casa errado com QUALICORP (...DE SEGUROS S.A.) na Brapi.
// A cobertura "qualquer ativo" continua vindo da busca dinâmica (buscarTickerPorNome).
// Chaves sem acento e em minúsculo (a busca normaliza o texto do usuário).
const NOME_PARA_TICKER = {
  // Bancos
  'banco do brasil': 'BBAS3', 'bb': 'BBAS3',
  'itau': 'ITUB4', 'itau unibanco': 'ITUB4', 'itausa': 'ITSA4',
  'bradesco': 'BBDC4', 'santander': 'SANB11', 'nubank': 'ROXO34', 'nu': 'ROXO34',
  'banco inter': 'INBR32', 'inter': 'INBR32', 'btg': 'BPAC11', 'btg pactual': 'BPAC11',
  // Petróleo / energia
  'petrobras': 'PETR4', 'petrobras on': 'PETR3', 'petro': 'PETR4',
  'vale': 'VALE3', 'eletrobras': 'ELET3', 'petrorio': 'PRIO3', 'prio': 'PRIO3',
  'ultrapar': 'UGPA3', 'cosan': 'CSAN3', 'raizen': 'RAIZ4',
  // Varejo / consumo
  'magazine luiza': 'MGLU3', 'magalu': 'MGLU3', 'americanas': 'AMER3',
  'via varejo': 'VIIA3', 'via': 'VIIA3', 'lojas renner': 'LREN3', 'renner': 'LREN3',
  'ambev': 'ABEV3', 'natura': 'NTCO3', 'assai': 'ASAI3', 'carrefour': 'CRFB3',
  'mercado livre': 'MELI34', 'mercadolivre': 'MELI34',
  // Indústria / outros
  'weg': 'WEGE3', 'embraer': 'EMBR3', 'suzano': 'SUZB3', 'klabin': 'KLBN11',
  'gerdau': 'GGBR4', 'csn': 'CSNA3', 'jbs': 'JBSS3', 'marfrig': 'MRFG3',
  'b3': 'B3SA3', 'bovespa': 'B3SA3', 'localiza': 'RENT3', 'rumo': 'RAIL3',
  // Telecom / tech
  'vivo': 'VIVT3', 'telefonica': 'VIVT3', 'tim': 'TIMS3', 'totvs': 'TOTS3',
  // Energia elétrica
  'engie': 'EGIE3', 'cemig': 'CMIG4', 'copel': 'CPLE6', 'taesa': 'TAEE11', 'sabesp': 'SBSP3',
  // Seguros (nomes ambíguos que a busca dinâmica erra — rede de segurança)
  'porto seguro': 'PSSA3', 'porto': 'PSSA3', 'pssa': 'PSSA3',
  'bb seguridade': 'BBSE3', 'bbseguridade': 'BBSE3',
  'caixa seguridade': 'CXSE3',
  // FIIs populares
  'maxi renda': 'MXRF11', 'maxirenda': 'MXRF11', 'kinea': 'KNRI11',
  'hglg': 'HGLG11', 'xp log': 'XPLG11', 'visc': 'VISC11', 'mall': 'MALL11',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normaliza(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // remove acentos
}

// Palavras que não ajudam a identificar a empresa (verbos, artigos, ruído).
const STOPWORDS = new Set([
  'cotacao', 'cotacoes', 'preco', 'precos', 'valor', 'valores', 'quanto',
  'esta', 'custa', 'quero', 'saber', 'sobre', 'da', 'do', 'de', 'das', 'dos',
  'a', 'o', 'as', 'os', 'e', 'em', 'no', 'na', 'um', 'uma', 'qual', 'quais',
  'me', 'fala', 'diz', 'acao', 'acoes', 'papel', 'papeis', 'ativo', 'ativos',
  'hoje', 'agora', 'ver', 'mostra', 'mostrar', 'informacoes', 'informacao',
  'dados', 'mercado', 'bolsa', 'ta', 'tah', 'pra', 'para', 'com', 'qto',
  'fii', 'fundo', 'imobiliario', 'rende', 'rendimento', 'dividendos',
  'cotar', 'consultar', 'consulta', 'tem', 'tah', 'la', 'comprar', 'vender',
  'tambem', 'tb', 'tbm', 'mais',
]);

// ─── Detectores de intenção ───────────────────────────────────────────────────

// Extrai TODOS os tickers (códigos diretos) da mensagem — até MAX_TICKERS,
// deduplicados e na ordem em que aparecem. Ex.: "cpts11 e vgir11" → [CPTS11, VGIR11].
function extractTickersDiretos(text) {
  const matches = text.toUpperCase().match(/\b[A-Z]{4}\d{1,2}\b/g) || [];
  const vistos = new Set();
  const out = [];
  for (const m of matches) {
    if (!vistos.has(m)) {
      vistos.add(m);
      out.push(m);
    }
    if (out.length >= MAX_TICKERS) break;
  }
  return out;
}

// Procura nomes do dicionário na mensagem (FAST PATH). Retorna todos os tickers
// encontrados (dedup), até MAX_TICKERS.
function extractTickersDicionario(text) {
  const normalizado = normaliza(text);
  // Ordena as chaves da mais longa pra mais curta — evita "bb" casar antes de "banco do brasil"
  const nomes = Object.keys(NOME_PARA_TICKER).sort((a, b) => b.length - a.length);
  const vistos = new Set();
  const out = [];
  for (const nome of nomes) {
    const re = new RegExp(`\\b${nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (re.test(normalizado)) {
      const tk = NOME_PARA_TICKER[nome];
      if (!vistos.has(tk)) {
        vistos.add(tk);
        out.push(tk);
      }
      if (out.length >= MAX_TICKERS) break;
    }
  }
  return out;
}

// Só vale a pena disparar a busca dinâmica quando a mensagem PARECE pedir um ativo.
// Evita bater na Brapi (e gerar falso-positivo) em qualquer frase aleatória.
function pedeCotacao(text) {
  return /cota[cç][aã]o|pre[cç]o|quanto (custa|vale|est[aá]|t[aá])|a[cç][aã]o d[oae]|papel d[oae]|ticker|fundo imobili|dividend|rende|rendimento|vale a pena|invest|comprar|vender|a[cç][õo]es d[oae]/i.test(text);
}

// Cache em memória das resoluções nome→ticker (sobrevive entre requisições no mesmo processo).
const tickerCache = new Map();

// ── Score de relevância: quão bem o NOME do ativo corresponde ao que o usuário digitou ──
// Em vez do antigo includes() cego (que fazia "seguro" casar com QUALICORP...DE SEGUROS),
// pontua a sobreposição de palavras entre o termo buscado e o nome do ativo.
// Quanto MAIOR o score, melhor o match. Score baixo/zero = descarta.
function scoreMatch(termoNorm, nomeAtivo) {
  const nome = normaliza(nomeAtivo || '');
  if (!nome) return 0;

  const tokensTermo = termoNorm.split(/\s+/).filter(Boolean);
  const tokensNome = nome.split(/\s+/).filter(Boolean);
  if (!tokensTermo.length || !tokensNome.length) return 0;

  let score = 0;

  // (1) Cobertura: quantas palavras do termo aparecem no nome do ativo.
  //     "porto seguro" → PSSA3 (PORTO SEGURO) cobre 2; QUAL3 (...SEGUROS) cobre 1.
  let cobertas = 0;
  for (const t of tokensTermo) {
    if (tokensNome.some(n => n === t || n.startsWith(t) || t.startsWith(n))) cobertas++;
  }
  if (cobertas === 0) return 0; // nenhuma palavra bateu → não é match
  score += cobertas * 10;

  // (2) Proporção: prefere nomes que NÃO sejam dominados por palavras irrelevantes.
  //     Cobrir 2 de 2 palavras do nome é melhor que 2 de 8.
  score += (cobertas / tokensNome.length) * 5;

  // (3) Bônus forte se o nome COMEÇA com a primeira palavra do termo.
  //     "PORTO SEGURO S.A." começa com "porto" → bônus; "QUALICORP..." não.
  if (tokensNome[0] && (tokensNome[0] === tokensTermo[0] || tokensNome[0].startsWith(tokensTermo[0]))) {
    score += 8;
  }

  // (4) Bônus se o nome inteiro começa com o termo completo (match quase exato).
  if (nome.startsWith(termoNorm)) score += 6;

  return score;
}

// Busca dinâmica na Brapi: resolve QUALQUER ativo listado na B3, não só os do dicionário.
// Estratégia: coleta candidatos de várias tentativas (frase inteira + tokens), junta tudo
// num pool deduplicado e escolhe o de MAIOR score de relevância de nome. Só cai no
// "mais negociado" (volume) se NENHUM candidato tiver match de nome decente.
async function buscarTickerPorNome(text) {
  const limpo = normaliza(text);

  if (tickerCache.has(limpo)) {
    const cached = tickerCache.get(limpo);
    console.log(`[Market] cache hit: "${limpo}" → ${cached}`);
    return cached;
  }

  // Extrai tokens significativos (sem stopwords, com 3+ letras)
  const tokens = limpo
    .split(/[^a-z0-9]+/)
    .filter(t => t && t.length >= 3 && !STOPWORDS.has(t));

  if (!tokens.length) {
    console.log('[Market] busca dinâmica: nenhum token útil na mensagem');
    return null;
  }

  // O termo "principal" pra pontuar é a frase de tokens significativos (ex.: "porto seguro").
  const termoPrincipal = tokens.join(' ');

  // Tentativas de SEARCH na Brapi: frase inteira primeiro, depois cada token (maior → menor).
  // Cada uma pode trazer candidatos diferentes — juntamos todos num pool.
  const tentativas = [termoPrincipal, ...[...tokens].sort((a, b) => b.length - a.length)];

  const pool = new Map(); // stock(ticker) → { ticker, name }

  for (const termo of tentativas) {
    try {
      const { data } = await axios.get(`${BRAPI_BASE}/quote/list`, {
        params: {
          search: termo,
          token: BRAPI_TOKEN,
          limit: 15,
          sortBy: 'volume',
          sortOrder: 'desc',
        },
      });

      const lista = data.stocks || [];
      for (const s of lista) {
        if (s.stock && !pool.has(s.stock)) {
          pool.set(s.stock, { ticker: s.stock, name: s.name || '' });
        }
      }
    } catch (err) {
      console.error(`[Market] erro na busca dinâmica de "${termo}":`, err.message);
    }
  }

  if (!pool.size) {
    console.log(`[Market] busca dinâmica: nada encontrado para "${limpo}"`);
    tickerCache.set(limpo, null);
    return null;
  }

  // Escolhe o candidato de MAIOR score de relevância de nome.
  let melhor = null;
  let melhorScore = -1;
  for (const cand of pool.values()) {
    const sc = scoreMatch(termoPrincipal, cand.name);
    if (sc > melhorScore) {
      melhorScore = sc;
      melhor = cand;
    }
  }

  // Se ninguém teve match de nome decente (score 0), o "search" provavelmente
  // bateu por ticker/setor e não por nome — aí confiamos no 1º (maior volume).
  if (!melhor || melhorScore <= 0) {
    const fallback = pool.values().next().value;
    console.log(`[Market] busca dinâmica (fallback volume): "${termoPrincipal}" → ${fallback.ticker} (${fallback.name || 's/ nome'})`);
    tickerCache.set(limpo, fallback.ticker);
    return fallback.ticker;
  }

  console.log(`[Market] busca dinâmica: "${termoPrincipal}" → ${melhor.ticker} (${melhor.name}) [score ${melhorScore.toFixed(1)}]`);
  tickerCache.set(limpo, melhor.ticker);
  return melhor.ticker;
}

// Resolve a lista final de tickers a buscar (até MAX_TICKERS):
//   1) códigos diretos (regex)  2) nomes do dicionário  3) busca dinâmica (1 nome)
// Mantém ordem e remove duplicados.
async function resolverTickers(text) {
  const resultado = [];
  const vistos = new Set();

  const push = (tk) => {
    if (tk && !vistos.has(tk) && resultado.length < MAX_TICKERS) {
      vistos.add(tk);
      resultado.push(tk);
    }
  };

  // 1) códigos diretos na mensagem (ex.: CPTS11, VGIR11)
  extractTickersDiretos(text).forEach(push);

  // 2) nomes conhecidos no dicionário (fast path / rede de segurança)
  if (resultado.length < MAX_TICKERS) {
    extractTickersDicionario(text).forEach(push);
  }

  // 3) busca dinâmica por nome — só se ainda não achou nada e a msg pede cotação
  if (resultado.length === 0 && pedeCotacao(text)) {
    const dyn = await buscarTickerPorNome(text);
    push(dyn);
  }

  return resultado;
}

function isFII(ticker) {
  return ticker ? ticker.endsWith('11') : false;
}

function mentionaDolar(text) {
  return /d[oó]lar|usd|câmbio|cambio|moeda estrangeira/i.test(text);
}

function mencionaInflacao(text) {
  return /ipca|infla[cç][aã]o|preços|precos|custo de vida/i.test(text);
}

function mencionaSelic(text) {
  return /selic|juros|taxa b[aá]sica|cdi|renda fixa/i.test(text);
}

// Menção direta ao índice da bolsa (Ibovespa)
function mencionaBolsa(text) {
  return /ibovespa|\bibov\b|bovespa|[ií]ndice da bolsa|[ií]ndice bovespa/i.test(text);
}

// Pedido de notícias / novidades de mercado.
function mencionaNoticias(text) {
  return /not[ií]cia|manchete|novidade|o que (t[aá]|est[aá]|anda) (rolando|acontecendo)|fato relevante|aconteceu (no |de )?(mercado|economia|hoje)|jornal|infomoney/i.test(text);
}

// Pergunta AMPLA sobre o cenário (mercado/economia em geral) → dispara o panorama macro.
function pedePanorama(text) {
  return new RegExp(
    [
      'panorama',
      'conjuntura',
      'cen[aá]rio (econ[oô]mic|atual|do mercado|da economia|da bolsa|macro)',
      'vis[aã]o (geral|macro|do mercado|da economia)',
      'macroeconom',
      'resumo (do |da )?(mercado|economia|bolsa)',
      'overview do mercado',
      'situa[cç][aã]o (econ[oô]mica|do mercado|da economia|atual)',
      'como (est[aá]|anda|t[aá]|vai|estao|est[aã]o|andam) (o |a |os |as )?(mercado|economia|bolsa|ibovespa|cen[aá]rio|brasil|juros|indicadores|mercados)',
      'como (vai|est[aá]|anda) (a economia|o mercado|a bolsa|o brasil)',
      'o que (esta|está) acontecendo (no |com o )?(mercado|economia)',
      'como (anda|esta|está) (tudo )?(na |a )?economia',
    ].join('|'),
    'i'
  ).test(text);
}

// ─── Brapi: Cotação ───────────────────────────────────────────────────────────

// Busca a cotação básica na Brapi (preço, variação, volume, máx/mín).
// Desde jun/2026 o módulo fundamental=true do /quote só devolve priceEarnings e
// earningsPerShare no free tier. Os demais indicadores migraram para o endpoint
// /v2/stocks/statistics (ver fetchBrapiStatistics abaixo).
async function fetchBrapiQuote(ticker) {
  const comFundamental = `${BRAPI_BASE}/quote/${ticker}?token=${BRAPI_TOKEN}&fundamental=true`;
  try {
    const { data } = await axios.get(comFundamental);
    return data.results?.[0] || null;
  } catch (err) {
    if (err.response?.status === 403) {
      console.warn(`[Market] 403 com fundamental em ${ticker} → tentando cotação básica`);
      try {
        const { data } = await axios.get(`${BRAPI_BASE}/quote/${ticker}?token=${BRAPI_TOKEN}`);
        return data.results?.[0] || null;
      } catch (e2) {
        console.error(`[Market] erro na cotação básica de ${ticker}:`, e2.message);
        return null;
      }
    }
    console.error(`[Market] Erro ao buscar ${ticker}:`, err.message);
    return null;
  }
}

// Busca os indicadores fundamentalistas no endpoint /v2/stocks/statistics.
// IMPORTANTE: o free tier permite só 1 ativo por requisição (QUOTES_PER_REQUEST_EXCEEDED
// se enviar mais). Os nomes dos campos seguem o padrão Yahoo Finance (em inglês):
//   trailingPE → P/L | priceToBook → P/VP | dividendYield → DY (fração: 0.06 = 6%)
//   enterpriseToEbitda → EV/EBITDA | earningsPerShare → LPA | bookValue → VPA
//   beta → volatilidade vs. mercado | profitMargins → margem líquida (fração)
// Alguns tickers retornam campos undefined (cobertura incompleta) — tratado com if().
// Retorna o objeto `data` (indicadores) ou null se falhar/não houver acesso.
async function fetchBrapiStatistics(ticker) {
  const url = `${BRAPI_BASE}/v2/stocks/statistics?symbols=${ticker}&token=${BRAPI_TOKEN}`;
  try {
    const { data } = await axios.get(url);
    return data.results?.[0]?.data || null;
  } catch (err) {
    // 400/401/403 aqui não é crítico — só significa que não teremos os indicadores extras.
    // A cotação básica continua funcionando normalmente.
    const status = err.response?.status;
    console.warn(`[Market] statistics indisponível para ${ticker} (HTTP ${status || '?'}) — segue sem indicadores extras`);
    return null;
  }
}

async function getCotacao(ticker) {
  // Busca cotação e indicadores EM PARALELO (cada um é 1 requisição independente).
  const [stock, stats] = await Promise.all([
    fetchBrapiQuote(ticker),
    fetchBrapiStatistics(ticker),
  ]);

  if (!stock) {
    console.warn(`[Market] sem dados para ${ticker}`);
    return null;
  }

  const linhas = [
    `📊 *${stock.symbol} — ${stock.longName || stock.shortName || ''}*`,
    `Preço atual: R$ ${stock.regularMarketPrice?.toFixed(2)}`,
    `Variação hoje: ${stock.regularMarketChangePercent?.toFixed(2)}%`,
    `Abertura: R$ ${stock.regularMarketOpen?.toFixed(2)}`,
    `Máxima do dia: R$ ${stock.regularMarketDayHigh?.toFixed(2)}`,
    `Mínima do dia: R$ ${stock.regularMarketDayLow?.toFixed(2)}`,
    `Volume: ${stock.regularMarketVolume?.toLocaleString('pt-BR')}`,
  ];

  // ── Indicadores fundamentalistas ──────────────────────────────────────────
  // Preferimos os valores do endpoint statistics (mais completo); caímos no que
  // veio do /quote (priceEarnings, earningsPerShare) quando o statistics não trouxe.
  // Tudo exibido apenas se existir — campos undefined simplesmente não aparecem.
  const s = stats || {};

  const pl = s.trailingPE ?? stock.priceEarnings;
  if (pl != null) linhas.push(`P/L: ${pl.toFixed(2)}`);

  const lpa = s.earningsPerShare ?? stock.earningsPerShare;
  if (lpa != null) linhas.push(`LPA: R$ ${lpa.toFixed(2)}`);

  if (s.priceToBook != null) linhas.push(`P/VP: ${s.priceToBook.toFixed(2)}`);
  if (s.bookValue != null) linhas.push(`VPA: R$ ${s.bookValue.toFixed(2)}`);

  // dividendYield vem como fração (0.06 = 6%) → ×100
  if (s.dividendYield != null) linhas.push(`Dividend Yield: ${(s.dividendYield * 100).toFixed(2)}%`);

  if (s.enterpriseToEbitda != null) linhas.push(`EV/EBITDA: ${s.enterpriseToEbitda.toFixed(2)}`);

  // profitMargins vem como fração (0.216 = 21,6%) → ×100
  if (s.profitMargins != null) linhas.push(`Margem líquida: ${(s.profitMargins * 100).toFixed(2)}%`);

  if (s.beta != null) linhas.push(`Beta: ${s.beta.toFixed(2)}`);

  if (stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh) {
    linhas.push(`Mínima 52 sem: R$ ${stock.fiftyTwoWeekLow?.toFixed(2)}`);
    linhas.push(`Máxima 52 sem: R$ ${stock.fiftyTwoWeekHigh?.toFixed(2)}`);
  }

  return linhas.join('\n');
}

// ─── Brapi: Dados de FII ──────────────────────────────────────────────────────

async function getFIIData(ticker) {
  // FII também busca indicadores em paralelo — DY e P/VP são as métricas-chave.
  const [stock, stats] = await Promise.all([
    fetchBrapiQuote(ticker),
    fetchBrapiStatistics(ticker),
  ]);

  if (!stock) {
    console.warn(`[Market] sem dados para FII ${ticker}`);
    return null;
  }

  const linhas = [
    `🏢 *${stock.symbol} — ${stock.longName || stock.shortName || 'FII'}*`,
    `Preço atual: R$ ${stock.regularMarketPrice?.toFixed(2)}`,
    `Variação hoje: ${stock.regularMarketChangePercent?.toFixed(2)}%`,
    `Volume: ${stock.regularMarketVolume?.toLocaleString('pt-BR')}`,
  ];

  const s = stats || {};

  // dividendYield vem como fração (0.06 = 6%) → ×100. É a métrica-chave do FII.
  if (s.dividendYield != null) linhas.push(`Dividend Yield: ${(s.dividendYield * 100).toFixed(2)}%`);
  if (s.priceToBook != null) linhas.push(`P/VP: ${s.priceToBook.toFixed(2)}`);

  if (stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh) {
    linhas.push(`Mínima 52 sem: R$ ${stock.fiftyTwoWeekLow?.toFixed(2)}`);
    linhas.push(`Máxima 52 sem: R$ ${stock.fiftyTwoWeekHigh?.toFixed(2)}`);
  }

  return linhas.join('\n');
}

// ─── Brapi: Câmbio (dólar, euro) ─────────────────────────────────────────────

async function getCambio() {
  try {
    const { data } = await axios.get(
      `${BRAPI_BASE}/v2/currency?currency=USD-BRL,EUR-BRL&token=${BRAPI_TOKEN}`
    );

    const moedas = data.currency;
    if (!moedas?.length) return null;

    const linhas = [`💵 *Câmbio atual:*`];
    moedas.forEach(m => {
      linhas.push(`${m.fromCurrency}/${m.toCurrency}: R$ ${m.bidPrice?.toFixed(4)} (${m.pctChange?.toFixed(2)}%)`);
    });

    return linhas.join('\n');
  } catch (err) {
    console.error('[Market] Erro ao buscar câmbio:', err.message);
    return null;
  }
}

// ─── BCB: Taxa Selic ──────────────────────────────────────────────────────────

async function getSelic() {
  try {
    // Série 432 = Taxa Selic
    const { data } = await axios.get(
      `${BCB_BASE}.432/dados/ultimos/1?formato=json`
    );
    const valor = data?.[0]?.valor;
    if (!valor) return null;
    return `🏦 *Taxa Selic:* ${valor}% a.a.`;
  } catch (err) {
    console.error('[Market] Erro ao buscar Selic:', err.message);
    return null;
  }
}

// ─── BCB: CDI ─────────────────────────────────────────────────────────────────

async function getCDI() {
  try {
    // Série 12 = CDI
    const { data } = await axios.get(
      `${BCB_BASE}.12/dados/ultimos/1?formato=json`
    );
    const valor = data?.[0]?.valor;
    if (!valor) return null;
    return `💰 *CDI:* ${valor}% a.a.`;
  } catch (err) {
    console.error('[Market] Erro ao buscar CDI:', err.message);
    return null;
  }
}

// ─── BCB: IPCA ────────────────────────────────────────────────────────────────

async function getIPCA() {
  try {
    // Série 433 = IPCA mensal
    const { data } = await axios.get(
      `${BCB_BASE}.433/dados/ultimos/1?formato=json`
    );
    const item = data?.[0];
    if (!item) return null;
    return `📈 *IPCA (inflação):* ${item.valor}% em ${item.data}`;
  } catch (err) {
    console.error('[Market] Erro ao buscar IPCA:', err.message);
    return null;
  }
}

// ─── BCB Focus: projeções do mercado (Boletim Focus) ─────────────────────────
// API Olinda do Banco Central — expectativas anuais (projeção de fim de ano).
const BCB_FOCUS = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais';

// Cache de 6h (o Focus é atualizado uma vez ao dia, então não precisa bater toda hora)
const _focusCache = {};

// Busca a projeção mediana do indicador para o ano atual e o próximo.
// indicador: 'Selic' ou 'IPCA'. Retorna [{ ano, mediana }, ...] ou null.
async function getFocusProjecao(indicador) {
  const agora = Date.now();
  const cache = _focusCache[indicador];
  if (cache && agora - cache.ts < 6 * 60 * 60 * 1000) {
    return cache.value;
  }

  try {
    const anoAtual = new Date().getFullYear();
    const anos = [String(anoAtual), String(anoAtual + 1)];

    // top=200 + ordenado por Data desc → pega sempre a leitura mais recente do Focus
    const url = `${BCB_FOCUS}?%24top=200&%24filter=Indicador%20eq%20'${indicador}'&%24orderby=Data%20desc&%24format=json`;
    const { data } = await axios.get(url);
    const linhas = data?.value || [];
    if (!linhas.length) return null;

    // Para cada ano-alvo, pega o registro mais recente (a lista já vem ordenada por Data desc)
    const projecao = [];
    for (const ano of anos) {
      const item = linhas.find(l => l.DataReferencia === ano && typeof l.Mediana === 'number');
      if (item) projecao.push({ ano, mediana: item.Mediana });
    }

    if (!projecao.length) return null;
    _focusCache[indicador] = { value: projecao, ts: agora };
    console.log(`[Market] Focus ${indicador}: ${projecao.map(p => `${p.ano}=${p.mediana}`).join(', ')}`);
    return projecao;
  } catch (err) {
    console.error(`[Market] Erro ao buscar Focus ${indicador}:`, err.message);
    return null;
  }
}

// Texto da projeção da Selic (Boletim Focus)
async function getFocusSelic() {
  const proj = await getFocusProjecao('Selic');
  if (!proj) return null;
  const partes = proj.map(p => `${p.ano}: ${p.mediana.toFixed(2).replace('.', ',')}%`);
  return `🔮 *Projeção da Selic (Boletim Focus — mediana do mercado):*\n${partes.join(' · ')}`;
}

// Texto da projeção do IPCA (Boletim Focus)
async function getFocusIPCA() {
  const proj = await getFocusProjecao('IPCA');
  if (!proj) return null;
  const partes = proj.map(p => `${p.ano}: ${p.mediana.toFixed(2).replace('.', ',')}%`);
  return `🔮 *Projeção do IPCA (Boletim Focus — mediana do mercado):*\n${partes.join(' · ')}`;
}

// ─── Brapi: Ibovespa (índice ^BVSP) ──────────────────────────────────────────

async function getIbovespa() {
  try {
    // %5EBVSP = ^BVSP (símbolo do Ibovespa). Usa a cotação básica (sem fundamental).
    const { data } = await axios.get(
      `${BRAPI_BASE}/quote/%5EBVSP?token=${BRAPI_TOKEN}`
    );
    const idx = data.results?.[0];
    if (!idx) return null;

    const linhas = [
      `📈 *Ibovespa (IBOV)*`,
      `Pontos: ${idx.regularMarketPrice?.toLocaleString('pt-BR')}`,
      `Variação hoje: ${idx.regularMarketChangePercent?.toFixed(2)}%`,
    ];
    if (idx.regularMarketDayHigh && idx.regularMarketDayLow) {
      linhas.push(`Máxima do dia: ${idx.regularMarketDayHigh?.toLocaleString('pt-BR')}`);
      linhas.push(`Mínima do dia: ${idx.regularMarketDayLow?.toLocaleString('pt-BR')}`);
    }
    return linhas.join('\n');
  } catch (err) {
    console.error('[Market] Erro ao buscar Ibovespa:', err.message);
    return null;
  }
}

// ─── InfoMoney: notícias de economia (RSS) ───────────────────────────────────
// Feed validado: /tudo-sobre/economia/feed/ (já filtrado pela seção de economia).
// REGRA DE OURO: os links exibidos vêm SEMPRE do feed real — o bot NUNCA inventa URL.
// Só exibimos título + link oficial do InfoMoney; conteúdo é de terceiros (citamos a fonte).
const INFOMONEY_FEED = 'https://www.infomoney.com.br/tudo-sobre/economia/feed/';

// Cache de 15 min — o feed atualiza algumas vezes por dia, não precisa bater a cada msg.
let _noticiasCache = { value: null, ts: 0 };

// Decodifica entidades HTML comuns que aparecem em títulos de RSS.
function decodeEntities(s) {
  return (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

// Faz o parse do XML do RSS e devolve até `max` notícias {titulo, link}.
// Valida que o link é do próprio InfoMoney (anti-lixo / anti-link forjado).
function parseRSS(xml, max = 3) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  const noticias = [];
  for (const m of items) {
    const bloco = m[1];
    const tMatch = bloco.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const lMatch = bloco.match(/<link>([\s\S]*?)<\/link>/);
    if (!tMatch || !lMatch) continue;

    const titulo = decodeEntities(tMatch[1].trim());
    const link = lMatch[1].trim();

    // Só aceita links do domínio oficial — nunca exibe URL de origem duvidosa.
    if (!/^https?:\/\/(www\.)?infomoney\.com\.br\//.test(link)) continue;
    if (!titulo) continue;

    noticias.push({ titulo, link });
    if (noticias.length >= max) break;
  }
  return noticias;
}

async function getNoticias() {
  const agora = Date.now();
  if (_noticiasCache.value && agora - _noticiasCache.ts < 15 * 60 * 1000) {
    console.log('[Market] notícias: cache hit');
    return _noticiasCache.value;
  }

  try {
    const { data } = await axios.get(INFOMONEY_FEED, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PayrollBot/1.0)' },
      responseType: 'text',
      timeout: 8000,
    });

    const noticias = parseRSS(data, 3);
    if (!noticias.length) {
      console.warn('[Market] notícias: feed sem itens válidos');
      return null;
    }

    const linhas = ['📰 *Últimas de economia (via InfoMoney):*', ''];
    noticias.forEach((n, i) => {
      linhas.push(`${i + 1}. ${n.titulo}`);
      linhas.push(`🔗 ${n.link}`);
      if (i < noticias.length - 1) linhas.push('');
    });
    linhas.push('');
    linhas.push('_Notícias de terceiros (InfoMoney), apenas para informação. Não constituem recomendação._');

    const resultado = linhas.join('\n');
    _noticiasCache = { value: resultado, ts: agora };
    console.log(`[Market] notícias: ${noticias.length} manchetes do InfoMoney`);
    return resultado;
  } catch (err) {
    console.error('[Market] Erro ao buscar notícias:', err.message);
    return null;
  }
}

// ─── Panorama macro: combo Ibovespa + dólar + Selic + CDI + IPCA ──────────────
// Cacheia o bloco por 10 min — fica rápido e não martela as APIs.
let _panoramaCache = { value: null, ts: 0 };

async function montarPanorama() {
  const agora = Date.now();
  if (_panoramaCache.value && agora - _panoramaCache.ts < 10 * 60 * 1000) {
    console.log('[Market] panorama: cache hit');
    return _panoramaCache.value;
  }

  const [ibov, cambio, selic, cdi, ipca, focusSelic, focusIpca] = await Promise.all([
    getIbovespa(), getCambio(), getSelic(), getCDI(), getIPCA(),
    getFocusSelic(), getFocusIPCA(),
  ]);

  const partes = [];
  if (ibov) partes.push(ibov);
  const taxas = [selic, cdi].filter(Boolean);
  if (taxas.length) partes.push(taxas.join('\n'));
  if (focusSelic) partes.push(focusSelic);
  if (ipca) partes.push(ipca);
  if (focusIpca) partes.push(focusIpca);
  if (cambio) partes.push(cambio);

  if (!partes.length) {
    console.warn('[Market] panorama: nenhuma fonte respondeu');
    return null;
  }

  const resultado = partes.join('\n\n');
  _panoramaCache = { value: resultado, ts: agora };
  console.log('[Market] panorama montado (Ibovespa + câmbio + Selic/CDI + IPCA + projeções Focus)');
  return resultado;
}

// ─── Função principal ─────────────────────────────────────────────────────────

async function getMarketData(userMessage) {
  // Resolve TODOS os tickers da mensagem (até MAX_TICKERS): código direto, dicionário ou busca dinâmica.
  const tickers = await resolverTickers(userMessage);

  const panorama = pedePanorama(userMessage);
  console.log(`[Market] mensagem="${userMessage}" → tickers=[${tickers.join(', ') || 'nenhum'}] | panorama=${panorama}`);

  const blocos = [];
  const promises = [];

  // ── Ativos (ações e/ou FIIs) — um bloco por ticker, na ORDEM da mensagem ──
  const ativosPromise = Promise.all(
    tickers.map(ticker => (isFII(ticker) ? getFIIData(ticker) : getCotacao(ticker)))
  );

  if (panorama) {
    promises.push(montarPanorama().then(d => d && blocos.push(d)));
  } else {
    if (mencionaBolsa(userMessage)) {
      promises.push(getIbovespa().then(d => d && blocos.push(d)));
    }

    if (mentionaDolar(userMessage)) {
      promises.push(getCambio().then(d => d && blocos.push(d)));
    }

    if (mencionaSelic(userMessage)) {
      promises.push(
        Promise.all([getSelic(), getCDI(), getFocusSelic()]).then(([selic, cdi, focusSelic]) => {
          const taxas = [selic, cdi].filter(Boolean);
          if (taxas.length > 0) blocos.push(taxas.join('\n'));
          if (focusSelic) blocos.push(focusSelic);
        })
      );
    }

    if (mencionaInflacao(userMessage)) {
      promises.push(
        Promise.all([getIPCA(), getFocusIPCA()]).then(([ipca, focusIpca]) => {
          if (ipca) blocos.push(ipca);
          if (focusIpca) blocos.push(focusIpca);
        })
      );
    }

    // Notícias de economia (InfoMoney) — só quando o usuário pede explicitamente.
    if (mencionaNoticias(userMessage)) {
      promises.push(getNoticias().then(d => d && blocos.push(d)));
    }
  }

  await Promise.all(promises);

  const ativos = (await ativosPromise).filter(Boolean);
  blocos.unshift(...ativos);

  if (blocos.length === 0) {
    console.log('[Market] nenhum bloco de dados gerado para esta mensagem');
    return '';
  }

  return `\n📡 *Dados de mercado em tempo real:*\n\n${blocos.join('\n\n')}`;
}

module.exports = { getMarketData };