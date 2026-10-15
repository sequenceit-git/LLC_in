import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="footer-mark">L</span>
              <span className="footer-name">LLC Publication</span>
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.7 }}>
              New York LLC publication service specializing in newspaper publishing, affidavits,
              Certificate of Publication filings, and LLC compliance support for new businesses.
            </p>
            <a href="/#order" className="btn btn-gold" style={{ marginTop: 12 }}>Start Your LLC Publication →</a>
          </div>
          <div>
            <div className="footer-eyebrow">Service</div>
            <a href="/#how">How It Works</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faq">FAQ</a>
            <Link to="/resources">Resources</Link>
          </div>
          <div>
            <div className="footer-eyebrow">Resources</div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Refund &amp; Cancellation Policy</a>
            <Link to="/admin">Admin Panel</Link>
          </div>
          <div>
            <div className="footer-eyebrow">Contact</div>
            <a href="mailto:info@LLCPublicationOnline.com">info@LLCPublicationOnline.com</a>
            <a href="tel:+18884842204">(888) 484-2204</a>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>M–F · 8a–6p ET</span>
          </div>
        </div>
        <div className="footer-disclaimer">
          LLC Publication Online is a document preparation and retrieval service. We are not a law firm
          and do not provide any legal advice. The information on our website is for general informational
          purposes only and is not legal advice. LLC Publication Online is not affiliated with any state
          government agency. Use of our services is completely voluntary.
        </div>
        <div className="footer-bottom">
          <span>© 2026 LLC Publication Online. All rights reserved.</span>
          <span>§ 206 NY LLC Law Compliant</span>
        </div>
      </div>
    </footer>
  );
}
