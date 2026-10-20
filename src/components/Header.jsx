import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";

/* ─── Design-System Styles (Rebuilt for Sidebar Layout Perfection) ───────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Header Shell ── */
  .hdr-root {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #ffffff;
    border-bottom: 1px solid #edf2f7;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    font-family: 'Inter', sans-serif;
  }

  .hdr-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 28px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  /* ── Logo ── */
  .hdr-logo img {
    height: 40px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  /* ── Desktop Nav ── */
  .hdr-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .hdr-nav-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.01em;
    border: 1px solid transparent;
  }

  .hdr-nav-link:hover {
    color: #2563eb;
    background: rgba(59,130,246,0.06);
    border-color: rgba(59,130,246,0.1);
  }

  .hdr-nav-link svg {
    transition: transform 0.2s;
    flex-shrink: 0;
  }

  .hdr-nav-item {
    position: relative;
  }

  /* ── Dropdown Panel ── */
  .hdr-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 280px;
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.02);
    z-index: 9999;
    padding: 8px;
    animation: hdr-pop 0.18s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes hdr-pop {
    from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.97); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0)   scale(1);    }
  }

  .hdr-dd-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.12s;
  }

  .hdr-dd-item:hover { background: rgba(59,130,246,0.05); }

  .hdr-dd-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    color: #3B82F6;
  }

  .hdr-dd-title {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.3;
  }

  .hdr-dd-desc {
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 500;
    margin-top: 1px;
    line-height: 1.4;
  }

  .hdr-dd-footer {
    border-top: 1px solid #f1f5f9;
    margin-top: 6px;
    padding: 10px 12px 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hdr-dd-footer-label {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .hdr-social-icons {
    display: flex;
    gap: 10px;
    align-items: center;
    color: #3B82F6;
  }

  .hdr-social-icons svg {
    cursor: pointer;
    width: 16px;
    height: 16px;
    transition: color 0.15s, transform 0.15s;
  }

  .hdr-social-icons svg:hover { color: #1d4ed8; transform: translateY(-1px); }

  /* ── Desktop Login Button ── */
  .hdr-login-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 22px;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    color: #ffffff;
    text-decoration: none;
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    box-shadow: 0 4px 14px rgba(59,130,246,0.25);
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.01em;
    border: none;
    white-space: nowrap;
  }

  .hdr-login-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.35);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }

  .hdr-login-btn:active { transform: translateY(0); }

  /* ── Mobile Hamburger ── */
  .hdr-hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.12);
    cursor: pointer;
    color: #2563eb;
    transition: all 0.15s;
  }

  .hdr-hamburger:hover {
    background: rgba(59,130,246,0.1);
    border-color: rgba(59,130,246,0.2);
  }

  /* ── Mobile Overlay ── */
  .hdr-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.3);
    backdrop-filter: blur(4px);
    z-index: 999;
  }

  /* ── Rebuilt Premium Mobile Sidebar ── */
  .hdr-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 300px;
    background: #ffffff;
    z-index: 1000;
    box-shadow: -8px 0 40px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    padding: 20px 16px; /* Reduced padding for cleaner profile */
    animation: hdr-slide 0.25s cubic-bezier(0.16,1,0.3,1);
    font-family: 'Inter', sans-serif;
  }

  @keyframes hdr-slide {
    from { transform: translateX(100%); }
    to   { transform: translateX(0);    }
  }

  .hdr-sidebar-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px; /* Tighter spacing */
    background: #ffffff;
  }

  .hdr-sidebar-brand {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 19px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.02em;
  }

  .hdr-sidebar-brand span { color: #3B82F6; }

  .hdr-close-btn {
    width: 34px; /* Slightly smaller box height profile */
    height: 34px;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.15s ease;
    font-size: 13px;
  }

  .hdr-close-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #334155;
  }

  .hdr-sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px; /* Reduced tracking gap row size */
  }

  .hdr-mob-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px; /* Clean, compact line item sizes */
    border-radius: 10px;
    font-size: 14.5px;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
    border: 1px solid transparent;
  }

  .hdr-mob-link:hover {
    color: #1e293b;
    background: #f8fafc;
  }

  .hdr-mob-link.active-route {
    color: #2563eb;
    background: #f0f5ff;
    font-weight: 700;
  }

  /* Compact button dimensions placed directly beneath list items */
  .hdr-mob-login {
    display: block;
    width: 100%;
    text-align: center;
    padding: 11px 0; /* Compact button height */
    border-radius: 10px;
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    color: #ffffff;
    font-size: 14.5px;
    font-weight: 700;
    text-decoration: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(59,130,246,0.2);
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    letter-spacing: 0.01em;
    margin-top: 12px; 
    border: none;
  }

  .hdr-mob-login:hover {
    box-shadow: 0 6px 16px rgba(59,130,246,0.3);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
    transform: translateY(-1px);
  }

  .hdr-mob-login:active {
    transform: translateY(0);
  }

  /* ── Responsive ── */
  @media(max-width: 768px) {
    .hdr-nav       { display: none; }
    .hdr-login-btn { display: none; }
    .hdr-hamburger { display: flex; }
    .hdr-inner     { padding: 0 16px; }
  }
`;

/* ─── NAV DATA ──────────────────────────────────────────────────────────── */
const SERVICES_ITEMS = [
  { title: "Implementation",  desc: "System setup & deployment"         },
  { title: "Customization",   desc: "Workflow & report configuration"   },
  { title: "Integration",     desc: "ERP, CRM & API connectivity"       },
  { title: "Training",        desc: "Onboarding & live assistance"      },
  { title: "Support",         desc: "24/7 technical help & updates"     },
];

const ABOUT_ITEMS = [
  { title: "Our Mission",          desc: "Purpose behind MR Reporting"    },
  { title: "Our Vision",           desc: "Future of pharma automation"    },
  { title: "Client Testimonials",  desc: "What our clients say"           },
];

/* ─── HEADER ────────────────────────────────────────────────────────────── */
function Header() {
  const [open,        setOpen]        = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [showAbout,   setShowAbout]   = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active-route" : "";

  return (
    <>
      <style>{STYLES}</style>

      <header className="hdr-root">
        <div className="hdr-inner">

          {/* LOGO */}
          <div className="hdr-logo">
            <img src={logo} alt="MR Reporting Logo" />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hdr-nav">

            <Link to="/" className="hdr-nav-link">Home</Link>

            {/* Services */}
            <div
              className="hdr-nav-item"
              onMouseEnter={() => setShowModules(true)}
              onMouseLeave={() => setShowModules(false)}
            >
              <Link to="/Services" className="hdr-nav-link">
                Services
                <ArrowIcon open={showModules} />
              </Link>
              {showModules && <DropdownCard items={SERVICES_ITEMS} />}
            </div>

            {/* About */}
            <div
              className="hdr-nav-item"
              onMouseEnter={() => setShowAbout(true)}
              onMouseLeave={() => setShowAbout(false)}
            >
              <Link to="/about" className="hdr-nav-link">
                About
                <ArrowIcon open={showAbout} />
              </Link>
              {showAbout && <DropdownCard items={ABOUT_ITEMS} />}
            </div>

            <Link to="/Contact" className="hdr-nav-link">Contact Us</Link>

          </nav>

          {/* LOGIN BUTTON */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/login" className="hdr-login-btn">
              Log in
            </Link>
          </div>

          {/* HAMBURGER */}
          <button className="hdr-hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
            <HamburgerIcon />
          </button>

        </div>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <>
          <div className="hdr-overlay" onClick={() => setOpen(false)} />
          <aside className="hdr-sidebar">

            <div className="hdr-sidebar-head">
              <span className="hdr-sidebar-brand">
                MR <span>Reporting</span>
              </span>
              <button className="hdr-close-btn" onClick={() => setOpen(false)}>✕</button>
            </div>

            <nav className="hdr-sidebar-nav">
              {[
                { name: "Home",       path: "/" },
                { name: "Services",   path: "/services" },
                { name: "About",      path: "/about" },
                { name: "Contact Us", path: "/contact" },
              ].map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`hdr-mob-link ${isActive(item.path)}`}
                >
                  <NavDot />
                  {item.name}
                </Link>
              ))}

              {/* Compact Inline Button Trigger */}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="hdr-mob-login"
              >
                Log in
              </Link>
            </nav>

          </aside>
        </>
      )}
    </>
  );
}

/* ─── DROPDOWN CARD ─────────────────────────────────────────────────────── */
function DropdownCard({ items }) {
  return (
    <div className="hdr-dropdown">
      {items.map(item => (
        <div key={item.title} className="hdr-dd-item">
          <div className="hdr-dd-icon">
            <ArrowBold />
          </div>
          <div>
            <p className="hdr-dd-title">{item.title}</p>
            <p className="hdr-dd-desc">{item.desc}</p>
          </div>
        </div>
      ))}

      <div className="hdr-dd-footer">
        <span className="hdr-dd-footer-label">Follow us</span>
        <div className="hdr-social-icons">
          <SocialInstagram />
          <SocialX />
          <SocialLinkedIn />
        </div>
      </div>
    </div>
  );
}

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
function ArrowIcon({ open }) {
  return (
    <svg
      width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function NavDot() {
  return (
    <div style={{
      width: 6, height: 6, borderRadius: "50%",
      background: "#2563eb",
      flexShrink: 0,
    }} />
  );
}

function ArrowBold() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SocialInstagram() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
    </svg>
  );
}

function SocialX() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.2 2H21l-6.5 7.4L22 22h-6.2l-4.8-6.1L5.4 22H2.6l6.9-7.9L2 2h6.3l4.3 5.6L18.2 2z"/>
    </svg>
  );
}

// 2026 update tracking profiles
function SocialLinkedIn() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 8.98h4v12H3zM9 8.98h3.8v1.6h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.7 2.6 4.7 6v6.5h-4v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.9H9z"/>
    </svg>
  );
}

export default Header;