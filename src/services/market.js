const axios = require('axios');

const BRAPI_TOKEN = process.env.BRAPI_TOKEN;
const BRAPI_BASE = 'https://brapi.dev/api';
const BCB_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';

// ─── Dicionário nome da empresa → ticker (FAST PATH) ──────────────────────────
// Mantido como atalho pros nomes mais comuns: evita um roundtrip de API.
// Quando o nome NÃO está aqui, a busca dinâmica na Brapi resolve (ver abaixo).
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
]);

// ─── Detectores de intenção ───────────────────────────────────────────────────

function extractTicker(text) {
  // 1) Tenta achar o código direto (ex.: PETR4, MXRF11)
  const match = text.toUpperCase().match(/\b[A-Z]{4}\d{1,2}\b/);
  if (match) return match[0];

  // 2) Tenta achar pelo nome da empresa (FAST PATH no dicionário)
  const normalizado = normaliza(text);

  // Ordena as chaves da mais longa pra mais curta — evita "bb" casar antes de "banco do brasil"
  const nomes = Object.keys(NOME_PARA_TICKER).sort((a, b) => b.length - a.length);
  for (const nome of nomes) {
    const re = new RegExp(`\\b${nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (re.test(normalizado)) return NOME_PARA_TICKER[nome];
  }

  return null;
}

// Só vale a pena disparar a busca dinâmica quando a mensagem PARECE pedir um ativo.
// Evita bater na Brapi (e gerar falso-positivo) em qualquer frase aleatória.
function pedeCotacao(text) {
  return /cota[cç][aã]o|pre[cç]o|quanto (custa|vale|est[aá]|t[aá])|a[cç][aã]o d[oae]|papel d[oae]|ticker|fundo imobili|dividend|rende|rendimento|vale a pena|invest|comprar|vender|a[cç][õo]es d[oae]/i.test(text);
}

// Cache em memória das resoluções nome→ticker (sobrevive entre requisições no mesmo processo).
const tickerCache = new Map();

// Busca dinâmica na Brapi: resolve QUALQUER ativo listado na B3, não só os do dicionário.
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

  // Tenta a frase inteira primeiro; depois cada token (maior → menor)
  const tentativas = [tokens.join(' '), ...tokens.sort((a, b) => b.length - a.length)];

  for (const termo of tentativas) {
    try {
      const { data } = await axios.get(`${BRAPI_BASE}/quote/list`, {
        params: {
          search: termo,
          token: BRAPI_TOKEN,
          limit: 10,
          sortBy: 'volume',
          sortOrder: 'desc',
        },
      });

      const lista = data.stocks || [];
      if (!lista.length) continue;

      // Prioriza o resultado cujo NOME contenha o termo buscado;
      // se nenhum bater, fica com o de maior volume (primeiro da lista).
      const exato = lista.find(s => normaliza(s.name).includes(termo));
      const escolhido = exato || lista[0];
      const ticker = escolhido.stock;

      console.log(`[Market] busca dinâmica: "${termo}" → ${ticker} (${escolhido.name || 's/ nome'})`);
      tickerCache.set(limpo, ticker);
      return ticker;
    } catch (err) {
      console.error(`[Market] erro na busca dinâmica de "${termo}":`, err.message);
    }
  }

  console.log(`[Market] busca dinâmica: nada encontrado para "${limpo}"`);
  tickerCache.set(limpo, null); // memoriza o "não achou" pra não repetir
  return null;
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

// ─── Brapi: Cotação + Indicadores fundamentalistas ───────────────────────────

// Busca a cotação na Brapi. Usa o módulo `fundamental=true` (liberado no plano free),
// mas NÃO usa `dividends=true` (esse módulo dá 403 no plano free → era o que deixava o bot mudo).
// Se mesmo assim vier um 403 (ex.: plano mudou, fundamental restrito), cai pra cotação básica.
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

async function getCotacao(ticker) {
  const stock = await fetchBrapiQuote(ticker);
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

  // Indicadores fundamentalistas (vêm de fundamental=true, liberado no free)
  if (stock.priceEarnings) linhas.push(`P/L: ${stock.priceEarnings?.toFixed(2)}`);
  if (stock.priceToBook) linhas.push(`P/VP: ${stock.priceToBook?.toFixed(2)}`);
  if (stock.returnOnEquity) linhas.push(`ROE: ${(stock.returnOnEquity * 100)?.toFixed(2)}%`);
  if (stock.dividendYield) linhas.push(`Dividend Yield: ${stock.dividendYield?.toFixed(2)}%`);
  if (stock.earningsPerShare) linhas.push(`LPA: R$ ${stock.earningsPerShare?.toFixed(2)}`);
  if (stock.enterpriseValueEbitda) linhas.push(`EV/EBITDA: ${stock.enterpriseValueEbitda?.toFixed(2)}`);

  if (stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh) {
    linhas.push(`Mínima 52 sem: R$ ${stock.fiftyTwoWeekLow?.toFixed(2)}`);
    linhas.push(`Máxima 52 sem: R$ ${stock.fiftyTwoWeekHigh?.toFixed(2)}`);
  }

  return linhas.join('\n');
}

// ─── Brapi: Dados de FII ──────────────────────────────────────────────────────

async function getFIIData(ticker) {
  const stock = await fetchBrapiQuote(ticker);
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

  // Dividend Yield vem de fundamental=true (liberado no free) — é a métrica-chave do FII
  if (stock.dividendYield) linhas.push(`Dividend Yield: ${stock.dividendYield?.toFixed(2)}%`);
  if (stock.priceToBook) linhas.push(`P/VP: ${stock.priceToBook?.toFixed(2)}`);

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

// ─── Função principal ─────────────────────────────────────────────────────────

async function getMarketData(userMessage) {
  // 1) ticker direto ou nome no dicionário (rápido, sem rede)
  let ticker = extractTicker(userMessage);

  // 2) se não achou E a mensagem parece pedir um ativo → busca dinâmica na Brapi
  if (!ticker && pedeCotacao(userMessage)) {
    ticker = await buscarTickerPorNome(userMessage);
  }

  console.log(`[Market] mensagem="${userMessage}" → ticker resolvido=${ticker || 'nenhum'}`);

  const blocos = [];
  const promises = [];

  // ── Ativo (ação ou FII) ───────────────────────────────────────────────────
  if (ticker) {
    promises.push(
      (isFII(ticker) ? getFIIData(ticker) : getCotacao(ticker))
        .then(d => d && blocos.push(d))
    );
  }

  // ── Câmbio — só quando o usuário mencionar ────────────────────────────────
  if (mentionaDolar(userMessage)) {
    promises.push(getCambio().then(d => d && blocos.push(d)));
  }

  // ── Selic + CDI — só quando o usuário mencionar ───────────────────────────
  if (mencionaSelic(userMessage)) {
    promises.push(
      Promise.all([getSelic(), getCDI()]).then(([selic, cdi]) => {
        const taxas = [selic, cdi].filter(Boolean);
        if (taxas.length > 0) blocos.push(taxas.join('\n'));
      })
    );
  }

  // ── IPCA — só quando o usuário mencionar ──────────────────────────────────
  if (mencionaInflacao(userMessage)) {
    promises.push(getIPCA().then(d => d && blocos.push(d)));
  }

  await Promise.all(promises);

  if (blocos.length === 0) {
    console.log('[Market] nenhum bloco de dados gerado para esta mensagem');
    return '';
  }

  return `\n📡 *Dados de mercado em tempo real:*\n\n${blocos.join('\n\n')}`;
}

module.exports = { getMarketData };