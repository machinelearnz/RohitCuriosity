/**
 * Cryptographic hashing utility using native Web Crypto API
 * Works across all modern browsers and environments without external dependencies.
 */
export async function computeSha256(message) {
  if (!message || typeof message !== 'string') return '';
  try {
    const msgBuffer = new TextEncoder().encode(message.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Error computing SHA-256 hash:', err);
    // Simple fallback hash if crypto.subtle is restricted in non-secure context
    return fallbackHash(message.trim());
  }
}

/**
 * Fallback lightweight hash function for non-HTTPS local dev edge-cases
 */
function fallbackHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
