import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, FileSpreadsheet, Search, MapPin, 
  Calendar as CalendarIcon, Users, Filter, ChevronDown, ChevronLeft, ChevronRight, Check, X, FileText
} from "lucide-react";
import api from "../../../../services/api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// ─── Global responsive styles (Exact match to Reference) ────────────────────
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  .ucr-wrap  { width:100%; padding-bottom:48px; font-family:Inter,sans-serif; }
  .ucr-card  { background:#fff; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,0.07); border:1px solid #f3f4f6; overflow:visible; margin-bottom: 24px; }
  .ucr-header{ padding:16px 20px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; gap:12px; }
  .ucr-body  { padding:24px; }
  .ucr-footer{ padding:14px 24px; background:#f9fafb; border-top:1px solid #f3f4f6; display:flex; align-items:center; justify-content:flex-end; border-radius:0 0 16px 16px; }
  .ucr-divider{ border:none; border-top:1px solid #f3f4f6; margin:0 0 24px; }

  /* 4 cols desktop layout matching design grid architecture */
  .ucr-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:28px; align-items: flex-end; }

  /* 2 cols tablet */
  @media(max-width:1024px){
    .ucr-grid  { grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:20px; }
    .ucr-body  { padding:18px; }
    .ucr-footer{ padding:12px 18px; }
    .ucr-header{ padding:14px 18px; }
  }

  /* 1 col mobile */
  @media(max-width:600px){
    .ucr-grid  { grid-template-columns:1fr; gap:12px; margin-bottom:16px; }
    .ucr-body  { padding:14px; }
    .ucr-footer{ padding:12px 14px; }
    .ucr-header{ padding:12px 14px; }
    .ucr-submit-btn{ width:100%; justify-content:center; }
  }

  /* Table layout architecture derived from reference specs */
  .ucr-table-container {
    overflow-x: auto;
    background: #fff;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }
  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .ucr-table thead { background: #f9fafb; border-bottom: 1px solid #f3f4f6; }
  .ucr-table th { padding: 12px 16px; text-align: left; font-weight: 700; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; border-right: 1px solid #f3f4f6; }
  .ucr-table td { padding: 12px 16px; color: #374151; border-bottom: 1px solid #f3f4f6; white-space: nowrap; border-right: 1px solid #f3f4f6; font-weight: 600; }
  .ucr-table th:last-child, .ucr-table td:last-child { border-right: none; }

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ucr-zoom { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  .dropdown-portal { animation: ucr-zoom 0.15s ease; }
`;

/* Shared reference layout size height configuration */
const FH = 36;

const CATEGORY_OPTIONS = [
  { id: "A", label: "A" }, { id: "A+", label: "A+" }, { id: "B", label: "B" },
  { id: "B+", label: "B+" }, { id: "C", label: "C" }, { id: "Core", label: "Core" },
  { id: "SuperCore", label: "SuperCore" }
];

export default function DoctorVisitReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [filterMode, setFilterMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    type: "",
    categories: [],
    fromDate: "",
    toDate: ""
  });

  const [reportData, setReportData] = useState([]);

  const handleViewStatus = async () => {
    setIsLoading(true);
    try {
      setShowTable(true);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
  };

  return (
    <div className="ucr-wrap">
      <style>{STYLES}</style>

      {/* --- Filter Card --- */}
      <div className="ucr-card">
        <div className="ucr-header" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={17} style={{ color: "#2563eb" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Doctor Visit Report</h2>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0, marginTop: 2 }}>Analyze medical representative doctor visits</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.07em" }}>FILTER</span>
            <button
              onClick={() => setFilterMode(!filterMode)}
              style={{
                width: 34, height: 18, borderRadius: 20, background: filterMode ? "#2563eb" : "#d1d5db",
                position: "relative", cursor: "pointer", border: "none", transition: "all 0.2s"
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 2, left: filterMode ? 18 : 2, transition: "all 0.2s"
              }} />
            </button>
          </div>
        </div>

        {filterMode && (
          <div className="ucr-body">
            <div className="ucr-grid">
              
              <div>
                <FloatingSelect 
                  label="Select Type *" 
                  options={[{id: "Self", label: "Self"}]} 
                  value={formData.type}
                  onSelect={(val) => setFormData({...formData, type: val})}
                />
              </div>

              <div>
                <FloatingMultiSelect 
                  label="Select Category *" 
                  options={CATEGORY_OPTIONS} 
                  value={formData.categories}
                  onChange={(val) => setFormData({...formData, categories: val})}
                />
              </div>

              <div>
                <FloatingDatePicker 
                  label="From Date" 
                  value={formData.fromDate}
                  onChange={(val) => setFormData({...formData, fromDate: val})}
                />
              </div>

              <div>
                <FloatingDatePicker 
                  label="To Date" 
                  value={formData.toDate}
                  onChange={(val) => setFormData({...formData, toDate: val})}
                />
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={handleViewStatus} 
                disabled={isLoading}
                className="ucr-submit-btn"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 24px", borderRadius: 9,
                  fontSize: 13, fontWeight: 700, border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  background: "#2563eb", color: "#fff",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                  opacity: isLoading ? 0.6 : 1, transition: "all 0.15s",
                  height: FH
                }}
              >
                {isLoading ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Check size={14} />}
                View Status
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Details Card --- */}
      {showTable && (
        <div className="ucr-card" style={{ animation: "ucr-zoom 0.2s ease" }}>
          <div className="ucr-header" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Doctor Visit Details</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                <input 
                  type="text" 
                  placeholder="Search Records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: 32, padding: "0 12px 0 32px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 12, color: "#111827", outline: "none", width: 200, fontWeight: 600, background: "#fff", transition: "all 0.15s" }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
              </div>
              <button 
                onClick={handleExportExcel}
                style={{ height: 32, width: 32, borderRadius: 8, background: "#eff6ff", border: "1px solid #dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#eff6ff"}
              >
                <FileSpreadsheet size={14} />
              </button>
            </div>
          </div>

          <div className="ucr-body" style={{ padding: 0 }}>
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: "center" }}>S. No.</th>
                    <th>State Name</th>
                    <th>Headquarter Name</th>
                    <th>Designation</th>
                    <th>Area Name</th>
                    <th>Employee Name</th>
                    <th>Employee Code</th>
                    <th>Doctor Name</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Specialization</th>
                    <th>Degree</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Frequency Visit</th>
                    <th>Total Visit</th>
                    <th>Visit Dates</th>
                    <th>Product Name</th>
                    <th>POB</th>
                    <th>Order Qty</th>
                    <th>Sample Qty</th>
                    <th>Reminder</th>
                    <th>Discussion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", color: "#6b7280" }}>1</td>
                    <td>UTTARAKHAND</td>
                    <td>RISHIKESH</td>
                    <td>---</td>
                    <td>DELHI</td>
                    <td>Swati</td>
                    <td>---</td>
                    <td style={{ fontWeight: 700, color: "#111827" }}>DR. KOMAL</td>
                    <td>---</td>
                    <td>
                      <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "#eff6ff", color: "#1d4ed8" }}>A</span>
                    </td>
                    <td>Ortho</td>
                    <td>MBBS</td>
                    <td>---</td>
                    <td>---</td>
                    <td>
                      <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "#ecfdf5", color: "#047857" }}>true</span>
                    </td>
                    <td>0</td>
                    <td>1</td>
                    <td>10-05-2026</td>
                    <td>DIPRO</td>
                    <td>297.00</td>
                    <td>3.00</td>
                    <td>0.00</td>
                    <td>---</td>
                    <td>test</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components (Styled exactly like Reference) ─────────────────────────

function FloatingDatePicker({ label, value, onChange, disabled }) {
  const [open,  setOpen]  = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const today  = new Date();
  const parsed = (value && !isNaN(Date.parse(value))) ? new Date(value + "T00:00:00") : today;
  const [view, setView]   = useState({ y: parsed.getFullYear(), m: parsed.getMonth() });
  const ref = useRef(null);

  const hasVal = Boolean(value);
  const active = open || hasVal;

  const openMenu = () => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: 270 // fixed calendar width
      });
    }
    setOpen(true);
  };

  const prevMonth = () => setView(v => v.m===0 ? {y:v.y-1,m:11} : {y:v.y,m:v.m-1});
  const nextMonth = () => setView(v => v.m===11 ? {y:v.y+1,m:0} : {y:v.y,m:v.m+1});

  const selectDay = (day) => {
    const ds = `${view.y}-${String(view.m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(ds);
    setOpen(false);
  };

  const firstDow    = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m+1, 0).getDate();

  const displayVal = hasVal
  ? new Date(value + "T00:00:00").toLocaleDateString("en-GB")
  : "";

  const selStr = (d) => `${view.y}-${String(view.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  return (
    <div className="relative w-full select-none" style={{ position: "relative" }}>
      <div
        ref={ref}
        onClick={openMenu}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${active && !disabled ? "#2563eb" : "#d1d5db"}`,
          cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#f3f4f6" : "#fff",
          transition: "border-color 0.2s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, fontWeight: 600, color: hasVal ? "#111827" : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>
          {displayVal || " "}
        </span>
        <CalendarIcon size={15} style={{ color: open ? "#2563eb" : "#9ca3af", flexShrink: 0 }} />
      </div>
      
      <label
        style={{
          position: "absolute", left: 10, top: active ? -9 : 10, fontSize: active ? 10 : 12,
          fontWeight: 600, color: disabled ? "#9ca3af" : (active ? "#2563eb" : "#9ca3af"), background: disabled ? (active ? "#f3f4f6" : "transparent") : "#fff",
          padding: "0 4px", transition: "0.2s", pointerEvents: "none",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "calc(100% - 20px)", zIndex: 11
        }}
      >
        {label}
      </label>

      {open && !disabled && (
        <Portal top={pos.top} left={pos.left} width={pos.width} onClose={() => setOpen(false)}>
          <div style={{ background: "#fff", overflow: "hidden" }}>
            <div style={{ background:"#2563eb", padding:"14px 14px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button
                onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); prevMonth(); }}
                style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:6, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", flexShrink:0 }}
              >
                <ChevronLeft size={14}/>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <select
                  value={view.m}
                  onChange={(e) => setView({ ...view, m: Number(e.target.value) })}
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "2px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none" }}
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i} style={{ color: "#000" }}>{m}</option>
                  ))}
                </select>
                <select
                  value={view.y}
                  onChange={(e) => setView({ ...view, y: Number(e.target.value) })}
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "2px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none" }}
                >
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map((y) => (
                    <option key={y} value={y} style={{ color: "#000" }}>{y}</option>
                  ))}
                </select>
              </div>
              <button
                onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); nextMonth(); }}
                style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:6, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", flexShrink:0 }}
              >
                <ChevronRight size={14}/>
              </button>
            </div>

            <div style={{ padding:"10px 12px 4px", background:"#f9fafb", borderBottom:"1px solid #f3f4f6" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, textAlign:"center" }}>
                {DAYS.map(d => (
                  <div key={d} style={{ fontSize:10, fontWeight:700, color:"#9ca3af", padding:"2px 0" }}>{d}</div>
                ))}
              </div>
            </div>

            <div style={{ padding:"8px 12px 12px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, textAlign:"center" }}>
                {Array.from({ length: firstDow }).map((_,i) => <div key={`e${i}`}/>)}

                {Array.from({ length: daysInMonth }).map((_,i) => {
                  const d      = i + 1;
                  const ds     = selStr(d);
                  const isSel  = value === ds;
                  const isToday = ds === todayStr;

                  return (
                    <button key={d}
                      onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); selectDay(d); }}
                      style={{
                        width:"100%", aspectRatio:"1", borderRadius:"50%", border:"none",
                        fontSize:12, fontWeight: isSel||isToday ? 700 : 400,
                        cursor:"pointer", transition:"all 0.12s",
                        background: isSel ? "#2563eb" : isToday ? "#eff6ff" : "transparent",
                        color: isSel ? "#fff" : isToday ? "#2563eb" : "#374151",
                        boxShadow: isSel ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                        outline: isToday && !isSel ? "1.5px solid #bfdbfe" : "none",
                        padding: 0, display: "flex", alignItems: "center", justifyContent: "center"
                      }}
                      onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background="#eff6ff"; }}
                      onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background= isToday?"#eff6ff":"transparent"; }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

function FloatingSelect({ label, options, value, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const hasVal = Boolean(value);
  const active = isOpen || hasVal;
  const borderColor = (isOpen || hasVal) ? "#2563eb" : "#d1d5db";
  const boxShadow = isOpen ? "0 0 0 3px rgba(37,99,235,0.08)" : "none";
  const selectedOption = options.find((opt) => String(opt.id) === String(value));

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: isOpen ? 100 : 1 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 34px 0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${borderColor}`, boxShadow,
          cursor: "pointer", background: "#fff", transition: "all 0.15s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, fontWeight: 600, color: value ? "#111827" : "transparent", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedOption?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#2563eb" : "#9ca3af" }}>
          <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label style={{
        position: "absolute", left: 10, top: active ? -9 : 10, fontSize: active ? 10 : 12,
        fontWeight: 600, color: active ? "#2563eb" : "#9ca3af", background: active ? "#fff" : "transparent",
        padding: active ? "0 4px" : "0", transition: "all 0.15s", pointerEvents: "none", zIndex: 11
      }}>
        {label}
      </label>

      {isOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 5px)", left: 0, width: "100%",
          background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, overflow: "hidden",
        }} className="dropdown-portal">
          <ul style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0", margin: 0, listStyle: "none" }}>
            {options.length === 0 && <li style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>No options</li>}
            {options.map((opt) => (
              <li key={opt.id} 
                onMouseDown={(e) => { e.preventDefault(); onSelect(opt.id); setIsOpen(false); }}
                style={{
                  padding: "8px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  background: String(value) === String(opt.id) ? "#eff6ff" : "transparent",
                  color: String(value) === String(opt.id) ? "#2563eb" : "#374151",
                  fontWeight: String(value) === String(opt.id) ? 600 : 400,
                  transition: "background 0.1s"
                }}
                onMouseEnter={e => { if (String(value) !== String(opt.id)) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={e => { if (String(value) !== String(opt.id)) e.currentTarget.style.background = "transparent"; }}
              >
                {String(value) === String(opt.id) && <Check size={12} style={{ color: "#2563eb", flexShrink: 0 }} />}
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FloatingMultiSelect({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const hasVal = value && value.length > 0;
  const active = isOpen || hasVal;
  const borderColor = (isOpen || hasVal) ? "#2563eb" : "#d1d5db";
  const boxShadow = isOpen ? "0 0 0 3px rgba(37,99,235,0.08)" : "none";

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: isOpen ? 100 : 1 }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: FH, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 34px 0 12px",
          cursor: "pointer", background: "#fff", border: `1.5px solid ${borderColor}`, boxShadow,
          transition: "all 0.15s", boxSizing: "border-box"
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: value.length ? "#111827" : "transparent", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {value.length ? value.join(", ") : " "}
        </span>
        <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#2563eb" : "#9ca3af" }}>
          <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label style={{
        position: "absolute", left: 10, top: active ? -9 : 10, fontSize: active ? 10 : 12,
        fontWeight: 600, color: active ? "#2563eb" : "#9ca3af", background: active ? "#fff" : "transparent",
        padding: active ? "0 4px" : "0", transition: "all 0.15s", pointerEvents: "none", zIndex: 11
      }}>
        {label}
      </label>
      
      {isOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 5px)", left: 0, width: "100%",
          background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, overflow: "hidden",
        }} className="dropdown-portal">
          <ul style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0", margin: 0, listStyle: "none" }}>
            {options.map(opt => (
              <li 
                key={opt.id} 
                onMouseDown={(e) => {
                  e.preventDefault();
                  const newVal = value.includes(opt.id) ? value.filter(v => v !== opt.id) : [...value, opt.id];
                  onChange(newVal);
                }}
                style={{
                  padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
                  cursor: "pointer", fontSize: 13,
                  background: value.includes(opt.id) ? "#eff6ff" : "transparent",
                  color: value.includes(opt.id) ? "#2563eb" : "#374151",
                  fontWeight: value.includes(opt.id) ? 600 : 400,
                  transition: "background 0.1s"
                }}
                onMouseEnter={e => { if (!value.includes(opt.id)) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={e => { if (!value.includes(opt.id)) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: 14, height: 14, border: "1.5px solid #d1d5db", borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: value.includes(opt.id) ? "#2563eb" : "#fff",
                  borderColor: value.includes(opt.id) ? "#2563eb" : "#d1d5db",
                  flexShrink: 0
                }}>
                  {value.includes(opt.id) && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Portal Utility ─────────────────────────────────────────────────────────

function Portal({ top, left, width, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  
  return (
    <div ref={ref} style={{ position: "fixed", top, left, width, zIndex: 9999, background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", overflow: "hidden" }} className="dropdown-portal">
      <div style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}