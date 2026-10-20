import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, Save, CheckCircle2,
  ChevronDown, Check, MapPin, Users, Briefcase, Map, AlertCircle
} from "lucide-react";
import api from "../../../services/api";

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ucr-wrap {
    font-family: 'Inter', sans-serif;
    width: 100%;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Single Unified Card Container ── */
  .ucr-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: isolate;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    position: relative;
    overflow: visible;
  }

  /* ── Card Header ── */
  .ucr-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    border-radius: 16px 16px 16px 16px !important;
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

  /* ── Form Footer ── */
  .ucr-footer {
    padding: 20px 28px 24px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-radius: 16px;
    border-top: 1px solid #f1f5f9;
  }

  /* ── Responsive Input Grids ── */
  .ucr-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }

  @media(max-width: 1200px) {
    .ucr-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  }
  @media(max-width: 640px) {
    .ucr-grid { grid-template-columns: 1fr; gap: 20px; }
    .ucr-body { padding: 20px 16px; }
    .ucr-header { padding: 20px 16px 12px; }
    .ucr-footer { padding: 16px; }
    .ucr-submit-btn { width: 100%; justify-content: center !important; }
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
  }
  .ucr-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.3);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }
  .ucr-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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

export default function ChangeHeadquarter() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  // Dropdown Lists
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    designationId: "",
    employeeId: "",
    stateId: "",
    districtId: ""
  });

  // ─── 1. INITIAL DATA FETCH ──────────────────────────────────────────
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [desigRes, statesRes] = await Promise.all([
        api.get('/api/masters/designations').catch(() => ({ data: { success: false }})),
        api.get('/api/masters/states').catch(() => ({ data: { success: false }}))
      ]);
      
      if (desigRes.data?.success) setDesignations(desigRes.data.data || []);
      if (statesRes.data?.success) setStates(statesRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
      setError("Failed to load dropdown data.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. CASCADING FETCH: Designation -> Employees ───────────────────
  useEffect(() => {
    if (formData.designationId) {
      fetchEmployeesByDesignation(formData.designationId);
    } else {
      setEmployees([]);
      setFormData(prev => ({ ...prev, employeeId: "" }));
    }
  }, [formData.designationId]);

  const fetchEmployeesByDesignation = async (designationId) => {
    try {
      const response = await api.get(`/api/masters/employees/designation/${designationId}`);
      if (response.data?.success) setEmployees(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setEmployees([]);
    }
  };

  // ─── 3. CASCADING FETCH: State -> Districts ─────────────────────────
  useEffect(() => {
    if (formData.stateId) {
      fetchDistrictsByState(formData.stateId);
    } else {
      setDistricts([]);
      setFormData(prev => ({ ...prev, districtId: "" }));
    }
  }, [formData.stateId]);

  const fetchDistrictsByState = async (stateId) => {
    try {
      const response = await api.get(`/api/masters/districts?stateId=${stateId}`);
      if (response.data?.success) setDistricts(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch districts", err);
      setDistricts([]);
    }
  };

  // ─── 4. HANDLERS ────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    
    if (!formData.employeeId || !formData.stateId || !formData.districtId) {
      setError("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      employeeId: parseInt(formData.employeeId),
      stateId: parseInt(formData.stateId),
      districtId: parseInt(formData.districtId)
    };

    try {
      const response = await api.put('/api/masters/employees/change-hq', payload);
      if (response.status === 200 || response.data?.success) {
        setPopup({ isOpen: true, message: "Headquarter Changed Successfully" });
        setFormData({ designationId: "", employeeId: "", stateId: "", districtId: "" });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change headquarter.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ucr-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="ucr-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <div className="ucr-card">
        <div className="ucr-header">
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div className="ucr-page-icon">
              <MapPin size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize:16, fontWeight:700, color:"#1e293b", letterSpacing:"-0.01em", lineHeight:1.2 }}>Change Headquarter</h1>
              <p style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Update the primary work location for an employee</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ucr-body">
            <SectionLabel text="Relocation Details" />
            <div className="ucr-grid">
              <FSelect
                label="Select Designation"
                name="designationId"
                value={formData.designationId}
                onChange={handleInputChange}
                options={designations.map(d => ({ id: d.id, label: d.designation_name || d.name }))}
              />
              <FSelect
                label="Select Employee"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
                disabled={!formData.designationId}
                options={employees.map(e => ({ id: e.id, label: e.name || e.employee_name }))}
              />
              <FSelect
                label="Select State"
                name="stateId"
                value={formData.stateId}
                onChange={handleInputChange}
                required
                options={states.map(s => ({ id: s.id, label: s.state_name }))}
              />
              <FSelect
                label="Select District"
                name="districtId"
                value={formData.districtId}
                onChange={handleInputChange}
                required
                disabled={!formData.stateId}
                options={districts.map(d => ({ id: d.id, label: d.district_name || d.name }))}
              />
            </div>
          </div>

          <div className="ucr-footer">
            <button
              type="submit"
              disabled={!formData.employeeId || !formData.stateId || !formData.districtId || isSubmitting}
              className="ucr-submit-btn"
            >
              {isSubmitting
                ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} />
                : <Save size={14} />}
              Update HQ
            </button>
          </div>
        </form>
      </div>

      {/* ── Success Popup ── */}
      {popup.isOpen && (
        <div className="dc-overlay">
          <div className="dc-popup">
            <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.25)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
              <Check size={28} style={{ color:"#3B82F6", strokeWidth:2.5 }}/>
            </div>
            <h3 className="ucr-brand" style={{ fontSize:17, fontWeight:700, color:"#1e293b", textAlign:"center", margin:"0 0 8px", letterSpacing:"-0.01em" }}>Success</h3>
            <p style={{ fontSize:13, color:"#94a3b8", textAlign:"center", margin:"0 0 24px" }}>{popup.message}</p>
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
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, marginTop:4 }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.12)", borderRadius:100, whiteSpace:"nowrap" }}>
        {icon && <span style={{ color:"#3B82F6", display:"flex", alignItems:"center" }}>{icon}</span>}
        <span style={{ fontSize:11, fontWeight:600, color:"#2563eb", letterSpacing:"0.04em" }}>{text}</span>
      </div>
      <div style={{ flex:1, height:1, background:"#f1f5f9" }}/>
    </div>
  );
}

/* ─── Searchable Dropdown Selection Component ─── */
function FSelect({ label, name, value, onChange, required, disabled, options=[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  }, []);

  const selected    = options.find(o => String(o.id)===String(value));
  const hasVal      = Boolean(value);
  const active      = open||hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor      = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow      = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  const handleSelect = (optId) => {
    onChange({ target:{ name, value:String(optId) } });
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position:"relative", width:"100%", userSelect:"none", zIndex: open?100:1 }} className="dc-field-wrap">
      <div onClick={()=>{ if(!disabled) setOpen(!open); }}
        style={{
          width:"100%", height:FH, borderRadius:8, padding:"0 36px 0 12px",
          fontSize:13, display:"flex", alignItems:"center",
          cursor: disabled?"not-allowed":"pointer", background: bgColor,
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled?"none":shadow, transition:"all 0.18s", boxSizing:"border-box",
        }}
      >
        <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:500, color: hasVal?(disabled?"#94a3b8":"#1e293b"):"transparent", fontSize:14 }}>
          {selected?.label||" "}
        </span>
        <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color: open?"#3B82F6":"#94a3b8", transition:"all 0.2s" }}>
          <ChevronDown size={15} style={{ transform: open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}/>
        </div>
      </div>

      <label style={{
        position:"absolute", left:10, pointerEvents:"none", zIndex:20,
        transition:"all 0.12s ease-out", fontWeight:500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}{required ? " *" : ""}</label>

      {open && !disabled && (
        <div className="dc-dropdown">
          <ul>
            {options.length===0 && <li style={{ padding:"12px", fontSize:12, color:"#94a3b8", fontStyle:"italic" }}>No options available</li>}
            {options.map(opt => (
              <li key={opt.id}
                className={`dc-opt${String(value)===String(opt.id)?" selected":""}`}
                onMouseDown={e=>{ e.preventDefault(); handleSelect(opt.id); }}
              >
                {String(value)===String(opt.id) && <Check size={12} style={{color:"#3B82F6",flexShrink:0}}/>}
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}