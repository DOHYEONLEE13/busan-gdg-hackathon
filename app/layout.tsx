import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Manrope,
  Cabin,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--next-font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--next-font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--next-font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cabin = Cabin({
  variable: "--next-font-cabin",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--next-font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ARITHMOS™ — Beyond Numbers",
    template: "%s | ARITHMOS™",
  },
  description:
    "The world's first enterprise-grade computational intelligence platform. Industry-leading precision. Uncompromising accuracy. Starting at ₩49,000/mo.",
  keywords: [
    "ARITHMOS",
    "enterprise calculator",
    "computational intelligence",
    "precision arithmetic",
    "AI calculation",
  ],
  openGraph: {
    title: "ARITHMOS™ — Beyond Numbers",
    description:
      "Industry-leading computational precision, engineered for the modern enterprise.",
    siteName: "ARITHMOS™",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${jetbrainsMono.variable} ${manrope.variable} ${cabin.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
