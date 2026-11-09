import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiTag, FiClock, FiShield } from 'react-icons/fi';
import { AiOutlineRight } from 'react-icons/ai';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingGrid from '../components/PricingGrid';
import OrderForm from '../components/OrderForm';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api';
import { FALLBACK_PRICES, FALLBACK_COMPARISON, FAQS } from '../data/seed';

export default function HomePage() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [faqs, setFaqs] = useState(FAQS);
  const [comparison, setComparison] = useState(FALLBACK_COMPARISON);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('Domestic');

  useEffect(() => {
    api.prices().then((items) => {
      if (items && items.length) setPrices(items);
    }).catch(() => {});
    api.faqs().then((items) => {
      if (items && items.length) setFaqs(items);
    }).catch(() => {});
    api.comparison().then((item) => {
      if (item) setComparison(item);
    }).catch(() => {});
  }, []);

  const minPrice = useMemo(() => {
    if (!prices || !prices.length) return 349;
    const valid = prices.map((p) => p.price).filter((p) => typeof p === 'number' && p > 0);
    return valid.length ? Math.min(...valid) : 349;
  }, [prices]);

  const homeSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LegalService',
          '@id': 'https://llcpublications.com/#service',
          name: 'LLC Publications',
          url: 'https://llcpublications.com',
          logo: 'https://llcpublications.com/logo.png',
          image: 'https://llcpublications.com/logo.png',
          description:
            'Affordable New York LLC newspaper publication service under Section 206. We coordinate county clerk designated newspapers, secure affidavits of publication, and file Certificates of Publication with the NY Department of State.',
          priceRange: '$349 - $1349',
          areaServed: {
            '@type': 'State',
            name: 'New York',
          },
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'NY',
            addressCountry: 'US',
          },
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://llcpublications.com/#faq',
          mainEntity: (faqs || []).map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        },
      ],
    }),
    [faqs]
  );

  return (
    <>
      <SEO
        title="LLC Publication New York — Cheap LLC Publication NY | Section 206"
        description="The lowest-priced LLC publication service in NY. We satisfy Section 206, arrange both newspapers, and file your Certificate of Publication with NY DOS. From $349 flat."
        canonical="/"
        schema={homeSchema}
      />
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-seal-wrap" aria-hidden="true">
          <svg className="hero-seal-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
            <circle cx="100" cy="100" r="85" stroke="var(--gold)" strokeWidth="1.5" opacity="0.55" />
            <circle cx="100" cy="100" r="72" stroke="var(--gold)" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.3" />
            <circle cx="100" cy="100" r="58" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            <path d="M100 15 L104 35 L124 35 L108 47 L114 67 L100 55 L86 67 L92 47 L76 35 L96 35 Z" fill="var(--gold)" opacity="0.18" />
            <path d="M100 185 L104 165 L124 165 L108 153 L114 133 L100 145 L86 133 L92 153 L76 165 L96 165 Z" fill="var(--gold)" opacity="0.18" />
            <path d="M15 100 L35 104 L35 124 L47 108 L67 114 L55 100 L67 86 L47 92 L35 76 L35 96 Z" fill="var(--gold)" opacity="0.18" />
            <path d="M185 100 L165 104 L165 124 L153 108 L133 114 L145 100 L133 86 L153 92 L165 76 L165 96 Z" fill="var(--gold)" opacity="0.18" />
            <circle cx="100" cy="100" r="42" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          </svg>
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light">
              <span className="eyebrow-rule"></span>
              {t('hero', 'seal')}
            </div>
            <h1 className="display">
              {t('hero', 'title1')}<br />
              <span className="italic gold">{t('hero', 'title2')}</span>
            </h1>
            <p className="lede">
              {t('hero', 'lede')}
            </p>
            <div className="hero-actions">
              <a href="#order" className="btn btn-gold">{t('hero', 'ctaOrder')}</a>
              <a href="#pricing" className="btn btn-ghost">{t('hero', 'ctaTariffs')}</a>
            </div>
          </div>
          <aside className="price-card" aria-label="Starting price">
            <div className="price-card-seal-badge" aria-hidden="true">NY DOS § 206</div>
            <div className="price-card-eyebrow">
              <span className="pulse-dot" aria-hidden="true"></span>
              {t('hero', 'tariffCardEyebrow')}
            </div>
            <div className="price-card-amount">${minPrice}<span className="price-card-flat">{t('hero', 'tariffCardFlat')}</span></div>
            <div className="price-card-note">{t('hero', 'tariffCardNote')}</div>
            <div className="hr"></div>
            <ul className="price-card-list">
              <li><span>{t('hero', 'b1Title')}</span><em>{t('hero', 'b1Sub')}</em></li>
              <li><span>{t('hero', 'b2Title')}</span><em>{t('hero', 'b2Sub')}</em></li>
              <li><span>{t('hero', 'b3Title')}</span><em>{t('hero', 'b3Sub')}</em></li>
              <li><span>{t('hero', 'b4Title')}</span><em>{t('hero', 'b4Sub')}</em></li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Authority Section */}
      <section className="authority" aria-label="Key Service Highlights">
        <div className="container authority-row">
          <div className="authority-item">
            <div className="authority-icon" aria-hidden="true">
              <FiFileText size={34} />
            </div>
            <div className="authority-text">
              <strong className="authority-title">{t('authority', 'item1Title')}</strong>
              <span className="authority-caption">{t('authority', 'item1Caption')}</span>
            </div>
          </div>

          <span className="authority-sep" aria-hidden="true">
            <AiOutlineRight size={22} />
          </span>

          <div className="authority-item">
            <div className="authority-icon" aria-hidden="true">
              <FiTag size={34} />
            </div>
            <div className="authority-text">
              <strong className="authority-title">${minPrice} {t('authority', 'item2Title')}</strong>
              <span className="authority-caption">{t('authority', 'item2Caption')}</span>
            </div>
          </div>

          <span className="authority-sep" aria-hidden="true">
            <AiOutlineRight size={22} />
          </span>

          <div className="authority-item">
            <div className="authority-icon" aria-hidden="true">
              <FiClock size={34} />
            </div>
            <div className="authority-text">
              <strong className="authority-title">{t('authority', 'item3Title')}</strong>
              <span className="authority-caption">{t('authority', 'item3Caption')}</span>
            </div>
          </div>

          <span className="authority-sep" aria-hidden="true">
            <AiOutlineRight size={22} />
          </span>

          <div className="authority-item">
            <div className="authority-icon" aria-hidden="true">
              <FiShield size={34} />
            </div>
            <div className="authority-text">
              <strong className="authority-title">{t('authority', 'item4Title')}</strong>
              <span className="authority-caption">{t('authority', 'item4Caption')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="why">
        <div className="container">
          <div className="section-head why-head-center">
            <div className="eyebrow">{t('why', 'eyebrow')}</div>
            <h2 className="display navy">{t('why', 'heading')}</h2>
            <p className="why-lead">
              {t('why', 'lead')}
            </p>
          </div>

          <div className="why-cards">
            <div className="why-card">
              <span className="why-card-watermark" aria-hidden="true">01</span>
              <div className="why-card-badge">{t('why', 'req1Badge')}</div>
              <h3>{t('why', 'req1Title')}</h3>
              <p>{t('why', 'req1Desc')}</p>
            </div>
            <div className="why-card">
              <span className="why-card-watermark" aria-hidden="true">02</span>
              <div className="why-card-badge">{t('why', 'req2Badge')}</div>
              <h3>{t('why', 'req2Title')}</h3>
              <p>{t('why', 'req2Desc')}</p>
            </div>
            <div className="why-card why-card-alert">
              <span className="why-card-watermark" aria-hidden="true">120D</span>
              <div className="why-card-badge why-card-badge-alert">
                <span className="alert-pulse-dot" aria-hidden="true"></span>
                {t('why', 'req3Badge')}
              </div>
              <h3>{t('why', 'req3Title')}</h3>
              <p>{t('why', 'req3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Section */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow eyebrow-light">{t('how', 'eyebrow')}</div>
            <h2 className="display light">{t('how', 'heading1')} <span className="italic gold">{t('how', 'heading2')}</span></h2>
          </div>
          <div className="steps-wrapper">
            <div className="steps-track" aria-hidden="true"></div>
            <div className="steps">
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">01</div><div className="step-time">{t('how', 's1Time')}</div></div>
                <div className="step-title">{t('how', 's1Title')}</div>
                <div className="step-desc">{t('how', 's1Desc')}</div>
              </div>
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">02</div><div className="step-time">{t('how', 's2Time')}</div></div>
                <div className="step-title">{t('how', 's2Title')}</div>
                <div className="step-desc">{t('how', 's2Desc')}</div>
              </div>
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">03</div><div className="step-time">{t('how', 's3Time')}</div></div>
                <div className="step-title">{t('how', 's3Title')}</div>
                <div className="step-desc">{t('how', 's3Desc')}</div>
              </div>
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">04</div><div className="step-time">{t('how', 's4Time')}</div></div>
                <div className="step-title">{t('how', 's4Title')}</div>
                <div className="step-desc">{t('how', 's4Desc')}</div>
              </div>
            </div>
          </div>
          <div className="cta-row">
            <a href="#order" className="btn btn-cta-gold">{t('how', 'cta')}</a>
          </div>
        </div>
      </section>

      {/* Compare Section */}
      <section className="compare">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow">{comparison.eyebrow}</div>
            <h2 className="display navy">
              {comparison.heading} <span className="italic">{comparison.headingAccent}</span>
            </h2>
          </div>
          <div className="compare-table" role="table">
            <div className="compare-row compare-head" role="row">
              {(comparison.columns || []).map((c, i) => (
                <div key={i} className={i === 1 ? 'compare-us' : ''} role="columnheader">
                  {i === 1 && <span className="compare-spotlight-tag" aria-hidden="true">Statutory Standard</span>}
                  {c}
                </div>
              ))}
            </div>
            {(comparison.rows || []).map((r, i) => (
              <div className="compare-row" role="row" key={i}>
                <div>{r.label}</div>
                <div className="compare-us-cell">{r.us}</div>
                <div>{r.them}</div>
              </div>
            ))}
          </div>
          <div className="cta-row">
            <a href={comparison.ctaHref || '#order'} className="btn btn-cta-navy">
              {comparison.ctaLabel || 'Begin Your LLC Publication →'}
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <PricingGrid
            prices={prices}
            selectedCounty={selectedCounty}
            onSelectCounty={(county, jur) => {
              setSelectedCounty(county);
              if (jur) setSelectedJurisdiction(jur);
            }}
            jurisdictionStatus={selectedJurisdiction}
            onJurisdictionChange={setSelectedJurisdiction}
          />
          <div className="cta-row">
            <a href="#order" className="btn btn-cta-navy">{t('pricing', 'cta')}</a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow">{t('testimonials', 'eyebrow')}</div>
            <h2 className="display navy">{t('testimonials', 'heading1')} <span className="italic">{t('testimonials', 'heading2')}</span></h2>
          </div>
          <div className="testimonial-grid">
            <figure className="testimonial">
              <span className="testimonial-watermark" aria-hidden="true">&ldquo;</span>
              <div className="testimonial-top">
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <span className="testimonial-verified">{t('testimonials', 'verified')}</span>
              </div>
              <blockquote>&ldquo;Our corporate attorney quoted over $1,500 for New York County publishing. LLC Publications initiated the press schedule within 48 hours and had our Certificate on file with Albany in six weeks. Entirely turnkey.&rdquo;</blockquote>
              <figcaption><strong>Elena R.</strong><span>Tech Advisory LLC, Manhattan</span></figcaption>
            </figure>
            <figure className="testimonial">
              <span className="testimonial-watermark" aria-hidden="true">&ldquo;</span>
              <div className="testimonial-top">
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <span className="testimonial-verified">{t('testimonials', 'verified')}</span>
              </div>
              <blockquote>&ldquo;The transparency is what made them stand out. Three other filing services tried to tag on $100+ rush fees. Here, fast handling was standard and communication was prompt throughout.&rdquo;</blockquote>
              <figcaption><strong>Marcus T.</strong><span>Commercial Logistics LLC, Queens</span></figcaption>
            </figure>
            <figure className="testimonial">
              <span className="testimonial-watermark" aria-hidden="true">&ldquo;</span>
              <div className="testimonial-top">
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <span className="testimonial-verified">{t('testimonials', 'verified')}</span>
              </div>
              <blockquote>&ldquo;We were 10 days away from the 120-day suspension window. They coordinated with the designated county clerk newspapers immediately and completed our state filing smoothly.&rdquo;</blockquote>
              <figcaption><strong>David K.</strong><span>Capital Holdings LLC, Brooklyn</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="order" id="order">
        <OrderForm
          prices={prices}
          selectedCounty={selectedCounty}
          selectedJurisdiction={selectedJurisdiction}
          onCountyChange={setSelectedCounty}
        />
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <div className="container faq-container">
          <div className="section-head section-head-center">
            <div className="eyebrow">{t('faq', 'eyebrow')}</div>
            <h2 className="display navy">{t('faq', 'heading')}</h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details key={f._id || f.q} defaultOpen={i === 0}>
                <summary>{f.q}</summary>
                <div
                  className="faq-body"
                  dangerouslySetInnerHTML={{ __html: f.a }}
                />
              </details>
            ))}
          </div>
          <div className="faq-more">
            <Link to="/resources">{t('faq', 'more')}</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
