import API_URL from '@/lib/api';

async function getClientes() {
  try {
    const res = await fetch(`${API_URL}/admin/clientes`, { cache: 'no-store' });
    return res.json();
  } catch {
    return [];
  }
}

const PERFIL_COR: Record<string, string> = {
  conservador: '#3b82f6',
  moderado: '#f59e0b',
  arrojado: '#ef4444',
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

  const resumo = [
    { label: 'Total', value: total, color: '#fff' },
    { label: 'Completos', value: completos, color: '#4ade80' },
    { label: 'Pendentes', value: pendentes, color: '#fbbf24' },
    ...porPerfil.map(p => ({
      label: p.perfil.charAt(0).toUpperCase() + p.perfil.slice(1),
      value: p.total,
      color: PERFIL_COR[p.perfil],
    })),
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>Clientes</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 4 }}>
          Gerencie e visualize todos os usuários do Payroll
        </p>
      </div>

      {/* Cards resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }} className="grid-resumo">
        {resumo.map((item) => (
          <div key={item.label} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: item.color, letterSpacing: '-0.5px' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela desktop */}
      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }} className="table-desktop">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '11px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          <span>Nome</span>
          <span>Telefone</span>
          <span>Perfil</span>
          <span>Status</span>
          <span>Cadastro</span>
        </div>

        {clientes.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>Nenhum cliente cadastrado ainda.</p>
            <p style={{ color: 'rgba(255,255,255,0.1)', fontSize: 12, marginTop: 4 }}>Os usuários aparecem após a primeira mensagem no bot.</p>
          </div>
        ) : (
          clientes.map((c, i) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '13px 20px', borderBottom: i < clientes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', fontSize: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.perfil ? `${PERFIL_COR[c.perfil]}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${c.perfil ? PERFIL_COR[c.perfil] + '35' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: c.perfil ? PERFIL_COR[c.perfil] : 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name || <span style={{ color: 'rgba(255,255,255,0.2)' }}>Sem nome</span>}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.32)', fontFamily: 'monospace', fontSize: 13 }}>+{c.phone}</span>
              <span>
                {c.perfil ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: PERFIL_COR[c.perfil], background: `${PERFIL_COR[c.perfil]}12`, padding: '3px 8px', borderRadius: 20, border: `1px solid ${PERFIL_COR[c.perfil]}28` }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: PERFIL_COR[c.perfil], display: 'inline-block' }} />
                    {c.perfil}
                  </span>
                ) : <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>—</span>}
              </span>
              <span style={{ fontSize: 12, color: c.onboarding_complete ? 'rgba(74,222,128,0.75)' : 'rgba(251,191,36,0.65)' }}>
                {c.onboarding_complete ? 'Completo' : 'Pendente'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 13 }}>
                {new Date(c.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Lista mobile */}
      <div className="list-mobile" style={{ display: 'none', flexDirection: 'column', gap: 8 }}>
        {clientes.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            Nenhum cliente ainda.
          </div>
        ) : (
          clientes.map((c) => (
            <div key={c.id} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: c.perfil ? `${PERFIL_COR[c.perfil]}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${c.perfil ? PERFIL_COR[c.perfil] + '35' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: c.perfil ? PERFIL_COR[c.perfil] : 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{c.name || 'Sem nome'}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>+{c.phone}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {c.perfil && (
                  <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, color: PERFIL_COR[c.perfil], background: `${PERFIL_COR[c.perfil]}12`, border: `1px solid ${PERFIL_COR[c.perfil]}28`, textTransform: 'capitalize' }}>
                    {c.perfil}
                  </span>
                )}
                <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, color: c.onboarding_complete ? 'rgba(74,222,128,0.75)' : 'rgba(251,191,36,0.65)', background: c.onboarding_complete ? 'rgba(74,222,128,0.06)' : 'rgba(251,191,36,0.06)', border: `1px solid ${c.onboarding_complete ? 'rgba(74,222,128,0.18)' : 'rgba(251,191,36,0.18)'}` }}>
                  {c.onboarding_complete ? 'Completo' : 'Pendente'}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', padding: '3px 0' }}>
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {clientes.length > 0 && (
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, marginTop: 12, textAlign: 'right' }}>
          {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
        </p>
      )}

      <style>{`
        @media (max-width: 900px) {
          .grid-resumo { grid-template-columns: repeat(3, 1fr) !important; }
          .table-desktop { display: none !important; }
          .list-mobile { display: flex !important; }
        }
        @media (max-width: 500px) {
          .grid-resumo { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}