'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// ─── Ícones oficiais da marca (brand-icons.jsx do designer) ───────────────────
function IconBase({ size = 18, stroke = 1.5, color = 'currentColor', children, label }: {
  size?: number; stroke?: number; color?: string; children: React.ReactNode; label?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      aria-label={label}>
      {children}
    </svg>
  );
}

function IconHome(p: { size?: number; stroke?: number; color?: string }) {
  return (
    <IconBase {...p} label="home">
      <path d="M3 12 L12 4 L21 12 V20 a1 1 0 0 1-1 1 H15 V15 H9 V21 H4 a1 1 0 0 1-1-1 Z" />
    </IconBase>
  );
}
function IconGrafico(p: { size?: number; stroke?: number; color?: string }) {
  return (
    <IconBase {...p} label="overview">
      <path d="M3 21 H21" />
      <rect x="5" y="13" width="3.5" height="6" rx="1" />
      <rect x="10.25" y="9" width="3.5" height="10" rx="1" />
      <rect x="15.5" y="5" width="3.5" height="14" rx="1" />
      <path d="M5 5 L9 7 L14 4 L19 2" />
    </IconBase>
  );
}
function IconPerfil(p: { size?: number; stroke?: number; color?: string }) {
  return (
    <IconBase {...p} label="clientes">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20 c1.5-4 5-6 8-6 s6.5 2 8 6" />
    </IconBase>
  );
}
function IconIA(p: { size?: number; stroke?: number; color?: string }) {
  return (
    <IconBase {...p} label="bot ia">
      <path d="M12 3 L13.5 9.5 L20 11 L13.5 12.5 L12 19 L10.5 12.5 L4 11 L10.5 9.5 Z" />
      <path d="M19 3 L19.6 5 L21.5 5.5 L19.6 6 L19 8 L18.4 6 L16.5 5.5 L18.4 5 Z" />
    </IconBase>
  );
}
function IconBilling(p: { size?: number; stroke?: number; color?: string }) {
  return (
    <IconBase {...p} label="billing">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10 H22" />
      <path d="M6 15 H10" />
    </IconBase>
  );
}
function IconConfiguracoes(p: { size?: number; stroke?: number; color?: string }) {
  return (
    <IconBase {...p} label="config">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15 a1.65 1.65 0 0 0 .33 1.82 l.06.06 a2 2 0 0 1-2.83 2.83 l-.06-.06 a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51 V21 a2 2 0 0 1-4 0 v-.09 A1.65 1.65 0 0 0 9 19.4 a1.65 1.65 0 0 0-1.82.33 l-.06.06 a2 2 0 0 1-2.83-2.83 l.06-.06 A1.65 1.65 0 0 0 4.68 15 1.65 1.65 0 0 0 3.17 14 H3 a2 2 0 0 1 0-4 h.09 A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18 l-.06-.06 a2 2 0 0 1 2.83-2.83 l.06.06 A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17 V3 a2 2 0 0 1 4 0 v.09 a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33 l.06-.06 a2 2 0 0 1 2.83 2.83 l-.06.06 A1.65 1.65 0 0 0 19.4 9 1.65 1.65 0 0 0 20.83 10 H21 a2 2 0 0 1 0 4 h-.09 a1.65 1.65 0 0 0-1.51 1 Z" />
    </IconBase>
  );
}
function IconSair(p: { size?: number; stroke?: number; color?: string }) {
  return (
    <IconBase {...p} label="sair">
      <path d="M9 21 H5 a2 2 0 0 1-2-2 V5 a2 2 0 0 1 2-2 h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </IconBase>
  );
}

// ─── Logo oficial (3 barras Lime sobre Aubergine) ────────────────────────────
function PayrollLogo({ size = 32 }: { size?: number }) {
  const s = size / 64;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#2D2356" />
      <rect x="12" y="14" width="24" height="11" rx="5.5" fill="#C8F260" />
      <rect x="12" y="27" width="40" height="11" rx="5.5" fill="#C8F260" />
      <rect x="12" y="40" width="32" height="11" rx="5.5" fill="#C8F260" />
    </svg>
  );
}

// ─── Links de navegação ───────────────────────────────────────────────────────
const links = [
  { href: '/home',      label: 'Home',     Icon: IconHome },
  { href: '/dashboard', label: 'Overview', Icon: IconGrafico },
  { href: '/clientes',  label: 'Clientes', Icon: IconPerfil },
  { href: '/bot',       label: 'Bot & IA', Icon: IconIA },
  { href: '/billing',   label: 'Billing',  Icon: IconBilling },
  { href: '/config',    label: 'Config',   Icon: IconConfiguracoes },
];

// ─── Conteúdo interno ─────────────────────────────────────────────────────────
function SidebarContent({
  pathname,
  onClose,
  onCollapse,
  showCollapseBtn,
}: {
  pathname: string;
  onClose?: () => void;
  onCollapse?: () => void;
  showCollapseBtn?: boolean;
}) {
  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/login';
  }

  return (
    <>
      {/* Logo */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PayrollLogo size={30} />
          <span style={{
            fontWeight: 600, fontSize: 14,
            letterSpacing: '-0.3px',
            color: '#FAF8F4',
          }}>
            payroll
          </span>
        </div>

        {onClose && (
          <button onClick={onClose} style={btnReset} aria-label="Fechar menu">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(250,248,244,0.35)" strokeWidth={2} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {showCollapseBtn && onCollapse && (
          <button onClick={onCollapse} style={btnReset} aria-label="Recolher sidebar">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(250,248,244,0.35)" strokeWidth={2} strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              fontSize: 13.5, marginBottom: 2,
              fontWeight: active ? 600 : 400,
              color: active ? '#C8F260' : 'rgba(250,248,244,0.4)',
              background: active ? 'rgba(200,242,96,0.1)' : 'transparent',
              textDecoration: 'none',
              borderLeft: active ? '2px solid #C8F260' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(250,248,244,0.75)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(250,248,244,0.4)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }
              }}
            >
              <Icon
                size={16}
                stroke={active ? 2.2 : 1.6}
                color={active ? '#C8F260' : 'rgba(250,248,244,0.4)'}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 10, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.15)',
          textTransform: 'uppercase',
          marginBottom: 10, paddingLeft: 2,
        }}>
          v1.0.0
        </p>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '8px 12px',
          borderRadius: 8,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(250,248,244,0.3)',
          fontSize: 12, cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => {
            (e.currentTarget).style.color = 'rgba(250,248,244,0.7)';
            (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.color = 'rgba(250,248,244,0.3)';
            (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <IconSair size={13} color="currentColor" />
          Sair
        </button>
      </div>
    </>
  );
}

const btnReset: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: 4, display: 'flex', alignItems: 'center',
};

// ─── Sidebar principal ────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const sidebarBg = '#2D2356';

  return (
    <>
      {/* Hamburguer mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="hamburger-btn"
        style={{
          display: 'none',
          position: 'fixed', top: 14, left: 14, zIndex: 200,
          background: '#2D2356',
          border: '1px solid rgba(200,242,96,0.2)',
          borderRadius: 8, padding: '8px 9px',
          cursor: 'pointer', color: '#C8F260',
          alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Abrir menu"
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Botão reabrir desktop */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="reopen-btn"
          style={{
            position: 'fixed', top: 14, left: 14, zIndex: 200,
            background: '#2D2356',
            border: '1px solid rgba(200,242,96,0.2)',
            borderRadius: 8, padding: '8px 9px',
            cursor: 'pointer', color: '#C8F260',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Abrir sidebar"
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 149,
            background: 'rgba(20,16,42,0.7)', backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar desktop */}
      {!collapsed && (
        <aside
          className="sidebar-desktop"
          style={{
            width: 220, minHeight: '100vh',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column',
            background: sidebarBg, flexShrink: 0,
            position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
          }}
        >
          <SidebarContent
            pathname={pathname}
            onCollapse={() => setCollapsed(true)}
            showCollapseBtn
          />
        </aside>
      )}

      {/* Sidebar mobile */}
      <aside
        className="sidebar-mobile"
        style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 240, zIndex: 150,
          background: sidebarBg,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile  { display: flex !important; }
          .hamburger-btn   { display: flex !important; }
          .reopen-btn      { display: none !important; }
        }
      `}</style>
    </>
  );
}