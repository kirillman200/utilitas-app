# Utilitas

The editorial home for focused browser tools and practical Field Notes at `https://utilitas.app`.

## Stack

- Astro static generation
- Vue 3 islands for purposeful interaction
- TypeScript
- Vitest site-contract tests
- Cloudflare Workers Static Assets

## Local development

```powershell
npm install
npm run dev
```

Run the complete local contract:

```powershell
npm run validate
npm run deploy:dry
```

See `PRODUCTION_READINESS.md` for the release boundary, guide mapping, and required live checks.

## Content model

`src/data/site.ts` is the source of truth for the production origin, project catalogue, and canonical public routes. `src/data/articles.ts` owns the Field Notes library. The homepage, structured data, sitemap, tests, and `llms.txt` consume these registries.

SVG Vector Lab intentionally remains at `https://svgvectorlab.com/`. Do not create a duplicate editor page or redirect that domain to Utilitas.

The live project subdomains are:

- Project Quantity Lab: `https://home.utilitas.app/`
- Photo Privacy Lab: `https://exif.utilitas.app/`

## Privacy and AI access

The hub has no accounts, forms, behavioural analytics, uploads, public API, MCP server, or agent write actions. It includes the approved Google AdSense loader and publisher metadata. Google advertising may use cookies or similar technologies according to consent choices and regional requirements. `robots.txt` allows normal crawling, OAI-SearchBot, and user-requested ChatGPT access while disallowing GPTBot model-training access by default. `llms.txt` is a concise discovery aid, not an authorization mechanism.

AdSense runs under a nonce-based strict CSP applied by `src/worker.ts`. Before serving personalised ads in the EEA, United Kingdom, or Switzerland, configure Google Privacy & messaging or another Google-certified CMP integrated with the IAB TCF.

## Deployment

Only `dist/` is exposed as static assets. Wrangler also bundles `src/worker.ts` to add security headers and per-response script nonces. Authenticate Wrangler, verify the intended Cloudflare account and custom domain, then run:

```powershell
npm run deploy
```

A successful local build is not a deployment. After release, verify canonical URLs, the custom 404 status, response headers, `robots.txt`, `sitemap.xml`, `llms.txt`, the custom domain, and that the public `workers.dev` and preview routes remain disabled.
