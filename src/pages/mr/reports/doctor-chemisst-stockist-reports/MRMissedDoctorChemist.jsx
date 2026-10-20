import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, AlertCircle, ChevronDown, Check,
  ChevronLeft, ChevronRight, Search, X, FileSpreadsheet,
  ClipboardX, Calendar as CalendarIcon, ChevronsLeft, ChevronsRight
} from "lucide-react";
import api from "../../../../services/api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const STATUS_OPTIONS = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" }
];

const CATEGORY_OPTIONS = [
  { id: "A", label: "A" },
  { id: "A+", label: "A+" },
  { id: "B", label: "B" },
  { id: "B+", label: "B+" },
  { id: "C", label: "C" },
  { id: "Core", label: "Core" },
  { id: "SuperCore", label: "SuperCore" }
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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; min-width: 1600px; }
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
`;

export default function MRMissedDoctorChemist() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [areasList, setAreasList] = useState([]);

  // Filters State
  const [selectType, setSelectedType] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [providerRadio, setProviderRadio] = useState("");

  // Table State
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [showTable, setShowTable] = useState(false);
  
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState("");
  const [validationErr, setValidationErr] = useState("");

  // Fetch areas mapping on component mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        let res;
        try {
          res = await api.get("/api/mr/area-creation/areas");
        } catch {
          res = await api.get("/api/areas");
        }
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          setAreasList(data.map(item => ({
            id: String(item.id || item._id || item.value || ""),
            label: item.areaName || item.area_name || item.name || "Unknown Area"
          })));
        }
      } catch (err) {
        console.error("Failed to fetch areas", err);
      }
    };
    fetchAreas();
  }, []);

  const validate = () => {
    if (!selectType) return "Type is required!!!";
    if (selectedStatus.length === 0) return "Status is required!!!";
    if (!fromDate) return "From Date is required!!!";
    if (!toDate) return "To Date is required!!!";
    if (fromDate > toDate) return "From Date cannot be after To Date.";
    if (!providerRadio) return "Provider Type is required!!!";
    return "";
  };

  const handleViewStatus = async () => {
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
    params.append("type", selectType);
    params.append("providerType", providerRadio);
    params.append("fromDate", fromDate);
    params.append("toDate", toDate);
    params.append("status", selectedStatus.join(","));
    if (selectedAreas.length > 0) {
      params.append("areaIds", selectedAreas.join(","));
    }
    if (providerRadio === "doctor" && selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }

    try {
      let res;
      try {
        res = await api.get(`/api/mr/reports/missed-provider?${params.toString()}`);
      } catch {
        res = await api.get(`/api/reports/missed-provider?${params.toString()}`);
      }
      const data = res.data?.data || res.data || [];
      setTableData(Array.isArray(data) ? data : []);
    } catch (e) {
      setTableError(e.response?.data?.message || "Failed to load report. Please try again.");
    } finally {
      setTableLoading(false);
    }
  };

  const filtered = tableData.filter(r =>
    !search || Object.values(r).some(v => String(v ?? "").toLowerCase().includes(search.toLowerCase()))
  );
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const DOCTOR_COLS = [
    { key: "sNo",               label: "S. No.",          center: true },
    { key: "state",             label: "State"                         },
    { key: "headquarter",       label: "Headquarter"                   },
    { key: "area",              label: "Area"                          },
    { key: "areaCurrentStatus", label: "Area Status",     center: true },
    { key: "designation",       label: "Designation",     center: true },
    { key: "employeeName",      label: "Employee Name"                 },
    { key: "employeeCode",      label: "Emp. Code",       center: true },
    { key: "doctorName",        label: "Doctor Name"                   },
    { key: "doctorCode",        label: "Doctor Code",     center: true },
    { key: "address",           label: "Address"                       },
    { key: "category",          label: "Category",        center: true },
    { key: "specialization",    label: "Specialization"                },
    { key: "degree",            label: "Degree",          center: true },
    { key: "mobileNumber",      label: "Mobile No.",      center: true },
    { key: "doctorCurrentStatus", label: "Doctor Status", center: true },
  ];

  const CHEMIST_COLS = [
    { key: "sNo",               label: "S. No.",            center: true },
    { key: "state",             label: "State"                           },
    { key: "headquarter",       label: "Headquarter"                     },
    { key: "area",              label: "Area"                            },
    { key: "areaCurrentStatus", label: "Area Status",       center: true },
    { key: "designation",       label: "Designation",       center: true },
    { key: "employeeName",      label: "Employee Name"                   },
    { key: "employeeCode",      label: "Emp. Code",         center: true },
    { key: "providerName",      label: "Provider Name"                   },
    { key: "providerCode",      label: "Provider Code",     center: true },
    { key: "providerType",      label: "Provider Type",     center: true },
    { key: "address",           label: "Address"                         },
    { key: "mobileNumber",      label: "Mobile No.",        center: true },
    { key: "providerCurrentStatus", label: "Provider Status", center: true },
  ];

  const TABLE_COLS = providerRadio === "doctor" ? DOCTOR_COLS : CHEMIST_COLS;

  const handleExportExcel = () => {
    if (!tableData.length) return;
    
    const headers = TABLE_COLS.filter(c => c.key !== "sNo").map(c => c.label);
    let csvContent = [
      ["S.No.", ...headers].join(",")
    ];

    tableData.forEach((row, idx) => {
      const line = [
        idx + 1,
        ...TABLE_COLS.filter(c => c.key !== "sNo").map(col => {
          const val = row[col.key] ?? "—";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
      ];
      csvContent.push(line.join(","));
    });

    const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Missed_Provider_Report_${providerRadio}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Category selector conditionally when both Dates are populated
  const showCategoryDropdown = Boolean(fromDate && toDate && providerRadio === "doctor");

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {/* --- Filter Card panel --- */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <ClipboardX size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Missed Provider Report
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Track missed doctors, chemists &amp; stockists
              </p>
            </div>
          </div>

          {/* Premium Purple/Green Toggle Switch from image */}
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
                  label="SELECT TYPE *"
                  value={selectType}
                  onSelect={setSelectedType}
                  options={[{ id: "self", label: "Self" }]}
                />
              </div>

              <div>
                <MultiDropdown
                  label="Select Area"
                  options={areasList}
                  selectedIds={selectedAreas}
                  onChange={setSelectedAreas}
                />
              </div>

              <div>
                <MultiDropdown
                  label="SELECT STATUS *"
                  options={STATUS_OPTIONS}
                  selectedIds={selectedStatus}
                  onChange={setSelectedStatus}
                />
              </div>

              <div>
                <FDatePicker
                  label="FROM DATE"
                  value={fromDate}
                  onChange={setFromDate}
                />
              </div>

              <div>
                <FDatePicker
                  label="TO DATE"
                  value={toDate}
                  onChange={setToDate}
                />
              </div>

              {/* Radio buttons for Doctor/Chemist */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: providerRadio === "doctor" ? "2px solid #2563eb" : "2px solid #cbd5e1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: providerRadio === "doctor" ? "rgba(37,99,246,0.1)" : "#fff",
                    transition: "all 0.15s",
                  }}>
                    {providerRadio === "doctor" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: providerRadio === "doctor" ? "#1e293b" : "#64748b" }}>Doctor</span>
                  <input type="radio" style={{ display: "none" }} checked={providerRadio === "doctor"} onChange={() => setProviderRadio("doctor")} />
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: providerRadio === "chemist" ? "2px solid #2563eb" : "2px solid #cbd5e1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: providerRadio === "chemist" ? "rgba(37,99,246,0.1)" : "#fff",
                    transition: "all 0.15s",
                  }}>
                    {providerRadio === "chemist" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: providerRadio === "chemist" ? "#1e293b" : "#64748b" }}>Chemist / Stockist</span>
                  <input type="radio" style={{ display: "none" }} checked={providerRadio === "chemist"} onChange={() => setProviderRadio("chemist")} />
                </label>
              </div>

              {/* Conditional Category multi-option dropdown */}
              {showCategoryDropdown && (
                <div>
                  <MultiDropdown
                    label="SELECT CATEGORY *"
                    options={CATEGORY_OPTIONS}
                    selectedIds={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                </div>
              )}

              <div style={{ marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={handleViewStatus}
                  disabled={tableLoading || !selectType || selectedStatus.length === 0 || !fromDate || !toDate || !providerRadio}
                  className="dc-submit-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                    background: (tableLoading || !selectType || selectedStatus.length === 0 || !fromDate || !toDate || !providerRadio) ? "#e2e8f0" : "#2563eb",
                    color: (tableLoading || !selectType || selectedStatus.length === 0 || !fromDate || !toDate || !providerRadio) ? "#94a3b8" : "#fff",
                    boxShadow: (tableLoading || !selectType || selectedStatus.length === 0 || !fromDate || !toDate || !providerRadio) ? "none" : "0 4px 14px rgba(37, 99, 235, 0.3)",
                    cursor: (tableLoading || !selectType || selectedStatus.length === 0 || !fromDate || !toDate || !providerRadio) ? "not-allowed" : "pointer"
                  }}
                >
                  {tableLoading ? (
                    <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} />
                  ) : (
                    <Check size={14} />
                  )}
                  View Status
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
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Missed Provider Details
              </h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
                ({filtered.length} record{filtered.length !== 1 ? "s" : ""})
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={filtered.length === 0}
                style={{
                  height: 36, width: 36, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe",
                  color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.1)", transition: "all 0.15s"
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
                <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
                  <table className="ucr-table">
                    <thead>
                      <tr>
                        {TABLE_COLS.map(col => (
                          <th key={col.key} style={{ textAlign: col.center ? "center" : "left" }}>
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, ri) => (
                        <tr key={ri}>
                          {TABLE_COLS.map(col => {
                            const globalIdx = (page - 1) * PAGE_SIZE + ri + 1;
                            return (
                              <td key={col.key} style={{ textAlign: col.center ? "center" : "left" }}>
                                {col.key === "sNo" ? (
                                  globalIdx
                                ) : col.key === "category" ? (
                                  <CategoryBadge value={row[col.key]} />
                                ) : (col.key === "doctorCurrentStatus" || col.key === "providerCurrentStatus" || col.key === "areaCurrentStatus") ? (
                                  <StatusBadge value={row[col.key]} />
                                ) : col.key === "providerType" ? (
                                  <ProviderTypeBadge value={row[col.key]} />
                                ) : (
                                  row[col.key] ?? "—"
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
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

/* ─── Atom Form Fields Components ────────────────────────────────────────── */

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

function MultiDropdown({ label, options = [], selectedIds = [], onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id) => {
    const strId = String(id);
    onChange(selectedIds.includes(strId) ? selectedIds.filter(x => String(x) !== strId) : [...selectedIds, strId]);
  };
  const selectAll = () => onChange(options.map(o => String(o.id ?? o.value)));
  const clearAll  = () => onChange([]);

  const hasVal = selectedIds.length > 0;
  const active = open || hasVal;
  const displayLabel = hasVal
    ? options.filter(o => selectedIds.includes(String(o.id ?? o.value))).map(o => o.label).join(", ")
    : "";

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
          {displayLabel || " "}
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
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, overflow: "hidden", minWidth: 200
        }}>
          <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6" }}>
            <button type="button" onClick={(e) => { e.preventDefault(); selectAll(); }} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 700, color: "#fff", background: "#2563eb", border: "none", cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={e=>e.currentTarget.style.opacity=0.9} onMouseOut={e=>e.currentTarget.style.opacity=1}>Select All</button>
            <button type="button" onClick={(e) => { e.preventDefault(); clearAll(); }} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 700, color: "#fff", background: "#ef4444", border: "none", cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={e=>e.currentTarget.style.opacity=0.9} onMouseOut={e=>e.currentTarget.style.opacity=1}>Deselect All</button>
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0" }}>
            {options.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div>
            ) : (
              options.map(o => {
                const val = String(o.id ?? o.value);
                const isSelected = selectedIds.includes(val);
                return (
                  <div
                    key={val}
                    onClick={() => toggle(val)}
                    style={{
                      padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                      fontSize: 13, fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? "#2563eb" : "#374151",
                      background: isSelected ? "#eff6ff" : "transparent",
                      transition: "background 0.1s"
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 15, height: 15, borderRadius: 4, flexShrink: 0,
                      border: isSelected ? "none" : "1.5px solid #d1d5db",
                      background: isSelected ? "#2563eb" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isSelected && <Check size={10} style={{ color: "#fff" }} />}
                    </div>
                    {o.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FDatePicker({ label, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const parsed = (value && !isNaN(Date.parse(value))) ? new Date(value + "T00:00:00") : today;
  const [view, setView] = useState({ y: parsed.getFullYear(), m: parsed.getMonth() });
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const hasVal = Boolean(value);
  const active = open || hasVal;

  const prevMonth = () => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 });
  const nextMonth = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 });

  const selectDay = (day) => {
    const ds = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(ds);
    setOpen(false);
  };

  const firstDow = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const displayVal = hasVal ? new Date(value + "T00:00:00").toLocaleDateString("en-GB") : "";
  const selStr = (d) => `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open ? 100 : 1 }} className="ucr-field-wrap">
      <div
        onClick={() => !disabled && setOpen(!open)}
        style={{
          width: "100%", height: 38, borderRadius: 8, padding: "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center", cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "#f9fafb" : "#fff",
          border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db",
          boxShadow: open ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
          transition: "all 0.15s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: hasVal ? "#111827" : "transparent" }}>
          {displayVal || " "}
        </span>
        <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: open ? "#2563eb" : "#9ca3af" }}>
          <CalendarIcon size={15} />
        </div>
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 11,
        transition: "all 0.15s", fontWeight: 600, letterSpacing: "0.03em",
        top: active ? -9 : 10,
        fontSize: active ? 10 : 13,
        color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af",
        background: active ? "#fff" : "transparent",
        padding: active ? "0 4px" : "0",
      }}>
        {label}
      </label>

      {open && !disabled && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          width: 270, background: "#fff", borderRadius: 14,
          border: "1.5px solid #e5e7eb",
          boxShadow: "0 12px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
          zIndex: 200, overflow: "hidden"
        }}>
          <div style={{ background: "#2563eb", padding: "14px 14px 10px", display: "flex", alignItems: "center", justifyBetween: "space-between", justifyContent: "space-between" }}>
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); prevMonth(); }}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", flexShrink: 0 }}
            >
              <ChevronLeft size={14} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <select
                value={view.m}
                onChange={e => setView({ ...view, m: Number(e.target.value) })}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "2px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none" }}
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i} style={{ color: "#000" }}>{m.slice(0, 3)}</option>
                ))}
              </select>
              <select
                value={view.y}
                onChange={e => setView({ ...view, y: Number(e.target.value) })}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "2px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none" }}
              >
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map(y => (
                  <option key={y} value={y} style={{ color: "#000" }}>{y}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); nextMonth(); }}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", flexShrink: 0 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ padding: "10px 12px 4px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, textAlign: "center" }}>
              {DAYS.map(d => (
                <div key={d} style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", padding: "2px 0" }}>{d}</div>
              ))}
            </div>
          </div>

          <div style={{ padding: "8px 12px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, textAlign: "center" }}>
              {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const ds = selStr(d);
                const isSel = value === ds;
                const isToday = ds === todayStr;

                return (
                  <button
                    key={d}
                    type="button"
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); selectDay(d); }}
                    style={{
                      width: "100%", aspectRatio: "1", borderRadius: "50%", border: "none",
                      fontSize: 12, fontWeight: isSel || isToday ? 700 : 400,
                      cursor: "pointer", transition: "all 0.12s",
                      background: isSel ? "#2563eb" : isToday ? "#eff6ff" : "transparent",
                      color: isSel ? "#fff" : isToday ? "#2563eb" : "#374151",
                      boxShadow: isSel ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                      outline: isToday && !isSel ? "1.5px solid #bfdbfe" : "none",
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "#eff6ff"; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = isToday ? "#eff6ff" : "transparent"; }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Badge Atoms ────────────────────────────────────────────────────────── */

function CategoryBadge({ value }) {
  const map = {
    "A+": "bg-purple-100 text-purple-700",
    "A": "bg-blue-100 text-blue-700",
    "B+": "bg-sky-100 text-sky-700",
    "B": "bg-teal-100 text-teal-700",
    "C": "bg-amber-100 text-amber-700",
    "Core": "bg-rose-100 text-rose-700",
    "SuperCore": "bg-indigo-100 text-indigo-700"
  };

  const styleMap = {
    "A+": { background: "#f5f3ff", color: "#6d28d9" },
    "A": { background: "#eff6ff", color: "#1d4ed8" },
    "B+": { background: "#f0f9ff", color: "#0369a1" },
    "B": { background: "#f0fdf4", color: "#15803d" },
    "C": { background: "#fffbeb", color: "#b45309" },
    "Core": { background: "#fff1f2", color: "#be123c" },
    "SuperCore": { background: "#e0e7ff", color: "#4338ca" }
  };

  const currentStyle = styleMap[String(value)] || { background: "#f3f4f6", color: "#4b5563" };

  return (
    <span style={{
      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, display: "inline-block",
      ...currentStyle
    }}>
      {value ?? "—"}
    </span>
  );
}

function StatusBadge({ value }) {
  const v = String(value ?? "").toLowerCase();
  const isActive = v === "true" || v === "active" || v === "1";
  
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, display: "inline-block",
      background: isActive ? "#ecfdf5" : "#fef2f2",
      color: isActive ? "#047857" : "#b91c1c",
      border: `1px solid ${isActive ? "#a7f3d0" : "#fecaca"}`
    }}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function ProviderTypeBadge({ value }) {
  const v = String(value ?? "").toLowerCase();
  const style = v === "chemist" 
    ? { background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }
    : v === "stockist"
    ? { background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" }
    : { background: "#f3f4f6", color: "#4b5563", border: "1px solid #e5e7eb" };

  return (
    <span style={{
      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, display: "inline-block",
      ...style
    }}>
      {value ?? "—"}
    </span>
  );
}
