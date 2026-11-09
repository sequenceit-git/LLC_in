import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { api } from '../api';
import { FALLBACK_POLICIES } from '../data/seed';

export default function PolicyPage({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;

  const fallback = FALLBACK_POLICIES.find((p) => p.slug === slug);
  const [policy, setPolicy] = useState(fallback || null);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    api
      .policy(slug)
      .then((item) => {
        if (item) setPolicy(item);
      })
      .catch((e) => {
        if (!fallback) {
          setError(e.message || 'Page not found');
        }
      });
  }, [slug]);

  const title = policy?.title || fallback?.title || 'Policy';
  const meta = policy?.meta || fallback?.meta || 'Last updated: May 2026 · LLC Publications';
  const contentHtml = policy?.contentHtml || fallback?.contentHtml || '';

  return (
    <>
      <SEO
        title={title}
        description={`${title} for LLC Publications — Section 206 New York legal compliance and publishing service.`}
        canonical={slug.startsWith('policy/') ? `/${slug}` : `/${slug}`}
      />
      <Header />
      <main className="policy">
        <div className="container policy-container">
          {error && !contentHtml ? (
            <div>
              <h1>Page Not Found</h1>
              <p>The requested legal statement could not be found.</p>
              <p>
                <Link to="/">← Return to Home</Link>
              </p>
            </div>
          ) : (
            <>
              <h1>{title}</h1>
              <div className="policy-meta">{meta}</div>
              <div
                className="policy-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
