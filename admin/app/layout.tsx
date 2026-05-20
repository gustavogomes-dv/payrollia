import type { Metadata } from 'next';
import './globals.css';
import LayoutClient from '@/components/LayoutClient';

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
        <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body style={{ margin: 0 }}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}