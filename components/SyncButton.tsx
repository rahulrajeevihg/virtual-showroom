'use client';

import { useState } from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import toast from 'react-hot-toast';

export default function SyncButton() {
  const { isOnline, syncProductsCatalog } = useOfflineSync();
  const [isSyncing, setIsSyncing] = useState(false);
  const lastSync = typeof window !== 'undefined' ? localStorage.getItem('db-last-updated') : null;

  const handleSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    try {
      const count = await syncProductsCatalog();
      toast.success(`Synced ${count} products to offline storage`);
    } catch (error) {
      toast.error('Failed to sync products');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={!isOnline || isSyncing}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          !isOnline || isSyncing
            ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
            : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl'
        }`}
        aria-label="Sync products catalog"
      >
        <svg
          className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {isSyncing ? 'Syncing...' : 'Sync'}
      </button>
      
      {lastSync && (
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>Last: {formatLastSync()}</span>
        </div>
      )}
    </div>
  );
}
