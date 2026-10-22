import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" id="top">
      <div className="container nav-container">
        <Link to="/" className="brand" aria-label="LLC Publication Online — Home">
          <img src="/logo.png" alt="LLC Publication Online" className="brand-logo-img" />
          <div className="brand-text">
            <div className="brand-name">LLC Publication</div>
            <div className="brand-tag">Online · New York</div>
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
          <NavLink to="/" end>Home</NavLink>
          <a href="/#how">How It Works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
          <NavLink to="/resources">Resources</NavLink>
          <a href="/#order" className="nav-cta">Order Now</a>
        </nav>
        <div className="lang-toggle" aria-label="Language">
          <a href="#en" className="is-active">EN</a>
          <a href="#es">ES</a>
        </div>
      </div>
    </header>
  );
}
