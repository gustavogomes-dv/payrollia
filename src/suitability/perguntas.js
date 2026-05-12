const PERGUNTAS = [
  {
    id: 'objetivo',
    texto: `📌 *Pergunta 1 de 8 — Objetivo*\n\nQual é o seu principal objetivo ao investir?\n\n1️⃣ Preservar meu dinheiro com segurança\n2️⃣ Crescer meu patrimônio no longo prazo\n3️⃣ Gerar renda passiva (dividendos, juros)\n4️⃣ Multiplicar capital, mesmo com mais risco\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'preservar', '2': 'crescer', '3': 'renda', '4': 'multiplicar' },
    pontos: { '1': 1, '2': 2, '3': 2, '4': 3 },
  },
  {
    id: 'horizonte',
    texto: `📌 *Pergunta 2 de 8 — Horizonte de Investimento*\n\nPor quanto tempo você pretende deixar o dinheiro investido?\n\n1️⃣ Menos de 1 ano\n2️⃣ Entre 1 e 3 anos\n3️⃣ Entre 3 e 5 anos\n4️⃣ Mais de 5 anos\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'curtissimo', '2': 'curto', '3': 'medio', '4': 'longo' },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
  },
  {
    id: 'reacao_queda',
    texto: `📌 *Pergunta 3 de 8 — Reação a Perdas*\n\nImagine que seus investimentos caíram 20% em um único mês. O que você faria?\n\n1️⃣ Venderia tudo imediatamente para evitar perdas maiores\n2️⃣ Ficaria preocupado, mas aguardaria a recuperação\n3️⃣ Manteria a calma — oscilações fazem parte do processo\n4️⃣ Aproveitaria a queda para comprar mais\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'vende_tudo', '2': 'aguarda_preocupado', '3': 'aguarda_calmo', '4': 'compra_mais' },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
  },
  {
    id: 'experiencia',
    texto: `📌 *Pergunta 4 de 8 — Experiência com Investimentos*\n\nQual é o seu nível de experiência com o mercado financeiro?\n\n1️⃣ Nenhuma — nunca investi\n2️⃣ Básica — conheço poupança ou CDB\n3️⃣ Intermediária — já investi em fundos ou ações\n4️⃣ Avançada — opero ações, FIIs, derivativos\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'nenhuma', '2': 'basica', '3': 'intermediaria', '4': 'avancada' },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
  },
  {
    id: 'renda_mensal',
    texto: `📌 *Pergunta 5 de 8 — Renda Mensal*\n\nQual é a sua renda mensal aproximada?\n\n1️⃣ Até R$ 3.000\n2️⃣ Entre R$ 3.000 e R$ 10.000\n3️⃣ Entre R$ 10.000 e R$ 30.000\n4️⃣ Acima de R$ 30.000\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'ate3k', '2': '3k_10k', '3': '10k_30k', '4': 'acima30k' },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
  },
  {
    id: 'patrimonio',
    texto: `📌 *Pergunta 6 de 8 — Patrimônio*\n\nQual é o seu patrimônio total aproximado?\n\n1️⃣ Até R$ 10.000\n2️⃣ Entre R$ 10.000 e R$ 100.000\n3️⃣ Entre R$ 100.000 e R$ 500.000\n4️⃣ Acima de R$ 500.000\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'ate10k', '2': '10k_100k', '3': '100k_500k', '4': 'acima500k' },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
  },
  {
    id: 'dependentes',
    texto: `📌 *Pergunta 7 de 8 — Dependentes Financeiros*\n\nVocê possui pessoas que dependem financeiramente de você?\n\n1️⃣ Sim, tenho dependentes\n2️⃣ Não tenho dependentes\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'sim', '2': 'nao' },
    pontos: { '1': 1, '2': 2 },
  },
  {
    id: 'tolerancia_risco',
    texto: `📌 *Pergunta 8 de 8 — Tolerância ao Risco*\n\nComo você se relaciona com o risco nos seus investimentos?\n\n1️⃣ Prefiro segurança, mesmo que o retorno seja menor\n2️⃣ Aceito algum risco em troca de retornos melhores\n3️⃣ Busco altos retornos e estou disposto a aceitar perdas significativas\n\nResponda com o número da opção desejada:`,
    opcoes: { '1': 'baixa', '2': 'media', '3': 'alta' },
    pontos: { '1': 1, '2': 2, '3': 3 },
  },
];

module.exports = PERGUNTAS;