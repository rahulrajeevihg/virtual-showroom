import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRScanner from "@/components/QRScanner";
import InstallPrompt from "@/components/InstallPrompt";
import OfflineBanner from "@/components/OfflineBanner";
import AutoSync from "@/components/AutoSync";
import { Toaster } from "react-hot-toast";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
