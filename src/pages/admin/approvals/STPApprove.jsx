import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Loader2,
  AlertCircle,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Trash2,
  Search,
  FileSpreadsheet
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

  .dc-divider {
    border: none;
    border-top: 1px solid #f1f5f9;
    margin: 24px 0 28px;
  }

  /* ── Responsive Input Grids ── */
  .dc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }

  @media(max-width: 1024px) {
    .dc-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  }
  @media(max-width: 640px) {
    .dc-grid { grid-template-columns: 1fr; gap: 20px; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; }
    .dc-submit-btn, .dc-delete-footer-btn { width: 100% !important; justify-content: center !important; }
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
    margin-bottom: 16px;
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

  .dc-delete-footer-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #fecaca;
    background: #ffffff !important;
    color: #dc2626;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: 'Plus Jakarta Sans', sans-serif;
    height: 40px;
  }
  .dc-delete-footer-btn:hover:not(:disabled) {
    background: #fef2f2 !important;
    border-color: #fca5a5;
  }
  .dc-delete-footer-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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

const PAGE_SIZES = [10, 20, 50];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending By Manager" },
  { value: "APPROVED", label: "Approved By Manager" },
];

function toCamelCaseKey(key) {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const obj = {};
    Object.entries(value).forEach(([key, val]) => {
      obj[toCamelCaseKey(key)] = normalizeValue(val);
    });
    return obj;
  }
  return value;
}

function parseResponse(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(normalizeValue);
  if (raw.data) {
    if (Array.isArray(raw.data)) return raw.data.map(normalizeValue);
    if (Array.isArray(raw.data?.content)) return raw.data.content.map(normalizeValue);
    if (Array.isArray(raw.data?.rows)) return raw.data.rows.map(normalizeValue);
    const inner = raw.data.content || raw.data.rows || raw.data.result;
    if (Array.isArray(inner)) return inner.map(normalizeValue);
  }
  return [];
}

function getVal(row, keys, fallback = "—") {
  for (const key of keys) {
    const val = row?.[key];
    if (val !== undefined && val !== null && val !== "") return val;
  }
  return fallback;
}

// Fixed Record ID matching mapping signature safely
function getRecordId(row) {
  return (
    row?.stpId ??
    row?.id ??
    row?.detailId ??
    row?.routeId ??
    row?.stp_detail_id ??
    row?.stpDetailId ??
    null
  );
}

function getRequestApprovedValue(row) {
  const direct = getVal(
    row,
    ["approvedByMgr", "approved_by_mgr", "approvedByManager", "approvedBy"],
    ""
  );
  if (direct === true || direct === "Yes" || direct === "YES" || direct === "APPROVED") return "Yes";
  if (direct === false || direct === "No" || direct === "NO" || direct === "PENDING") return "No";
  return getVal(row, ["requestStatus", "request_status"], "") === "APPROVED" ? "Yes" : "No";
}

export default function STPApprove() {
  const [filterOpen, setFilterOpen] = useState(true);

  // ── Level 1: Geography summary ────────────────────────────────────────────
  const [stateData, setStateData] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [statePage, setStatePage] = useState(1);
  const [statePageSize, setStatePageSize] = useState(20);

  // ── Level 2: Employee summary ─────────────────────────────────────────────
  const [selectedState, setSelectedState] = useState(null);
  const [empData, setEmpData] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [empPage, setEmpPage] = useState(1);
  const [empPageSize, setEmpPageSize] = useState(20);

  // ── Level 3: STP details ──────────────────────────────────────────────────
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [requestStatus, setRequestStatus] = useState("");
  const [stpData, setStpData] = useState([]);
  const [stpLoading, setStpLoading] = useState(false);
  const [stpPage, setStpPage] = useState(1);
  const [stpPageSize, setStpPageSize] = useState(20);
  const [checkedIds, setCheckedIds] = useState([]);
  const [stpVisible, setStpVisible] = useState(false);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    fetchGeographySummary();
  }, []);

  useEffect(() => {
    if (selectedEmp && requestStatus) {
      fetchSTPDetails(selectedEmp, requestStatus);
    } else {
      setStpData([]);
      setStpVisible(false);
      setCheckedIds([]);
    }
  }, [selectedEmp, requestStatus]);

  const fetchGeographySummary = async () => {
    setStateLoading(true);
    setError("");
    try {
      const res = await api.get("/api/approvals/stp/geography-summary");
      setStateData(parseResponse(res.data));
    } catch (err) {
      setError("Failed to load STP summary.");
    } finally {
      setStateLoading(false);
    }
  };

  const handleStateClick = async (row) => {
    setSelectedState(row);
    setSelectedEmp(null);
    setRequestStatus("");
    setStpData([]);
    setStpVisible(false);
    setCheckedIds([]);
    setEmpPage(1);
    setEmpLoading(true);
    setError("");

    try {
      const districtId = row.districtId ?? row.id;
      const res = await api.get(
        `/api/approvals/stp/employee-summary?districtId=${districtId}`
      );
      setEmpData(parseResponse(res.data));
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setEmpLoading(false);
    }
  };

  const handleEmpClick = (emp) => {
    setSelectedEmp(emp);
    setRequestStatus("");
    setStpData([]);
    setStpVisible(false);
    setCheckedIds([]);
    setStpPage(1);
  };

  const fetchSTPDetails = async (emp, status) => {
    setStpLoading(true);
    setCheckedIds([]);
    setStpPage(1);

    try {
      const empId = emp.employeeId ?? emp.id;
      const res = await api.get(
        `/api/approvals/stp/details?employeeId=${empId}&requestStatus=${status}`
      );
      setStpData(parseResponse(res.data));
      setStpVisible(true);
    } catch (err) {
      setError("Failed to load STP details.");
    } finally {
      setStpLoading(false);
    }
  };

  const handleApproveSTP = async () => {
    if (!checkedIds.length) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await api.post("/api/approvals/stp/approve", checkedIds);
      if (res.status === 200 || res.data?.success) {
        setPopup({ isOpen: true, message: `${checkedIds.length} STP records approved successfully!` });
        setCheckedIds([]);
        await fetchSTPDetails(selectedEmp, requestStatus);
      } else {
        setError("Approval action didn't succeed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Approve failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSTP = async () => {
    if (!checkedIds.length) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await api.delete("/api/approvals/stp/delete", { data: checkedIds });
      if (res.status === 200 || res.data?.success) {
        setPopup({ isOpen: true, message: `${checkedIds.length} STP records deleted successfully!` });
        setCheckedIds([]);
        await fetchSTPDetails(selectedEmp, requestStatus);
      } else {
        setError("Deletion action didn't succeed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCheck = (id) =>
    setCheckedIds((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));

  const toggleAll = (ids) =>
    setCheckedIds((p) => (p.length === ids.length ? [] : ids));

  const paged = (data, page, size) => data.slice((page - 1) * size, page * size);

  const stateRows = paged(stateData, statePage, statePageSize);
  const empRows = paged(empData, empPage, empPageSize);
  const stpRows = paged(stpData, stpPage, stpPageSize);
  const allStpIds = stpRows.map(getRecordId).filter((id) => id !== null);

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Level 1: State Summary Card */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <SlidersHorizontal size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Employee STP Approval</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Manage employee tour plans</p>
            </div>
          </div>
          <button type="button" onClick={() => setFilterOpen(!filterOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
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
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: "center" }}>S.No.</th>
                    <th>State</th>
                    <th>Headquarter</th>
                    <th style={{ textAlign: "center" }}>Emp Count</th>
                  </tr>
                </thead>
                <tbody>
                  {stateLoading ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                        <Loader2 size={20} style={{ animation: "dc-spin 1s linear infinite", color: "#3B82F6", margin: "0 auto" }} />
                      </td>
                    </tr>
                  ) : stateRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    stateRows.map((row, i) => (
                      <tr
                        key={row.districtId ?? row.id ?? i}
                        style={{ background: (selectedState?.districtId ?? selectedState?.id) === (row.districtId ?? row.id) ? "rgba(59, 130, 246, 0.05)" : "transparent" }}
                      >
                        <td style={{ textAlign: "center", color: "#64748b" }}>{(statePage - 1) * statePageSize + i + 1}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleStateClick(row)}
                            style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13.5px" }}
                          >
                            {getVal(row, ["stateName", "state_name", "state"])}
                          </button>
                        </td>
                        <td>{getVal(row, ["headquarter", "headquarterName", "hqName", "districtName", "district_name"])}</td>
                        <td style={{ textAlign: "center", fontWeight: 700, color: "#1e293b" }}>
                          {getVal(row, ["employeeCount", "employee_count", "empCount", "count", "totalPending", "total_pending"])}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationFooter
              data={stateData}
              page={statePage}
              pageSize={statePageSize}
              setPage={setStatePage}
              setPageSize={setStatePageSize}
            />
          </div>
        )}
      </div>

      {/* Level 2: Employee List Card */}
      {selectedState && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              EMPLOYEES: {getVal(selectedState, ["stateName", "state_name", "state"]).toUpperCase()}
            </h1>
          </div>
          <div className="dc-body">
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: "center" }}>S.No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th style={{ textAlign: "center" }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {empLoading ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                        <Loader2 size={20} style={{ animation: "dc-spin 1s linear infinite", color: "#3B82F6", margin: "0 auto" }} />
                      </td>
                    </tr>
                  ) : empRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    empRows.map((row, i) => {
                      const empId = row.employeeId ?? row.id;
                      const selId = selectedEmp?.employeeId ?? selectedEmp?.id;
                      return (
                        <tr
                          key={empId ?? i}
                          style={{ background: selId === empId ? "rgba(59, 130, 246, 0.05)" : "transparent" }}
                        >
                          <td style={{ textAlign: "center", color: "#64748b" }}>{(empPage - 1) * empPageSize + i + 1}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleEmpClick(row)}
                              style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13.5px" }}
                            >
                              {getVal(row, ["employeeName", "name", "employee_name"])}
                            </button>
                          </td>
                          <td>{getVal(row, ["designationName", "designation", "designation_name"])}</td>
                          <td style={{ textAlign: "center", fontWeight: 700, color: "#1e293b" }}>
                            {getVal(row, ["pendingRouteCount", "pending_route_count", "totalSTPRequests", "totalStpRequests", "total_stp_requests"])}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <PaginationFooter
              data={empData}
              page={empPage}
              pageSize={empPageSize}
              setPage={setEmpPage}
              setPageSize={setEmpPageSize}
            />
          </div>
        </div>
      )}

      {/* Level 3: STP Details Card */}
      {selectedEmp && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              STP FOR: {getVal(selectedEmp, ["employeeName", "name", "employee_name"]).toUpperCase()}
            </h1>
          </div>

          <div className="dc-body">
            {/* Status dropdown */}
            <div className="dc-grid">
              <FSelect
                label="Select Status"
                name="requestStatus"
                value={requestStatus}
                onChange={(e) => setRequestStatus(e.target.value)}
                options={STATUS_OPTIONS.map((o) => ({ id: o.value, label: o.label }))}
              />
            </div>

            {(stpVisible || stpLoading) && (
              <>
                <div className="ucr-table-container">
                  <table className="ucr-table">
                    <thead>
                      <tr>
                        <th style={{ width: 44, textAlign: "center" }}>
                          <input
                            type="checkbox"
                            onChange={() => toggleAll(allStpIds)}
                            checked={allStpIds.length > 0 && allStpIds.every((id) => checkedIds.includes(id))}
                            style={{ accentColor: "#3B82F6", width: 14, height: 14, cursor: "pointer" }}
                          />
                        </th>
                        <th>S.No.</th>
                        <th>From Area</th>
                        <th>To Area</th>
                        <th>Activity</th>
                        <th>Type</th>
                        <th>Dist.</th>
                        <th>Freq.</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stpLoading ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: "center", padding: 40 }}>
                            <Loader2 size={20} style={{ animation: "dc-spin 1s linear infinite", color: "#3B82F6", margin: "0 auto" }} />
                          </td>
                        </tr>
                      ) : stpRows.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                            No STP records found.
                          </td>
                        </tr>
                      ) : (
                        stpRows.map((row, i) => {
                          const rowId = getRecordId(row);
                          const isChecked = rowId !== null && checkedIds.includes(rowId);
                          const approvedByMgr = getRequestApprovedValue(row);

                          return (
                            <tr
                              key={rowId ?? i}
                              onClick={() => rowId !== null && toggleCheck(rowId)}
                              style={{ cursor: "pointer", background: isChecked ? "rgba(59, 130, 246, 0.05)" : "transparent" }}
                            >
                              <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => rowId !== null && toggleCheck(rowId)}
                                    style={{ accentColor: "#3B82F6", width: 14, height: 14, cursor: "pointer" }}
                                  />
                              </td>
                              <td style={{ color: "#64748b" }}>{(stpPage - 1) * stpPageSize + i + 1}</td>
                              <td style={{ fontWeight: 600, color: "#1e293b" }}>{getVal(row, ["fromArea", "from_area", "fromAreaName", "from_area_name"])}</td>
                              <td style={{ fontWeight: 600, color: "#1e293b" }}>{getVal(row, ["toArea", "to_area", "toAreaName", "to_area_name"])}</td>
                              <td>{getVal(row, ["frc", "activity", "activityName", "activity_type"])}</td>
                              <td>{getVal(row, ["areaType", "area_type", "type"])}</td>
                              <td>{getVal(row, ["distance", "distanceKm", "distance_km"])} km</td>
                              <td>{getVal(row, ["frequencyVisit", "frequency_visit", "freqVisit", "freq_visit"])}</td>
                              <td>
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    padding: "3px 10px",
                                    borderRadius: 20,
                                    background: approvedByMgr === "Yes" ? "#f0fdf4" : "#f8fafc",
                                    color: approvedByMgr === "Yes" ? "#16a34a" : "#64748b",
                                    border: `1px solid ${approvedByMgr === "Yes" ? "#bbf7d0" : "#e2e8f0"}`
                                  }}
                                >
                                  {approvedByMgr}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationFooter
                  data={stpData}
                  page={stpPage}
                  pageSize={stpPageSize}
                  setPage={setStpPage}
                  setPageSize={setStpPageSize}
                />
              </>
            )}
          </div>

          {/* Action buttons */}
          {stpVisible && (
            <div className="dc-footer" style={{ gap: 12 }}>
              {checkedIds.length > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: 20, border: "1px solid #dbeafe", marginRight: "auto", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {checkedIds.length} selected
                </span>
              )}
              <button
                type="button"
                onClick={handleDeleteSTP}
                disabled={!checkedIds.length || isSubmitting}
                className="dc-delete-footer-btn"
              >
                {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Trash2 size={14} />}
                Delete Selected
              </button>
              <button
                type="button"
                onClick={handleApproveSTP}
                disabled={!checkedIds.length || isSubmitting}
                className="dc-submit-btn"
              >
                {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Check size={14} />}
                Approve STP
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Success Popup ── */}
      {popup.isOpen && (
        <div className="dc-overlay">
          <div className="dc-popup">
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Check size={28} style={{ color: "#3B82F6", strokeWidth: 2.5 }} />
            </div>
            <h3 className="ucr-brand" style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Success</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 24px" }}>{popup.message}</p>
            <button
              type="button"
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

// ═══════════════════════════════════════════════════════════════════
// FSelect — Searchable Portal Dropdown Component (Fixed Signature Event Parameters)
// ═══════════════════════════════════════════════════════════════════
function FSelect({ label, name, value, onChange, disabled, options = [] }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
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

  const selected = options.find((o) => String(o.id) === String(value));
  const hasVal = Boolean(value);
  const active = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow  = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open ? 100 : 1 }} className="dc-field-wrap">
      <div
        onClick={handleTriggerClick}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor + " !important",
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
          {selected?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", transition: "all 0.2s" }}>
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label
        style={{
          position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
          transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
          transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
        }}
      >
        {label}
      </label>
      {open && !disabled && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 && <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>}
            {options.map((opt) => (
              <li
                key={opt.id}
                className={`dc-opt${String(value) === String(opt.id) ? " selected" : ""}`}
                style={{
                  padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                  color: String(value) === String(opt.id) ? "#2563eb" : "#475569",
                  backgroundColor: String(value) === String(opt.id) ? "rgba(59,130,246,0.08)" : "#ffffff",
                  fontWeight: String(value) === String(opt.id) ? "600" : "500"
                }}
                onMouseDown={(e) => { 
                  e.preventDefault(); 
                  onChange({ target: { name, value: String(opt.id) } }); 
                  setOpen(false); 
                }}
              >
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

// ─── PaginationFooter ─────────────────────────────────────────────────────────
function PaginationFooter({ data, page, pageSize, setPage, setPageSize }) {
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const from = data.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, data.length);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, padding: "12px 16px", borderTop: "1px solid #edf2f7", background: "#f8fafc", fontSize: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#64748b" }}>Items per page:</span>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 8px", outline: "none", cursor: "pointer", color: "#475569", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <span style={{ color: "#64748b", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
        {from} – {to} of {data.length}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        <NavBtn icon={<ChevronsLeft size={13} />} onClick={() => setPage(1)} disabled={page === 1} />
        <NavBtn icon={<ChevronLeft size={13} />} onClick={() => setPage(page - 1)} disabled={page === 1} />
        <NavBtn icon={<ChevronRight size={13} />} onClick={() => setPage(page + 1)} disabled={page === totalPages} />
        <NavBtn icon={<ChevronsRight size={13} />} onClick={() => setPage(totalPages)} disabled={page === totalPages} />
      </div>
    </div>
  );
}

// ─── NavBtn ───────────────────────────────────────────────────────────────────
// Opaque white parameters explicitly defined to clear transparency bugs on mobile layers
function NavBtn({ icon, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "not-allowed" : "pointer", color: "#475569", opacity: disabled ? 0.4 : 1, transition: "all 0.15s" }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#f8fafc"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "#ffffff"; }}
    >
      {icon}
    </button>
  );
}