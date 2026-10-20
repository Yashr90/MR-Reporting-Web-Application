import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";

/* ─── Design-System Styles (Mirrored from Reference File) ─────────────── */
const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  .ftr-root {
    background: #ffffff;
    padding: 24px 0; /* py-6 */
    width: 100%;
    border-top: 1px solid #edf2f7;
    font-family: 'Inter', sans-serif;
  }

  .ftr-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 28px; /* px-4 sm:px-6 lg:px-10 equivalent padding standard */
  }

  /* Dark interior card utilizing structural parameters from global variables */
  .ftr-card {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #ffffff;
    border-radius: 16px; /* rounded-3xl shifted to design system standard 16px */
    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
    padding: 56px 48px; /* py-14 px-6 sm:px-10 lg:px-16 */
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .ftr-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 48px; /* gap-12 */
  }

  .ftr-brand-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px; /* text-2xl base optimization */
    font-weight: 800;
    letter-spacing: -0.01em;
    margin-bottom: 16px; /* mb-4 */
    color: #ffffff;
  }

  .ftr-brand-title span {
    color: #3B82F6;
  }

  .ftr-desc-text {
    font-family: 'Inter', sans-serif;
    font-size: 13px; /* text-sm design standard scale */
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 24px; /* mb-6 */
    font-weight: 400;
  }

  .ftr-social-container {
    display: flex;
    gap: 12px;
  }

  .ftr-social-circle {
    width: 36px;
    height: 36px;
    border-radius: 8px; /* matching reference item icon shapes */
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    transition: all 0.15s;
    cursor: pointer;
  }

  .ftr-social-circle:hover {
    color: #ffffff;
    background: #3B82F6;
    border-color: #2563eb;
    box-shadow: 0 4px 14px rgba(59,130,246,0.3);
  }

  .ftr-column-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; /* text-lg customized to system micro-header */
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 16px; /* mb-4 */
    letter-spacing: 0.01em;
  }

  .ftr-links-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ftr-links-list space-item {
    margin-bottom: 12px;
  }

  .ftr-nav-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    font-weight: 600;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
  }

  .ftr-nav-link:hover {
    color: #3B82F6;
  }

  .ftr-contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ftr-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
    margin-bottom: 16px;
    font-family: 'Inter', sans-serif;
  }

  .ftr-contact-icon {
    color: #3B82F6;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .ftr-divider {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin: 32px 0; /* my-8 */
  }

  .ftr-bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    font-size: 12px; /* text-sm base transition */
    color: #64748b;
    font-family: 'Inter', sans-serif;
  }

  .ftr-bottom-right {
    display: flex;
    gap: 24px;
  }

  .ftr-bottom-link {
    cursor: pointer;
    transition: color 0.15s;
  }

  .ftr-bottom-link:hover {
    color: #94a3b8;
  }

  /* Responsive Rules mapping precisely onto targeted configurations */
  @media(max-width: 1024px) {
    .ftr-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media(max-width: 768px) {
    .ftr-container {
      padding: 0 16px;
    }
    .ftr-card {
      padding: 40px 24px;
    }
    .ftr-grid {
      grid-template-columns: 1fr;
      gap: 36px;
    }
    .ftr-bottom-bar {
      flex-direction: column;
      text-align: center;
    }
    .ftr-bottom-right {
      gap: 16px;
    }
  }
`;

export default function Footer() {
  return (
    <>
      <style>{FOOTER_STYLES}</style>

      <footer className="ftr-root">
        <div className="ftr-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="ftr-card"
          >
            {/* GRID */}
            <div className="ftr-grid">
              {/* BRAND */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="ftr-brand-title">
                  MR <span>REPORTING</span>
                </h2>
                <p className="ftr-desc-text">
                  At MR Reporting, we believe that every pharma field team deserves
                  a seamless way to capture, analyze, and act on their day-to-day
                  interactions with confidence.
                </p>
                {/* SOCIAL ICONS */}
                <div className="ftr-social-container">
                  {[FaFacebookF, FaLinkedinIn, FaInstagram].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className="ftr-social-circle"
                    >
                      <Icon size={14} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* QUICK LINKS */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h4 className="ftr-column-heading">Quick Links</h4>
                <ul className="ftr-links-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <motion.li whileHover={{ x: 4 }}>
                    <Link to="/" className="ftr-nav-link">
                      <FaChevronRight className="ftr-contact-icon" style={{ fontSize: "10px" }} />
                      Home
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 4 }}>
                    <Link to="/about" className="ftr-nav-link">
                      <FaChevronRight className="ftr-contact-icon" style={{ fontSize: "10px" }} />
                      About Us
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 4 }}>
                    <Link to="/services" className="ftr-nav-link">
                      <FaChevronRight className="ftr-contact-icon" style={{ fontSize: "10px" }} />
                      Services
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 4 }}>
                    <Link to="/contact" className="ftr-nav-link">
                      <FaChevronRight className="ftr-contact-icon" style={{ fontSize: "10px" }} />
                      Contact Us
                    </Link>
                  </motion.li>
                </ul>
              </motion.div>

              {/* CONTACT */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h4 className="ftr-column-heading">Get in Touch</h4>
                <ul className="ftr-contact-list">
                  <li className="ftr-contact-item">
                    <FaPhoneAlt className="ftr-contact-icon" />
                    <span>+91-8769667289</span>
                  </li>
                  <li className="ftr-contact-item">
                    <FaEnvelope className="ftr-contact-icon" />
                    <span>info@mrreporting.com</span>
                  </li>
                  <li className="ftr-contact-item">
                    <FaMapMarkerAlt className="ftr-contact-icon" />
                    <span>
                      Presidency University<br />
                      Itgalpura, Rajanukunte, Yelahanka <br />
                      Bengaluru, Karnataka - 560064
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* DIVIDER */}
            <div className="ftr-divider"></div>

            {/* BOTTOM BAR */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="ftr-bottom-bar"
            >
              <span>
                2026 MR Reporting Software | MCA Final Year Project
              </span>
              <div className="ftr-bottom-right">
                <span className="ftr-bottom-link">
                  Privacy Policy
                </span>
                <span className="ftr-bottom-link">
                  Terms & Conditions
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}