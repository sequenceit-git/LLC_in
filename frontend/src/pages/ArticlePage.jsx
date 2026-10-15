import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';
import { FALLBACK_ARTICLES } from '../data/seed';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const title = article?.title || 'Loading…';
  const titleBreak = ' in New York?';

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

  return (
    <>
      <Header />
      <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> &nbsp;/&nbsp; <Link to="/resources">Resources</Link> &nbsp;/&nbsp; {slug}</div>
          <div className="eyebrow eyebrow-light"><span className="eyebrow-rule"></span>Article · {article?.tag || 'Service'}</div>
          <h1 className="display">
            {title.includes(titleBreak) ? (
              <>
                <span className="italic">{title.slice(0, -titleBreak.length)}</span>
                <br />
                {titleBreak.trim()}
              </>
            ) : title}
          </h1>
          <p>{article?.excerpt || ''}</p>
        </div>
      </section>
      <main className="article">
        <div className="container article-container">
          {error && <div className="panel">Article not found. <Link to="/resources">← Back to resources</Link></div>}
          {article && (
            <>
              <div className="article-meta">
                <span><strong>Reading time:</strong> {article.readingTime}</span>
                <span><strong>Last updated:</strong> {new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <span><strong>Topic:</strong> {article.tag}</span>
              </div>
              <div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
              <div className="panel" style={{ marginTop: 40, textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 26 }}>Ready to complete your New York LLC publication?</h3>
                <a href="/#order" className="btn btn-gold">Start Your LLC Publication →</a>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
