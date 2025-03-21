import type { Metadata } from "next";
import { roboto } from "@/components/ui/fonts";
import "./globals.css";
import type { WebSite, WithContext } from "schema-dts";
import Script from "next/script";
// import localFont from "next/font/local";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
const jsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NibbleAI",
  url: "https://nibble-ai.com",
  alternateName: ["nibbleAI", "Nibbleai", "nibbleai", "nibble-ai.com"],
};

export const metadata: Metadata = {
  title: "NibbleAI | AI Generated Recipes",
  description: "AI Generated Recipes",
  openGraph: {
    title: "NibbleAI | AI Generated Recipes",
    description: "AI Generated Recipes",
    images: [
      {
        url: "https://storage.nibble-ai.com/logo.png",
        width: 400,
        height: 400,
      },
    ],
  },
  other: {
    "google-adsense-account": "ca-pub-2511010321424649",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>{children}</body>
      <Script
        id="json-ld-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </html>
  );
}
