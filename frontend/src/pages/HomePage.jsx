import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiTag, FiClock, FiShield } from 'react-icons/fi';
import { AiOutlineRight } from 'react-icons/ai';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingGrid from '../components/PricingGrid';
import OrderForm from '../components/OrderForm';
import { api } from '../api';
import { FALLBACK_PRICES, FALLBACK_COMPARISON, FAQS } from '../data/seed';

export default function HomePage() {
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [faqs, setFaqs] = useState(FAQS);
  const [comparison, setComparison] = useState(FALLBACK_COMPARISON);

  useEffect(() => {
    api.prices().then(setPrices).catch(() => {});
    api.faqs().then((items) => {
      if (items && items.length) setFaqs(items);
    }).catch(() => {});
    api.comparison().then((item) => {
      if (item) setComparison(item);
    }).catch(() => {});
  }, []);

  return (
    <>
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
              Official NY DOS Statutory Compliance
            </div>
            <h1 className="display">
              New York LLC Publication<br />
              <span className="italic gold">Handled With Precision</span>
            </h1>
            <p className="lede">
              Satisfy New York LLC Law § 206 with absolute certainty and zero attorney premiums. We coordinate your clerk-designated daily and weekly newspapers, oversee the complete 6-week publication sequence, and secure your Certificate of Publication directly from Albany.
            </p>
            <div className="hero-actions">
              <a href="#order" className="btn btn-gold">Initiate Your LLC Publication →</a>
              <a href="#pricing" className="btn btn-ghost">Explore County Tariffs</a>
            </div>
          </div>
          <aside className="price-card" aria-label="Starting price">
            <div className="price-card-seal-badge" aria-hidden="true">NY DOS § 206</div>
            <div className="price-card-eyebrow">
              <span className="pulse-dot" aria-hidden="true"></span>
              Guaranteed Flat Tariff
            </div>
            <div className="price-card-amount">$349<span className="price-card-flat">baseline</span></div>
            <div className="price-card-note">Starting rate for most NY counties · No surprise fees</div>
            <div className="hr"></div>
            <ul className="price-card-list">
              <li><span>2 Clerk-Assigned Periodicals</span><em>Daily &amp; weekly verified</em></li>
              <li><span>6 Consecutive Weeks in Print</span><em>Continuous tracking</em></li>
              <li><span>Affidavits of Publication</span><em>Retrieved &amp; authenticated</em></li>
              <li><span>Certificate of Publication</span><em>Officially filed in Albany</em></li>
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
              <strong className="authority-title">Section 206</strong>
              <span className="authority-caption">Statutory NY Compliance</span>
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
              <strong className="authority-title">$349 Flat Rate</strong>
              <span className="authority-caption">State Filing Fee Included</span>
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
              <strong className="authority-title">24-Hour Notice</strong>
              <span className="authority-caption">Fast Publisher Dispatch</span>
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
              <strong className="authority-title">100% Guaranteed</strong>
              <span className="authority-caption">Albany DOS Acceptance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="why">
        <div className="container">
          <div className="section-head why-head-center">
            <div className="eyebrow">The Legal Mandate</div>
            <h2 className="display navy">Understanding New York&apos;s 120-Day Publishing Law.</h2>
            <p className="why-lead">
              New York is one of only three states nationwide that mandates newly organized or foreign-authorized LLCs to publish notice in local print periodicals.
            </p>
          </div>

          <div className="why-cards">
            <div className="why-card">
              <span className="why-card-watermark" aria-hidden="true">01</span>
              <div className="why-card-badge">Requirement 01</div>
              <h3>Dual Periodical Designation</h3>
              <p>
                Section 206 dictates that you must place legal notice in two designated newspapers (one daily publication and one weekly publication) located specifically in the county where your LLC office was registered.
              </p>
            </div>
            <div className="why-card">
              <span className="why-card-watermark" aria-hidden="true">02</span>
              <div className="why-card-badge">Requirement 02</div>
              <h3>Six Successive Weeks in Print</h3>
              <p>
                The notices must circulate once per week for six consecutive weeks. Following the run, each publisher executes a notarized Affidavit of Publication certifying compliance with legal notice requirements.
              </p>
            </div>
            <div className="why-card why-card-alert">
              <span className="why-card-watermark" aria-hidden="true">120D</span>
              <div className="why-card-badge why-card-badge-alert">
                <span className="alert-pulse-dot" aria-hidden="true"></span>
                Strict Deadline
              </div>
              <h3>The 120-Day Suspension Rule</h3>
              <p>
                Both affidavits alongside a formal Certificate of Publication must be submitted to the Department of State within 120 days. Failure to comply results in automatic suspension of your business operating authority in New York.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Section */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow eyebrow-light">Execution Protocol</div>
            <h2 className="display light">Four steps. <span className="italic gold">We manage the entire lifecycle.</span></h2>
          </div>
          <div className="steps-wrapper">
            <div className="steps-track" aria-hidden="true"></div>
            <div className="steps">
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">01</div><div className="step-time">Day 1</div></div>
                <div className="step-title">Online Intake</div>
                <div className="step-desc">Enter your entity particulars and formation county in under two minutes via our encrypted checkout.</div>
              </div>
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">02</div><div className="step-time">Days 2–3</div></div>
                <div className="step-title">Press Assignment &amp; Scheduling</div>
                <div className="step-desc">We match clerk-designated periodicals in your county and immediately book the 6-week publication sequence.</div>
              </div>
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">03</div><div className="step-time">Weeks 2–7</div></div>
                <div className="step-title">Active Print Circulation</div>
                <div className="step-desc">Your notice appears weekly in both print editions. We monitor tearsheets across every scheduled issue.</div>
              </div>
              <div className="step">
                <div className="step-node" aria-hidden="true"></div>
                <div className="step-row"><div className="step-num">04</div><div className="step-time">Weeks 8–9</div></div>
                <div className="step-title">Albany DOS Filing &amp; Evidence</div>
                <div className="step-desc">We retrieve sworn affidavits, prepare and file your Certificate of Publication, and deliver stamped proof.</div>
              </div>
            </div>
          </div>
          <div className="cta-row">
            <a href="#order" className="btn btn-cta-gold">Initiate Your Publication →</a>
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
          <PricingGrid prices={prices} />
          <div className="cta-row">
            <a href="#order" className="btn btn-cta-navy">Proceed to Order Form →</a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow">Verified Reviews</div>
            <h2 className="display navy">Trusted by New York founders across <span className="italic">all 62 counties.</span></h2>
          </div>
          <div className="testimonial-grid">
            <figure className="testimonial">
              <span className="testimonial-watermark" aria-hidden="true">&ldquo;</span>
              <div className="testimonial-top">
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <span className="testimonial-verified">✓ Verified Filing</span>
              </div>
              <blockquote>&ldquo;Our corporate attorney quoted over $1,500 for New York County publishing. LLC Publication Online initiated the press schedule within 48 hours and had our Certificate on file with Albany in six weeks. Entirely turnkey.&rdquo;</blockquote>
              <figcaption><strong>Elena R.</strong><span>Tech Advisory LLC, Manhattan</span></figcaption>
            </figure>
            <figure className="testimonial">
              <span className="testimonial-watermark" aria-hidden="true">&ldquo;</span>
              <div className="testimonial-top">
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <span className="testimonial-verified">✓ Verified Filing</span>
              </div>
              <blockquote>&ldquo;The transparency is what made them stand out. Three other filing services tried to tag on $100+ rush fees. Here, fast handling was standard and communication was prompt throughout.&rdquo;</blockquote>
              <figcaption><strong>Marcus T.</strong><span>Commercial Logistics LLC, Queens</span></figcaption>
            </figure>
            <figure className="testimonial">
              <span className="testimonial-watermark" aria-hidden="true">&ldquo;</span>
              <div className="testimonial-top">
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <span className="testimonial-verified">✓ Verified Filing</span>
              </div>
              <blockquote>&ldquo;We were 10 days away from the 120-day suspension window. They coordinated with the designated county clerk newspapers immediately and completed our state filing smoothly.&rdquo;</blockquote>
              <figcaption><strong>David K.</strong><span>Capital Holdings LLC, Brooklyn</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="order" id="order">
        <OrderForm prices={prices} />
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <div className="container faq-container">
          <div className="section-head section-head-center">
            <div className="eyebrow">Statutory Inquiries</div>
            <h2 className="display navy">Frequently asked compliance questions.</h2>
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
            <Link to="/resources">Explore All Publishing Guides &amp; Articles →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
