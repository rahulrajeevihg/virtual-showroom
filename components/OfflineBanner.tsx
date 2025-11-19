'use client';

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getDBStats } from '@/lib/indexedDB';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [dbStats, setDbStats] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
      loadStats();
    } else {
      // Hide after 3 seconds when coming back online
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const loadStats = async () => {
    try {
      const stats = await getDBStats();
      setDbStats(stats);
    } catch (error) {
      console.error('Error loading DB stats:', error);
    }
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-20 left-0 right-0 z-40 transition-all duration-300 ${
        isOnline ? 'bg-green-500/90' : 'bg-yellow-500/90'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-white font-semibold text-sm">Back Online</p>
                <p className="text-white/90 text-xs">Syncing your data...</p>
              </div>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-white font-semibold text-sm">Offline Mode</p>
                <p className="text-white/90 text-xs">
                  {dbStats ? `${dbStats.productsCount} products available offline` : 'Working offline'}
                </p>
              </div>
            </>
          )}
        </div>
        
        {!isOnline && dbStats && (
          <div className="hidden md:flex items-center gap-4 text-white/90 text-xs">
            <span>{dbStats.wishlistCount} in wishlist</span>
            {dbStats.pendingSyncCount > 0 && (
              <span className="bg-white/20 px-2 py-1 rounded">
                {dbStats.pendingSyncCount} pending sync
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
