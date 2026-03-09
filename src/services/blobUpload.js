/**
 * Vercel Blob upload service for Binder frontend
 * Uses VITE_BLOB_READ_WRITE_TOKEN from env (see vercel_blob.md)
 * Images over 1MB are compressed to ~500KB before upload.
 */

import { put } from '@vercel/blob';

const BLOB_TOKEN = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
const MAX_SIZE_BEFORE_COMPRESS = 1024 * 1024; // 1MB
const TARGET_SIZE_KB = 500;

/**
 * Compress an image file to approximately targetKB using canvas.
 * Used when file size exceeds MAX_SIZE_BEFORE_COMPRESS.
 */
export async function compressImageToTargetSize(file, targetKB = TARGET_SIZE_KB) {
  if (!file.type.startsWith('image/')) return file;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX_DIM = 1200;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);

      const minQuality = 0.5;
      let quality = 0.9;

      const tryCompress = () => {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKB = (dataUrl.length * 3) / 4 / 1024;
        if (sizeKB <= targetKB || quality <= minQuality) {
          const arr = dataUrl.split(',');
          const mime = (arr[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
          const bstr = atob(arr[1]);
          const u8arr = new Uint8Array(bstr.length);
          for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
          const name = file.name.replace(/\.[^.]+$/, '.jpg');
          resolve(new File([u8arr], name, { type: mime }));
        } else {
          quality = Math.max(minQuality, +(quality - 0.1).toFixed(2));
          tryCompress();
        }
      };
      tryCompress();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

/**
 * If file is an image and larger than 1MB, compress to ~500KB. Otherwise return as-is.
 */
export async function prepareImageForUpload(file) {
  if (!file || !(file instanceof File)) return file;
  if (!file.type.startsWith('image/')) return file;
  if (file.size <= MAX_SIZE_BEFORE_COMPRESS) return file;
  return compressImageToTargetSize(file, TARGET_SIZE_KB);
}

/**
 * Upload a file to Vercel Blob (public access).
 * Images over 1MB are compressed to ~500KB before upload.
 * @param {File} file - File to upload
 * @param {string} pathPrefix - Path prefix e.g. 'factory-code/artwork'
 * @returns {Promise<string>} Public URL of the uploaded blob
 */
export async function uploadToBlob(file, pathPrefix = 'binder') {
  if (!BLOB_TOKEN) {
    console.warn('VITE_BLOB_READ_WRITE_TOKEN is not set; blob upload skipped');
    return null;
  }
  const prepared = await prepareImageForUpload(file);
  const name = `${pathPrefix}/${Date.now()}-${(prepared.name || 'file').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const blob = await put(name, prepared, {
    access: 'public',
    token: BLOB_TOKEN,
  });
  return blob.url;
}

/**
 * Recursively replace File objects in a plain object with uploaded blob URLs.
 * Used before sending wizard payload to API so all images are stored in Blob and only URLs sent.
 * @param {object} obj - Object that may contain File values (or nested objects/arrays)
 * @param {string} pathPrefix - Path prefix for blob storage
 * @returns {Promise<object>} New object with Files replaced by URL strings
 */
export async function replaceFilesWithBlobUrls(obj, pathPrefix = 'binder') {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof File) {
    const url = await uploadToBlob(obj, pathPrefix);
    return url || '';
  }
  if (Array.isArray(obj)) {
    const out = [];
    for (let i = 0; i < obj.length; i++) {
      out.push(await replaceFilesWithBlobUrls(obj[i], pathPrefix));
    }
    return out;
  }
  if (typeof obj === 'object' && obj.constructor === Object) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = await replaceFilesWithBlobUrls(v, pathPrefix);
    }
    return out;
  }
  return obj;
}
