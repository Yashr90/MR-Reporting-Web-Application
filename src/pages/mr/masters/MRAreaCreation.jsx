import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, Save, Trash2, FileSpreadsheet, Edit2,
  AlertCircle, MapPin, Check, X, ChevronDown
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants ─────────────────────────────────────────────────────────────
const AREA_TYPES = [
  { id: "HQ", label: "HQ (Headquarter)" },
  { id: "EX", label: "EX (Ex-station)" }
];

const EMPTY_FORM = { areaName: "", areaCode: "", areaType: "" };

const parseApiError = (error) => {
  const raw =
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message || "";
  const str = typeof raw === "string" ? raw : JSON.stringify(raw);

  if (str.includes("duplicate key") && str.includes("area_code"))
    return "Area Code already exists. Please use a different code or leave it blank.";
  if (str.includes("duplicate key") && str.includes("area_name"))
    return "Area Name already exists. Please use a different name.";
  if (str.includes("duplicate key"))
    return "A record with this data already exists. Please check your entries.";
  if (str.includes("not found") || str.includes("404"))
    return "Area not found. It may have already been deleted.";
  if (str.toLowerCase().includes("network") || error?.code === "ERR_NETWORK")
    return "Network error. Please check your connection and try again.";
  return str || "Operation failed. Please try again.";
};

/* ─── Premium UI Styles & Utilities From Perfect Template Reference ──────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dc-wrap {
    font-family: 'Inter', sans-serif;
    width: 100%;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Single Unified Card Container ── */
  .dc-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    position: relative;
    overflow: visible;
  }

  /* ── Card Header ── */
  .dc-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    border-radius: 16px 16px 0 0 !important;
  }

  .dc-page-icon {
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

  /* ── Form Body Area ── */
  .dc-body { 
    padding: 20px 28px 24px; 
    background: #ffffff; 
    overflow: visible;
  }

  /* ── Premium List Table Layout Utilities ── */
  .dc-table-container {
    border: 1px solid #edf2f7;
    border-radius: 12px;
    overflow-x: auto;
    background: #ffffff;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    margin-top: 4px;
  }
  
  .dc-table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: 13.5px; 
    min-width: 800px; 
  }
  
  .dc-table thead { 
    background: #f8fafc; 
    border-bottom: 1px solid #edf2f7; 
  }
  
  .dc-table th { 
    padding: 14px 18px; 
    text-align: left; 
    font-weight: 700; 
    color: #475569; 
    font-size: 11px; 
    text-transform: uppercase; 
    letter-spacing: 0.06em; 
    white-space: nowrap; 
  }
  
  .dc-table td { 
    padding: 14px 18px; 
    color: #1e293b; 
    border-bottom: 1px solid #edf2f7; 
    white-space: nowrap; 
  }

  .dc-table tr:last-child td {
    border-bottom: none;
  }

  /* ── Premium Form Grid System ── */
  .dc-form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr) auto;
    gap: 18px;
    align-items: flex-start;
  }

  @media(max-width: 1024px) {
    .dc-form-grid { grid-template-columns: repeat(3, 1fr); }
    .dc-action-block { grid-column: span 3; width: 100%; }
    .dc-submit-btn { width: 100%; justify-content: center !important; }
  }

  @media(max-width: 768px) {
    .dc-form-grid { grid-template-columns: repeat(2, 1fr); }
    .dc-action-block { grid-column: span 2; }
  }

  @media(max-width: 640px) {
    .dc-form-grid { grid-template-columns: 1fr; gap: 20px; }
    .dc-action-block { grid-column: span 1; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
  }

  /* ── Dropdown list ── */
  .dc-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    z-index: 999999 !important;
    overflow: hidden;
  }

  .dc-dropdown ul {
    max-height: 220px;
    overflow-y: auto;
    padding: 6px;
    margin: 0;
    list-style: none;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }

  .dc-dropdown ul::-webkit-scrollbar { width: 4px; }
  .dc-dropdown ul::-webkit-scrollbar-track { background: transparent; }
  .dc-dropdown ul::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  .dc-opt {
    padding: 8px 12px;
    font-size: 13.5px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    transition: all 0.12s;
    font-weight: 500;
  }
  .dc-opt:hover   { background: rgba(59,130,246,0.06); color: #2563eb; }
  .dc-opt.selected { background: rgba(59,130,246,0.08); color: #2563eb; font-weight: 600; }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    box-shadow: 0 0 0 1000px #ffffff inset !important;
    -webkit-text-fill-color: #1e293b !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  .dc-submit-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: #2563eb !important;
    color: #fff !important;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.01em;
    height: 40px;
    opacity: 1 !important;
  }
  .dc-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
    background: #1d4ed8 !important;
  }
  .dc-submit-btn:disabled { background: #e2e8f0 !important; color: #94a3b8 !important; cursor: not-allowed; box-shadow: none; opacity: 1 !important; }

  .dc-overlay {
    position: fixed; inset: 0; z-index: 100000;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,0.3);
    backdrop-filter: blur(4px);
    padding: 16px;
  }

  .dc-popup {
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
    animation: dc-zoom 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }

  .dc-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }
  .dc-field-error { font-size: 11px; color: #dc2626; font-weight: 500; padding-left: 4px; }

  @keyframes dc-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dc-zoom { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
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

export default function MRAreaCreation() {
  const [areas, setAreas]           = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup]           = useState({ isOpen: false, message: "" });
  const [errorMsg, setErrorMsg]     = useState("");
  const [editId, setEditId]         = useState(null);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => { fetchAreas(); }, []);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/mr/area-creation/areas");
      setAreas(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Fetch areas failed:", err);
      setAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.areaName.trim()) errors.areaName = "Area Name is required!!!";
    if (!formData.areaType)        errors.areaType  = "Area Type is required!!!";
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }

    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      areaName: formData.areaName.trim(),
      areaCode: formData.areaCode.trim(),
      areaType: formData.areaType
    };

    try {
      if (editId) {
        await api.put(`/api/mr/area-creation/areas/${editId}`, payload);
        setPopup({ isOpen: true, message: "Area updated successfully!" });
      } else {
        await api.post("/api/mr/area-creation/areas", payload);
        setPopup({ isOpen: true, message: "Area created successfully!" });
      }
      resetForm();
      fetchAreas();
    } catch (err) {
      console.error("Submit failed:", err);
      setErrorMsg(parseApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Invalid Area ID");
      const confirmDelete = window.confirm("Are you sure you want to delete this area?");
      if (!confirmDelete) return;

      await api.delete(`/api/mr/area-creation/areas/${id}`);
      setPopup({ isOpen: true, message: "Area deleted successfully." });
      fetchAreas();
    } catch (err) {
      console.error("Delete failed:", err);
      setErrorMsg(parseApiError(err) || "Something went wrong while deleting.");
    }
  };

  const handleEditClick = (area) => {
    setEditId(area.id || area._id);
    setFormData({
      areaName: area.areaName || area.area_name || "",
      areaCode: area.areaCode || area.area_code || "",
      areaType: area.areaType || area.type        || ""
    });
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateFieldValidation = (name, val) => {
    const msg =
      name === "areaName" && !val.trim() ? "Area Name is required!!!" :
      name === "areaType" && !val          ? "Area Type is required!!!"  : "";
    setFieldErrors(prev => ({ ...prev, [name]: msg }));
  };

  const handleInputChange = (eOrName, value) => {
    if (typeof eOrName === "object") {
      const { name, value: v } = eOrName.target;
      setFormData(prev => ({ ...prev, [name]: v }));
      updateFieldValidation(name, v);
    } else {
      setFormData(prev => ({ ...prev, [eOrName]: value }));
      updateFieldValidation(eOrName, value);
    }
  };

  const isFormValid = formData.areaName.trim() !== "" && formData.areaType !== "";

  return (
    <div className="dc-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{STYLES}</style>

      {errorMsg && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {errorMsg}
        </div>
      )}

      {/* ── Creation Form Panel ── */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <MapPin size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {editId ? "Edit Employee Area" : "Employee Area Creation"}
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Manage headquarters and ex-stations
              </p>
            </div>
          </div>
        </div>

        <div className="dc-body">
          <form onSubmit={handleSubmit} className="dc-form-grid">
            
            <div>
              <FloatingInput
                label="Area Name" name="areaName"
                value={formData.areaName} onChange={handleInputChange}
                error={fieldErrors.areaName} required
              />
            </div>

            <div>
              <FloatingInput
                label="Area Code" name="areaCode"
                value={formData.areaCode} onChange={handleInputChange}
              />
            </div>

            <div>
              <SingleDropdown
                label="Area Type" name="areaType"
                options={AREA_TYPES} value={formData.areaType}
                onSelect={(val) => handleInputChange("areaType", val)}
                error={fieldErrors.areaType} required
              />
            </div>

            <div className="dc-action-block" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="dc-submit-btn"
              >
                {isSubmitting ? <Loader2 size={16} style={{ animation: "dc-spin 1s linear infinite" }} /> : editId ? <Save size={16} /> : <Check size={16} />}
                {editId ? "Update Area" : "Create Area"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    height: 24, fontSize: 11, fontWeight: 700, color: "#64748b", background: "none", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  <X size={13} /> Cancel Edit
                </button>
              )}
            </div>

          </form>
        </div>
      </div>

      {/* ── Table List Panel ── */}
      <div className="dc-card">
        <div className="dc-header" style={{ background: "#f8fafc", borderBottom: "1px solid #edf2f7" }}>
          <h2 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>Employee Area List</h2>
          <button
            type="button"
            title="Export"
            style={{
              height: 32, width: 32, borderRadius: 6, background: "#ffffff", border: "1px solid #e2e8f0",
              color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s ease"
            }}
          >
            <FileSpreadsheet size={16} />
          </button>
        </div>

        <div className="dc-body" style={{ padding: 0 }}>
          <div className="dc-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px", position: "relative", marginTop: 0 }}>
            
            {isLoading && (
              <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 size={28} style={{ color: "#2563eb", animation: "dc-spin 1s linear infinite" }} />
              </div>
            )}

            <table className="dc-table">
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: "center" }}>#</th>
                  <th>Area Name</th>
                  <th>Area Code</th>
                  <th style={{ textAlign: "center" }}>Type</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  <th style={{ textAlign: "center", width: 60 }}>Edit</th>
                  <th style={{ textAlign: "center", width: 60 }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && areas.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                      No areas found. Create one above.
                    </td>
                  </tr>
                ) : areas.map((row, idx) => {
                  const id         = row.id || row._id;
                  const areaName   = row.areaName  || row.area_name  || "—";
                  const areaCode   = row.areaCode  || row.area_code  || "—";
                  const areaType   = row.areaType  || row.type        || "—";
                  const isActive   = String(row.status ?? row.isActive ?? true) === "true";

                  return (
                    <tr key={id}>
                      <td style={{ color: "#64748b", textAlign: "center" }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{areaName}</td>
                      <td style={{ fontWeight: 500, fontFamily: "monospace" }}>{areaCode}</td>

                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                          background: areaType === "HQ" ? "rgba(59,130,246,0.06)" : "rgba(124,58,237,0.06)",
                          color: areaType === "HQ" ? "#2563eb" : "#7c3aed",
                          border: areaType === "HQ" ? "1px solid rgba(59,130,246,0.12)" : "1px solid rgba(124,58,237,0.12)"
                        }}>
                          {areaType}
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                          background: isActive ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)",
                          color: isActive ? "#16a34a" : "#dc2626",
                          border: isActive ? "1px solid rgba(22,163,74,0.12)" : "1px solid rgba(220,38,38,0.12)"
                        }}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleEditClick(row)}
                          title="Edit"
                          style={{
                            width: 28, height: 28, borderRadius: "50%", background: "none", border: "none",
                            color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: "0 auto", transition: "all 0.12s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                          <Edit2 size={15} strokeWidth={2.5} />
                        </button>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          title="Delete"
                          style={{
                            width: 28, height: 28, borderRadius: "50%", background: "none", border: "none",
                            color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: "0 auto", transition: "all 0.12s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                          <Trash2 size={15} strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Success Popup Modal ── */}
      {popup.isOpen && (
        <div className="dc-overlay">
          <div className="dc-popup">
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
            }}>
              <Check size={28} style={{ color: "#3B82F6", strokeWidth: 2.5 }} />
            </div>

            <h3 className="ucr-brand" style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Success</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 24px" }}>{popup.message}</p>

            <button
              type="button"
              onClick={() => setPopup({ isOpen: false, message: "" })}
              className="dc-submit-btn"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM FLOATING LABELS FORM CONTROLS WITH BREAKOUT ESCAPE PORTALS
═══════════════════════════════════════════════════════════════════════════ */

function FloatingInput({ label, name, type = "text", value, onChange, disabled, required, error }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = error ? "#dc2626" : focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow = focus && !disabled ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)") : "none";
  const labelColor = error ? "#dc2626" : focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position:"relative", width:"100%", height:FH }}>
        <input
          type={type} id={name} name={name} value={value||""} onChange={onChange} disabled={disabled} required={required}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          placeholder=" "
          style={{
            ...fieldBase,
            padding: "0 12px",
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
            color: disabled ? "#94a3b8" : "#1e293b",
            fontWeight: 500
          }}
        />
        <label style={{
          position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
          transition: "all 0.12s ease-out", fontWeight: 500,
          top: active ? "0" : "50%",
          transform: "translateY(-50%)",
          fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor,
          background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0",
          letterSpacing: active ? "0.02em" : "0",
        }}>
          {label}{required ? " *" : ""}
        </label>
      </div>
      {error && <p className="dc-field-error">{error}</p>}
    </div>
  );
}

function SingleDropdown({ label, name, options = [], value, onSelect, disabled, required, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = options.find((option) => String(option.id ?? option.value) === String(value));
  const active = isOpen || Boolean(value);

  const borderColor = error ? "#dc2626" : isOpen ? "#3B82F6" : value ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff";
  const shadow = isOpen && !disabled ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)") : "none";
  const labelColor = error ? "#dc2626" : isOpen ? "#3B82F6" : value ? "#64748b" : "#94a3b8";

  const openMenu = () => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e) => { if (e.target?.closest && e.target.closest('.dropdown-portal')) return; setIsOpen(false); };
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", () => setIsOpen(false));
    return () => { window.removeEventListener("scroll", handleScroll, true); };
  }, [isOpen]);

  return (
    <div className="dc-field-wrap" style={{ userSelect: "none" }}>
      <div
        ref={ref} onClick={openMenu}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled ? "none" : shadow,
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor,
          transition: "all 0.18s"
        }}
      >
        <span style={{ flex: 1, fontWeight: 500, color: value ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedOption?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#3B82F6" : "#94a3b8" }}>
          <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500,
        top: active ? "0" : "50%",
        transform: "translateY(-50%)",
        fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor,
        background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0",
      }}>
        {label}{required ? " *" : ""}
      </label>

      {error && <p className="dc-field-error" style={{ marginTop: 4 }}>{error}</p>}

      {isOpen && !disabled && (
        <Portal top={pos.top} left={pos.left} width={pos.width} onClose={() => setIsOpen(false)}>
          <div className="dc-dropdown" style={{ position: "static", boxShadow: "none", border: "none" }}>
            <ul>
              {(!options || options.length === 0) ? (
                <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>
              ) : (
                options.map((opt, i) => {
                  const optValue = opt.id ?? opt.value;
                  const isSelected = String(value) === String(optValue);
                  return (
                    <li key={i}
                      className={`dc-opt${isSelected ? " selected" : ""}`}
                      onMouseDown={(e) => { e.preventDefault(); onSelect(optValue); setIsOpen(false); }}
                    >
                      {isSelected && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
                      {opt.label}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </Portal>
      )}
    </div>
  );
}

function Portal({ top, left, width, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("scroll", (e) => { if (ref.current && ref.current.contains(e.target)) return; onClose(); }, true);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  return (
    <div ref={ref}
      style={{ position: "fixed", top, left, width, zIndex: 999999, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      className="dropdown-portal"
    >
      {children}
    </div>
  );
}