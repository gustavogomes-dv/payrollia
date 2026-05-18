// src/webhook/abacatepay.js
const express = require('express');
const router = express.Router();
const { pool, redisClient } = require('../db/index');
const { getReferralByCode, incrementReferralUse } = require('../db/referrals');

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

// ─── Atualizar plano e invalidar cache Redis ──────────────────────────────────
async function atualizarPlano(userId, tenantId, phone, plano, status) {
  await pool.query(
    `UPDATE users
     SET plano = $1,
         plano_status = $2,
         plano_atualizado_em = NOW(),
         perguntas_usadas = 0
     WHERE id = $3`,
    [plano, status, userId]
  );

  try {
    await redisClient.del(`user:${tenantId}:${phone}`);
    console.log(`[AbacatePay] Cache Redis invalidado para ${phone}`);
  } catch (err) {
    console.warn('[AbacatePay] Erro ao invalidar cache Redis:', err.message);
  }

  console.log(`[AbacatePay] Usuário ${userId} → plano ${plano} (${status})`);
}

// ─── Recompensar indicador com cupom de 50% ───────────────────────────────────
async function recompensarIndicador(referralCode) {
  try {
    const referral = await getReferralByCode(referralCode);
    if (!referral) return;

    // Incrementa uso do código
    await incrementReferralUse(referralCode);

    // Cria cupom de recompensa de 50% na AbacatePay
    const code = `RECOMP-${referralCode}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
    const response = await fetch('https://api.abacatepay.com/v2/coupons/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        discountKind: 'PERCENTAGE',
        discount: referral.reward_pct,
        maxRedeems: 1,
        notes: `Recompensa por indicação ${referralCode}`,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error('[Referral] Erro ao criar cupom de recompensa:', data);
      return;
    }

    const expira = new Date();
    expira.setDate(expira.getDate() + 30);
    const expiraStr = expira.toLocaleDateString('pt-BR');

    // Envia mensagem para o indicador
    await enviarWhatsApp(
      referral.referrer_phone,
      `🎉 *Parabéns, ${referral.referrer_name || 'amigo'}!*\n\nSeu amigo acabou de assinar o Payroll usando seu código de indicação!\n\nComo recompensa, você ganhou *${referral.reward_pct}% de desconto* na sua próxima assinatura! 🥳\n\n*Seu cupom de recompensa:* \`${code}\`\n\n⏰ Válido até *${expiraStr}*\n\nBasta usar esse código na próxima vez que for assinar ou renovar!`
    );

    console.log(`[Referral] Indicador ${referral.referrer_phone} recompensado com cupom ${code}`);
  } catch (err) {
    console.error('[Referral] Erro ao recompensar indicador:', err.message);
  }
}

// ─── Endpoint POST /webhook/abacatepay ────────────────────────────────────────
router.post('/', async (req, res) => {
  res.sendStatus(200);

  try {
    console.log(`[AbacatePay] ⚡ Evento recebido: "${req.body?.event}"`);

    if (!validarAssinatura(req)) {
      console.warn('[AbacatePay] Assinatura inválida — requisição ignorada');
      return;
    }

    const { event, data } = req.body;

    if (!event || !data) {
      console.warn('[AbacatePay] Payload inválido:', req.body);
      return;
    }

    // ── checkout.completed ───────────────────────────────────────────────────
    if (event === 'checkout.completed') {
      const phone = data?.checkout?.metadata?.phone;
      const plano = data?.checkout?.metadata?.plano;
      const referralCode = data?.checkout?.metadata?.cupom_indicacao;

      if (!phone) {
        console.warn('[AbacatePay] Telefone não encontrado no metadata:', data);
        return;
      }

      const user = await buscarUsuarioPorPhone(phone);
      if (!user) {
        console.warn(`[AbacatePay] Usuário não encontrado para ${phone}`);
        return;
      }

      await atualizarPlano(user.id, user.tenant_id, phone, plano || 'pro', 'active');

      await pool.query(
        `UPDATE sessions SET step = 'concluido', context = '{}' WHERE user_id = $1`,
        [user.id]
      );

      const nomeExibicao = plano === 'business' ? 'Business' : 'Pro';
      await enviarWhatsApp(
        phone,
        `✅ *Pagamento confirmado!*\n\nSeu plano *${nomeExibicao}* está ativo agora! 🎉\n\nPode continuar perguntando sobre investimentos sem limites. Aproveite! 😊\n\n💡 Digite *INDICAR* para ganhar descontos indicando amigos!`
      );

      // Recompensa o indicador se houver código de indicação
      if (referralCode) {
        await recompensarIndicador(referralCode);
      }

      return;
    }

    // ── subscription.completed ───────────────────────────────────────────────
    if (event === 'subscription.completed') {
      const phone = data?.checkout?.metadata?.phone || data?.metadata?.phone;
      const plano = data?.checkout?.metadata?.plano || data?.metadata?.plano;
      const referralCode = data?.checkout?.metadata?.cupom_indicacao || data?.metadata?.cupom_indicacao;

      if (!phone) return;

      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;

      await atualizarPlano(user.id, user.tenant_id, phone, plano || 'pro', 'active');

      await pool.query(
        `UPDATE sessions SET step = 'concluido', context = '{}' WHERE user_id = $1`,
        [user.id]
      );

      const nomeExibicao = plano === 'business' ? 'Business' : 'Pro';
      await enviarWhatsApp(
        phone,
        `✅ *Pagamento confirmado!*\n\nSeu plano *${nomeExibicao}* está ativo agora! 🎉\n\nPode continuar perguntando sobre investimentos sem limites. Aproveite! 😊`
      );

      if (referralCode) {
        await recompensarIndicador(referralCode);
      }

      return;
    }

    // ── subscription.renewed ────────────────────────────────────────────────
    if (event === 'subscription.renewed') {
      const phone = data?.checkout?.metadata?.phone || data?.metadata?.phone;
      if (!phone) return;
      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;
      await atualizarPlano(user.id, user.tenant_id, phone, user.plano || 'pro', 'active');
      await enviarWhatsApp(phone, `🔄 *Assinatura renovada!*\n\nSeu plano foi renovado com sucesso. Continue aprendendo sobre investimentos! 😊`);
      return;
    }

    // ── subscription.cancelled ───────────────────────────────────────────────
    if (event === 'subscription.cancelled') {
      const phone = data?.checkout?.metadata?.phone || data?.metadata?.phone;
      if (!phone) return;
      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;
      await atualizarPlano(user.id, user.tenant_id, phone, 'free', 'cancelled');
      await enviarWhatsApp(phone, `😔 *Assinatura cancelada.*\n\nSeu plano foi cancelado e você voltou para o plano *Gratuito* (3 perguntas/mês).\n\nQualquer hora que quiser reativar, é só me chamar aqui! 💚`);
      return;
    }

    // ── subscription.payment_failed ─────────────────────────────────────────
    if (event === 'subscription.payment_failed') {
      const phone = data?.checkout?.metadata?.phone || data?.metadata?.phone;
      if (!phone) return;
      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;
      await pool.query(`UPDATE users SET plano_status = 'payment_failed' WHERE id = $1`, [user.id]);
      try { await redisClient.del(`user:${user.tenant_id}:${phone}`); } catch {}
      await enviarWhatsApp(phone, `⚠️ *Pagamento não processado.*\n\nTivemos um problema com o pagamento da sua assinatura. Por favor, verifique seus dados de pagamento para não perder o acesso. 🙏`);
      return;
    }

    // ── checkout.refunded ────────────────────────────────────────────────────
    if (event === 'checkout.refunded') {
      const phone = data?.checkout?.metadata?.phone || data?.metadata?.phone;
      if (!phone) return;
      const user = await buscarUsuarioPorPhone(phone);
      if (!user) return;
      await atualizarPlano(user.id, user.tenant_id, phone, 'free', 'refunded');
      await enviarWhatsApp(phone, `↩️ *Reembolso processado.*\n\nSeu pagamento foi estornado e você voltou para o plano *Gratuito*.\n\nSe tiver dúvidas, entre em contato com o suporte. 🙏`);
      return;
    }

    console.log(`[AbacatePay] Evento "${event}" não tratado — ignorado`);

  } catch (err) {
    console.error('[AbacatePay] Erro ao processar webhook:', err.message);
  }
});

module.exports = router;