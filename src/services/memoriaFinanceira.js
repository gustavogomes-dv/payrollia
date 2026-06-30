const MAX_ITENS = { fatos: 8, jornada: 8, relacao: 5 };

async function getMemoria(pool, userId) {
  const r = await pool.query(
    `SELECT consent, consent_at, fatos, jornada, relacao, updated_at
       FROM financial_memory WHERE user_id = $1`,
    [userId]
  );
  return r.rows[0] || null;
}

async function temDecisaoDeConsentimento(pool, userId) {
  const r = await pool.query(
    `SELECT consent_at FROM financial_memory WHERE user_id = $1`,
    [userId]
  );
  return r.rows.length > 0 && r.rows[0].consent_at != null;
}

async function registrarConsentimento(pool, userId, aceito) {
  await pool.query(
    `INSERT INTO financial_memory (user_id, consent, consent_at, updated_at)
     VALUES ($1, $2, now(), now())
     ON CONFLICT (user_id)
     DO UPDATE SET consent = $2, consent_at = now(), updated_at = now()`,
    [userId, !!aceito]
  );
}

async function adicionarMemoria(pool, userId, categoria, item) {
  if (!['fatos', 'jornada', 'relacao'].includes(categoria)) {
    throw new Error(`categoria inválida: ${categoria}`);
  }
  const texto = String(item || '').trim().slice(0, 140);
  if (!texto) return false;

  const mem = await getMemoria(pool, userId);
  if (!mem || !mem.consent) return false;

  const atual = Array.isArray(mem[categoria]) ? mem[categoria] : [];
  if (atual.some(x => String(x).toLowerCase() === texto.toLowerCase())) {
    return true;
  }
  const nova = [...atual, texto].slice(-MAX_ITENS[categoria]);

  await pool.query(
    `UPDATE financial_memory
        SET ${categoria} = $2::jsonb, updated_at = now()
      WHERE user_id = $1`,
    [userId, JSON.stringify(nova)]
  );
  return true;
}

async function esquecer(pool, userId) {
  await pool.query(`DELETE FROM financial_memory WHERE user_id = $1`, [userId]);
}

async function descreverMemoria(pool, userId) {
  const mem = await getMemoria(pool, userId);
  if (!mem || !mem.consent) {
    return 'Não estou guardando nada sobre você no momento. 🙂\n\nSe quiser que eu lembre do nosso histórico pra te ajudar melhor, é só mandar *LEMBRAR*.';
  }
  const linhas = ['Aqui está tudo que guardei sobre você 👇\n'];
  const blocos = [
    ['📌 Sobre você', mem.fatos],
    ['📈 Sua jornada', mem.jornada],
    ['💬 Como prefiro te explicar', mem.relacao],
  ];
  let temConteudo = false;
  for (const [titulo, lista] of blocos) {
    if (Array.isArray(lista) && lista.length) {
      temConteudo = true;
      linhas.push(`*${titulo}:*`);
      for (const item of lista) linhas.push(`• ${item}`);
      linhas.push('');
    }
  }
  if (!temConteudo) {
    return 'Você autorizou que eu guardasse nosso histórico, mas ainda não anotei nada. Conforme a gente conversa, vou lembrando do que importa. 🙂\n\nQuer que eu apague essa autorização? Manda *ESQUECER*.';
  }
  linhas.push('Quer que eu apague tudo isso? É só mandar *ESQUECER*. 🧹');
  return linhas.join('\n');
}

function blocoParaPrompt(mem) {
  if (!mem || !mem.consent) return '';
  const partes = [];
  if (Array.isArray(mem.fatos) && mem.fatos.length) {
    partes.push(`Sobre ele(a): ${mem.fatos.join('; ')}.`);
  }
  if (Array.isArray(mem.jornada) && mem.jornada.length) {
    partes.push(`Jornada: ${mem.jornada.join('; ')}.`);
  }
  if (Array.isArray(mem.relacao) && mem.relacao.length) {
    partes.push(`Tom preferido: ${mem.relacao.join('; ')}.`);
  }
  if (!partes.length) return '';

  return [
    '',
    'MEMÓRIA DO USUÁRIO (Camada 3 — use só pra dar continuidade natural):',
    partes.join(' '),
    'REGRAS DESTA MEMÓRIA (invioláveis): lembrar do histórico NÃO autoriza recomendar ativo, prever futuro nem prometer retorno. O campo "Tom preferido" é só estilo de comunicação — NUNCA o trate como diagnóstico clínico nem o repita de volta como rótulo ("você tem ansiedade"). Lembrar é dar continuidade, não psicanalisar.',
  ].join('\n');
}

module.exports = {
  MAX_ITENS,
  getMemoria,
  temDecisaoDeConsentimento,
  registrarConsentimento,
  adicionarMemoria,
  esquecer,
  descreverMemoria,
  blocoParaPrompt,
};