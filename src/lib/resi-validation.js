export const MARKETPLACES = Object.freeze([
  "Shopee",
  "Tokopedia",
  "Lazada",
  "Bukalapak",
  "TikTok Shop",
]);

export const KURIRS = Object.freeze(["JNE", "J&T", "SiCepat", "Anteraja", "Pos Indonesia"]);

export const NOMOR_RESI_MIN_LENGTH = 6;
export const NOMOR_RESI_MAX_LENGTH = 40;
export const TEXT_FIELD_MAX_LENGTH = 80;

export const NOMOR_RESI_MESSAGE =
  "Nomor resi harus 6-40 karakter dan hanya berisi huruf, angka, atau tanda hubung.";
export const MARKETPLACE_MESSAGE = "Pilih marketplace yang valid.";
export const KURIR_MESSAGE = "Pilih kurir yang valid.";

const NOMOR_RESI_PATTERN = /^[A-Z0-9-]+$/;

export function normalizeNomorResi(value) {
  return String(value ?? "").trim().toUpperCase();
}

export function normalizeText(value) {
  return String(value ?? "").trim();
}

export function isValidNomorResi(value) {
  const normalized = normalizeNomorResi(value);

  return (
    normalized.length >= NOMOR_RESI_MIN_LENGTH &&
    normalized.length <= NOMOR_RESI_MAX_LENGTH &&
    NOMOR_RESI_PATTERN.test(normalized)
  );
}

export function isAllowedMarketplace(value) {
  return MARKETPLACES.includes(normalizeText(value));
}

export function isAllowedKurir(value) {
  return KURIRS.includes(normalizeText(value));
}
