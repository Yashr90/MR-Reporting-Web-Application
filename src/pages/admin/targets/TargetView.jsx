import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, CheckCircle2, ChevronDown, Check,
  BarChart3, FileSpreadsheet, Eye, ChevronLeft, ChevronRight
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants & Matrix Variables ───────────────────────────────────────────
const FH = 40;
const PAGE_SIZES = [5, 10, 20, 50];
const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: String(CURRENT_YEAR - 1 + i),
  label: String(CURRENT_YEAR - 1 + i)
}));

const MONTH_COLUMNS = [
  { key: "1", label: "Jan" }, { key: "2", label: "Feb" }, { key: "3", label: "March" },
  { key: "4", label: "April" }, { key: "5", label: "May" }, { key: "6", label: "June" },
  { key: "7", label: "July" }, { key: "8", label: "Aug" }, { key: "9", label: "Sep" },
  { key: "10", label: "Oct" }, { key: "11", label: "Nov" }, { key: "12", label: "Dec" }
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
    min-width: 0;
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

  /* ── Original Balanced Radio Input Grid Row Layout ── */
  .ucr-grid-4 { 
    display: grid; 
    grid-template-columns: 160px repeat(3, 1fr); 
    gap: 18px 16px; 
    align-items: center; 
    margin-bottom: 20px;
  }
  .ucr-grid-4:last-of-type {
    margin-bottom: 0;
  }

  .col-span-2 { grid-column: span 2; }
  .col-span-4 { grid-column: span 4; }

  @media(max-width: 1200px) {
    .ucr-grid-4 { grid-template-columns: 140px repeat(3, 1fr); }
  }
  @media(max-width: 1024px) {
    .ucr-grid-4 { grid-template-columns: 1fr; gap: 14px; }
    .hide-on-mobile { display: none; }
  }
  @media(max-width: 768px) {
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; justify-content: center; }
    .dc-footer > button { width: 100% !important; justify-content: center !important; }
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

  /* ── Premium Compact Table Container ── */
  .ucr-table-container {
    border: 1px solid #edf2f7;
    border-radius: 12px;
    overflow-x: auto;
    background: #ffffff !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
    margin-bottom: 16px;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .ucr-table-container::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  .ucr-table-container::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 100px;
  }
  .ucr-table-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 100px;
    border: 2px solid #f1f5f9;
  }
  .ucr-table-container::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 1000px; }
  .ucr-table thead tr { position: sticky; top: 0; z-index: 10; }
  .ucr-table thead { background: #f8fafc; }
  
  .ucr-table th { 
    padding: 12px 16px; 
    font-size: 11px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    color: #64748b;
    border-bottom: 1px solid #edf2f7; 
    white-space: nowrap;
    text-align: center;
  }
  .ucr-table td { 
    padding: 11px 16px; 
    color: #475569; 
    border-bottom: 1px solid #f8fafc; 
    font-weight: 500; 
    white-space: nowrap; 
    text-align: center;
  }
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
    color: #ffffff !important;
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
`;

export default function TargetView() {
  // ─── UI State ────────────────────────────────────────────────────────────────
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Filter State ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    stateIds: [],
    districtIds: [],
    employeeIds: [],
    year: String(CURRENT_YEAR)
  });

  // ─── Master Data ─────────────────────────────────────────────────────────────
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ─── Table Data State ────────────────────────────────────────────────────────
  const [reportData, setReportData] = useState([]);
  const [monthTotals, setMonthTotals] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);

  // ─── Helper for Auth Headers ─────────────────────────────────────────────────
  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  }), []);

  // 1. Fetch States on Mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/masters/states", getAuthHeaders());
        const stateData = res.data?.data || res.data || [];
        const normalizedStates = Array.isArray(stateData) ? stateData.map((s) => ({
          id: String(s?.id ?? s?.stateId ?? ""),
          stateName: s?.state_name || s?.stateName || s?.name || "Unknown"
        })) : [];
        setStates(normalizedStates.filter(opt => opt.id !== ""));
      } catch (err) { console.error("Failed to load states", err); }
    };
    fetchStates();
  }, [getAuthHeaders]);

  // 2. Fetch Districts when States change
  useEffect(() => {
    setFilters(prev => ({ ...prev, districtIds: [], employeeIds: [] }));
    setDistricts([]); setEmployees([]);
    setTableVisible(false);
    
    if (filters.stateIds && filters.stateIds.length > 0) {
      const fetchDistricts = async () => {
        try {
          const query = filters.stateIds.map(id => `stateIds=${id}`).join('&');
          const res = await api.get(`/api/masters/districts/by-states?${query}`, getAuthHeaders());
          
          const districtData = res.data?.data || res.data || [];
          const normalizedDistricts = Array.isArray(districtData) ? districtData.map((d) => ({
            id: String(d?.id ?? d?.districtId ?? ""),
            districtName: d?.district_name || d?.districtName || d?.name || "Unknown"
          })) : [];
          setDistricts(normalizedDistricts.filter(opt => opt.id !== ""));
        } catch (err) { console.error("Failed to load districts", err); }
      };
      fetchDistricts();
    }
  }, [filters.stateIds, getAuthHeaders]);

  // 3. Fetch Employees when Districts change
  useEffect(() => {
    setFilters(prev => ({ ...prev, employeeIds: [] }));
    setEmployees([]);
    setTableVisible(false);

    if (filters.districtIds?.length > 0 && filters.stateIds?.length > 0) {
      const fetchEmployees = async () => {
        try {
          const stateQuery = filters.stateIds.map(id => `stateIds=${id}`).join('&');
          const districtQuery = filters.districtIds.map(id => `districtIds=${id}`).join('&');
          
          const res = await api.get(`/api/target/submission/employees/by-filters?${stateQuery}&${districtQuery}`, getAuthHeaders());
          const employeeData = res.data?.data || res.data || [];
          
          const normalizedEmployees = Array.isArray(employeeData) ? employeeData.map((e) => {
            const name = e?.name || e?.employee_name || e?.employeeName || "Unknown";
            const type = e?.type || e?.designation_name || e?.designationName || e?.designation || "";
            return {
              id: String(e?.id ?? e?.employeeId ?? ""),
              employeeName: type ? `${name}-(${type})` : name
            };
          }) : [];
          setEmployees(normalizedEmployees.filter(opt => opt.id !== ""));
        } catch (err) { console.error("Failed to load employees", err); }
      };
      fetchEmployees();
    }
  }, [filters.districtIds, filters.stateIds, getAuthHeaders]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setTableVisible(false); 
  };

  const handleViewTarget = async () => {
    setError("");
    if (!filters.stateIds?.length || !filters.districtIds?.length || !filters.employeeIds?.length || !filters.year) {
      return setError("Please select State, District, Employee, and Year to view targets.");
    }

    setIsLoading(true);
    try {
      const payload = {
        stateIds: filters.stateIds.map(Number),
        districtIds: filters.districtIds.map(Number),
        employeeIds: filters.employeeIds.map(Number),
        year: Number(filters.year)
      };

      const res = await api.post(`/api/target/submission/report`, payload, getAuthHeaders());
      const reportResponse = res.data?.data || res.data || {};
      
      setReportData(Array.isArray(reportResponse.rows) ? reportResponse.rows : []);
      setMonthTotals(reportResponse.monthTotals || {});
      setGrandTotal(reportResponse.grandTotal || 0);
      setTableVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch target report data.");
      setReportData([]);
      setMonthTotals({});
      setGrandTotal(0);
      setTableVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData || !reportData.length) return;
    
    const headers = ["User Name", ...MONTH_COLUMNS.map(m => m.label), "TOTAL"];
    const rows = reportData.map(row => [
      row.employeeName || "-",
      ...MONTH_COLUMNS.map(month => row.monthlyTargets?.[month.key] || 0),
      row.total || 0
    ]);

    rows.push([
      "TOTAL",
      ...MONTH_COLUMNS.map(month => monthTotals?.[month.key] || 0),
      grandTotal || 0
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `target_report_${filters.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const stateOpts = states.map(s => ({ value: String(s.id), label: s.stateName }));
  const distOpts = districts.map(d => ({ value: String(d.id), label: d.districtName }));
  const empOpts = employees.map(e => ({ value: String(e.id), label: e.employeeName }));

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Filter Card Container */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <BarChart3 size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Target Report</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>View and analyze target submissions</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
              <div style={{ width: 40, height: 20, borderRadius: 100, position: "relative", cursor: "pointer", transition: "0.2s", background: isFilterOpen ? "#3B82F6" : "#cbd5e1" }}>
                <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: isFilterOpen ? 23 : 3, transition: "0.2s" }} />
              </div>
            </div>
          </button>
        </div>

        {isFilterOpen && (
          <div className="dc-body">
            {/* Row 1: User wise Selection Row */}
            <div className="ucr-grid-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "5px solid #2563eb", background: "#fff" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>* User wise</span>
              </div>
              <MultiSelectDropdown label="Select State" options={stateOpts} selectedIds={filters.stateIds} onChange={(v) => handleFilterChange("stateIds", v)} />
              <MultiSelectDropdown label="Select District" options={distOpts} selectedIds={filters.districtIds} onChange={(v) => handleFilterChange("districtIds", v)} disabled={!filters.stateIds?.length} />
              <MultiSelectDropdown label="Select Employee" options={empOpts} selectedIds={filters.employeeIds} onChange={(v) => handleFilterChange("employeeIds", v)} disabled={!filters.districtIds?.length} />
            </div>

            {/* Row 2: Monthly Timeline Row */}
            <div className="ucr-grid-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "5px solid #2563eb", background: "#fff" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>* Monthly</span>
              </div>
              <SingleDropdown label="Select Year" options={YEARS} value={filters.year} onSelect={(v) => handleFilterChange("year", v)} />
              <div className="col-span-2 hide-on-mobile"></div>
            </div>

            {/* Row 3: Amount Wise Action Button Row */}
            <div className="ucr-grid-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "5px solid #2563eb", background: "#fff" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>* Amount Wise</span>
              </div>
              <div style={{ display: "flex", height: 40, alignItems: "center" }}>
                <button 
                  type="button"
                  onClick={handleViewTarget} 
                  disabled={isLoading} 
                  className="dc-submit-btn"
                  style={{ width: "100%", justifyContent: "center", background: "#2563eb" }}
                >
                  {isLoading ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Eye size={14} />}
                  View Target
                </button>
              </div>
              <div className="col-span-2 hide-on-mobile"></div>
            </div>
          </div>
        )}
      </div>

      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Target View Amount Wise</h3>
            <button 
              type="button"
              onClick={handleExportExcel} 
              style={{
                height: 40, width: 40, borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0",
                color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.15)"
              }}
              title="Export to Excel"
            >
              <FileSpreadsheet size={16} />
            </button>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", borderRight: "1px solid #edf2f7" }}>User Name</th>
                    {MONTH_COLUMNS.map((month) => (
                      <th key={month.key} style={{ minWidth: 85, borderRight: "1px solid #edf2f7" }}>
                        {month.label}
                      </th>
                    ))}
                    <th style={{ background: "#2563eb", color: "#fff" }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.length === 0 ? (
                    <tr>
                      <td colSpan={14} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                        No target data found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    reportData.map((row, index) => (
                      <tr key={row.employeeId || index}>
                        <td style={{ fontWeight: 700, color: "#1e293b", textAlign: "left", borderRight: "1px solid #edf2f7" }}>{row.employeeName || "-"}</td>
                        {MONTH_COLUMNS.map((month) => (
                          <td key={month.key} style={{ fontWeight: 600, borderRight: "1px solid #edf2f7" }}>
                            {row.monthlyTargets?.[month.key] || 0}
                          </td>
                        ))}
                        <td style={{ fontWeight: 700, color: "#1e293b", background: "#f8fafc" }}>
                          {row.total || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {reportData.length > 0 && (
                  <tfoot>
                    <tr style={{ background: "#f8fafc" }}>
                      <td style={{ fontWeight: 700, color: "#1e293b", textAlign: "center", padding: "14px 16px", borderRight: "1px solid #edf2f7" }}>TOTAL</td>
                      {MONTH_COLUMNS.map((month) => (
                        <td key={month.key} style={{ fontWeight: 700, color: "#1e293b", padding: "14px 16px", borderRight: "1px solid #edf2f7" }}>
                          {monthTotals?.[month.key] || 0}
                        </td>
                      ))}
                      <td style={{ fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "14px 16px" }}>
                        {grandTotal || 0}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Searchable Portal Configuration Single Dropdown Component ───
function SingleDropdown({ label, options, value, onSelect, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = options.find((option) => String(option.value) === String(value));
  const hasVal = Boolean(value !== "" && value !== null && value !== undefined);
  const active = isOpen || hasVal;
  const borderColor = isOpen ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff";
  const shadow  = isOpen && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = isOpen ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none" }} className="dc-field-wrap">
      <div
        onClick={handleTriggerClick}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`, cursor: disabled ? "not-allowed" : "pointer",
          background: bgColor + " !important", boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, fontWeight: 500, color: value ? "#1e293b" : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 14 }}>
          {selectedOption?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#3B82F6" : "#94a3b8", display: "flex", alignItems: "center" }}>
          <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label
        style={{
          position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 11 : 13,
          fontWeight: 500, color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20
        }}
      >
        {label}
      </label>

      {isOpen && !disabled && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {(!options || options.length === 0) ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No options available</li>
            ) : (
              options.map((opt, i) => {
                const optValue = opt.id ?? opt.value;
                return (
                  <li
                    key={i}
                    className={`dc-opt${String(value) === String(optValue) ? " selected" : ""}`}
                    style={{
                      padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                      color: String(value) === String(optValue) ? "#2563eb" : "#475569",
                      backgroundColor: String(value) === String(optValue) ? "rgba(59,130,246,0.08)" : "#ffffff",
                      fontWeight: String(value) === String(optValue) ? "600" : "500"
                    }}
                    onMouseDown={(e) => { e.preventDefault(); onSelect(optValue); setIsOpen(false); }}
                  >
                    {String(value) === String(optValue) && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
                    {opt.label}
                  </li>
                );
              })
            )}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Searchable Portal Multi-Select Configuration Dropdown Component ───
function MultiSelectDropdown({ label, options = [], selectedIds = [], onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  const toggle = id => onChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
  const selectAll = () => onChange((options || []).map(o => String(o.id ?? o.value)));
  const clearAll = () => onChange([]);

  const hasValue = selectedIds.length > 0;
  const displayText = hasValue ? (options || []).filter(o => selectedIds.includes(String(o?.id ?? o?.value))).map(o => o?.label).join(", ") : "";
  const borderColor = isOpen ? "#3B82F6" : hasValue ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff";
  const shadow  = isOpen && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = isOpen ? "#3B82F6" : hasValue ? "#64748b" : "#94a3b8";
  const active = isOpen || hasValue;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none" }} className="dc-field-wrap">
      <div
        onClick={handleTriggerClick}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`, cursor: disabled ? "not-allowed" : "pointer",
          background: bgColor + " !important", boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasValue ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
          {displayText || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#3B82F6" : "#94a3b8", display: "flex", alignItems: "center" }}>
          <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label
        style={{
          position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 11 : 13,
          fontWeight: 500, color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20
        }}
      >
        {label}
      </label>

      {isOpen && !disabled && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <div style={{ display: "flex", borderBottom: "1px solid #edf2f7", background: "#f8fafc" }}>
            <button type="button" onMouseDown={e => { e.preventDefault(); selectAll(); }} style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#2563eb", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Select All</button>
            <button type="button" onMouseDown={e => { e.preventDefault(); clearAll(); }} style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Clear All</button>
          </div>
          <ul style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0", margin: 0, listStyle: "none", background: "#ffffff" }}>
            {(!options || options.length === 0) ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No options available</li>
            ) : (
              options.map((opt, idx) => {
                const optId = String(opt.id ?? opt.value);
                const isSel = selectedIds.includes(optId);
                return (
                  <li
                    key={idx}
                    className={`dc-opt${isSel ? " selected" : ""}`}
                    style={{
                      padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "8px",
                      color: isSel ? "#2563eb" : "#475569",
                      backgroundColor: isSel ? "rgba(59,130,246,0.08)" : "#ffffff",
                      fontWeight: isSel ? "600" : "500"
                    }}
                    onMouseDown={(e) => { e.preventDefault(); toggle(optId); }}
                  >
                    <input type="checkbox" checked={isSel} readOnly style={{ accentColor: "#3B82F6", cursor: "pointer", marginRight: 4 }} />
                    {opt.label}
                  </li>
                );
              })
            )}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}