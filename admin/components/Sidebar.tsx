'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  Bot,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

const links = [
  { href: '/home',      label: 'Home',     icon: Home },
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/clientes',  label: 'Clientes', icon: Users },
  { href: '/bot',       label: 'Bot & IA', icon: Bot },
  { href: '/billing',   label: 'Billing',  icon: CreditCard },
  { href: '/config',    label: 'Config',   icon: Settings },
];

// ─── Conteúdo interno da sidebar ──────────────────────────────────────────────
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
        padding: '16px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: '#fff', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: '#000', fontSize: 13, fontWeight: 800 }}>P</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>Payroll</span>
        </div>

        {/* Fechar no mobile */}
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        )}

        {/* Recolher no desktop */}
        {showCollapseBtn && onCollapse && (
          <button
            onClick={onCollapse}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            aria-label="Recolher sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                fontSize: 14, marginBottom: 2, textDecoration: 'none',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.38)',
                background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.38)';
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 11, marginBottom: 10, letterSpacing: '0.05em', paddingLeft: 2 }}>
          v1.0.0
        </p>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.color = 'rgba(255,255,255,0.7)';
            (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.color = 'rgba(255,255,255,0.3)';
            (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </>
  );
}

// ─── Sidebar principal ─────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Fecha mobile ao navegar
  useEffect(() => { setMobileOpen (false); }, [pathname]);

  // ESC fecha mobile
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* ── Botão hamburguer — mobile ──────────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="hamburger-btn"
        style={{
          display: 'none',
          position: 'fixed', top: 14, left: 14, zIndex: 200,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '8px 9px',
          cursor: 'pointer', color: '#fff',
          alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>

      {/* ── Botão reabrir — desktop quando collapsed ───────────────────────── */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="reopen-btn"
          style={{
            position: 'fixed', top: 14, left: 14, zIndex: 200,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '8px 9px',
            cursor: 'pointer', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          aria-label="Abrir sidebar"
        >
          <Menu size={18} />
        </button>
      )}

      {/* ── Overlay mobile ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 149,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Sidebar desktop ────────────────────────────────────────────────── */}
      {!collapsed && (
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
          <SidebarContent
            pathname={pathname}
            onCollapse={() => setCollapsed(true)}
            showCollapseBtn
          />
        </aside>
      )}

      {/* ── Sidebar mobile (drawer) ────────────────────────────────────────── */}
      <aside
        className="sidebar-mobile"
        style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 240, zIndex: 150,
          background: '#080808',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        <SidebarContent
          pathname={pathname}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: flex !important; }
          .hamburger-btn { display: flex !important; }
          .reopen-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}