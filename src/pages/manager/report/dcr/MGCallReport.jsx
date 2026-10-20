import React, { useState, useEffect, useRef } from "react";
import {
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  FileSpreadsheet,
  SlidersHorizontal,
} from "lucide-react";
import api from "../../../../services/api";

/* ─── Static Options ──────────────────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];
const DESIGNATION_OPTIONS = [
  { id: "ASM", label: "ASM" },
  { id: "MR", label: "MR" },
];
/* ─── Design System – blue theme ───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  .mgcr-wrap { font-family:'Inter',sans-serif; width:100%; padding-bottom:32px; }
  .dc-card { background:#fff !important; border:1px solid #edf2f7; border-radius:16px;
             box-shadow:0 4px 20px rgba(0,0,0,0.03); margin-bottom:24px; overflow:visible !important; }
  .dc-header { padding:24px 28px 16px; background:#fff !important; display:flex;
               align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;
               border-radius:16px 16px 0 0 !important; }
  .dc-page-icon { width:34px; height:34px; border-radius:8px;
                 background:linear-gradient(135deg,#2563eb,#1d4ed8);
                 display:flex; align-items:center; justify-content:center;
                 box-shadow:0 3px 8px rgba(37,99,235,0.25); }
  .dc-body { padding:20px 28px 24px; background:#fff !important;
             border-bottom-left-radius:16px; border-bottom-right-radius:16px; }
  .dc-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:18px 16px;
               align-items:end; margin-bottom:16px; }
  @media(max-width:1200px){ .dc-grid-4{grid-template-columns:repeat(3,1fr);} }
  @media(max-width:900px){ .dc-grid-4{grid-template-columns:repeat(2,1fr); gap:20px;} }
  @media(max-width:640px){ .dc-grid-4{grid-template-columns:1fr; gap:20px;}
                            .dc-body{padding:20px 16px;}
                            .dc-header{padding:20px 16px 12px;} }
  .dc-radio-group { display:flex; align-items:center; gap:20px; margin-bottom:20px;
                    padding:12px 20px; background:#f8fafc; border-radius:10px;
                    border:1px solid #edf2f7; }
  .dc-radio-label { display:flex; align-items:center; gap:8px; cursor:pointer;
                    font-size:13.5px; font-weight:500; }
  .dc-radio-label.disabled { cursor:not-allowed; opacity:0.5; }
  .dc-submit-btn { display:inline-flex; align-items:center; gap:8px;
                   padding:10px 24px; border-radius:8px; font-size:14px;
                   font-weight:600; border:none; cursor:pointer;
                   background:#2563eb !important; color:#fff !important;
                   box-shadow:0 4px 14px rgba(37,99,235,0.3); transition:all 0.2s;
                   font-family:'Plus Jakarta Sans',sans-serif; height:40px;
                   justify-content:center; width:100%; }
  .dc-submit-btn:hover:not(:disabled){ background:#1d4ed8 !important; transform:translateY(-1px); }
  .dc-submit-btn:disabled{ background:#e2e8f0 !important; color:#94a3b8 !important;
                           cursor:not-allowed; box-shadow:none; }
  .ucr-table-container { border:1px solid #edf2f7; border-radius:12px; overflow-x:auto;
                         background:#fff !important; box-shadow:0 2px 12px rgba(0,0,0,0.01);
                         margin-bottom:16px; }
  .ucr-table { width:100%; border-collapse:collapse; font-size:13px; text-align:left;
               min-width:1200px; }
  .ucr-table thead { background:#2563eb; }
  .ucr-table th { padding:14px 16px; font-size:11px; font-weight:700;
                  text-transform:uppercase; letter-spacing:0.05em; color:#fff;
                  border-bottom:1px solid #1d4ed8; border-right:1px solid rgba(255,255,255,0.15);
                  white-space:nowrap; }
  .ucr-table th:last-child{border-right:none;}
  .ucr-table td { padding:12px 16px; color:#374151; border-bottom:1px solid #edf2f7;
                  border-right:1px solid #edf2f7; font-weight:500; }
  .ucr-table td:last-child{border-right:none;}
  .ucr-table tbody tr:hover{background:#f8fafc;}
  .dc-pagination-btn { background:#cccccc; color:#fff; border:none; border-radius:6px;
                        padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer;
                        transition:all 0.2s; }
  .dc-pagination-btn:hover:not(:disabled){background:#b3b3b3;}
  .dc-pagination-btn:disabled{background:#e5e7eb;color:#9ca3af;cursor:not-allowed;}
  .ucr-field-wrap { display:flex; flex-direction:column; gap:4px; position:relative; }
  /* Calendar (reuse from SubmitDCR) */
  .dc-cal { background:#fff; border-radius:16px; overflow:hidden; padding:16px;
            animation:dc-cal-pop 0.18s cubic-bezier(0.16,1,0.3,1); }
  @keyframes dc-cal-pop{from{opacity:0;transform:translateY(4px) scale(0.98);}to{opacity:1;transform:translateY(0) scale(1);}}
  .dc-cal-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px;}
  .dc-cal-nav-btn{width:28px;height:28px;border-radius:8px;background:#fff;border:1px solid #e2e8f0;
                 display:flex;align-items:center;justify-content:center;cursor:pointer;color:#475569;
                 transition:all 0.15s ease;}
  .dc-cal-nav-btn:hover{background:#f1f5f9;color:#1e293b;border-color:#cbd5e1;}
  .dc-cal-select-group{display:flex;align-items:center;gap:4px;}
  .dc-cal-select-wrap{position:relative;display:flex;align-items:center;}
  .dc-cal-native-select{appearance:none;-webkit-appearance:none;background:#f8fafc;color:#2563eb;
                        border:1px solid #e2e8f0;border-radius:8px;padding:4px 22px 4px 10px;
                        font-size:13px;font-weight:600;cursor:pointer;outline:none;
                        font-family:'Inter',sans-serif;transition:all 0.15s ease;}
  .dc-cal-native-select:hover{background:#eff6ff;border-color:#bfdbfe;}
  .dc-cal-weekday-grid { display:grid; grid-template-columns:repeat(7,1fr); text-align:center; margin-bottom:6px; }
  .dc-cal-weekday { font-size:11px; font-weight:600; color:#94a3b8; padding:4px 0; text-transform:uppercase; letter-spacing:0.02em; }
  .dc-cal-days-grid { display:grid; grid-template-columns:repeat(7,1fr); row-gap:4px; column-gap:4px; text-align:center; }
  .dc-cal-day-cell { width:100%; aspect-ratio:1; border-radius:50%; border:none; font-size:13px; font-weight:500; cursor:pointer; background:transparent; color:#334155; display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; transition:all 0.12s cubic-bezier(0.16,1,0.3,1); }
  .dc-cal-day-cell:hover:not(.selected){background:#f1f5f9;color:#0f172a;}
  .dc-cal-day-cell.today:not(.selected){color:#3B82F6;font-weight:700;background:rgba(59,130,246,0.08);}
  .dc-cal-day-cell.selected{background:#3B82F6 !important;color:#ffffff !important;font-weight:600;box-shadow:0 4px 10px rgba(59,130,246,0.3);}
`;

export default function MGCallReport() {
  // ── Filter panel ──
  const [filterOpen, setFilterOpen] = useState(true);

  // ── Data sources ──
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [designationOptions] = useState(DESIGNATION_OPTIONS);
  const [statusOptions] = useState(STATUS_OPTIONS);

  // ── Filter fields (no pre‑inputs) ──
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState({ asm: "", mr: "" });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ── Table handling ──
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [validationErr, setValidationErr] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Load static lists ──
  useEffect(() => fetchStates(), []);
  useEffect(() => {
    if (selectedState) fetchDistricts(selectedState);
    else {
      setDistrictOptions([]);
      setSelectedDistricts([]);
    }
  }, [selectedState]);
  useEffect(() => fetchEmployees(), []);

  const fetchStates = async () => {
    try {
      const res = await api.get("/api/masters/states");
      const data = res.data?.data || res.data || [];
      setStateOptions(data.map(s => ({ id: String(s.id), label: s.state_name || s.name })));
    } catch (e) { console.warn("States load failed", e); }
  };
  const fetchDistricts = async stateId => {
    try {
      const res = await api.get(`/api/masters/districts/by-states?stateIds=${stateId}`);
      const data = res.data?.data || res.data || [];
      setDistrictOptions(data.map(d => ({ id: String(d.id), label: d.district_name || d.name })));
    } catch (e) { console.warn("Districts load failed", e); }
  };
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/manager/employees");
      const data = res.data?.data || res.data || [];
      setEmployeeOptions(data.map(e => ({ id: String(e.id), label: e.employeeName || e.name || e.employee_code || e.code })));
    } catch (e) { console.warn("Employees load failed", e); }
  };

  const validate = () => {
    if (!selectedState) return "Select State is required!";
    if (selectedDistricts.length === 0) return "Select at least one District!";
    if (selectedEmployees.length === 0) return "Select at least one Employee!";
    if (!selectedDesignations.asm || !selectedDesignations.mr) return "Select both ASM and MR designations!";
    if (!selectedStatus) return "Select Status!";
    if (!fromDate || !toDate) return "Select From & To dates!";
    return "";
  };

  const handleGenerate = async () => {
    const err = validate();
    if (err) { setValidationErr(err); return; }
    setValidationErr("");
    setTableLoading(true);
    setShowTable(true);
    setTableData([]);
    setPage(1);
    const params = new URLSearchParams();
    params.append("stateId", selectedState);
    selectedDistricts.forEach(id => params.append("districtIds", id));
    selectedEmployees.forEach(id => params.append("employeeIds", id));
    params.append("asmDesignation", selectedDesignations.asm);
    params.append("mrDesignation", selectedDesignations.mr);
    params.append("status", selectedStatus);
    params.append("fromDate", fromDate);
    params.append("toDate", toDate);
    try {
      const res = await api.get(`/api/manager/reports/call?${params.toString()}`);
      const data = res.data?.data || res.data || [];
      setTableData(Array.isArray(data) ? data : []);
    } catch (e) {
      setTableError(e.response?.data?.message || "Failed to load report");
    } finally { setTableLoading(false); }
  };

  // ── Table helpers ──
  const filtered = tableData.filter(r =>
    !search || Object.values(r).some(v => String(v ?? "").toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isSubmitDisabled =
    tableLoading || !selectedState || selectedDistricts.length === 0 || selectedEmployees.length === 0 ||
    !selectedDesignations.asm || !selectedDesignations.mr || !selectedStatus || !fromDate || !toDate;

  return (
    <div className="mgcr-wrap">
      <style>{STYLES}</style>

      {/* ── Filter Card ── */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon"><SlidersHorizontal size={16} color="#fff" /></div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Call Report</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Generate employee‑wise call statistics</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
            <button type="button" onClick={() => setFilterOpen(p => !p)}
              style={{ width: 44, height: 22, borderRadius: 100, position: "relative", cursor: "pointer",
                       border: "none", background: filterOpen ? "#bfdbfe" : "#cbd5e1", outline: "none", transition: "all 0.2s" }}>
              <div style={{ width: 16, height: 16, background: filterOpen ? "#2563eb" : "#fff", borderRadius: "50%",
                           position: "absolute", top: 3, left: filterOpen ? 25 : 3, transition: "all 0.2s",
                           boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="dc-body">
            {/* Radio group */}
            <div className="dc-radio-group">
              <span className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginRight: 8 }}>Selection Mode:</span>
              <div className="dc-radio-label disabled" title="Locked to Hierarchical" style={{ cursor: "not-allowed", opacity: 0.5 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #cbd5e1", background: "transparent" }} />
                <span className="ucr-brand" style={{ color: "#94a3b8", fontWeight: 500 }}>Geographical</span>
              </div>
              <div className="dc-radio-label" style={{ cursor: "default" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #2563eb", background: "rgba(37,99,235,0.08)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
                </div>
                <span className="ucr-brand" style={{ color: "#1e293b", fontWeight: 700 }}>Hierarchical</span>
              </div>
            </div>

            <div className="dc-grid-4">
              {/* State */}
              <div>
                <SingleDropdown label="SELECT STATE *" value={selectedState}
                  onSelect={v => { setSelectedState(v); setSelectedDistricts([]); setSelectedEmployees([]); }}
                  options={stateOptions} />
              </div>
              {/* District */}
              <div>
                <MultiSelectDropdown label="SELECT DISTRICT *" options={districtOptions}
                  selectedIds={selectedDistricts} onChange={setSelectedDistricts} disabled={!selectedState} />
              </div>
              {/* Employee */}
              <div>
                <MultiSelectDropdown label="SELECT EMPLOYEE *" options={employeeOptions}
                  selectedIds={selectedEmployees} onChange={setSelectedEmployees} disabled={selectedDistricts.length === 0} />
              </div>
              {/* ASM Designation */}
              <div>
                <SingleDropdown label="SELECT ASM DESIGNATION" value={selectedDesignations.asm}
                  onSelect={v => setSelectedDesignations(d => ({ ...d, asm: v }))} options={designationOptions} />
              </div>
              {/* MR Designation */}
              <div>
                <SingleDropdown label="SELECT MR DESIGNATION" value={selectedDesignations.mr}
                  onSelect={v => setSelectedDesignations(d => ({ ...d, mr: v }))} options={designationOptions} />
              </div>
              {/* Status */}
              <div>
                <SingleDropdown label="SELECT STATUS *" value={selectedStatus}
                  onSelect={setSelectedStatus} options={statusOptions} />
              </div>
              {/* From Date */}
              <div>
                <div className="ucr-field-wrap" style={{ marginTop: 8 }}>
                  <label style={{ position: "absolute", left: 10, top: -8, fontSize: 10, fontWeight: 700,
                                 color: "#2563eb", background: "#fff", padding: "0 4px", transition: "all 0.2s",
                                 textTransform: "uppercase", letterSpacing: "0.05em" }}>FROM DATE *</label>
                  <FloatingDatePicker date={fromDate} setDate={setFromDate} />
                </div>
              </div>
              {/* To Date */}
              <div>
                <div className="ucr-field-wrap" style={{ marginTop: 8 }}>
                  <label style={{ position: "absolute", left: 10, top: -8, fontSize: 10, fontWeight: 700,
                                 color: "#2563eb", background: "#fff", padding: "0 4px", transition: "all 0.2s",
                                 textTransform: "uppercase", letterSpacing: "0.05em" }}>TO DATE *</label>
                  <FloatingDatePicker date={toDate} setDate={setToDate} />
                </div>
              </div>
              {/* Generate button */}
              <div style={{ marginTop: 6 }}>
                <button type="button" onClick={handleGenerate} disabled={isSubmitDisabled}
                  className="dc-submit-btn" style={{ background: isSubmitDisabled ? "#e2e8f0" : "#2563eb", color: isSubmitDisabled ? "#94a3b8" : "#fff" }}>
                  {tableLoading ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Check size={14} />}
                  Generate Report
                </button>
              </div>
            </div>

            {validationErr && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: "#ef4444", marginTop: 12 }}>
                <AlertCircle size={14} /> {validationErr}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Results Table ── */}
      {showTable && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc", borderBottom: "1px solid #edf2f7" }}>
            <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Call Report Results</h2>
            {tableError ? null : <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>({filtered.length} records)</span>}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  style={{ height: 36, padding: "0 12px 0 32px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 12,
                           color: "#111827", outline: "none", width: 180, fontWeight: 600, background: "#fff" }} />
              </div>
              <button type="button" onClick={() => {}} disabled={filtered.length === 0}
                style={{ height: 38, width: 38, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb",
                         display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Export Excel">
                <FileSpreadsheet size={16} />
              </button>
            </div>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            {tableLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 10, fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                <Loader2 size={20} style={{ color: "#2563eb", animation: "ucr-spin 1s linear infinite" }} /> Loading report...
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
                        <th>District Name</th>
                        <th>Name</th>
                        <th>Employee Code</th>
                        <th>Designation</th>
                        <th>DOJ</th>
                        <th>January 1970</th>
                        <th>Total Working Day</th>
                        <th>Field Working Days</th>
                        <th>Leave</th>
                        <th>Total Doctors</th>
                        <th>Listed Doctors Seen</th>
                        <th>Doctor Met Once</th>
                        <th>Met Twice & Above</th>
                        <th>Total Doctor Calls</th>
                        <th>Missed Doctor</th>
                        <th>Repeated Call</th>
                        <th>Doctor Coverage</th>
                        <th>Doctor Call Avg.</th>
                        <th>Missed (%)</th>
                        <th>Repeat (%)</th>
                        <th>Total Vendors</th>
                        <th>Chemist Seen</th>
                        <th>Chemist Calls</th>
                        <th>Chemist Call Avg.</th>
                        <th>Stockist Seen</th>
                        <th>Total Stockist Calls</th>
                        <th>Stockist Call Avg.</th>
                        <th>Joint Working Days</th>
                        <th>JW Doctor Calls</th>
                        <th>JW Call Avg.</th>
                        <th>Chemist Coverage</th>
                        <th>Meeting</th>
                        <th>Transit</th>
                        <th>Holiday / Sunday</th>
                        <th>Induction</th>
                        <th>Admin Day</th>
                        <th>Strike</th>
                        <th>WFH Day</th>
                        <th>Total Doctor Call on WFH</th>
                        <th>Doctor call Avg. on WFH</th>
                        <th>Total Chemist Call on WFH</th>
                        <th>Chemist call Avg. on WFH</th>
                        <th>TP Deviation</th>
                        <th>Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, idx) => {
                        const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                        return (
                          <tr key={idx}>
                            <td style={{ textAlign: "center", color: "#64748b" }}>{globalIdx}</td>
                            <td>{row.stateName || "—"}</td>
                            <td>{row.districtName || "—"}</td>
                            <td>{row.employeeName || "—"}</td>
                            <td>{row.employeeCode || "—"}</td>
                            <td>{row.designation || "—"}</td>
                            <td>{row.doj || "—"}</td>
                            <td>{row.january1970 || "—"}</td>
                            <td>{row.totalWorkingDay || "—"}</td>
                            <td>{row.fieldWorkingDays || "—"}</td>
                            <td>{row.leave || "—"}</td>
                            <td>{row.totalDoctors || "—"}</td>
                            <td>{row.listedDoctorsSeen || "—"}</td>
                            <td>{row.doctorMetOnce || "—"}</td>
                            <td>{row.metTwiceAbove || "—"}</td>
                            <td>{row.totalDoctorCalls || "—"}</td>
                            <td>{row.missedDoctor || "—"}</td>
                            <td>{row.repeatedCall || "—"}</td>
                            <td>{row.doctorCoverage || "—"}</td>
                            <td>{row.doctorCallAvg || "—"}</td>
                            <td>{row.missedPct || "—"}</td>
                            <td>{row.repeatPct || "—"}</td>
                            <td>{row.totalVendors || "—"}</td>
                            <td>{row.chemistSeen || "—"}</td>
                            <td>{row.chemistCalls || "—"}</td>
                            <td>{row.chemistCallAvg || "—"}</td>
                            <td>{row.stockistSeen || "—"}</td>
                            <td>{row.totalStockistCalls || "—"}</td>
                            <td>{row.stockistCallAvg || "—"}</td>
                            <td>{row.jointWorkingDays || "—"}</td>
                            <td>{row.jwDoctorCalls || "—"}</td>
                            <td>{row.jwCallAvg || "—"}</td>
                            <td>{row.chemistCoverage || "—"}</td>
                            <td>{row.meeting || "—"}</td>
                            <td>{row.transit || "—"}</td>
                            <td>{row.holidaySunday || "—"}</td>
                            <td>{row.induction || "—"}</td>
                            <td>{row.adminDay || "—"}</td>
                            <td>{row.strike || "—"}</td>
                            <td>{row.wfhDay || "—"}</td>
                            <td>{row.doctorCallWfh || "—"}</td>
                            <td>{row.doctorAvgWfh || "—"}</td>
                            <td>{row.chemistCallWfh || "—"}</td>
                            <td>{row.chemistAvgWfh || "—"}</td>
                            <td>{row.tpDeviation || "—"}</td>
                            <td>{row.others || "—"}</td>
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
                    <button disabled={page === 1} onClick={() => setPage(1)} className="dc-pagination-btn">First</button>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="dc-pagination-btn" style={{ padding: "8px 12px" }}><ChevronLeft size={13} /></button>
                    <span style={{ padding: "0 12px", fontSize: 12, fontWeight: 700, color: "#2563eb" }}>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="dc-pagination-btn" style={{ padding: "8px 12px" }}><ChevronRight size={13} /></button>
                    <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="dc-pagination-btn">Last</button>
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

/* ────────────────────────────────────────────────────────────────────────────── */
/* Helper components – copied from other manager pages to keep UI consistent */

function SingleDropdown({ label, value, onSelect, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = options.find(o => String(o.id) === String(value));
  const hasVal = value !== "" && value !== null && value !== undefined;
  const active = open || hasVal;
  return (
    <div ref={ref} className="ucr-field-wrap" style={{ position: "relative", width: "100%", marginTop: 8 }}>
      <div onClick={() => !disabled && setOpen(p => !p)}
        style={{ width: "100%", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
                 border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db", borderRadius: 8,
                 background: disabled ? "#f9fafb" : "#fff", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: hasVal ? "#111827" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selected ? selected.label : ""}</span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </div>
      <label style={{ position: "absolute", left: 10, top: active ? -8 : 10, fontSize: active ? 10 : 13, fontWeight: active ? 700 : 500,
                       color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af", background: active ? "#fff" : "transparent",
                       padding: active ? "0 4px" : "0", transition: "all 0.2s", textTransform: active ? "uppercase" : "none",
                       letterSpacing: active ? "0.05em" : "normal" }}>{label}</label>
      {open && !disabled && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff",
                     border: "1.5px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, maxHeight: 200, overflowY: "auto" }}>
          {options.length === 0 ? (
            <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div>
          ) : (
            options.map(o => {
              const id = String(o.id);
              const isSel = id === String(value);
              return (
                <div key={id} onClick={() => { onSelect(id); setOpen(false); }}
                  style={{ padding: "9px 12px", cursor: "pointer", fontSize: 13, fontWeight: isSel ? 700 : 500,
                           color: isSel ? "#2563eb" : "#374151", background: isSel ? "#eff6ff" : "transparent",
                           display: "flex", alignItems: "center", gap: 8 }}>
                  {isSel && <Check size={13} style={{ color: "#2563eb" }} />}
                  {o.label}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function MultiSelectDropdown({ label, options = [], selectedIds = [], onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const active = open || selectedIds.length > 0;
  const selectedLabels = options.filter(o => selectedIds.includes(String(o.id))).map(o => o.label);
  return (
    <div ref={ref} className="ucr-field-wrap" style={{ position: "relative", width: "100%", marginTop: 8 }}>
      <div onClick={() => !disabled && setOpen(p => !p)}
        style={{ width: "100%", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
                 border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db", borderRadius: 8,
                 background: disabled ? "#f9fafb" : "#fff", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
        {selectedLabels.length === 0 ? (
          <span style={{ fontSize: 13, color: "#9ca3af" }}>Select…</span>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {selectedLabels.map((lbl, i) => (
              <div key={i} style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 6px", borderRadius: 4, fontSize: 12, fontWeight: 500 }}>{lbl}</div>
            ))}
          </div>
        )}
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </div>
      <label style={{ position: "absolute", left: 10, top: active ? -8 : 10, fontSize: active ? 10 : 13, fontWeight: active ? 700 : 500,
                       color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af", background: active ? "#fff" : "transparent",
                       padding: active ? "0 4px" : "0", transition: "all 0.2s", textTransform: active ? "uppercase" : "none",
                       letterSpacing: active ? "0.05em" : "normal" }}>{label}</label>
      {open && !disabled && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff",
                     border: "1.5px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, maxHeight: 250, overflowY: "auto" }}>
          {options.length === 0 ? (
            <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div>
          ) : (
            options.map(o => {
              const id = String(o.id);
              const isSel = selectedIds.includes(id);
              return (
                <div key={id} onClick={() => { if (isSel) onChange(selectedIds.filter(s => s !== id)); else onChange([...selectedIds, id]); }}
                  style={{ padding: "9px 12px", cursor: "pointer", fontSize: 13, fontWeight: isSel ? 700 : 500,
                           color: isSel ? "#2563eb" : "#374151", background: isSel ? "#eff6ff" : "transparent",
                           display: "flex", alignItems: "center", gap: 8 }}>
                  {isSel && <Check size={13} style={{ color: "#2563eb" }} />}
                  {o.label}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* Calendar component – identical to the one used in SubmitDCR but with date/setDate props */
function FloatingDatePicker({ date, setDate }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 260 });
  const [view, setView] = useState({ y: new Date().getFullYear(), m: new Date().getMonth() });
  const ref = useRef(null);
  const inputRef = useRef(null);

  const toggle = () => {
    if (!show) {
      const rect = inputRef.current?.getBoundingClientRect();
      if (rect) {
        setPos({
          top: rect.bottom + 4,
          left: rect.left,
          width: 260
        });
      }
    }
    setShow(p => !p);
  };

  const prevMonth = () => setView(v => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }));
  const nextMonth = () => setView(v => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }));

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = date ? new Date(date) : null;
  const firstDay = new Date(view.y, view.m, 1);
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const today = new Date();
  const todayStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const selStr = d => `${d}-${view.m + 1}-${view.y}`;
  const selectDay = d => {
    const iso = new Date(view.y, view.m, d).toISOString().split("T")[0];
    setDate(iso);
    setShow(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <input
        ref={inputRef}
        readOnly
        value={date ? new Date(date).toLocaleDateString("en-GB") : ""}
        placeholder="Select date"
        onClick={toggle}
        style={{
          width: "100%",
          height: 38,
          padding: "0 12px",
          border: "1.5px solid #d1d5db",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          color: "#111827",
          background: "#fff",
          cursor: "pointer",
        }}
      />
      {show && (
        <Portal top={pos.top} left={pos.left} width={pos.width} onClose={() => setShow(false)}>
          <div className="dc-cal">
            <div className="dc-cal-header">
              <button type="button" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); prevMonth(); }} className="dc-cal-nav-btn">
                <ChevronLeft size={14} />
              </button>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", textTransform: "capitalize" }}>
                {new Date(view.y, view.m).toLocaleString("default", { month: "long", year: "numeric" })}
              </div>
              <button type="button" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); nextMonth(); }} className="dc-cal-nav-btn">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="dc-cal-select-group">
              <div className="dc-cal-select-wrap">
                <select
                  value={view.m}
                  onChange={e => setView(v => ({ ...v, m: Number(e.target.value) }))}
                  className="dc-cal-native-select"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i} style={{ color: "#1e293b", background: "#fff" }}>
                      {new Date(0, i).toLocaleString("default", { month: "short" })}
                    </option>
                  ))}
                </select>
                <ChevronDown size={10} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#2563eb", pointerEvents: "none" }} />
              </div>
              <div className="dc-cal-select-wrap">
                <select
                  value={view.y}
                  onChange={e => setView(v => ({ ...v, y: Number(e.target.value) }))}
                  className="dc-cal-native-select"
                >
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map(y => (
                    <option key={y} value={y} style={{ color: "#1e293b", background: "#fff" }}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown size={10} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#2563eb", pointerEvents: "none" }} />
              </div>
            </div>
            <div className="dc-cal-weekday-grid">
              {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                <div key={d} className="dc-cal-weekday">
                  {d}
                </div>
              ))}
            </div>
            <div className="dc-cal-days-grid">
              {Array.from({ length: firstDow }).map((_, i) => (
                <div key={`e${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const ds = selStr(d);
                const isSel = date && ds === new Date(date).toLocaleDateString("en-GB");
                const isToday = ds === todayStr;
                return (
                  <button
                    key={d}
                    type="button"
                    onMouseDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectDay(d);
                    }}
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
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", () => onClose(), true);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top,
        left,
        width,
        zIndex: 99999,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
      }}
      className="dropdown-portal"
    >
      {children}
    </div>
  );
}
