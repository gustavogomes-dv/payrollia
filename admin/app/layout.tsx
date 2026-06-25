import type { Metadata } from "next";
import LayoutClient from "@/components/LayoutClient";
import "./globals.css";

const SITE_URL = "https://payrollia.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Educação financeira no WhatsApp | Payroll",
    template: "%s | Payroll",
  },
  description:
    "Tire suas dúvidas sobre dinheiro e investimentos direto no WhatsApp, com dados reais do mercado e sem juridiquês. Descubra seu perfil de investidor. Grátis para começar.",
  keywords: [
    "educação financeira",
    "IA financeira no WhatsApp",
    "assistente financeiro WhatsApp",
    "investimentos para iniciantes",
    "perfil de investidor",
    "suitability",
    "renda fixa",
    "ações",
    "tesouro direto",
    "Selic CDI IPCA",
    "como começar a investir",
  ],
  authors: [{ name: "Payroll" }],
  creator: "Payroll",
  publisher: "Payroll",
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    other: {
      "facebook-domain-verification": ["tl3jkr6nelimqrf6btht18yyu00d0f"],
    },
  },
  openGraph: {
    title: "Educação financeira no WhatsApp | Payroll",
    description:
      "Tire suas dúvidas sobre dinheiro e investimentos direto no WhatsApp, com dados reais do mercado e sem juridiquês.",
    url: SITE_URL,
    siteName: "Payroll",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://payrollia.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "Payroll — Educação financeira no WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Educação financeira no WhatsApp | Payroll",
    description:
      "Tire suas dúvidas sobre dinheiro e investimentos direto no WhatsApp, com dados reais do mercado e sem juridiquês.",
    images: ["https://payrollia.com.br/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "finance",
};

// Dados estruturados (JSON-LD): ajuda o Google a entender o que é o Payroll.
// Enquadramento de educação financeira — não promete retorno nem recomenda ativo.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Payroll",
  url: SITE_URL,
  description:
    "Assistente de educação financeira no WhatsApp: tire dúvidas sobre dinheiro e investimentos com dados reais do mercado, sem juridiquês.",
  inLanguage: "pt-BR",
  publisher: {
    "@type": "Organization",
    name: "Payroll",
    url: SITE_URL,
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
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}