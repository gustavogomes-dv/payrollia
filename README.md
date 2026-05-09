# 🤖 Payroll — Assistente de Investimentos via WhatsApp

> Chatbot educacional de investimentos integrado ao WhatsApp, com análise de perfil de investidor (Suitability CVM), motor de IA e arquitetura SaaS multi-tenant.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=flat-square&logo=railway&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=flat-square&logo=vercel&logoColor=white)

-----

## ✨ Funcionalidades

- 💬 **Chatbot WhatsApp** — responde mensagens via Meta Cloud API em tempo real
- 📊 **Suitability CVM** — questionário de 8 perguntas para calcular o perfil do investidor
- 🤖 **IA com Claude** — respostas personalizadas baseadas no perfil do usuário (Anthropic)
- 📈 **Cotações em tempo real** — integração com Brapi para dados da B3
- 💳 **Sistema de billing** — planos Free, Pro e Business com pagamento via Pix (AbacatePay)
- 🔒 **Multi-tenant** — arquitetura preparada para múltiplos clientes
- 🖥️ **Painel Admin** — dashboard com métricas, MRR, funil de onboarding e gestão de clientes

-----

## 🏗️ Stack Técnica

|Camada          |Tecnologia          |
|----------------|--------------------|
|Backend         |Node.js + Express   |
|Frontend (Admin)|Next.js 14          |
|Banco de Dados  |PostgreSQL 15       |
|Cache           |Redis 7             |
|IA              |Anthropic Claude API|
|WhatsApp        |Meta Cloud API      |
|Billing         |AbacatePay (Pix)    |
|Cotações        |Brapi (B3)          |
|Deploy Backend  |Railway             |
|Deploy Frontend |Vercel              |

-----

## 📁 Estrutura do Projeto

```
Payroll/
├── src/                          # Backend Express
│   ├── server.js                 # Entry point + rotas admin
│   ├── ai/
│   │   └── claude.js             # Motor de IA (Anthropic)
│   ├── db/
│   │   ├── index.js              # Conexão PostgreSQL + Redis
│   │   └── users.js              # Funções de banco de dados
│   ├── services/
│   │   └── market.js             # Cotações via Brapi
│   ├── suitability/
│   │   ├── fluxo.js              # Lógica do fluxo de conversa
│   │   ├── perguntas.js          # Perguntas do questionário
│   │   └── calcularPerfil.js     # Cálculo do perfil de investidor
│   └── webhook/
│       ├── whatsapp.js           # Recebe mensagens da Meta
│       └── abacatepay.js         # Recebe eventos de pagamento
│
├── admin/                        # Painel Next.js
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── home/page.tsx
│   │   ├── dashboard/
│   │   ├── clientes/
│   │   ├── bot/
│   │   ├── billing/
│   │   └── config/
│   ├── components/
│   │   └── Sidebar.tsx
│   └── lib/
│       └── api.ts
│
└── docker-compose.yml            # Banco local para desenvolvimento
```

-----

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Docker Desktop
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/gustavoinput01/payrollia.git
cd payrollia
```

### 2. Suba o banco de dados local

```bash
docker-compose up -d
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` dentro de `src/`:

```env
PORT=3000
ANTHROPIC_API_KEY=sk-ant-...
WHATSAPP_TOKEN=seu_token_meta
WHATSAPP_PHONE_ID=seu_phone_id
WHATSAPP_VERIFY_TOKEN=payroll_webhook_secret_2024
BRAPI_TOKEN=seu_token_brapi
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payroll
REDIS_URL=redis://localhost:6379
TENANT_ID_DEFAULT=00000000-0000-0000-0000-000000000001
NODE_ENV=development
ABACATEPAY_API_KEY=abc_prod_...
```

### 4. Instale as dependências e rode o backend

```bash
cd src
npm install
npm run dev
```

### 5. Rode o painel admin

```bash
cd admin
npm install
npm run dev -- --port 3001
```

O backend estará em `http://localhost:3000` e o painel em `http://localhost:3001`.

-----

## 🌐 Deploy em Produção

|Serviço     |URL                                        |
|------------|-------------------------------------------|
|Backend     |https://payrollia-production.up.railway.app|
|Painel Admin|https://payrollia.com.br                   |

O deploy é automático a cada `git push` — Railway para o backend e Vercel para o painel.

-----

## 💬 Fluxo do Bot

```
Usuário envia mensagem
        ↓
Boas-vindas → coleta nome
        ↓
Aceita disclaimer CVM
        ↓
Questionário Suitability (8 perguntas)
        ↓
Perfil calculado (Conservador / Moderado / Arrojado)
        ↓
Chat livre com IA personalizada pelo perfil
        ↓
[Plano Free] Após 3 perguntas → oferta de upgrade
        ↓
Escolhe plano → cupom (opcional) → link Pix AbacatePay
        ↓
Pagamento confirmado → plano ativado automaticamente
```

-----

## 💰 Planos

|Plano   |Preço      |Perguntas          |
|--------|-----------|-------------------|
|Free    |Grátis     |3/mês              |
|Pro     |R$12,90/mês|Ilimitadas         |
|Business|R$29,90/mês|Ilimitadas + extras|

-----

## 📊 Painel Administrativo

- **Home** — métricas gerais, MRR, novos usuários
- **Clientes** — listagem com perfil e status de onboarding
- **Bot & IA** — configurações do assistente
- **Billing** — planos e receita
- **Config** — configurações gerais

-----

## 🔐 Variáveis de Ambiente (Railway)

|Variável               |Descrição                                   |
|-----------------------|--------------------------------------------|
|`ANTHROPIC_API_KEY`    |Chave da API da Anthropic (Claude)          |
|`WHATSAPP_TOKEN`       |Token de acesso Meta (expira periodicamente)|
|`WHATSAPP_PHONE_ID`    |ID do número WhatsApp Business              |
|`WHATSAPP_VERIFY_TOKEN`|Token de verificação do webhook             |
|`DATABASE_URL`         |URL do PostgreSQL                           |
|`REDIS_URL`            |URL do Redis                                |
|`ABACATEPAY_API_KEY`   |Chave da API AbacatePay v2                  |
|`TENANT_ID_DEFAULT`    |UUID do tenant padrão                       |
|`BRAPI_TOKEN`          |Token da API Brapi (cotações B3)            |

-----

## 🏢 Empresa

**Payroll Chatbot Inova Simples (I.S.)**
CNPJ: 66.618.119/0001-30
Número do bot: (35) 91014-8222

-----

## 📄 Licença

Projeto privado — todos os direitos reservados.