import { useEffect } from 'react';

const SITE_NAME = 'LLC Publications Online';
const DEFAULT_DOMAIN = 'https://llcpublications.com';
const DEFAULT_IMAGE = `${DEFAULT_DOMAIN}/logo.png`;

function setMetaTag(attr, key, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url) {
  if (!url) return;
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function setStructuredData(id, schema) {
  if (!schema) return;
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema = null,
}) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title
      ? title.includes(SITE_NAME)
        ? title
        : `${title} | ${SITE_NAME}`
      : `LLC Publication New York — Cheap LLC Publication NY | Section 206`;
    document.title = fullTitle;

    // 2. Canonical URL
    const fullCanonical = canonical
      ? canonical.startsWith('http')
        ? canonical
        : `${DEFAULT_DOMAIN}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
      : `${DEFAULT_DOMAIN}${window.location.pathname}`;
    setCanonical(fullCanonical);

    // 3. Meta Description
    if (description) {
      setMetaTag('name', 'description', description);
    }

    // 4. Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    if (description) setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullCanonical);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', SITE_NAME);

    // 5. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    if (description) setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    if (schema) {
      setStructuredData('page-structured-data', schema);
    }

    return () => {
      // Optional cleanup of page-specific schema on unmount
      const script = document.getElementById('page-structured-data');
      if (script) script.remove();
    };
  }, [title, description, canonical, ogImage, ogType, schema]);

  return null;
}
