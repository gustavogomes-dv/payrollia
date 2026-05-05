function calcularPerfil(pontuacao) {
    if (pontuacao <= 12) {
    return {
        perfil: 'conservador',
      descricao: '🛡️ *Perfil Conservador*',
        explicacao: `Você prioriza a segurança do seu patrimônio. São indicados para você: Tesouro Selic, CDBs de bancos sólidos, LCI/LCA e fundos de renda fixa.`,
      aviso: `⚠️ Produtos com alta volatilidade como ações e criptomoedas *não são adequados* para o seu perfil.`,
    };
    } else if (pontuacao <= 18) {
    return {
        perfil: 'moderado',
      descricao: '⚖️ *Perfil Moderado*',
        explicacao: `Você busca equilíbrio entre segurança e rentabilidade. São adequados para você: Tesouro IPCA+, fundos multimercado, FIIs e uma pequena parcela em ações.`,
        aviso: `⚠️ Mantenha sempre uma reserva de emergência em renda fixa antes de investir em renda variável.`,
    };
    } else {
    return {
        perfil: 'arrojado',
      descricao: '🚀 *Perfil Arrojado*',
        explicacao: `Você tem alta tolerância ao risco e busca maximizar retornos no longo prazo. Ações, FIIs, ETFs e fundos de ações são adequados para o seu perfil.`,
        aviso: `⚠️ Lembre-se: maior potencial de retorno vem acompanhado de maior risco. Diversifique sempre.`,
    };
    }
}

module.exports = calcularPerfil;