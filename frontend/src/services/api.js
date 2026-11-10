// API Client Service for Undangan Pernikahan Rizal & Putri

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const DIRECT_BACKEND_URL = 'http://localhost:5000/api';

/**
 * Helper to fetch with automatic fallback between Vite proxy and direct backend URL
 */
async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    // First try the configured BASE_URL (which uses Vite proxy /api)
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.ok) {
      return await res.json();
    }

    // If 404 or server error, check if direct backend URL can be reached
    if (res.status === 404 && BASE_URL !== DIRECT_BACKEND_URL) {
      const directRes = await fetch(`${DIRECT_BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
      });
      if (directRes.ok) {
        return await directRes.json();
      }
    }

    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `HTTP error ${res.status}`);
  } catch (err) {
    // If relative fetch failed entirely (e.g. proxy unavailable), attempt direct backend
    if (BASE_URL !== DIRECT_BACKEND_URL) {
      try {
        const directRes = await fetch(`${DIRECT_BACKEND_URL}${endpoint}`, {
          ...options,
          headers,
        });
        if (directRes.ok) {
          return await directRes.json();
        }
      } catch {
        // Fall through to throw original error
      }
    }
    throw err;
  }
}

/**
 * Mengambil daftar ucapan & doa dari database backend
 */
export async function getWishes(limit = 100, offset = 0) {
  return await apiFetch(`/wishes?limit=${limit}&offset=${offset}`);
}

/**
 * Mengirimkan ucapan & doa baru ke database backend
 * @param {Object} wishData - { name, category, attendance, pax, message }
 */
export async function createWish(wishData) {
  return await apiFetch('/wishes', {
    method: 'POST',
    body: JSON.stringify(wishData),
  });
}

/**
 * Mengambil ringkasan statistik RSVP & ucapan
 */
export async function getStats() {
  return await apiFetch('/stats');
}

/**
 * Mengirimkan konfirmasi pengiriman amplop/kado digital
 * @param {Object} giftData - { senderName, bankTarget, amount, notes }
 */
export async function confirmGift(giftData) {
  return await apiFetch('/gifts/confirm', {
    method: 'POST',
    body: JSON.stringify(giftData),
  });
}

/**
 * Mengambil informasi tamu undangan yang dipersonalisasi
 */
export async function getGuestInfo(guestName) {
  const query = guestName ? `?to=${encodeURIComponent(guestName)}` : '';
  return await apiFetch(`/guest${query}`);
}

