import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Portfolio | Flandy Rockyliano Mamun",
  description:
    "Katalog 21 browser game dan interactive experience produksi 2025–2026 karya Flandy Rockyliano Mamun.",
  keywords: [
    "Game Developer Indonesia",
    "Browser Game",
    "JavaScript Game",
    "Three.js",
    "WebGL",
    "Interactive Experience",
    "Brand Activation",
  ],
  authors: [{ name: "Flandy Rockyliano Mamun" }],
  creator: "Flandy Rockyliano Mamun",
  openGraph: {
    title: "Game Portfolio | Flandy Rockyliano Mamun",
    description: "21 browser games dan interactive experiences produksi 2025–2026 untuk event dan brand activation.",
    type: "website",
    locale: "id_ID",
    siteName: "Flandy Game Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Portfolio | Flandy Rockyliano Mamun",
    description: "21 browser games dan interactive experiences produksi 2025–2026 untuk event dan brand activation.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
