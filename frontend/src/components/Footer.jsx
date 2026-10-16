import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <div className="footer-mark">L</div>
              <div className="footer-name">LLC Publication</div>
            </div>
            <p>
              New York LLC publication service specializing in newspaper publishing, affidavits,
              Certificate of Publication filings, and LLC compliance support for new businesses.
            </p>
            <p>
              <a href="/#order">Start Your LLC Publication →</a>
            </p>
          </div>
          <div>
            <div className="footer-eyebrow">Service</div>
            <a href="/#how">How It Works</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faq">FAQ</a>
            <Link to="/resources">Resources</Link>
            <a href="https://portal.llcpublicationonline.com/" target="_blank" rel="noopener noreferrer">
              Track Your Order
            </a>
          </div>
          <div>
            <div className="footer-eyebrow">Resources</div>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/refund-cancellation-policy">Refund &amp; Cancellation Policy</Link>
            <Link to="/accessibility-statement">Accessibility Statement</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <div>
            <div className="footer-eyebrow">Contact</div>
            <a href="mailto:info@LLCPublicationOnline.com">info@LLCPublicationOnline.com</a>
            <a href="tel:+18884842204">(888) 484-2204</a>
            <span className="footer-hours">M–F · 8a–6p ET</span>
          </div>
        </div>
        <div className="footer-disclaimer">
          LLC Publication Online is a document preparation and retrieval service. We are not a law firm
          and do not provide any legal advice. The information on our website is for general informational
          purposes only and is not legal advice. LLC Publication Online is not affiliated with any state
          government agency. Use of our services is completely voluntary.
        </div>
        <div className="footer-bottom">
          <div>© 2026 LLC Publication Online. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
