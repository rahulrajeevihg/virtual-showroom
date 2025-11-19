"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { STORES, saveToStore, getAllFromStore, addToSyncQueue } from '@/lib/indexedDB';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from IndexedDB on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const stored = await getAllFromStore(STORES.WISHLIST);
        if (stored.length > 0) {
          setWishlist(stored.map((item: any) => item.itemCode));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };
    loadWishlist();
  }, []);

  const addToWishlist = async (productId: string) => {
    setWishlist(prev => [...prev, productId]);
    
    // Save to IndexedDB
    try {
      await saveToStore(STORES.WISHLIST, [{ itemCode: productId, timestamp: Date.now() }]);
      
      // Queue for sync if offline
      if (typeof window !== 'undefined' && !navigator.onLine) {
        await addToSyncQueue({
          type: 'wishlist-add',
          data: { itemCode: productId },
        });
      }
    } catch (error) {
      console.error('Error saving to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
    
    // Remove from IndexedDB
    try {
      const stored = await getAllFromStore(STORES.WISHLIST);
      const updated = stored.filter((item: any) => item.itemCode !== productId);
      await saveToStore(STORES.WISHLIST, updated);
      
      // Queue for sync if offline
      if (typeof window !== 'undefined' && !navigator.onLine) {
        await addToSyncQueue({
          type: 'wishlist-remove',
          data: { itemCode: productId },
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
