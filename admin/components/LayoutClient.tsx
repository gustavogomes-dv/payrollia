'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname === '/' || pathname === '/privacidade' || pathname === '/termos' || pathname === '/indicacao';

  if (isPublic) {
    return (
      <div style={{ background: '#FAF8F4', minHeight: '100vh', margin: 0, color: '#14102A' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#FAF8F4', minHeight: '100vh', color: '#14102A' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px 28px', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}