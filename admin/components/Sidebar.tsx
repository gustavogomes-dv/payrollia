'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const links = [
  { href: '/home', label: 'Home' },
  { href: '/dashboard', label: 'Overview' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/bot', label: 'Bot & IA' },
  { href: '/billing', label: 'Billing' },
  { href: '/config', label: 'Config' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fecha ao navegar
  useEffect(() => { setOpen (false); }, [pathname]);

  // Fecha ao pressionar ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/login';
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: '#fff', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#000', fontSize: 13, fontWeight: 800 }}>P</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>Payroll</span>
        </div>
        {/* Fechar no mobile */}
        <button
          onClick={() => setOpen(false)}
          style={{
            display: 'none',
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: 20, padding: 4, lineHeight: 1,
          }}
          className="sidebar-close"
          aria-label="Fechar menu"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block', padding: '9px 14px',
                borderRadius: 8, fontSize: 14, marginBottom: 2,
                textDecoration: 'none', fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.38)',
                background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                transition: 'all 0.15s',
                letterSpacing: '-0.1px',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 11, marginBottom: 10, letterSpacing: '0.05em' }}>
          v1.0.0
        </p>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer',
            transition: 'all 0.15s', textAlign: 'left',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          Sair
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-close { display: block !important; }
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* Hamburguer — só mobile */}
      <button
        onClick={() => setOpen(true)}
        className="hamburger-btn"
        style={{
          display: 'none',
          position: 'fixed', top: 16, left: 16, zIndex: 200,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '8px 10px',
          cursor: 'pointer', color: '#fff', fontSize: 18, lineHeight: 1,
        }}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Overlay — só mobile quando aberto */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            display: 'none',
            position: 'fixed', inset: 0, zIndex: 149,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar desktop */}
      <aside
        className="sidebar-desktop"
        style={{
          width: 220, minHeight: '100vh',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          background: '#080808', flexShrink: 0,
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar mobile (drawer) */}
      <aside
        className="sidebar-mobile"
        style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 240, zIndex: 150,
          background: '#080808',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: flex !important; }
          .hamburger-btn { display: block !important; }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}