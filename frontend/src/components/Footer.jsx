import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <img src="/logo.png" alt="LLC Publication Online" className="footer-logo-img" />
              <div className="footer-name">LLC Publication</div>
            </div>
            <p>
              {t('footer', 'desc')}
            </p>
            <p>
              <a href="/#order">{t('footer', 'cta')}</a>
            </p>
          </div>
          <div>
            <div className="footer-eyebrow">{t('footer', 'colService')}</div>
            <a href="/#how">{t('nav', 'how')}</a>
            <a href="/#pricing">{t('nav', 'pricing')}</a>
            <a href="/#faq">{t('nav', 'faq')}</a>
            <Link to="/resources">{t('nav', 'resources')}</Link>
            <a href="https://portal.llcpublicationonline.com/" target="_blank" rel="noopener noreferrer">
              {t('footer', 'trackOrder')}
            </a>
          </div>
          <div>
            <div className="footer-eyebrow">{t('footer', 'colResources')}</div>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/refund-cancellation-policy">Refund &amp; Cancellation Policy</Link>
            <Link to="/accessibility-statement">Accessibility Statement</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <div>
            <div className="footer-eyebrow">{t('footer', 'colContact')}</div>
            <a href="mailto:info@LLCPublicationOnline.com">info@LLCPublicationOnline.com</a>
            <a href="tel:+18884842204">(888) 484-2204</a>
            <span className="footer-hours">{t('footer', 'hours')}</span>
          </div>
        </div>
        <div className="footer-disclaimer">
          {t('footer', 'disclaimer')}
        </div>
        <div className="footer-bottom">
          <div>© 2026 LLC Publication Online. {t('footer', 'rights')}</div>
        </div>
      </div>
    </footer>
  );
}
