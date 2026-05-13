const axios = require('axios');

const BRAPI_TOKEN = process.env.BRAPI_TOKEN;
const BRAPI_BASE = 'https://brapi.dev/api';
const BCB_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';

// ─── Detectores de intenção ───────────────────────────────────────────────────

function extractTicker(text) {
  const match = text.toUpperCase().match(/\b[A-Z]{4}\d{1,2}\b/);
  return match ? match[0] : null;
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

async function getCotacao(ticker) {
  try {
    const { data } = await axios.get(
      `${BRAPI_BASE}/quote/${ticker}?token=${BRAPI_TOKEN}&fundamental=true&dividends=true`
    );

    const stock = data.results?.[0];
    if (!stock) return null;

    const linhas = [
      `📊 *${stock.symbol} — ${stock.longName || stock.shortName || ''}*`,
      `Preço atual: R$ ${stock.regularMarketPrice?.toFixed(2)}`,
      `Variação hoje: ${stock.regularMarketChangePercent?.toFixed(2)}%`,
      `Abertura: R$ ${stock.regularMarketOpen?.toFixed(2)}`,
      `Máxima do dia: R$ ${stock.regularMarketDayHigh?.toFixed(2)}`,
      `Mínima do dia: R$ ${stock.regularMarketDayLow?.toFixed(2)}`,
      `Volume: ${stock.regularMarketVolume?.toLocaleString('pt-BR')}`,
    ];

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

    const dividendos = stock.dividendsData?.cashDividends?.slice(0, 2);
    if (dividendos?.length > 0) {
      linhas.push(`\n💰 Dividendos recentes:`);
      dividendos.forEach(d => {
        linhas.push(`  ${d.paymentDate?.slice(0, 10)}: R$ ${d.rate?.toFixed(4)}`);
      });
    }

    return linhas.join('\n');
  } catch (err) {
    console.error(`[Market] Erro ao buscar cotação de ${ticker}:`, err.message);
    return null;
  }
}

// ─── Brapi: Dados de FII ──────────────────────────────────────────────────────

async function getFIIData(ticker) {
  try {
    const { data } = await axios.get(
      `${BRAPI_BASE}/quote/${ticker}?token=${BRAPI_TOKEN}&fundamental=true&dividends=true`
    );

    const stock = data.results?.[0];
    if (!stock) return null;

    const linhas = [
      `🏢 *${stock.symbol} — ${stock.longName || stock.shortName || 'FII'}*`,
      `Preço atual: R$ ${stock.regularMarketPrice?.toFixed(2)}`,
      `Variação hoje: ${stock.regularMarketChangePercent?.toFixed(2)}%`,
      `Volume: ${stock.regularMarketVolume?.toLocaleString('pt-BR')}`,
    ];

    if (stock.dividendYield) linhas.push(`Dividend Yield: ${stock.dividendYield?.toFixed(2)}%`);
    if (stock.priceToBook) linhas.push(`P/VP: ${stock.priceToBook?.toFixed(2)}`);

    if (stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh) {
      linhas.push(`Mínima 52 sem: R$ ${stock.fiftyTwoWeekLow?.toFixed(2)}`);
      linhas.push(`Máxima 52 sem: R$ ${stock.fiftyTwoWeekHigh?.toFixed(2)}`);
    }

    const dividendos = stock.dividendsData?.cashDividends?.slice(0, 3);
    if (dividendos?.length > 0) {
      linhas.push(`\n💰 Últimos rendimentos:`);
      dividendos.forEach(d => {
        linhas.push(`  ${d.paymentDate?.slice(0, 10)}: R$ ${d.rate?.toFixed(4)}`);
      });
    }

    return linhas.join('\n');
  } catch (err) {
    console.error(`[Market] Erro ao buscar FII ${ticker}:`, err.message);
    return null;
  }
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
  const ticker = extractTicker(userMessage);
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

  if (blocos.length === 0) return '';

  return `\n📡 *Dados de mercado em tempo real:*\n\n${blocos.join('\n\n')}`;
}

module.exports = { getMarketData };