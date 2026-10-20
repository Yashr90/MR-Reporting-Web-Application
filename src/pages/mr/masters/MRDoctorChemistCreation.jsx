import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check, Calendar as CalendarIcon, ChevronDown, ChevronRight, ChevronLeft,
  Plus, X, Save, FileText, CheckCircle2, Clock, Users, Trash2, Loader2, AlertCircle
} from "lucide-react";
import api from "../../../services/api";

const STEPS = [
  "DCR Main", "Doctor", "Chemist / Stockist", "Meetings", "Misc Expenses", "Preview"
];

// ─── EXACT HARDCODED DROPDOWN VALUES ─────────────────────────────────────────
const CATEGORY_OPTIONS = [
  { id: "A", label: "A" }, { id: "A+", label: "A+" }, { id: "B", label: "B" },
  { id: "B+", label: "B+" }, { id: "C", label: "C" }, { id: "Core", label: "Core" },
  { id: "SuperCore", label: "SuperCore" }
];

const DEGREE_OPTIONS = [
  { id: "DM", label: "DM" }, { id: "MBBS", label: "MBBS" },
  { id: "MD", label: "MD" }, { id: "MS", label: "MS" }
];

const SPECIALIZATION_OPTIONS = [
  { id: "Cardiologist", label: "Cardiologist" }, { id: "Critical Care", label: "Critical Care" },
  { id: "Dental", label: "Dental" }, { id: "Dermatologist(Plastic Surgery)", label: "Dermatologist(Plastic Surgery)" },
  { id: "Diabetologist", label: "Diabetologist" }, { id: "Endocrinologist", label: "Endocrinologist" },
  { id: "Gastroenterologist", label: "Gastroenterologist" }, { id: "Gastrologist", label: "Gastrologist" },
  { id: "Gen Surgery", label: "Gen Surgery" }, { id: "Gynaecologist", label: "Gynaecologist" },
  { id: "Hepatologist", label: "Hepatologist" }, { id: "Medical Oncology", label: "Medical Oncology" },
  { id: "Nephrologist", label: "Nephrologist" }, { id: "Neurologist", label: "Neurologist" },
  { id: "OBG&GYN", label: "OBG&GYN" }, { id: "Oncologist", label: "Oncologist" },
  { id: "Ortho", label: "Ortho" }, { id: "Physician", label: "Physician" },
  { id: "Pulmonologist", label: "Pulmonologist" }, { id: "Radiotherapy", label: "Radiotherapy" },
  { id: "Urologist", label: "Urologist" }
];

const CHEMIST_TYPES = [
  { id: "Chemist", label: "Chemist" }, { id: "Stockist", label: "Stockist" }
];

const WEEKDAY_OPTIONS = [
  { id: "Monday", label: "Monday" }, { id: "Tuesday", label: "Tuesday" },
  { id: "Wednesday", label: "Wednesday" }, { id: "Thursday", label: "Thursday" },
  { id: "Friday", label: "Friday" }, { id: "Saturday", label: "Saturday" }, { id: "Sunday", label: "Sunday" }
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
    .dc-footer { padding: 16px; }
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

export default function MRDoctorChemistCreation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [providerType, setProviderType] = useState("Doctor");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const [masterData, setMasterData] = useState({ areas: [], focusProducts: [] });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [areaRes, prodRes] = await Promise.all([
          api.get('/api/mr/provider-creation/areas').catch(() => ({ data: { data: [] } })),
          api.get('/api/mr/provider-creation/products').catch(() => ({ data: { data: [] } }))
        ]);

        const mapData = (res) => (res?.data?.data || res?.data || []).map(item => ({
          id: String(item.id || item.value || item._id), 
          label: item.label || item.name || "Unknown"
        }));

        setMasterData({
          areas: mapData(areaRes),
          focusProducts: mapData(prodRes)
        });
      } catch (error) { console.error("Error fetching master data:", error); }
    };
    fetchMasterData();
  }, []);

  const [doctor, setDoctor] = useState({
    area: "", code: "", name: "", mslNo: "", frequencyVisit: "", phone: "",
    category: "", degree: "", specialization: "", address: "", aadhaar: "",
    hasFamilyInfo: false,
    familyInfo: { children: [] },
    hasOtherInfo: false,
    otherInfo: { email: "", licenceNo: "", meetings: [] }
  });

  const [chemist, setChemist] = useState({
    area: "", type: "Chemist", code: "", name: "", phone: "", aadhaar: "",
    hasOtherInfo: false,
    otherInfo: { ownerName: "", ownerDob: "", ownerDoa: "", shopDoa: "", address: "", city: "", email: "", panCard: "", gstNumber: "", licenceNo: "", category: "" }
  });

  const validateField = (name, val) => {
    let errMsg = "";
    if (val.length > 0) {
      if (name === "phone" && val.length < 10) errMsg = "Mobile must be exactly 10 digits.";
      if (name === "aadhaar" && val.length < 12) errMsg = "Aadhaar must be exactly 12 digits.";
      if (name === "panCard" && val.length < 10) errMsg = "PAN must be exactly 10 characters.";
    }
    setFieldErrors(prev => ({ ...prev, [name]: errMsg }));
  };

  const handleDoctorChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") value = value.replace(/\D/g, '').slice(0, 10);
    if (name === "aadhaar") value = value.replace(/\D/g, '').slice(0, 12);
    
    setDoctor(prev => {
      const updated = { ...prev, [name]: value };
      validateField(name, value);
      return updated;
    });
  };

  const handleChemistChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") value = value.replace(/\D/g, '').slice(0, 10);
    if (name === "aadhaar") value = value.replace(/\D/g, '').slice(0, 12);
    if (name === "panCard") value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    
    setChemist(prev => {
      let updated;
      if (["ownerName", "ownerDob", "ownerDoa", "shopDoa", "address", "city", "email", "panCard", "gstNumber", "licenceNo", "category"].includes(name)) {
        updated = { ...prev, otherInfo: { ...prev.otherInfo, [name]: value } };
      } else {
        updated = { ...prev, [name]: value };
      }
      validateField(name, value);
      return updated;
    });
  };

  const addChild = () => {
    setDoctor(prev => ({ ...prev, familyInfo: { children: [...prev.familyInfo.children, { id: Date.now(), name: "", age: "" }] } }));
  };
  const removeChild = (id) => {
    setDoctor(prev => ({ ...prev, familyInfo: { children: prev.familyInfo.children.filter(c => c.id !== id) } }));
  };
  const updateChild = (id, field, value) => {
    setDoctor(prev => ({ ...prev, familyInfo: { children: prev.familyInfo.children.map(c => c.id === id ? { ...c, [field]: value } : c) } }));
  };

  const addMeeting = () => {
    setDoctor(prev => ({
      ...prev, otherInfo: { ...prev.otherInfo, meetings: [...prev.otherInfo.meetings, { id: Date.now(), city: "", sessionType: "", timeSlots: [] }] }
    }));
  };
  const removeMeeting = (id) => {
    setDoctor(prev => ({ ...prev, otherInfo: { ...prev.otherInfo, meetings: prev.otherInfo.meetings.filter(m => m.id !== id) } }));
  };
  const updateMeeting = (id, field, value) => {
    setDoctor(prev => ({ ...prev, otherInfo: { ...prev.otherInfo, meetings: prev.otherInfo.meetings.map(m => m.id === id ? { ...m, [field]: value } : m) } }));
  };

  const addTimeSlot = (meetingId) => {
    setDoctor(prev => ({
      ...prev, otherInfo: { ...prev.otherInfo, meetings: prev.otherInfo.meetings.map(m => m.id === meetingId ? { ...m, timeSlots: [...m.timeSlots, { id: Date.now(), fromTime: "", toTime: "" }] } : m) }
    }));
  };
  const removeTimeSlot = (meetingId, slotId) => {
    setDoctor(prev => ({
      ...prev, otherInfo: { ...prev.otherInfo, meetings: prev.otherInfo.meetings.map(m => m.id === meetingId ? { ...m, timeSlots: m.timeSlots.filter(s => s.id !== slotId) } : m) }
    }));
  };
  const updateTimeSlot = (meetingId, slotId, field, value) => {
    setDoctor(prev => ({
      ...prev, otherInfo: { ...prev.otherInfo, meetings: prev.otherInfo.meetings.map(m => m.id === meetingId ? { ...m, timeSlots: m.timeSlots.map(s => s.id === slotId ? { ...s, [field]: value } : s) } : m) }
    }));
  };

  const handleSave = async () => {
    setErrorMsg("");
    
    if (providerType === "Doctor") {
      if (doctor.phone && doctor.phone.length < 10) return setErrorMsg("Mobile number must be exactly 10 digits.");
      if (doctor.aadhaar && doctor.aadhaar.length < 12) return setErrorMsg("Aadhaar must be exactly 12 digits.");
      if (!doctor.area || !doctor.name || !doctor.mslNo || !doctor.category || !doctor.degree || !doctor.specialization) {
        setErrorMsg("Please fill all required fields (*)");
        return;
      }
    } else {
      if (chemist.phone && chemist.phone.length < 10) return setErrorMsg("Mobile number must be exactly 10 digits.");
      if (chemist.aadhaar && chemist.aadhaar.length < 12) return setErrorMsg("Aadhaar must be exactly 12 digits.");
      if (chemist.otherInfo.panCard && chemist.otherInfo.panCard.length < 10) return setErrorMsg("PAN must be exactly 10 characters.");
    }

    setIsSubmitting(true);
    try {
      if (providerType === "Doctor") {
        const payload = {
          areaId: Number(doctor.area),
          doctorCode: doctor.code,
          doctorName: doctor.name,
          mslNo: doctor.mslNo,
          frequencyVisit: doctor.frequencyVisit,
          phone: doctor.phone,
          category: doctor.category,
          degree: doctor.degree,
          specialization: doctor.specialization,
          address: doctor.address,
          aadhaar: doctor.aadhaar,
          familyInfo: doctor.hasFamilyInfo ? doctor.familyInfo : null,
          otherInfo: doctor.hasOtherInfo ? doctor.otherInfo : null
        };
        await api.post('/api/mr/provider-creation/doctors', payload);
      } else {
        const payload = {
          areaId: Number(chemist.area),
          type: chemist.type?.toUpperCase(),
          providerCode: chemist.code,
          providerName: chemist.name,
          phone: chemist.phone,
          aadhaarNo: chemist.aadhaar,
          otherInfo: chemist.hasOtherInfo ? chemist.otherInfo : null
        };
        await api.post('/api/mr/provider-creation/providers', payload);
      }
      
      setPopup({ isOpen: true, message: `${providerType} Created Successfully!` });
      setFieldErrors({});

      if (providerType === "Doctor") {
        setDoctor({ area: "", code: "", name: "", mslNo: "", frequencyVisit: "", phone: "", category: "", degree: "", specialization: "", address: "", aadhaar: "", hasFamilyInfo: false, familyInfo: { children: [] }, hasOtherInfo: false, otherInfo: { email: "", licenceNo: "", meetings: [] } });
      } else {
        setChemist({ area: "", type: "Chemist", code: "", name: "", phone: "", aadhaar: "", hasOtherInfo: false, otherInfo: { ownerName: "", ownerDob: "", ownerDoa: "", shopDoa: "", address: "", city: "", email: "", panCard: "", gstNumber: "", licenceNo: "", category: "" } });
      }

    } catch (error) {
      const backendError = error.response?.data?.message || error.response?.data?.error || `Failed to create ${providerType}.`;
      setErrorMsg(backendError);
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderDoctorForm = () => (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="dc-grid">
        <SingleDropdown label="Select Area" options={masterData.areas} value={doctor.area} onSelect={v => setDoctor({...doctor, area: v})} required />
        <FloatingInput label="Doctor Code" name="code" value={doctor.code} onChange={handleDoctorChange} />
        <FloatingInput label="Doctor Name" name="name" value={doctor.name} onChange={handleDoctorChange} required />
        <FloatingInput label="Doctor MSL No." name="mslNo" value={doctor.mslNo} onChange={handleDoctorChange} required />
      </div>
      <div className="dc-grid">
        <FloatingInput label="Frequency Visit" name="frequencyVisit" value={doctor.frequencyVisit} onChange={handleDoctorChange} />
        <FloatingInput label="Phone" name="phone" value={doctor.phone} onChange={handleDoctorChange} error={fieldErrors.phone} />
        <SingleDropdown label="Category" options={CATEGORY_OPTIONS} value={doctor.category} onSelect={v => setDoctor({...doctor, category: v})} required />
        <SingleDropdown label="Degree" options={DEGREE_OPTIONS} value={doctor.degree} onSelect={v => setDoctor({...doctor, degree: v})} required />
      </div>
      <div className="dc-grid">
        <SingleDropdown label="Specialization" options={SPECIALIZATION_OPTIONS} value={doctor.specialization} onSelect={v => setDoctor({...doctor, specialization: v})} required />
        <div className="col-span-2"><FloatingInput label="Address" name="address" value={doctor.address} onChange={handleDoctorChange} /></div>
        <FloatingInput label="Aadhaar" name="aadhaar" value={doctor.aadhaar} onChange={handleDoctorChange} error={fieldErrors.aadhaar} />
      </div>

      <div style={{ paddingTop: 8, marginTop: 12 }}>
        <SectionLabel text="Additional Info" />
        
        {/* Family Info */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", width: "max-content", marginBottom: 16 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4, border: doctor.hasFamilyInfo ? "none" : "2px solid #cbd5e1",
              background: doctor.hasFamilyInfo ? "#2563eb" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "all 0.15s",
              boxShadow: doctor.hasFamilyInfo ? "0 0 0 3px rgba(37,99,235,0.12)" : "none"
            }}>
              {doctor.hasFamilyInfo && <Check size={12} style={{ color: "#fff", strokeWidth: 3 }} />}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: doctor.hasFamilyInfo ? "#1e293b" : "#64748b" }}>Family Info</span>
            <input type="checkbox" style={{ display: "none" }} checked={doctor.hasFamilyInfo} onChange={e => setDoctor({...doctor, hasFamilyInfo: e.target.checked})} />
          </label>

          {doctor.hasFamilyInfo && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              {doctor.familyInfo.children.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic", marginBottom: 12, paddingLeft: 4 }}>No children added.</p>}
              {doctor.familyInfo.children.map((child) => (
                <div key={child.id} className="dc-grid-12" style={{ alignItems: "center" }}>
                  <div className="col-span-5"><FloatingInput label="Child Name" name={`childName-${child.id}`} value={child.name} onChange={e => updateChild(child.id, 'name', e.target.value)} /></div>
                  <div className="col-span-5"><FloatingInput label="Age" name={`childAge-${child.id}`} value={child.age} onChange={e => updateChild(child.id, 'age', e.target.value)} /></div>
                  <div className="col-span-2" style={{ marginTop: 4 }}>
                    <button onClick={() => removeChild(child.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", height: FH, width: "100%", borderRadius:8, fontSize:12, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", cursor:"pointer", transition:"0.2s" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addChild} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(59,130,246,0.06)", color: "#2563eb", border: "1px dashed rgba(59,130,246,0.22)", cursor: "pointer", transition: "0.2s", width: "fit-content" }}>
                <Plus size={14} /> Add Child
              </button>
            </div>
          )}
        </div>

        {/* Other Info */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", width: "max-content", marginBottom: 16 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4, border: doctor.hasOtherInfo ? "none" : "2px solid #cbd5e1",
              background: doctor.hasOtherInfo ? "#2563eb" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "all 0.15s",
              boxShadow: doctor.hasOtherInfo ? "0 0 0 3px rgba(37,99,235,0.12)" : "none"
            }}>
              {doctor.hasOtherInfo && <Check size={12} style={{ color: "#fff", strokeWidth: 3 }} />}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: doctor.hasOtherInfo ? "#1e293b" : "#64748b" }}>Other Info</span>
            <input type="checkbox" style={{ display: "none" }} checked={doctor.hasOtherInfo} onChange={e => setDoctor({...doctor, hasOtherInfo: e.target.checked})} />
          </label>

          {doctor.hasOtherInfo && (
            <div className="animate-in slide-in-from-top-2 duration-200" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="dc-grid">
                <FloatingInput label="Email" name="email" value={doctor.otherInfo.email} onChange={handleDoctorChange} />
                <FloatingInput label="Licence No." name="licenceNo" value={doctor.otherInfo.licenceNo} onChange={handleDoctorChange} />
              </div>
              
              <div style={{ paddingTop: 4 }}>
                <SectionLabel text="Meeting Time Templates" />
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
                  {doctor.otherInfo.meetings.map((meet) => (
                    <div key={meet.id} style={{ background: "#ffffff", border: "1px solid #edf2f7", borderRadius: 12, padding: "20px 24px", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" }}>
                      
                      <div className="dc-grid-12" style={{ marginBottom: 12 }}>
                        <div className="col-span-5"><FloatingInput label="City" name={`meetCity-${meet.id}`} value={meet.city} onChange={e => updateMeeting(meet.id, 'city', e.target.value)} /></div>
                        <div className="col-span-5"><SingleDropdown label="Session Type (Weekday)" options={WEEKDAY_OPTIONS} value={meet.sessionType} onSelect={v => updateMeeting(meet.id, 'sessionType', v)} /></div>
                        <div className="col-span-2" style={{ marginTop: 4 }}>
                          <button onClick={() => removeMeeting(meet.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", height: FH, width: "100%", borderRadius:8, fontSize:12, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", cursor:"pointer", transition:"0.2s" }}>
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Time Slots inside Meeting */}
                      <div style={{ paddingLeft: 16, borderLeft: "2px solid #edf2f7", marginLeft: 8 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Time Slots:</p>
                        {meet.timeSlots.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic", marginBottom: 12 }}>No slots added.</p>}
                        
                        {meet.timeSlots.map(slot => (
                          <div key={slot.id} className="dc-grid-12" style={{ marginBottom: 8, alignItems: "center" }}>
                            <div className="col-span-5"><FloatingTimePicker label="From Time" value={slot.fromTime} onChange={v => updateTimeSlot(meet.id, slot.id, 'fromTime', v)} /></div>
                            <div className="col-span-5"><FloatingTimePicker label="To Time" value={slot.toTime} onChange={v => updateTimeSlot(meet.id, slot.id, 'toTime', v)} /></div>
                            <div className="col-span-2" style={{ marginTop: 4 }}>
                              <button onClick={() => removeTimeSlot(meet.id, slot.id)} style={{ width: 34, height: 34, borderRadius: "50%", background: "#fef2f2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <button onClick={() => addTimeSlot(meet.id)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "rgba(59,130,246,0.06)", color: "#2563eb", border: "none", cursor: "pointer", transition: "0.2s", width: "fit-content", marginTop: 8 }}>
                          <Plus size={13} /> Add Slot
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={addMeeting} className="dc-submit-btn" style={{ width: "fit-content" }}>
                    <Plus size={14} /> Add Meeting
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderChemistForm = () => (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="dc-grid">
        <SingleDropdown label="Select Area" options={masterData.areas} value={chemist.area} onSelect={v => setChemist({...chemist, area: v})} required />
        <SingleDropdown label="Type" options={CHEMIST_TYPES} value={chemist.type} onSelect={v => setChemist({...chemist, type: v})} required />
        <FloatingInput label="Chemist / Stockist Code" name="code" value={chemist.code} onChange={handleChemistChange} />
        <FloatingInput label="Chemist / Stockist Name" name="name" value={chemist.name} onChange={handleChemistChange} required />
      </div>
      <div className="dc-grid">
        <FloatingInput label="Phone" name="phone" value={chemist.phone} onChange={handleChemistChange} error={fieldErrors.phone} />
        <FloatingInput label="Aadhaar" name="aadhaar" value={chemist.aadhaar} onChange={handleChemistChange} error={fieldErrors.aadhaar} />
      </div>

      <div style={{ paddingTop: 8, marginTop: 12 }}>
        <SectionLabel text="Additional Info" />
        
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", width: "max-content", marginBottom: 16 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4, border: chemist.hasOtherInfo ? "none" : "2px solid #cbd5e1",
              background: chemist.hasOtherInfo ? "#2563eb" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "all 0.15s",
              boxShadow: chemist.hasOtherInfo ? "0 0 0 3px rgba(37,99,235,0.12)" : "none"
            }}>
              {chemist.hasOtherInfo && <Check size={12} style={{ color: "#fff", strokeWidth: 3 }} />}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: chemist.hasOtherInfo ? "#1e293b" : "#64748b" }}>Other Info</span>
            <input type="checkbox" style={{ display: "none" }} checked={chemist.hasOtherInfo} onChange={e => setChemist({...chemist, hasOtherInfo: e.target.checked})} />
          </label>

          {chemist.hasOtherInfo && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <div className="dc-grid">
                <FloatingInput label="Owner Name" name="ownerName" value={chemist.otherInfo.ownerName} onChange={handleChemistChange} />
                <FloatingDatePicker label="Owner DOB" value={chemist.otherInfo.ownerDob} onChange={v => setChemist({...chemist, otherInfo: {...chemist.otherInfo, ownerDob: v}})} />
                <FloatingDatePicker label="Owner DOA" value={chemist.otherInfo.ownerDoa} onChange={v => setChemist({...chemist, otherInfo: {...chemist.otherInfo, ownerDoa: v}})} />
                <FloatingDatePicker label="Shop DOA" value={chemist.otherInfo.shopDoa} onChange={v => setChemist({...chemist, otherInfo: {...chemist.otherInfo, shopDoa: v}})} />
              </div>
              <div className="dc-grid">
                <div className="col-span-2"><FloatingInput label="Address" name="address" value={chemist.otherInfo.address} onChange={handleChemistChange} /></div>
                <FloatingInput label="City" name="city" value={chemist.otherInfo.city} onChange={handleChemistChange} />
                <FloatingInput label="Email" name="email" value={chemist.otherInfo.email} onChange={handleChemistChange} />
              </div>
              <div className="dc-grid">
                <FloatingInput label="PAN Card" name="panCard" value={chemist.otherInfo.panCard} onChange={handleChemistChange} error={fieldErrors.panCard} />
                <FloatingInput label="GST Number" name="gstNumber" value={chemist.otherInfo.gstNumber} onChange={handleChemistChange} />
                <FloatingInput label="Licence No." name="licenceNo" value={chemist.otherInfo.licenceNo} onChange={handleChemistChange} />
                <SingleDropdown label="Category" options={CATEGORY_OPTIONS} value={chemist.otherInfo.category} onSelect={v => setChemist({...chemist, otherInfo: {...chemist.otherInfo, category: v}})} />
              </div>
            </div>
          )}
        </div>
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
        {/* Header */}
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <FileText size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Provider Creation Form</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Register a new Doctor, Chemist or Stockist</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24, paddingRight: 4 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: providerType === "Doctor" ? "2px solid #3B82F6" : "2px solid #cbd5e1",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: providerType === "Doctor" ? "rgba(59,130,246,0.1)" : "#fff",
                transition: "all 0.15s",
                boxShadow: providerType === "Doctor" ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
              }}>
                {providerType === "Doctor" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: providerType === "Doctor" ? "#1e293b" : "#64748b" }}>Doctor</span>
              <input type="radio" style={{ display: "none" }} checked={providerType === 'Doctor'} onChange={() => { setProviderType('Doctor'); setErrorMsg(''); }} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: providerType === "Chemist" ? "2px solid #3B82F6" : "2px solid #cbd5e1",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: providerType === "Chemist" ? "rgba(59,130,246,0.1)" : "#fff",
                transition: "all 0.15s",
                boxShadow: providerType === "Chemist" ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
              }}>
                {providerType === "Chemist" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: providerType === "Chemist" ? "#1e293b" : "#64748b" }}>Chemist / Stockist</span>
              <input type="radio" style={{ display: "none" }} checked={providerType === 'Chemist'} onChange={() => { setProviderType('Chemist'); setErrorMsg(''); }} />
            </label>
          </div>
        </div>

        {/* Body */}
        <div className="dc-body">
          {providerType === 'Doctor' ? renderDoctorForm() : renderChemistForm()}
        </div>

        {/* Footer */}
        <div className="dc-footer">
          <button 
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="dc-submit-btn"
          >
            {isSubmitting ? <Loader2 size={16} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={16} />}
            Save Details
          </button>
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

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM FLOATING LABELS FORM CONTROLS WITH BREAKOUT ESCAPE PORTALS
═══════════════════════════════════════════════════════════════════════════ */

function FloatingInput({ label, name, type="text", value, onChange, disabled, required, error }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = error ? "#ef4444" : focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow = focus && !disabled ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)") : "none";
  const labelColor = error ? "#ef4444" : focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position:"relative", width:"100%", height:FH }}>
        <input
          type={type} name={name} value={value||""} onChange={onChange} disabled={disabled} required={required}
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

function FloatingTimePicker({ label, value, onChange, disabled, required }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = true;

  const borderColor = focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow = focus && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position: "relative", width: "100%", height: FH }}>
        <input 
          type="time" value={value || ""} onChange={e => onChange(e.target.value)} disabled={disabled} required={required}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
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
          top: "0",
          transform: "translateY(-50%)",
          fontSize: 11,
          color: disabled ? "#cbd5e1" : labelColor,
          background: "#ffffff",
          padding: "0 5px",
          letterSpacing: "0.02em",
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
                      <option key={i} value={i} style={{ color: "#1e293b", background: "#fff" }}>{m}</option>
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