import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="site-header" id="top">
      <div className="container nav-container">
        <Link to="/" className="brand" aria-label="LLC Publications — Home">
          <img src="/logo.png" alt="LLC Publications" className="brand-logo-img" />
          <div className="brand-text">
            <div className="brand-name">LLC Publications</div>
            <div className="brand-tag">New York</div>
          </div>
        </Link>
        <button
          className="nav-toggle"
          id="navToggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
        <nav
          className={`primary-nav ${open ? 'open' : ''}`}
          id="primaryNav"
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" end>{t('nav', 'home')}</NavLink>
          <a href="/#how">{t('nav', 'how')}</a>
          <a href="/#pricing">{t('nav', 'pricing')}</a>
          <a href="/#faq">{t('nav', 'faq')}</a>
          <NavLink to="/resources">{t('nav', 'resources')}</NavLink>
          <a href="/#order" className="nav-cta">{t('nav', 'order')}</a>
        </nav>
        <div className="lang-toggle" aria-label="Language selector">
          <button
            type="button"
            className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}
            onClick={() => setLang('en')}
            aria-label="English"
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'es' ? 'is-active' : ''}`}
            onClick={() => setLang('es')}
            aria-label="Español"
          >
            ES
          </button>
        </div>
      </div>
    </header>
  );
}
