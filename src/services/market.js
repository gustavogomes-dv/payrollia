const axios = require('axios');

function extractTicker(text) {
    const match = text.toUpperCase().match(/\b[A-Z]{4}\d{1,2}\b/);
    return match ? match[0] : null;
}

async function getMarketData(userMessage) {
    const ticker = extractTicker(userMessage);
    if (!ticker) return '';

    try {
    const { data } = await axios.get(
        `https://brapi.dev/api/quote/${ticker}?token=${process.env.BRAPI_TOKEN}`
    );

    const stock = data.results?.[0];
    if (!stock) return '';

    return `
Ativo: ${stock.symbol}
Preço atual: R$ ${stock.regularMarketPrice}
Variação hoje: ${stock.regularMarketChangePercent?.toFixed(2)}%
Abertura: R$ ${stock.regularMarketOpen}
Máxima do dia: R$ ${stock.regularMarketDayHigh}
Mínima do dia: R$ ${stock.regularMarketDayLow}
    `.trim();
    } catch (err) {
    console.error('Erro ao buscar dados de mercado:', err.message);
    return '';
    }
}

module.exports = { getMarketData };