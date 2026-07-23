import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { articlePath, articles } from '../src/data/articles';
import { SITE, absolute, projects, publicRoutes } from '../src/data/site';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

function outputFile(path: string) {
  if (path === '/') return join(dist, 'index.html');
  return join(dist, path.replace(/^\//, ''), 'index.html');
}

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function allFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? allFiles(path) : [path];
  });
}

describe('public route contract', () => {
  it('builds every canonical public route', () => {
    for (const route of publicRoutes) expect(existsSync(outputFile(route.path)), route.path).toBe(true);
  });

  it('gives every route complete and matching discovery metadata', () => {
    for (const route of publicRoutes) {
      const html = read(outputFile(route.path));
      expect(html, `${route.path} title`).toContain(`<title>${route.title}</title>`);
      expect(html, `${route.path} description`).toContain(`name="description" content="${route.description}"`);
      expect(html, `${route.path} canonical`).toContain(`rel="canonical" href="${absolute(route.path)}"`);
      expect(html, `${route.path} h1`).toMatch(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/);
      expect(html, `${route.path} Open Graph`).toContain(`property="og:url" content="${absolute(route.path)}"`);
      expect(html, `${route.path} share image`).toContain(`${SITE.origin}/assets/utilitas-share.png`);
      expect(html, `${route.path} SVG favicon`).toContain(
        'rel="icon" type="image/svg+xml" href="/favicon.svg"',
      );
      expect(html, `${route.path} ICO favicon`).toContain(
        'rel="icon" type="image/x-icon" href="/favicon.ico"',
      );
      expect(html, `${route.path} AdSense account`).toContain(
        'name="google-adsense-account" content="ca-pub-7469113252837951"',
      );
    }
  });

  it('keeps titles and descriptions unique', () => {
    expect(new Set(publicRoutes.map((route) => route.title)).size).toBe(publicRoutes.length);
    expect(new Set(publicRoutes.map((route) => route.description)).size).toBe(publicRoutes.length);
  });

  it('keeps internal page links inside the built public surface', () => {
    const publicPaths = new Set(publicRoutes.map((route) => route.path));
    const utilityPaths = new Set([
      '/robots.txt',
      '/sitemap.xml',
      '/llms.txt',
      '/ads.txt',
      '/.well-known/security.txt',
    ]);

    for (const route of publicRoutes) {
      const html = read(outputFile(route.path));
      const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((match) => match[1]);
      for (const href of hrefs) {
        if (href.startsWith('/assets/') || href.startsWith('/_astro/') || /\.(?:svg|ico|png|webmanifest)$/.test(href)) continue;
        expect(publicPaths.has(href) || utilityPaths.has(href), `${route.path} -> ${href}`).toBe(true);
      }
    }
  });
});

describe('project catalogue contract', () => {
  it('preserves the existing SVG Vector Lab domain', () => {
    const svg = projects.find((project) => project.slug === 'svg-vector-lab');
    expect(svg?.url).toBe('https://svgvectorlab.com/');
    expect(svg?.status).toBe('live');
  });

  it('publishes every project as live at its assigned production domain', () => {
    const home = projects.find((project) => project.slug === 'project-quantity-lab');
    const exif = projects.find((project) => project.slug === 'photo-privacy-lab');

    expect(home).toMatchObject({
      status: 'live',
      url: 'https://home.utilitas.app/',
      domainLabel: 'home.utilitas.app',
    });
    expect(exif).toMatchObject({
      status: 'live',
      url: 'https://exif.utilitas.app/',
      domainLabel: 'exif.utilitas.app',
    });
    expect(projects.every((project) => project.status === 'live')).toBe(true);

    for (const path of ['/', '/projects/']) {
      const html = read(outputFile(path));
      expect(html).toContain('home.utilitas.app');
      expect(html).toContain('exif.utilitas.app');
      expect(html).toContain('href="https://home.utilitas.app/"');
      expect(html).toContain('href="https://exif.utilitas.app/"');
    }
  });

  it('requires clear privacy text and meaningful features for every project', () => {
    for (const project of projects) {
      expect(project.description.length, project.name).toBeGreaterThan(80);
      expect(project.privacy.length, project.name).toBeGreaterThan(60);
      expect(project.features.length, project.name).toBeGreaterThanOrEqual(4);
    }
  });

  it('keeps the collection expandable and the public copy current', () => {
    const homeSource = read(join(root, 'src', 'pages', 'index.astro'));
    const headerSource = read(join(root, 'src', 'components', 'SiteHeader.astro'));
    const projectsSource = read(join(root, 'src', 'pages', 'projects', 'index.astro'));
    const home = read(outputFile('/'));
    const security = read(outputFile('/security/'));

    expect(homeSource).toContain("projects.filter((project) => project.status === 'live')");
    expect(headerSource).toContain("projects.filter((project) => project.status === 'live')");
    expect(projectsSource).not.toContain('Three tools');
    expect(home).not.toContain('Independent browser tools from Toronto, Canada.');
    expect(home).not.toContain('Advertising may be provided by Google.');
    expect(security).toContain('The short version');
    expect(security).toContain('Found something wrong?');
    expect(security).not.toContain('Supported surface');
    expect(security).not.toContain('Deployment boundary');
  });
});

describe('Field Notes content contract', () => {
  it('publishes a substantive, unique article library', () => {
    expect(articles.length).toBeGreaterThanOrEqual(6);
    expect(new Set(articles.map((article) => article.title)).size).toBe(articles.length);
    expect(new Set(articles.map((article) => article.description)).size).toBe(articles.length);

    for (const article of articles) {
      const html = read(outputFile(articlePath(article)));
      const text = html
        .replace(/<script[\s\S]*?<\/script>/g, ' ')
        .replace(/<style[\s\S]*?<\/style>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const words = text.split(' ').filter(Boolean);

      expect(words.length, `${article.slug} word count`).toBeGreaterThan(600);
      expect(html, `${article.slug} article schema`).toContain('"@type":"Article"');
      expect(html, `${article.slug} published date`).toContain(`"datePublished":"${article.published}"`);
      expect(html, `${article.slug} modified date`).toContain(`"dateModified":"${article.updated}"`);
      expect(html, `${article.slug} article hub link`).toContain('href="/articles/"');
      expect(article.sections.length, article.slug).toBeGreaterThanOrEqual(4);
      expect(article.takeaways.length, article.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it('links every article from the hub and lists it in machine-readable discovery', () => {
    const hub = read(outputFile('/articles/'));
    const llms = read(join(dist, 'llms.txt'));
    for (const article of articles) {
      expect(hub, article.slug).toContain(`href="${articlePath(article)}"`);
      expect(llms, article.slug).toContain(`${SITE.origin}${articlePath(article)}`);
      expect(llms, article.title).toContain(article.title);
    }
  });
});

describe('crawler and machine-readable contract', () => {
  it('keeps the sitemap exactly aligned with public routes', () => {
    const sitemap = read(join(dist, 'sitemap.xml'));
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toEqual(publicRoutes.map(({ path }) => absolute(path)));
  });

  it('separates AI search access from model-training access', () => {
    const robots = read(join(dist, 'robots.txt'));
    expect(robots).toContain('User-agent: OAI-SearchBot\nAllow: /');
    expect(robots).toContain('User-agent: ChatGPT-User\nAllow: /');
    expect(robots).toContain('User-agent: GPTBot\nDisallow: /');
    expect(robots).toContain(`Sitemap: ${SITE.origin}/sitemap.xml`);
  });

  it('publishes an honest agent-readable project map', () => {
    const llms = read(join(dist, 'llms.txt'));
    for (const project of projects) expect(llms).toContain(project.name);
    for (const route of publicRoutes) expect(llms).toContain(`${SITE.origin}${route.path}`);
    expect(llms).toContain('No login, accounts, public API, MCP server, A2A service, OAuth flow, or write actions exist');
    expect(llms).toContain('SVG Vector Lab remains at https://svgvectorlab.com/');
    expect(llms).toContain('Project Quantity Lab is live at https://home.utilitas.app/');
    expect(llms).toContain('Photo Privacy Lab is live at https://exif.utilitas.app/');
  });
});

describe('security, privacy, and deploy boundary', () => {
  it('publishes a current RFC 9116 security contact file', () => {
    const securityTxtPath = join(dist, '.well-known', 'security.txt');
    expect(existsSync(securityTxtPath)).toBe(true);

    const securityTxt = read(securityTxtPath);
    const expires = securityTxt.match(/^Expires:\s*(.+)$/m)?.[1];

    expect(securityTxt).toContain('Contact: https://github.com/kirillman200');
    expect(securityTxt).toContain('Contact: https://utilitas.app/contact/');
    expect(securityTxt).toContain(
      'Canonical: https://utilitas.app/.well-known/security.txt',
    );
    expect(securityTxt).toContain('Policy: https://utilitas.app/security/');
    expect(securityTxt).toContain('Preferred-Languages: en');
    expect(expires).toBeDefined();
    expect(Date.parse(expires as string)).toBeGreaterThan(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    const worker = read(join(root, 'src', 'worker.ts'));
    expect(worker).toContain("url.pathname === '/.well-known/security.txt'");
    expect(worker).toContain("'text/plain; charset=utf-8'");
  });

  it('ships the required security headers', () => {
    const worker = read(join(root, 'src', 'worker.ts'));
    for (const name of [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Permissions-Policy',
      'Referrer-Policy',
      'Cross-Origin-Opener-Policy',
    ]) expect(worker, name).toContain(name);
    expect(worker).toContain("'strict-dynamic'");
    expect(worker).toContain("element.setAttribute('nonce', nonce)");
    expect(worker).toContain("headers.set('X-Robots-Tag', 'noindex, nofollow')");

    const config = read(join(root, 'wrangler.jsonc'));
    expect(config).toContain('"main": "./src/worker.ts"');
    expect(config).toContain('"workers_dev": false');
    expect(config).toContain('"preview_urls": false');
    expect(config).toContain('"binding": "ASSETS"');
    expect(config).toContain('"run_worker_first": true');
  });

  it('loads the approved AdSense script exactly once and no other third-party runtime', () => {
    for (const route of publicRoutes) {
      const html = read(outputFile(route.path));
      const externalScripts = [...html.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)["']/gi)].map(
        (match) => match[1],
      );
      expect(externalScripts, route.path).toEqual([
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7469113252837951',
      ]);
      expect(html, route.path).not.toMatch(/<form\b/i);
    }
  });

  it('publishes the authorized seller record and advertising disclosure', () => {
    expect(read(join(dist, 'ads.txt')).trim()).toBe(
      'google.com, pub-7469113252837951, DIRECT, f08c47fec0942fa0',
    );
    const privacy = read(join(dist, 'privacy', 'index.html'));
    expect(privacy).toContain('Google AdSense');
    expect(privacy).toContain('Google-certified consent management platform');
    expect(privacy).toContain('cookies or similar technologies');
  });

  it('publishes required icons and social image', () => {
    for (const path of [
      'favicon.svg',
      'favicon.ico',
      'favicon-32.png',
      'apple-touch-icon.png',
      'icon-192.png',
      'icon-512.png',
      join('assets', 'utilitas-share.png'),
    ]) expect(existsSync(join(dist, path)), path).toBe(true);

    const ico = readFileSync(join(dist, 'favicon.ico'));
    expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    const share = readFileSync(join(dist, 'assets', 'utilitas-share.png'));
    expect(share.subarray(1, 4).toString()).toBe('PNG');
  });

  it('keeps private and source files outside dist', () => {
    const relative = allFiles(dist).map((path) => path.slice(dist.length + 1).replaceAll('\\', '/'));
    for (const blocked of ['package.json', 'wrangler.jsonc', '.env', '.git/config', 'src/data/site.ts', 'tests/site-contract.test.ts']) {
      expect(relative, blocked).not.toContain(blocked);
    }
  });

  it('uses a real static 404 document and excludes it from discovery', () => {
    const html = read(join(dist, '404.html'));
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(read(join(root, 'wrangler.jsonc'))).toContain('"not_found_handling": "404-page"');
    expect(read(join(dist, 'sitemap.xml'))).not.toContain('/404/');
  });

  it('does not contain em dashes in user-facing text or source', () => {
    const sourceFiles = allFiles(join(root, 'src')).filter((path) => /\.(astro|ts|vue|css)$/.test(path));
    for (const path of sourceFiles) expect(read(path), path).not.toContain('\u2014');
  });
});
