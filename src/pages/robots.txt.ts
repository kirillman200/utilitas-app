import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Content-Signal: ai-train=no, search=yes, ai-input=yes',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Content-Signal: ai-train=no, search=yes, ai-input=yes',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Content-Signal: ai-train=no, search=yes, ai-input=yes',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Content-Signal: ai-train=no, search=yes, ai-input=yes',
    'Disallow: /',
    '',
    `Sitemap: ${SITE.origin}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
