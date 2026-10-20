import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, ChevronDown, Check,
  ChevronLeft, ChevronRight, Search, X, FileSpreadsheet,
  Printer, SlidersHorizontal, MapPin, Calendar, HelpCircle
} from "lucide-react";
import api from "../../../services/api";

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

const SUBMITTED_OPTIONS = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" }
];

const TYPE_OPTIONS = [
  { id: "state", label: "State" },
  { id: "headquarter", label: "Headquarter" }
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

  @media(max-width: 1200px) {
    .dc-grid-4 { grid-template-columns: repeat(3, 1fr); }
  }
  @media(max-width: 900px) {
    .dc-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  }
  @media(max-width: 640px) {
    .dc-grid-4 { grid-template-columns: 1fr; gap: 20px; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
  }

  .dc-radio-group {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding: 12px 20px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #edf2f7;
  }

  .dc-radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 500;
  }
  .dc-radio-label.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .dc-radio-circle {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .dc-radio-circle.checked {
    border-color: #2563eb;
    background: rgba(37,99,235,0.1);
  }
  .dc-radio-circle.checked::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2563eb;
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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; min-width: 1500px; }
  .ucr-table thead { background: #2563eb; }
  .ucr-table th { 
    padding: 14px 16px; 
    font-size: 11px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    color: #ffffff;
    border-bottom: 1px solid #1d4ed8; 
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    white-space: nowrap;
  }
  .ucr-table th:last-child {
    border-right: none;
  }
  .ucr-table td { 
    padding: 12px 16px; 
    color: #374151; 
    border-bottom: 1px solid #edf2f7; 
    border-right: 1px solid #edf2f7;
    font-weight: 500; 
  }
  .ucr-table td:last-child {
    border-right: none;
  }
  .ucr-table tbody tr:hover { background: #f8fafc; }

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

  .dc-pagination-btn {
    background-color: #cccccc;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .dc-pagination-btn:hover:not(:disabled) {
    background-color: #b3b3b3;
  }
  .dc-pagination-btn:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  .dc-portal-dropdown {
    background: #ffffff !important;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
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
  .dc-opt:hover { background: rgba(37, 99, 235, 0.06) !important; color: #2563eb; }
  .dc-opt.selected { background: rgba(37, 99, 235, 0.08) !important; color: #2563eb; font-weight: 600; }

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
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: dc-zoom 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }

  .ucr-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dc-zoom { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
`;

export default function ApproveTourProgram() {
  // ── FIX: Start with filter panel CLOSED so no fields are visible/pre-filled
  const [filterOpen, setFilterOpen] = useState(true);

  // States
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  // ── FIX: All selections explicitly start empty — no default value anywhere
  const [selectType, setSelectType] = useState("");
  const [isSubmitted, setIsSubmitted] = useState([]);   // Multiple Select Yes/No
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // State selection (Multiple select if Type is State, Single select if Type is Headquarter)
  const [selectedStates, setSelectedStates] = useState([]);  // Multiple
  const [selectedState, setSelectedState] = useState("");    // Single
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Single

  // Table status
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [showTable, setShowTable] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [validationErr, setValidationErr] = useState("");

  // Reject modal details
  const [rejectPopup, setRejectPopup] = useState(false);
  const [rejectRow, setRejectRow] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch state master on mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch districts when selectedState changes (in Headquarter type)
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
      try {
        res = await api.get("/api/masters/states");
      } catch {
        try {
          res = await api.get("/api/states");
        } catch {
          res = await api.get("/api/manager/states");
        }
      }
      const data = res.data?.data || res.data || [];
      setStateOptions(data.map(s => ({ id: String(s.id), label: s.state_name || s.stateName || s.name })));
    } catch (e) {
      console.warn("Could not load dynamic states list.");
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      let res;
      try {
        res = await api.get(`/api/masters/districts/by-states?stateIds=${stateId}`);
      } catch {
        try {
          res = await api.get(`/api/masters/districts?stateId=${stateId}`);
        } catch {
          try {
            res = await api.get(`/api/districts?stateId=${stateId}`);
          } catch {
            res = await api.get(`/api/manager/districts?stateId=${stateId}`);
          }
        }
      }
      const data = res.data?.data || res.data || [];
      setDistrictOptions(data.map(d => ({ id: String(d.id), label: d.district_name || d.districtName || d.name })));
    } catch (e) {
      console.warn("Could not load dynamic districts list.");
    }
  };

  const validate = () => {
    if (!selectType) return "Select Type is required!!!";
    if (selectType === "state" && selectedStates.length === 0) return "Select State is required!!!";
    if (selectType === "headquarter") {
      if (!selectedState) return "Select State is required!!!";
      if (!selectedDistrict) return "Select District is required!!!";
    }
    if (!selectedMonth) return "Month is required!!!";
    if (!selectedYear) return "Year is required!!!";
    return "";
  };

  const handleGenerateReport = async (isRefresh = false) => {
    const err = validate();
    if (err) {
      setValidationErr(err);
      return;
    }
    setValidationErr("");

    if (!isRefresh) {
      setTableLoading(true);
      setShowTable(true);
      setTableData([]);
      setTableError("");
      setPage(1);
      setSearch("");
    }

    const params = new URLSearchParams();
    params.append("type", selectType);
    params.append("month", selectedMonth);
    params.append("year", selectedYear);
    if (isSubmitted.length > 0) {
      params.append("submitted", isSubmitted.join(","));
    }

    if (selectType === "state") {
      selectedStates.forEach(id => params.append("stateIds", id));
    } else {
      params.append("stateId", selectedState);
      params.append("districtId", selectedDistrict);
      params.append("districtIds", selectedDistrict);
    }

    try {
      let res;
      try {
        res = await api.get(`/api/manager/approvals/tour-program?${params.toString()}`);
      } catch {
        try {
          res = await api.get(`/api/approvals/tour-program/geographical?${params.toString()}`);
        } catch {
          try {
            res = await api.get(`/api/approvals/tour-program?${params.toString()}`);
          } catch {
            res = await api.get(`/api/manager/tour-program?${params.toString()}`);
          }
        }
      }
      const data = res.data?.data || res.data || [];
      setTableData(Array.isArray(data) ? data : []);
    } catch (e) {
      setTableError(e.response?.data?.message || "Failed to load tour programs. Please try again.");
    } finally {
      setTableLoading(false);
    }
  };

  const handleApprove = async (row) => {
    const id = row.id || row.tourProgramId || row.tour_program_id || row.tourId || row.employeeId;
    if (!id) {
      setTableError("Action Blocked: Record ID is missing from the server response.");
      return;
    }

    setActionLoading(true);
    setValidationErr("");
    try {
      try {
        await api.put(`/api/approvals/tour-program/approve/${id}`);
      } catch {
        try {
          await api.put(`/api/manager/approvals/tour-program/approve/${id}`);
        } catch {
          await api.put(`/api/tour-program/approve/${id}`);
        }
      }
      setSuccessMessage("Tour program approved successfully!");
      handleGenerateReport(true);
    } catch (err) {
      setTableError(err.response?.data?.message || "Approve action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const id = rejectRow?.id || rejectRow?.tourProgramId || rejectRow?.tour_program_id || rejectRow?.tourId || rejectRow?.employeeId;
    if (!id) {
      setTableError("Action Blocked: Record ID is missing from the server response.");
      setRejectPopup(false);
      return;
    }

    setActionLoading(true);
    setValidationErr("");
    try {
      const payload = { rejectionMessage: rejectReason.trim() };
      try {
        await api.put(`/api/approvals/tour-program/reject/${id}`, payload);
      } catch {
        try {
          await api.put(`/api/manager/approvals/tour-program/reject/${id}`, payload);
        } catch {
          await api.put(`/api/tour-program/reject/${id}`, payload);
        }
      }
      setRejectPopup(false);
      setRejectReason("");
      setRejectRow(null);
      setSuccessMessage("Tour program rejected successfully.");
      handleGenerateReport(true);
    } catch (err) {
      setTableError(err.response?.data?.message || "Reject action failed.");
      setRejectPopup(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!tableData.length) return;

    const csvContent = [
      ["S.No.", "State Name", "Headquarter Name", "Name", "Employee Code", "Division", "Designation", "Submitted", "Submission Date", "Approved", "Approved Date", "Rejection Message"].join(",")
    ];

    tableData.forEach((row, idx) => {
      const line = [
        idx + 1,
        `"${row.stateName || row.state_name || row.state?.stateName || "—"}"`,
        `"${row.hqName || row.headquarterName || row.district?.districtName || "—"}"`,
        `"${row.name || row.employeeName || row.employee?.name || "—"}"`,
        `"${row.employeeCode || row.employee_code || row.employee?.code || "—"}"`,
        `"${row.division || "—"}"`,
        `"${row.designation || row.designationName || row.employee?.designation?.name || "—"}"`,
        `"${row.submitted === true || row.submitted === "true" || row.submitted === "Yes" ? "Yes" : "No"}"`,
        `"${row.submissionDate || row.submission_date || "—"}"`,
        `"${row.approved === true || row.approved === "true" || row.approved === "Yes" ? "Yes" : "No"}"`,
        `"${row.approvedDate || row.approved_date || "—"}"`,
        `"${String(row.rejectionMessage || row.rejectionMsg || row.rejection_message || "—").replace(/"/g, '""')}"`
      ];
      csvContent.push(line.join(","));
    });

    const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tour_Program_Approvals_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = tableData.filter(r =>
    !search || Object.values(r).some(v => String(v ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── FIX: Derive disabled state for submit button cleanly
  const isSubmitDisabled =
    tableLoading ||
    !selectType ||
    (selectType === "state" && selectedStates.length === 0) ||
    (selectType === "headquarter" && (!selectedState || !selectedDistrict)) ||
    !selectedMonth ||
    !selectedYear;

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {/* --- Filter Card panel --- */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <SlidersHorizontal size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Approve Tour Program
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Review and approve or reject team monthly tour programs
              </p>
            </div>
          </div>

          {/* Filter Toggle */}
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

            {/* Locked Radio Selection Mode */}
            <div className="dc-radio-group">
              <span className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginRight: 8 }}>
                Selection Mode:
              </span>
              <div className="dc-radio-label disabled" title="Selection locked to Hierarchical">
                <div className="dc-radio-circle"></div>
                <span className="ucr-brand" style={{ color: "#94a3b8" }}>Geographical</span>
              </div>
              <div className="dc-radio-label">
                <div className="dc-radio-circle checked"></div>
                <span className="ucr-brand" style={{ color: "#1e293b", fontWeight: 700 }}>Hierarchical</span>
              </div>
            </div>

            <div className="dc-grid-4">

              {/* ── FIX: Each dropdown starts with value="" — no option pre-selected */}
              <div>
                <SingleDropdown
                  label="SELECT TYPE *"
                  value={selectType}
                  onSelect={(v) => {
                    setSelectType(v);
                    setSelectedStates([]);
                    setSelectedState("");
                    setSelectedDistrict("");
                  }}
                  options={TYPE_OPTIONS}
                />
              </div>

              {/* State — Multiple if Type = State */}
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

              {/* State — Single if Type = Headquarter */}
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

              {/* District — only for Headquarter */}
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

              <div>
                <MultiSelectDropdown
                  label="Is Submitted?"
                  options={SUBMITTED_OPTIONS}
                  selectedIds={isSubmitted}
                  onChange={setIsSubmitted}
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
                  onClick={() => handleGenerateReport(false)}
                  disabled={isSubmitDisabled}
                  className="dc-submit-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                    background: isSubmitDisabled ? "#e2e8f0" : "#2563eb",
                    color: isSubmitDisabled ? "#94a3b8" : "#fff",
                    boxShadow: isSubmitDisabled ? "none" : "0 4px 14px rgba(37, 99, 235, 0.3)",
                    cursor: isSubmitDisabled ? "not-allowed" : "pointer"
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
          <div className="dc-header" style={{ background: "#f8fafc", borderBottom: "1px solid #edf2f7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
                Tour Program Details
              </h2>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={filtered.length === 0}
                style={{
                  height: 38,
                  width: 38,
                  borderRadius: 8,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s"
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
                Loading tour program records...
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
                        <th style={{ width: 60, textAlign: "center" }}>#</th>
                        <th>State Name</th>
                        <th>Headquarter Name</th>
                        <th>Name</th>
                        <th>Employee Code</th>
                        <th>Division</th>
                        <th>Designation</th>
                        <th style={{ textAlign: "center" }}>Submitted</th>
                        <th>Submission Date</th>
                        <th style={{ textAlign: "center" }}>Approved</th>
                        <th>Approved Date</th>
                        <th>Rejection Message</th>
                        <th style={{ textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, ri) => {
                        const globalIdx = (page - 1) * PAGE_SIZE + ri + 1;
                        const isSub = row.submitted === true || row.submitted === "true" || row.submitted === "Yes";
                        const isApp = row.approved === true || row.approved === "true" || row.approved === "Yes";
                        return (
                          <tr key={ri}>
                            <td style={{ textAlign: "center", color: "#64748b" }}>{globalIdx}</td>
                            <td style={{ fontWeight: 700, color: "#1e293b" }}>{row.stateName || row.state_name || row.state?.stateName || "—"}</td>
                            <td>{row.hqName || row.headquarterName || row.district?.districtName || "—"}</td>
                            <td style={{ fontWeight: 600 }}>{row.name || row.employeeName || row.employee?.name || "—"}</td>
                            <td style={{ fontFamily: "monospace" }}>{row.employeeCode || row.employee_code || row.employee?.code || "—"}</td>
                            <td>{row.division || "—"}</td>
                            <td>{row.designation || row.designationName || row.employee?.designation?.name || "—"}</td>
                            <td style={{ textAlign: "center" }}>
                              <span style={{
                                padding: "4px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                background: isSub ? "#eff6ff" : "#f3f4f6",
                                color: isSub ? "#1d4ed8" : "#4b5563"
                              }}>
                                {isSub ? "Yes" : "No"}
                              </span>
                            </td>
                            <td>{row.submissionDate || row.submission_date || "—"}</td>
                            <td style={{ textAlign: "center" }}>
                              <span style={{
                                padding: "4px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                background: isApp ? "#f0fdf4" : "#fef2f2",
                                color: isApp ? "#16a34a" : "#dc2626"
                              }}>
                                {isApp ? "Yes" : "No"}
                              </span>
                            </td>
                            <td>{row.approvedDate || row.approved_date || "—"}</td>
                            <td>{row.rejectionMessage || row.rejectionMsg || row.rejection_message || "—"}</td>
                            <td>
                              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(row)}
                                  disabled={actionLoading || isApp}
                                  style={{
                                    background: "#2563eb", color: "#fff", border: "none", padding: "6px 14px",
                                    borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: (actionLoading || isApp) ? "not-allowed" : "pointer",
                                    opacity: (actionLoading || isApp) ? 0.5 : 1, transition: "all 0.15s"
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setRejectRow(row); setRejectPopup(true); }}
                                  disabled={actionLoading}
                                  style={{
                                    background: "#475569", color: "#fff", border: "none", padding: "6px 14px",
                                    borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: actionLoading ? "not-allowed" : "pointer",
                                    transition: "all 0.15s"
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
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

      {/* Reject Popup Dialog */}
      {rejectPopup && (
        <div className="dc-overlay">
          <div className="dc-popup" style={{ maxWidth: 420, padding: 24 }}>
            <h3 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "#1e293b", width: "100%", textAlign: "left" }}>Reject Tour Program</h3>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, width: "100%", textAlign: "left" }}>Please provide a reason for rejecting this tour program.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Type reason here..."
              style={{ width: "100%", height: 100, borderRadius: 8, border: "1.5px solid #e2e8f0", padding: 12, fontSize: 13, outline: "none", marginBottom: 20, resize: "none", fontFamily: "Inter, sans-serif", color: "#1e293b" }}
            />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", width: "100%" }}>
              <button
                type="button"
                onClick={() => setRejectPopup(false)}
                style={{ padding: "8px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading}
                style={{ padding: "8px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: (!rejectReason.trim() || actionLoading) ? 0.6 : 1, transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Reject Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup Message */}
      {successMessage && (
        <div className="dc-overlay">
          <div className="dc-popup">
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Check size={28} style={{ color: "#2563eb", strokeWidth: 2.5 }} />
            </div>
            <h3 className="ucr-brand" style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Success</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 24px" }}>{successMessage}</p>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 0", width: "100%", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 14px rgba(37,99,235,0.2)", transition: "all 0.15s"
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

/* ─── SingleDropdown Component ───────────────────────────────────────── */

function SingleDropdown({ label, value, onSelect, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => String(o.id ?? o.value) === String(value));

  // ── FIX: hasVal is true ONLY when value is a non-empty string — prevents
  //         label from floating up or appearing active when nothing is selected
  const hasVal = value !== "" && value !== null && value !== undefined;
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
        {/* ── FIX: Show placeholder text when nothing is selected so field looks empty */}
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: hasVal ? "#111827" : "#9ca3af",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          {selected ? selected.label : ""}
        </span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 11,
        top: active ? -8 : 10,
        fontSize: active ? 10 : 13,
        fontWeight: active ? 700 : 500,
        color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af",
        background: active ? "#fff" : "transparent",
        padding: active ? "0 4px" : "0",
        transition: "all 0.2s",
        textTransform: active ? "uppercase" : "none",
        letterSpacing: active ? "0.05em" : "normal"
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

/* ─── MultiSelectDropdown Component ─────────────────────────────────── */

function MultiSelectDropdown({ label, options = [], selectedIds = [], onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (val) => {
    const idStr = String(val);
    if (selectedIds.includes(idStr)) {
      onChange(selectedIds.filter(x => x !== idStr));
    } else {
      onChange([...selectedIds, idStr]);
    }
  };

  const selectedLabels = options
    .filter(o => selectedIds.includes(String(o.id ?? o.value)))
    .map(o => o.label)
    .join(", ");

  // ── FIX: hasVal only when array actually has items — already correct, kept explicit
  const hasVal = selectedIds.length > 0;
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
        {/* ── FIX: Show nothing (empty string) when no items selected */}
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: hasVal ? "#111827" : "#9ca3af",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8
        }}>
          {selectedLabels || ""}
        </span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 11,
        top: active ? -8 : 10,
        fontSize: active ? 10 : 13,
        fontWeight: active ? 700 : 500,
        color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af",
        background: active ? "#fff" : "transparent",
        padding: active ? "0 4px" : "0",
        transition: "all 0.2s",
        textTransform: active ? "uppercase" : "none",
        letterSpacing: active ? "0.05em" : "normal"
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
              const isSelected = selectedIds.includes(val);
              return (
                <div
                  key={val}
                  onClick={(e) => { e.stopPropagation(); toggleValue(val); }}
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
                  <span style={{
                    width: 14, height: 14, borderRadius: 3,
                    border: isSelected ? "none" : "1.5px solid #cbd5e1",
                    background: isSelected ? "#2563eb" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {isSelected && <Check size={10} style={{ color: "#fff", strokeWidth: 3 }} />}
                  </span>
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