const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { getUserByPhone, createUser, getOrCreateSession } = require('../db/users');
const processarFluxo = require('../suitability/fluxo');

const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

function assinaturaValida(req) {
  if (!APP_SECRET) {
    console.warn('[WhatsApp] ⚠️ WHATSAPP_APP_SECRET não configurado — validação de assinatura DESATIVADA. Adicione o App Secret no Railway para ativar.');
    return true;
  }

  const assinatura = req.headers['x-hub-signature-256'];
  if (!assinatura) {
    console.warn('[WhatsApp] Assinatura ausente no header');
    return false;
  }
  if (!req.rawBody) {
    console.warn('[WhatsApp] Corpo bruto (rawBody) ausente — não foi possível validar');
    return false;
  }

  const esperado = 'sha256=' + crypto
    .createHmac('sha256', APP_SECRET)
    .update(req.rawBody)
    .digest('hex');

  const a = Buffer.from(assinatura);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

router.get('/', (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado com sucesso!');
    return res.status(200).send(challenge);
    }

    console.warn('❌ Falha na verificação do webhook');
    res.sendStatus(403);
});

router.post('/', async (req, res) => {
    if (!assinaturaValida(req)) {
        console.warn('[WhatsApp] ❌ Assinatura inválida — requisição rejeitada');
        return res.sendStatus(403);
    }

    res.sendStatus(200);

    try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') return;

    const value = body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== 'text') {
        console.log(`Mensagem ignorada — tipo: ${message?.type || 'desconhecido'}`);
        return;
    }

    const userPhone = message.from;
    const userText = message.text.body;
    const tenantId = process.env.TENANT_ID_DEFAULT;

    console.log(`📩 Mensagem de ${userPhone}: ${userText}`);

    // Liga o "digitando…" e marca a mensagem como lida enquanto o bot processa.
    // Não bloqueia o fluxo se falhar (é só indicador visual).
    await sendTypingIndicator(message.id);

    let user = await getUserByPhone(tenantId, userPhone);
    if (!user) {
        user = await createUser(tenantId, userPhone);
    }

    let session;
    try {
        session = await getOrCreateSession(user.id);
    } catch (err) {
        console.warn('[WhatsApp] Sessão falhou (usuário possivelmente obsoleto no cache) — recriando usuário');
        user = await createUser(tenantId, userPhone);
        session = await getOrCreateSession(user.id);
    }

    const reply = await processarFluxo(user, session, userText);

    if (reply) {
        await sendWhatsAppMessage(userPhone, reply);
        console.log(`✅ Resposta enviada para ${userPhone}`);
    }

    } catch (error) {
    console.error('❌ Erro no webhook:', error.message);
    }
});

// ─── Indicador "digitando…" ────────────────────────────────────────────────
// Na Cloud API, o typing vem junto com o read receipt: uma única chamada marca
// a mensagem como lida E acende o "digitando…". O indicador some sozinho após
// ~25s ou quando a resposta é enviada — o que vier primeiro.
async function sendTypingIndicator(messageId) {
    const axios = require('axios');
    if (!messageId) return;

    try {
    await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
        typing_indicator: { type: 'text' },
        },
        {
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
        },
        }
    );
    } catch (error) {
    // Não é crítico — só um indicador visual. Loga e segue.
    console.warn('[WhatsApp] Falha ao enviar typing indicator:', error.response?.data?.error?.message || error.message);
    }
}

async function sendWhatsAppMessage(to, text) {
    const axios = require('axios');

    try {
    await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
        },
        {
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
        },
        }
    );
    } catch (error) {
    console.error('❌ Erro ao enviar mensagem WhatsApp:', error.response?.data || error.message);
    }
}

module.exports = router;