import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';
import { FALLBACK_ARTICLES } from '../data/seed';

export default function ResourcesPage() {
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
  useEffect(() => {
    api.articles().then((items) => {
      if (items.length) setArticles(items);
    }).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> &nbsp;/&nbsp; Resources</div>
          <div className="eyebrow eyebrow-light"><span className="eyebrow-rule"></span>Articles &amp; Guides</div>
          <h1 className="display">LLC Publication <span className="italic">Resources.</span></h1>
          <p>
            Plain-English guides written for New York founders — covering the legal requirement, how publication actually works, and the certificates banks and lenders ask for next.
          </p>
        </div>
      </section>
      <main>
        <div className="container">
          <div className="resources-grid">
            {articles.map((a) => (
              <Link key={a.slug} to={`/resources/${a.slug}`} className="resource-card">
                <div className="resource-card-tag">{a.tag || 'Service'}</div>
                <h2>{a.title}</h2>
                <p>{a.excerpt}</p>
                <div className="resource-card-link">Read the article</div>
              </Link>
            ))}
          </div>
          <div className="panel" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 28 }}>Ready to satisfy Section 206?</h3>
            <p style={{ fontFamily: 'var(--sans)' }}>Lowest-priced LLC publication in New York. Flat fee. All 62 counties. Filed with NY DOS.</p>
            <a href="/#order" className="btn btn-gold">Start Your LLC Publication →</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
