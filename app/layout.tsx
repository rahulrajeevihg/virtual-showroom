import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRScanner from "@/components/QRScanner";
import InstallPrompt from "@/components/InstallPrompt";
import OfflineBanner from "@/components/OfflineBanner";
import AutoSync from "@/components/AutoSync";
import QueryProvider from "@/providers/QueryProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LED World - Premium Lighting Solutions",
  description: "Virtual showroom for premium LED lighting solutions across commercial, industrial, and residential applications.",
  manifest: "/manifest.json",
  applicationName: "LED World",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LED World",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-ledworld-d.png" />
        <link rel="apple-touch-icon" href="/logo-ledworld-d.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-ledworld-d.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-ledworld-d.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={montserrat.className}>
        <QueryProvider>
          <ErrorBoundary>
            <WishlistProvider>
              <AutoSync />
              <Header />
              <OfflineBanner />
              <main className="pt-20">{children}</main>
              <Footer />
              <QRScanner />
              <InstallPrompt />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </WishlistProvider>
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
