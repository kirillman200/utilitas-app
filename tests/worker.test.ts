import { describe, expect, it } from 'vitest';
import worker, { canonicalRedirectUrl, contentSecurityPolicy } from '../src/worker';
import { acceptsMarkdown, htmlToMarkdown } from '../src/agent-discovery';

describe('AdSense strict Content Security Policy', () => {
  it("uses the supplied nonce and Google's supported strict script policy", () => {
    const policy = contentSecurityPolicy('test-nonce');

    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("script-src 'nonce-test-nonce' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:");
    expect(policy).toContain("base-uri 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
});

describe('worker canonical redirects', () => {
  it('redirects www to the HTTPS apex while preserving path and query', () => {
    expect(canonicalRedirectUrl('http://www.utilitas.app/articles/?topic=privacy')).toBe(
      'https://utilitas.app/articles/?topic=privacy',
    );
  });

  it('redirects HTTP apex requests to HTTPS', () => {
    expect(canonicalRedirectUrl('http://utilitas.app/projects/')).toBe(
      'https://utilitas.app/projects/',
    );
  });

  it('redirects the legacy security.txt path to the canonical well-known path', () => {
    expect(canonicalRedirectUrl('https://utilitas.app/security.txt')).toBe(
      'https://utilitas.app/.well-known/security.txt',
    );
    expect(canonicalRedirectUrl('http://www.utilitas.app/security.txt')).toBe(
      'https://utilitas.app/.well-known/security.txt',
    );
  });

  it('leaves the canonical HTTPS origin and unrelated development hosts unchanged', () => {
    expect(canonicalRedirectUrl('https://utilitas.app/')).toBeNull();
    expect(canonicalRedirectUrl('http://localhost:4321/')).toBeNull();
  });
});

describe('agent discovery responses', () => {
  const homepage = `<!doctype html>
    <html>
      <head>
        <title>Utilitas &amp; Test</title>
        <meta name="description" content="A practical test page.">
        <script>throw new Error("must not be included")</script>
      </head>
      <body><main><h1>Projects</h1><p>Read the <a href="/projects/">catalog</a>.</p></main></body>
    </html>`;

  it('negotiates Markdown only when the media range is acceptable', () => {
    expect(acceptsMarkdown('text/markdown')).toBe(true);
    expect(acceptsMarkdown('text/html, text/markdown; q=0.8')).toBe(true);
    expect(acceptsMarkdown('text/markdown;q=0')).toBe(false);
    expect(acceptsMarkdown('text/html')).toBe(false);
  });

  it('converts useful HTML structure without executable content', () => {
    const markdown = htmlToMarkdown(homepage);
    expect(markdown).toMatch(/^# Utilitas & Test$/m);
    expect(markdown).toMatch(/^> A practical test page\.$/m);
    expect(markdown).toMatch(/^# Projects$/m);
    expect(markdown).toContain('[catalog](/projects/)');
    expect(markdown).not.toContain('must not be included');
  });

  it('returns homepage Markdown with discovery, policy, token, and cache headers', async () => {
    const assets = {
      fetch: async () =>
        new Response(homepage, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ETag: '"homepage"',
          },
        }),
      connect() {
        throw new Error('Static assets do not use socket connections.');
      },
    } satisfies Fetcher;
    const response = await worker.fetch(
      new Request('https://utilitas.app/', {
        headers: { Accept: 'text/markdown' },
      }) as never,
      { ASSETS: assets } as never,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Vary')).toBe('Accept');
    expect(response.headers.get('ETag')).toBeNull();
    expect(response.headers.get('Link')).toContain('rel="service-doc"');
    expect(response.headers.get('Link')).toContain('/.well-known/agent-skills/index.json');
    expect(response.headers.get('Content-Signal')).toBe(
      'ai-train=no, search=yes, ai-input=yes',
    );
    expect(response.headers.get('x-markdown-tokens')).toMatch(/^\d+$/);
    expect(await response.text()).toMatch(/^# Utilitas & Test$/m);
  });
});
