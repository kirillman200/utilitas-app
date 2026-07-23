import { describe, expect, it } from 'vitest';
import { canonicalRedirectUrl, contentSecurityPolicy } from '../src/worker';

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

  it('leaves the canonical HTTPS origin and unrelated development hosts unchanged', () => {
    expect(canonicalRedirectUrl('https://utilitas.app/')).toBeNull();
    expect(canonicalRedirectUrl('http://localhost:4321/')).toBeNull();
  });
});
