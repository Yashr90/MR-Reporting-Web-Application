import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import { motion } from "framer-motion";
import api from "../services/api"; // Make sure to import your api instance!

/* ─── Design-System Styles (Mirrored from UserCreation Reference) ─────────── */
const CONTACT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .cnt-root {
    background: #ffffff;
    padding: 80px 0; /* py-14 optimized standard */
    font-family: 'Inter', sans-serif;
  }

  .cnt-container {
    max-width: 1280px; /* max-w-7xl */
    margin: 0 auto;
    padding: 0 28px; /* px-6 alignment layout standard */
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px; /* gap-16 layout system spacing */
    align-items: center;
  }

  .cnt-img-wrapper {
    display: flex;
    justify-content: center;
  }

  .cnt-hero-img {
    border-radius: 16px; /* design system standard corner scale */
    box-shadow: 0 12px 32px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.02);
    border: 1px solid #edf2f7;
    width: 100%;
    max-width: 512px; /* max-w-lg */
    height: 440px; /* h-[420px] optimized tracking balance */
    object-fit: cover;
    display: block;
  }

  .cnt-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 36px; /* text-3xl md:text-4xl */
    font-weight: 800; /* font-extrabold */
    color: #1e293b; /* text-gray-900 benchmark */
    letter-spacing: -0.02em;
    margin-bottom: 20px; /* mb-6 */
    line-height: 1.2;
  }

  .cnt-desc-text {
    font-family: 'Inter', sans-serif;
    font-size: 15.5px;
    color: #475569; /* text-gray-600 configuration */
    line-height: 1.625; /* leading-relaxed */
    margin-bottom: 32px; /* mb-8 */
    font-weight: 400;
  }

  .cnt-span-accent {
    font-weight: 700;
    color: #2563eb; /* Active accent brand color */
  }

  .cnt-subheading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px; /* text-2xl customized optimization */
    font-weight: 700; /* font-semibold scale update */
    color: #1e293b;
    margin-bottom: 20px; /* mb-4 */
    letter-spacing: -0.01em;
  }

  /* Input fields atomic properties matched onto structural dropdown patterns */
  .cnt-input-field {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px; /* Standard reference rounding template token */
    padding: 12px 16px; /* px-5 py-3 balance */
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    transition: all 0.15s ease;
    outline: none;
    box-sizing: border-box;
  }

  .cnt-input-field::placeholder {
    color: #94a3b8;
  }

  .cnt-input-field:focus {
    background: #ffffff;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  /* Form Submission Trigger Button matching exact custom gradient controls */
  .cnt-submit-btn {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px 24px;
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

  .cnt-submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.35);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }

  .cnt-submit-btn:active {
    transform: translateY(0);
  }

  /* Fully Responsive Layout Rules Adaptation */
  @media(max-width: 1024px) {
    .cnt-container {
      gap: 40px;
    }
    .cnt-heading {
      font-size: 30px;
    }
  }

  @media(max-width: 768px) {
    .cnt-root {
      padding: 56px 0;
    }
    .cnt-container {
      grid-template-columns: 1fr;
      gap: 40px;
      padding: 0 16px;
    }
    .cnt-img-wrapper {
      order: 1; /* First element block layout structure on smartphones */
    }
    .cnt-form-content-block {
      order: 2; /* Content description block fields rendered below the asset block */
    }
    .cnt-heading {
      font-size: 26px;
    }
  }
`;

export default function Contact() {
  // 1. State variables matching your backend requirements
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Array of objects to easily map our inputs and their state
  const inputFields = [
    { placeholder: "Full Name", value: fullName, setter: setFullName, type: "text" },
    { placeholder: "Company Name", value: companyName, setter: setCompanyName, type: "text" },
    { placeholder: "Work Email Address", value: workEmail, setter: setWorkEmail, type: "email" },
    { placeholder: "Phone Number", value: phoneNumber, setter: setPhoneNumber, type: "tel" },
  ];

  // 2. Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/contacts/submit", {
        fullName: fullName,
        companyName: companyName,
        workEmail: workEmail,
        phoneNumber: phoneNumber
      });
      
      console.log("Contact form submitted:", response.data);
      alert("Thank you! Your request has been sent.");
      
      // Clear the form after successful submission
      setFullName("");
      setCompanyName("");
      setWorkEmail("");
      setPhoneNumber("");

    } catch (error) {
      console.error("Submission failed:", error);
      alert("There was an error sending your request. Please try again.");
    }
  };

  return (
    <>
      <style>{CONTACT_STYLES}</style>
      <Header />

      {/* ================= FORM + IMAGE SECTION ================= */}
      <section className="cnt-root">
        <div className="cnt-container">

          {/* LEFT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="cnt-img-wrapper"
          >
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80"
              alt="Team working"
              className="cnt-hero-img"
            />
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cnt-form-content-block"
          >

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="cnt-heading"
            >
              Trusted for 20+ Years
            </motion.h2>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="cnt-desc-text"
            >
              Since 2005, our SaaS SFA platform has supported 
              <span className="cnt-span-accent"> 150+ life science companies </span> 
              and empowered 
              <span className="cnt-span-accent"> 10,000+ medical representatives </span> 
              with smart reporting, tour planning, and analytics.
            </motion.p>

            {/* Subheading */}
            <motion.h3
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="cnt-subheading"
            >
              Get a Free Personalized Demo
            </motion.h3>

            {/* FORM */}
            <form style={{ display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={handleSubmit}>

              {inputFields.map((field, index) => (
                <div key={index} style={{ width: "100%" }}>
                  <motion.input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    required
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + index * 0.12,
                      duration: 0.5
                    }}
                    className="cnt-input-field"
                  />
                </div>
              ))}

              <div style={{ marginTop: "8px", width: "100%" }}>
                <motion.button
                  type="submit"
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  className="cnt-submit-btn"
                >
                  Request Demo
                </motion.button>
              </div>

            </form>

          </motion.div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <Testimonials />

      <Footer />
    </>
  );
}