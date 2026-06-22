require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// ─── Trust proxy ─────────────────────────────────────────────────────────────
// OBRIGATÓRIO no Railway: sem isto o rate-limit lê o IP do proxy (não o do
// usuário) e ou bloqueia todo mundo junto, ou solta erro de validação.
app.set('trust proxy', 1);

// ─── Helmet — headers HTTP de segurança ──────────────────────────────────────
app.use(helmet());

// ─── CORS restrito ───────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://payrollia.com.br',
  'https://www.payrollia.com.br',
  'https://payrollia.vercel.app',
];
// Em desenvolvimento, libera localhost
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
}
app.use(cors({
  origin: (origin, callback) => {
    // Requests sem origin (webhooks server-to-server, curl, health checks) passam
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true,
}));

// express.json com captura do corpo bruto (necessário pro HMAC dos webhooks)
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));

// ─── Rate limiting ───────────────────────────────────────────────────────────
// Geral: protege endpoints públicos. Pula /webhook e /admin (têm os seus).
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Aguarde alguns minutos.' },
  skip: (req) => req.path.startsWith('/webhook') || req.path.startsWith('/admin'),
});

// Webhook: permissivo — Meta e AbacatePay podem disparar rajadas legítimas.
const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin: moderado — protege o painel sem atrapalhar o dashboard.
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Aguarde alguns minutos.' },
});

// Login: guarda inicial por IP contra brute force. O lockout por CONTA
// (failed_attempts/locked_until) é a segunda camada, dentro do handler de login.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Aguarde 15 minutos.' },
});

app.use(generalLimiter);
app.use('/webhook', webhookLimiter);
app.use('/admin', adminLimiter);
app.use('/admin/login', loginLimiter);

// ─── Autenticação admin ──────────────────────────────────────────────────────
// Exige x-admin-token válido em TODAS as rotas /admin, menos o login.
// Quem chamar o backend direto, sem token, leva 401.
function requireAdmin(req, res, next) {
  // Libera o login (precisa ficar aberto) e qualquer rota fora de /admin
  if (!req.path.startsWith('/admin') || req.path === '/admin/login') {
    return next();
  }

  const token = req.headers['x-admin-token'];
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado — token ausente.' });
  }

  const { pool } = require('./db/index');
  pool.query(
    `SELECT id, name, email, role FROM admin_users
     WHERE session_token = $1 AND token_expires_at > NOW() AND active = true`,
    [token]
  )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
      }
      req.admin = rows[0]; // disponível nas rotas, se precisar
      next();
    })
    .catch((err) => {
      console.error('[requireAdmin]', err.message);
      res.status(500).json({ error: 'Erro de autenticação.' });
    });
}
app.use(requireAdmin);

// ─── Rotas de webhook — WhatsApp e AbacatePay ────────────────────────────────
app.use('/webhook', require('./webhook/whatsapp'));
app.use('/webhook/abacatepay', require('./webhook/abacatepay'));

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

// ─── ADMIN: Login (com brute force lockout por conta) ────────────────────────
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { pool } = require('./db/index');

    // Política de lockout
    const MAX_ATTEMPTS = 5;   // tentativas antes de travar
    const LOCK_MINUTES = 15;  // duração do bloqueio

    // Mensagem genérica — não revela se o e-mail existe (anti-enumeração)
    const credenciaisInvalidas = () =>
      res.status(401).json({ error: 'Credenciais inválidas' });

    const { rows } = await pool.query(
      `SELECT * FROM admin_users WHERE email = $1 AND active = true`,
      [email]
    );

    if (rows.length === 0) {
      return credenciaisInvalidas();
    }

    const admin = rows[0];

    // 1) Conta travada? Recusa SEM nem checar a senha.
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      const restanteMin = Math.max(
        1,
        Math.ceil((new Date(admin.locked_until) - new Date()) / 60000)
      );
      console.warn(`[admin] Login bloqueado para ${admin.email} — ${restanteMin} min restantes`);
      return res.status(429).json({
        error: `Muitas tentativas de login. Tente novamente em ${restanteMin} minuto(s).`,
      });
    }

    // 2) Verifica a senha. Suporta migração automática de texto puro -> bcrypt.
    const stored = admin.password_hash || '';
    let senhaOk = false;

    if (stored.startsWith('$2')) {
      // Já é hash bcrypt
      senhaOk = await bcrypt.compare(password, stored);
    } else {
      // Senha legada em texto puro — compara direto e, se bater, migra pra bcrypt
      senhaOk = stored === password;
      if (senhaOk) {
        const novoHash = await bcrypt.hash(password, 12);
        await pool.query(
          `UPDATE admin_users SET password_hash = $1 WHERE id = $2`,
          [novoHash, admin.id]
        );
        console.log(`[admin] Senha de ${admin.email} migrada para bcrypt`);
      }
    }

    // 3) Senha errada -> incrementa o contador e trava ao atingir o limite
    if (!senhaOk) {
      const novasTentativas = (admin.failed_attempts || 0) + 1;

      if (novasTentativas >= MAX_ATTEMPTS) {
        await pool.query(
          `UPDATE admin_users
           SET failed_attempts = 0,
               locked_until = NOW() + ($1 * INTERVAL '1 minute')
           WHERE id = $2`,
          [LOCK_MINUTES, admin.id]
        );
        console.warn(`[admin] Conta ${admin.email} TRAVADA por ${LOCK_MINUTES} min (atingiu ${MAX_ATTEMPTS} tentativas)`);
        return res.status(429).json({
          error: `Muitas tentativas de login. Tente novamente em ${LOCK_MINUTES} minutos.`,
        });
      }

      await pool.query(
        `UPDATE admin_users SET failed_attempts = $1 WHERE id = $2`,
        [novasTentativas, admin.id]
      );
      console.warn(`[admin] Tentativa ${novasTentativas}/${MAX_ATTEMPTS} falhou para ${admin.email}`);
      return credenciaisInvalidas();
    }

    // 4) Sucesso -> zera contador, limpa lock e cria a sessão
    const crypto = require('crypto');
    const token = crypto.randomUUID();

    await pool.query(
      `UPDATE admin_users
       SET session_token = $1,
           token_expires_at = NOW() + INTERVAL '7 days',
           failed_attempts = 0,
           locked_until = NULL
       WHERE id = $2`,
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

    const senhaHash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, senhaHash, role || 'admin']
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
      pool.query(`SELECT plano, COUNT(*) as total FROM users GROUP BY plano`),
    ]);

    const planValues = { free: 0, pro: 12.9, business: 29.9 };
    let mrr = 0;
    planos.rows.forEach(p => {
      mrr += (planValues[p.plano] || 0) * parseInt(p.total);
    });

    const onboarding = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE onboarding_complete = true) as completos,
        COUNT(*) as total
      FROM users
    `);

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
             u.plano, u.plano_status, u.plano_atualizado_em, u.perguntas_usadas,
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

// ─── ADMIN: Cupons — Listar ──────────────────────────────────────────────────
app.get('/admin/cupons', async (req, res) => {
  try {
    const response = await fetch('https://api.abacatepay.com/v2/coupons/list?limit=100', {
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(500).json({ erro: 'Erro ao listar cupons', detalhe: data });
    }

    res.json(data.data || []);
  } catch (error) {
    console.error('[Cupons] Erro ao listar:', error.message);
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Cupons — Criar ───────────────────────────────────────────────────
app.post('/admin/cupons', async (req, res) => {
  try {
    const { code, discount, maxRedeems, notes } = req.body;

    if (!code || !discount) {
      return res.status(400).json({ erro: 'Código e desconto são obrigatórios' });
    }

    const body = {
      code: code.toUpperCase().trim(),
      discountKind: 'PERCENTAGE',
      discount: parseFloat(discount),
      maxRedeems: maxRedeems ? parseInt(maxRedeems) : -1,
      notes: notes || '',
    };

    const response = await fetch('https://api.abacatepay.com/v2/coupons/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(400).json({ erro: 'Erro ao criar cupom', detalhe: data });
    }

    console.log(`[Cupons] Cupom criado: ${body.code} — ${body.discount}%`);
    res.json({ ok: true, cupom: data.data });
  } catch (error) {
    console.error('[Cupons] Erro ao criar:', error.message);
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Cupons — Alternar status (ativar/desativar) ──────────────────────
app.patch('/admin/cupons/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`https://api.abacatepay.com/v2/coupons/toggle/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(400).json({ erro: 'Erro ao alternar status', detalhe: data });
    }

    res.json({ ok: true, cupom: data.data });
  } catch (error) {
    console.error('[Cupons] Erro ao alternar:', error.message);
    res.status(500).json({ erro: error.message });
  }
});

// ─── ADMIN: Cupons — Deletar ─────────────────────────────────────────────────
app.delete('/admin/cupons/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`https://api.abacatepay.com/v2/coupons/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(400).json({ erro: 'Erro ao deletar cupom', detalhe: data });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('[Cupons] Erro ao deletar:', error.message);
    res.status(500).json({ erro: error.message });
  }
});

// ─── Rotas administrativas de CRUD de clientes ───────────────────────────────

// ── Helper: grava/atualiza o perfil na tabela investor_profiles ──────────────
async function upsertPerfil(pool, userId, perfil) {
  if (!perfil) return;
  const existing = await pool.query('SELECT id FROM investor_profiles WHERE user_id = $1', [userId]);
  if (existing.rows.length > 0) {
    await pool.query(
      'UPDATE investor_profiles SET perfil = $1 WHERE user_id = $2',
      [perfil, userId]
    );
  } else {
    await pool.query(
      'INSERT INTO investor_profiles (user_id, perfil, created_at) VALUES ($1, $2, NOW())',
      [userId, perfil]
    );
  }
}

// ── POST /admin/clientes — criar usuário manualmente
app.post('/admin/clientes', async (req, res) => {
  const { pool } = require('./db/index');
  const { name, phone, perfil, plano = 'free' } = req.body;
  if (!phone) return res.status(400).json({ erro: 'Telefone é obrigatório.' });

  // Formata telefone (remove não numéricos)
  const phoneClean = phone.replace(/\D/g, '');

  try {
    const existing = await pool.query('SELECT id FROM users WHERE phone = $1 AND tenant_id = $2', [phoneClean, process.env.TENANT_ID_DEFAULT]);
    if (existing.rows.length > 0) return res.status(409).json({ erro: 'Usuário com esse telefone já existe.' });

    // Cria o usuário (SEM perfil — perfil mora em investor_profiles)
    const result = await pool.query(
      `INSERT INTO users (phone, name, plano, plano_status, onboarding_complete, tenant_id, created_at)
       VALUES ($1, $2, $3, 'active', $4, $5, NOW())
       RETURNING *`,
      [phoneClean, name || null, plano, !!perfil, process.env.TENANT_ID_DEFAULT]
    );

    const novoUser = result.rows[0];

    // Se veio um perfil, grava em investor_profiles
    await upsertPerfil(pool, novoUser.id, perfil);

    // Devolve já com o perfil junto (mesmo formato da listagem)
    res.json({ ...novoUser, perfil: perfil || null });
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    res.status(500).json({ erro: 'Erro interno ao criar cliente.' });
  }
});

// ── PUT /admin/clientes/:id — editar usuário
app.put('/admin/clientes/:id', async (req, res) => {
  const { pool, redisClient } = require('./db/index');
  const { id } = req.params;
  const { name, phone, perfil, plano, plano_status, onboarding_complete } = req.body;

  try {
    const fields = [];
    const values = [];
    let idx = 1;

    // Apenas colunas que existem em users (perfil NÃO entra aqui)
    if (name !== undefined)               { fields.push(`name = $${idx++}`);               values.push(name); }
    if (phone !== undefined)              { fields.push(`phone = $${idx++}`);              values.push(phone.replace(/\D/g, '')); }
    if (plano !== undefined)              { fields.push(`plano = $${idx++}`);              values.push(plano); }
    if (plano_status !== undefined)       { fields.push(`plano_status = $${idx++}`);       values.push(plano_status); }
    if (onboarding_complete !== undefined){ fields.push(`onboarding_complete = $${idx++}`); values.push(!!onboarding_complete); }

    let userRow;

    if (fields.length > 0) {
      values.push(id);
      const result = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
      userRow = result.rows[0];
    } else {
      // Nenhum campo de users mudou — busca o usuário atual
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
      userRow = result.rows[0];
    }

    // Atualiza o perfil em investor_profiles, se informado
    if (perfil !== undefined) {
      await upsertPerfil(pool, id, perfil || null);
    }

    // Invalida cache Redis
    const cacheKey = `user:${process.env.TENANT_ID_DEFAULT}:${userRow.phone}`;
    if (redisClient) await redisClient.del(cacheKey);

    res.json({ ...userRow, perfil: perfil !== undefined ? perfil : undefined });
  } catch (err) {
    console.error('Erro ao editar cliente:', err);
    res.status(500).json({ erro: 'Erro interno ao editar cliente.' });
  }
});

// ── DELETE /admin/clientes/:id — excluir usuário
app.delete('/admin/clientes/:id', async (req, res) => {
  const { pool, redisClient } = require('./db/index');
  const { id } = req.params;
  try {
    // Busca o usuário antes de deletar (para invalidar cache)
    const user = await pool.query('SELECT phone FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    // Deleta em cascata (sessions, investor_profiles, messages, referrals via CASCADE no schema)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    // Invalida cache Redis
    const cacheKey = `user:${process.env.TENANT_ID_DEFAULT}:${user.rows[0].phone}`;
    if (redisClient) await redisClient.del(cacheKey);

    res.json({ ok: true, mensagem: 'Usuário removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    res.status(500).json({ erro: 'Erro interno ao deletar cliente.' });
  }
});

// ── PATCH /admin/clientes/:id/reset-perguntas — zera contador de perguntas
app.patch('/admin/clientes/:id/reset-perguntas', async (req, res) => {
  const { pool, redisClient } = require('./db/index');
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE users SET perguntas_usadas = 0 WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const cacheKey = `user:${process.env.TENANT_ID_DEFAULT}:${result.rows[0].phone}`;
    if (redisClient) await redisClient.del(cacheKey);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// ── PATCH /admin/clientes/:id/plano — altera plano manualmente
app.patch('/admin/clientes/:id/plano', async (req, res) => {
  const { pool, redisClient } = require('./db/index');
  const { id } = req.params;
  const { plano } = req.body;
  if (!['free', 'pro', 'business'].includes(plano)) return res.status(400).json({ erro: 'Plano inválido.' });

  try {
    const result = await pool.query(
      `UPDATE users SET plano = $1, plano_status = 'active', plano_atualizado_em = NOW() WHERE id = $2 RETURNING *`,
      [plano, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const cacheKey = `user:${process.env.TENANT_ID_DEFAULT}:${result.rows[0].phone}`;
    if (redisClient) await redisClient.del(cacheKey);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});