const { pool, redisClient } = require('./index');

// Busca usuário pelo telefone — usa Redis como cache
async function getUserByPhone(tenantId, phone) {
    const cacheKey = `user:${tenantId}:${phone}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const { rows } = await pool.query(
    `SELECT u.*, ip.perfil, ip.valido_ate, ip.pontuacao
    FROM users u
    LEFT JOIN investor_profiles ip ON ip.user_id = u.id
    WHERE u.tenant_id = $1 AND u.phone = $2`,
    [tenantId, phone]
);

    const user = rows[0] || null;
    if (user) {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(user)); // cache 1h
    }
    return user;
}

// Cria novo usuário
async function createUser(tenantId, phone) {
    const { rows } = await pool.query(
    `INSERT INTO users (tenant_id, phone)
        VALUES ($1, $2)
        ON CONFLICT (tenant_id, phone) DO UPDATE SET phone = EXCLUDED.phone
     RETURNING *`,
    [tenantId, phone]
    );
    return rows[0];
}

// Atualiza dados básicos do usuário
async function updateUser(userId, data) {
    const { name, email, cpf, onboarding_complete } = data;
    const { rows } = await pool.query(
    `UPDATE users
    SET name = COALESCE($1, name),
        email = COALESCE($2, email),
        cpf = COALESCE($3, cpf),
        onboarding_complete = COALESCE($4, onboarding_complete)
    WHERE id = $5
     RETURNING *`,
    [name, email, cpf, onboarding_complete, userId]
);

  // Invalida o cache
    const user = rows[0];
    await redisClient.del(`user:${user.tenant_id}:${user.phone}`);
    return user;
}

// Salva o perfil de investidor calculado
async function saveInvestorProfile(userId, respostas, perfil, pontuacao) {
    const validoAte = new Date();
  validoAte.setFullYear(validoAte.getFullYear() + 1); // válido por 1 ano

    const { rows } = await pool.query(
    `INSERT INTO investor_profiles
        (user_id, objetivo, horizonte, tolerancia_risco, experiencia,
        renda_mensal, patrimonio, dependentes, reacao_queda, perfil, pontuacao, valido_ate)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (user_id) DO UPDATE SET
        objetivo = EXCLUDED.objetivo,
        horizonte = EXCLUDED.horizonte,
        tolerancia_risco = EXCLUDED.tolerancia_risco,
        experiencia = EXCLUDED.experiencia,
        renda_mensal = EXCLUDED.renda_mensal,
        patrimonio = EXCLUDED.patrimonio,
        dependentes = EXCLUDED.dependentes,
        reacao_queda = EXCLUDED.reacao_queda,
        perfil = EXCLUDED.perfil,
        pontuacao = EXCLUDED.pontuacao,
        valido_ate = EXCLUDED.valido_ate,
        updated_at = NOW()
     RETURNING *`,
    [
    userId,
    respostas.objetivo,
    respostas.horizonte,
    respostas.tolerancia_risco,
    respostas.experiencia,
    respostas.renda_mensal,
    respostas.patrimonio,
    respostas.dependentes,
    respostas.reacao_queda,
    perfil,
    pontuacao,
    validoAte,
    ]
);
return rows[0];
}

// Busca ou cria sessão do usuário (controla o passo do fluxo)
async function getOrCreateSession(userId) {
    const { rows } = await pool.query(
    `INSERT INTO sessions (user_id)
    VALUES ($1)
    ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
     RETURNING *`,
    [userId]
);
return rows[0];
}

// Atualiza o passo atual da conversa
async function updateSession(userId, step, context = {}) {
    const { rows } = await pool.query(
        `UPDATE sessions
        SET step = $1, context = $2, updated_at = NOW()
        WHERE user_id = $3
         RETURNING *`,
    [step, JSON.stringify(context), userId]
    );
    return rows[0];
}

// Busca o perfil de investidor pelo userId
async function getInvestorProfile(userId) {
    const { rows } = await pool.query(
    `SELECT perfil, pontuacao, valido_ate FROM investor_profiles WHERE user_id = $1`,
    [userId]
    );
    return rows[0] || null;
}

// Salva uma mensagem no histórico
async function saveMessage(userId, role, content) {
    const { rows } = await pool.query(
    `INSERT INTO messages (user_id, role, content) VALUES ($1, $2, $3) RETURNING *`,
    [userId, role, content]
    );
    return rows[0];
}

// Busca as últimas N mensagens do usuário
async function getRecentMessages(userId, limit = 10) {
    const { rows } = await pool.query(
    `SELECT role, content FROM messages
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2`,
    [userId, limit]
    );
  return rows.reverse(); // mais antigas primeiro
}
module.exports = {
    getUserByPhone,
    createUser,
    updateUser,
    saveInvestorProfile,
    getOrCreateSession,
    updateSession,
    getInvestorProfile,
    saveMessage,
    getRecentMessages,
    saveMessage,        // ← nova
    getRecentMessages,  // ← nova
};
