// ─────────────────────────────────────────────────────────────────────────────
// Juros Compostos — cálculo determinístico (NUNCA deixar o LLM calcular isto).
//
// Fórmula com aportes mensais (annuity):
//   M = P·(1+i)^n  +  PMT·[((1+i)^n − 1) / i]
//   onde:
//     P   = capital inicial
//     PMT = aporte mensal
//     i   = taxa por período (decimal, ex.: 0.01 = 1%)
//     n   = número de períodos (meses)
//
// Toda taxa é convertida para MENSAL antes de aplicar, pois o aporte é mensal.
// ─────────────────────────────────────────────────────────────────────────────

// Converte taxa anual para mensal de forma composta (equivalência real, não /12).
//   (1 + anual)^(1/12) − 1
function taxaAnualParaMensal(taxaAnualDecimal) {
  return Math.pow(1 + taxaAnualDecimal, 1 / 12) - 1;
}

// Núcleo do cálculo. Recebe tudo já normalizado e devolve os números crus.
//   capitalInicial: R$ (number ≥ 0)
//   aporteMensal:   R$ (number ≥ 0)
//   taxaMensal:     decimal (ex.: 0.008 = 0,8% a.m.)
//   meses:          inteiro ≥ 1
function calcularJurosCompostos({ capitalInicial = 0, aporteMensal = 0, taxaMensal, meses }) {
  const i = taxaMensal;
  const n = meses;

  let montante;
  if (i === 0) {
    // Sem juros: só soma capital + aportes
    montante = capitalInicial + aporteMensal * n;
  } else {
    const fator = Math.pow(1 + i, n);
    const partCapital = capitalInicial * fator;
    const partAportes = aporteMensal * ((fator - 1) / i);
    montante = partCapital + partAportes;
  }

  const totalInvestido = capitalInicial + aporteMensal * n;
  const totalJuros = montante - totalInvestido;

  return {
    montante,
    totalInvestido,
    totalJuros,
    meses: n,
    anos: n / 12,
  };
}

// Formata número como moeda BRL.
function fmtBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Monta a mensagem final (formatação WhatsApp) a partir do resultado do cálculo.
// Inclui SEMPRE o aviso educacional (CVM): é uma simulação matemática, não promessa.
function formatarResultado(params, resultado) {
  const { capitalInicial = 0, aporteMensal = 0, taxaAnualPct, meses } = params;
  const { montante, totalInvestido, totalJuros, anos } = resultado;

  const prazoTxt = meses % 12 === 0
    ? `${anos} ano${anos !== 1 ? 's' : ''}`
    : `${meses} meses`;

  const linhas = [
    `🧮 *Simulação de Juros Compostos*`,
    ``,
    `💰 Valor inicial: ${fmtBRL(capitalInicial)}`,
  ];

  if (aporteMensal > 0) linhas.push(`📅 Aporte mensal: ${fmtBRL(aporteMensal)}`);
  linhas.push(`📈 Taxa: ${taxaAnualPct.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% ao ano`);
  linhas.push(`⏳ Prazo: ${prazoTxt}`);
  linhas.push(``);
  linhas.push(`*Resultado estimado:*`);
  linhas.push(`Total investido: ${fmtBRL(totalInvestido)}`);
  linhas.push(`Juros acumulados: ${fmtBRL(totalJuros)}`);
  linhas.push(`💵 *Montante final: ${fmtBRL(montante)}*`);
  linhas.push(``);
  linhas.push(`_Esta é uma simulação matemática com taxa fixa hipotética. Investimentos reais têm rentabilidade variável e não garantida. Rentabilidade passada não garante resultados futuros._`);

  return linhas.join('\n');
}

// ─── Parser de linguagem natural (detecção automática) ───────────────────────
// Tenta extrair { capitalInicial, aporteMensal, taxaAnualPct, meses } da frase.
// Retorna um objeto PARCIAL — campos que não achou ficam undefined (pra o fluxo
// guiado perguntar só o que faltar). NÃO inventa valores.
//
// Estratégia anti-contaminação: extrai e REMOVE da frase a taxa e o prazo PRIMEIRO,
// pra que os números deles não sejam confundidos com valores monetários depois.

// Converte uma string numérica BR para number. Trata "1.000,50", "1000", "1.000".
// Heurística do ponto: se houver vírgula, o ponto é separador de milhar.
// Se houver SÓ ponto, decide pelo padrão: ".\d{3}" (3 dígitos) = milhar; senão decimal.
function numeroBR(str) {
  if (!str) return undefined;
  let s = str.trim();

  if (s.includes(',')) {
    // Vírgula presente → ponto é milhar. "1.000,50" → "1000.50"
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes('.')) {
    // Só ponto. "1.000" ou "10.000" (milhar) vs "10.5" (decimal).
    // Se todo grupo após o ponto tem exatamente 3 dígitos → milhar.
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
      s = s.replace(/\./g, '');
    }
    // senão mantém como decimal (ex.: "10.5")
  }
  const v = parseFloat(s);
  return Number.isNaN(v) ? undefined : v;
}

// Extrai um valor monetário de um trecho, lidando com "mil"/"k"/"milhão" e R$.
// Recebe o NÚMERO já isolado (sem palavras-âncora ao redor) e o sufixo capturado.
function valorMonetario(numStr, sufixo) {
  const base = numeroBR(numStr);
  if (base === undefined) return undefined;
  if (sufixo) {
    const s = sufixo.toLowerCase();
    if (s.startsWith('milh') || s === 'mi') return base * 1000000;
    if (s.startsWith('mil') || s === 'k') return base * 1000;
  }
  return base;
}

// Regex reutilizável de um número BR (com milhar/decimal opcionais) + sufixo opcional.
// Captura: [1]=número  [2]=sufixo (milhão/milhões | mil | k | mi)
// ORDEM IMPORTA: "milhao" e "mil" antes de "mi", senão "mi" casa dentro de "mil"/"milhao".
// "mi" e "k" exigem fronteira (\b) pra não casar como prefixo de outra palavra.
const NUM = `(\\d{1,3}(?:\\.\\d{3})+(?:,\\d+)?|\\d+(?:[.,]\\d+)?|\\d+)\\s*(milh(?:[aã]o|[oõ]es)|mil|mi\\b|k\\b)?`;

function parseFraseJuros(texto) {
  let t = ' ' + texto.toLowerCase() + ' ';
  const out = {};

  // ── 1) TAXA (extrai e remove da frase) ─────────────────────────────────────
  // "X% ao ano/mês", "X por cento ao mês", "X%a.a.", "X% a.m."
  const reTaxa = /(\d+(?:[.,]\d+)?)\s*(?:%|por\s*cento)\s*(?:a\.?\s*([am])\.?|ao\s+(ano|m[eê]s)|\/?\s*(ano|m[eê]s))?/;
  const mTaxa = t.match(reTaxa);
  if (mTaxa) {
    const valor = parseFloat(mTaxa[1].replace(',', '.'));
    const unidade = (mTaxa[2] || mTaxa[3] || mTaxa[4] || '').toLowerCase();
    const ehMensal = unidade === 'm' || unidade.startsWith('me') || unidade.startsWith('mê');
    out.taxaAnualPct = ehMensal
      ? (Math.pow(1 + valor / 100, 12) - 1) * 100
      : valor;
    out._taxaUnidadeOriginal = ehMensal ? 'mensal' : 'anual';
    t = t.replace(mTaxa[0], ' <TAXA> '); // remove pra não contaminar valores
  }

  // ── 2) PRAZO (extrai e remove da frase) ────────────────────────────────────
  const reAnos = /(\d+(?:[.,]\d+)?)\s*anos?/;
  const reMeses = /(\d+)\s*(?:meses|m[eê]s)/;
  const mAnos = t.match(reAnos);
  const mMeses = t.match(reMeses);
  if (mAnos) {
    out.meses = Math.round(parseFloat(mAnos[1].replace(',', '.')) * 12);
    t = t.replace(mAnos[0], ' <PRAZO> ');
  } else if (mMeses) {
    out.meses = parseInt(mMeses[1], 10);
    t = t.replace(mMeses[0], ' <PRAZO> ');
  }

  // ── 3) APORTE MENSAL (extrai e remove) ─────────────────────────────────────
  // Âncoras: "aporte", "aportar", "X por mês", "X mensais", "todo/cada mês X"
  // Padrão A: âncora ANTES do número  → "aporte de 1000", "aportar R$ 500"
  const reAporteA = new RegExp(`(?:aporte|aportar|aportando|aporto)(?:\\s+de)?\\s*(?:r\\$\\s*)?${NUM}`);
  // Padrão B: número ANTES da âncora  → "1000 por mês", "500 mensais", "1000 todo mês"
  const reAporteB = new RegExp(`(?:r\\$\\s*)?${NUM}\\s*(?:por\\s*m[eê]s|mensa(?:l|is)|todo\\s*m[eê]s|cada\\s*m[eê]s|/m[eê]s|ao\\s*m[eê]s)`);
  let mAporte = t.match(reAporteA);
  if (!mAporte) mAporte = t.match(reAporteB);
  if (mAporte) {
    out.aporteMensal = valorMonetario(mAporte[1], mAporte[2]);
    t = t.replace(mAporte[0], ' <APORTE> ');
  }

  // ── 4) CAPITAL INICIAL (o que sobrou) ──────────────────────────────────────
  // Âncoras: "investir", "aplicar", "inicial", "começar com", "tenho", "valor de"
  // NOTA: não usar "de" solto como âncora — casa dentro de "rende", "depois" etc.
  const reInicialA = new RegExp(`(?:investir|aplicar|inicial|come[cç]ar\\s*com|tenho|valor\\s*de|aplicando)\\s*(?:de\\s*)?(?:r\\$\\s*)?${NUM}`);
  let mInicial = t.match(reInicialA);
  // Fallback: se ainda não achou capital mas sobrou algum número solto com R$ ou "reais"
  if (!mInicial) {
    const reSolto = new RegExp(`(?:r\\$\\s*)?${NUM}\\s*(?:reais|conto)?`);
    const cand = t.match(reSolto);
    if (cand && /\d/.test(cand[0])) mInicial = cand;
  }
  if (mInicial) {
    const v = valorMonetario(mInicial[1], mInicial[2]);
    if (v !== undefined && v > 0) out.capitalInicial = v;
  }

  return out;
}

// Valida e normaliza os parâmetros antes de calcular.
// Retorna { ok: true, params } ou { ok: false, faltando: [...], erro? }.
function validarParametros(p) {
  const faltando = [];

  // Taxa e prazo são obrigatórios; capital inicial OU aporte precisa existir.
  if (p.taxaAnualPct === undefined || Number.isNaN(p.taxaAnualPct)) faltando.push('taxa');
  if (p.meses === undefined || Number.isNaN(p.meses)) faltando.push('prazo');

  const temCapital = p.capitalInicial !== undefined && p.capitalInicial > 0;
  const temAporte = p.aporteMensal !== undefined && p.aporteMensal > 0;
  if (!temCapital && !temAporte) faltando.push('valor');

  if (faltando.length) return { ok: false, faltando };

  // Sanity checks (evita números absurdos que indicam erro de parse)
  if (p.taxaAnualPct < 0 || p.taxaAnualPct > 1000) {
    return { ok: false, erro: 'taxa_invalida' };
  }
  if (p.meses < 1 || p.meses > 1200) { // até 100 anos
    return { ok: false, erro: 'prazo_invalido' };
  }

  const params = {
    capitalInicial: p.capitalInicial || 0,
    aporteMensal: p.aporteMensal || 0,
    taxaAnualPct: p.taxaAnualPct,
    meses: p.meses,
  };
  return { ok: true, params };
}

// Função de alto nível: recebe params validados e devolve a mensagem pronta.
function simular(params) {
  const taxaMensal = taxaAnualParaMensal(params.taxaAnualPct / 100);
  const resultado = calcularJurosCompostos({
    capitalInicial: params.capitalInicial,
    aporteMensal: params.aporteMensal,
    taxaMensal,
    meses: params.meses,
  });
  return formatarResultado(params, resultado);
}

// ─── Helpers para o fluxo (acoplamento com fluxo.js) ─────────────────────────

// Detecta se a mensagem TEM INTENÇÃO de simular juros / rendimento.
// Conservador de propósito: só dispara com verbos/termos claros de cálculo,
// pra não sequestrar perguntas conceituais ("o que são juros compostos?").
function pedeCalculadora(texto) {
  const t = texto.toLowerCase();
  // "o que é/são", "como funciona" → é pergunta CONCEITUAL, deixa pro Claude explicar
  if (/o que (e|é|sao|são)|como funciona|explica|significa/.test(t)) return false;

  return /simul[ae]|calcul[ae]|quanto (rende|rende?ria|vai render|teria|fica|acumul)|juros compostos|render?\s+\d|se eu (investir|aplicar|guardar|aportar)|render? (em|por|durante)/.test(t);
}

// Mapa de rótulos amigáveis pro que está faltando.
const ROTULO_FALTA = {
  valor: 'valor',
  taxa: 'taxa de juros',
  prazo: 'prazo',
};

// Gera a pergunta do fluxo guiado para o PRIMEIRO item que falta.
// Retorna { campo, pergunta } ou null se nada falta.
function proximaPergunta(faltando) {
  if (!faltando || !faltando.length) return null;
  const campo = faltando[0];

  const perguntas = {
    valor: `💰 Qual o *valor* que você quer simular?\n\nPode ser um valor inicial (ex.: _10 mil_), um aporte mensal (ex.: _500 por mês_), ou os dois juntos.`,
    taxa: `📈 Qual a *taxa de juros*?\n\nPor exemplo: _10% ao ano_ ou _0,8% ao mês_.\n\n_(Dica: você pode usar a Selic ou o CDI atual como referência — é só me perguntar antes!)_`,
    prazo: `⏳ Por *quanto tempo*?\n\nPor exemplo: _5 anos_ ou _60 meses_.`,
  };

  return { campo, pergunta: perguntas[campo] || `Pode me informar o ${ROTULO_FALTA[campo] || campo}?` };
}

// Funde o que o parser extraiu de UMA resposta nova dentro dos params acumulados.
// Usado no fluxo guiado: o usuário responde "10%", a gente extrai e mescla.
function mesclarParams(acumulado, novoTexto) {
  const novo = parseFraseJuros(novoTexto);
  const merged = { ...acumulado };
  // Só sobrescreve campos que vieram preenchidos na nova resposta
  for (const k of ['capitalInicial', 'aporteMensal', 'taxaAnualPct', 'meses']) {
    if (novo[k] !== undefined) merged[k] = novo[k];
  }
  return merged;
}

module.exports = {
  taxaAnualParaMensal,
  calcularJurosCompostos,
  formatarResultado,
  parseFraseJuros,
  validarParametros,
  simular,
  fmtBRL,
  pedeCalculadora,
  proximaPergunta,
  mesclarParams,
};