import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check, ChevronDown, ChevronRight, ChevronLeft,
  Plus, ArrowLeft, Save, FileText, CheckCircle2,
  Users, Calendar as CalendarIcon, Loader2, AlertCircle,
  MapPin, Tag, Hash, Layers, FlaskConical, DollarSign
} from "lucide-react";
import api from "../../../services/api";

const STEPS = [
  "DCR Main", "Doctor", "Chemist / Stockist", "Meetings", "Misc Expenses", "Preview"
];

const EXACT_STATUS_OPTIONS = [
  { id: "Working",                 label: "Working" },
  { id: "Working & Half Day Leave", label: "Working & Half Day Leave" },
  { id: "Weekly Off",               label: "Weekly Off" },
  { id: "Leave",                    label: "Leave" },
  { id: "Admin Work",               label: "Admin Work" },
  { id: "Meeting",                  label: "Meeting" },
  { id: "Transit",                  label: "Transit" },
  { id: "Conference",               label: "Conference" },
  { id: "Holiday",                  label: "Holiday" },
  { id: "Other",                    label: "Other" },
  { id: "WFH",                      label: "WFH" },
  { id: "Travel & Working",         label: "Travel & Working" },
];

const EXACT_EXPENSE_TYPES = [
  { id: "Communication Allowance", label: "Communication Allowance" },
  { id: "Stationary",              label: "Stationary" },
  { id: "Photocopy",               label: "Photocopy" },
  { id: "Courier",                 label: "Courier" },
  { id: "Food Bill",               label: "Food Bill" },
  { id: "Train Fare",              label: "Train Fare" },
  { id: "Bus Fare",                label: "Bus Fare" },
  { id: "Area Wise Statement",     label: "Area Wise Statement" },
  { id: "Misc Exp",                label: "Misc Exp" },
  { id: "Metro City Allowance",    label: "Metro City Allowance" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

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

  /* ── Wizard Stepper Container ── */
  .dc-stepper-container {
    padding: 4px 28px 16px;
    background: #ffffff;
    overflow-x: auto;
    display: flex;
    align-items: center;
    scrollbar-width: none;
  }
  .dc-stepper-container::-webkit-scrollbar { display: none; }

  /* ── Form Body Area ── */
  .dc-body { 
    padding: 20px 28px 24px; 
    background: #ffffff; 
  }

  /* ── Form Footer Area ── */
  .dc-footer {
    padding: 20px 28px 24px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .dc-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 25px;
  }

  .dc-grid-12 {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
    align-items: start;
    margin-bottom: 16px;
    padding-bottom: 4px;
  }

  .col-span-2 { grid-column: span 2; }
  .col-span-3 { grid-column: span 3; }
  .col-span-4 { grid-column: span 4; }
  .col-span-5 { grid-column: span 5; }
  .col-span-6 { grid-column: span 6; }
  .col-span-12 { grid-column: span 12; }

  @media(max-width: 1200px) {
    .dc-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media(max-width: 900px) {
    .dc-grid, .dc-grid-2 { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .dc-grid-12 { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .col-span-3, .col-span-4, .col-span-5, .col-span-2 { grid-column: span 1; }
  }
  @media(max-width: 640px) {
    .dc-grid, .dc-grid-2, .dc-grid-12 { grid-template-columns: 1fr; gap: 20px; }
    .col-span-3, .col-span-4, .col-span-5, .col-span-2 { grid-column: span 1 !important; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-stepper-container { padding: 4px 16px 12px; }
    .dc-footer { padding: 16px; flex-direction: column; gap: 12px; }
    .dc-submit-btn, .dc-secondary-btn { width: 100%; justify-content: center !important; }
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

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    box-shadow: 0 0 0 1000px #ffffff inset !important;
    -webkit-text-fill-color: #1e293b !important;
    transition: background-color 5000s ease-in-out 0s;
  }

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

  .dc-secondary-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: 1.5px solid #e2e8f0;
    cursor: pointer;
    background: #ffffff;
    color: #475569;
    transition: all 0.15s ease;
    font-family: 'Plus Jakarta Sans', sans-serif;
    height: 40px;
  }
  .dc-secondary-btn:hover:not(:disabled) {
    background: #f8fafc;
    color: #1e293b;
    border-color: #cbd5e1;
  }

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

  .dc-cal {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    padding: 16px;
    animation: dc-cal-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes dc-cal-pop {
    from { opacity: 0; transform: translateY(4px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .dc-cal-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; }
  .dc-cal-nav-btn { width: 28px; height: 28px; border-radius: 8px; background: #ffffff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; transition: all 0.15s ease; }
  .dc-cal-nav-btn:hover { background: #f1f5f9; color: #1e293b; border-color: #cbd5e1; }
  .dc-cal-select-group { display: flex; align-items: center; gap: 4px; }
  .dc-cal-select-wrap { position: relative; display: flex; align-items: center; }
  .dc-cal-native-select { appearance: none; -webkit-appearance: none; background: #f8fafc; color: #2563eb; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 22px 4px 10px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none; font-family: 'Inter', sans-serif; transition: all 0.15s ease; }
  .dc-cal-native-select:hover { background: #eff6ff; border-color: #bfdbfe; }
  .dc-cal-weekday-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 6px; }
  .dc-cal-weekday { font-size: 11px; font-weight: 600; color: #94a3b8; padding: 4px 0; text-transform: uppercase; letter-spacing: 0.02em; }
  .dc-cal-days-grid { display: grid; grid-template-columns: repeat(7, 1fr); row-gap: 4px; column-gap: 4px; text-align: center; }
  .dc-cal-day-cell { width: 100%; aspect-ratio: 1; border-radius: 50%; border: none; font-size: 13px; font-weight: 500; cursor: pointer; background: transparent; color: #334155; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; transition: all 0.12s cubic-bezier(0.16, 1, 0.3, 1); }
  .dc-cal-day-cell:hover:not(.selected) { background: #f1f5f9; color: #0f172a; }
  .dc-cal-day-cell.today:not(.selected) { color: #3B82F6; font-weight: 700; background: rgba(59, 130, 246, 0.08); }
  .dc-cal-day-cell.selected { background: #3B82F6 !important; color: #ffffff !important; font-weight: 600; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3); }

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

export default function SubmitDCR() {
  const [currentStep,   setCurrentStep]  = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg,      setErrorMsg]     = useState("");
  const [popup,        setPopup]        = useState({ isOpen: false, message: "" });

  const [masterData, setMasterData] = useState({
    employees: [], areas: [], doctors: [], chemists: [], stockists: [], allChemStock: []
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [emp, area, doc, chemStock] = await Promise.all([
          api.get("/api/employees/managers").catch(() => ({ data: { data: [] } })),
          api.get("/api/areas").catch(() => ({ data: { data: [] } })),
          api.get("/api/doctors/mapped").catch(() => ({ data: { data: [] } })),
          api.get("/api/chemists-stockists").catch(() => ({ data: { data: [] } })),
        ]);
        
        const mapData = (res) =>
          (res?.data?.data || res?.data || []).map((item) => ({
            ...item, 
            id:    String(item?.id || item?.value || item?._id),
            label: item?.label || item?.name || item?.status_name || "Unknown",
          }));
          
        const mappedChemStock = mapData(chemStock);
        
        const filteredChemists = mappedChemStock.filter(c => {
          const t = String(c.type || c.chemistType || c.providerType || "").toLowerCase();
          return t === "chemist";
        });

        const filteredStockists = mappedChemStock.filter(c => {
          const t = String(c.type || c.chemistType || c.providerType || "").toLowerCase();
          return t === "stockist";
        });
        
        setMasterData({
          employees: mapData(emp), 
          areas:     mapData(area),
          doctors:   mapData(doc), 
          chemists: filteredChemists,
          stockists: filteredStockists,
          allChemStock: mappedChemStock
        });
      } catch (err) { console.error("Error fetching master data:", err); }
    };
    fetchMasterData();
  }, []);

  // ── form states ────────────────────────────────────────────────────────────
  const [dcrMain, setDcrMain] = useState({
    date: "", workingStatus: "", jointWorkWith: [],
    isDeviate: false, deviateReason: "", areas: [], remarks: "",
  });
  const [doctors,          setDoctors]          = useState([]);
  const [chemistTypeView,  setChemistTypeView]  = useState("Chemist");
  const [chemistsStockists,setChemistsStockists]= useState([]);
  const [meetings,         setMeetings]         = useState([]);
  const [expenses,         setExpenses]         = useState([]);

  const requiresExtraFields = ["Working","Working & Half Day Leave","WFH","Travel & Working"]
    .includes(dcrMain.workingStatus);

  // ── stepper ────────────────────────────────────────────────────────────────
  const handleNext = () => { if (currentStep < STEPS.length - 1) { setCurrentStep(p => p + 1); window.scrollTo({ top:0, behavior:"smooth" }); } };
  const handleBack = () => { if (currentStep > 0) { setCurrentStep(p => p - 1); window.scrollTo({ top:0, behavior:"smooth" }); } };

  const handleFinalSubmit = async () => {
    setErrorMsg("");
    
    if (!dcrMain.date || !dcrMain.workingStatus) {
      setErrorMsg("DCR Date and Working Status are required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        dcrDate: dcrMain.date,
        workingStatus: dcrMain.workingStatus,
        jointWorkManagerId: dcrMain.jointWorkWith.length > 0 ? Number(dcrMain.jointWorkWith[0]) : null,
        remarks: dcrMain.remarks || "",
        isDeviate: dcrMain.isDeviate,
        deviateReason: dcrMain.isDeviate ? (dcrMain.deviateReason || "") : "",
        travelAreas: dcrMain.areas
          .filter(a => a.from && a.to)
          .map(a => ({
            fromAreaId: Number(a.from),
            toAreaId: Number(a.to)
        })),
        doctorCalls: doctors
          .filter(d => d.doctorId)
          .map(d => ({
            doctorId: Number(d.doctorId),
            jointWithManagerId: d.jointWorkWith.length > 0 ? Number(d.jointWorkWith[0]) : null,
            remarks: d.remarks || "",
            productListIds: [] 
        })),
        chemistStockistCalls: chemistsStockists
          .filter(cs => cs.targetId)
          .map(cs => {
            const originalItem = masterData.allChemStock.find(x => String(x.id) === String(cs.targetId));
            const rawType = String(originalItem?.type || originalItem?.chemistType || originalItem?.providerType || cs.type).toLowerCase();
            const finalType = rawType.includes("stockist") ? "STOCKIST" : "CHEMIST";

            return {
              chemistStockistId: Number(cs.targetId),
              type: finalType,
              jointWithManagerId: cs.jointWorkWith.length > 0 ? Number(cs.jointWorkWith[0]) : null,
              remarks: cs.remarks || ""
            };
        }),
        nextMeetings: meetings
          .filter(m => m.meetingWith)
          .map(m => ({
            meetingWithManagerId: Number(m.meetingWith),
            subject: m.subject || "",
            remarks: m.remarks || ""
        })),
        expenses: expenses
          .filter(e => e.expenseType && e.amount)
          .map(e => ({
            expenseType: e.expenseType,
            amount: Number(e.amount),
            remarks: e.remarks || ""
        }))
      };

      await api.post("/api/dcr", payload);

      setDcrMain({
        date: "", workingStatus: "", jointWorkWith: [],
        isDeviate: false, deviateReason: "", areas: [], remarks: "",
      });
      setDoctors([]);
      setChemistsStockists([]);
      setMeetings([]);
      setExpenses([]);
      setCurrentStep(0);
      setPopup({ isOpen: true, message: "DCR Submitted Successfully!" });
    } catch (err) { 
      console.error("Submit error", err); 
      const backendError = err.response?.data?.message || err.response?.data?.error || "Failed to submit DCR. Please review your entries.";
      setErrorMsg(backendError);
    } finally { 
      setIsSubmitting(false); 
      window.scrollTo({ top:0, behavior:"smooth" });
    }
  };

  // ── list helpers ───────────────────────────────────────────────────────────
  const addArea     = ()           => setDcrMain(p => ({ ...p, areas: [...p.areas, { id: Date.now(), from:"", to:"" }] }));
  const removeArea  = (id)         => setDcrMain(p => ({ ...p, areas: p.areas.filter(a => a.id !== id) }));
  const updateArea  = (id, f, v)   => setDcrMain(p => ({ ...p, areas: p.areas.map(a => a.id===id ? {...a,[f]:v} : a) }));

  const addDoctor    = ()         => setDoctors(d => [...d, { id:Date.now(), doctorId:"", jointWorkWith:[], remarks:"" }]);
  const removeDoctor = (id)       => setDoctors(d => d.filter(x => x.id!==id));
  const updateDoctor = (id,f,v)   => setDoctors(d => d.map(x => x.id===id ? {...x,[f]:v} : x));

  const addCS     = ()         => setChemistsStockists(d => [...d, { id:Date.now(), type:chemistTypeView, targetId:"", jointWorkWith:[], remarks:"" }]);
  const removeCS  = (id)       => setChemistsStockists(d => d.filter(x => x.id!==id));
  const updateCS  = (id,f,v)   => setChemistsStockists(d => d.map(x => x.id===id ? {...x,[f]:v} : x));

  const addMeeting    = ()       => setMeetings(d => [...d, { id:Date.now(), meetingWith:"", subject:"", remarks:"" }]);
  const removeMeeting = (id)     => setMeetings(d => d.filter(x => x.id!==id));
  const updateMeeting = (id,f,v) => setMeetings(d => d.map(x => x.id===id ? {...x,[f]:v} : x));

  const addExpense    = ()       => setExpenses(d => [...d, { id:Date.now(), expenseType:"", amount:"", remarks:"" }]);
  const removeExpense = (id)     => setExpenses(d => d.filter(x => x.id!==id));
  const updateExpense = (id,f,v) => setExpenses(d => d.map(x => x.id===id ? {...x,[f]:v} : x));

  // ── stepper UI ─────────────────────────────────────────────────────────────
  const renderStepper = () => (
    <div className="dc-stepper-container">
      <div style={{ display:"flex", alignItems:"center", gap:0, width:"100%" }}>
        {STEPS.map((step, idx) => {
          const isActive    = idx === currentStep;
          const isCompleted = idx < currentStep;
          return (
            <React.Fragment key={idx}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <div style={{
                  width:32, height:32, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700, transition:"all 0.2s ease",
                  background: isCompleted ? "#2563eb" : isActive ? "#2563eb" : "#f1f5f9",
                  color:       isCompleted ? "#fff"    : isActive ? "#fff"    : "#94a3b8",
                  boxShadow:   isActive ? "0 4px 10px rgba(37,99,235,0.25)" : "none",
                }}>
                  {isCompleted ? <Check size={14} strokeWidth={2.5}/> : idx + 1}
                </div>
                <span className="ucr-brand" style={{
                  fontSize:13, fontWeight:isActive||isCompleted ? 700 : 500,
                  color: isActive||isCompleted ? "#1e293b" : "#64748b",
                  whiteSpace:"nowrap",
                }}>
                  {step}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{
                  flex:1, height:2, minWidth:24, margin:"0 12px",
                  background: isCompleted ? "linear-gradient(90deg, #3B82F6, #2563eb)" : "#edf2f7",
                  transition:"background 0.3s",
                  borderRadius:2,
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  // ── step renderers ─────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div className="dc-grid">
        <FloatingDatePicker label="Date" value={dcrMain.date} onChange={v => setDcrMain({...dcrMain, date:v})} required />
        <SingleDropdown label="Working Status" options={EXACT_STATUS_OPTIONS} value={dcrMain.workingStatus} onSelect={v => setDcrMain({...dcrMain, workingStatus:v})} required />
        {requiresExtraFields && (
          <div className="col-span-2">
            <MultiSelectDropdown label="Joint Work With" options={masterData.employees} selectedIds={dcrMain.jointWorkWith} onChange={v => setDcrMain({...dcrMain, jointWorkWith:v})} />
          </div>
        )}
      </div>

      {requiresExtraFields && (
        <div className="dc-grid-2" style={{ paddingTop:8, marginBottom:0 }}>
          {/* Deviate Block */}
          <div>
            <SectionLabel text="Deviate Info" />
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", width:"fit-content", marginTop: 12 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, border: dcrMain.isDeviate ? "none" : "2px solid #cbd5e1",
                background: dcrMain.isDeviate ? "#2563eb" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                transition: "all 0.15s",
                boxShadow: dcrMain.isDeviate ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
              }}>
                {dcrMain.isDeviate && <Check size={12} style={{ color:"#fff", strokeWidth: 3 }}/>}
              </div>
              <span style={{ fontSize:13.5, fontWeight:500, color: dcrMain.isDeviate ? "#1e293b" : "#64748b" }}>Deviate Reason</span>
              <input type="checkbox" style={{ display:"none" }} checked={dcrMain.isDeviate}
                onChange={e => setDcrMain({...dcrMain, isDeviate:e.target.checked, deviateReason: e.target.checked ? dcrMain.deviateReason : ""})} />
            </label>
            {dcrMain.isDeviate && (
              <div style={{ marginTop:16 }}>
                <FloatingInput label="Reason" value={dcrMain.deviateReason} onChange={e => setDcrMain({...dcrMain, deviateReason:e.target.value})} required />
              </div>
            )}
          </div>

          {/* Travel Areas Details */}
          <div>
            <SectionLabel text="Area Details" />
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop: 12 }}>
              {dcrMain.areas.map(area => (
                <div key={area.id} className="dc-grid-12" style={{ marginBottom: 0 }}>
                  <div className="col-span-5"><SingleDropdown label="From Area" options={masterData.areas} value={area.from} onSelect={v => updateArea(area.id,"from",v)} /></div>
                  <div className="col-span-5"><SingleDropdown label="To Area" options={masterData.areas} value={area.to} onSelect={v => updateArea(area.id,"to",v)} /></div>
                  <div className="col-span-2" style={{ marginTop: 4 }}>
                    <button onClick={() => removeArea(area.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", height: FH, width: "100%", borderRadius:8, fontSize:12, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", cursor:"pointer", transition:"0.2s" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addArea} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px 16px", borderRadius:8, fontSize:12, fontWeight:700, background: "rgba(59,130,246,0.06)", color:"#2563eb", border:"1px dashed rgba(59,130,246,0.22)", cursor:"pointer", transition:"0.2s", width: "fit-content" }}>
                <Plus size={14}/> Add Area
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ paddingTop:4 }}>
        <FloatingTextarea label="Remarks" value={dcrMain.remarks} onChange={e => setDcrMain({...dcrMain, remarks:e.target.value})} />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionLabel text="Doctor Visited Info" />
      {doctors.length === 0 && <p style={emptyStyle}>No doctors added yet.</p>}
      {doctors.map(doc => (
        <div key={doc.id} className="dc-grid-12">
          <div className="col-span-3"><SingleDropdown label="Select Doctor" options={masterData.doctors} value={doc.doctorId} onSelect={v => updateDoctor(doc.id,"doctorId",v)} required /></div>
          <div className="col-span-3"><MultiSelectDropdown label="Joint Work With" options={masterData.employees} selectedIds={doc.jointWorkWith} onChange={v => updateDoctor(doc.id,"jointWorkWith",v)} /></div>
          <div className="col-span-4"><FloatingInput label="Remarks" value={doc.remarks} onChange={e => updateDoctor(doc.id,"remarks",e.target.value)} /></div>
          <div className="col-span-2" style={{ marginTop: 4 }}>
            <button onClick={() => removeDoctor(doc.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", height: FH, width: "100%", borderRadius:8, fontSize:12, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", cursor:"pointer", transition:"0.2s" }}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button onClick={addDoctor} className="dc-submit-btn" style={{ width: "fit-content", marginTop: 8 }}>
        <Plus size={14}/> Add More Doctor
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:20, padding: "4px 0" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>Choose Type:</span>
        {["Chemist","Stockist"].map(t => (
          <label key={t} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: chemistTypeView === t ? "2px solid #2563eb" : "2px solid #cbd5e1",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: chemistTypeView === t ? "rgba(59,130,246,0.1)" : "#fff",
              transition: "all 0.15s",
              boxShadow: chemistTypeView === t ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
            }}>
              {chemistTypeView===t && <div style={{ width:8, height:8, borderRadius:"50%", background:"#2563eb" }}/>}
            </div>
            <span style={{ fontSize:13.5, fontWeight:500, color: chemistTypeView===t ? "#1e293b" : "#64748b" }}>{t}</span>
            <input type="radio" style={{ display:"none" }} checked={chemistTypeView===t} onChange={() => {
              setChemistTypeView(t);
              setChemistsStockists([]);
            }} />
          </label>
        ))}
      </div>
      
      <SectionLabel text={`Provide ${chemistTypeView} Info`} />
      {chemistsStockists.length === 0 && <p style={emptyStyle}>No entries added yet.</p>}
      {chemistsStockists.map(item => (
        <div key={item.id} className="dc-grid-12">
          <div className="col-span-3"><SingleDropdown label={`Select ${item.type === "Chemist" ? "Chemist" : "Stockist"}`} options={item.type==="Chemist" ? masterData.chemists : masterData.stockists} value={item.targetId} onSelect={v => updateCS(item.id,"targetId",v)} required /></div>
          <div className="col-span-3"><MultiSelectDropdown label="Joint Work With" options={masterData.employees} selectedIds={item.jointWorkWith} onChange={v => updateCS(item.id,"jointWorkWith",v)} /></div>
          <div className="col-span-4"><FloatingInput label="Remarks" value={item.remarks} onChange={e => updateCS(item.id,"remarks",e.target.value)} /></div>
          <div className="col-span-2" style={{ marginTop: 4 }}>
            <button onClick={() => removeCS(item.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", height: FH, width: "100%", borderRadius:8, fontSize:12, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", cursor:"pointer", transition:"0.2s" }}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button onClick={addCS} className="dc-submit-btn" style={{ width: "fit-content", marginTop: 8 }}>
        <Plus size={14}/> Add More {chemistTypeView}
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionLabel text="Meeting Details" />
      {meetings.length === 0 && <p style={emptyStyle}>No meetings added yet.</p>}
      {meetings.map(item => (
        <div key={item.id} className="dc-grid-12">
          <div className="col-span-3"><SingleDropdown label="Meeting With" options={masterData.employees} value={item.meetingWith} onSelect={v => updateMeeting(item.id,"meetingWith",v)} required /></div>
          <div className="col-span-3"><FloatingInput label="Subject" value={item.subject} onChange={e => updateMeeting(item.id,"subject",e.target.value)} required /></div>
          <div className="col-span-4"><FloatingInput label="Remarks" value={item.remarks} onChange={e => updateMeeting(item.id,"remarks",e.target.value)} /></div>
          <div className="col-span-2" style={{ marginTop: 4 }}>
            <button onClick={() => removeMeeting(item.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", height: FH, width: "100%", borderRadius:8, fontSize:12, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", cursor:"pointer", transition:"0.2s" }}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button onClick={addMeeting} className="dc-submit-btn" style={{ width: "fit-content", marginTop: 8 }}>
        <Plus size={14}/> Add More Meeting
      </button>
    </div>
  );

  const renderStep5 = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionLabel text="Expense Declarations" />
      {expenses.length === 0 && <p style={emptyStyle}>No expenses added yet.</p>}
      {expenses.map(item => (
        <div key={item.id} className="dc-grid-12">
          <div className="col-span-3"><SingleDropdown label="Expense Type" options={EXACT_EXPENSE_TYPES} value={item.expenseType} onSelect={v => updateExpense(item.id,"expenseType",v)} required /></div>
          <div className="col-span-3"><FloatingInput label="Amount" type="number" value={item.amount} onChange={e => updateExpense(item.id,"amount",e.target.value)} required /></div>
          <div className="col-span-4"><FloatingInput label="Remarks" value={item.remarks} onChange={e => updateExpense(item.id,"remarks",e.target.value)} /></div>
          <div className="col-span-2" style={{ marginTop: 4 }}>
            <button onClick={() => removeExpense(item.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", height: FH, width: "100%", borderRadius:8, fontSize:12, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", cursor:"pointer", transition:"0.2s" }}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button onClick={addExpense} className="dc-submit-btn" style={{ width: "fit-content", marginTop: 8 }}>
        <Plus size={14}/> Add More Expense
      </button>
    </div>
  );

  const renderStep6 = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PreviewCard title="1. DCR Main Overview">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, padding:"20px 24px", fontSize:13.5 }}>
          <PreviewField label="Date" value={dcrMain.date || "-"} />
          <PreviewField label="Status" value={dcrMain.workingStatus || "-"} />
          <PreviewField label="Remarks" value={dcrMain.remarks || "-"} span={2} />
        </div>
      </PreviewCard>

      <div className="dc-grid-2" style={{ marginBottom: 0 }}>
        <PreviewCard title={`2. Doctors Visited (${doctors.length})`}>
          {doctors.length===0 ? <EmptyRow/> : doctors.map((d,i)=>(
            <div key={i} style={previewRow}>
              <span style={{ fontWeight:600, color:"#2563eb", fontSize:13.5 }}>
                {masterData.doctors.find(x=>String(x.id)===String(d.doctorId))?.label || d.doctorId}
              </span>
              <span style={{ color:"#94a3b8", fontSize:12.5, fontStyle:"italic", marginLeft: "auto" }}>{d.remarks || "No remark"}</span>
            </div>
          ))}
        </PreviewCard>
        <PreviewCard title={`3. Chemists/Stockists (${chemistsStockists.length})`}>
          {chemistsStockists.length===0 ? <EmptyRow/> : chemistsStockists.map((c,i)=>(
            <div key={i} style={previewRow}>
              <span style={{ fontSize:10, background:"rgba(59,130,246,0.06)", color:"#2563eb", border:"1px solid rgba(59,130,246,0.12)", padding:"2px 8px", borderRadius:100, fontWeight:700, textTransform:"uppercase", marginRight:8, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>{c.type}</span>
              <span style={{ fontWeight:600, color:"#1e293b", fontSize:13.5 }}>
                {masterData.allChemStock.find(x=>String(x.id)===String(c.targetId))?.label || c.targetId}
              </span>
            </div>
          ))}
        </PreviewCard>
      </div>

      <div className="dc-grid-2" style={{ marginBottom: 0 }}>
        <PreviewCard title={`4. Meetings (${meetings.length})`}>
          {meetings.length===0 ? <EmptyRow/> : meetings.map((m,i)=>(
            <div key={i} style={{...previewRow, justifyContent:"space-between"}}>
              <span style={{ fontWeight:600, color:"#1e293b", fontSize:13.5 }}>
                {masterData.employees.find(x=>String(x.id)===String(m.meetingWith))?.label || m.meetingWith}
              </span>
              <span style={{ color:"#94a3b8", fontSize:12.5, fontStyle:"italic" }}>{m.subject}</span>
            </div>
          ))}
        </PreviewCard>
        <PreviewCard title="5. Expenses" badge={`₹${expenses.reduce((s,e)=>s+Number(e.amount||0),0)}`}>
          {expenses.length===0 ? <EmptyRow/> : expenses.map((e,i)=>(
            <div key={i} style={{...previewRow, justifyContent:"space-between"}}>
              <span style={{ fontWeight:600, color:"#1e293b", fontSize:13.5 }}>
                {EXACT_EXPENSE_TYPES.find(x=>String(x.id)===String(e.expenseType))?.label || e.expenseType}
              </span>
              <span style={{ fontFamily:"monospace", fontWeight:700, color:"#1e293b", background:"#f8fafc", border:"1px solid #e2e8f0", padding:"2px 10px", borderRadius:6, fontSize:13 }}>₹{e.amount}</span>
            </div>
          ))}
        </PreviewCard>
      </div>
    </div>
  );

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>
      
      {errorMsg && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {errorMsg}
        </div>
      )}

      {/* ── Single Unified Card Container ── */}
      <div className="dc-card">
        {/* Header Panel */}
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <FileText size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Submit DCR</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Daily Call Report entry wizard</p>
            </div>
          </div>
        </div>

        {/* Multi-Step Stepper Component */}
        {renderStepper()}

        {/* Form Body Area */}
        <div className="dc-body" style={{ minHeight:350 }}>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderStep2()}
          {currentStep === 2 && renderStep3()}
          {currentStep === 3 && renderStep4()}
          {currentStep === 4 && renderStep5()}
          {currentStep === 5 && renderStep6()}
        </div>

        {/* Action Controls Footer */}
        <div className="dc-footer">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep===0 || isSubmitting}
            className="dc-secondary-btn"
          >
            <ArrowLeft size={14}/> Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button type="button" onClick={handleNext} className="dc-submit-btn">
              Next <ChevronRight size={14}/>
            </button>
          ) : (
            <button type="button" onClick={handleFinalSubmit} disabled={isSubmitting} className="dc-submit-btn">
              {isSubmitting ? <Loader2 size={14} style={{ animation:"dc-spin 1s linear infinite" }}/> : <Save size={14}/>}
              Final Submit
            </button>
          )}
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
   ATOM LABELS & AUXILIARY LAYOUT COMPONENTS (No bottom line decorators added)
═══════════════════════════════════════════════════════════════════════════ */
const emptyStyle = { fontSize:13, color:"#94a3b8", fontStyle:"italic", marginTop: 4, paddingLeft: 4 };
const previewRow = { padding:"12px 16px", display:"flex", alignItems:"center", borderBottom:"1px solid #f1f5f9", gap:6 };

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

function PreviewCard({ title, children, badge }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" }}>
      <div style={{ background: "#f8fafc", padding: "12px 18px", borderBottom: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{title}</h3>
        {badge && <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)", padding: "2px 8px", borderRadius: 6 }}>{badge}</span>}
      </div>
      <div style={{ maxHeight: 220, overflowY: "auto" }}>{children}</div>
    </div>
  );
}

function PreviewField({ label, value, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b" }}>{value}</p>
    </div>
  );
}

function EmptyRow() {
  return <p style={{ padding:"14px 18px", fontSize:13, color:"#94a3b8", fontStyle:"italic", margin: 0 }}>None</p>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM FLOATING LABELS FORM CONTROLS WITH BREAKOUT ESCAPE PORTALS
═══════════════════════════════════════════════════════════════════════════ */

function FloatingInput({ label, type="text", value, onChange, disabled, required }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow = focus && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position:"relative", width:"100%", height:FH }}>
        <input
          type={type} value={value||""} onChange={onChange} disabled={disabled} required={required}
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
    </div>
  );
}

function FloatingTextarea({ label, value, onChange, required }) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== "" && value !== null && value !== undefined;
  const active = hasValue || isFocused;

  const borderColor = isFocused ? "#3B82F6" : hasValue ? "#bfdbfe" : "#e2e8f0";
  const bgColor = isFocused ? "#eff6ff" : "#ffffff";
  const shadow = isFocused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = isFocused ? "#3B82F6" : hasValue ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position: "relative", width: "100%" }}>
        <textarea
          value={value ?? ""} onChange={onChange} rows={2}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          style={{
            width: "100%", minHeight: 70, borderRadius: 8, padding: "12px", fontSize: 14,
            border: `1.5px solid ${borderColor}`, outline: "none",
            boxShadow: shadow,
            fontWeight: 500, color: "#1e293b", background: bgColor,
            transition: "all 0.18s", resize: "vertical", fontFamily: "inherit"
          }}
        />
        <label style={{
          position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
          transition: "all 0.12s ease-out", fontWeight: 500,
          top: active ? "0" : "20px",
          transform: "translateY(-50%)",
          fontSize: active ? 11 : 13,
          color: labelColor,
          background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0",
        }}>
          {label}{required ? " *" : ""}
        </label>
      </div>
    </div>
  );
}

function SingleDropdown({ label, options = [], value, onSelect, disabled, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = (options || []).find((option) => String(option?.id ?? option?.value) === String(value));
  const active = isOpen || Boolean(value);

  const borderColor = isOpen ? "#3B82F6" : value ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff";
  const shadow = isOpen && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = isOpen ? "#3B82F6" : value ? "#64748b" : "#94a3b8";

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

      {isOpen && !disabled && (
        <Portal top={pos.top} left={pos.left} width={pos.width} onClose={() => setIsOpen(false)}>
          <div className="dc-dropdown" style={{ position: "static", boxShadow: "none", border: "none" }}>
            <ul>
              {(!options || options.length === 0) ? (
                <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>
              ) : (
                options.map((opt, i) => {
                  const optValue = opt?.id ?? opt?.value;
                  const isSelected = String(value) === String(optValue);
                  return (
                    <li key={i}
                      className={`dc-opt${isSelected ? " selected" : ""}`}
                      onMouseDown={(e) => { e.preventDefault(); onSelect(optValue); setIsOpen(false); }}
                    >
                      {isSelected && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
                      {opt?.label}
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

function MultiSelectDropdown({ label, options = [], selectedIds = [], onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const toggleValue = (val) => {
    if (selectedIds.includes(String(val))) {
      onChange(selectedIds.filter((item) => String(item) !== String(val)));
    } else {
      onChange([...selectedIds, String(val)]);
    }
  };

  const selectedLabel = (options || [])
    .filter((option) => selectedIds.includes(String(option?.id || option?.value)))
    .map((option) => option?.label)
    .join(", ");

  const hasValue = selectedIds.length > 0;
  const active = isOpen || hasValue;

  const borderColor = isOpen ? "#3B82F6" : hasValue ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff";
  const shadow = isOpen && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = isOpen ? "#3B82F6" : hasValue ? "#64748b" : "#94a3b8";

  const openMenu = () => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  };

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
        <span style={{ flex: 1, fontWeight: 500, color: hasValue ? "#1e293b" : "transparent", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedLabel || " "}
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
        {label}
      </label>

      {isOpen && !disabled && (
        <Portal top={pos.top} left={pos.left} width={pos.width} onClose={() => setIsOpen(false)}>
          <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); onChange((options || []).map(o => String(o?.id || o?.value))); }} style={{ flex: 1, padding: "8px 0", fontSize: 11, fontWeight: 700, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Select All</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); onChange([]); }} style={{ flex: 1, padding: "8px 0", fontSize: 11, fontWeight: 700, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Clear All</button>
          </div>
          <div className="dc-dropdown" style={{ position: "static", boxShadow: "none", border: "none" }}>
            <ul>
              {(!options || options.length === 0) ? (
                <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>
              ) : (
                options.map((option, i) => {
                  const optId = String(option?.id || option?.value);
                  const isSelected = selectedIds.includes(optId);
                  return (
                    <li key={i} className={`dc-opt${isSelected ? " selected" : ""}`} onMouseDown={(e) => { e.preventDefault(); toggleValue(optId); }}>
                      <span style={{
                        width: 15, height: 15, borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        border: isSelected ? "none" : "1.5px solid #cbd5e1", background: isSelected ? "#3B82F6" : "#fff"
                      }}>
                        {isSelected && <Check size={10} style={{ color: "#fff", strokeWidth: 3 }} />}
                      </span>
                      {option?.label}
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

function FloatingDatePicker({ label, value, onChange, disabled, required }) {
  const [open,  setOpen]  = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const today  = new Date();
  const parsed = (value && !isNaN(Date.parse(value))) ? new Date(value + "T00:00:00") : today;
  const [view, setView]   = useState({ y: parsed.getFullYear(), m: parsed.getMonth() });
  const ref = useRef(null);

  const hasVal = Boolean(value);
  const active = open || hasVal;

  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  const openMenu = () => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: 290 });
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
  const displayVal = hasVal ? new Date(value + "T00:00:00").toLocaleDateString("en-GB") : "";

  const selStr = (d) => `${view.y}-${String(view.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

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
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? "#1e293b" : "transparent", fontSize: 14, fontFamily: "monospace", letterSpacing: "0.02em" }}>
          {displayVal || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", display: "flex", alignItems: "center" }}>
          <CalendarIcon size={15} />
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

      {open && !disabled && (
        <Portal top={pos.top} left={pos.left} width={pos.width} onClose={() => setOpen(false)}>
          <div className="dc-cal">
            <div className="dc-cal-header">
              <button type="button" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); prevMonth(); }} className="dc-cal-nav-btn">
                <ChevronLeft size={14} />
              </button>
              <div className="dc-cal-select-group">
                <div className="dc-cal-select-wrap">
                  <select value={view.m} onChange={e => setView({ ...view, m: Number(e.target.value) })} className="dc-cal-native-select">
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i} style={{ color: "#1e293b", background: "#fff" }}>{m.slice(0, 3)}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#2563eb", pointerEvents: "none" }} />
                </div>
                <div className="dc-cal-select-wrap">
                  <select value={view.y} onChange={e => setView({ ...view, y: Number(e.target.value) })} className="dc-cal-native-select">
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map(y => (
                      <option key={y} value={y} style={{ color: "#1e293b", background: "#fff" }}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#2563eb", pointerEvents: "none" }} />
                </div>
              </div>
              <button type="button" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); nextMonth(); }} className="dc-cal-nav-btn">
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="dc-cal-weekday-grid">
              {DAYS.map(d => <div key={d} className="dc-cal-weekday">{d}</div>)}
            </div>

            <div className="dc-cal-days-grid">
              {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const ds = selStr(d);
                const isSel = value === ds;
                const isToday = ds === todayStr;
                return (
                  <button key={d} type="button"
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); selectDay(d); }}
                    className={`dc-cal-day-cell ${isSel ? "selected" : ""} ${isToday ? "today" : ""}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
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
      style={{ position: "fixed", top, left, width, zIndex: 99999, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      className="dropdown-portal"
    >
      {children}
    </div>
  );
}