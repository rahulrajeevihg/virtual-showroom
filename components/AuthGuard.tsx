"use client";

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const pathname = usePathname();

  // Don't show loading on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
