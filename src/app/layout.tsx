import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  description:
    "Alimentación natural para perros y gatos en Mendoza. Naturalmente deliciosa, profesionalmente formulada.",
  icons: { icon: "/images/favicon.webp" },
};

export const viewport: Viewport = { themeColor: "#21445B" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#contenido"
          className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-pill bg-navy px-4 py-2 text-white focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
