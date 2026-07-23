import { articlePath, articles } from './articles';

export const SITE = {
  name: 'Utilitas',
  origin: 'https://utilitas.app',
  title: 'Utilitas | Practical browser tools and field-tested guides',
  description:
    'Use focused browser tools and practical guides for creative work, project planning, privacy, and other everyday tasks, with clear limits and data boundaries.',
  shortDescription: 'Practical tools. Clear methods. No account required.',
  locale: 'en_CA',
  ownerUrl: 'https://github.com/kirillman200',
} as const;

export type ProjectStatus = 'live' | 'in-development';
export type ProjectCategory = 'create' | 'plan' | 'protect';

export interface ProjectDefinition {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  url?: string;
  domainLabel?: string;
  features: string[];
  privacy: string;
  accent: 'coral' | 'blue' | 'green';
  monogram: string;
}

export const projects: ProjectDefinition[] = [
  {
    slug: 'svg-vector-lab',
    name: 'SVG Vector Lab',
    eyebrow: 'Create with vectors',
    description:
      'Edit real SVG markup, shapes, paths, attributes, and points in a focused browser workspace, then export clean SVG or PNG files.',
    category: 'create',
    status: 'live',
    url: 'https://svgvectorlab.com/',
    domainLabel: 'svgvectorlab.com',
    features: ['Direct path editing', 'Live SVG source', 'Local autosave', 'SVG and PNG export'],
    privacy: 'Files and edits stay in your browser unless you choose to download or share them.',
    accent: 'coral',
    monogram: 'SV',
  },
  {
    slug: 'project-quantity-lab',
    name: 'Project Quantity Lab',
    eyebrow: 'Plan home projects',
    description:
      'Build auditable material, cost, and shopping-list estimates for paint, flooring, landscaping, concrete, and fencing.',
    category: 'plan',
    status: 'live',
    url: 'https://home.utilitas.app/',
    domainLabel: 'home.utilitas.app',
    features: ['Multiple project areas', 'Metric and imperial units', 'Printable shopping lists', 'Local project saving'],
    privacy: 'Plans are designed to stay on the device, with explicit sharing only when you request it.',
    accent: 'blue',
    monogram: 'PQ',
  },
  {
    slug: 'photo-privacy-lab',
    name: 'Photo Privacy Lab',
    eyebrow: 'Protect before sharing',
    description:
      'Scan photos for location and device metadata, create cleaner copies, redact visible details, and verify the output before sharing.',
    category: 'protect',
    status: 'live',
    url: 'https://exif.utilitas.app/',
    domainLabel: 'exif.utilitas.app',
    features: ['Metadata risk scan', 'Local clean-copy export', 'Manual redaction', 'Independent output verification'],
    privacy: 'Selected photos are processed locally in the browser and are not uploaded by the tool.',
    accent: 'green',
    monogram: 'PP',
  },
];

const coreRoutes = [
  {
    path: '/',
    title: SITE.title,
    description: SITE.description,
    kind: 'home',
  },
  {
    path: '/projects/',
    title: 'Projects | Utilitas',
    description: 'Explore every live Utilitas browser tool for creating, planning, and protecting everyday work.',
    kind: 'projects',
  },
  {
    path: '/articles/',
    title: 'Practical browser tool guides | Utilitas Field Notes',
    description: 'Read practical, original guides for editing SVG files, estimating project materials, protecting photo privacy, and choosing browser-first tools.',
    kind: 'articles',
  },
  {
    path: '/about/',
    title: 'About | Utilitas',
    description: 'Why Utilitas builds focused browser tools around practical outcomes, clear limits, and respectful data boundaries.',
    kind: 'trust',
  },
  {
    path: '/privacy/',
    title: 'Privacy | Utilitas',
    description: 'What the Utilitas hub collects, what Cloudflare may process, and how individual project privacy policies apply.',
    kind: 'trust',
  },
  {
    path: '/terms/',
    title: 'Terms | Utilitas',
    description: 'The terms, limitations, and responsibilities that apply when using the Utilitas hub and its project links.',
    kind: 'trust',
  },
  {
    path: '/security/',
    title: 'Security | Utilitas',
    description: 'How the Utilitas hub is protected, what falls outside its control, and how to report a security problem safely.',
    kind: 'trust',
  },
  {
    path: '/access/',
    title: 'Access for People and Agents | Utilitas',
    description: 'How people, search engines, and AI systems may access the public Utilitas site and what actions do not exist.',
    kind: 'trust',
  },
  {
    path: '/contact/',
    title: 'Contact | Utilitas',
    description: 'Where to send project feedback, accessibility reports, corrections, and security concerns for Utilitas tools.',
    kind: 'trust',
  },
];

export const articleRoutes = articles.map((article) => ({
  path: articlePath(article),
  title: `${article.title} | Utilitas`,
  description: article.description,
  kind: 'article',
}));

export const publicRoutes = [...coreRoutes, ...articleRoutes];

export function absolute(path: string) {
  return new URL(path, SITE.origin).toString();
}

export function statusLabel(status: ProjectStatus) {
  return status === 'live' ? 'Live' : 'In development';
}
