'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/bot', label: 'Bot & IA' },
  { href: '/billing', label: 'Billing' },
  { href: '/config', label: 'Config' },
];

export default function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/login';
  }

  return (
    <aside style={{
      width: 220, minHeight: '100vh',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column',
      background: '#000', flexShrink: 0,
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, background: '#fff', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}> 
            <span style={{ color: '#000', fontSize: 12, fontWeight: 700 }}>P</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Payroll</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'block', padding: '8px 12px', borderRadius: 8,
              fontSize: 14, marginBottom: 2, textDecoration: 'none',
              color: active ? '#fff' : 'rgba(255,255,255,0.4)',
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              transition: 'all 0.15s',
            }}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, marginBottom: 8 }}>v1.0.0-dev</p>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '7px 12px', borderRadius: 8,
          background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer',
          transition: 'all 0.15s',
        }}>
          Sair
        </button>
      </div>
    </aside>
  );
}