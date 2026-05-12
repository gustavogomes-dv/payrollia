// src/webhook/abacatepay.js
// Recebe eventos de pagamento do AbacatePay e atualiza o plano do usuário

const express = require('express');
const router = express.Router();
const { pool } = require('../db/index');

const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET || 'payroll_abacate_secret_2024';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ─── Validar assinatura do webhook ────────────────────────────────────────────
function validarAssinatura(req) {
  const secret = req.headers['x-webhook-secret'];
  return secret === WEBHOOK_SECRET;
}

// ─── Enviar mensagem via WhatsApp ─────────────────────────────────────────────
async function enviarWhatsApp(telefone, mensagem) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: telefone,
          type: 'text',
          text: { body: mensagem },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('[AbacatePay] Erro ao enviar WhatsApp:', data);
    } else {
      console.log(`[AbacatePay] Mensagem enviada para ${telefone}`);
    }
  } catch (err) {
    console.error('[AbacatePay] Exceção ao enviar WhatsApp:', err.message);
  }
}

// ─── Buscar usuário pelo telefone ─────────────────────────────────────────────
async function buscarUsuarioPorPhone(phone) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE phone = $1 LIMIT 1`,
    [phone]
  );
  return rows[0] || null;
}

// ─── Atualizar plano do usuário ───────────────────────────────────────────────
async function atualizarPlano(userId, plano, status) {
  await pool.query(
    `UPDATE users
     SET plano = $1,
         plano_status = $2,
         plano_atualizado_em = NOW(),
         perguntas_usadas = 0
     WHERE id = $3`,
    [plano, status, userId]
  );
  console.log(`[AbacatePay] Usuário ${userId} → plano ${plano} (${status})`);
}

// ─── Endpoint POST /webhook/abacatepay ────────────────────────────────────────
router.post('/', async (req, res) => {
  // Responde 200 imediatamente para o AbacatePay não reenviar o evento
  res.sendStatus(200);

  try {
    // Log completo para debug
    console.log(`[AbacatePay] ⚡ Evento recebido: "${req.body?.event}"`);
    console.log(`[AbacatePay] Payload:`, JSON.stringify(req.body, null, 2));

    // Valida o secret
    if (!validarAssinatura(req)) {
      console.warn('[AbacatePay] Assinatura inválida — requisição ignorada');
      return;
    }

    const { event, data } = req.body;

    if (!event || !data) {
      console.warn('[AbacatePay] Payload inválido:', req.body);
      return;
    }

    // ── checkout.completed — pagamento ONE_TIME confirmado ───────────────────
    if (event === 'checkout.completed') {
      const phone = data?.checkout?.metadata?.phone;
      const plano = data?.checkout?.metadata?.plano;

      if (!phone) {
        console.warn('[AbacatePay] Telefone não encontrado no metadata:', data);
        return;
      }

      const user = await buscarUsuarioPorPhone(phone);

      if (!user) {
        console.warn(`[AbacatePay] Usuário não encontrado para o telefone ${phone}`);
        return;
      }

      await atualizarPlano(user.id, plano || 'pro', 'active');

      // Volta a sessão para 'concluido' para o usuário poder usar o bot normalmente
      await pool.query(
        `UPDATE sessions SET step = 'concluido', context = '{}' WHERE user_id = $1`,
        [user.id]
      );

      const nomeExibicao = plano === 'business' ? 'Business' : 'Pro';
      await enviarWhatsApp(
        phone,
        `✅ *Pagamento confirmado!*\n\nSeu plano *${nomeExibicao}* está ativo agora! 🎉\n\nPode continuar perguntando sobre investimentos sem limites. Aproveite! 😊`
      );
      return;
    }

    // ── subscription.completed — assinatura recorrente confirmada ────────────
    if (event === 'subscription.completed') {
      const phone = data?.metadata?.phone;
      const plano = data?.metadata?.plano;

      if (!phone) {
        console.warn('[AbacatePay] Telefone não encontrado no metadata:', data);
        return;
      }

      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;

      await atualizarPlano(user.id, plano || 'pro', 'active');

      await pool.query(
        `UPDATE sessions SET step = 'concluido', context = '{}' WHERE user_id = $1`,
        [user.id]
      );

      const nomeExibicao = plano === 'business' ? 'Business' : 'Pro';
      await enviarWhatsApp(
        phone,
        `✅ *Pagamento confirmado!*\n\nSeu plano *${nomeExibicao}* está ativo agora! 🎉\n\nPode continuar perguntando sobre investimentos sem limites. Aproveite! 😊`
      );
      return;
    }

    // ── subscription.renewed — renovação mensal ───────────────────────────────
    if (event === 'subscription.renewed') {
      const phone = data?.metadata?.phone;

      if (!phone) return;

      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;

      await atualizarPlano(user.id, user.plano || 'pro', 'active');

      await enviarWhatsApp(
        phone,
        `🔄 *Assinatura renovada!*\n\nSeu plano foi renovado com sucesso. Continue aprendendo sobre investimentos! 😊`
      );
      return;
    }

    // ── subscription.cancelled — cancelamento ─────────────────────────────────
    if (event === 'subscription.cancelled') {
      const phone = data?.metadata?.phone;

      if (!phone) return;

      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;

      await atualizarPlano(user.id, 'free', 'cancelled');

      await enviarWhatsApp(
        phone,
        `😔 *Assinatura cancelada.*\n\nSeu plano foi cancelado e você voltou para o plano *Gratuito* (${3} perguntas/mês).\n\nQualquer hora que quiser reativar, é só me chamar aqui! 💚`
      );
      return;
    }

    // ── subscription.payment_failed — pagamento falhou ────────────────────────
    if (event === 'subscription.payment_failed') {
      const phone = data?.metadata?.phone;

      if (!phone) return;

      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;

      await pool.query(
        `UPDATE users SET plano_status = 'payment_failed' WHERE id = $1`,
        [user.id]
      );

      await enviarWhatsApp(
        phone,
        `⚠️ *Pagamento não processado.*\n\nTivemos um problema com o pagamento da sua assinatura. Por favor, verifique seus dados de pagamento para não perder o acesso. 🙏`
      );
      return;
    }

    // ── checkout.refunded — reembolso ─────────────────────────────────────────
    if (event === 'checkout.refunded') {
      const phone = data?.metadata?.phone;

      if (!phone) return;

      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;

      await atualizarPlano(user.id, 'free', 'refunded');

      await enviarWhatsApp(
        phone,
        `↩️ *Reembolso processado.*\n\nSeu pagamento foi estornado e você voltou para o plano *Gratuito*.\n\nSe tiver dúvidas, entre em contato com o suporte. 🙏`
      );
      return;
    }

    console.log(`[AbacatePay] Evento "${event}" não tratado — ignorado`);

  } catch (err) {
    console.error('[AbacatePay] Erro ao processar webhook:', err.message);
  }
});

module.exports = router;