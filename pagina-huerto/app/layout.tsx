import type { Metadata, Viewport } from "next";
import { Archivo_Black, Barlow_Condensed, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { negocioJsonLd, sitioJsonLd } from "@/lib/schema";
import { SITE } from "@/lib/site";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "El Huerto | Smoothies, Bowls, Paninis y Café en Ciudad UP",
    template: "%s | El Huerto",
  },
  description:
    "Smoothies, açaí bowls, paninis, ensaladas y café preparados frescos cada día. Encuentra El Huerto en Ciudad UP, Bosque Real.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "El Huerto",
    title: "El Huerto | Smoothies, Bowls, Paninis y Café en Ciudad UP",
    description:
      "Smoothies, açaí bowls, paninis, ensaladas y café preparados frescos cada día en Ciudad UP, Bosque Real.",
    images: [{ url: "/brand/og-el-huerto.png", width: 1200, height: 630, alt: "El Huerto — Natural, fresco, saludable" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#344526",
};

const jsonLdGlobal = [negocioJsonLd(), sitioJsonLd()];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${archivoBlack.variable} ${barlowCondensed.variable} ${manrope.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        {jsonLdGlobal.map((bloque, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(bloque) }}
          />
        ))}
      </body>
    </html>
  );
}
