import type { Metadata } from "next";
import { roboto } from "@/components/ui/fonts"
import "./globals.css";
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
    </html>
  );
}
