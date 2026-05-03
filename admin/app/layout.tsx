import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Payroll Admin',
  description: 'Painel administrativo do Payroll',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ display: 'flex', background: '#000', minHeight: '100vh', margin: 0 }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}