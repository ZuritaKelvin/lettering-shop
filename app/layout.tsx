import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import { ReactQueryProvider } from "./components/react-query-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lettering Shop - Ropa Única con Diseños de Lettering",
    template: "%s | Lettering Shop"
  },
  description:
    "Descubre ropa única con hermosos diseños de lettering y caligrafía. Prendas premium con arte personalizado.",
  keywords: ["lettering", "caligrafía", "ropa", "diseños únicos", "moda", "apparel", "camisetas"],
  authors: [{ name: "Lettering Shop" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Lettering Shop",
    title: "Lettering Shop - Ropa Única con Diseños de Lettering",
    description: "Descubre ropa única con hermosos diseños de lettering y caligrafía",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lettering Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lettering Shop - Ropa Única con Diseños de Lettering",
    description: "Descubre ropa única con hermosos diseños de lettering y caligrafía",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SiteHeader />
            {children}
            <Toaster position="top-center" richColors={true} />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
