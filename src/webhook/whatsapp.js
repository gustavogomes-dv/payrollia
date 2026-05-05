const express = require('express');
const router = express.Router();
const { getUserByPhone, createUser, getOrCreateSession } = require('../db/users');
const processarFluxo = require('../suitability/fluxo');

// Verificação do webhook pela Meta
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

    // Busca sessão
    const session = await getOrCreateSession(user.id);

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