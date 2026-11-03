import fs from 'node:fs';
import path from 'node:path';

const xml = fs.readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const distPath = new URL('../dist/', import.meta.url).pathname;
const templatePath = path.join(distPath, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.warn('dist/index.html not found, skipping SEO generation.');
  process.exit(0);
}

const template = fs.readFileSync(templatePath, 'utf8');
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

const special = {
  '/': [
    'New York LLC Publication Service | LLC Publications Online',
    'New York LLC publication assistance: newspaper notices, affidavits and Certificate of Publication filing support. Request pricing by county.',
  ],
  '/resources': [
    'New York LLC Publication Resources | LLC Publications Online',
    'Guides to New York LLC newspaper publication, Section 206 requirements, filing steps, and county costs.',
  ],
  '/privacy-policy': ['Privacy Policy | LLC Publications Online', 'Read the privacy policy for LLC Publications Online.'],
  '/terms-of-use': ['Terms of Use | LLC Publications Online', 'Read the terms of use for LLC Publications Online.'],
  '/refund-cancellation-policy': [
    'Refund and Cancellation Policy | LLC Publications Online',
    'Read the refund and cancellation policy for LLC Publications Online.',
  ],
  '/accessibility-statement': [
    'Accessibility Statement | LLC Publications Online',
    'Read the accessibility statement for LLC Publications Online.',
  ],
  '/sitemap': ['Website Sitemap | LLC Publications Online', 'Browse the pages and resources available on LLC Publications Online.'],
};

const seoDir = path.join(distPath, 'seo');
if (fs.existsSync(seoDir)) {
  fs.rmSync(seoDir, { recursive: true, force: true });
}

for (const url of urls) {
  const route = new URL(url).pathname;
  const slug = route.split('/').filter(Boolean).at(-1) || '';
  const titleText = slug
    .split('-')
    .map((w) => (w === 'llc' ? 'LLC' : w === 'ny' ? 'NY' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');

  const [title, desc] = special[route] || [
    titleText + ' | LLC Publications Online',
    'Learn about ' + titleText.toLowerCase() + ', New York LLC publication requirements and related filing steps.',
  ];

  const out = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(desc)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(desc)}" />`);

  if (route === '/' || route === '') {
    // Directly update the root index.html so the homepage has SEO metadata natively with zero dotfiles
    fs.writeFileSync(templatePath, out);
    continue;
  }

  const target = path.join(seoDir, route + '.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, out);
}

console.log(`Generated route-specific HTML SEO entrypoints`);
