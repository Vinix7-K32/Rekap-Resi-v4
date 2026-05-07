const API_BASE = '/api/marketplace-resi';

async function requestMarketplace(url, options) {
  try {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        data: null,
        error: payload?.error ?? { message: 'Terjadi kesalahan pada server.' },
      };
    }

    return { data: payload?.data ?? null, error: null };
  } catch (error) {
    return { data: null, error: { message: 'Terjadi kesalahan tak terduga.' } };
  }
}

/**
 * Fetch all marketplace resi records.
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
export async function getMarketplaceResiList() {
  return requestMarketplace(API_BASE, { method: 'GET', cache: 'no-store' });
}

/**
 * Add a marketplace resi record.
 * @param {Object} data
 * @param {string} data.nomor_resi
 * @param {string} data.marketplace
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function addMarketplaceResi(data) {
  return requestMarketplace(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * Delete a marketplace resi record by id.
 * @param {string|number} id
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function deleteMarketplaceResi(id) {
  return requestMarketplace(`${API_BASE}/${id}`, { method: 'DELETE' });
}

/**
 * Delete all marketplace resi records.
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function deleteAllMarketplaceResi() {
  return requestMarketplace(API_BASE, { method: 'DELETE' });
}
