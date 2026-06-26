import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Garante que a OG image seja servida como imagem, com cache público longo —
        // é o que os scrapers (Facebook/WhatsApp/LinkedIn) esperam pra montar a prévia.
        source: "/og-image.png",
        headers: [
          { key: "Content-Type", value: "image/png" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;