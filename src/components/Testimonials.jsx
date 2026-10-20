import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    company: "Goddres Pharma",
    role: "Director",
    text: "Our sales have increased & we are delighted.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    company: "Lift Life Biotech",
    role: "Director",
    text: "The company now performs like an orchestra - leading to healthy profits.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    company: "Windlas Biotech",
    role: "Director",
    text: "It has helped our company realize MORE per MR.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    company: "Sun Pharma",
    role: "Manager",
    text: "Decision making is now faster and data driven.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    company: "Cipla Ltd",
    role: "Director",
    text: "Very smooth DCR and reporting workflow.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    company: "Aurobindo Pharma",
    role: "Sales Head",
    text: "Excellent visibility of MR activity across regions.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  }
];

/* ─── Design-System Styles (Mirrored from UserCreation Reference) ─────────── */
const TSTM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .tstm-root {
    background: #ffffff;
    padding: 96px 0; /* py-32 optimized layout */
    display: flex;
    align-items: center;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    border-bottom: 1px solid #edf2f7;
  }

  .tstm-container {
    max-width: 1280px; /* max-w-7xl */
    margin: 0 auto;
    padding: 0 24px; /* px-6 */
    width: 100%;
  }

  /* Badge styling mirroring drop down item iconography accents */
  .tstm-badge {
    display: inline-block;
    background: rgba(59, 130, 246, 0.06);
    border: 1px solid rgba(59, 130, 246, 0.12);
    color: #2563eb;
    padding: 6px 16px;
    border-radius: 9999px; /* rounded-full */
    font-size: 12px; /* text-sm standard scale */
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.04em;
    margin-bottom: 16px; /* mb-4 */
    text-transform: uppercase;
  }

  .tstm-heading-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 36px; /* text-4xl */
    font-weight: 800; /* font-extrabold */
    color: #1e293b; /* text-gray-900 baseline */
    letter-spacing: -0.01em;
  }

  .tstm-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px; /* gap-8 */
  }

  /* Card styling architecture from dropdown panel structures */
  .tstm-card {
    position: relative;
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px; /* rounded-2xl to design-system 16px constraint */
    box-shadow: 0 4px 12px rgba(0,0,0,0.02), 0 12px 32px rgba(0,0,0,0.04);
    padding: 24px; /* p-6 */
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden; /* Ensures full-corner block clipping correctly */
  }

  .tstm-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.02);
    border-color: rgba(59,130,246,0.15);
  }

  /* Solid Royal Blue Corner asset using primary brand color system accents */
  .tstm-quote-corner {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    border-radius: 0 0 0 9999px; /* Smooth inner rounded arc configuration */
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding-top: 10px;
    padding-right: 14px;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    font-weight: 800;
    line-height: 1;
    user-select: none;
  }

  .tstm-profile-block {
    display: flex;
    align-items: center;
    gap: 16px; /* gap-4 */
    margin-bottom: 16px; /* mb-4 */
    padding-right: 36px; /* Prevents text colliding with top corner block */
  }

  .tstm-avatar {
    width: 56px; /* w-14 */
    height: 56px; /* h-14 */
    border-radius: 9999px;
    object-fit: cover;
    display: block;
    border: 2px solid rgba(59, 130, 246, 0.15);
  }

  .tstm-company-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }

  .tstm-role-label {
    font-size: 12.5px;
    color: #2563eb;
    font-weight: 600;
    margin-top: 2px;
  }

  .tstm-quote-text {
    font-family: 'Inter', sans-serif;
    font-size: 14.5px;
    color: #475569; /* text-gray-600 configuration */
    line-height: 1.6;
    font-weight: 400;
  }

  /* Structural Responsive Query Adaptations */
  @media(max-width: 1024px) {
    .tstm-grid {
      gap: 24px;
    }
    .tstm-heading-text {
      font-size: 30px;
    }
  }

  @media(max-width: 768px) {
    .tstm-root {
      padding: 64px 0;
    }
    .tstm-container {
      padding: 0 16px;
    }
    .tstm-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
  }
`;

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) =>
        prev + 3 >= testimonials.length ? 0 : prev + 3
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const visible = testimonials.slice(index, index + 3);

  return (
    <>
      <style>{TSTM_STYLES}</style>

      <section className="tstm-root">
        <div className="tstm-container">
          
          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <span className="tstm-badge">
              Testimonials
            </span>
            <h2 className="tstm-heading-text">
              What Our Clients Say
            </h2>
          </motion.div>

          {/* SLIDER */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="tstm-grid"
            >
              {visible.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 80, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  <TestimonialCard {...item} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

/* ================= CARD ================= */
function TestimonialCard({ company, role, text, image }) {
  return (
    <div className="tstm-card">
      
      {/* BLUE QUOTE CORNER */}
      <div className="tstm-quote-corner">
        ”
      </div>
      
      <div>
        {/* PROFILE */}
        <div className="tstm-profile-block">
          <img
            src={image}
            alt={company}
            className="tstm-avatar"
          />
          <div>
            <h4 className="tstm-company-name">{company}</h4>
            <p className="tstm-role-label">{role}</p>
          </div>
        </div>
        
        {/* TEXT */}
        <p className="tstm-quote-text">
          "{text}"
        </p>
      </div>
    </div>
  );
}