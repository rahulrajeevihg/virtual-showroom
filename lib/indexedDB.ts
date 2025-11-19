// IndexedDB utility for offline storage

const DB_NAME = 'ledworld-offline';
const DB_VERSION = 1;

// Store names
export const STORES = {
  PRODUCTS: 'products',
  ZONES: 'zones',
  WISHLIST: 'wishlist',
  CUSTOMER_SESSION: 'customer-session',
  SYNC_QUEUE: 'sync-queue',
} as const;

export interface SyncQueueItem {
  id: number;
  type: 'wishlist-add' | 'wishlist-remove' | 'session-update';
  data: any;
  timestamp: number;
  synced: boolean;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Products store
      if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
        const productsStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'item_code' });
        productsStore.createIndex('zone', 'zone', { unique: false });
        productsStore.createIndex('category', 'category_list', { unique: false });
        productsStore.createIndex('brand', 'brand', { unique: false });
      }

      // Zones store
      if (!db.objectStoreNames.contains(STORES.ZONES)) {
        db.createObjectStore(STORES.ZONES, { keyPath: 'id' });
      }

      // Wishlist store
      if (!db.objectStoreNames.contains(STORES.WISHLIST)) {
        const wishlistStore = db.createObjectStore(STORES.WISHLIST, { keyPath: 'item_code' });
        wishlistStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Customer session store
      if (!db.objectStoreNames.contains(STORES.CUSTOMER_SESSION)) {
        db.createObjectStore(STORES.CUSTOMER_SESSION, { keyPath: 'id' });
      }

      // Sync queue store
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('synced', 'synced', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Save data to a store
 */
export async function saveToStore<T>(storeName: string, data: T | T[]): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  const items = Array.isArray(data) ? data : [data];

  for (const item of items) {
    store.put(item);
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Get all data from a store
 */
export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get data by key
 */
export async function getFromStore<T>(storeName: string, key: string | number): Promise<T | undefined> {
  const db = await initDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete from store
 */
export async function deleteFromStore(storeName: string, key: string | number): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear entire store
 */
export async function clearStore(storeName: string): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get by index
 */
export async function getByIndex<T>(
  storeName: string,
  indexName: string,
  value: string | number
): Promise<T[]> {
  const db = await initDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const index = store.index(indexName);

  return new Promise((resolve, reject) => {
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Add to sync queue
 */
export async function addToSyncQueue(
  item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'synced'>
): Promise<void> {
  const queueItem: Omit<SyncQueueItem, 'id'> = {
    ...item,
    timestamp: Date.now(),
    synced: false,
  };

  await saveToStore(STORES.SYNC_QUEUE, queueItem);
}

/**
 * Get unsynced items from queue
 */
export async function getUnsyncedItems(): Promise<SyncQueueItem[]> {
  const db = await initDB();
  const transaction = db.transaction(STORES.SYNC_QUEUE, 'readonly');
  const store = transaction.objectStore(STORES.SYNC_QUEUE);
  const index = store.index('synced');

  return new Promise((resolve, reject) => {
    const request = index.getAll(IDBKeyRange.only(false));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Mark item as synced
 */
export async function markAsSynced(id: number): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
  const store = transaction.objectStore(STORES.SYNC_QUEUE);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.synced = true;
        const updateRequest = store.put(item);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve();
      }
    };
    
    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Get database stats
 */
export async function getDBStats() {
  const products = await getAllFromStore(STORES.PRODUCTS);
  const wishlist = await getAllFromStore(STORES.WISHLIST);
  const syncQueue = await getUnsyncedItems();

  return {
    productsCount: products.length,
    wishlistCount: wishlist.length,
    pendingSyncCount: syncQueue.length,
    lastUpdated: localStorage.getItem('db-last-updated'),
  };
}
