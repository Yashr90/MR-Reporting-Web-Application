import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, ChevronDown, SlidersHorizontal,
  Search, ChevronLeft, ChevronRight, MapPin, Calendar, User, Briefcase, ToggleRight,
  Check, X, FileSpreadsheet, CheckCircle2
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const MONTHS = [
  { value: 1,  label: "January"   }, { value: 2,  label: "February"  },
  { value: 3,  label: "March"     }, { value: 4,  label: "April"     },
  { value: 5,  label: "May"       }, { value: 6,  label: "June"      },
  { value: 7,  label: "July"      }, { value: 8,  label: "August"    },
  { value: 9,  label: "September" }, { value: 10, label: "October"   },
  { value: 11, label: "November"  }, { value: 12, label: "December"  },
];

const YEARS     = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
const PAGE_SIZE = 10;

const TABLE_COLS = [
  { key: "stateName",      label: "State Name" },
  { key: "hqName",         label: "Headquarter Name" },
  { key: "name",           label: "Name" },
  { key: "employeeCode",   label: "Employee Code" },
  { key: "division",       label: "Division" },
  { key: "designation",    label: "Designation" },
  { key: "submitted",      label: "Submitted" },
  { key: "submissionDate", label: "Submission Date" },
  { key: "approved",       label: "Approved" },
  { key: "approvedDate",   label: "Approved Date" },
  { key: "rejectionMsg",   label: "Rejection Message" },
];

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
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
    background: #ffffff !important;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: isolate;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    position: relative;
    overflow: visible !important;
    margin-bottom: 24px;
  }

  /* ── Card Header ── */
  .dc-header {
    padding: 24px 28px 16px;
    background: #ffffff !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    border-radius: 16px 16px 0 0 !important;
    overflow: visible !important;
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
  .dc-body { 
    padding: 20px 28px 24px; 
    background: #ffffff !important; 
    border-bottom-left-radius: 16px; 
    border-bottom-right-radius: 16px;
    overflow: visible !important;
  }

  /* ── Form Footer ── */
  .dc-footer {
    padding: 20px 28px 24px;
    background: #ffffff !important;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-radius: 16px;
    border-top: 1px solid #f1f5f9;
  }

  /* ── Responsive Input Grids ── */
  .dc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }
  .ucr-gender-row { 
    display: flex; 
    align-items: center; 
    gap: 20px; 
    flex-wrap: wrap; 
    margin: 16px 0 24px; 
    padding: 12px 20px; 
    background: #f8fafc; 
    border-radius: 10px; 
    border: 1px solid #edf2f7; 
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
    .dc-submit-btn { width: auto !important; }
  }

  /* ── Portal Dropdown Layer ── */
  .dc-portal-dropdown {
    background: #ffffff !important;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04);
    z-index: 9999999 !important;
    overflow: hidden;
  }

  .dc-portal-dropdown ul {
    background: #ffffff !important;
    max-height: 220px;
    overflow-y: auto;
    padding: 6px;
    margin: 0;
    list-style: none;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }

  .dc-opt {
    padding: 10px 14px;
    font-size: 13.5px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    background: #ffffff !important;
    transition: all 0.12s;
    font-weight: 500;
  }
  .dc-opt:hover   { background: rgba(59,130,246,0.06) !important; color: #2563eb; }
  .dc-opt.selected { background: rgba(59,130,246,0.08) !important; color: #2563eb; font-weight: 600; }

  /* ── Responsive Premium Table Container ── */
  .ucr-table-container {
    border: 1px solid #edf2f7;
    border-radius: 12px;
    overflow-x: auto;
    background: #ffffff !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
    -webkit-overflow-scrolling: touch;
  }
  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 800px; }
  .ucr-table thead tr { position: sticky; top: 0; z-index: 10; }
  .ucr-table thead { background: #f8fafc; }
  .ucr-table th { 
    padding: 12px 14px; 
    font-size: 11px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 0.04em; 
    color: #64748b;
    border-bottom: 1px solid #edf2f7; 
    white-space: nowrap;
  }
  .ucr-table td { padding: 12px 14px; color: #475569; border-bottom: 1px solid #f8fafc; font-weight: 500; white-space: nowrap; }
  .ucr-table tbody tr:last-child td { border-bottom: none; }
  .ucr-table tbody tr:hover { background: #f8fafc; }

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

  /* ── Action Buttons ── */
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
    background: #ffffff !important;
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

  .dc-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; overflow: visible !important; }

  @keyframes dc-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dc-zoom { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
`;

const FH = 40;

const boolStr = v => (v === true || v === "true" ? "Yes" : v === false || v === "false" ? "No" : String(v ?? "—"));

const getVal = (row, key) => ({
  stateName:      row.stateName      || row.state_name      || row.state?.stateName      || "—",
  hqName:         row.hqName         || row.headquarterName || row.district?.districtName || "—",
  name:           row.name           || row.employeeName    || row.employee?.name         || "—",
  employeeCode:   row.employeeCode   || row.employee_code   || row.employee?.code         || "—",
  division:       row.division       || "—",
  designation:    row.designation    || row.designationName || row.employee?.designation?.name || "—",
  submitted:      row.submitted      != null ? boolStr(row.submitted)  : "—",
  submissionDate: row.submissionDate || row.submission_date || "—",
  approved:       row.approved       != null ? boolStr(row.approved)   : "—",
  approvedDate:   row.approvedDate   || row.approved_date   || "—",
  rejectionMsg:   row.rejectionMessage || row.rejectionMsg  || row.rejection_message || "—",
}[key] ?? "—");

export default function ApproveTourProgram() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [mode,       setMode]       = useState("geographical");

  const [states,       setStates]       = useState([]);
  const [districts,    setDistricts]    = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees,    setEmployees]    = useState([]);

  const [geoStateIds,   setGeoStateIds]   = useState([]);
  const [geoDistIds,    setGeoDistIds]    = useState([]);
  const [geoMonth,      setGeoMonth]      = useState("");
  const [geoYear,       setGeoYear]       = useState("");

  const [hierDesignation, setHierDesignation] = useState("");
  const [hierStatus,      setHierStatus]      = useState("");
  const [hierEmployeeIds, setHierEmployeeIds] = useState([]);
  const [hierMonth,       setHierMonth]       = useState("");
  const [hierYear,        setHierYear]        = useState("");

  const [tableData,    setTableData]    = useState([]);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [tableVisible, setTableVisible] = useState(false);

  const [rejectPopup,  setRejectPopup]  = useState(false);
  const [rejectRow,    setRejectRow]    = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [isLoading,    setIsLoading]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");
  const [popup,        setPopup]        = useState({ isOpen: false, message: "" });

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    if (geoStateIds.length > 0) {
      fetchDistricts(geoStateIds);
      setGeoDistIds([]);
    } else {
      setDistricts([]);
      setGeoDistIds([]);
    }
  }, [geoStateIds]);

  useEffect(() => {
    if (hierDesignation && hierStatus !== "") {
      fetchEmployees(hierDesignation, hierStatus);
      setHierEmployeeIds([]);
    } else {
      setEmployees([]);
      setHierEmployeeIds([]);
    }
  }, [hierDesignation, hierStatus]);

  useEffect(() => {
    setTableVisible(false); setTableData([]);
    setSearchQuery(""); setCurrentPage(1); setError(""); 
  }, [mode]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [sRes, dRes] = await Promise.all([
        api.get("/api/masters/states"),
        api.get("/api/masters/designations"),
      ]);
      if (sRes.data?.success) setStates(sRes.data.data || []);
      if (dRes.data?.success) setDesignations(dRes.data.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const fetchDistricts = async (stateIds) => {
    try {
      const res = await api.get(`/api/masters/districts/by-states?stateIds=${stateIds.join(",")}`);
      if (res.data?.success) setDistricts(res.data.data || []);
      else setDistricts([]);
    } catch { setDistricts([]); }
  };

  const fetchEmployees = async (designationId, isActive) => {
    try {
      const res = await api.get(`/api/approvals/tour-program/employees?designationId=${designationId}&isActive=${isActive}`);
      if (res.data?.success) setEmployees(res.data.data || []);
      else setEmployees([]);
    } catch { setEmployees([]); }
  };

  const handleViewStatus = async (isRefresh = false) => {
    setError(""); 
    if (mode === "geographical") {
      if (!geoStateIds.length || !geoDistIds.length || !geoMonth || !geoYear) return setError("Please fill all mandatory fields.");
    } else {
      if (!hierDesignation || !hierStatus || !hierEmployeeIds.length || !hierMonth || !hierYear) return setError("Please fill all mandatory fields.");
    }

    if (!isRefresh) {
      setIsLoading(true); 
      setTableVisible(false);
    }
    
    try {
      let res;
      if (mode === "geographical") {
        const p = new URLSearchParams({ month: geoMonth, year: geoYear });
        // Sanitize multi ids mapping logic to prevent primitive parsing collapse crashes
        geoDistIds.forEach(id => p.append("districtIds", String(id.id || id)));
        res = await api.get(`/api/approvals/tour-program/geographical?${p}`);
      } else {
        const p = new URLSearchParams({ designationId: hierDesignation, isActive: hierStatus, month: hierMonth, year: hierYear });
        hierEmployeeIds.forEach(id => p.append("employeeIds", String(id.id || id)));
        res = await api.get(`/api/approvals/tour-program/hierarchical?${p}`);
      }
      const data = res.data?.data || res.data || [];
      setTableData(Array.isArray(data) ? data : []);
      setTableVisible(true); 
      if (!isRefresh) {
        setCurrentPage(1); 
        setSearchQuery("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleApprove = async (row) => {
    const id = row.id || row.tourProgramId || row.tour_program_id || row.tourId || row.employeeId || row.employee_id;
    if (!id) {
      setError("Action Blocked: Record ID is missing from the server response.");
      return;
    }
    
    setIsSubmitting(true); setError("");
    try {
      await api.put(`/api/approvals/tour-program/approve/${id}`);
      setPopup({ isOpen: true, message: "Tour program approved successfully!" });
      handleViewStatus(true);
    } catch (err) { 
      setError(err.response?.data?.message || "Approve failed. Please try again."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    const id = rejectRow?.id || rejectRow?.tourProgramId || rejectRow?.tour_program_id || rejectRow?.tourId || rejectRow?.employeeId;
    if (!id) {
      setError("Action Blocked: Record ID is missing from the server response.");
      setRejectPopup(false);
      return;
    }

    setIsSubmitting(true); setError("");
    try {
      await api.put(`/api/approvals/tour-program/reject/${id}`, { rejectionMessage: rejectReason.trim() });
      setRejectPopup(false); setRejectReason(""); setRejectRow(null);
      setPopup({ isOpen: true, message: "Tour program rejected successfully." });
      handleViewStatus(true);
    } catch (err) { 
      setError(err.response?.data?.message || "Reject failed. Please try again."); 
      setRejectPopup(false); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleExport = () => {
    if (!filteredData.length) return;
    const header = TABLE_COLS.map(c => c.label).join(",");
    const rows   = filteredData.map(r => TABLE_COLS.map(c => `"${String(getVal(r, c.key)).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "tour_program.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = tableData.filter(row =>
    TABLE_COLS.some(c => String(getVal(row, c.key)).toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pagedData  = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goToPage   = p => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  // Options
  const stateOpts = states.map(s => ({ id: String(s.id), label: s.state_name || s.stateName }));
  const distOpts  = districts.map(d => ({ id: String(d.id), label: d.district_name || d.districtName }));
  const desigOpts = designations.map(d => ({ id: String(d.id), label: d.name || d.designation_name }));
  const empOpts   = employees.map(e => ({ id: String(e.id), label: e.name || e.employee_name }));

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <div className="dc-card">
        {/* Header */}
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <SlidersHorizontal size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Approve Tour Program</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Review and manage employee tour program approvals</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
              <div style={{ width: 40, height: 20, borderRadius: 100, position: "relative", cursor: "pointer", transition: "0.2s", background: filterOpen ? "#3B82F6" : "#cbd5e1" }}>
                <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: filterOpen ? 23 : 3, transition: "0.2s" }} />
              </div>
            </div>
          </button>
        </div>

        {filterOpen && (
          <div className="dc-body">
            <div className="ucr-gender-row">
              <span className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginRight: 8 }}>Selection Mode:</span>
              {[
                { value: "geographical", label: "Geographical" },
                { value: "hierarchical", label: "Hierarchical" },
              ].map(opt => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                    border: mode === opt.value ? "2px solid #3B82F6" : "2px solid #cbd5e1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: mode === opt.value ? "rgba(59,130,246,0.1)" : "#fff",
                    transition: "all 0.15s",
                    boxShadow: mode === opt.value ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
                  }}>
                    {mode === opt.value && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />}
                  </div>
                  <span className="ucr-brand" style={{ fontSize: 13, fontWeight: mode === opt.value ? 700 : 500, color: mode === opt.value ? "#1e293b" : "#64748b", transition: "all 0.15s" }}>
                    {opt.label}
                  </span>
                  <input type="radio" checked={mode === opt.value} onChange={() => setMode(opt.value)} style={{ display: "none" }} />
                </label>
              ))}
            </div>

            <div className="dc-grid">
              {mode === "geographical" ? (
                <>
                  <MultiSelectDropdown label="Select State" name="geoStateIds" options={stateOpts} selectedIds={geoStateIds} onChange={setGeoStateIds} icon={MapPin} />
                  <MultiSelectDropdown label="Select District" name="geoDistIds" options={distOpts} selectedIds={geoDistIds} onChange={setGeoDistIds} disabled={!geoStateIds.length} icon={MapPin} />
                  <FSelect label="Select Month" name="geoMonth" value={geoMonth} onChange={(e) => setGeoMonth(e.target.value)} options={MONTHS.map(m => ({ id: m.value, label: m.label }))} icon={Calendar} />
                  <FSelect label="Select Year" name="geoYear" value={geoYear} onChange={(e) => setGeoYear(e.target.value)} options={YEARS.map(y => ({ id: y, label: String(y) }))} icon={Calendar} />
                </>
              ) : (
                <>
                  <FSelect label="Designation" name="hierDesignation" value={hierDesignation} onChange={(e) => { setHierDesignation(e.target.value); setHierStatus(""); setHierEmployeeIds([]); }} options={desigOpts} icon={Briefcase} />
                  <FSelect label="Status" name="hierStatus" value={hierStatus} onChange={(e) => setHierStatus(e.target.value)} disabled={!hierDesignation} options={[{ id: "true", label: "Active" }, { id: "false", label: "Inactive" }]} icon={ToggleRight} />
                  <MultiSelectDropdown label="Select Employee" name="hierEmployeeIds" options={empOpts} selectedIds={hierEmployeeIds} onChange={setHierEmployeeIds} disabled={!hierDesignation || !hierStatus} icon={User} />
                  <FSelect label="Month" name="hierMonth" value={hierMonth} onChange={(e) => setHierMonth(e.target.value)} options={MONTHS.map(m => ({ id: m.value, label: m.label }))} icon={Calendar} />
                  <FSelect label="Year" name="hierYear" value={hierYear} onChange={(e) => setHierYear(e.target.value)} options={YEARS.map(y => ({ id: y, label: String(y) }))} icon={Calendar} />
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => handleViewStatus(false)} disabled={isLoading} className="dc-submit-btn">
                {isLoading ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Search size={14} />}
                View Status
              </button>
            </div>
          </div>
        )}
      </div>

      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="dc-page-icon">
                <FileSpreadsheet size={16} color="#fff" />
              </div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Tour Program Details</h1>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ height: 40, padding: "0 12px 0 36px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 8, width: 220, outline: "none", color: "#1e293b", fontFamily: "'Inter', sans-serif" }} />
                <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              </div>
              <button onClick={handleExport} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.15)" }} title="Export to CSV">
                <FileSpreadsheet size={16} />
              </button>
            </div>
          </div>
          <div className="dc-body" style={{ padding: "20px 28px 24px" }}>
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: "center" }}>#</th>
                    {TABLE_COLS.map(col => <th key={col.key}>{col.label}</th>)}
                    <th style={{ textAlign: "center" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.length === 0 ? (
                    <tr>
                      <td colSpan={TABLE_COLS.length + 2} style={{ textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontStyle: "italic" }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    pagedData.map((row, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                        {TABLE_COLS.map(col => {
                          const val = getVal(row, col.key);
                          return (
                            <td key={col.key}>
                              {col.key === "approved" ? (
                                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: val === "Yes" ? "#f0fdf4" : "#f8fafc", color: val === "Yes" ? "#16a34a" : "#64748b", border: `1px solid ${val === "Yes" ? "#bbf7d0" : "#e2e8f0"}` }}>{val}</span>
                              ) : val}
                            </td>
                          );
                        })}
                        <td>
                          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                            <button onClick={() => handleApprove(row)} disabled={isSubmitting || getVal(row, "approved") === "Yes"} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: (isSubmitting || getVal(row, "approved") === "Yes") ? 0.5 : 1, transition: "all 0.15s" }}>Approve</button>
                            <button onClick={() => { setRejectRow(row); setRejectPopup(true); }} disabled={isSubmitting} style={{ background: "#475569", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredData.length > 0 && (
              <div className="dc-footer" style={{ borderTop: "none", padding: "20px 0 0" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => goToPage(1)} disabled={currentPage === 1} style={pagBtnStyle}>First</button>
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} style={pagBtnStyle}><ChevronLeft size={14}/></button>
                  <span style={{ padding: "0 12px", display: "flex", alignItems: "center", fontSize: 12, fontWeight: 700, color: "#2563eb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Page {currentPage} of {totalPages}</span>
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} style={pagBtnStyle}><ChevronRight size={14}/></button>
                  <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} style={pagBtnStyle}>Last</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Popup */}
      {rejectPopup && (
        <div className="dc-overlay">
          <div className="dc-popup" style={{ maxWidth: 420, padding: 24 }}>
            <h3 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "#1e293b", width: "100%", textAlign: "left" }}>Reject Tour Program</h3>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, width: "100%", textAlign: "left" }}>Please provide a reason for rejecting this tour program.</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Type reason here..." style={{ width: "100%", height: 100, borderRadius: 8, border: "1.5px solid #e2e8f0", padding: 12, fontSize: 13, outline: "none", marginBottom: 20, resize: "none", fontFamily: "Inter, sans-serif", color: "#1e293b" }} />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", width: "100%" }}>
              <button onClick={() => setRejectPopup(false)} style={{ padding: "8px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cancel</button>
              <button onClick={handleReject} disabled={!rejectReason.trim() || isSubmitting} style={{ padding: "8px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: (!rejectReason.trim() || isSubmitting) ? 0.6 : 1, transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reject Program</button>
            </div>
          </div>
        </div>
      )}

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

const pagBtnStyle = { background: "#fff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569", fontFamily: "'Inter', sans-serif" };

// ═══════════════════════════════════════════════════════════════════
// FSelect — Searchable Portal Dropdown Component
// ═══════════════════════════════════════════════════════════════════
function FSelect({ label, name, value, onChange, disabled, options = [], icon: Icon }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(!open);
  };

  const selected = options.find(o => String(o.id) === String(value));
  const hasVal = Boolean(value);
  const active = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow  = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none" }} className="dc-field-wrap">
      <div onClick={handleTriggerClick}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor + " !important",
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`, boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
          {selected?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
          {Icon && <Icon size={14} />}
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}</label>

      {open && !disabled && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 && <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>}
            {options.map(opt => (
              <li key={opt.id} className={`dc-opt${String(value) === String(opt.id) ? " selected" : ""}`}
                style={{
                  padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                  color: String(value) === String(opt.id) ? "#2563eb" : "#475569",
                  backgroundColor: String(value) === String(opt.id) ? "rgba(59,130,246,0.08)" : "#ffffff",
                  fontWeight: String(value) === String(opt.id) ? "600" : "500"
                }}
                onMouseDown={() => { onChange({ target: { name, value: String(opt.id) } }); setOpen(false); }}>
                {String(value) === String(opt.id) && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
                {opt.label}
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MultiSelectDropdown — Searchable Portal Multi-Select Dropdown Component
// ═══════════════════════════════════════════════════════════════════
function MultiSelectDropdown({ label, name, options, selectedIds, onChange, icon: Icon, disabled }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(!open);
  };

  const hasVal = selectedIds.length > 0;
  const active = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow  = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";
  const displayVal = hasVal ? options.filter(o => selectedIds.includes(o.id)).map(o => o.label).join(", ") : "";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none" }} className="dc-field-wrap">
      <div onClick={handleTriggerClick}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor + " !important",
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`, boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
          {displayVal || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
          {Icon && <Icon size={14} />}
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}</label>

      {open && !disabled && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <div style={{ display: "flex", borderBottom: "1px solid #edf2f7", background: "#f8fafc" }}>
            <button style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#2563eb", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onChange(options.map(o => o.id)); }}>Select All</button>
            <button style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onChange([]); }}>Clear</button>
          </div>
          <ul style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0", margin: 0, listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 && <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>}
            {options.map(opt => {
              const isSel = selectedIds.includes(opt.id);
              return (
                <li key={opt.id} className={`dc-opt${isSel ? " selected" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(isSel ? selectedIds.filter(i => i !== opt.id) : [...selectedIds, opt.id]);
                  }}>
                  <input type="checkbox" checked={isSel} readOnly style={{ accentColor: "#3B82F6", cursor: "pointer", marginRight: 8 }} />
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}