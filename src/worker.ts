const SECURITY_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy':
    'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), publickey-credentials-get=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
} as const;

const CANONICAL_HOSTNAME = 'utilitas.app';

export function canonicalRedirectUrl(requestUrl: string) {
  const url = new URL(requestUrl);
  const isCanonicalHost = url.hostname === CANONICAL_HOSTNAME;
  const isWwwHost = url.hostname === `www.${CANONICAL_HOSTNAME}`;
  const isLegacySecurityTxt = url.pathname === '/security.txt';

  if (
    (!isCanonicalHost && !isWwwHost) ||
    (isCanonicalHost && url.protocol === 'https:' && !isLegacySecurityTxt)
  ) {
    return null;
  }

  url.protocol = 'https:';
  url.hostname = CANONICAL_HOSTNAME;
  url.port = '';
  if (isLegacySecurityTxt) url.pathname = '/.well-known/security.txt';
  return url.toString();
}

function createNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    "object-src 'none'",
    `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    'frame-src https:',
    "font-src 'self' data: https:",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    'upgrade-insecure-requests',
  ].join('; ');
}

function applySecurityHeaders(headers: Headers) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const canonicalUrl = canonicalRedirectUrl(url.toString());

    if (canonicalUrl) {
      const headers = new Headers({
        'Cache-Control': 'public, max-age=3600',
        Location: canonicalUrl,
      });
      applySecurityHeaders(headers);
      return new Response(null, { status: 308, headers });
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);

    applySecurityHeaders(headers);
    if (url.pathname.startsWith('/_astro/')) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    if (url.pathname === '/.well-known/security.txt') {
      headers.set('Content-Type', 'text/plain; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=3600');
    }
    if (url.hostname.endsWith('.workers.dev')) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    const contentType = headers.get('Content-Type')?.toLowerCase() || '';
    if (!contentType.includes('text/html')) {
      return new Response(request.method === 'HEAD' ? null : response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    const nonce = createNonce();
    headers.set('Content-Security-Policy', contentSecurityPolicy(nonce));

    const securedResponse = new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    if (request.method === 'HEAD') return securedResponse;

    return new HTMLRewriter()
      .on('script', {
        element(element) {
          element.setAttribute('nonce', nonce);
        },
      })
      .transform(securedResponse);
  },
} satisfies ExportedHandler<Env>;
