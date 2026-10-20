import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Design-System Styles (Mirrored from UserCreation Reference) ─────────── */
const SRV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .srv-root {
    background: #f8fafc; /* Premium layout backing */
    padding: 80px 0; /* py-16 optimized balance */
    font-family: 'Inter', sans-serif;
    border-bottom: 1px solid #edf2f7;
  }

  .srv-container {
    max-width: 1280px; /* max-w-7xl */
    margin: 0 auto;
    padding: 0 28px; /* px-6 layout standard */
    width: 100%;
  }

  /* Badge styling mirroring dropdown micro accents */
  .srv-badge {
    display: inline-block;
    background: rgba(59, 130, 246, 0.06);
    border: 1px solid rgba(59, 130, 246, 0.12);
    color: #2563eb;
    padding: 6px 16px;
    border-radius: 9999px; /* rounded-full */
    font-size: 12px; /* text-xs scale standard */
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.04em;
    margin-bottom: 16px; /* mb-4 */
    text-transform: uppercase;
  }

  .srv-heading-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 36px; /* text-4xl standard scaling */
    font-weight: 800; /* font-extrabold */
    color: #1e293b; /* text-gray-900 benchmark */
    letter-spacing: -0.01em;
    margin-bottom: 16px;
  }

  .srv-subtitle-text {
    font-family: 'Inter', sans-serif;
    font-size: 15.5px; /* text-base matching optimization */
    color: #475569; /* text-gray-600 configuration */
    line-height: 1.6;
    max-w: 672px; /* max-w-2xl */
    margin: 0 auto;
    font-weight: 400;
  }

  .srv-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px; /* gap-8 layout system */
  }

  /* Card styling from the master dropdown panel criteria */
  .srv-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px; /* standard 16px radius profile */
    padding: 32px; /* p-8 standard */
    box-shadow: 0 4px 12px rgba(0,0,0,0.02), 0 12px 32px rgba(0,0,0,0.04);
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    height: 100%;
  }

  .srv-card:hover {
    box-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.02);
    border-color: rgba(59,130,246,0.15);
  }

  .srv-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 18px; /* text-xl optimized */
    font-weight: 700;
    color: #1e293b;
    line-height: 1.4;
  }

  .srv-card-divider {
    margin-top: 16px;
    margin-bottom: 24px;
    height: 1px;
    background: #f1f5f9;
  }

  .srv-features-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .srv-feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px; /* gap-3 layout systems */
    font-size: 13.5px; /* text-sm design standard scale */
    color: #475569;
    line-height: 1.5;
  }

  .srv-feature-icon {
    color: #3B82F6; /* Styled brand accent icon color matching dropdown icons */
    margin-top: 2px;
    flex-shrink: 0;
  }

  /* Responsive breakpoints matching exactly the layout standard rules */
  @media(max-width: 1024px) {
    .srv-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }
    .srv-heading-text {
      font-size: 30px;
    }
  }

  @media(max-width: 768px) {
    .srv-root {
      padding: 56px 0;
    }
    .srv-container {
      padding: 0 16px;
    }
    .srv-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .srv-heading-text {
      font-size: 26px;
    }
    .srv-card {
      padding: 24px;
    }
  }
`;

function ServicesSection() {
  const services = [
    {
      title: "Implementation & Deployment",
      features: [
        "Complete system setup & configuration",
        "Role-based access implementation",
        "Cloud or On-premise deployment",
        "Data migration from existing systems",
      ],
    },
    {
      title: "Customization & Integration",
      features: [
        "Custom workflow configuration",
        "Custom report formats",
        "ERP / CRM integration",
        "API & third-party system connectivity",
      ],
    },
    {
      title: "Training & Onboarding",
      features: [
        "Admin & Manager training sessions",
        "Field MR onboarding programs",
        "Step-by-step documentation",
        "Live support assistance",
      ],
    },
    {
      title: "Support & Maintenance",
      features: [
        "24/7 technical support",
        "Regular updates & improvements",
        "Security monitoring & patches",
        "Performance optimization",
      ],
    },
    {
      title: "Analytics & Consulting",
      features: [
        "Sales performance consulting",
        "Territory planning guidance",
        "KPI & productivity analysis",
        "Growth strategy recommendations",
      ],
    },
    {
      title: "Scalable Enterprise Solutions",
      features: [
        "Multi-region team management",
        "Enterprise-level data security",
        "Custom dashboards for executives",
        "Scalable cloud infrastructure",
      ],
    },
  ];

  return (
    <>
      <style>{SRV_STYLES}</style>

      <section className="srv-root">
        <div className="srv-container">
          
          {/* ================= HEADING ================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <span className="srv-badge">
              Our Services
            </span>
            <h2 className="srv-heading-text">
              End-to-End Pharma Solutions
            </h2>
            <p className="srv-subtitle-text">
              Beyond software, we provide complete support, customization,
              deployment and consulting services to help pharmaceutical
              businesses scale efficiently.
            </p>
          </motion.div>

          {/* ================= GRID ================= */}
          <div className="srv-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
                className="srv-card"
              >
                {/* Title */}
                <h3 className="srv-card-title">
                  {service.title}
                </h3>
                <div className="srv-card-divider"></div>
                
                {/* Features */}
                <ul className="srv-features-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {service.features.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.08,
                        duration: 0.4,
                      }}
                      className="srv-feature-item"
                    >
                      <CheckCircle
                        size={16}
                        className="srv-feature-icon"
                      />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default ServicesSection;