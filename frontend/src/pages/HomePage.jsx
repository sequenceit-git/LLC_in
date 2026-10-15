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
  useEffect(() => {
    api.prices().then(setPrices).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-seal" aria-hidden="true"></div>
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-rule"></span>NY Department of State Compliant</div>
            <h1 className="display">LLC Publication<br /><span className="italic gold">New York</span></h1>
            <p className="lede">Satisfy Section 206 of the New York LLC Law with the lowest-priced, fully-managed publication service in the state. We arrange your two newspapers, file your Certificate of Publication, and deliver a complete record—every order treated as expedited.</p>
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

      <section className="authority">
        <div className="container authority-grid">
          <div className="authority-cell"><div className="authority-num">§ 206</div><div className="authority-label">NY LLC Law compliant</div></div>
          <div className="authority-cell"><div className="authority-num">$349</div><div className="authority-label">Lowest starting price</div></div>
          <div className="authority-cell"><div className="authority-num">No Hidden Fees</div><div className="authority-label">No expedite charges</div></div>
          <div className="authority-cell"><div className="authority-num">100% Acceptance</div><div className="authority-label">Zero DOS rejections</div></div>
        </div>
      </section>

      <section className="section">
        <div className="container why-grid">
          <div><div className="eyebrow">The Requirement</div><h2 className="display navy">Why every NY LLC must publish.</h2></div>
          <div>
            <p>New York is one of only three states that requires newly formed limited liability companies to publish notice of their formation in two newspapers — one daily and one weekly — for six consecutive weeks in the county where the LLC&apos;s office is located.</p>
            <p>The newspapers must be designated by the county clerk. After publication, affidavits from each newspaper must be filed alongside a Certificate of Publication with the New York Department of State within 120 days of formation.</p>
            <p><strong>Failure to comply within 120 days suspends the LLC&apos;s authority to carry on, conduct, or transact business in New York State.</strong></p>
          </div>
        </div>
      </section>

      <section className="section how" id="how">
        <div className="container">
          <div className="eyebrow eyebrow-light"><span className="eyebrow-rule"></span>Process</div>
          <h2 className="display light">Four steps. <span className="italic gold">We handle all of them.</span></h2>
          <div className="steps">
            {[['I', 'Day 1', 'You place your order', 'Tell us your LLC name and county. Submit payment securely. Two minutes, one form.'],
              ['II', 'Day 2–3', 'We arrange the newspapers', 'We contact the two clerk-designated newspapers in your county and book six weeks of publication—immediately.'],
              ['III', 'Week 2–7', 'Six weeks of publication', 'Notice runs in both papers, every week, for six consecutive weeks. We monitor every issue.'],
              ['IV', 'Week 8–9', 'We file with NY DOS', 'We collect both Affidavits, prepare the Certificate of Publication, and file everything with the Department of State.'],
            ].map(([n, d, t, x]) => (
              <div className="step" key={n}><div className="step-num">{n}</div><div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--gold)' }}>{d}</div><div className="step-title">{t}</div><div className="step-desc">{x}</div></div>
            ))}
          </div>
          <div className="cta-row"><a href="#order" className="btn btn-cta-gold">Get Started Now →</a></div>
        </div>
      </section>

      <section className="section compare">
        <div className="container">
          <div className="eyebrow">The Comparison</div>
          <h2 className="display navy">Lower prices. Faster filings. <span className="italic">No surprises.</span></h2>
          <div className="compare-table" style={{ marginTop: 32 }}>
            <div className="compare-row head"><div></div><div>LLC Publication Online</div><div>Other Competitors</div></div>
            {[['Starting price (most counties)', '$349', '$395–$499'], ['Expedite fee', 'None', '+$75–$99'], ['Newspapers arranged for you', 'Yes', 'Yes'], ['Certificate of Publication filed', 'Yes', 'Sometimes / add-on'], ['Publication starts', 'Same week', '1–3 weeks'], ['Lowest-price guarantee', 'Yes', 'No']].map(([a, b, c]) => (
              <div className="compare-row" key={a}><div>{a}</div><div className="compare-us-cell">{b}</div><div>{c}</div></div>
            ))}
          </div>
          <div className="cta-row"><a href="#order" className="btn btn-cta-navy">Get Started Now →</a></div>
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="container">
          <div className="eyebrow">Pricing</div>
          <h2 className="display navy">Every county. <span className="italic">One flat fee.</span></h2>
          <p className="pricing-sub">Pricing is set by the county clerk&apos;s designated newspapers. We pass through the actual newspaper rates plus a single flat service fee—no expedite fees, no add-ons.</p>
          <PricingGrid prices={prices} />
          <div className="cta-row"><a href="#order" className="btn btn-cta-navy">Get Started Now →</a></div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <div className="eyebrow">Clients</div>
          <h2 className="display navy">Trusted by founders across <span className="italic">all 62 counties.</span></h2>
          <div className="testi-grid" style={{ marginTop: 32 }}>
            {[['Filed our publication for half what our attorney quoted. Certificate was on file with the state in five weeks. No follow-up needed.', 'M. Patel — Brooklyn Restaurant Group'], ['I called three services. This was the cheapest by $80 and the only one that didn’t try to upsell me on “expedite.” Just a clean transaction.', 'J. Reyes — Real-estate LLC, Queens'], ['They started my publication the same week I ordered. Affidavits and Certificate of Publication were filed on day 43. Easy.', 'D. Cohen — Consulting LLC, Manhattan']].map(([t, c]) => (
              <div className="testi" key={c}><blockquote>“{t}”</blockquote><cite>{c}</cite></div>
            ))}
          </div>
        </div>
      </section>

      <section className="order" id="order">
        <OrderForm prices={prices} />
      </section>

      <section className="faq" id="faq">
        <div className="container faq-container">
          <div className="eyebrow">Questions</div>
          <h2 className="display navy">Frequently asked.</h2>
          <div className="faq-list" style={{ marginTop: 24 }}>
            {FAQS.map((f) => <details key={f.q}><summary>{f.q}</summary><div className="faq-body">{f.a}</div></details>)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}><Link to="/resources" style={{ fontFamily: 'var(--sans)', fontWeight: 700, borderBottom: '2px solid var(--gold)' }}>View all guides →</Link></div>
        </div>
      </section>
      <Footer />
    </>
  );
}
