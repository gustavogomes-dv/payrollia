import type { Metadata } from "next";
import LayoutClient from "@/components/LayoutClient";
import "./globals.css";
// admin/app/layout.tsx — dentro do <head> ou via next/font
// + Instrument Serif via Google Fonts link no layout

export const metadata: Metadata = {
  title: "Payroll Chatbot — Educação financeira no WhatsApp",
  description: "Entenda investimentos, conheça seu perfil de investidor e acesse dados do mercado pelo WhatsApp. Grátis para começar.",
  keywords: ["educação financeira", "investimentos", "WhatsApp", "suitability", "CVM", "renda fixa", "ações", "tesouro direto"],
  verification: {
    other: {
      "facebook-domain-verification": ["tl3jkr6nelimqrf6btht18yyu00d0f"],
    },
  },
  openGraph: {
    title: "Payroll Chatbot — Educação financeira no WhatsApp",
    description: "Entenda investimentos, conheça seu perfil de investidor e acesse dados do mercado pelo WhatsApp.",
    url: "https://payrollia.com.br",
    siteName: "Payroll Chatbot",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payroll Chatbot — Educação financeira no WhatsApp",
    description: "Entenda investimentos, conheça seu perfil de investidor e acesse dados do mercado pelo WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}