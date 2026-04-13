// Background Sync Manager for offline form submissions

export async function registerBackgroundSync(tag = 'sync-form-data') {
  try {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log('Background sync registered:', tag);
    }
  } catch (error) {
    console.log('Background sync registration failed:', error);
  }
}

// Store failed submission for retry
export async function storeFailedSubmission(data) {
  try {
    const db = await openIndexDB();
    const store = db.transaction(['failedSubmissions'], 'readwrite').objectStore('failedSubmissions');
    const id = `${Date.now()}-${Math.random()}`;
    store.add({ id, data, timestamp: Date.now() });
    
    // Request background sync
    await registerBackgroundSync('sync-property-submission');
    
    return id;
  } catch (error) {
    console.error('Failed to store submission:', error);
  }
}

// Listen for sync notifications from Service Worker
export function listenForSyncNotifications(callback) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'sync-success') {
        callback(event.data);
      }
    });
  }
}

// Open IndexedDB database
function openIndexDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('kemedar-db', 1);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('failedSubmissions')) {
        db.createObjectStore('failedSubmissions', { keyPath: 'id' });
      }
    };
  });
}

// Get all failed submissions from IndexedDB
export async function getFailedSubmissions() {
  try {
    const db = await openIndexDB();
    return new Promise((resolve, reject) => {
      const store = db.transaction(['failedSubmissions'], 'readonly').objectStore('failedSubmissions');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get submissions:', error);
    return [];
  }
}

// Remove submission after successful sync
export async function removeSubmission(id) {
  try {
    const db = await openIndexDB();
    const store = db.transaction(['failedSubmissions'], 'readwrite').objectStore('failedSubmissions');
    store.delete(id);
  } catch (error) {
    console.error('Failed to remove submission:', error);
  }
}

// Check if online and show toast notification
export function checkConnectionAndNotify() {
  if (!navigator.onLine) {
    return {
      isOffline: true,
      message: '📤 Your listing was saved and will be submitted when you\'re back online.'
    };
  }
  return { isOffline: false };
}