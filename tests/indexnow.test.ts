import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const key = 'd3f6ea72914b4beb93ab13f67359ac8c';

function run(...args: string[]) {
  return spawnSync(process.execPath, ['scripts/submit-indexnow.mjs', ...args], {
    cwd: root,
    encoding: 'utf8',
  });
}

describe('IndexNow release contract', () => {
  it('publishes a valid ownership key from the site root', () => {
    expect(key).toMatch(/^[A-Za-z0-9-]{8,128}$/);
    expect(readFileSync(join(root, 'public', `${key}.txt`), 'utf8').trim()).toBe(key);
  });

  it('prepares a safe dry-run that exactly covers the built sitemap', () => {
    const result = run();
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('Prepared IndexNow request (not sent)');

    const jsonStart = result.stdout.indexOf('{');
    const jsonEnd = result.stdout.lastIndexOf('}') + 1;
    const request = JSON.parse(result.stdout.slice(jsonStart, jsonEnd));
    const sitemap = readFileSync(join(root, 'dist', 'sitemap.xml'), 'utf8');
    const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    );

    expect(request).toEqual({
      host: 'utilitas.app',
      key,
      keyLocation: `https://utilitas.app/${key}.txt`,
      urlList: sitemapUrls,
    });
  });

  it('refuses to advertise URLs outside the canonical HTTPS origin', () => {
    for (const url of ['http://utilitas.app/', 'https://example.com/']) {
      const result = run(url);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('URL must belong to https://utilitas.app');
    }
  });
});
