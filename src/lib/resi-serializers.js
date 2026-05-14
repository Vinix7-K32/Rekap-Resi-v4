function serializeDateTime(value) {
  return value ? value.toISOString() : null;
}

function serializeDateOnly(value) {
  return value ? value.toISOString().split("T")[0] : null;
}

export function serializeResi(resi) {
  return {
    id: resi.id,
    nomor_resi: resi.nomor_resi,
    marketplace: resi.marketplace,
    kurir: resi.kurir,
    status: resi.status,
    tanggal: serializeDateOnly(resi.tanggal),
    nama_penerima: resi.nama_penerima ?? null,
    created_at: serializeDateTime(resi.created_at),
    updated_at: serializeDateTime(resi.updated_at),
  };
}

export function serializeMarketplaceResi(resi) {
  return {
    id: resi.id,
    nomor_resi: resi.nomor_resi,
    marketplace: resi.marketplace,
    status: resi.status,
    created_at: serializeDateTime(resi.created_at),
    updated_at: serializeDateTime(resi.updated_at),
  };
}
