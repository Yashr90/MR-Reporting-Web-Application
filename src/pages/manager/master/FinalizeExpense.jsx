import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, AlertCircle, ChevronDown, Check,
  ChevronLeft, ChevronRight, Search, FileSpreadsheet,
  SlidersHorizontal
} from "lucide-react";
import api from "../../../services/api";

/* ─── Static Options ──────────────────────────────────────────────────────── */
const MONTH_OPTIONS = [
  { id: "1",  label: "January"   }, { id: "2",  label: "February"  },
  { id: "3",  label: "March"     }, { id: "4",  label: "April"     },
  { id: "5",  label: "May"       }, { id: "6",  label: "June"      },
  { id: "7",  label: "July"      }, { id: "8",  label: "August"    },
  { id: "9",  label: "September" }, { id: "10", label: "October"   },
  { id: "11", label: "November"  }, { id: "12", label: "December"  },
];

const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => {
  const y = String(2015 + i);
  return { id: y, label: y };
});

const TYPE_OPTIONS = [
  { id: "state",       label: "State"       },
  { id: "headquarter", label: "Headquarter" },
];

const STATUS_OPTIONS = [
  { id: "active",   label: "Active"   },
  { id: "inactive", label: "Inactive" },
];

/* ─── Premium Design Styles (matches SubmitDcr / MRDoctorCreation / MRAreaCreation) */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fe-wrap {
    font-family: 'Inter', sans-serif;
    width: 100%;
    padding-bottom: 32px;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  .dc-card {
    background: #ffffff !important;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: isolate;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    position: relative;
    overflow: visible !important;
    margin-bottom: 24px;
  }

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
    width: 34px; height: 34px; border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 8px rgba(37,99,235,0.25);
    flex-shrink: 0;
  }

  .dc-body {
    padding: 20px 28px 24px;
    background: #ffffff !important;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    overflow: visible !important;
  }

  .dc-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px 16px;
    align-items: end;
    margin-bottom: 16px;
  }
  @media(max-width:1200px){ .dc-grid-4{ grid-template-columns: repeat(3,1fr); } }
  @media(max-width:900px){  .dc-grid-4{ grid-template-columns: repeat(2,1fr); gap:20px; } }
  @media(max-width:640px){  .dc-grid-4{ grid-template-columns: 1fr; gap:20px; }
    .dc-body{ padding:20px 16px; } .dc-header{ padding:20px 16px 12px; } }

  /* ── Radio group (matching reference files) ── */
  .dc-radio-group {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 20px; padding: 12px 20px;
    background: #f8fafc; border-radius: 10px; border: 1px solid #edf2f7;
  }
  .dc-radio-label {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; font-size: 13.5px; font-weight: 500;
  }
  .dc-radio-label.disabled { cursor: not-allowed; opacity: 0.6; }
  .dc-radio-circle {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid #cbd5e1;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  /* BLUE radio buttons as requested */
  .dc-radio-circle.checked { border-color: #2563eb; background: rgba(37,99,235,0.08); }
  .dc-radio-circle.checked::after {
    content: ''; width: 8px; height: 8px;
    border-radius: 50%; background: #2563eb;
  }

  /* ── Bottom radio pair (Approved / Not Approved) ── */
  .fe-approval-radio-group {
    display: flex; flex-direction: column; gap: 10px; margin-top: 4px;
  }
  .fe-approval-radio-label {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; font-size: 13px; font-weight: 500; color: #374151;
  }
  .fe-approval-radio-circle {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid #2563eb;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }
  .fe-approval-radio-circle.checked { background: rgba(37,99,235,0.08); }
  .fe-approval-radio-circle.checked::after {
    content: ''; width: 7px; height: 7px;
    border-radius: 50%; background: #2563eb;
  }

  /* ── Submit Button ── */
  .dc-submit-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 24px; border-radius: 8px; font-size: 14px;
    font-weight: 600; border: none; cursor: pointer;
    background: #2563eb !important; color: #fff !important;
    box-shadow: 0 4px 14px rgba(37,99,235,0.3);
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    height: 40px; justify-content: center; width: 100%;
  }
  .dc-submit-btn:hover:not(:disabled) {
    background: #1d4ed8 !important; transform: translateY(-1px);
  }
  .dc-submit-btn:disabled {
    background: #e2e8f0 !important; color: #94a3b8 !important;
    cursor: not-allowed; box-shadow: none;
  }

  /* ── Table ── */
  .ucr-table-container {
    border: 1px solid #edf2f7; border-radius: 12px;
    overflow-x: auto; background: #ffffff !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
    margin-bottom: 16px; -webkit-overflow-scrolling: touch;
  }
  .ucr-table-container::-webkit-scrollbar { height:8px; width:8px; }
  .ucr-table-container::-webkit-scrollbar-track { background:#f1f5f9; border-radius:100px; }
  .ucr-table-container::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:100px; border:2px solid #f1f5f9; }
  .ucr-table-container::-webkit-scrollbar-thumb:hover { background:#94a3b8; }

  .ucr-table { width:100%; border-collapse:collapse; font-size:13px; text-align:left; min-width:1400px; }
  .ucr-table thead { background: #2563eb; }
  .ucr-table th {
    padding:14px 16px; font-size:11px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.05em; color:#ffffff;
    border-bottom:1px solid #1d4ed8; border-right:1px solid rgba(255,255,255,0.15);
    white-space:nowrap;
  }
  .ucr-table th:last-child { border-right:none; }
  .ucr-table td {
    padding:12px 16px; color:#374151;
    border-bottom:1px solid #edf2f7; border-right:1px solid #edf2f7; font-weight:500;
  }
  .ucr-table td:last-child { border-right:none; }
  .ucr-table tbody tr:hover { background:#f8fafc; }

  .dc-pagination-btn {
    background-color:#cccccc; color:#ffffff; border:none;
    border-radius:6px; padding:8px 16px; font-size:13px; font-weight:700;
    cursor:pointer; transition:all 0.2s;
  }
  .dc-pagination-btn:hover:not(:disabled) { background-color:#b3b3b3; }
  .dc-pagination-btn:disabled { background-color:#e5e7eb; color:#9ca3af; cursor:not-allowed; }

  .ucr-field-wrap { display:flex; flex-direction:column; gap:4px; position:relative; }
  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;

/* ══════════════════════════════════════════════════════════════════════════ */
export default function FinalizeExpense() {

  /* ── Filter Panel ── */
  const [filterOpen, setFilterOpen] = useState(true);

  /* ── Selection mode: "hierarchical" | "geographical" — Hierarchical pre-selected */
  const [mode, setMode] = useState("hierarchical");

  /* ── API data ── */
  const [stateOptions,    setStateOptions]    = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  /* ── Filter fields — all start empty (no pre-inputs) ── */
  const [selectType,       setSelectType]       = useState("");
  const [selectStatus,     setSelectStatus]     = useState("");
  const [selectedMonth,    setSelectedMonth]    = useState("");
  const [selectedYear,     setSelectedYear]     = useState("");

  /* ── Conditional fields ── */
  const [selectedStates,   setSelectedStates]   = useState([]);  // multi  (type=state)
  const [selectedState,    setSelectedState]    = useState("");  // single (type=headquarter)
  const [selectedDistrict, setSelectedDistrict] = useState(""); // single (type=headquarter)

  /* ── Bottom approval radio ── */
  const [approvalFilter, setApprovalFilter] = useState(""); // "approved" | "not_approved" | ""

  /* ── Table ── */
  const [tableData,    setTableData]    = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError,   setTableError]   = useState("");
  const [showTable,    setShowTable]    = useState(false);
  const [validationErr,setValidationErr]= useState("");
  const [search,       setSearch]       = useState("");
  const [page,         setPage]         = useState(1);
  const PAGE_SIZE = 10;

  /* ── Fetch states on mount ── */
  useEffect(() => { fetchStates(); }, []);

  /* ── Fetch districts when state changes in headquarter mode ── */
  useEffect(() => {
    if (selectType === "headquarter" && selectedState) {
      fetchDistricts(selectedState);
      setSelectedDistrict("");
    } else {
      setDistrictOptions([]);
      setSelectedDistrict("");
    }
  }, [selectedState, selectType]);

  const fetchStates = async () => {
    try {
      let res;
      try { res = await api.get("/api/masters/states"); }
      catch { try { res = await api.get("/api/states"); }
              catch { res = await api.get("/api/manager/states"); } }
      const data = res.data?.data || res.data || [];
      setStateOptions(data.map(s => ({ id: String(s.id), label: s.state_name || s.stateName || s.name })));
    } catch { console.warn("Could not load states."); }
  };

  const fetchDistricts = async (stateId) => {
    try {
      let res;
      try { res = await api.get(`/api/masters/districts/by-states?stateIds=${stateId}`); }
      catch {
        try { res = await api.get(`/api/masters/districts?stateId=${stateId}`); }
        catch { try { res = await api.get(`/api/districts?stateId=${stateId}`); }
                catch { res = await api.get(`/api/manager/districts?stateId=${stateId}`); } }
      }
      const data = res.data?.data || res.data || [];
      setDistrictOptions(data.map(d => ({ id: String(d.id), label: d.district_name || d.districtName || d.name })));
    } catch { console.warn("Could not load districts."); }
  };

  /* ── Validation ── */
  const validate = () => {
    if (!selectType)    return "Select Type is required!!!";
    if (selectType === "state" && selectedStates.length === 0) return "Select State is required!!!";
    if (selectType === "headquarter") {
      if (!selectedState)    return "Select State is required!!!";
      if (!selectedDistrict) return "Select District is required!!!";
    }
    if (!selectStatus) return "Select Status is required!!!";
    if (!selectedMonth) return "Month is required!!!";
    if (!selectedYear)  return "Year is required!!!";
    return "";
  };

  /* ── Generate Report ── */
  const handleGenerateReport = async (isRefresh = false) => {
    const err = validate();
    if (err) { setValidationErr(err); return; }
    setValidationErr("");
    if (!isRefresh) {
      setTableLoading(true); setShowTable(true);
      setTableData([]); setTableError(""); setPage(1); setSearch("");
    }
    const params = new URLSearchParams();
    params.append("type",   selectType);
    params.append("status", selectStatus);
    params.append("month",  selectedMonth);
    params.append("year",   selectedYear);
    params.append("mode",   mode);
    if (approvalFilter) params.append("approval", approvalFilter);
    if (selectType === "state") {
      selectedStates.forEach(id => params.append("stateIds", id));
    } else {
      params.append("stateId",    selectedState);
      params.append("districtId", selectedDistrict);
    }
    try {
      let res;
      try { res = await api.get(`/api/manager/finalize-expense?${params.toString()}`); }
      catch { try { res = await api.get(`/api/finalize-expense?${params.toString()}`); }
              catch { res = await api.get(`/api/manager/expenses/finalize?${params.toString()}`); } }
      const data = res.data?.data || res.data || [];
      setTableData(Array.isArray(data) ? data : []);
    } catch (e) {
      setTableError(e.response?.data?.message || "Failed to load expense records. Please try again.");
    } finally { setTableLoading(false); }
  };

  /* ── Export ── */
  const handleExportExcel = () => {
    if (!tableData.length) return;
    const headers = ["S.No.", "State Name", "Headquarter Name", "Name", "Employee Code",
                     "Division", "Designation", "Status", "Month", "Year", "Finalized", "Finalized Date"];
    const rows = tableData.map((r, i) => [
      i + 1,
      `"${r.stateName || r.state_name || "—"}"`,
      `"${r.hqName || r.headquarterName || "—"}"`,
      `"${r.name || r.employeeName || "—"}"`,
      `"${r.employeeCode || r.employee_code || "—"}"`,
      `"${r.division || "—"}"`,
      `"${r.designation || r.designationName || "—"}"`,
      `"${r.status || "—"}"`,
      `"${r.month || selectedMonth}"`,
      `"${r.year || selectedYear}"`,
      `"${r.finalized === true || r.finalized === "true" ? "Yes" : "No"}"`,
      `"${r.finalizedDate || r.finalized_date || "—"}"`,
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.setAttribute("download", `Finalize_Expense_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const filtered = tableData.filter(r =>
    !search || Object.values(r).some(v => String(v ?? "").toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isSubmitDisabled =
    tableLoading || !selectType || !selectStatus || !selectedMonth || !selectedYear ||
    (selectType === "state" && selectedStates.length === 0) ||
    (selectType === "headquarter" && (!selectedState || !selectedDistrict));

  /* ══ RENDER ══════════════════════════════════════════════════════════════ */
  return (
    <div className="fe-wrap">
      <style>{STYLES}</style>

      {/* ── Filter Card ── */}
      <div className="dc-card">
        <div className="dc-header">
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <SlidersHorizontal size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Finalize Expense
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Generate and finalize monthly expense reports
              </p>
            </div>
          </div>

          {/* Filter Toggle — BLUE */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
            <button
              type="button"
              onClick={() => setFilterOpen(p => !p)}
              style={{
                width: 44, height: 22, borderRadius: 100,
                position: "relative", cursor: "pointer", border: "none",
                transition: "all 0.2s",
                background: filterOpen ? "#bfdbfe" : "#cbd5e1",
                outline: "none"
              }}
            >
              <div style={{
                width: 16, height: 16,
                background: filterOpen ? "#2563eb" : "#fff",
                borderRadius: "50%", position: "absolute", top: 3,
                left: filterOpen ? 25 : 3,
                transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }} />
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="dc-body">

            {/* ── Mode Radio — Geographical locked/disabled, Hierarchical default selected ── */}
            <div className="dc-radio-group">
              <span className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginRight: 8 }}>
                Selection Mode:
              </span>

              {/* Geographical — LOCKED, cannot be selected */}
              <div className="dc-radio-label disabled" title="Selection locked to Hierarchical" style={{ cursor: "not-allowed", opacity: 0.5, userSelect: "none" }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: "2px solid #cbd5e1",
                  background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }} />
                <span className="ucr-brand" style={{ color: "#94a3b8", fontWeight: 500 }}>
                  Geographical
                </span>
              </div>

              {/* Hierarchical — always selected, locked */}
              <div className="dc-radio-label" style={{ cursor: "default", userSelect: "none" }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: "2px solid #2563eb",
                  background: "rgba(37,99,235,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
                </div>
                <span className="ucr-brand" style={{ color: "#1e293b", fontWeight: 700 }}>
                  Hierarchical
                </span>
              </div>

            </div>

            {/* ── Main Dropdowns Grid ── */}
            <div className="dc-grid-4">

              {/* SELECT TYPE */}
              <div>
                <SingleDropdown
                  label="SELECT TYPE *"
                  value={selectType}
                  onSelect={(v) => {
                    setSelectType(v);
                    setSelectedStates([]); setSelectedState(""); setSelectedDistrict("");
                  }}
                  options={TYPE_OPTIONS}
                />
              </div>

              {/* SELECT STATE — multi-select when type=state */}
              {selectType === "state" && (
                <div>
                  <MultiSelectDropdown
                    label="SELECT STATE *"
                    options={stateOptions}
                    selectedIds={selectedStates}
                    onChange={setSelectedStates}
                  />
                </div>
              )}

              {/* SELECT STATE — single when type=headquarter */}
              {selectType === "headquarter" && (
                <div>
                  <SingleDropdown
                    label="SELECT STATE *"
                    value={selectedState}
                    onSelect={setSelectedState}
                    options={stateOptions}
                  />
                </div>
              )}

              {/* SELECT DISTRICT — only for headquarter */}
              {selectType === "headquarter" && (
                <div>
                  <SingleDropdown
                    label="SELECT DISTRICT *"
                    value={selectedDistrict}
                    onSelect={setSelectedDistrict}
                    options={districtOptions}
                    disabled={!selectedState}
                  />
                </div>
              )}

              {/* SELECT STATUS */}
              <div>
                <SingleDropdown
                  label="SELECT STATUS *"
                  value={selectStatus}
                  onSelect={setSelectStatus}
                  options={STATUS_OPTIONS}
                />
              </div>

              {/* SELECT MONTH */}
              <div>
                <SingleDropdown
                  label="SELECT MONTH *"
                  value={selectedMonth}
                  onSelect={setSelectedMonth}
                  options={MONTH_OPTIONS}
                />
              </div>

              {/* SELECT YEAR */}
              <div>
                <SingleDropdown
                  label="SELECT YEAR *"
                  value={selectedYear}
                  onSelect={setSelectedYear}
                  options={YEAR_OPTIONS}
                />
              </div>

              {/* Generate Report Button */}
              <div style={{ marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => handleGenerateReport(false)}
                  disabled={isSubmitDisabled}
                  className="dc-submit-btn"
                  style={{
                    background: isSubmitDisabled ? "#e2e8f0" : "#2563eb",
                    color: isSubmitDisabled ? "#94a3b8" : "#fff",
                    boxShadow: isSubmitDisabled ? "none" : "0 4px 14px rgba(37,99,235,0.3)",
                    cursor: isSubmitDisabled ? "not-allowed" : "pointer"
                  }}
                >
                  {tableLoading
                    ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} />
                    : <Check size={14} />}
                  Generate Report
                </button>
              </div>
            </div>

            {/* ── Approval Radio Buttons (below the grid) ── */}
            <div className="fe-approval-radio-group" style={{ marginTop: 8 }}>
              <label className="fe-approval-radio-label" onClick={() => setApprovalFilter(f => f === "approved" ? "" : "approved")}>
                <div className={`fe-approval-radio-circle ${approvalFilter === "approved" ? "checked" : ""}`} />
                <span>* <span style={{ color: "#2563eb", fontWeight: 600 }}>Approved</span> Employee</span>
              </label>
              <label className="fe-approval-radio-label" onClick={() => setApprovalFilter(f => f === "not_approved" ? "" : "not_approved")}>
                <div className={`fe-approval-radio-circle ${approvalFilter === "not_approved" ? "checked" : ""}`} />
                <span>* <span style={{ color: "#2563eb", fontWeight: 600 }}>Not Approved</span> Employee</span>
              </label>
            </div>

            {/* Validation error */}
            {validationErr && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: "#ef4444", marginTop: 16 }}>
                <AlertCircle size={14} /> {validationErr}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Results Table Card ── */}
      {showTable && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc", borderBottom: "1px solid #edf2f7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
                Expense Records
              </h2>
              {!tableLoading && !tableError && (
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                  ({filtered.length} records)
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Search Records..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  style={{
                    height: 36, padding: "0 12px 0 32px", borderRadius: 8,
                    border: "1.5px solid #d1d5db", fontSize: 12, color: "#111827",
                    outline: "none", width: 180, fontWeight: 600, background: "#fff", transition: "all 0.15s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e  => e.target.style.borderColor = "#d1d5db"}
                />
              </div>

              {/* Export */}
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={filtered.length === 0}
                style={{
                  height: 38, width: 38, borderRadius: 8,
                  background: "#eff6ff", border: "1px solid #bfdbfe",
                  color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.15s"
                }}
                title="Export to Excel"
              >
                <FileSpreadsheet size={16} />
              </button>
            </div>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            {tableLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 10, fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                <Loader2 size={20} style={{ color: "#2563eb", animation: "ucr-spin 1s linear infinite" }} />
                Loading expense records...
              </div>
            ) : tableError ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 8, fontSize: 13, fontWeight: 700, color: "#ef4444" }}>
                <AlertCircle size={15} /> {tableError}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", fontSize: 13, fontWeight: 600, color: "#9ca3af", fontStyle: "italic" }}>
                No records found.
              </div>
            ) : (
              <>
                <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
                  <table className="ucr-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60, textAlign: "center" }}>#</th>
                        <th>State Name</th>
                        <th>Headquarter Name</th>
                        <th>Name</th>
                        <th>Employee Code</th>
                        <th>Division</th>
                        <th>Designation</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center" }}>Finalized</th>
                        <th>Finalized Date</th>
                        <th>Month</th>
                        <th>Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, ri) => {
                        const globalIdx = (page - 1) * PAGE_SIZE + ri + 1;
                        const isFinalized = row.finalized === true || row.finalized === "true" || row.finalized === "Yes";
                        return (
                          <tr key={ri}>
                            <td style={{ textAlign: "center", color: "#64748b" }}>{globalIdx}</td>
                            <td style={{ fontWeight: 700, color: "#1e293b" }}>{row.stateName || row.state_name || "—"}</td>
                            <td>{row.hqName || row.headquarterName || "—"}</td>
                            <td style={{ fontWeight: 600 }}>{row.name || row.employeeName || "—"}</td>
                            <td style={{ fontFamily: "monospace" }}>{row.employeeCode || row.employee_code || "—"}</td>
                            <td>{row.division || "—"}</td>
                            <td>{row.designation || row.designationName || "—"}</td>
                            <td>
                              <span style={{
                                padding: "4px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                background: row.status === "active" || row.status === "Active" ? "#eff6ff" : "#f3f4f6",
                                color: row.status === "active" || row.status === "Active" ? "#1d4ed8" : "#4b5563"
                              }}>
                                {row.status || "—"}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span style={{
                                padding: "4px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                background: isFinalized ? "#f0fdf4" : "#fef2f2",
                                color: isFinalized ? "#16a34a" : "#dc2626"
                              }}>
                                {isFinalized ? "Yes" : "No"}
                              </span>
                            </td>
                            <td>{row.finalizedDate || row.finalized_date || "—"}</td>
                            <td>{row.month || selectedMonth}</td>
                            <td>{row.year  || selectedYear}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button type="button" disabled={page === 1} onClick={() => setPage(1)} className="dc-pagination-btn">First</button>
                    <button type="button" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="dc-pagination-btn" style={{ padding: "8px 12px" }}>
                      <ChevronLeft size={13} />
                    </button>
                    <span style={{ padding: "0 12px", display: "flex", alignItems: "center", fontSize: 12, fontWeight: 700, color: "#2563eb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Page {page} of {totalPages}
                    </span>
                    <button type="button" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="dc-pagination-btn" style={{ padding: "8px 12px" }}>
                      <ChevronRight size={13} />
                    </button>
                    <button type="button" disabled={page === totalPages} onClick={() => setPage(totalPages)} className="dc-pagination-btn">Last</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SingleDropdown Component ──────────────────────────────────────────── */
function SingleDropdown({ label, value, onSelect, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find(o => String(o.id ?? o.value) === String(value));
  const hasVal   = value !== "" && value !== null && value !== undefined;
  const active   = open || hasVal;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", marginTop: 8 }} className="ucr-field-wrap">
      <div
        onClick={() => !disabled && setOpen(p => !p)}
        style={{
          width: "100%", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px",
          border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db",
          borderRadius: 8,
          background: disabled ? "#f9fafb" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s", boxSizing: "border-box"
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: hasVal ? "#111827" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected ? selected.label : ""}
        </span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 11,
        top: active ? -8 : 10, fontSize: active ? 10 : 13, fontWeight: active ? 700 : 500,
        color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af",
        background: active ? "#fff" : "transparent", padding: active ? "0 4px" : "0",
        transition: "all 0.2s", textTransform: active ? "uppercase" : "none",
        letterSpacing: active ? "0.05em" : "normal"
      }}>
        {label}
      </label>

      {open && !disabled && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, maxHeight: 200, overflowY: "auto"
        }}>
          {options.length === 0
            ? <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div>
            : options.map(o => {
                const val = String(o.id ?? o.value);
                const isSel = val === String(value);
                return (
                  <div
                    key={val}
                    onClick={() => { onSelect(val); setOpen(false); }}
                    style={{
                      padding: "9px 12px", cursor: "pointer",
                      fontSize: 13, fontWeight: isSel ? 700 : 500,
                      color: isSel ? "#2563eb" : "#374151",
                      background: isSel ? "#eff6ff" : "transparent",
                      display: "flex", alignItems: "center", gap: 8, transition: "background 0.1s"
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                  >
                    {isSel && <Check size={13} style={{ color: "#2563eb", flexShrink: 0 }} />}
                    {o.label}
                  </div>
                );
              })
          }
        </div>
      )}
    </div>
  );
}

/* ─── MultiSelectDropdown Component ────────────────────────────────────── */
function MultiSelectDropdown({ label, options = [], selectedIds = [], onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (val) => {
    const s = String(val);
    onChange(selectedIds.includes(s) ? selectedIds.filter(x => x !== s) : [...selectedIds, s]);
  };

  const selectedLabels = options.filter(o => selectedIds.includes(String(o.id ?? o.value))).map(o => o.label).join(", ");
  const hasVal  = selectedIds.length > 0;
  const active  = open || hasVal;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", marginTop: 8 }} className="ucr-field-wrap">
      <div
        onClick={() => !disabled && setOpen(p => !p)}
        style={{
          width: "100%", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px",
          border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db",
          borderRadius: 8,
          background: disabled ? "#f9fafb" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s", boxSizing: "border-box"
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: hasVal ? "#111827" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>
          {selectedLabels || ""}
        </span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 11,
        top: active ? -8 : 10, fontSize: active ? 10 : 13, fontWeight: active ? 700 : 500,
        color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af",
        background: active ? "#fff" : "transparent", padding: active ? "0 4px" : "0",
        transition: "all 0.2s", textTransform: active ? "uppercase" : "none",
        letterSpacing: active ? "0.05em" : "normal"
      }}>
        {label}
      </label>

      {open && !disabled && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, maxHeight: 200, overflowY: "auto"
        }}>
          {options.length === 0
            ? <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div>
            : options.map(o => {
                const val   = String(o.id ?? o.value);
                const isSel = selectedIds.includes(val);
                return (
                  <div
                    key={val}
                    onClick={e => { e.stopPropagation(); toggle(val); }}
                    style={{
                      padding: "9px 12px", cursor: "pointer",
                      fontSize: 13, fontWeight: isSel ? 700 : 500,
                      color: isSel ? "#2563eb" : "#374151",
                      background: isSel ? "#eff6ff" : "transparent",
                      display: "flex", alignItems: "center", gap: 8, transition: "background 0.1s"
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{
                      width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                      border: isSel ? "none" : "1.5px solid #cbd5e1",
                      background: isSel ? "#2563eb" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {isSel && <Check size={10} style={{ color: "#fff", strokeWidth: 3 }} />}
                    </span>
                    {o.label}
                  </div>
                );
              })
          }
        </div>
      )}
    </div>
  );
}
