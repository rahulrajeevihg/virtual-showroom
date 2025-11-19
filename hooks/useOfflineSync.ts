import { useEffect, useCallback } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { 
  initDB, 
  saveToStore, 
  getAllFromStore, 
  getUnsyncedItems, 
  markAsSynced,
  STORES,
  type SyncQueueItem 
} from '@/lib/indexedDB';
import { fetchZoneProducts } from '@/lib/erpnext-api';
import toast from 'react-hot-toast';

export function useOfflineSync() {
  const isOnline = useOnlineStatus();

  // Initialize IndexedDB on mount
  useEffect(() => {
    initDB().catch(error => {
      console.error('Failed to initialize IndexedDB:', error);
    });
  }, []);

  // Sync products to IndexedDB when online
  const syncProductsCatalog = useCallback(async () => {
    if (!isOnline) return;

    try {
      console.log('Syncing products catalog...');
      const products = await fetchZoneProducts();
      
      if (products.length > 0) {
        await saveToStore(STORES.PRODUCTS, products);
        localStorage.setItem('db-last-updated', new Date().toISOString());
        console.log(`Synced ${products.length} products to offline storage`);
        return products.length;
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  }, [isOnline]);

  // Sync pending changes when coming back online
  const syncPendingChanges = useCallback(async () => {
    if (!isOnline) return;

    try {
      const unsyncedItems = await getUnsyncedItems();
      
      if (unsyncedItems.length === 0) return;

      console.log(`Syncing ${unsyncedItems.length} pending changes...`);

      for (const item of unsyncedItems) {
        try {
          // Process based on type
          switch (item.type) {
            case 'wishlist-add':
            case 'wishlist-remove':
              // Wishlist is local only, just mark as synced
              await markAsSynced(item.id);
              break;
              
            case 'session-update':
              // Could send to analytics or CRM in future
              await markAsSynced(item.id);
              break;
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }

      toast.success('All changes synced');
    } catch (error) {
      console.error('Error syncing pending changes:', error);
    }
  }, [isOnline]);

  // Load products from IndexedDB when offline
  const getOfflineProducts = useCallback(async () => {
    try {
      const products = await getAllFromStore(STORES.PRODUCTS);
      return products;
    } catch (error) {
      console.error('Error loading offline products:', error);
      return [];
    }
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      syncPendingChanges();
      
      // Check if catalog needs update (older than 1 hour)
      const lastUpdated = localStorage.getItem('db-last-updated');
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      if (!lastUpdated || new Date(lastUpdated).getTime() < oneHourAgo) {
        syncProductsCatalog().catch(console.error);
      }
    }
  }, [isOnline, syncPendingChanges, syncProductsCatalog]);

  return {
    isOnline,
    syncProductsCatalog,
    syncPendingChanges,
    getOfflineProducts,
  };
}
