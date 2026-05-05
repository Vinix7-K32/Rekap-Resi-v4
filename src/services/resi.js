import { createClient } from '@/lib/client';

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
  const supabase = createClient();

  const { data: result, error } = await supabase
    .from('resi')
    .insert([
      {
        nomor_resi: data.nomor_resi,
        marketplace: data.marketplace,
        kurir: data.kurir,
        status: data.status,
        tanggal: data.tanggal,
        nama_penerima: data.nama_penerima || null,
      },
    ])
    .select()
    .single();

  return { data: result, error };
}

/**
 * Fetch all resi records.
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
export async function getResiList() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('resi')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Delete a resi record by id.
 * @param {string|number} id
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
export async function deleteResi(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('resi')
    .delete()
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}
