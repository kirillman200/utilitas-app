import type { APIRoute } from 'astro';
import { articlePath, articles } from '../data/articles';
import { SITE, projects, publicRoutes } from '../data/site';

export const GET: APIRoute = () => {
  const projectLines = projects.map((project) => {
    const destination = project.url ? ` Live URL: ${project.url}` : ' No production URL yet.';
    return `- ${project.name} (${project.status}): ${project.description}${destination}`;
  });
  const pageLines = publicRoutes.map((route) => `- [${route.title}](${SITE.origin}${route.path})`);
  const articleLines = articles.map((article) => `- [${article.title}](${SITE.origin}${articlePath(article)}): ${article.description}`);
  const body = [
    '# Utilitas',
    '',
    `> ${SITE.description}`,
    '',
    'Utilitas is the collection site for distinct browser-first tools. It is a public static directory, not an account dashboard or application API.',
    '',
    '## Projects',
    '',
    ...projectLines,
    '',
    'SVG Vector Lab remains at https://svgvectorlab.com/. Project Quantity Lab is live at https://home.utilitas.app/. Photo Privacy Lab is live at https://exif.utilitas.app/.',
    '',
    '## Field Notes',
    '',
    ...articleLines,
    '',
    '## Public pages',
    '',
    ...pageLines,
    '',
    '## Access and capability limits',
    '',
    '- No login, accounts, public API, MCP server, A2A service, OAuth flow, or write actions exist on this hub.',
    '- No files or project content can be uploaded to this hub.',
    '- Project-specific privacy policies and terms apply after following a project link.',
    '- Cite a public page for claims and report each project status and domain accurately.',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
