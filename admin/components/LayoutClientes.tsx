'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', margin: 0, color: '#111' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#000', minHeight: '100vh', color: '#fff' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px 28px', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}