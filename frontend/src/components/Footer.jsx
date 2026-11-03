import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContact } from '../context/ContactContext';

export default function Footer() {
  const { t } = useLanguage();
  const { contact } = useContact();

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
            <a href={contact.portalUrl || 'https://portal.llcpublicationonline.com/'} target="_blank" rel="noopener noreferrer">
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
            <a href={`mailto:${contact.email || 'info@llcpublications.com'}`}>{contact.email || 'info@llcpublications.com'}</a>
            <a href={`tel:${(contact.phone || '(888) 484-2204').replace(/[^0-9+]/g, '')}`}>{contact.phone || '(888) 484-2204'}</a>
            <span className="footer-hours">{contact.hours || t('footer', 'hours')}</span>
            {contact.address && <span className="footer-hours">{contact.address}</span>}
          </div>
        </div>
        <div className="footer-disclaimer">
          {t('footer', 'disclaimer')}
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} {contact.legalName || 'LLC Publication Online'}. {t('footer', 'rights')}</div>
        </div>
      </div>
    </footer>
  );
}
