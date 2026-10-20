import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";

/* ─── Design-System Styles (Mirrored from UserCreation Reference) ─────────── */
const ABOUT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .abt-root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #ffffff;
    font-family: 'Inter', sans-serif;
  }

  /* ── Hero Section ── */
  .abt-hero-section {
    position: relative;
    background: linear-gradient(135deg, #f8fafc, #ffffff, #f1f5f9);
    padding: 80px 0;
    overflow: hidden;
    border-bottom: 1px solid #edf2f7;
  }

  .abt-hero-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 28px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px;
    align-items: center;
  }

  .abt-hero-left {
    max-width: 512px;
  }

  .abt-badge {
    display: inline-block;
    background: rgba(59, 130, 246, 0.06);
    border: 1px solid rgba(59, 130, 246, 0.12);
    color: #2563eb;
    padding: 6px 16px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.04em;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  .abt-hero-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: #1e293b;
    line-height: 1.2;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }

  .abt-title-accent {
    color: #2563eb;
  }

  .abt-hero-desc {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #475569;
    line-height: 1.625;
    margin-bottom: 28px;
    font-weight: 400;
  }

  .abt-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    border: none;
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    box-shadow: 0 4px 14px rgba(59,130,246,0.25);
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.01em;
    cursor: pointer;
  }

  .abt-hero-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.35);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }

  /* ── Content Rows ── */
  .abt-row-section {
    padding: 96px 0;
    background: #ffffff;
    border-bottom: 1px solid #edf2f7;
  }

  .abt-row-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 28px;
    display: flex;
    flex-direction: column;
    gap: 112px;
  }

  .abt-row-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 80px;
    align-items: center;
  }

  .abt-row-img {
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.02);
    width: 100%;
    height: 420px;
    object-fit: cover;
    display: block;
    border: 1px solid #edf2f7;
  }

  .abt-row-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 30px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 24px;
    letter-spacing: -0.01em;
  }

  .abt-row-desc {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .abt-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .abt-list-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    color: #475569;
    line-height: 1.5;
  }

  .abt-list-icon {
    width: 18px;
    height: 18px;
    color: #3B82F6;
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* ── Trust Block Grid ── */
  .abt-trust-section {
    background: #f8fafc;
    padding: 80px 0;
    border-bottom: 1px solid #edf2f7;
  }

  .abt-trust-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 28px;
  }

  .abt-trust-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }

  .abt-trust-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 15.5px;
    color: #475569;
    max-w: 672px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .abt-trust-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
  }

  .abt-trust-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.01), 0 12px 32px rgba(0,0,0,0.03);
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  .abt-trust-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 38px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.02);
    border-color: rgba(59,130,246,0.18);
  }

  .abt-card-num-badge {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: rgba(59, 130, 246, 0.06);
    border: 1px solid rgba(59, 130, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #3B82F6;
    margin-bottom: 20px;
  }

  .abt-trust-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .abt-trust-card-desc {
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    color: #475569;
    line-height: 1.6;
  }

  /* Responsive Rules */
  @media(max-width: 1024px) {
    .abt-hero-title { font-size: 32px; }
    .abt-trust-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    .abt-row-grid { gap: 40px; }
    .abt-row-title { font-size: 26px; }
  }

  @media(max-width: 768px) {
    .abt-hero-container, .abt-row-grid {
      grid-template-columns: 1fr;
      gap: 48px;
    }
    .abt-hero-section, .abt-row-section, .abt-trust-section {
      padding: 56px 0;
    }
    .abt-hero-container, .abt-row-container, .abt-trust-container {
      padding: 0 16px;
    }
    .abt-hero-title { font-size: 28px; }
    .abt-trust-heading { font-size: 26px; }
    .abt-trust-grid { grid-template-columns: 1fr; gap: 24px; }
    .abt-row-img-swap { order: -1; } 
  }
`;

function About() {
  return (
    <>
      <style>{ABOUT_STYLES}</style>
      
      <div className="abt-root">
        <Header />

        {/* ================= HERO ================= */}
        <section className="abt-hero-section">
          <div className="abt-hero-container">
            
            {/* LEFT CONTENT */}
            <div className="abt-hero-left">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="abt-badge"
              >
                About MR Reporting
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="abt-hero-title"
              >
                Transforming <span className="abt-title-accent">Pharma Field</span><br />
                Operations with Smart Automation
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="abt-hero-desc"
              >
                MR Reporting empowers pharmaceutical companies with intelligent field-force automation, real-time insights, and secure reporting systems designed for modern performance-driven teams.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button className="abt-hero-cta">
                  Explore Our Platform
                </button>
              </motion.div>
            </div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center"
            >
              <div className="absolute w-[85%] h-[85%] bg-blue-100 rounded-[60px] rotate-6 top-6 right-6"></div>

              <div className="relative overflow-hidden rounded-[60px_10px_60px_10px] shadow-2xl border border-blue-100">
                <img
                  src="https://images.pexels.com/photos/5726709/pexels-photo-5726709.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Medical Representative using tablet"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white px-6 py-4 rounded-2xl shadow-xl border border-blue-100">
                <p className="text-sm font-semibold text-gray-700">
                  🚀 Trusted by 150+ Pharma Companies
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= MISSION & VISION ================= */}
        <section className="abt-row-section">
          <div className="abt-row-container">
            
            {/* MISSION ROW */}
            <div className="abt-row-grid">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Medical Representative Meeting Doctor"
                  className="abt-row-img"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="abt-badge">
                  Our Mission
                </span>
                <h2 className="abt-row-title">
                  Simplifying & Modernizing Field Reporting
                </h2>
                <p className="abt-row-desc">
                  Our mission is to transform pharmaceutical operations through intelligent automation and secure digital reporting.
                </p>

                <ul className="abt-list">
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Eliminate manual reporting errors</span>
                  </li>
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Increase MR productivity & accountability</span>
                  </li>
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Provide real-time performance visibility</span>
                  </li>
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Ensure secure & transparent workflows</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* VISION ROW */}
            <div className="abt-row-grid">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="abt-badge">
                  Our Vision
                </span>
                <h2 className="abt-row-title">
                  Building a Data-Driven Pharma Ecosystem
                </h2>
                <p className="abt-row-desc">
                  We envision a future where pharmaceutical companies operate on accurate, real-time data and intelligent automation.
                </p>

                <ul className="abt-list">
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Replace guesswork with analytics</span>
                  </li>
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Enable faster strategic decisions</span>
                  </li>
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Optimize territory & sales planning</span>
                  </li>
                  <li className="abt-list-item">
                    <CheckCircle2 className="abt-list-icon" />
                    <span>Empower leadership with insights</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="abt-row-img-swap"
              >
                <img
                  src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Analytics Dashboard"
                  className="abt-row-img"
                />
              </motion.div>
            </div>

          </div>
        </section>

        {/* ================= WHY COMPANIES TRUST MR REPORTING ================= */}
        <section className="abt-trust-section">
          <div className="abt-trust-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", marginBottom: "60px" }}
            >
              <span className="abt-badge">
                Why Choose Us
              </span>
              <h2 className="abt-trust-heading">
                Why Companies Trust MR Reporting
              </h2>
              <p className="abt-trust-subtitle">
                Trusted by pharmaceutical teams for secure, scalable and performance-driven field force automation.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.18 },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="abt-trust-grid"
            >
              {[
                {
                  title: "Secure & Reliable Platform",
                  desc: "Enterprise-level security with encrypted data and role-based access control."
                },
                {
                  title: "Real-Time Business Insights",
                  desc: "Live dashboards and analytics for faster and smarter decision making."
                },
                {
                  title: "Scalable Enterprise Architecture",
                  desc: "Designed to support multi-region teams and growing organizations."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: -60 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: "easeOut" },
                    },
                  }}
                  className="abt-trust-card"
                >
                  <div className="abt-card-num-badge">
                    {index + 1}
                  </div>
                  <h3 className="abt-trust-card-title">
                    {item.title}
                  </h3>
                  <p className="abt-trust-card-desc">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        <Footer />
      </div>
    </>
  );
}

export default About;