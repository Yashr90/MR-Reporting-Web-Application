import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, Check, AlertCircle, CheckCircle2,
  MapPin, Package, Tag, Hash, Layers,
  FlaskConical, DollarSign, ChevronDown
} from "lucide-react";
import api from "../../../services/api";

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dc-wrap {
    font-family: 'Inter', sans-serif;
    width: 100%;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Single Unified Card Container (No background template bleed) ── */
  .dc-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: isolate;
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
    border-radius: 16px 16px 16px 16px !important;
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

  /* ── Form Body ── */
  .dc-body { padding: 20px 28px 24px; background: #ffffff; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; }

  /* ── Form Footer ── */
  .dc-footer {
    padding: 20px 28px 24px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-radius: 0 0 16px 16px;
    border-top: 1px solid #f1f5f9;
  }

  .dc-divider {
    border: none;
    border-top: 1px solid #f1f5f9;
    margin: 24px 0 28px;
  }

  /* ── Responsive Input Grids ── */
  .dc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }

  @media(max-width: 1200px) {
    .dc-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media(max-width: 900px) {
    .dc-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  }
  @media(max-width: 640px) {
    .dc-grid { grid-template-columns: 1fr; gap: 20px; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; }
    .dc-submit-btn { width: 100%; justify-content: center !important; }
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
    z-index: 9999 !important;
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

  /* ── System Error Banner ── */
  .dc-error-banner {
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

  /* ── Success Banner ── */
  .dc-success-banner {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 12px 16px;
    color: #16a34a;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ── Submission Button (Clearly Blue & Solidly Visible) ── */
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
  .dc-submit-btn:disabled { background: #93c5fd !important; color: #ffffff !important; cursor: not-allowed; box-shadow: none; opacity: 0.8 !important; }

  .dc-overlay {
    position: fixed; inset: 0; z-index: 1000;
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
  @keyframes dc-zoom { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
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

export default function ProductCreation() {
  const [isLoading,    setIsLoading]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");
  const [successMsg,   setSuccessMsg]   = useState("");
  const [popup,        setPopup]        = useState({ isOpen: false, message: "" });

  const [states, setStates] = useState([]);

  const [formData, setFormData] = useState({
    selectedStateIds:   [],
    productName:        "",
    productCode:        "",
    productType:        "",
    productShortName:   "",
    productPackageSize: "",
    samplePackageSize:  "",
    ptw:                "",
    ptr:                "",
    mrp:                "",
    sampleRate:         "",
    includeVat:         "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => { fetchStates(); }, []);

  const fetchStates = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/masters/states");
      if (res.data?.success) setStates(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch states", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let errMsg = "";
    if (value) {
      if (name === "mrp" && isNaN(Number(value))) errMsg = "MRP must be a number.";
      if (name === "ptw" && isNaN(Number(value))) errMsg = "PTW must be a number.";
      if (name === "ptr" && isNaN(Number(value))) errMsg = "PTR must be a number.";
    }
    setFieldErrors(prev => ({ ...prev, [name]: errMsg }));
  };

  const handleStateToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      selectedStateIds: prev.selectedStateIds.includes(id)
        ? prev.selectedStateIds.filter(s => s !== id)
        : [...prev.selectedStateIds, id]
    }));
  };

  const handleSelectAllStates   = () => setFormData(prev => ({ ...prev, selectedStateIds: states.map(s => s.id) }));
  const handleDeselectAllStates = () => setFormData(prev => ({ ...prev, selectedStateIds: [] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccessMsg("");

    if (!formData.productName.trim()) return setError("Product Name is required.");
    if (!formData.mrp)                return setError("MRP is required.");
    if (!formData.ptr)                return setError("PTR is required.");
    if (!formData.ptw)                return setError("PTW is required.");
    if (Object.values(fieldErrors).some(v => v))
      return setError("Please fix the highlighted errors before submitting.");

    setIsSubmitting(true);

    const payload = {
      stateIds:           formData.selectedStateIds,
      productName:        formData.productName.trim(),
      productCode:        formData.productCode.trim()        || null,
      productType:        formData.productType.trim()        || null,
      productShortName:   formData.productShortName.trim()   || null,
      packageSize:        formData.productPackageSize.trim() || null,
      samplePackageSize:  formData.samplePackageSize.trim()  || null,
      ptw:                formData.ptw        ? parseFloat(formData.ptw)        : null,
      ptr:                formData.ptr        ? parseFloat(formData.ptr)        : null,
      mrp:                formData.mrp        ? parseFloat(formData.mrp)        : null,
      sampleRate:         formData.sampleRate ? parseFloat(formData.sampleRate) : null,
      includeVat:         formData.includeVat || null,
    };

    try {
      const res = await api.post("/api/masters/products", payload);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setPopup({ isOpen: true, message: "Product Created Successfully!" });
        setFormData({
          selectedStateIds: [], productName: "", productCode: "",
          productType: "", productShortName: "", productPackageSize: "",
          samplePackageSize: "", ptw: "", ptr: "", mrp: "", sampleRate: "", includeVat: "",
        });
        setFieldErrors({});
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = formData.productName.trim() && formData.mrp && formData.ptr && formData.ptw;

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}
      {successMsg && (
        <div className="dc-success-banner">
          <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
          {successMsg}
        </div>
      )}

      {/* ── Single Unified Card Container ── */}
      <div className="dc-card">
        {/* Header */}
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Package size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Product Creation Form</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Fill in product details and rate information.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Body Area */}
          <div className="dc-body">

            {/* Geography / State Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 300px))", gap: 16, marginBottom: 5 }}>
              <MultiStateSelect
                label="Select State"
                states={states}
                selectedIds={formData.selectedStateIds}
                onToggle={handleStateToggle}
                onSelectAll={handleSelectAllStates}
                onDeselectAll={handleDeselectAllStates}
              />
            </div>

            <hr className="dc-divider" />

            {/* Product Information */}
            <SectionLabel text="Product Information" />
            <div className="dc-grid">
              <FloatingInput label="Product Name" name="productName" value={formData.productName} onChange={handleInputChange} required icon={Package} />
              <FloatingInput label="Product Code" name="productCode" value={formData.productCode} onChange={handleInputChange} icon={Hash} />
              <FloatingInput label="Product Type" name="productType" value={formData.productType} onChange={handleInputChange} icon={Tag} />
              <FloatingInput label="Product Short Name" name="productShortName" value={formData.productShortName} onChange={handleInputChange} icon={Layers} />
            </div>
            <div className="dc-grid">
              <FloatingInput label="Product Package Size" name="productPackageSize" value={formData.productPackageSize} onChange={handleInputChange} icon={FlaskConical} />
              <FloatingInput label="Sample Package Size" name="samplePackageSize" value={formData.samplePackageSize} onChange={handleInputChange} icon={FlaskConical} />
            </div>

            <hr className="dc-divider" />

            {/* Product Rate Information */}
            <SectionLabel text="Product Rate Information" />
            <div className="dc-grid">
              <FloatingInput label="PTW" name="ptw" value={formData.ptw} onChange={handleInputChange} type="text" icon={DollarSign} error={fieldErrors.ptw} required />
              <FloatingInput label="PTR" name="ptr" value={formData.ptr} onChange={handleInputChange} type="text" icon={DollarSign} error={fieldErrors.ptr} required />
              <FloatingInput label="MRP" name="mrp" value={formData.mrp} onChange={handleInputChange} type="text" icon={DollarSign} error={fieldErrors.mrp} required />
              <FloatingInput label="Sample Rate" name="sampleRate" value={formData.sampleRate} onChange={handleInputChange} type="text" icon={DollarSign} />
            </div>
            <div className="dc-grid">
              <FloatingInput label="Include VAT" name="includeVat" value={formData.includeVat} onChange={handleInputChange} icon={Tag} />
            </div>

          </div>

          {/* Action Footer */}
          <div className="dc-footer">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="dc-submit-btn"
            >
              {isSubmitting
                ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} />
                : <Check size={14} />}
              Submit Product
            </button>
          </div>
        </form>
      </div>

      {/* ── Success Popup ── */}
      {popup.isOpen && (
        <div className="dc-overlay">
          <div className="dc-popup">
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Check size={28} style={{ color: "#3B82F6", strokeWidth: 2.5 }} />
            </div>
            <h3 className="ucr-brand" style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Success</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 24px" }}>{popup.message}</p>
            <button
              onClick={() => setPopup({ isOpen: false, message: "" })}
              style={{
                background: "linear-gradient(135deg, #3B82F6, #2563eb)", color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 0", width: "100%", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 14px rgba(59,130,246,0.2)", transition: "all 0.15s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.2)"; }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Section Label ──────────────────────────────────────────────────────── */
function SectionLabel({ text, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, marginTop: 4 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)", borderRadius:100, whiteSpace: "nowrap" }}>
        {icon && <span style={{ color: "#3B82F6", display: "flex", alignItems: "center" }}>{icon}</span>}
        <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", letterSpacing: "0.04em" }}>{text}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
    </div>
  );
}

/* ─── Floating Text Input ─────────────────────────────────────────────────── */
function FloatingInput({ label, name, type = "text", value, onChange, required, disabled, icon: Icon, error }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = error ? "#fca5a5" : focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow  = focus && !disabled ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)") : "none";
  const labelColor = error ? "#dc2626" : focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position: "relative", width: "100%", height: FH }}>
        <input
          type={type} id={name} name={name} value={value || ""} onChange={onChange}
          required={required} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder=" "
          style={{
            ...fieldBase,
            padding: Icon ? "0 36px 0 12px" : "0 12px",
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
            color: disabled ? "#94a3b8" : "#1e293b",
          }}
        />
        <label style={{
          position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
          transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
          transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
        }}>{label}{required ? " *" : ""}</label>

        {Icon && (
          <div style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            color: error ? "#dc2626" : focus ? "#3B82F6" : "#94a3b8", display: "flex", alignItems: "center", pointerEvents: "none"
          }}>
            <Icon size={15} />
          </div>
        )}
      </div>
      {error && <p className="dc-field-error">{error}</p>}
    </div>
  );
}

/* ─── Searchable Multi-Select State Dropdown Component ─── */
function MultiStateSelect({ label, states, selectedIds, onToggle, onSelectAll, onDeselectAll }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasValue    = selectedIds.length > 0;
  const active      = isOpen || hasValue;
  const displayText = hasValue
    ? states.filter(s => selectedIds.includes(s.id)).map(s => s.state_name).join(", ")
    : "";

  const borderColor = isOpen ? "#3B82F6" : hasValue ? "#bfdbfe" : "#e2e8f0";
  const bgColor      = isOpen ? "#eff6ff" : "#ffffff";
  const shadow      = isOpen ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = isOpen ? "#3B82F6" : hasValue ? "#64748b" : "#94a3b8";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: isOpen ? 100 : 1 }} className="dc-field-wrap">
      {/* Trigger Area */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center",
          cursor: "pointer", background: bgColor,
          border: `1.5px solid ${borderColor}`,
          boxShadow: shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasValue ? "#1e293b" : "transparent", fontSize: 14 }}>
          {displayText || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#3B82F6" : "#94a3b8", transition: "all 0.2s", display: "flex", alignItems: "center" }}>
          <MapPin size={15} style={{ marginRight: 4, opacity: 0.7 }} />
          <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>

      {/* Floating Label */}
      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}</label>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="dc-dropdown">
          <div style={{ display: "flex", borderBottom: "1px solid #edf2f7", background: "#f8fafc" }}>
            <button type="button" style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#2563eb", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onSelectAll(); }}>Select All</button>
            <button type="button" style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onDeselectAll(); }}>Deselect All</button>
          </div>
          <ul>
            {states.length === 0 && <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>}
            {states.map(s => {
              const isSel = selectedIds.includes(s.id);
              return (
                <li
                  key={s.id}
                  className={`dc-opt${isSel ? " selected" : ""}`}
                  onMouseDown={(e) => { e.preventDefault(); onToggle(s.id); }}
                >
                  <input type="checkbox" checked={isSel} readOnly style={{ accentColor: "#3B82F6", cursor: "pointer", marginRight: 8 }} />
                  {s.state_name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}