async function getClientes() {
  try {
    const res = await fetch('http://localhost:3000/admin/clientes', { cache: 'no-store' });
    return res.json();
  } catch {
    return [];
  }
}

const perfilCor: Record<string, string> = {
  conservador: '#3b82f6',
  moderado: '#f59e0b',
  arrojado: '#ef4444',
};

const perfilBg: Record<string, string> = {
  conservador: 'rgba(59,130,246,0.08)',
  moderado: 'rgba(245,158,11,0.08)',
  arrojado: 'rgba(239,68,68,0.08)',
};

type Cliente = {
  id: string;
  name: string;
  phone: string;
  perfil: string;
  pontuacao: number;
  onboarding_complete: boolean;
  created_at: string;
};

export default async function ClientesPage() {
  const clientes: Cliente[] = await getClientes();

  const total = clientes.length;
  const completos = clientes.filter(c => c.onboarding_complete).length;
  const pendentes = total - completos;
  const porPerfil = ['conservador', 'moderado', 'arrojado'].map(p => ({
    perfil: p,
    total: clientes.filter(c => c.perfil === p).length,
  }));

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>Clientes</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
          Gerencie e visualize todos os usuários do Payroll
        </p>
      </div>

      {/* Mini cards de resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total', value: total, color: '#fff' },
          { label: 'Completos', value: completos, color: '#4ade80' },
          { label: 'Pendentes', value: pendentes, color: '#fbbf24' },
          ...porPerfil.map(p => ({ label: p.perfil.charAt(0).toUpperCase() + p.perfil.slice(1), value: p.total, color: perfilCor[p.perfil] })),
        ].map((item) => (
          <div key={item.label} style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontSize: 26, fontWeight: 600, color: item.color, letterSpacing: '-0.5px' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span>Nome</span>
          <span>Telefone</span>
          <span>Perfil</span>
          <span>Status</span>
          <span>Cadastro</span>
        </div>

        {clientes.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>👥</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Nenhum cliente cadastrado ainda.</p>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, marginTop: 4 }}>Os usuários aparecem aqui após a primeira mensagem no bot.</p>
          </div>
        ) : (
          clientes.map((c, i) => (
            <div key={c.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
              padding: '14px 20px',
              borderBottom: i < clientes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              alignItems: 'center',
              fontSize: 14,
            }}>
              {/* Nome + inicial */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: c.perfil ? perfilBg[c.perfil] : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${c.perfil ? perfilCor[c.perfil] + '40' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  color: c.perfil ? perfilCor[c.perfil] : 'rgba(255,255,255,0.4)',
                  flexShrink: 0,
                }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span style={{ fontWeight: 500 }}>
                  {c.name || <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>Sem nome</span>}
                </span>
              </div>

              {/* Telefone */}
              <span style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontSize: 13 }}>
                +{c.phone}
              </span>

              {/* Perfil */}
              <span>
                {c.perfil ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 12, color: perfilCor[c.perfil],
                    background: perfilBg[c.perfil],
                    padding: '3px 8px', borderRadius: 20,
                    border: `1px solid ${perfilCor[c.perfil]}30`,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: perfilCor[c.perfil], display: 'inline-block' }} />
                    {c.perfil}
                  </span>
                ) : <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>—</span>}
              </span>

              {/* Status onboarding */}
              <span style={{
                fontSize: 12,
                color: c.onboarding_complete ? 'rgba(74,222,128,0.8)' : 'rgba(251,191,36,0.7)',
              }}>
                {c.onboarding_complete ? '● Completo' : '○ Pendente'}
              </span>

              {/* Data */}
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
                {new Date(c.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer da tabela */}
      {clientes.length > 0 && (
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, marginTop: 12, textAlign: 'right' }}>
          Mostrando {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
        </p>
      )}
    </div>
  );
}