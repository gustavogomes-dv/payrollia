const { pool, redisClient } = require("./index");

// ─── Gerar código único de indicação ─────────────────────────────────────────
function gerarCodigo(nome) {
  const prefixo = nome
    ? nome
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 4)
        .padEnd(4, "X")
    : "PAY";
  const sufixo = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefixo}-${sufixo}`;
}

// ─── Criar ou buscar código de indicação do usuário ───────────────────────────
async function getOrCreateReferralCode(user) {
  // Verifica se já tem um código ativo
  const { rows: existing } = await pool.query(
    `SELECT * FROM referrals WHERE referrer_id = $1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
    [user.id],
  );

  if (existing[0]) return existing[0];

  // Gera código único
  let code;
  let tentativas = 0;
  do {
    code = gerarCodigo(user.name);
    const { rows } = await pool.query(
      `SELECT id FROM referrals WHERE code = $1`,
      [code],
    );
    if (rows.length === 0) break;
    tentativas++;
  } while (tentativas < 10);

  // Expira em 30 dias
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { rows } = await pool.query(
    `INSERT INTO referrals (referrer_id, code, discount_pct, reward_pct, expires_at)
     VALUES ($1, $2, 10, 50, $3)
     RETURNING *`,
    [user.id, code, expiresAt],
  );

  return rows[0];
}

// ─── Buscar referral pelo código ──────────────────────────────────────────────
async function getReferralByCode(code) {
  const { rows } = await pool.query(
    `SELECT r.*, u.phone as referrer_phone, u.name as referrer_name, u.tenant_id
     FROM referrals r
     JOIN users u ON u.id = r.referrer_id
     WHERE r.code = $1 AND r.expires_at > NOW()`,
    [code.toUpperCase().trim()],
  );
  return rows[0] || null;
}

// ─── Incrementar uso do código ────────────────────────────────────────────────
async function incrementReferralUse(code) {
  await pool.query(
    `UPDATE referrals SET uses_count = uses_count + 1 WHERE code = $1`,
    [code.toUpperCase().trim()],
  );
}

module.exports = {
  getOrCreateReferralCode,
  getReferralByCode,
  incrementReferralUse,
};
