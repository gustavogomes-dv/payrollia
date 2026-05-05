
Payroll é um chatbot educacional de investimentos que funciona direto no WhatsApp. O usuário responde um questionário de perfil de investidor baseado nas diretrizes da CVM, e a partir daí tem acesso a um assistente de IA personalizado para o seu perfil — seja conservador, moderado ou arrojado.
O projeto é construído como um SaaS multi-tenant, o que significa que a estrutura suporta múltiplas empresas ou assessores usando a plataforma com bases de dados separadas.

O que faz

Aplica o questionário de suitability completo (8 perguntas) via WhatsApp
Calcula o perfil do investidor com base nas respostas
Responde perguntas de educação financeira adaptadas ao perfil do usuário
Consulta cotações de ações e FIIs em tempo real via Brapi
Mantém histórico de conversa para respostas mais contextualizadas
Painel administrativo para gerenciar usuários, planos e configurações do bot


Stack
Backend

Node.js + Express
PostgreSQL 15
Redis 7
Docker

IA e Integrações

Anthropic Claude API (claude-sonnet-4-6)
Meta Cloud API (WhatsApp Business)
Brapi (cotações B3)

Painel Admin

Next.js 16
Autenticação por banco de dados com token por sessão


Estrutura do projeto
Payroll/
├── src/                  # Backend Express (porta 3000)
│   ├── ai/               # Motor de IA e prompts por perfil
│   ├── db/               # Conexão PostgreSQL, Redis e queries
│   ├── suitability/      # Fluxo de perguntas e cálculo de perfil
│   ├── webhook/          # Integração WhatsApp
│   └── server.js         # Entry point
├── admin/                # Painel Next.js (porta 3001)
│   ├── app/              # Páginas e rotas
│   └── components/       # Sidebar e componentes
└── docker-compose.yml    # PostgreSQL + Redis

Como rodar localmente
Pré-requisitos: Node.js, Docker Desktop
bash# 1. Sobe o banco de dados
docker-compose up -d

# 2. Backend (dentro de src/)
cd src
npm install
npm run dev

# 3. Painel admin (dentro de admin/)
cd admin
npm install
npm run dev -- --port 3001
Crie o arquivo src/.env com base nas variáveis abaixo antes de rodar.

Variáveis de ambiente
env# src/.env
PORT=3000
ANTHROPIC_API_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
WHATSAPP_VERIFY_TOKEN=
BRAPI_TOKEN=
DATABASE_URL=postgresql://payroll:payroll123@localhost:5432/payroll
REDIS_URL=redis://localhost:6379
TENANT_ID_DEFAULT=
NODE_ENV=development
env# admin/.env.local
ADMIN_PASSWORD=

Planos
PlanoLimitePreçoFree3 perguntas/mêsGrátisProIlimitadoR$ 12,90/mêsBusinessIlimitado + relatóriosR$ 29,90/mês

Status
Em desenvolvimento ativo. Webhook WhatsApp configurado e verificado, bot respondendo com perfil adaptado, painel administrativo completo com autenticação.
Próximas etapas: integração com AbacatePay para billing, deploy no Railway + Vercel e ativação do modo Live na Meta.
