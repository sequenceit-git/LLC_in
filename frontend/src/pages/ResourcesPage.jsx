import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { api } from '../api';
import { FALLBACK_ARTICLES } from '../data/seed';

export default function ResourcesPage() {
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    api.articles().then((items) => {
      if (items.length) setArticles(items);
    }).catch(() => {});
  }, []);

  const tags = ['All', ...new Set(articles.map((a) => a.tag).filter(Boolean))];
  const displayedArticles = activeTag === 'All' ? articles : articles.filter((a) => a.tag === activeTag);

  const resourcesSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'New York LLC Publication Guides & Legal Resources',
    description:
      'Plain-English guides written for New York founders — covering Section 206, newspaper publication rules, county costs, and Certificate of Publication filing.',
    url: 'https://llcpublications.com/resources',
  };

  return (
    <>
      <SEO
        title="New York LLC Publication Resources & Legal Guides"
        description="Comprehensive guides for NY founders: Section 206 compliance, publication costs by county, notice examples, and Certificate of Publication filing."
        canonical="/resources"
        schema={resourcesSchema}
      />
      <Header />
      <section className="page-hero">
        <div className="hero-seal-wrap" aria-hidden="true">
          <svg className="hero-seal-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
            <circle cx="100" cy="100" r="85" stroke="var(--gold)" strokeWidth="1.5" opacity="0.55" />
            <circle cx="100" cy="100" r="72" stroke="var(--gold)" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.3" />
            <circle cx="100" cy="100" r="58" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            <path d="M100 15 L104 35 L124 35 L108 47 L114 67 L100 55 L86 67 L92 47 L76 35 L96 35 Z" fill="var(--gold)" opacity="0.18" />
            <path d="M100 185 L104 165 L124 165 L108 153 L114 133 L100 145 L86 133 L92 153 L76 165 L96 165 Z" fill="var(--gold)" opacity="0.18" />
            <circle cx="100" cy="100" r="42" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          </svg>
        </div>
        <div className="container">
          <div className="crumbs">
            <Link to="/">Home</Link> &nbsp;/&nbsp; Resources
          </div>
          <div className="eyebrow eyebrow-light">
            <span className="eyebrow-rule"></span>Articles &amp; Guides
          </div>
          <h1>
            LLC Publication <span className="italic">Resources.</span>
          </h1>
          <p>
            Plain-English guides written for New York founders — covering the legal requirement, how
            publication actually works, and the certificates banks and lenders ask for next.
          </p>
        </div>
      </section>

      <main className="resources-main">
        <div className="container">
          {tags.length > 1 && (
            <div className="resource-filter-bar">
              <span className="resource-filter-label">Filter Topic:</span>
              <div className="resource-filter-pills">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTag(t)}
                    className={`resource-filter-pill ${activeTag === t ? 'is-active' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="resources-grid">
            {displayedArticles.map((a, i) => (
              <Link key={a.slug} to={`/resources/${a.slug}`} className="resource-card">
                <span className="resource-card-num" aria-hidden="true">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <div className="resource-card-top">
                  <span className="resource-card-tag">{a.tag || 'Service'}</span>
                  <span className="resource-card-meta">{a.readingTime || '4 min read'}</span>
                </div>
                <h2>{a.title}</h2>
                <p>{a.excerpt}</p>
                <div className="resource-card-link">
                  <span>Read the article</span>
                  <span className="resource-card-arrow" aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="article-cta" style={{ margin: '0 0 96px' }}>
            <h3>Ready to satisfy Section 206?</h3>
            <p>Lowest-priced LLC publication in New York. Flat fee. All 62 counties. Filed with NY DOS.</p>
            <a href="/#order" className="btn btn-gold">
              Start Your LLC Publication →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
