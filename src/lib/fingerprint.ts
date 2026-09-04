/**
 * Soft supporter fingerprint generator and reader for v1 deduplication.
 * Stores a random UUID in localStorage so the user can support each idea once per browser.
 */
const FINGERPRINT_STORAGE_KEY = 'ac_supporter_fingerprint';
const SUPPORTED_IDEAS_KEY = 'ac_supported_ideas_cache';

export function getSupporterFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'ssr-fingerprint';
  }

  let fingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);
  if (!fingerprint) {
    // Generate a RFC4122 v4 UUID or pseudo-random UUID
    fingerprint = 'fp_' + crypto.randomUUID?.() || (
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
    );
    try {
      localStorage.setItem(FINGERPRINT_STORAGE_KEY, fingerprint);
    } catch {
      // Ignore localStorage quotas
    }
  }

  return fingerprint;
}

export function getLocallySupportedIdeas(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SUPPORTED_IDEAS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function recordLocallySupportedIdea(ideaId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocallySupportedIdeas();
    existing.add(ideaId);
    localStorage.setItem(SUPPORTED_IDEAS_KEY, JSON.stringify(Array.from(existing)));
  } catch {
    // Ignore localStorage quotas
  }
}
