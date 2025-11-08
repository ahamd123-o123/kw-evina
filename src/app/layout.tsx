import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4285F4",
};

export const metadata: Metadata = {
  title: "Subscribe to Premium Services | Overseas MCC",
  description: "Subscribe to premium digital content and services. Access exclusive games, entertainment, and more with mobile billing.",
  keywords: "mobile subscription, digital content, games, entertainment, premium services",
  authors: [{ name: "Overseas MCC" }],
  creator: "Overseas MCC",
  publisher: "Overseas MCC",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://playcheaply.com",
    siteName: "Overseas MCC",
    title: "Subscribe to Premium Services",
    description: "Subscribe to premium digital content and services. Access exclusive games, entertainment, and more with mobile billing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscribe to Premium Services",
    description: "Subscribe to premium digital content and services. Access exclusive games, entertainment, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
