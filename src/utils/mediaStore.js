import { BUILTIN_MEDIA } from './builtinMedia';

/**
 * Centralized Media Store
 * 
 * Primary path (dev server running): POST image to /api/upload → file written to public/images/ → returns /images/filename.ext
 * Fallback path (no server): stores Base64 in memory for session-only live preview
 */

const MEDIA_STORAGE_KEY = 'rohit_media_store';

// In-memory runtime cache for session-only fallback
const memoryMediaStore = {};

export function getMediaStore() {
  try {
    const saved = localStorage.getItem(MEDIA_STORAGE_KEY);
    const localStore = saved ? JSON.parse(saved) : {};
    return { ...BUILTIN_MEDIA, ...localStore, ...memoryMediaStore };
  } catch (e) {
    console.error('Error reading media store:', e);
    return { ...BUILTIN_MEDIA, ...memoryMediaStore };
  }
}

/**
 * Upload an image file to the Vite dev server.
 * The server writes it to public/images/ and returns the static path.
 * Returns { success, path } or { success: false } on failure.
 */
export async function uploadImageToServer(file) {
  try {
    const dataUrl = await fileToDataUrl(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, filename: cleanName })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.path) {
        return { success: true, path: result.path };
      }
    }
    return { success: false };
  } catch (e) {
    console.warn('Server upload unavailable, falling back to memory store:', e);
    return { success: false };
  }
}

/**
 * Convert a File object to a data URL string.
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Save a media item. Prefers server upload; falls back to memory store.
 * Accepts either a File object (preferred) or a dataUrl string (legacy).
 * Returns a clean relative path like /images/img_xxx.png
 */
export async function saveMediaItemAsync(fileOrDataUrl) {
  // If it's a File object, try server upload first
  if (fileOrDataUrl instanceof File) {
    const serverResult = await uploadImageToServer(fileOrDataUrl);
    if (serverResult.success) {
      return serverResult.path;
    }
    // Fallback: read as data URL and store in memory
    const dataUrl = await fileToDataUrl(fileOrDataUrl);
    return saveMediaItemSync(dataUrl);
  }

  // It's a data URL string — try to POST it directly
  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:image/')) {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: fileOrDataUrl, filename: '' })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.path) return result.path;
      }
    } catch (e) {
      // fall through to sync fallback
    }
    return saveMediaItemSync(fileOrDataUrl);
  }

  // Already a path or URL — return as is
  return fileOrDataUrl || '';
}

/**
 * Synchronous fallback: store Base64 in memory only. Returns /images/img_xxx.png path.
 * The path will resolve at render time via resolveMediaUrl → memoryMediaStore lookup.
 */
export function saveMediaItemSync(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  const trimmed = dataUrl.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/images/')) {
    return trimmed;
  }

  const cleanDataUrl = trimmed.replace(/[\r\n\s]+/g, '');
  const fullStore = getMediaStore();
  const existingKey = Object.keys(fullStore).find(k => fullStore[k] === cleanDataUrl);
  if (existingKey) return `/images/${existingKey}.png`;

  const mediaId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  memoryMediaStore[mediaId] = cleanDataUrl;

  return `/images/${mediaId}.png`;
}

// Legacy synchronous API (kept for backward compatibility)
export const saveMediaItem = saveMediaItemSync;

/**
 * Renderer Interception:
 * Maps src starting with `media:`, `/images/`, `img_`, or `data:` to resolvable URLs.
 */
export function resolveMediaUrl(src) {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();

  if (trimmed.startsWith('media:')) {
    const mediaId = trimmed.replace('media:', '').trim();
    const store = getMediaStore();
    if (store[mediaId]) return store[mediaId];
    return `/images/${mediaId}.png`;
  }

  if (trimmed.startsWith('/images/')) {
    const filename = trimmed.replace('/images/', '').replace(/\.[^/.]+$/, '').trim();
    const store = getMediaStore();
    if (store[filename]) return store[filename];
    return trimmed; // static file path — Vite serves from public/
  }

  if (trimmed.startsWith('img_')) {
    const cleanId = trimmed.replace(/\.[^/.]+$/, '').trim();
    const store = getMediaStore();
    if (store[cleanId]) return store[cleanId];
    return `/images/${trimmed}`;
  }

  if (trimmed.startsWith('data:')) {
    return trimmed.replace(/[\r\n\s]+/g, '');
  }

  return trimmed;
}

/**
 * Replaces all media:img_xxx and /images/img_xxx.png references in markdown
 * with full resolved Data URLs — used ONLY for self-contained .md file export.
 */
export function compileMarkdownWithMedia(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') return '';
  const store = getMediaStore();

  return markdownText
    .replace(/media:(img_[a-zA-Z0-9_]+)/g, (match, mediaId) => {
      if (store[mediaId]) return store[mediaId];
      return match;
    })
    .replace(/\/images\/(img_[a-zA-Z0-9_]+)\.(png|jpg|jpeg)/g, (match, mediaId) => {
      if (store[mediaId]) return store[mediaId];
      return match;
    });
}
