/* Layout Refresh Trigger 1 */
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rothschild & Co | Follow the Light",
  description: "Official recruitment and induction portal for Rothschild & Co. Excellence, trust, and long-term value.",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Rothschild & Co | Follow the Light",
    description: "Official recruitment and induction portal for Rothschild & Co.",
    url: "https://rothschild-foundation.vercel.app/",
    siteName: "Rothschild & Co",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Rothschild & Co Portal Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rothschild & Co | Follow the Light",
    description: "Official recruitment and induction portal for Rothschild & Co.",
    images: ["/opengraph-image.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
