const { pool } = require('../db/index');

async function authTenant(req, res, next) {
    try {
    const phoneId = req.body?.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

    if (!phoneId) return next();

    const { rows } = await pool.query(
      'SELECT * FROM tenants WHERE whatsapp_phone_id = $1 AND active = true',
        [phoneId]
    );

    if (!rows[0]) {
        console.warn(`Tenant não encontrado para phone_id: ${phoneId}`);
        return res.sendStatus(401);
    }

    req.tenant = rows[0];
    next();
    } catch (err) {
    console.error('Erro no middleware de auth:', err);
    res.sendStatus(500);
    }
}

module.exports = { authTenant };