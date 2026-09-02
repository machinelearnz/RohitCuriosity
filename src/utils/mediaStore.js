/**
 * Centralized Media Store for local uploaded images
 * Maps short media IDs (e.g. media:img_1788377921874) to Base64 Data URLs.
 * Keeps Markdown clean, readable, and prevents Markdown AST parsing errors on long Base64 strings.
 */

const MEDIA_STORAGE_KEY = 'rohit_media_store';

export function getMediaStore() {
  try {
    const saved = localStorage.getItem(MEDIA_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Error reading media store:', e);
    return {};
  }
}

export function saveMediaItem(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  
  // If it's already an HTTPS URL or media ID, return as is
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('media:')) {
    return dataUrl;
  }

  // Clean data URL string
  const cleanDataUrl = dataUrl.replace(/[\r\n\s]+/g, '');

  try {
    const store = getMediaStore();
    const mediaId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    store[mediaId] = cleanDataUrl;
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(store));
    return `media:${mediaId}`;
  } catch (e) {
    console.warn('LocalStorage size limit exceeded for media store, fallback to inline clean data URL:', e);
    return cleanDataUrl;
  }
}

export function resolveMediaUrl(src) {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();

  // Handle media:img_xxx format
  if (trimmed.startsWith('media:')) {
    const mediaId = trimmed.replace('media:', '');
    const store = getMediaStore();
    if (store[mediaId]) {
      return store[mediaId];
    }
  }

  // Handle raw img_xxx format
  if (trimmed.startsWith('img_')) {
    const store = getMediaStore();
    if (store[trimmed]) {
      return store[trimmed];
    }
  }

  // Handle direct Data URLs by stripping line breaks
  if (trimmed.startsWith('data:')) {
    return trimmed.replace(/[\r\n\s]+/g, '');
  }

  return trimmed;
}
