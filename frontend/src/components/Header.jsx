import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav-container">
        <Link to="/" className="brand" aria-label="LLC Publication Online — Home">
          <div className="brand-mark">L</div>
          <div className="brand-text">
            <div className="brand-name">LLC Publication</div>
            <div className="brand-tag">Online · New York</div>
          </div>
        </Link>
        <button className="nav-toggle small-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button>
        <nav className={`primary-nav ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <NavLink to="/">Home</NavLink>
          <a href="/#how">How It Works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
          <Link to="/resources">Resources</Link>
          <a href="/#order" className="nav-cta">Order Now</a>
        </nav>
        <div className="lang-toggle" aria-label="Language">
          <a href="#en" className="is-active" aria-current="true">EN</a>
          <a href="#es">ES</a>
        </div>
      </div>
    </header>
  );
}
