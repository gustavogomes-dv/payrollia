CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    whatsapp_phone_id VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);  
    
CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
phone VARCHAR(20) NOT NULL,
name VARCHAR(255),
email VARCHAR(255),
cpf VARCHAR(14),
onboarding_complete BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT NOW(),
UNIQUE(tenant_id, phone)
);

CREATE TABLE IF NOT EXISTS investor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    objetivo VARCHAR(50),
    horizonte VARCHAR(50),
    tolerancia_risco VARCHAR(50),
    experiencia VARCHAR(50),
    renda_mensal VARCHAR(50),
    patrimonio VARCHAR(50),
    dependentes BOOLEAN,
    reacao_queda VARCHAR(50),
    perfil VARCHAR(20) CHECK (perfil IN ('conservador', 'moderado', 'arrojado')),
    pontuacao INTEGER,
    valido_ate TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    step VARCHAR(100) DEFAULT 'inicio',
    context JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(10) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);