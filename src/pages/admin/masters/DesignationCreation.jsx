import React, { useState, useEffect } from "react";
import { Edit2, Loader2, Briefcase, PlusCircle, Check, AlertCircle } from "lucide-react";
import api from "../../../services/api";

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ucr-root {
    font-family: 'Inter', sans-serif;
    width: 100%;
    background: #ffffff;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Single Unified Card Container ── */
  .ucr-card {
  background: #ffffff;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

  /* ── Card Header ── */
  .ucr-card-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  /* ── Sub-section Table Header ── */
  .ucr-section-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    border-top: 1px solid #f1f5f9;
  }

  .ucr-page-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(59,130,246,0.2);
    flex-shrink: 0;
  }

  /* ── Form Body ── */
  .ucr-body { padding: 20px 28px 24px; background: #ffffff; }

  /* ── Single Row Flex Layout for Fields and Button ── */
  .ucr-action-row {
    display: flex;
    align-items: flex-end;
    gap: 18px;
    width: 100%;
  }

  .ucr-field-item {
    flex: 1;
    min-width: 0;
  }

  @media(max-width: 1024px) {
    .ucr-action-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .ucr-submit-btn {
      grid-column: span 2;
      width: 100%;
      justify-content: center !important;
    }
  }

  @media(max-width: 640px) {
    .ucr-action-row {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .ucr-submit-btn {
      grid-column: span 1;
    }
    .ucr-body { padding: 20px 16px; }
    .ucr-card-header { padding: 20px 16px 12px; }
    .ucr-section-header { padding: 20px 16px 12px; }
  }

  /* ── System Error Banner ── */
  .ucr-error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 12px 16px;
    color: #dc2626;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ucr-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }

  /* ── Forced Browser Autocomplete/Autofill Override ── */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    box-shadow: 0 0 0 1000px #ffffff inset !important;
    -webkit-text-fill-color: #1e293b !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* ── Submission Button ── */
  .ucr-submit-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    color: #fff;
    box-shadow: 0 4px 14px rgba(59,130,246,0.2);
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.01em;
    height: 40px;
    justify-content: center;
    flex-shrink: 0;
  }
  .ucr-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.3);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }
  .ucr-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ucr-overlay {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,0.3);
    backdrop-filter: blur(4px);
    padding: 16px;
  }

  .ucr-popup {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.1);
    padding: 36px 32px;
    max-width: 360px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ucr-zoom 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* ── Table Styling (Forced rounding clipping added) ── */
  .ucr-table-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  background: transparent;
  border-radius: 0 0 16px 16px;
}

  .ucr-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    text-align: left;
  }

  .ucr-table th {
    background: #f8fafc;
    padding: 14px 20px;
    color: #64748b;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    border-bottom: 1px solid #edf2f7;
  }

  .ucr-table td {
    padding: 14px 20px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.15s;
  }

  .ucr-table tr:last-child td {
    border-bottom: none;
  }

  .ucr-table tr:hover td {
    background: rgba(59, 130, 246, 0.02);
  }

  .ucr-badge {
    background: rgba(59, 130, 246, 0.08);
    color: #2563eb;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
  }

  /* ── Action Button with Red Hover Styling ── */
  .ucr-action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    color: #94a3b8;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .ucr-action-btn:hover {
    background: #fef2f2;
    color: #ef4444;
  }

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ucr-zoom { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
`;

const FH = 40;

const fieldBase = {
  width: "100%",
  height: FH,
  borderRadius: 8,
  fontSize: 14,
  color: "#1e293b",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.18s",
  fontFamily: "'Inter', sans-serif",
};

export default function DesignationCreation() {
  const [designations, setDesignations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    fullForm: ""
  });

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/masters/designations');
      if (response.data.success) {
        setDesignations(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch designations", err);
      setDesignations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      level: item.level.toString(),
      fullForm: item.fullForm || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      level: parseInt(formData.level),
      fullForm: formData.fullForm
    };

    try {
      let response;
      if (editingId) {
        response = await api.put(`/api/masters/designations/${editingId}`, payload);
      } else {
        response = await api.post('/api/masters/designations', payload);
      }

      if (response.data.success) {
        setFormData({ name: "", level: "", fullForm: "" });
        setPopup({ isOpen: true, message: editingId ? "Designation updated successfully!" : "Designation created successfully!" });
        setEditingId(null);
        fetchDesignations();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save designation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ucr-root">
      <style>{STYLES}</style>

      {/* ── Single Unified Card Container ── */}
      <div className="ucr-card">
        {/* Main Card Header */}
        <div className="ucr-card-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="ucr-page-icon">
              <Briefcase size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {editingId ? "Edit Designation" : "Designation Creation & Edit"}
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                {editingId ? "Update the details for this role." : "Add new roles and hierarchy levels to the system."}
              </p>
            </div>
          </div>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setFormData({ name: "", level: "", fullForm: "" }); }}
              style={{ fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 500 }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Form Body Area */}
        <div className="ucr-body">
          {error && (
            <div className="ucr-error-banner">
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="ucr-action-row">
              <div className="ucr-field-item">
                <FInput
                  label="Designation Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="ucr-field-item">
                <FInput
                  label="Designation Level"
                  name="level"
                  type="number"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="ucr-field-item">
                <FInput
                  label="Designation Full Form"
                  name="fullForm"
                  value={formData.fullForm}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="ucr-submit-btn">
                {isSubmitting ? (
                  <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} />
                ) : editingId ? (
                  <Edit2 size={14} />
                ) : (
                  <PlusCircle size={14} />
                )}
                {isSubmitting ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>

        {/* Sub-section Integrated Inner Table Header */}
        <div className="ucr-section-header">
          <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Existing Designations
          </h2>
        </div>

        {/* Integrated Table Body Area */}
        <div
  style={{
    overflow: "hidden",
    borderRadius: "0 0 16px 16px",
  }}
>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0", color: "#3B82F6" }}>
              <Loader2 size={24} style={{ animation: "ucr-spin 1s linear infinite", marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: 0 }}>Loading designations...</p>
            </div>
          ) : designations.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px", margin: "0 24px 24px 24px", textAlign: "center", border: "2px dashed #e2e8f0", borderRadius: 14, background: "#f8fafc" }}>
              <div style={{ background: "#ffffff", padding: 14, borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Briefcase size={24} style={{ color: "#94a3b8" }} />
              </div>
              <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No Designations Found</h3>
              <p style={{ fontSize: 12, color: "#94a3b8", maxWidth: 320, margin: 0 }}>
                Your database is currently empty. Use the form above to create your first designation.
              </p>
            </div>
          ) : (
            <div className="ucr-table-wrapper">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px", paddingLeft: "28px" }}>S.N.</th>
                    <th>Designation Name</th>
                    <th style={{ width: "120px" }}>Level</th>
                    <th>Full Form</th>
                    <th style={{ width: "100px", textTransform: "uppercase", textAlign: "center", paddingRight: "28px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {designations.map((item, index) => (
                    <tr key={item.id} style={{ background: editingId === item.id ? "rgba(59,130,246,0.04)" : "transparent" }}>
                      <td style={{ paddingLeft: "28px", color: "#94a3b8", fontWeight: 500 }}>{index + 1}.</td>
                      <td style={{ color: "#1e293b", fontWeight: 600 }}>{item.name}</td>
                      <td>
                        <span className="ucr-badge">
                          Lvl {item.level}
                        </span>
                      </td>
                      <td style={{ color: "#64748b" }}>{item.fullForm || "—"}</td>
                      <td style={{ textAlign: "center", paddingRight: "28px" }}>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="ucr-action-btn"
                          title="Edit Designation"
                        >
                          <Edit2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Success Popup ── */}
      {popup.isOpen && (
        <div className="ucr-overlay">
          <div className="ucr-popup">
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}>
              <Check size={28} style={{ color: "#3B82F6", strokeWidth: 2.5 }} />
            </div>

            <h3 className="ucr-brand" style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
              Success
            </h3>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 24px" }}>
              {popup.message}
            </p>

            <button
              onClick={() => setPopup({ isOpen: false, message: "" })}
              style={{
                background: "linear-gradient(135deg, #3B82F6, #2563eb)",
                color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 0", width: "100%",
                fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: "0 4px 14px rgba(59,130,246,0.2)",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.2)";
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Floating Label Input ── */
function FInput({ label, name, type = "text", value, onChange, required, disabled, error }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = error
    ? "#fca5a5"
    : focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow  = focus && !disabled
    ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)")
    : "none";
  const labelColor = error
    ? "#dc2626"
    : focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="ucr-field-wrap">
      <div style={{ position: "relative", width: "100%", height: FH }}>
        <input
          type={type}
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder=" "
          style={{
            ...fieldBase,
            padding: "0 12px",
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
            color: disabled ? "#94a3b8" : "#1e293b",
          }}
        />
        <label style={{
          position: "absolute",
          left: 10,
          pointerEvents: "none",
          zIndex: 20,
          transition: "all 0.12s ease-out",
          fontWeight: 500,
          top: active ? "0" : "50%",
          transform: active ? "translateY(-50%)" : "translateY(-50%)",
          fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor,
          background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0",
          letterSpacing: active ? "0.02em" : "0",
        }}>
          {label}{required ? " *" : ""}
        </label>
      </div>
    </div>
  );
}