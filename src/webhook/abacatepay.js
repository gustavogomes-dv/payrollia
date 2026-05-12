    // src/webhook/abacatepay.js
// Recebe eventos de assinatura do AbacatePay e atualiza o plano do usuário

const express = require('express');
const router = express.Router();
const { pool } = require('../db/index');

const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET || 'payroll_abacate_secret_2024';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ─── Validar assinatura do webhook ────────────────────────────────────────────
function validarAssinatura(req) {
  // A AbacatePay envia o secret no header x-webhook-secret
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

// ─── Buscar usuário pelo telefone salvo nos metadata ──────────────────────────
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
  // Responde 200 imediatamente para a AbacatePay não reenviar o evento
  res.sendStatus(200);

  try {
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

    console.log(`[AbacatePay] Evento recebido: ${event}`);
      
    console.log(`[AbacatePay] Payload completo:`, JSON.stringify(req.body, null, 2));

    // Extrai telefone do metadata (salvo no momento da criação do link)
    const phone = data?.metadata?.phone || data?.customer?.cellphone;
    const plano = data?.metadata?.plano;

    if (!phone) {
      console.warn('[AbacatePay] Telefone não encontrado no payload:', data);
      return;
    }

    // Busca o usuário no banco
    const user = await buscarUsuarioPorPhone(phone);

    if (!user) {
      console.warn(`[AbacatePay] Usuário não encontrado para o telefone ${phone}`);
      return;
    }

    // ── Processa cada tipo de evento ────────────────────────────────────────────

    if (event === 'subscription.completed') {
      // Pagamento confirmado — ativa o plano
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

    if (event === 'subscription.renewed') {
      // Renovação mensal — mantém o plano ativo e zera o contador
      await atualizarPlano(user.id, plano || user.plano || 'pro', 'active');

      await enviarWhatsApp(
        phone,
        `🔄 *Assinatura renovada!*\n\nSeu plano foi renovado com sucesso. Continue aprendendo sobre investimentos! 😊`
      );
      return;
    }

    if (event === 'subscription.cancelled') {
      // Cancelamento — rebaixa para Free
      await atualizarPlano(user.id, 'free', 'cancelled');

      await enviarWhatsApp(
        phone,
        `😔 *Assinatura cancelada.*\n\nSeu plano foi cancelado. Você voltou para o plano *Gratuito* (${3} perguntas/mês).\n\nQualquer hora que quiser reativar, é só me chamar aqui! 💚`
      );
      return;
    }

    if (event === 'subscription.payment_failed') {
      // Pagamento falhou — marca como inadimplente mas não cancela ainda
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

    console.log(`[AbacatePay] Evento "${event}" não tratado — ignorado`);

  } catch (err) {
    console.error('[AbacatePay] Erro ao processar webhook:', err.message);
  }
});

module.exports = router;