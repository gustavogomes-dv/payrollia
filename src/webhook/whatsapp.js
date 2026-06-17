const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { getUserByPhone, createUser, getOrCreateSession } = require('../db/users');
const processarFluxo = require('../suitability/fluxo');

const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

// ─── Valida a assinatura X-Hub-Signature-256 da Meta ──────────────────────────
// A Meta assina cada POST com HMAC-SHA256 do corpo bruto usando o App Secret.
function assinaturaValida(req) {
  // Enquanto o App Secret não estiver configurado, NÃO bloqueia (modo aviso).
  // Assim que WHATSAPP_APP_SECRET for adicionado no Railway, passa a exigir.
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

// Verificação do webhook pela Meta (GET — não precisa de assinatura)
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

// Recebe mensagens do WhatsApp
router.post('/', async (req, res) => {
    // Valida a assinatura ANTES de processar — rejeita requisições forjadas
    if (!assinaturaValida(req)) {
        console.warn('[WhatsApp] ❌ Assinatura inválida — requisição rejeitada');
        return res.sendStatus(403);
    }

  // Responde 200 imediatamente — a Meta exige resposta rápida
    res.sendStatus(200);

    try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') return;

    const value = body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    // Ignora se não for mensagem de texto
    if (!message || message.type !== 'text') {
        console.log(`Mensagem ignorada — tipo: ${message?.type || 'desconhecido'}`);
        return;
    }

    const userPhone = message.from;
    const userText = message.text.body;
    const tenantId = process.env.TENANT_ID_DEFAULT;

    console.log(`📩 Mensagem de ${userPhone}: ${userText}`);

    // Busca ou cria o usuário
    let user = await getUserByPhone(tenantId, userPhone);
    if (!user) {
        user = await createUser(tenantId, userPhone);
    }

    // Busca sessão — com auto-recuperação caso o usuário do cache esteja obsoleto
    let session;
    try {
        session = await getOrCreateSession(user.id);
    } catch (err) {
        console.warn('[WhatsApp] Sessão falhou (usuário possivelmente obsoleto no cache) — recriando usuário');
        user = await createUser(tenantId, userPhone);
        session = await getOrCreateSession(user.id);
    }

    // Tudo passa pelo fluxo — ele decide se é suitability ou IA
    const reply = await processarFluxo(user, session, userText);

    if (reply) {
        await sendWhatsAppMessage(userPhone, reply);
        console.log(`✅ Resposta enviada para ${userPhone}`);
    }

    } catch (error) {
    console.error('❌ Erro no webhook:', error.message);
    }
});

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