const PERGUNTAS = [
    {
    id: 'objetivo',
    texto: `*1️⃣ Qual é o seu principal objetivo ao investir?*

1 - Preservar meu dinheiro com segurança
2 - Crescer meu patrimônio no longo prazo
3 - Gerar renda passiva (dividendos, juros)
4 - Multiplicar capital com maior risco

Responda com o número da opção:`,
    opcoes: {
    '1': 'preservar',
    '2': 'crescer',
    '3': 'renda',
    '4': 'multiplicar',
    },
    pontos: { '1': 1, '2': 2, '3': 2, '4': 3 },
},
    {
    id: 'horizonte',
    texto: `*2️⃣ Por quanto tempo você pretende deixar o dinheiro investido?*

1 - Menos de 1 ano
2 - Entre 1 e 3 anos
3 - Entre 3 e 5 anos
4 - Mais de 5 anos

Responda com o número da opção:`,
    opcoes: {
    '1': 'curtissimo',
    '2': 'curto',
    '3': 'medio',
    '4': 'longo',
    },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
},
    {
    id: 'reacao_queda',
    texto: `*3️⃣ Seus investimentos caíram 20% em um mês. O que você faz?*

1 - Vendo tudo imediatamente para evitar mais perdas
2 - Fico preocupado mas aguardo a recuperação
3 - Mantenho a calma, é normal no longo prazo
4 - Aproveito para comprar mais

Responda com o número da opção:`,
    opcoes: {
        '1': 'vende_tudo',
        '2': 'aguarda_preocupado',
        '3': 'aguarda_calmo',
        '4': 'compra_mais',
    },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
    },
{
    id: 'experiencia',
    texto: `*4️⃣ Qual é a sua experiência com investimentos?*

1 - Nenhuma, nunca investi
2 - Básica, só poupança ou CDB
3 - Intermediária, já investi em fundos ou ações
4 - Avançada, opero ações, FIIs, derivativos

Responda com o número da opção:`,
    opcoes: {
        '1': 'nenhuma',
        '2': 'basica',
        '3': 'intermediaria',
        '4': 'avancada',
    },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
},
    {
    id: 'renda_mensal',
    texto: `*5️⃣ Qual é a sua renda mensal aproximada?*

1 - Até R$ 3.000
2 - Entre R$ 3.000 e R$ 10.000
3 - Entre R$ 10.000 e R$ 30.000
4 - Acima de R$ 30.000

Responda com o número da opção:`,
    opcoes: {
        '1': 'ate3k',
        '2': '3k_10k',
        '3': '10k_30k',
        '4': 'acima30k',
    },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
},
    {
    id: 'patrimonio',
    texto: `*6️⃣ Qual é o seu patrimônio total aproximado?*

1 - Até R$ 10.000
2 - Entre R$ 10.000 e R$ 100.000
3 - Entre R$ 100.000 e R$ 500.000
4 - Acima de R$ 500.000

Responda com o número da opção:`,
    opcoes: {
        '1': 'ate10k',
        '2': '10k_100k',
        '3': '100k_500k',
        '4': 'acima500k',
    },
    pontos: { '1': 1, '2': 1, '3': 2, '4': 3 },
},
    {
    id: 'dependentes',
    texto: `*7️⃣ Você tem dependentes financeiros?*

1 - Sim, tenho dependentes
2 - Não tenho dependentes

Responda com o número da opção:`,
    opcoes: {
    '1': 'sim',
    '2': 'nao',
},
    pontos: { '1': 1, '2': 2 },
},
    {
    id: 'tolerancia_risco',
    texto: `*8️⃣ Como você se sente em relação ao risco?*

1 - Prefiro segurança, mesmo com retorno menor
2 - Aceito algum risco por retornos melhores
3 - Busco altos retornos e aceito perdas significativas

Responda com o número da opção:`,
    opcoes: {
        '1': 'baixa',
        '2': 'media',
        '3': 'alta',
    },
    pontos: { '1': 1, '2': 2, '3': 3 },
},
];

module.exports = PERGUNTAS;