# Utilitas editorial context
- Editorial hub for focused browser tools and practical Field Notes. Audience: people making, planning or protecting work using browser utilities. English en-CA; practical method, measured claims and concrete examples.
- Canonical https://utilitas.app; /sitemap.xml; /articles/ and /articles/<slug>/. Catalogue links Photo Privacy Lab, Project Quantity Lab, Mortgage Compass and SVG Vector Lab at their own domains. Do not create duplicate tools on the hub.
- Read README.md and PRODUCTION_READINESS.md. Hub has no accounts, uploads, forms or public API. Local processing does not mean that page requests and advertising cease.
- Repository-backed, no Hygraph. src/data/articles.ts owns ArticleDefinition, articles, articlePath and routes. Fields slug/title/shortTitle/description/topic/readTime/published/updated/intro/sections/takeaways/sources/relatedProject.
- src/layouts/ArticleLayout.astro and BaseLayout generate Article/Breadcrumb schema, social metadata and canonical. src/data/site.ts owns catalogue/origin; homepage, index, sitemap and llms consume registries.
- Site acceptance requires at least four method sections, three takeaways, more than 600 rendered words and internal links. Write useful substantive content; do not pad.
- Astro/Vue static dist plus src/worker.ts. npm.cmd run validate; npm.cmd run deploy:dry required before release. npm.cmd run deploy has postdeploy IndexNow hook; use installed Wrangler deploy after validation to defer submission until live verification.
- Git origin/main. IndexNow npm.cmd run indexnow:preview then npm.cmd run indexnow:submit. Preserve explicit consent and GPC; do not change analytics for article work.

## Editorial operations
Initialized from repository evidence on 2026-09-08. Never use em dash punctuation. Read AGENTS.md when present. Use current web research and a targeted duplicate-topic check before publishing. Preserve unrelated changes; stage only exact article files and a newly created context file. Verify the article, title, description, canonical, headings, complete body, links, media, social metadata, structured data, index and sitemap on the custom domain. IndexNow is last: preview, verify live prerequisites without logging the ownership key, then explicitly send. HTTP 200 means submitted; HTTP 202 means key validation pending. Neither proves indexing.
