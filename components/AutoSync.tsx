'use client';

import { useEffect } from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export default function AutoSync() {
  const { isOnline, syncProductsCatalog } = useOfflineSync();

  useEffect(() => {
    // Initial sync when component mounts and online
    if (isOnline) {
      const lastSync = localStorage.getItem('db-last-updated');
      
      // If never synced or last sync was more than 1 hour ago
      if (!lastSync) {
        console.log('No previous sync found, syncing now...');
        syncProductsCatalog().catch(console.error);
      } else {
        const lastSyncTime = new Date(lastSync).getTime();
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        if (lastSyncTime < oneHourAgo) {
          console.log('Catalog outdated, syncing now...');
          syncProductsCatalog().catch(console.error);
        }
      }
    }
  }, [isOnline, syncProductsCatalog]);

  return null; // This component doesn't render anything
}
