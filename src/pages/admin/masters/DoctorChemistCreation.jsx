import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, Save, Edit2, Trash2, BookUser, Baby, CalendarDays, Clock,
  Check, AlertCircle, PlusCircle, XCircle, Stethoscope, Beaker, ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";
import api from "../../../services/api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

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
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
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
  .dc-body { padding: 20px 28px 24px; background: #ffffff; }

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
  .dc-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }
  .dc-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }

  @media(max-width: 1200px) {
    .dc-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media(max-width: 900px) {
    .dc-grid, .dc-grid-3 { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .dc-grid-2 { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  }
  @media(max-width: 640px) {
    .dc-grid, .dc-grid-3, .dc-grid-2 { grid-template-columns: 1fr; gap: 20px; }
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

  /* ── Premium Calendar Panel ── */
  .dc-cal {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 290px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.02);
    z-index: 9999;
    overflow: hidden;
    padding: 16px;
    animation: dc-cal-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes dc-cal-pop {
    from { opacity: 0; transform: translateY(4px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media(max-width: 640px) {
    .dc-cal { width: 280px; left: 50%; transform: translateX(-50%); }
  }

  .dc-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
  }

  .dc-cal-nav-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #475569;
    transition: all 0.15s ease;
  }

  .dc-cal-nav-btn:hover {
    background: #f1f5f9;
    color: #1e293b;
    border-color: #cbd5e1;
  }

  .dc-cal-select-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dc-cal-select-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .dc-cal-native-select {
    appearance: none;
    -webkit-appearance: none;
    background: #f8fafc;
    color: #2563eb;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 4px 22px 4px 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s ease;
  }

  .dc-cal-native-select:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }

  .dc-cal-weekday-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 6px;
  }

  .dc-cal-weekday {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    padding: 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .dc-cal-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 4px;
    column-gap: 4px;
    text-align: center;
  }

  .dc-cal-day-cell {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    color: #334155;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    transition: all 0.12s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .dc-cal-day-cell:hover:not(.selected) {
    background: #f1f5f9;
    color: #0f172a;
  }

  .dc-cal-day-cell.today:not(.selected) {
    color: #3B82F6;
    font-weight: 700;
    background: rgba(59, 130, 246, 0.08);
  }

  .dc-cal-day-cell.selected {
    background: #3B82F6 !important;
    color: #ffffff !important;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
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

  /* ── Submission Button ── */
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
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    color: #fff;
    box-shadow: 0 4px 14px rgba(59,130,246,0.2);
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.01em;
    height: 40px;
  }
  .dc-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.3);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }
  .dc-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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

  .dc-additional-box { border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 4px; }
  .dc-conditional-box { border-left: 3px solid #3B82F6; padding-left: 16px; margin-top: 20px; }

  .dc-dynamic-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #f8fafc;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    position: relative;
    margin-bottom: 14px;
  }
  .dc-dynamic-row:hover .dc-remove-btn { opacity: 1; transform: scale(1); }
  
  .dc-remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    color: #ef4444;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .dc-remove-btn:hover { background: #fee2e2; color: #dc2626; }

  .dc-slot-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #ffffff;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-bottom: 8px;
  }
  .dc-slot-row:hover { border-color: #bfdbfe; }

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

export default function DoctorChemistCreation() {
  const [isLoading,    setIsLoading]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");
  const [popup,        setPopup]        = useState({ isOpen: false, message: "" });

  const [providerType, setProviderType] = useState("Doctor");
  const [showFamilyInfo, setShowFamilyInfo] = useState(false);
  const [showOtherInfo,  setShowOtherInfo]  = useState(false);

  const [states,    setStates]    = useState([]);
  const [districts, setDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [areas,     setAreas]     = useState([]);

  const emptyFormData = {
    stateId:"", districtId:"", employeeId:"", areaId:"",
    phone:"", aadhaar:"", address:"", email:"", gender:"", city:"",
    doctorCode:"", doctorName:"", mslNo:"", frequencyVisit:"",
    doctorCategory:"", doctorDegree:"", doctorSpecialization:"",
    licenceNo:"",
    childrenInfo:[], meetingTimeInfo:[],
    chemistCode:"", chemistName:"", chemistType:"",
    ownerName:"", ownerDob:"", ownerDoa:"", shopDoa:"",
    panCard:"", gstNumber:"", licenceNoChemist:"", chemistCategory:""
  };

  const [formData,     setFormData]     = useState(emptyFormData);
  const [fieldErrors,  setFieldErrors]  = useState({});

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    if (formData.stateId) fetchDistrictsByState(formData.stateId);
    else { setDistricts([]); setEmployees([]); setAreas([]); }
  }, [formData.stateId]);

  useEffect(() => {
    if (formData.stateId && formData.districtId) fetchFilteredEmployees(formData.stateId, formData.districtId);
    else { setEmployees([]); setAreas([]); }
  }, [formData.stateId, formData.districtId]);

  useEffect(() => {
    if (formData.employeeId) fetchAreasByEmployee(formData.employeeId);
    else setAreas([]);
  }, [formData.employeeId]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/masters/states');
      if (response.data?.success) setStates(response.data.data || []);
    } catch (err) { console.error("Failed to fetch initial data", err); }
    finally { setIsLoading(false); }
  };

  const fetchDistrictsByState = async (stateId) => {
    try {
      const response = await api.get(`/api/masters/districts?stateId=${stateId}`);
      if (response.data?.success) setDistricts(response.data.data || []);
    } catch (err) { setDistricts([]); }
  };

  const fetchFilteredEmployees = async (stateId, districtId) => {
    try {
      const response = await api.get(`/api/masters/employees/filter?stateId=${stateId}&districtId=${districtId}`);
      if (response.data?.success) setEmployees(response.data.data || []);
    } catch (err) { setEmployees([]); }
  };

  const fetchAreasByEmployee = async (employeeId) => {
    try {
      const response = await api.get(`/api/masters/areas/filter?employeeId=${employeeId}`);
      if (response.data?.success) setAreas(response.data.data || []);
    } catch (err) { setAreas([]); }
  };

  const handleTypeChange = (type) => {
    setProviderType(type);
    setFormData(prev => ({
      ...emptyFormData, providerType: type,
      stateId: prev.stateId, districtId: prev.districtId,
      employeeId: prev.employeeId, areaId: prev.areaId
    }));
    setFieldErrors({});
    setError("");
    setShowFamilyInfo(false);
    setShowOtherInfo(false);
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone")     value = value.replace(/\D/g, '').slice(0, 10);
    if (name === "aadhaar")   value = value.replace(/\D/g, '').slice(0, 12);
    if (name === "panCard")   value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    if (name === "gstNumber") value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
    setFormData(prev => ({ ...prev, [name]: value }));
    let errMsg = "";
    if (value.length > 0) {
      if (name === "phone"   && value.length < 10) errMsg = "Must be 10 digits.";
      if (name === "aadhaar" && value.length < 12) errMsg = "Must be 12 digits.";
      if (name === "email"   && !/\S+@\S+\.\S+/.test(value)) errMsg = "Invalid format.";
      if (name === "panCard" && value.length < 10) errMsg = "Must be 10 chars.";
    }
    setFieldErrors(prev => ({ ...prev, [name]: errMsg }));
  };

  const handleGeographicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newData = { ...prev, [name]: value };
      if (name === "stateId")    newData = { ...newData, districtId:"", employeeId:"", areaId:"" };
      if (name === "districtId") newData = { ...newData, employeeId:"", areaId:"" };
      if (name === "employeeId") newData = { ...newData, areaId:"" };
      return newData;
    });
  };

  const addDynamicRow = (type) => {
    setFormData(prev => {
      if (type === 'child') return { ...prev, childrenInfo: [...(prev.childrenInfo||[]), { childName:"", childAge:"" }] };
      if (type === 'time')  return { ...prev, meetingTimeInfo: [...(prev.meetingTimeInfo||[]), { city:"", sessionType:"Monday", slots:[{ fromTime:"", toTime:"" }] }] };
      return prev;
    });
  };

  const removeDynamicRow = (type, index) => {
    setFormData(prev => {
      if (type === 'child') return { ...prev, childrenInfo:    (prev.childrenInfo    ||[]).filter((_,i) => i!==index) };
      if (type === 'time')  return { ...prev, meetingTimeInfo: (prev.meetingTimeInfo ||[]).filter((_,i) => i!==index) };
      return prev;
    });
  };

  const handleDynamicInputChange = (type, index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const listName    = type==='child' ? 'childrenInfo' : 'meetingTimeInfo';
      const updatedList = [...(prev[listName]||[])];
      updatedList[index] = { ...updatedList[index], [name]: value };
      return { ...prev, [listName]: updatedList };
    });
  };

  const addDynamicSlot = (timeIndex) => {
    setFormData(prev => {
      const upd = [...(prev.meetingTimeInfo||[])];
      upd[timeIndex] = { ...upd[timeIndex], slots: [...(upd[timeIndex].slots||[]), { fromTime:"", toTime:"" }] };
      return { ...prev, meetingTimeInfo: upd };
    });
  };

  const removeDynamicSlot = (timeIndex, slotIndex) => {
    setFormData(prev => {
      const upd = [...(prev.meetingTimeInfo||[])];
      upd[timeIndex] = { ...upd[timeIndex], slots: (upd[timeIndex].slots||[]).filter((_,i) => i!==slotIndex) };
      return { ...prev, meetingTimeInfo: upd };
    });
  };

  const handleDynamicSlotInputChange = (timeIndex, slotIndex, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const upd      = [...(prev.meetingTimeInfo||[])];
      const updSlots = [...(upd[timeIndex].slots||[])];
      updSlots[slotIndex] = { ...updSlots[slotIndex], [name]: value };
      upd[timeIndex]      = { ...upd[timeIndex], slots: updSlots };
      return { ...prev, meetingTimeInfo: upd };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const hasErrors = Object.values(fieldErrors).some(err => err !== "");
    if (hasErrors) { setError("Please fix highlighted errors before saving."); window.scrollTo({top:0,behavior:'smooth'}); return; }
    if (formData.phone   && formData.phone.length   < 10) return setError("Phone must be 10 digits.");
    if (formData.aadhaar && formData.aadhaar.length < 12) return setError("Aadhaar must be 12 digits.");
    setIsSubmitting(true);
    try {
      let response;
      if (providerType === "Doctor") {
        const doctorPayload = {
          doctorName: formData.doctorName, doctorCode: formData.doctorCode,
          mslNo: formData.mslNo, category: formData.doctorCategory||null,
          degree: formData.doctorDegree||null, specialization: formData.doctorSpecialization||null,
          phone: formData.phone||null, gender: formData.gender||null,
          address: formData.address||null,
          licenceNo: showOtherInfo ? (formData.licenceNo||null) : null,
          email:      showOtherInfo ? (formData.email||null)     : null,
          frequencyVisit: formData.frequencyVisit ? parseInt(formData.frequencyVisit) : null,
          aadhaarNo: formData.aadhaar||null,
          stateId: parseInt(formData.stateId), districtId: parseInt(formData.districtId),
          employeeId: parseInt(formData.employeeId), areaId: parseInt(formData.areaId),
          children: showFamilyInfo && formData.childrenInfo
            ? formData.childrenInfo.map(c => ({ childName:c.childName, childAge:c.childAge?parseInt(c.childAge):null }))
            : [],
          locations: showOtherInfo && formData.meetingTimeInfo
            ? formData.meetingTimeInfo.map(loc => ({ city:loc.city, sessionType:loc.sessionType, slots:loc.slots.map(s=>({fromTime:s.fromTime,toTime:s.toTime})) }))
            : []
        };
        response = await api.post('/api/masters/doctors', doctorPayload);
      } else {
        const providerPayload = {
          stateId: parseInt(formData.stateId), districtId: parseInt(formData.districtId),
          employeeId: parseInt(formData.employeeId), areaId: parseInt(formData.areaId),
          type: formData.chemistType||null, providerCode: formData.chemistCode,
          providerName: formData.chemistName, phone: formData.phone||null,
          address: formData.address||null, city: formData.city||null,
          category: formData.chemistCategory||null,
          gender:      showOtherInfo ? (formData.gender||null)             : null,
          aadhaarNo:  showOtherInfo ? (formData.aadhaar||null)            : null,
          ownerName:  showOtherInfo ? (formData.ownerName||null)          : null,
          ownerDob:   showOtherInfo ? (formData.ownerDob||null)           : null,
          ownerDoa:   showOtherInfo ? (formData.ownerDoa||null)           : null,
          shopDoa:    showOtherInfo ? (formData.shopDoa||null)            : null,
          email:      showOtherInfo ? (formData.email||null)              : null,
          panCard:    showOtherInfo ? (formData.panCard||null)            : null,
          gstNumber:  showOtherInfo ? (formData.gstNumber||null)          : null,
          licenceNo:  showOtherInfo ? (formData.licenceNoChemist||null)   : null
        };
        response = await api.post('/api/masters/providers', providerPayload);
      }
      if (response.status===200||response.status===201||response.data?.success) {
        setPopup({ isOpen: true, message: `${providerType} created successfully!` });
        setFormData(emptyFormData);
        setShowFamilyInfo(false); setShowOtherInfo(false);
        window.scrollTo({top:0,behavior:'smooth'});
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to save ${providerType}.`);
      window.scrollTo({top:0,behavior:'smooth'});
    } finally { setIsSubmitting(false); }
  };

  const geoChange = (name) => (e) => handleGeographicChange({ target:{ name, value: e.target.value } });

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* ── Single Unified Card Container ── */}
      <div className="dc-card">
        {/* Header */}
        <div className="dc-header">
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div className="dc-page-icon">
              <BookUser size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize:16, fontWeight:700, color:"#1e293b", letterSpacing:"-0.01em", lineHeight:1.2 }}>Add New Provider (Doctor / Chemist)</h1>
              <p style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Select type and fill in the details</p>
            </div>
          </div>

          {/* Provider Type Selection */}
          <div style={{ display:"flex", alignItems:"center", gap:20, background:"#f8fafc", border:"1px solid #edf2f7", borderRadius:10, padding:"8px 16px" }}>
            {[
              { key:"Doctor",  label:"Doctor" },
              { key:"Chemist", label:"Chemist / Stockist" },
            ].map(t => (
              <label key={t.key} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                <div style={{
                  width:16, height:16, borderRadius:"50%", flexShrink:0,
                  border: providerType===t.key ? "2px solid #3B82F6" : "2px solid #cbd5e1",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: providerType===t.key ? "rgba(59,130,246,0.1)" : "#fff",
                  transition:"all 0.15s",
                  boxShadow: providerType===t.key ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
                }}>
                  {providerType===t.key && <div style={{ width:8, height:8, borderRadius:"50%", background:"#3B82F6" }}/>}
                </div>
                <span className="ucr-brand" style={{ fontSize:13, fontWeight: providerType===t.key ? 700 : 500, color: providerType===t.key ? "#1e293b" : "#64748b", transition:"all 0.15s" }}>
                  {t.label}
                </span>
                <input type="radio" name="providerType" value={t.key} checked={providerType===t.key}
                  onChange={() => handleTypeChange(t.key)} style={{ display:"none" }}/>
              </label>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Body Area */}
          <div className="dc-body">

            {/* ── Geography ── */}
            <SectionLabel text="Geographic Selection"/>
            <div className="dc-grid">
              <FSelect label="Select State" name="stateId" value={formData.stateId} onChange={geoChange("stateId")} required
                options={states.map(s => ({ id:s.id, label:s.state_name }))}/>
              <FSelect label="Select District" name="districtId" value={formData.districtId} onChange={geoChange("districtId")} required disabled={!formData.stateId}
                options={districts.map(d => ({ id:d.id, label:d.district_name }))}/>
              <FSelect label="Select Employee" name="employeeId" value={formData.employeeId} onChange={geoChange("employeeId")} required disabled={!formData.districtId}
                options={employees.map(e => ({ id:e.id, label:e.name }))}/>
              <FSelect label="Select Area" name="areaId" value={formData.areaId} onChange={(e) => handleInputChange(e)} required disabled={!formData.employeeId}
                options={areas.map(a => ({ id:a.id, label:a.area_name||a.areaName }))}/>
            </div>

            <hr className="dc-divider"/>

            {/* ══ DOCTOR SECTION ══ */}
            {providerType === "Doctor" ? (
              <>
                <SectionLabel text="Main Doctor Information" icon={<Stethoscope size={14} style={{color:"#3B82F6"}}/>}/>

                <div className="dc-grid">
                  <FInput label="Doctor Code"       name="doctorCode"       value={formData.doctorCode}       onChange={handleInputChange}/>
                  <FInput label="Doctor Name"     name="doctorName"       value={formData.doctorName}       onChange={handleInputChange} required/>
                  <FInput label="Doctor MSL No."  name="mslNo"             value={formData.mslNo}             onChange={handleInputChange} required/>
                  <FInput label="Frequency Visit"   name="frequencyVisit"   value={formData.frequencyVisit}   onChange={handleInputChange} type="number"/>
                </div>

                <div className="dc-grid">
                  <FSelect label="Category" name="doctorCategory" value={formData.doctorCategory} onChange={(e)=>handleInputChange(e)}
                    options={["A","A+","B","B+","C","Core","SuperCore"].map(c=>({id:c,label:c}))}/>
                  <FSelect label="Degree" name="doctorDegree" value={formData.doctorDegree} onChange={(e)=>handleInputChange(e)} required
                    options={["DM","MBBS","MCh","MD","MS"].map(d=>({id:d,label:d}))}/>
                  <FSelect label="Specialization" name="doctorSpecialization" value={formData.doctorSpecialization} onChange={(e)=>handleInputChange(e)} required
                    options={["Cardiologist","Critical Care","Dental","Dermatologist(Plastic Surgery)","Diabetologist","Endocrinologist","Gastroenterologist"].map(s=>({id:s,label:s}))}/>
                  <FSelect label="Gender" name="gender" value={formData.gender} onChange={(e)=>handleInputChange(e)} required
                    options={["Male","Female","Other"].map(g=>({id:g,label:g}))}/>
                </div>

                <div className="dc-grid-3">
                  <FInput label="Phone"   name="phone"   type="text" value={formData.phone}   onChange={handleInputChange} error={fieldErrors.phone}/>
                  <FInput label="Aadhaar" name="aadhaar" type="text" value={formData.aadhaar} onChange={handleInputChange} error={fieldErrors.aadhaar}/>
                  <FInput label="Address" name="address"             value={formData.address}  onChange={handleInputChange}/>
                </div>

                {/* Additional Info checkboxes */}
                <div className="dc-additional-box">
                  <p style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:12 }}>Additional Info</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {[{label:"Family Info", state:showFamilyInfo, set:setShowFamilyInfo},{label:"Other Info", state:showOtherInfo, set:setShowOtherInfo}].map(({label,state,set}) => (
                      <label key={label} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", width:"fit-content" }}>
                        <div style={{ width:16, height:16, borderRadius:4, border: state?"none":"1.5px solid #cbd5e1", background: state?"#3B82F6":"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {state && <Check size={10} style={{color:"#fff"}}/>}
                        </div>
                        <span style={{ fontSize:13, fontWeight:600, color:"#475569" }}>{label}</span>
                        <input type="checkbox" checked={state} onChange={e=>set(e.target.checked)} style={{display:"none"}}/>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Family Info */}
                {showFamilyInfo && (
                  <div className="dc-conditional-box">
                    <DynamicListTable
                      title="Family Info" icon={Baby}
                      onAdd={() => addDynamicRow('child')}
                      list={formData.childrenInfo||[]}
                      onRemove={idx => removeDynamicRow('child',idx)}
                      renderInputs={(item,index) => (
                        <div className="dc-grid-2" style={{margin:0}}>
                          <FInput label="Child Name" name="childName" value={item.childName} onChange={e=>handleDynamicInputChange('child',index,e)}/>
                          <FInput label="Child Age"  name="childAge"  type="number" value={item.childAge} onChange={e=>handleDynamicInputChange('child',index,e)}/>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Other Info */}
                {showOtherInfo && (
                  <div className="dc-conditional-box">
                    <p style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:14 }}>Other Info Doctor</p>
                    <div className="dc-grid-2">
                      <FInput label="Email"      name="email"      type="email" value={formData.email}      onChange={handleInputChange} error={fieldErrors.email}/>
                      <FInput label="Licence No" name="licenceNo"               value={formData.licenceNo}  onChange={handleInputChange}/>
                    </div>
                    <DynamicListTableTimeTemplate
                      title="Meeting Time Template" icon={CalendarDays}
                      onAdd={() => addDynamicRow('time')}
                      list={formData.meetingTimeInfo||[]}
                      onRemove={idx => removeDynamicRow('time',idx)}
                      renderMainInputs={(item,index) => (
                        <div className="dc-grid-2" style={{margin:0}}>
                          <FInput label="City" name="city" value={item.city} onChange={e=>handleDynamicInputChange('time',index,e)}/>
                          <FSelect label="Session Type (Day)" name="sessionType" value={item.sessionType} onChange={e=>handleDynamicInputChange('time',index,e)}
                            options={["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d=>({id:d,label:d}))}/>
                        </div>
                      )}
                      renderSlotInputs={(timeIndex,slotItem,slotIndex) => (
                        <>
                          <div style={{flex:1}}>
                            <FTimeInput label="From Time" name="fromTime" value={slotItem.fromTime} onChange={e=>handleDynamicSlotInputChange(timeIndex,slotIndex,e)}/>
                          </div>
                          <div style={{flex:1}}>
                            <FTimeInput label="To Time" name="toTime" value={slotItem.toTime} onChange={e=>handleDynamicSlotInputChange(timeIndex,slotIndex,e)}/>
                          </div>
                        </>
                      )}
                      onAddSlot={addDynamicSlot}
                      onRemoveSlot={removeDynamicSlot}
                    />
                  </div>
                )}
              </>

            ) : (
            /* ── CHEMIST SECTION ── */
              <>
                <SectionLabel text="Main Chemist Information" icon={<Beaker size={14} style={{color:"#3B82F6"}}/>}/>

                <div className="dc-grid">
                  <FInput label="Chemist / Stockist Code"  name="chemistCode"     value={formData.chemistCode}     onChange={handleInputChange}/>
                  <FInput label="Chemist / Stockist Name" name="chemistName"     value={formData.chemistName}     onChange={handleInputChange} required/>
                  <FSelect label="Type" name="chemistType" value={formData.chemistType} onChange={e=>handleInputChange(e)} required
                    options={["Chemist","Stockist"].map(t=>({id:t,label:t}))}/>
                  <FSelect label="Category" name="chemistCategory" value={formData.chemistCategory} onChange={e=>handleInputChange(e)}
                    options={["A","A+","B","B+","C"].map(c=>({id:c,label:c}))}/>
                </div>

                <div className="dc-grid">
                  <FInput label="Phone"   name="phone"   type="text" value={formData.phone}   onChange={handleInputChange} error={fieldErrors.phone}/>
                  <FInput label="Address" name="address"             value={formData.address}  onChange={handleInputChange}/>
                  <FInput label="City"    name="city"                value={formData.city}     onChange={handleInputChange}/>
                </div>

                {/* Additional Info checkboxes */}
                <div className="dc-additional-box">
                  <p style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:12 }}>Additional Info</p>
                  <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", width:"fit-content" }}>
                    <div style={{ width:16, height:16, borderRadius:4, border: showOtherInfo?"none":"1.5px solid #cbd5e1", background: showOtherInfo?"#3B82F6":"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {showOtherInfo && <Check size={10} style={{color:"#fff"}}/>}
                    </div>
                    <span style={{ fontSize:13, fontWeight:600, color:"#475569" }}>Other Info</span>
                    <input type="checkbox" checked={showOtherInfo} onChange={e=>setShowOtherInfo(e.target.checked)} style={{display:"none"}}/>
                  </label>
                </div>

                {/* Chemist Other Info */}
                {showOtherInfo && (
                  <div className="dc-conditional-box">
                    <p style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:14 }}>Chemist Other Info</p>
                    <div className="dc-grid">
                      <FInput label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleInputChange}/>
                      <FDatePicker label="Owner DOB" value={formData.ownerDob} onChange={v=>setFormData(p=>({...p,ownerDob:v}))}/>
                      <FDatePicker label="Owner DOA" value={formData.ownerDoa} onChange={v=>setFormData(p=>({...p,ownerDoa:v}))}/>
                      <FDatePicker label="Shop DOA"  value={formData.shopDoa}  onChange={v=>setFormData(p=>({...p,shopDoa:v}))}/>
                    </div>
                    <div className="dc-grid">
                      <FInput label="Aadhaar"  name="aadhaar" type="text" value={formData.aadhaar}  onChange={handleInputChange} error={fieldErrors.aadhaar}/>
                      <FSelect label="Gender" name="gender" value={formData.gender} onChange={e=>handleInputChange(e)} required
                        options={["Male","Female","Other"].map(g=>({id:g,label:g}))}/>
                      <FInput label="Email"    name="email"   type="email" value={formData.email}    onChange={handleInputChange} error={fieldErrors.email}/>
                      <FInput label="PAN Card" name="panCard"              value={formData.panCard}   onChange={handleInputChange} error={fieldErrors.panCard}/>
                    </div>
                    <div className="dc-grid">
                      <FInput label="GST Number" name="gstNumber"        value={formData.gstNumber}        onChange={handleInputChange}/>
                      <FInput label="Licence No" name="licenceNoChemist" value={formData.licenceNoChemist} onChange={handleInputChange}/>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Action Footer (Perfectly aligned right side inside the layout block) */}
          <div className="dc-footer">
            <button type="submit" disabled={isSubmitting} className="dc-submit-btn">
              {isSubmitting ? <Loader2 size={14} style={{animation:"dc-spin 1s linear infinite"}}/> : <Save size={14}/>}
              Save {providerType}
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

/* ─── Text Input ─────────────────────────────────────────────────────────── */
function FInput({ label, name, type="text", value, onChange, required, disabled, error }) {
  const [focus, setFocus] = useState(false);
  const hasVal  = Boolean(value?.toString().trim());
  const active  = focus || hasVal;

  const borderColor = error ? "#fca5a5" : focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow  = focus && !disabled ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)") : "none";
  const labelColor = error ? "#dc2626" : focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position:"relative", width:"100%", height:FH }}>
        <input
          type={type} id={name} name={name} value={value||""} onChange={onChange}
          required={required} disabled={disabled}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
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
          position:"absolute", left:10, pointerEvents:"none", zIndex:20,
          transition:"all 0.12s ease-out", fontWeight:500, top: active ? "0" : "50%",
          transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
        }}>{label}{required ? " *" : ""}</label>
      </div>
      {error && <p className="dc-field-error">{error}</p>}
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
  const bgColor     = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
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

/* ─── Time Input Components ─── */
function FTimeInput({ label, name, value, onChange }) {
  const [focus, setFocus] = useState(false);
  const hasVal      = Boolean(value);
  const borderColor = focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const shadow  = focus ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position:"relative", width:"100%", height:FH }}>
        <input
          type="time" id={name} name={name} value={value||""} onChange={onChange}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          placeholder=" "
          style={{
            ...fieldBase,
            padding: "0 36px 0 12px",
            background: "#ffffff",
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
          }}
        />
        <label style={{
          position:"absolute", left:10, pointerEvents:"none", zIndex:20,
          transition:"all 0.12s ease-out", fontWeight:500, top: "0",
          transform: "translateY(-50%)", fontSize: 11,
          color: labelColor, background: "#ffffff",
          padding: "0 5px", letterSpacing: "0.02em",
        }}>{label}</label>
        <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color: focus?"#3B82F6":"#cbd5e1", pointerEvents:"none", zIndex:10 }}>
          <Clock size={14}/>
        </div>
      </div>
    </div>
  );
}

/* ─── Premium Calendar Component ─── */
function FDatePicker({ label, value, onChange, disabled, required }) {
  const [open, setOpen] = useState(false);
  const today  = new Date();
  const parsed = (value && !isNaN(Date.parse(value))) ? new Date(value + "T00:00:00") : today;
  const [view, setView] = useState({ y: parsed.getFullYear(), m: parsed.getMonth() });
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const hasVal      = Boolean(value);
  const active      = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor      = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow       = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor   = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  const prevMonth = () => setView(v => v.m === 0  ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 });
  const nextMonth = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0  } : { y: v.y, m: v.m + 1 });

  const selectDay = (day) => {
    const ds = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(ds);
    setOpen(false);
  };

  const firstDow    = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const displayVal  = hasVal ? new Date(value + "T00:00:00").toLocaleDateString("en-GB") : "";
  const selStr      = d => `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayStr    = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open ? 100 : 1 }} className="dc-field-wrap">
      <div onClick={() => { if (!disabled) setOpen(!open); }}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor,
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? "#1e293b" : "transparent", fontSize: 14 }}>
          {displayVal || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", transition: "color 0.15s" }}>
          <CalendarDays size={15} />
        </div>
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}{required ? " *" : ""}</label>

      {open && !disabled && (
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
                  {Array.from({ length: 131 }, (_, i) => 1920 + i).map(y => (
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
            {DAYS.map(d => (
              <div key={d} className="dc-cal-weekday">{d}</div>
            ))}
          </div>
          <div className="dc-cal-days-grid">
            {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d       = i + 1;
              const ds      = selStr(d);
              const isSel   = value === ds;
              const isToday = ds === todayStr;
              return (
                <button key={d} type="button" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); selectDay(d); }}
                  className={`dc-cal-day-cell ${isSel ? "selected" : ""} ${isToday ? "today" : ""}`}
                >{d}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Dynamic List Table ─── */
function DynamicListTable({ title, icon:Icon, onAdd, list, onRemove, renderInputs }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, paddingBottom:10, borderBottom:"1px solid #f1f5f9" }}>
        <p className="ucr-brand" style={{ fontSize:14, fontWeight:700, color:"#1e293b", display:"flex", alignItems:"center", gap:8, margin:0 }}><Icon size={15} style={{color:"#3B82F6"}}/> {title}</p>
        <button type="button" onClick={onAdd}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.1)", color:"#2563eb", transition:"all 0.15s", fontFamily:"'Plus Jakarta Sans', sans-serif" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,0.1)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(59,130,246,0.06)"}
        >
          <PlusCircle size={13}/> Add Row
        </button>
      </div>
      {(!list||list.length===0) ? (
        <div style={{ textAlign:"center", padding:"24px 16px", fontSize:13, color:"#94a3b8", background:"#f8fafc", borderRadius:12, border:"1px dashed #e2e8f0" }}>
          No entries added yet. Click 'Add Row' to begin.
        </div>
      ) : (
        <div>
          {list.map((item,index) => (
            <div key={index} className="dc-dynamic-row">
              <div style={{flex:1}}>{renderInputs(item,index)}</div>
              <button type="button" onClick={()=>onRemove(index)} className="dc-remove-btn">
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Dynamic Time Template ─── */
function DynamicListTableTimeTemplate({ title, icon:Icon, onAdd, list, onRemove, renderMainInputs, renderSlotInputs, onAddSlot, onRemoveSlot }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, paddingBottom:10, borderBottom:"1px solid #f1f5f9" }}>
        <p className="ucr-brand" style={{ fontSize:14, fontWeight:700, color:"#1e293b", display:"flex", alignItems:"center", gap:8, margin:0 }}><Icon size={15} style={{color:"#3B82F6"}}/> {title}</p>
        <button type="button" onClick={onAdd}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.1)", color:"#2563eb", transition:"all 0.15s", fontFamily:"'Plus Jakarta Sans', sans-serif" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,0.1)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(59,130,246,0.06)"}
        >
          <PlusCircle size={13}/> Add City/Day Row
        </button>
      </div>

      {(!list||list.length===0) ? (
        <div style={{ textAlign:"center", padding:"24px 16px", fontSize:13, color:"#94a3b8", background:"#f8fafc", borderRadius:12, border:"1px dashed #e2e8f0" }}>
          No entries added yet. Click 'Add City/Day Row' to begin.
        </div>
      ) : (
        <div>
          {list.map((item,timeIndex) => (
            <div key={timeIndex} className="dc-dynamic-row" style={{ display:"block" }}>
              <div style={{flex:1}}>
                {/* City & Day */}
                <div style={{marginBottom:14, paddingBottom:14, borderBottom:"1px solid #e2e8f0"}}>
                  {renderMainInputs(item,timeIndex)}
                </div>
                {/* Slots */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#334155", display:"flex", alignItems:"center", gap:6, margin:0 }}>
                    <Clock size={14} style={{color:"#64748b"}}/> Time Slots
                  </p>
                  <button type="button" onClick={()=>onAddSlot(timeIndex)}
                    style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 12px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#16a34a", transition:"all 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#dcfce7"}
                    onMouseLeave={e=>e.currentTarget.style.background="#f0fdf4"}
                  >
                    <PlusCircle size={12}/> Add Slot
                  </button>
                </div>
                {(!item.slots||item.slots.length===0) ? (
                  <div style={{ textAlign:"center", padding:"12px", fontSize:12, color:"#94a3b8", border:"1px dashed #e2e8f0", borderRadius:8, background:"#ffffff" }}>
                    Click 'Add Slot' to begin adding times.
                  </div>
                ) : (
                  item.slots.map((slotItem,slotIndex) => (
                    <div key={slotIndex} className="dc-slot-row" style={{ alignItems: "center" }}>
                      <div style={{flex:1, display: "flex", gap: 14}}>{renderSlotInputs(timeIndex,slotItem,slotIndex)}</div>
                      <button type="button" onClick={()=>onRemoveSlot(timeIndex,slotIndex)}
                        style={{ border:"none", background:"none", cursor:"pointer", color:"#94a3b8", padding:"6px", borderRadius:8, display:"flex", alignItems:"center", flexShrink:0, transition:"all 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
                        onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}
                      >
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button type="button" onClick={()=>onRemove(timeIndex)} className="dc-remove-btn">
                <XCircle size={15}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}