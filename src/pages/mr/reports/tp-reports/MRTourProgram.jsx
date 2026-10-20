import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, AlertCircle, ChevronDown, Check,
  ChevronLeft, ChevronRight, Search, X, FileSpreadsheet,
  Printer, Map, Calendar as CalendarIcon, ChevronsLeft, ChevronsRight
} from "lucide-react";
import api from "../../../../services/api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MONTH_OPTIONS = [
  { id: "1", label: "January" },
  { id: "2", label: "February" },
  { id: "3", label: "March" },
  { id: "4", label: "April" },
  { id: "5", label: "May" },
  { id: "6", label: "June" },
  { id: "7", label: "July" },
  { id: "8", label: "August" },
  { id: "9", label: "September" },
  { id: "10", label: "October" },
  { id: "11", label: "November" },
  { id: "12", label: "December" }
];

const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => {
  const y = String(2015 + i);
  return { id: y, label: y };
});

const REPORT_TYPE_OPTIONS = [
  { id: "tp_deviation", label: "TP Deviation Report" },
  { id: "missed_area", label: "Missed Area Report" }
];

/* ─── Premium UI Design System Styles (Matching Reference Files) ────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dc-wrap {
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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
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
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(37,99,246,0.25);
    flex-shrink: 0;
  }

  .dc-body { 
    padding: 20px 28px 24px; 
    background: #ffffff !important; 
    border-bottom-left-radius: 16px; 
    border-bottom-right-radius: 16px;
    overflow: visible !important;
  }

  .ucr-grid-4 { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 18px 16px; 
    align-items: end;
  }

  @media(max-width: 1200px) {
    .ucr-grid-4 { grid-template-columns: repeat(3, 1fr); }
  }
  @media(max-width: 1024px) {
    .ucr-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  }
  @media(max-width: 640px) {
    .ucr-grid-4 { grid-template-columns: 1fr; gap: 20px; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
  }

  .ucr-table-container {
    border: 1px solid #edf2f7;
    border-radius: 12px;
    overflow-x: auto;
    background: #ffffff !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
    margin-bottom: 16px;
    -webkit-overflow-scrolling: touch;
  }

  .ucr-table-container::-webkit-scrollbar { height: 8px; width: 8px; }
  .ucr-table-container::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 100px; }
  .ucr-table-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 100px; border: 2px solid #f1f5f9; }
  .ucr-table-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; min-width: 1800px; }
  .ucr-table thead { background: #f8fafc; }
  .ucr-table th { 
    padding: 14px 16px; 
    font-size: 11px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    color: #64748b;
    border-bottom: 1px solid #edf2f7; 
    border-right: 1px solid #edf2f7;
    white-space: nowrap;
  }
  .ucr-table td { 
    padding: 12px 16px; 
    color: #475569; 
    border-bottom: 1px solid #f8fafc; 
    border-right: 1px solid #edf2f7;
    font-weight: 500; 
  }
  .ucr-table tbody tr:hover { background: #f8fafc; }

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
    height: 40px;
    justify-content: center;
    width: 100%;
  }
  .dc-submit-btn:hover:not(:disabled) {
    background: #1d4ed8 !important;
    transform: translateY(-1px);
  }
  .dc-submit-btn:disabled { background: #e2e8f0 !important; color: #94a3b8 !important; cursor: not-allowed; box-shadow: none; }

  .ucr-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ucr-zoom { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  
  @media print {
    body * { visibility: hidden; }
    #printable-table-card, #printable-table-card * { visibility: visible; }
    #printable-table-card { position: absolute; left: 0; top: 0; width: 100%; }
  }
`;

export default function MRTourprogram() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: "Swati", designation: "MR" });

  // Filters State (Ensured empty string defaults so no options are selected initially)
  const [viewFor, setViewFor] = useState("");
  const [reportType, setReportType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Table State
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [showTable, setShowTable] = useState(false);
  
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState("");
  const [validationErr, setValidationErr] = useState("");

  // Fetch MR Profile Info on component load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/mr/profile");
        const data = res.data?.data || res.data || {};
        setUserInfo({
          name: data.employeeName || data.name || "Swati",
          designation: data.designation || data.role || "MR"
        });
      } catch (err) {
        console.warn("Could not load dynamic profile, falling back to defaults.");
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    if (!viewFor) return "View For is required!!!";
    if (!reportType) return "Report Type is required!!!";
    if (!selectedMonth) return "Month is required!!!";
    if (!selectedYear) return "Year is required!!!";
    return "";
  };

  const handleGenerateReport = async () => {
    const err = validate();
    if (err) {
      setValidationErr(err);
      return;
    }
    setValidationErr("");
    setTableLoading(true);
    setShowTable(true);
    setTableData([]);
    setTableError("");
    setPage(1);
    setSearch("");

    const params = new URLSearchParams();
    params.append("mode", "self");
    params.append("type", viewFor);
    params.append("reportType", reportType);
    params.append("month", selectedMonth);
    params.append("year", selectedYear);

    try {
      let res;
      try {
        res = await api.get(`/api/mr/reports/tour-program-deviation?${params.toString()}`);
      } catch {
        try {
          res = await api.get(`/api/reports/tour-program-deviation?${params.toString()}`);
        } catch {
          try {
            res = await api.get(`/api/reports/tp-deviation?${params.toString()}`);
          } catch {
            res = await api.get(`/api/mr/reports/tp-deviation?${params.toString()}`);
          }
        }
      }
      const data = res.data?.data || res.data || [];
      setTableData(Array.isArray(data) ? data : []);
    } catch (e) {
      setTableError(e.response?.data?.message || "Failed to load report. Please try again.");
    } finally {
      setTableLoading(false);
    }
  };

  // Dynamic status counts calculated from tableData
  const noDeviationCount = tableData.filter(row => {
    const status = String(row.deviationStatus || row.status || row.deviation || "").toLowerCase();
    return status.includes("no deviation") || status === "nodeviation" || (!status && !row.deviation);
  }).length;

  const additionalCount = tableData.filter(row => {
    const status = String(row.deviationStatus || row.status || row.deviation || "").toLowerCase();
    return status.includes("additional") || status === "additionalvisited";
  }).length;

  const deviatedCount = tableData.filter(row => {
    const status = String(row.deviationStatus || row.status || row.deviation || "").toLowerCase();
    return status.includes("deviated") || status === "deviated" || status === "deviate";
  }).length;

  const filtered = tableData.filter(r =>
    !search || Object.values(r).some(v => String(v ?? "").toLowerCase().includes(search.toLowerCase()))
  );
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (!tableData.length) return;
    
    const csvContent = [
      ["S.No.", "Date", "DCR Punch Date", "Headquarter", "Planned Activity", "Planned Area", "Actual Area Worked", "Joint Work", "Working Activity", "Doctor Visit", "Chemist Visit", "Stockist Visit", "Deviation Status"].join(",")
    ];

    tableData.forEach((row, idx) => {
      const line = [
        idx + 1,
        `"${row.date || row.tpDate || "—"}"`,
        `"${row.dcrPunchDate || row.punchDate || row.dcrDate || "—"}"`,
        `"${row.headquarter || row.headquarterName || row.hqName || "—"}"`,
        `"${row.plannedActivity || row.activity || row.plannedActivityType || row.activityType || "—"}"`,
        `"${String(row.plannedArea || row.plannedAreas || "—").replace(/"/g, '""')}"`,
        `"${String(row.actualArea || row.actualAreas || row.actualAreaWorked || "—").replace(/"/g, '""')}"`,
        `"${row.jointWork || row.jointWorkWith || row.jointWorkManager || "—"}"`,
        `"${row.workingActivity || row.actualActivity || row.workingStatus || "—"}"`,
        row.doctorVisit ?? row.doctorVisitCount ?? row.doctorCalls ?? 0,
        row.chemistVisit ?? row.chemistVisitCount ?? row.chemistCalls ?? 0,
        row.stockistVisit ?? row.stockistVisitCount ?? row.stockistCalls ?? 0,
        `"${row.deviationStatus || row.status || row.deviation || "No Deviation"}"`
      ];
      csvContent.push(line.join(","));
    });

    const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tour_Program_Deviation_Report_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedMonthName = MONTH_OPTIONS.find(m => m.id === selectedMonth)?.label || "";

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {/* --- Filter Card panel --- */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Map size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Tour Program Deviation Report
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Analyze monthly planned tour program deviation vs actual workings
              </p>
            </div>
          </div>

          {/* Switch Toggle Switch */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
            <button
              type="button"
              onClick={() => setFilterOpen(p => !p)}
              style={{
                width: 44,
                height: 22,
                borderRadius: 100,
                position: "relative",
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s",
                background: filterOpen ? "#bfdbfe" : "#cbd5e1",
                outline: "none"
              }}
            >
              <div style={{
                width: 16,
                height: 16,
                background: filterOpen ? "#2563eb" : "#fff",
                borderRadius: "50%",
                position: "absolute",
                top: 3,
                left: filterOpen ? 25 : 3,
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }} />
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="dc-body">
            <div className="ucr-grid-4">
              
              <div>
                <SingleDropdown
                  label="Select View For"
                  value={viewFor}
                  onSelect={setViewFor}
                  options={[{ id: "self", label: "Self" }]}
                />
              </div>

              <div>
                <SingleDropdown
                  label="Select Report Type"
                  value={reportType}
                  onSelect={setReportType}
                  options={REPORT_TYPE_OPTIONS}
                />
              </div>

              <div>
                <SingleDropdown
                  label="SELECT MONTH *"
                  value={selectedMonth}
                  onSelect={setSelectedMonth}
                  options={MONTH_OPTIONS}
                />
              </div>

              <div>
                <SingleDropdown
                  label="SELECT YEAR *"
                  value={selectedYear}
                  onSelect={setSelectedYear}
                  options={YEAR_OPTIONS}
                />
              </div>

              <div style={{ marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={tableLoading || !viewFor || !reportType || !selectedMonth || !selectedYear}
                  className="dc-submit-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                    background: (tableLoading || !viewFor || !reportType || !selectedMonth || !selectedYear) ? "#e2e8f0" : "#2563eb",
                    color: (tableLoading || !viewFor || !reportType || !selectedMonth || !selectedYear) ? "#94a3b8" : "#fff",
                    boxShadow: (tableLoading || !viewFor || !reportType || !selectedMonth || !selectedYear) ? "none" : "0 4px 14px rgba(37, 99, 235, 0.3)",
                    cursor: (tableLoading || !viewFor || !reportType || !selectedMonth || !selectedYear) ? "not-allowed" : "pointer"
                  }}
                >
                  {tableLoading ? (
                    <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} />
                  ) : (
                    <Check size={14} />
                  )}
                  Generate Report
                </button>
              </div>
            </div>

            {validationErr && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: "#ef4444", marginTop: 20 }}>
                <AlertCircle size={14} /> {validationErr}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Details Table panel --- */}
      {showTable && (
        <div className="dc-card" id="printable-table-card">
          <div className="dc-header" style={{ background: "#f8fafc", borderBottom: "1px solid #edf2f7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
                Tour Program vs Actual Working Deviation Report
              </h2>
            </div>

            {/* Counts Badge Controls on the right */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "#2563eb", color: "#fff", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {noDeviationCount} No Deviation
              </span>
              <span style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "#2563eb", color: "#fff", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {additionalCount} Additional Visited
              </span>
              <span style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "#dc2626", color: "#fff", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {deviatedCount} Deviated
              </span>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handlePrint}
                style={actionBtnStyle}
                title="Print Report"
              >
                <Printer size={16} />
              </button>
              
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={filtered.length === 0}
                style={actionBtnStyle}
                title="Export to Excel"
              >
                <FileSpreadsheet size={16} />
              </button>
            </div>
          </div>

          {/* Sub Header Card */}
          <div style={{ padding: "12px 24px", background: "#ffffff", borderBottom: "1px solid #edf2f7", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
            <span style={subHeaderTextStyle}>Name : <strong style={{ color: "#1e293b" }}>{userInfo.name}</strong></span>
            <span style={subHeaderTextStyle}>Designation : <strong style={{ color: "#1e293b" }}>({userInfo.designation})</strong></span>
            <span style={subHeaderTextStyle}>Month &amp; Year : <strong style={{ color: "#2563eb" }}>{selectedMonthName}/{selectedYear}</strong></span>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            {tableLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 10, fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                <Loader2 size={20} style={{ color: "#2563eb", animation: "ucr-spin 1s linear infinite" }} />
                Loading report data...
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
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 24px 0", background: "#fff" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                    <input
                      type="text"
                      placeholder="Search Records..."
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                      style={{
                        height: 36, padding: "0 12px 0 32px", borderRadius: 8, border: "1.5px solid #d1d5db",
                        fontSize: 12, color: "#111827", outline: "none", width: 180, fontWeight: 600,
                        background: "#fff", transition: "all 0.15s"
                      }}
                      onFocus={e => e.target.style.borderColor = "#2563eb"}
                      onBlur={e => e.target.style.borderColor = "#d1d5db"}
                    />
                  </div>
                </div>

                <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
                  <table className="ucr-table">
                    <thead>
                      <tr>
                        <th rowSpan={2} style={{ textAlign: "center", width: 60 }}>#</th>
                        <th rowSpan={2}>Date</th>
                        <th rowSpan={2}>DCR Punch Date</th>
                        <th rowSpan={2}>Headquarter</th>
                        <th colSpan={2} style={{ textAlign: "center", background: "#f1f5f9" }}>Planned TP</th>
                        <th colSpan={3} style={{ textAlign: "center", background: "#eff6ff" }}>Actual Working</th>
                        <th colSpan={4} style={{ textAlign: "center", background: "#f0fdf4" }}>Monthly Working Chart</th>
                      </tr>
                      <tr>
                        {/* Planned TP sub-headers */}
                        <th style={{ background: "#f8fafc" }}>Planned Activity</th>
                        <th style={{ background: "#f8fafc" }}>Planned Area</th>
                        {/* Actual Working sub-headers */}
                        <th style={{ background: "#f8fafc" }}>Actual Area Worked</th>
                        <th style={{ background: "#f8fafc" }}>Joint Work</th>
                        <th style={{ background: "#f8fafc" }}>Working Activity</th>
                        {/* Monthly Working Chart sub-headers */}
                        <th style={{ textAlign: "center", background: "#f8fafc" }}>Doctor Visit</th>
                        <th style={{ textAlign: "center", background: "#f8fafc" }}>Chemist Visit</th>
                        <th style={{ textAlign: "center", background: "#f8fafc" }}>Stockist Visit</th>
                        <th style={{ textAlign: "center", background: "#f8fafc" }}>Deviation Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, ri) => {
                        const globalIdx = (page - 1) * PAGE_SIZE + ri + 1;
                        return (
                          <tr key={ri}>
                            <td style={{ textAlign: "center", color: "#64748b" }}>{globalIdx}</td>
                            <td style={{ fontWeight: 700, color: "#1e293b" }}>{row.date || row.tpDate || "—"}</td>
                            <td style={{ fontWeight: 600, color: "#64748b" }}>{row.dcrPunchDate || row.punchDate || row.dcrDate || "------"}</td>
                            <td style={{ fontWeight: 600 }}>{row.headquarter || row.headquarterName || row.hqName || "—"}</td>
                            <td style={{ fontWeight: 600, color: "#475569" }}>{row.plannedActivity || row.activity || row.plannedActivityType || row.activityType || "—"}</td>
                            <td style={{ fontSize: "12px", whiteSpace: "normal", maxWidth: "250px" }}>{row.plannedArea || row.plannedAreas || "—"}</td>
                            <td style={{ fontSize: "12px", whiteSpace: "normal", maxWidth: "250px" }}>{row.actualArea || row.actualAreas || row.actualAreaWorked || "—"}</td>
                            <td style={{ fontWeight: 600, color: "#64748b" }}>{row.jointWork || row.jointWorkWith || row.jointWorkManager || "------"}</td>
                            <td style={{ fontWeight: 600, color: "#64748b" }}>{row.workingActivity || row.actualActivity || row.workingStatus || "------"}</td>
                            <td style={{ textAlign: "center", fontWeight: 700, color: "#1e293b" }}>{row.doctorVisit ?? row.doctorVisitCount ?? row.doctorCalls ?? 0}</td>
                            <td style={{ textAlign: "center", fontWeight: 700, color: "#1e293b" }}>{row.chemistVisit ?? row.chemistVisitCount ?? row.chemistCalls ?? 0}</td>
                            <td style={{ textAlign: "center", fontWeight: 700, color: "#1e293b" }}>{row.stockistVisit ?? row.stockistVisitCount ?? row.stockistCalls ?? 0}</td>
                            <td style={{ textAlign: "center" }}>
                              <DeviationStatusBadge value={row.deviationStatus || row.status || row.deviation} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
                  </span>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage(1)}
                      style={pageBtnStyle(page === 1)}
                    >
                      <ChevronsLeft size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      style={pageBtnStyle(page === 1)}
                    >
                      <ChevronLeft size={13} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      if (pg > totalPages) return null;
                      const isCurrent = pg === page;
                      return (
                        <button
                          key={pg}
                          type="button"
                          onClick={() => setPage(pg)}
                          style={{
                            height: 28, width: 28, borderRadius: 6, border: "1px solid #edf2f7", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                            background: isCurrent ? "#2563eb" : "#fff",
                            color: isCurrent ? "#fff" : "#475569",
                            borderColor: isCurrent ? "#2563eb" : "#edf2f7"
                          }}
                        >
                          {pg}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      style={pageBtnStyle(page === totalPages)}
                    >
                      <ChevronRight size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => setPage(totalPages)}
                      style={pageBtnStyle(page === totalPages)}
                    >
                      <ChevronsRight size={13} />
                    </button>
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

const subHeaderTextStyle = {
  fontSize: "14.5px",
  fontWeight: 600,
  color: "#64748b",
  fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const actionBtnStyle = {
  height: 36,
  width: 36,
  borderRadius: 8,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(37,99,235,0.1)",
  transition: "all 0.15s"
};

const pageBtnStyle = (disabled) => ({
  height: 28,
  width: 28,
  borderRadius: 6,
  border: "1px solid #edf2f7",
  background: "#fff",
  color: disabled ? "#cbd5e1" : "#475569",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s"
});

/* ─── Atom Dropdown Component ────────────────────────────────────────── */

function SingleDropdown({ label, value, onSelect, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => String(o.id ?? o.value) === String(value));
  const hasVal = Boolean(value);
  const active = open || hasVal;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", marginTop: 8 }} className="ucr-field-wrap">
      <div
        onClick={() => !disabled && setOpen(p => !p)}
        style={{
          width: "100%", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px", border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db", borderRadius: 8,
          background: disabled ? "#f9fafb" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s", boxSizing: "border-box"
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: hasVal ? "#111827" : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected ? selected.label : " "}
        </span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 11,
        top: active ? -8 : 10, fontSize: active ? 10 : 13,
        fontWeight: active ? 700 : 500, color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af",
        background: active ? "#fff" : "transparent", padding: active ? "0 4px" : "0",
        transition: "all 0.2s", textTransform: active ? "uppercase" : "none", letterSpacing: active ? "0.05em" : "normal"
      }}>
        {label}
      </label>

      {open && !disabled && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, maxHeight: 200, overflowY: "auto",
        }}>
          {options.length === 0 ? (
            <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div>
          ) : (
            options.map(o => {
              const val = String(o.id ?? o.value);
              const isSelected = val === String(value);
              return (
                <div
                  key={val}
                  onClick={() => { onSelect(val); setOpen(false); }}
                  style={{
                    padding: "9px 12px", cursor: "pointer",
                    fontSize: 13, fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "#2563eb" : "#374151",
                    background: isSelected ? "#eff6ff" : "transparent",
                    display: "flex", alignItems: "center", gap: 8,
                    transition: "background 0.1s"
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  {isSelected && <Check size={13} style={{ color: "#2563eb", flexShrink: 0 }} />}
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

/* ─── Deviation Status Badge Atom ────────────────────────────────────────── */

function DeviationStatusBadge({ value }) {
  const v = String(value || "").toLowerCase();
  
  const style = v.includes("no deviation") || v === "nodeviation" || !value
    ? { background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }
    : v.includes("additional") || v === "additionalvisited"
    ? { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }
    : { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };

  return (
    <span style={{
      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, display: "inline-block",
      ...style
    }}>
      {value || "No Deviation"}
    </span>
  );
}
