require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: ['https://payrollia.vercel.app', 'http://localhost:3001'],
  credentials: true,
}));

// Bypass ngrok browser warning
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

app.use('/webhook', require('./webhook/whatsapp'));

app.post('/teste', async (req, res) => {
  try {
    const { phone, mensagem } = req.body;
    const { getUserByPhone, createUser, getOrCreateSession } = require('./db/users');
    const processarFluxo = require('./suitability/fluxo');
    const tenantId = process.env.TENANT_ID_DEFAULT;
    let user = await getUserByPhone(tenantId, phone);
    if (!user) user = await createUser(tenantId, phone);
    const session = await getOrCreateSession(user.id);
    const resposta = await processarFluxo(user, session, mensagem);
    res.json({ resposta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Payroll rodando!' });
});

// ─── ADMIN: Login ───────────────────────────────────────────────────────────
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { pool } = require('./db/index');

    const { rows } = await pool.query(
      `SELECT * FROM admin_users WHERE email = $1 AND active = true`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const admin = rows[0];

    // Por ora compara direto (sem bcrypt ainda, igual ao fluxo atual)
    if (admin.password_hash !== password) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera token simples UUID
    const crypto = require('crypto');
    const token = crypto.randomUUID();

    // Salva token no banco com expiração de 7 dias
    await pool.query(
      `UPDATE admin_users SET session_token = $1, token_expires_at = NOW() + INTERVAL '7 days' WHERE id = $2`,
      [token, admin.id]
    );

    res.json({ ok: true, token, name: admin.name, role: admin.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Logout ──────────────────────────────────────────────────────────
app.post('/admin/logout', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    if (token) {
      const { pool } = require('./db/index');
      await pool.query(
        `UPDATE admin_users SET session_token = NULL, token_expires_at = NULL WHERE session_token = $1`,
        [token]
      );
    }
    res.json({ ok: true });
  } catch (error) {
    res.json({ ok: true });
  }
});

// ─── ADMIN: Verificar token ─────────────────────────────────────────────────
app.get('/admin/verify', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    if (!token) return res.status(401).json({ error: 'Sem token' });

    const { pool } = require('./db/index');
    const { rows } = await pool.query(
      `SELECT id, name, email, role FROM admin_users 
       WHERE session_token = $1 AND token_expires_at > NOW() AND active = true`,
      [token]
    );

    if (rows.length === 0) return res.status(401).json({ error: 'Token inválido' });
    res.json({ ok: true, admin: rows[0] });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Listar admins ────────────────────────────────────────────────────
app.get('/admin/admins', async (req, res) => {
  try {
    const { pool } = require('./db/index');
    const { rows } = await pool.query(
      `SELECT id, name, email, role, active, created_at FROM admin_users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Criar novo admin ─────────────────────────────────────────────────
app.post('/admin/admins', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { pool } = require('./db/index');

    const existing = await pool.query(`SELECT id FROM admin_users WHERE email = $1`, [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const { rows } = await pool.query(
      `INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, password, role || 'admin']
    );

    res.json({ ok: true, admin: rows[0] });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Stats ────────────────────────────────────────────────────────────
app.get('/admin/stats', async (req, res) => {
  try {
    const { pool } = require('./db/index');

    const [usuarios, mensagens, perfis, novosHoje, novosSemana, planos] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM messages'),
      pool.query(`SELECT perfil, COUNT(*) as total FROM investor_profiles GROUP BY perfil`),
      pool.query(`SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '1 day'`),
      pool.query(`SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'`),
      pool.query(`SELECT plan, COUNT(*) as total FROM tenants GROUP BY plan`),
    ]);

    // MRR calculado pelos planos
    const planValues = { free: 0, pro: 12.9, business: 29.9 };
    let mrr = 0;
    planos.rows.forEach(p => {
      mrr += (planValues[p.plan] || 0) * parseInt(p.total);
    });

    // Onboarding completo
    const onboarding = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE onboarding_complete = true) as completos,
        COUNT(*) as total
      FROM users
    `);

    // Novos por dia nos últimos 7 dias (para gráfico)
    const crescimento = await pool.query(`
      SELECT DATE(created_at) as dia, COUNT(*) as total
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY dia ASC
    `);

    res.json({
      totalUsuarios: parseInt(usuarios.rows[0].count),
      totalMensagens: parseInt(mensagens.rows[0].count),
      novosHoje: parseInt(novosHoje.rows[0].count),
      novosSemana: parseInt(novosSemana.rows[0].count),
      perfis: perfis.rows,
      mrr: mrr.toFixed(2),
      onboardingCompletos: parseInt(onboarding.rows[0].completos),
      onboardingTotal: parseInt(onboarding.rows[0].total),
      crescimento: crescimento.rows,
      planos: planos.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Clientes ─────────────────────────────────────────────────────────
app.get('/admin/clientes', async (req, res) => {
  try {
    const { pool } = require('./db/index');
    const { rows } = await pool.query(`
      SELECT u.id, u.phone, u.name, u.onboarding_complete, u.created_at,
             ip.perfil, ip.pontuacao
      FROM users u
      LEFT JOIN investor_profiles ip ON ip.user_id = u.id
      ORDER BY u.created_at DESC
      LIMIT 50
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});