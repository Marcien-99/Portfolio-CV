import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

import { getSiteSettings } from "@/lib/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seo_title || "Marcien B. Nzoussi - Portfolio",
    description: settings.seo_description || "Portfolio professionnel et générateur de CV interactif",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
