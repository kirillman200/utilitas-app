import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy } from '../src/worker';

describe('AdSense strict Content Security Policy', () => {
  it("uses the supplied nonce and Google's supported strict script policy", () => {
    const policy = contentSecurityPolicy('test-nonce');

    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("script-src 'nonce-test-nonce' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:");
    expect(policy).toContain("base-uri 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
});
