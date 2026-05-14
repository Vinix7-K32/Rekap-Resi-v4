export const INVALID_ORIGIN_MESSAGE = 'Permintaan tidak valid. Muat ulang halaman lalu coba lagi.';

function readHeader(headers, name) {
  return headers?.get?.(name) ?? null;
}

function normalizeOrigin(value) {
  if (!value) return null;

  try {
    const withProtocol = value.startsWith('http://') || value.startsWith('https://')
      ? value
      : `https://${value}`;
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function getConfiguredOrigins() {
  return [
    process.env.APP_ORIGIN,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
  ]
    .flatMap((value) => value?.split(',') ?? [])
    .map((value) => normalizeOrigin(value.trim()))
    .filter(Boolean);
}

function getRequestOrigin(headers) {
  const host = readHeader(headers, 'x-forwarded-host') ?? readHeader(headers, 'host');
  if (!host) return null;

  const protocol =
    readHeader(headers, 'x-forwarded-proto') ??
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');

  return normalizeOrigin(`${protocol.split(',')[0]}://${host.split(',')[0]}`);
}

function getTrustedRedirectOrigin(headers) {
  const [configuredOrigin] = getConfiguredOrigins();

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (process.env.NODE_ENV !== 'production') {
    return getRequestOrigin(headers) ?? 'http://localhost:3000';
  }

  return null;
}

export function getTrustedRedirectUrl(headers, pathname) {
  const origin = getTrustedRedirectOrigin(headers);
  const safePathname = pathname?.startsWith('/') && !pathname.startsWith('//') ? pathname : '/';

  return origin ? new URL(safePathname, origin).toString() : undefined;
}

function getSourceOrigin(headers) {
  return normalizeOrigin(readHeader(headers, 'origin')) ?? normalizeOrigin(readHeader(headers, 'referer'));
}

export function isSameOriginRequest(headers) {
  const sourceOrigin = getSourceOrigin(headers);

  if (!sourceOrigin) {
    return process.env.NODE_ENV !== 'production';
  }

  const allowedOrigins = new Set([
    getRequestOrigin(headers),
    ...getConfiguredOrigins(),
    ...(process.env.NODE_ENV !== 'production'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : []),
  ].filter(Boolean));

  return allowedOrigins.has(sourceOrigin);
}
