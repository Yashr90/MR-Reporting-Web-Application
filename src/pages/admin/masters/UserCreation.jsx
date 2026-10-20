import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, Users, Save, Check,
  ChevronDown, ChevronLeft, ChevronRight, Calendar, Eye, EyeOff,
  User, Phone, Mail, CreditCard, Building2, MapPin, Briefcase,
  KeyRound, ShieldCheck, BadgeCheck, AlertCircle, CalendarDays,
  Lock, Landmark, Map
} from "lucide-react";
import api from "../../../services/api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ucr-root {
    font-family: 'Inter', sans-serif;
    width: 100%;
    background: #ffffff;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Card Container ── */
  .ucr-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    overflow: visible;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  }

  /* ── Card Header ── */
  .ucr-card-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    border-radius: 16px 16px 0 0;
    display: flex;
    align-items: center;
    gap: 14px;
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
    gap: 12px;
    border-radius: 0 0 16px 16px;
  }

  /* ── Section Label & Pills ── */
  .ucr-section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    margin-top: 4px;
  }

  .ucr-section-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.12);
    border-radius: 100px;
    white-space: nowrap;
  }

  .ucr-divider {
    border: none;
    border-top: 1px solid #f1f5f9;
    margin: 24px 0 28px;
  }

  /* ── Input Grids ── */
  .ucr-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }

  @media(max-width: 1200px) { .ucr-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(max-width: 900px)  { .ucr-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
  @media(max-width: 560px)  {
    .ucr-grid { grid-template-columns: 1fr; gap: 20px; }
    .ucr-body { padding: 20px 16px; }
    .ucr-card-header { padding: 20px 16px 12px; }
    .ucr-footer { padding: 12px 16px 20px; }
    .ucr-submit-btn { width: 100%; justify-content: center !important; }
  }

  /* ── Gender Layout Row ── */
  .ucr-gender-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 20px;
    padding: 12px 18px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
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

  .ucr-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; margin-top: 6px; }
  .ucr-field-error { font-size: 11px; color: #dc2626; font-weight: 500; padding-left: 4px; }

  /* ── Dropdown list ── */
  .ucr-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    z-index: 200;
    overflow: hidden;
  }

  .ucr-dropdown ul {
    max-height: 220px;
    overflow-y: auto;
    padding: 6px;
    margin: 0;
    list-style: none;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }

  .ucr-dropdown ul::-webkit-scrollbar { width: 4px; }
  .ucr-dropdown ul::-webkit-scrollbar-track { background: transparent; }
  .ucr-dropdown ul::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  .ucr-opt {
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
  .ucr-opt:hover   { background: rgba(59,130,246,0.06); color: #2563eb; }
  .ucr-opt.selected { background: rgba(59,130,246,0.08); color: #2563eb; font-weight: 600; }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    box-shadow: 0 0 0 1000px #ffffff inset !important;
    -webkit-text-fill-color: #1e293b !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* ── Upgraded Premium Calendar Panel ── */
  .ucr-cal {
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
    animation: ucr-cal-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes ucr-cal-pop {
    from { opacity: 0; transform: translateY(4px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media(max-width: 560px) {
    .ucr-cal { width: 280px; left: 50%; transform: translateX(-50%); }
  }

  .ucr-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
  }

  .ucr-cal-nav-btn {
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

  .ucr-cal-nav-btn:hover {
    background: #f1f5f9;
    color: #1e293b;
    border-color: #cbd5e1;
  }

  .ucr-cal-select-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ucr-cal-select-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .ucr-cal-native-select {
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

  .ucr-cal-native-select:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }

  .ucr-cal-weekday-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 6px;
  }

  .ucr-cal-weekday {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    padding: 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .ucr-cal-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 4px;
    column-gap: 4px;
    text-align: center;
  }

  .ucr-cal-day-cell {
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

  .ucr-cal-day-cell:hover:not(.selected) {
    background: #f1f5f9;
    color: #0f172a;
  }

  .ucr-cal-day-cell.today:not(.selected) {
    color: #3B82F6;
    font-weight: 700;
    background: rgba(59, 130, 246, 0.08);
  }

  .ucr-cal-day-cell.selected {
    background: #3B82F6 !important;
    color: #ffffff !important;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  }

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
  }
  .ucr-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.3);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }
  .ucr-submit-btn:active:not(:disabled) { transform: translateY(0); }
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

export default function UserCreation() {
  const [isLoading,    setIsLoading]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");
  const [popup,        setPopup]        = useState({ isOpen: false, message: "" });

  const [states,       setStates]       = useState([]);
  const [districts,    setDistricts]    = useState([]);
  const [designations, setDesignations] = useState([]);
  const [managers,     setManagers]     = useState([]);

  const [formData, setFormData] = useState({
    name:"", mobile:"", email:"", dob:"", gender:"", religion:"",
    aadhar:"", pan:"", address:"", stateId:"", districtId:"", bankName:"",
    bankAccountNumber:"", ifscCode:"", designationId:"", reportingManagerId:"",
    dateOfJoining:"", dateOfReporting:"", dateOfConfirmation:"", userCode:"",
    password:"", confirmPassword:""
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const selectedDesignation = designations.find(d => d.id.toString() === formData.designationId);
  
  // Adjusted condition: Check if the role is the absolute top role (like ADMIN or ROOT). 
  // If it's not the absolute root, it SHOULD be allowed to select a manager.
  const isRootRole = selectedDesignation && 
    (selectedDesignation.name === "ADMIN" || selectedDesignation.designation_name === "ADMIN");

  useEffect(() => { fetchInitialDropdownData(); }, []);

  useEffect(() => {
    if (formData.stateId) fetchDistrictsByState(formData.stateId);
    else setDistricts([]);
  }, [formData.stateId]);

  // Removed the useEffect that cleared the reportingManagerId when isMrSelected changed, 
  // so manager states remain completely preserved across all sub-roles.

  const fetchInitialDropdownData = async () => {
    try {
      setIsLoading(true);
      const [statesRes, desigRes, managersRes] = await Promise.all([
        api.get('/api/masters/states/all'),
        api.get('/api/masters/designations'),
        api.get('/api/masters/employees')
      ]);
      if (statesRes.data?.success)   setStates(statesRes.data.data);
      if (desigRes.data?.success)    setDesignations(desigRes.data.data);
      if (managersRes.data?.success) setManagers(managersRes.data.data);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistrictsByState = async (stateId) => {
    try {
      const response = await api.get(`/api/masters/districts/all?stateId=${stateId}`);
      if (response.data?.success) setDistricts(response.data.data);
    } catch (err) {
      console.error("Failed to fetch districts", err);
      setDistricts([]);
    }
  };

  const validateField = (name, val, currentData) => {
    let errMsg = "";
    if (val.length > 0) {
      if (name === "mobile"            && val.length < 10) errMsg = "Mobile must be exactly 10 digits.";
      if (name === "aadhar"            && val.length < 12) errMsg = "Aadhaar must be exactly 12 digits.";
      if (name === "pan"               && val.length < 10) errMsg = "PAN must be exactly 10 characters.";
      if (name === "bankAccountNumber" && val.length <  8) errMsg = "Bank Account must be at least 8 digits.";
      if (name === "ifscCode"          && val.length < 11) errMsg = "IFSC Code must be exactly 11 characters.";
      if (name === "confirmPassword"   && val !== currentData.password) errMsg = "Passwords do not match.";
      if (name === "password" && currentData.confirmPassword) {
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: val !== currentData.confirmPassword ? "Passwords do not match." : ""
        }));
      }
    }
    setFieldErrors(prev => ({ ...prev, [name]: errMsg }));
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "mobile")            value = value.replace(/\D/g, '').slice(0, 10);
    if (name === "aadhar")            value = value.replace(/\D/g, '').slice(0, 12);
    if (name === "bankAccountNumber") value = value.replace(/\D/g, '').slice(0, 18);
    if (name === "pan")               value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    if (name === "ifscCode")          value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      validateField(name, value, updatedData);
      return updatedData;
    });
  };

  const handleStateChange = (e) => {
    setFormData(prev => ({ ...prev, stateId: e.target.value, districtId: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.mobile.length < 10)                                         return setError("Mobile number must be exactly 10 digits.");
    if (formData.aadhar            && formData.aadhar.length < 12)         return setError("Aadhaar must be exactly 12 digits.");
    if (formData.pan               && formData.pan.length < 10)            return setError("PAN must be exactly 10 alphanumeric characters.");
    if (formData.bankAccountNumber && formData.bankAccountNumber.length < 8) return setError("Bank Account must be at least 8 digits.");
    if (formData.ifscCode          && formData.ifscCode.length < 11)       return setError("IFSC Code must be exactly 11 characters.");
    if (formData.password !== formData.confirmPassword)                      return setError("Passwords do not match!");
    setIsSubmitting(true);
    const payload = {
      name: formData.name, mobile: formData.mobile, email: formData.email,
      dob: formData.dob || null, gender: formData.gender, religion: formData.religion || null,
      aadhar: formData.aadhar || null, pan: formData.pan || null, address: formData.address || null,
      stateId:     formData.stateId     ? parseInt(formData.stateId)     : null,
      districtId:  formData.districtId  ? parseInt(formData.districtId)  : null,
      bankName: formData.bankName || null, bankAccountNumber: formData.bankAccountNumber || null,
      ifscCode: formData.ifscCode || null,
      designationId:      formData.designationId      ? parseInt(formData.designationId)      : null,
      reportingManagerId: formData.reportingManagerId ? parseInt(formData.reportingManagerId) : null,
      dateOfJoining:      formData.dateOfJoining      || null,
      dateOfReporting:    formData.dateOfReporting    || null,
      dateOfConfirmation: formData.dateOfConfirmation || null,
      userCode: formData.userCode || null,
      password: formData.password
    };
    try {
      const response = await api.post('/api/masters/employees', payload);
      if (response.status === 200 || response.status === 201 || response.data?.success) {
        setPopup({ isOpen: true, message: "Employee created successfully!" });
        setFormData({
          name:"", mobile:"", email:"", dob:"", gender:"Male", religion:"",
          aadhar:"", pan:"", address:"", stateId:"", districtId:"", bankName:"",
          bankAccountNumber:"", ifscCode:"", designationId:"", reportingManagerId:"",
          dateOfJoining:"", dateOfReporting:"", dateOfConfirmation:"", userCode:"",
          password:"", confirmPassword:""
        });
        setFieldErrors({});
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ucr-root">
      <style>{STYLES}</style>

      {error && (
        <div className="ucr-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <div className="ucr-card">
        {/* Header Panel */}
        <div className="ucr-card-header">
          <div className="ucr-page-icon">
            <Users size={16} color="#fff" />
          </div>
          <div>
            <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Employee Creation
            </h1>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              Fill in the details to onboard a new employee
            </p>
          </div>
          {isLoading && (
            <div style={{ marginLeft: "auto" }}>
              <Loader2 size={14} style={{ color: "#3B82F6", animation: "ucr-spin 1s linear infinite" }} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} autoComplete="new-password">
          <div className="ucr-body">

            {/* SECTION 1 — Job Information */}
            <SectionLabel icon={<Briefcase size={12} />} text="Job Information" />

            <div className="ucr-grid">
              <FSelect label="State" name="stateId" value={formData.stateId} onChange={handleStateChange} required icon={<MapPin size={14} />}
                options={states.map(s => ({ id: s.id, label: s.state_name }))} />

              <FSelect label="District" name="districtId" value={formData.districtId} onChange={handleInputChange} required icon={<Map size={14} />}
                disabled={!formData.stateId}
                options={districts.map(d => ({ id: d.id, label: d.district_name }))} />

              <FSelect label="Designation" name="designationId" value={formData.designationId} onChange={handleInputChange} required icon={<Briefcase size={14} />}
                options={designations.map(d => ({ id: d.id, label: d.name || d.designation_name }))} />

              {/* Reporting manager dropdown is now accessible to all roles except absolute root admins */}
              <FSelect label="Reporting Manager" name="reportingManagerId" value={formData.reportingManagerId} icon={<User size={14} />}
                onChange={handleInputChange} disabled={isRootRole}
                options={[
                  { id: "null", label: isRootRole ? "Not Applicable" : "None" },
                  ...managers.map(m => ({
                    id: m.id,
                    label: `${m.name} — ${m.designation?.name || m.designation?.designation_name || "Manager"}`
                  }))
                ]} />

              <FDatePicker label="Date of Joining" value={formData.dateOfJoining}
                onChange={v => setFormData(p => ({ ...p, dateOfJoining: v }))} required />

              <FDatePicker label="Date of Reporting" value={formData.dateOfReporting}
                onChange={v => setFormData(p => ({ ...p, dateOfReporting: v }))} required />

              <FDatePicker label="Date of Confirmation" value={formData.dateOfConfirmation}
                onChange={v => setFormData(p => ({ ...p, dateOfConfirmation: v }))} />

              <FInput label="User Code" name="userCode" value={formData.userCode}
                onChange={handleInputChange} icon={<BadgeCheck size={14} />} />
            </div>

            <hr className="ucr-divider" />

            {/* SECTION 2 — Personal Information */}
            <SectionLabel icon={<User size={12} />} text="Personal Information" />

            <div className="ucr-grid">
              <FInput label="Full Name" name="name" value={formData.name}
                onChange={handleInputChange} required icon={<User size={14} />} />

              <FInput label="Mobile (10 digits)" name="mobile" type="text" value={formData.mobile}
                onChange={handleInputChange} required error={fieldErrors.mobile} icon={<Phone size={14} />} />

              <FInput label="Email Address" name="email" type="email" value={formData.email}
                onChange={handleInputChange} icon={<Mail size={14} />} />

              <FDatePicker label="Date of Birth" value={formData.dob}
                onChange={v => setFormData(p => ({ ...p, dob: v }))} />

              <FSelect label="Religion" name="religion" value={formData.religion} onChange={handleInputChange} icon={<Users size={14} />}
                options={[
                  { id: "Hindu",     label: "Hindu"     },
                  { id: "Muslim",    label: "Muslim"    },
                  { id: "Christian", label: "Christian" },
                  { id: "Sikh",      label: "Sikh"      },
                  { id: "Other",     label: "Other"     },
                ]} />

              <FInput label="Aadhaar (12 digits)" name="aadhar" type="text" value={formData.aadhar}
                onChange={handleInputChange} error={fieldErrors.aadhar} icon={<CreditCard size={14} />} />

              <FInput label="PAN (10 chars)" name="pan" value={formData.pan}
                onChange={handleInputChange} error={fieldErrors.pan} icon={<CreditCard size={14} />} />

              <FInput label="Address" name="address" value={formData.address}
                onChange={handleInputChange} icon={<MapPin size={14} />} />

              <FInput label="Bank Name" name="bankName" value={formData.bankName}
                onChange={handleInputChange} icon={<Building2 size={14} />} />

              <FInput label="Bank Account Number" name="bankAccountNumber" type="text"
                value={formData.bankAccountNumber} onChange={handleInputChange}
                error={fieldErrors.bankAccountNumber} icon={<Landmark size={14} />} />

              <FInput label="IFSC Code (11 chars)" name="ifscCode" value={formData.ifscCode}
                onChange={handleInputChange} error={fieldErrors.ifscCode} icon={<Building2 size={14} />} />
            </div>

            <div className="ucr-gender-row">
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
                Gender
              </span>
              {["Male", "Female"].map(g => (
                <label key={g} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: formData.gender === g ? "2px solid #3B82F6" : "2px solid #cbd5e1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: formData.gender === g ? "rgba(59,130,246,0.1)" : "#fff",
                    transition: "all 0.15s",
                    boxShadow: formData.gender === g ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
                  }}>
                    {formData.gender === g && (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />
                    )}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: formData.gender === g ? "#1e293b" : "#64748b" }}>
                    {g}
                  </span>
                  <input type="radio" name="gender" value={g}
                    checked={formData.gender === g} onChange={handleInputChange}
                    style={{ display: "none" }} />
                </label>
              ))}
            </div>

            <hr className="ucr-divider" />

            {/* SECTION 3 — Login Information */}
            <SectionLabel icon={<ShieldCheck size={12} />} text="Login Information" />

            <div className="ucr-grid">
              <FInput label="Email (Username)" name="loginEmail" type="email"
                value={formData.email} disabled icon={<Mail size={14} />} />
              <FPasswordInput label="Password" name="password" value={formData.password}
                onChange={handleInputChange} required error={fieldErrors.password} icon={<Lock size={14} />} />
              <FPasswordInput label="Confirm Password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleInputChange} required error={fieldErrors.confirmPassword} icon={<ShieldCheck size={14} />} />
            </div>

          </div>

          <div className="ucr-footer">
            <button type="submit" disabled={isSubmitting} className="ucr-submit-btn">
              {isSubmitting
                ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} />
                : <Save size={14} />}
              {isSubmitting ? "Saving…" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>

      {popup.isOpen && (
        <div className="ucr-overlay">
          <div className="ucr-popup">
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
            }}>
              <Check size={28} style={{ color: "#3B82F6", strokeWidth: 2.5 }} />
            </div>

            <h3 className="ucr-brand" style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
              Employee Created!
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

function SectionLabel({ text, icon }) {
  return (
    <div className="ucr-section-label">
      <div className="ucr-section-pill">
        <span style={{ color: "#3B82F6", display: "flex", alignItems: "center" }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", letterSpacing: "0.04em" }}>{text}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
    </div>
  );
}

function FInput({ label, name, type = "text", value, onChange, required, disabled, error, icon }) {
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
          type={type} id={name} name={name} value={value || ""}
          onChange={onChange} required={required} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder=" "
          autoComplete="new-password"
          style={{
            ...fieldBase,
            padding: icon ? "0 34px 0 12px" : "0 12px",
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
            color: disabled ? "#94a3b8" : "#1e293b",
          }}
        />
        {icon && (
          <div style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: focus ? "#3B82F6" : "#cbd5e1",
            transition: "all 0.15s",
            pointerEvents: "none",
            zIndex: 10,
          }}>
            {icon}
          </div>
        )}
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
      {error && <p className="ucr-field-error">{error}</p>}
    </div>
  );
}

function FPasswordInput({ label, name, value, onChange, required, error, icon }) {
  const [focus, setFocus] = useState(false);
  const [show,  setShow]  = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = error
    ? "#fca5a5"
    : focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = focus ? "#eff6ff" : "#ffffff";
  const shadow  = focus
    ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)")
    : "none";
  const labelColor = error
    ? "#dc2626"
    : focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="ucr-field-wrap">
      <div style={{ position: "relative", width: "100%", height: FH }}>
        <input
          type={show ? "text" : "password"} id={name} name={name} value={value || ""}
          onChange={onChange} required={required}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder=" "
          autoComplete="new-password"
          style={{
            ...fieldBase,
            padding: "0 42px 0 12px",
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
            color: "#1e293b",
          }}
        />
        {icon && (
          <div style={{
            position: "absolute", right: 34, top: "50%", transform: "translateY(-50%)",
            color: focus ? "#3B82F6" : "#cbd5e1",
            pointerEvents: "none", zIndex: 10, transition: "color 0.15s",
          }}>
            {icon}
          </div>
        )}
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
          color: labelColor,
          background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0",
          letterSpacing: active ? "0.02em" : "0",
        }}>
          {label}{required ? " *" : ""}
        </label>
        <button type="button" onClick={() => setShow(!show)} style={{
          position: "absolute", right: 12, top:"50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center",
          color: focus ? "#3B82F6" : "#94a3b8", padding: 0, transition: "color 0.15s",
        }}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <p className="ucr-field-error">{error}</p>}
    </div>
  );
}

function FSelect({ label, name, value, onChange, required, disabled, options = [] , icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected   = options.find(o => String(o.id) === String(value));
  const hasVal     = Boolean(value);
  const active     = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor     = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow      = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  const handleSelect = (optId) => {
    onChange({ target: { name, value: String(optId) } });
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open ? 100 : 1 }} className="ucr-field-wrap">
      <div
        onClick={() => { if (!disabled) setOpen(!open); }}
        style={{
          width: "100%", height: FH, borderRadius: 8,
          padding: icon ? "0 36px 0 12px" : "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: bgColor,
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled ? "none" : shadow,
          transition: "all 0.18s",
          boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
          {selected?.label || " "}
        </span>
        {icon && (
          <div style={{
            position: "absolute", right: 30, top: "50%", transform: "translateY(-50%)",
            color: open ? "#3B82F6" : "#cbd5e1", pointerEvents: "none", zIndex: 10
          }}>
            {icon}
          </div>
        )}
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", transition: "all 0.2s" }}>
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>

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

      {open && !disabled && (
        <div className="ucr-dropdown">
          <ul>
            {options.length === 0 && (
              <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>
            )}
            {options.map(opt => (
              <li key={opt.id}
                className={`ucr-opt${String(value) === String(opt.id) ? " selected" : ""}`}
                onMouseDown={e => { e.preventDefault(); handleSelect(opt.id); }}
              >
                {String(value) === String(opt.id) && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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

  const hasVal     = Boolean(value);
  const active     = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor     = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow      = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

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
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open ? 100 : 1 }} className="ucr-field-wrap">
      <div
        onClick={() => { if (!disabled) setOpen(!open); }}
        style={{
          width: "100%", height: FH, borderRadius: 8,
          padding: "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: bgColor,
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled ? "none" : shadow,
          transition: "all 0.18s",
          boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? "#1e293b" : "transparent", fontSize: 14, fontFamily: "monospace", letterSpacing: "0.02em" }}>
          {displayVal || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", transition: "color 0.15s" }}>
          <Calendar size={15} />
        </div>
      </div>

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

      {open && !disabled && (
        <div className="ucr-cal">
          <div className="ucr-cal-header">
            <button type="button" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); prevMonth(); }} className="ucr-cal-nav-btn">
              <ChevronLeft size={14} />
            </button>

            <div className="ucr-cal-select-group">
              <div className="ucr-cal-select-wrap">
                <select value={view.m} onChange={e => setView({ ...view, m: Number(e.target.value) })} className="ucr-cal-native-select">
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i} style={{ color: "#1e293b", background: "#fff" }}>{m.slice(0, 3)}</option>
                  ))}
                </select>
                <ChevronDown size={10} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#2563eb", pointerEvents: "none" }} />
              </div>

              <div className="ucr-cal-select-wrap">
                <select value={view.y} onChange={e => setView({ ...view, y: Number(e.target.value) })} className="ucr-cal-native-select">
                  {Array.from({ length: 131 }, (_, i) => 1920 + i).map(y => (
                    <option key={y} value={y} style={{ color: "#1e293b", background: "#fff" }}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={10} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#2563eb", pointerEvents: "none" }} />
              </div>
            </div>

            <button type="button" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); nextMonth(); }} className="ucr-cal-nav-btn">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="ucr-cal-weekday-grid">
            {DAYS.map(d => (
              <div key={d} className="ucr-cal-weekday">{d}</div>
            ))}
          </div>

          <div className="ucr-cal-days-grid">
            {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d       = i + 1;
              const ds      = selStr(d);
              const isSel   = value === ds;
              const isToday = ds === todayStr;
              return (
                <button
                  key={d}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); selectDay(d); }}
                  className={`ucr-cal-day-cell ${isSel ? "selected" : ""} ${isToday ? "today" : ""}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}