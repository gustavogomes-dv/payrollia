import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Payroll Admin',
  description: 'Painel administrativo do Payroll',
  other: {
    'facebook-domain-verification': 'exumchcnorrm7d34k7twvl7xlym123',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ display: 'flex', background: '#000', minHeight: '100vh', margin: 0, color: '#fff' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', padding: '32px 28px', minWidth: 0 }}>
          {children}
        </main>
      </body>
    </html>
  );
}