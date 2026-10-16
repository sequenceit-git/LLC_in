import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingGrid from '../components/PricingGrid';
import OrderForm from '../components/OrderForm';
import { api } from '../api';
import { FALLBACK_PRICES, FAQS } from '../data/seed';

export default function HomePage() {
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [faqs, setFaqs] = useState(FAQS);

  useEffect(() => {
    api.prices().then(setPrices).catch(() => {});
    api.faqs().then((items) => {
      if (items && items.length) setFaqs(items);
    }).catch(() => {});
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-seal" aria-hidden="true">
          <div className="hero-seal-outer"></div>
          <div className="hero-seal-inner"></div>
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light">
              <span className="eyebrow-rule"></span>
              NY Department of State Compliant
            </div>
            <h1 className="display">
              LLC Publication<br />
              <span className="italic gold">New York</span>
            </h1>
            <p className="lede">
              Satisfy Section 206 of the New York LLC Law with the lowest-priced, fully-managed publication
              service in the state. We arrange your two newspapers, file your Certificate of Publication,
              and deliver a complete record—every order treated as expedited.
            </p>
            <div className="hero-actions">
              <a href="#order" className="btn btn-gold">Start Your LLC Publication →</a>
              <a href="#pricing" className="btn btn-ghost">See County Pricing</a>
            </div>
          </div>
          <aside className="price-card" aria-label="Starting price">
            <div className="price-card-rule"></div>
            <div className="price-card-eyebrow">Starting at</div>
            <div className="price-card-amount">$349<span className="price-card-flat">flat</span></div>
            <div className="price-card-note">For most NY counties · all-inclusive</div>
            <div className="hr"></div>
            <ul className="price-card-list">
              <li><span>Two qualifying newspapers</span><em>arranged by us</em></li>
              <li><span>Six consecutive weeks of publication</span><em>managed end-to-end</em></li>
              <li><span>Affidavits of Publication</span><em>collected &amp; verified</em></li>
              <li><span>Certificate of Publication</span><em>filed with NY DOS</em></li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Authority Section */}
      <section className="authority">
        <div className="container authority-grid">
          <div className="authority-cell">
            <div className="authority-num">§ 206</div>
            <div className="authority-label">NY LLC Law compliant</div>
          </div>
          <div className="authority-cell">
            <div className="authority-num">$349</div>
            <div className="authority-label">Lowest starting price</div>
          </div>
          <div className="authority-cell">
            <div className="authority-num">No Hidden Fees</div>
            <div className="authority-label">No expedite charges</div>
          </div>
          <div className="authority-cell">
            <div className="authority-num">100% Acceptance</div>
            <div className="authority-label">Zero DOS rejections</div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="why">
        <div className="container why-grid">
          <div className="why-head">
            <div className="eyebrow">The Requirement</div>
            <h2 className="display navy">Why every NY LLC must publish.</h2>
          </div>
          <div className="why-body">
            <p>
              New York is one of only three states that requires newly formed limited liability companies
              to publish notice of their formation in two newspapers — one daily and one weekly — for
              six consecutive weeks in the county where the LLC&apos;s office is located.
            </p>
            <p>
              The newspapers must be designated by the county clerk. After publication, affidavits from
              each newspaper must be filed alongside a Certificate of Publication with the New York
              Department of State within 120 days of formation.
            </p>
            <p className="why-warn">
              <strong>Failure to comply</strong> within 120 days suspends the LLC&apos;s authority to carry on,
              conduct, or transact business in New York State.
            </p>
          </div>
        </div>
      </section>

      {/* How Section */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow eyebrow-light">Process</div>
            <h2 className="display light">Four steps. <span className="italic gold">We handle all of them.</span></h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-row"><div className="step-num">I</div><div className="step-time">Day 1</div></div>
              <div className="step-title">You place your order</div>
              <div className="step-desc">Tell us your LLC name and county. Submit payment securely. Two minutes, one form.</div>
            </div>
            <div className="step">
              <div className="step-row"><div className="step-num">II</div><div className="step-time">Day 2–3</div></div>
              <div className="step-title">We arrange the newspapers</div>
              <div className="step-desc">We contact the two clerk-designated newspapers in your county and book six weeks of publication—immediately.</div>
            </div>
            <div className="step">
              <div className="step-row"><div className="step-num">III</div><div className="step-time">Week 2–7</div></div>
              <div className="step-title">Six weeks of publication</div>
              <div className="step-desc">Notice runs in both papers, every week, for six consecutive weeks. We monitor every issue.</div>
            </div>
            <div className="step">
              <div className="step-row"><div className="step-num">IV</div><div className="step-time">Week 8–9</div></div>
              <div className="step-title">We file with NY DOS</div>
              <div className="step-desc">We collect both Affidavits, prepare the Certificate of Publication, and file everything with the Department of State.</div>
            </div>
          </div>
          <div className="cta-row">
            <a href="#order" className="btn btn-cta-gold">Get Started Now →</a>
          </div>
        </div>
      </section>

      {/* Compare Section */}
      <section className="compare">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow">The Comparison</div>
            <h2 className="display navy">Lower prices. Faster filings. <span className="italic">No surprises.</span></h2>
          </div>
          <div className="compare-table" role="table">
            <div className="compare-row compare-head" role="row">
              <div role="columnheader"></div>
              <div className="compare-us" role="columnheader">LLC Publication Online</div>
              <div role="columnheader">Other Competitors</div>
            </div>
            <div className="compare-row" role="row">
              <div>Starting price (most counties)</div>
              <div className="compare-us-cell">$349</div>
              <div>$395–$499</div>
            </div>
            <div className="compare-row" role="row">
              <div>Expedite fee</div>
              <div className="compare-us-cell">None</div>
              <div>+$75–$99</div>
            </div>
            <div className="compare-row" role="row">
              <div>Newspapers arranged for you</div>
              <div className="compare-us-cell">Yes</div>
              <div>Yes</div>
            </div>
            <div className="compare-row" role="row">
              <div>Certificate of Publication filed</div>
              <div className="compare-us-cell">Yes</div>
              <div>Sometimes / add-on</div>
            </div>
            <div className="compare-row" role="row">
              <div>Publication starts</div>
              <div className="compare-us-cell">Same week</div>
              <div>1–3 weeks</div>
            </div>
            <div className="compare-row" role="row">
              <div>Lowest-price guarantee</div>
              <div className="compare-us-cell">Yes</div>
              <div>No</div>
            </div>
          </div>
          <div className="cta-row">
            <a href="#order" className="btn btn-cta-navy">Get Started Now →</a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <PricingGrid prices={prices} />
          <div className="cta-row">
            <a href="#order" className="btn btn-cta-navy">Get Started Now →</a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-head section-head-center">
            <div className="eyebrow">Clients</div>
            <h2 className="display navy">Trusted by founders across <span className="italic">all 62 counties.</span></h2>
          </div>
          <div className="testimonial-grid">
            <figure className="testimonial">
              <div className="testimonial-quote">&ldquo;</div>
              <blockquote>Filed our publication for half what our attorney quoted. Certificate was on file with the state in five weeks. No follow-up needed.</blockquote>
              <figcaption><strong>M. Patel</strong><span>Brooklyn Restaurant Group</span></figcaption>
            </figure>
            <figure className="testimonial">
              <div className="testimonial-quote">&ldquo;</div>
              <blockquote>I called three services. This was the cheapest by $80 and the only one that didn&apos;t try to upsell me on &ldquo;expedite.&rdquo; Just a clean transaction.</blockquote>
              <figcaption><strong>J. Reyes</strong><span>Real-estate LLC, Queens</span></figcaption>
            </figure>
            <figure className="testimonial">
              <div className="testimonial-quote">&ldquo;</div>
              <blockquote>They started my publication the same week I ordered. Affidavits and Certificate of Publication were filed on day 43. Easy.</blockquote>
              <figcaption><strong>D. Cohen</strong><span>Consulting LLC, Manhattan</span></figcaption>
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
            <div className="eyebrow">Questions</div>
            <h2 className="display navy">Frequently asked.</h2>
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
            <Link to="/resources">View all guides →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
