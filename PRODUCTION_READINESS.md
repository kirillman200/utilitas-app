# Utilitas production readiness contract

This document maps the Utilitas hub to the release responsibilities in `S:\Desktop\Coding\REPLICATION_GUIDE.md`. It describes the application boundary and the checks that must remain true after deployment.

## Product and origin

- Production origin: `https://utilitas.app`
- Product promise: a public editorial hub for focused browser tools and practical Field Notes
- Primary actions: read public pages and follow a link to an independent product domain
- Account model: no accounts, login, public API, upload endpoint, database, or hub-owned write action
- Deployment boundary: Astro generates `dist/`; Cloudflare Workers Static Assets publishes that directory and `src/worker.ts` applies response protections

## Public route contract

`src/data/site.ts` is the canonical route inventory. `src/data/articles.ts` supplies the Field Notes routes that are merged into that inventory. Navigation, structured data, `sitemap.xml`, `llms.txt`, and regression tests consume these shared sources.

The public surface includes:

- Homepage and tool index
- Field Notes hub and six original guides
- About, privacy, terms, security, access, and contact pages
- A real noindex 404 page
- `robots.txt`, `sitemap.xml`, `llms.txt`, `ads.txt`, icons, and the social preview image

## Data and third parties

- The hub does not accept files, form submissions, project measurements, or account data.
- Cloudflare processes ordinary request and security information needed to deliver the site.
- Google AdSense is the only approved third-party runtime script.
- Advertising data flows and the need for region-appropriate consent are disclosed on the privacy page and in the README.
- Individual project policies apply after a visitor follows an external product link.

## Threat boundary

- Public URL requests and request headers are untrusted.
- No user-authored active content is parsed by this hub.
- Source, tests, environment files, repository data, and local tooling must remain outside `dist/`.
- Missing paths must return the configured static 404 response.
- The Worker applies a per-response script nonce, a strict Content Security Policy, transport security, framing protection, MIME sniffing protection, a referrer policy, and a restrictive permissions policy.
- Workers development origins receive a noindex response header.

## Search and article quality

Every canonical route must have a unique title, description, canonical, H1, Open Graph URL, social image, and appropriate structured data. Each Field Note must include at least four method sections, three takeaways, more than 600 rendered words, internal links, Article schema, and published and modified dates.

The sitemap is generated from the route inventory. `robots.txt` allows ordinary search, OAI-SearchBot, and user-requested ChatGPT access while disallowing GPTBot training access. `llms.txt` is a factual discovery map and does not claim an API, OAuth flow, MCP server, A2A service, or write action.

## Required release checks

Run `npm run deploy:dry` before publication. It performs static analysis, TypeScript checks, a production build, the site contract tests, Worker tests, and a Wrangler dry deployment.

After a real deployment, verify:

1. The canonical HTTPS origin and custom domain.
2. Status `200` for representative routes and status `404` for a missing route.
3. The live Content Security Policy and other security headers.
4. `robots.txt`, `sitemap.xml`, `llms.txt`, `ads.txt`, and the social preview image.
5. A homepage, tool index, Field Note hub, and individual article on mobile and desktop.
6. Google consent behavior for every region in which advertising is served.
7. Search Console ownership and sitemap submission.
8. Private paths such as `.env`, `.git/config`, `package.json`, and source files fail closed.

Local validation proves build readiness. It does not prove the custom domain, live headers, indexing, consent configuration, or production routing until those checks pass against the deployed origin.
