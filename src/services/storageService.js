import { storage, isFirebaseConnected } from './firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

/**
 * Store product image to Firebase Storage (or optimized Blob URL fallback)
 * preventing base64 quota limit crashes in localStorage/Firestore.
 */
export const storeProductImage = async (imageInput, filename = `prod_${Date.now()}`) => {
  if (!imageInput) return null;

  // If it's already an HTTP URL (e.g. from unsplash or external CDN), return directly
  if (typeof imageInput === 'string' && (imageInput.startsWith('http://') || imageInput.startsWith('https://'))) {
    return imageInput;
  }

  // Upload to Firebase Storage if connected
  if (isFirebaseConnected && storage && typeof imageInput === 'string' && imageInput.startsWith('data:')) {
    try {
      const storageRef = ref(storage, `products/${filename}.jpg`);
      await uploadString(storageRef, imageInput, 'data_url');
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('[KalaKriti] ☁️ Uploaded product image to Firebase Storage:', downloadUrl);
      return downloadUrl;
    } catch (err) {
      console.warn('[KalaKriti] ⚠️ Firebase storage upload fallback:', err.message);
    }
  }

  // Optimized client-side Blob URL fallback to prevent localStorage 5MB quota crashes
  if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
    try {
      const arr = imageInput.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const objectUrl = URL.createObjectURL(blob);
      return objectUrl;
    } catch (_e) {
      return imageInput;
    }
  }

  return imageInput;
};
