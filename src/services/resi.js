const API_BASE = '/api/resi';

async function requestResi(url, options) {
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
 * Add a new resi record to the database.
 * @param {Object} data - Form data
 * @param {string} data.nomor_resi
 * @param {string} data.marketplace
 * @param {string} data.kurir
 * @param {string} data.status
 * @param {string} data.tanggal
 * @param {string} [data.nama_penerima]
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function addResi(data) {
  return requestResi(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * Fetch all resi records.
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
export async function getResiList() {
  return requestResi(API_BASE, { method: 'GET', cache: 'no-store' });
}

/**
 * Delete a resi record by id.
 * @param {string|number} id
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function deleteResi(id) {
  return requestResi(`${API_BASE}/${id}`, { method: 'DELETE' });
}

/**
 * Update a resi status by id.
 * @param {string|number} id
 * @param {string} status
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function updateResiStatus(id, status) {
  return requestResi(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
