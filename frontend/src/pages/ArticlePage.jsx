import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { api } from '../api';
import { FALLBACK_ARTICLES } from '../data/seed';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.article(slug).then(setArticle).catch((e) => {
      const fallback = FALLBACK_ARTICLES.find((item) => item.slug === slug);
      if (fallback?.contentHtml) {
        setArticle(fallback);
      } else {
        setError(e.message);
      }
    });
  }, [slug]);

  const title = article?.title || 'Loading…';
  const titleBreak = ' in New York?';

  const articleSchema = article
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt || '',
            url: `https://llcpublications.com/resources/${slug}`,
            datePublished: article.createdAt || '2026-01-01',
            dateModified: article.updatedAt || '2026-11-03',
            publisher: {
              '@type': 'Organization',
              name: 'LLC Publications Online',
              logo: {
                '@type': 'ImageObject',
                url: 'https://llcpublications.com/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://llcpublications.com/resources/${slug}`,
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://llcpublications.com/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Resources',
                item: 'https://llcpublications.com/resources',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: `https://llcpublications.com/resources/${slug}`,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      <SEO
        title={article?.title || 'LLC Publication Guide'}
        description={article?.excerpt || 'New York LLC newspaper publication guide.'}
        canonical={`/resources/${slug}`}
        ogType="article"
        schema={articleSchema}
      />
      <Header />
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <Link to="/">Home</Link> &nbsp;/&nbsp; <Link to="/resources">Resources</Link> &nbsp;/&nbsp;{' '}
            {article?.title || slug}
          </div>
          <div className="eyebrow eyebrow-light">
            <span className="eyebrow-rule"></span>Article · {article?.tag || 'Service'}
          </div>
          <h1>
            {title.includes(titleBreak) ? (
              <>
                <span className="italic">{title.slice(0, -titleBreak.length)}</span>
                <br />
                {titleBreak.trim()}
              </>
            ) : (
              <span className="italic">{title}</span>
            )}
          </h1>
          <p>{article?.excerpt || ''}</p>
        </div>
      </section>

      <main className="article">
        <div className="container article-container">
          {error && (
            <div className="article-callout">
              Article not found. <Link to="/resources">← Back to resources</Link>
            </div>
          )}
          {article && (
            <>
              <div className="article-meta">
                <span>
                  <strong>Reading time:</strong> {article.readingTime || '11 minutes'}
                </span>
                <span>
                  <strong>Last updated:</strong>{' '}
                  {article.updatedAt
                    ? new Date(article.updatedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'September 2026'}
                </span>
                <span>
                  <strong>Topic:</strong> {article.tag || 'Service'}
                </span>
              </div>

              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />

              <div className="article-cta">
                <h3>Ready to complete your New York LLC publication?</h3>
                <p>Start your order with LLC Publication Online today.</p>
                <a href="/#order" className="btn btn-gold">
                  Start Your LLC Publication →
                </a>
              </div>

              <p style={{ marginTop: 32, fontSize: 14, color: 'var(--ink-60)', fontFamily: 'var(--sans)' }}>
                <strong>Disclaimer:</strong> This article is for general informational purposes only and
                does not constitute legal advice. LLC Publication Online is not a law firm and is not
                affiliated with the New York Department of State or any government agency. For advice about
                your specific situation, consult a licensed attorney.
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
