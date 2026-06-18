'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// ─── Tokens ─────────────────────────────────────────────────────────────────
const BG = '#14102A';
const LIME = '#C8F260';
const BONE = '#FAF8F4';
const HAIR = 'rgba(200,242,96,0.12)';
const MUTE = 'rgba(250,248,244,0.32)';

// ─── Ícones (line, viewBox 24) ────────────────────────────────────────────────
function Icon({ name, size = 19, color = 'currentColor', stroke = 1.6 }: { name: string; size?: number; color?: string; stroke?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: <path d="M3 12 L12 4 L21 12 V20 a1 1 0 0 1-1 1 H15 V15 H9 V21 H4 a1 1 0 0 1-1-1 Z" />,
    grafico: <>
      <path d="M3 21 H21" />
      <rect x="5" y="13" width="3.5" height="6" rx="1" />
      <rect x="10.25" y="9" width="3.5" height="10" rx="1" />
      <rect x="15.5" y="5" width="3.5" height="14" rx="1" />
    </>,
    perfil: <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20 c1.5-4 5-6 8-6 s6.5 2 8 6" />
    </>,
    config: <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15 a1.65 1.65 0 0 0 .33 1.82 l.06.06 a2 2 0 0 1-2.83 2.83 l-.06-.06 a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51 V21 a2 2 0 0 1-4 0 v-.09 A1.65 1.65 0 0 0 9 19.4 a1.65 1.65 0 0 0-1.82.33 l-.06.06 a2 2 0 0 1-2.83-2.83 l.06-.06 A1.65 1.65 0 0 0 4.68 15 1.65 1.65 0 0 0 3.17 14 H3 a2 2 0 0 1 0-4 h.09 A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18 l-.06-.06 a2 2 0 0 1 2.83-2.83 l.06.06 A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17 V3 a2 2 0 0 1 4 0 v.09 a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33 l.06-.06 a2 2 0 0 1 2.83 2.83 l-.06.06 A1.65 1.65 0 0 0 19.4 9 1.65 1.65 0 0 0 20.83 10 H21 a2 2 0 0 1 0 4 h-.09 a1.65 1.65 0 0 0-1.51 1 Z" />
    </>,
    sair: <>
      <path d="M9 21 H5 a2 2 0 0 1-2-2 V5 a2 2 0 0 1 2-2 h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ─── Logo oficial ─────────────────────────────────────────────────────────────
function PayrollLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#2D2356" />
      <rect x="12" y="14" width="24" height="11" rx="5.5" fill="#C8F260" />
      <rect x="12" y="27" width="40" height="11" rx="5.5" fill="#C8F260" />
      <rect x="12" y="40" width="32" height="11" rx="5.5" fill="#C8F260" />
    </svg>
  );
}

const links = [
  { href: '/home',      label: 'Home',     icon: 'home' },
  { href: '/dashboard', label: 'Overview', icon: 'grafico' },
  { href: '/clientes',  label: 'Clientes', icon: 'perfil' },
  { href: '/config',    label: 'Config',   icon: 'config' },
];

// ─── Conteúdo (compartilhado desktop/mobile) ───────────────────────────────────
function SidebarContent({ pathname, mobile = false, onClose }: { pathname: string; mobile?: boolean; onClose?: () => void }) {
  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/login';
  }
  return (
    <>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: mobile ? 'space-between' : 'center', gap: 9, padding: mobile ? '20px 20px 18px' : '22px 0 20px', borderBottom: `1px solid ${HAIR}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <PayrollLogo size={28} />
          {mobile && <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 19, color: BONE }}>payroll</span>}
        </div>
        {mobile && onClose && (
          <button onClick={onClose} aria-label="Fechar menu" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: MUTE }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: mobile ? '16px 12px' : '18px 0', display: 'flex', flexDirection: 'column', gap: mobile ? 2 : 6, alignItems: mobile ? 'stretch' : 'center' }}>
        {links.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          if (mobile) {
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                fontSize: 14, color: active ? LIME : MUTE,
                background: active ? 'rgba(200,242,96,0.08)' : 'transparent',
                borderLeft: active ? `2px solid ${LIME}` : '2px solid transparent',
                textDecoration: 'none',
              }}>
                <Icon name={icon} size={18} color={active ? LIME : MUTE} stroke={active ? 2 : 1.6} />
                {label}
              </Link>
            );
          }
          return (
            <Link key={href} href={href} title={label} aria-label={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, position: 'relative', textDecoration: 'none',
            }}>
              {active && <span style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 2, background: LIME }} />}
              <Icon name={icon} size={19} color={active ? LIME : MUTE} stroke={active ? 2 : 1.6} />
            </Link>
          );
        })}
      </nav>

      {/* Footer / logout */}
      <div style={{ padding: mobile ? '14px 12px' : '0 0 22px', borderTop: mobile ? `1px solid ${HAIR}` : 'none', display: 'flex', justifyContent: 'center' }}>
        <button onClick={handleLogout} title="Sair" aria-label="Sair" style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: mobile ? 8 : 0,
          justifyContent: 'center', width: mobile ? '100%' : 44, height: 44,
          padding: mobile ? '8px 14px' : 0, color: 'rgba(250,248,244,0.28)',
          fontFamily: 'inherit', fontSize: 13,
        }}>
          <Icon name="sair" size={mobile ? 16 : 18} color="currentColor" />
          {mobile && 'Sair'}
        </button>
      </div>
    </>
  );
}

// ─── Sidebar principal ────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Hamburguer mobile */}
      <button onClick={() => setMobileOpen(true)} className="hamburger-btn" aria-label="Abrir menu" style={{
        display: 'none', position: 'fixed', top: 14, left: 14, zIndex: 200,
        background: BG, border: `1px solid ${HAIR}`, padding: '8px 9px', cursor: 'pointer', color: LIME,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 149, background: 'rgba(20,16,42,0.7)', backdropFilter: 'blur(2px)' }} />
      )}

      {/* Sidebar desktop — rail de ícones */}
      <aside className="sidebar-desktop" style={{
        width: 64, minHeight: '100vh', flexShrink: 0,
        background: BG, borderRight: `1px solid ${HAIR}`,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Sidebar mobile — drawer com labels */}
      <aside className="sidebar-mobile" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 240, zIndex: 150, background: BG, borderRight: `1px solid ${HAIR}`,
        flexDirection: 'column',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)', overflowY: 'auto',
      }}>
        <SidebarContent pathname={pathname} mobile onClose={() => setMobileOpen(false)} />
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile  { display: flex !important; }
          .hamburger-btn   { display: flex !important; }
        }
      `}</style>
    </>
  );
}