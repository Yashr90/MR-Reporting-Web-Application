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
  X,
  ArrowLeft,
  ClipboardList
} from "lucide-react";
import api from "../../../services/api";

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

  /* ── Summary Inner Grid ── */
  .ucr-summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
  .ucr-summary-col  { padding: 0; }
  .ucr-summary-divider { border-left: 1px solid #edf2f7; }

  /* ── Responsive Input Grids ── */
  .dc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }

  @media(max-width: 900px) {
    .ucr-summary-grid { grid-template-columns: 1fr; }
    .ucr-summary-divider { border-left: none; border-top: 1px solid #edf2f7; }
  }

  @media(max-width: 640px) {
    .dc-grid { grid-template-columns: 1fr; gap: 20px; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; }
    .dc-submit-btn, .dc-delete-footer-btn, .ucr-action-btn { width: 100% !important; justify-content: center !important; }
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

  /* ── Responsive Premium Table Container with Spaced Rows ── */
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
  
  /* Proper, Professional Spacing Setup */
  .ucr-table th { 
    padding: 16px 24px; 
    font-size: 11px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    color: #64748b;
    border-bottom: 1px solid #edf2f7; 
    white-space: nowrap;
  }
  .ucr-table td { 
    padding: 16px 24px; 
    color: #475569; 
    border-bottom: 1px solid #f8fafc; 
    font-weight: 500; 
    white-space: nowrap; 
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

  /* ── Action Buttons Styles ── */
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

const LEVEL = { MAIN: "main", USER_LIST: "userList", FINAL_LIST: "finalList" };

const ENTITIES = [
  { category: "area",     label: "Area" },
  { category: "doctor",    label: "Doctor" },
  { category: "provider", label: "Chemist / Stockist" },
];

export default function MasterData() {
  const [level,        setLevel]        = useState(LEVEL.MAIN);
  const [reqType,      setReqType]      = useState(null);
  const [category,     setCategory]     = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [counts,    setCounts]    = useState({ additions: {}, deletions: {} });
  const [userList,  setUserList]  = useState([]);
  const [finalList, setFinalList] = useState([]);

  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState("");
  const [popup,        setPopup]        = useState({ isOpen: false, message: "" });
  const [checkedIds,   setCheckedIds]   = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rejectPopup,  setRejectPopup]  = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => { fetchCounts(); }, []);

  const fetchCounts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/approvals/counts");
      if (res.data?.success) setCounts(res.data.data);
      else if (res.data?.additions) setCounts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountClick = async (type, cat) => {
    setReqType(type);
    setCategory(cat);
    setCheckedIds([]);
    setError("");
    setPopup({ isOpen: false, message: "" });
    setIsLoading(true);
    try {
      const res = await api.get(`/api/approvals/summary/${cat}/${type}`);
      const data = res.data?.data || res.data || [];
      setUserList(Array.isArray(data) ? data : []);
      setLevel(LEVEL.USER_LIST);
    } catch {
      setError("Failed to load user requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setCheckedIds([]);
    setError("");
    setPopup({ isOpen: false, message: "" });
    setIsLoading(true);
    try {
      const employeeId = user.employeeId || user.id || user.employee_id;
      const res = await api.get(
        `/api/approvals/details/${category}/${reqType}/${employeeId}`
      );
      const data = res.data?.data || res.data || [];
      setFinalList(Array.isArray(data) ? data : []);
      setLevel(LEVEL.FINAL_LIST);
    } catch {
      setError("Failed to load final list.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setError("");
    setPopup({ isOpen: false, message: "" });
    setCheckedIds([]);
    if (level === LEVEL.FINAL_LIST) {
      setLevel(LEVEL.USER_LIST);
      setSelectedUser(null);
    } else {
      setLevel(LEVEL.MAIN);
      setReqType(null);
      setCategory(null);
      fetchCounts();
    }
  };

  const toggleCheck = (id)  => setCheckedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  const toggleAll   = (ids) => setCheckedIds((p) => p.length === ids.length ? [] : ids);

  const refreshFinal = async () => {
    const employeeId = selectedUser?.employeeId || selectedUser?.id || selectedUser?.employee_id;
    const res = await api.get(`/api/approvals/details/${category}/${reqType}/${employeeId}`);
    const data = res.data?.data || res.data || [];
    setFinalList(Array.isArray(data) ? data : []);
  };

  const handleApprove = async () => {
    if (!checkedIds.length) return setError("Please select at least one record.");
    setIsSubmitting(true);
    setError("");
    try {
      const res = await api.post(
        `/api/approvals/approve/${category}/${reqType}`,
        checkedIds
      );
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setPopup({ isOpen: true, message: `${checkedIds.length} record(s) approved successfully!` });
        setCheckedIds([]);
        await refreshFinal();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Approve failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `/api/approvals/reject/${category}/${reqType}`,
        checkedIds
      );
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setRejectPopup(false);
        setRejectReason("");
        setPopup({ isOpen: true, message: `${checkedIds.length} record(s) rejected.` });
        setCheckedIds([]);
        await refreshFinal();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Reject failed.");
      setRejectPopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!checkedIds.length) return setError("Please select at least one record.");
    setIsSubmitting(true);
    setError("");
    try {
      const res = await api.post(
        `/api/approvals/approve/${category}/${reqType}`,
        checkedIds
      );
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setPopup({ isOpen: true, message: `${checkedIds.length} record(s) deleted successfully!` });
        setCheckedIds([]);
        await refreshFinal();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const entityLabel = ENTITIES.find((e) => e.category === category)?.label || category;

  const crumbs = () => {
    const parts = ["Approval Master"];
    if (level !== LEVEL.MAIN) {
      parts.push(reqType === "addition" ? "Addition" : "Deletion");
      parts.push(`${entityLabel} Requests`);
    }
    if (level === LEVEL.FINAL_LIST) {
      parts.push(selectedUser?.employeeName || selectedUser?.userName || "");
    }
    return parts;
  };

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* ── Page Card Header ──────────────────────────────────────────────── */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {level !== LEVEL.MAIN && (
              <button
                type="button"
                onClick={goBack}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: "1px solid #e2e8f0", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, color: "#64748b", transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="dc-page-icon">
              <ClipboardList size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Approval Master</h1>
              {level === LEVEL.MAIN ? (
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Review and manage master data approvals</p>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
                  {crumbs().map((c, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <ChevronRight size={11} style={{ color: "#cbd5e1", flexShrink: 0 }} />}
                      <span style={{ fontSize: 11, fontWeight: i === crumbs().length - 1 ? 700 : 400, color: i === crumbs().length - 1 ? "#2563eb" : "#94a3b8", whiteSpace: "nowrap" }}>
                        {c}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── LEVEL 1 ── */}
        {!isLoading && level === LEVEL.MAIN && (
          <div className="dc-body" style={{ padding: 0 }}>
            <div className="ucr-summary-grid">
              <div className="ucr-summary-col">
                <SummaryPanel
                  title="Addition Requests"
                  accentColor="blue"
                  counts={counts.additions || {}}
                  reqType="addition"
                  entities={ENTITIES}
                  onCountClick={handleCountClick}
                />
              </div>
              <div className="ucr-summary-col ucr-summary-divider">
                <SummaryPanel
                  title="Deletion Requests"
                  accentColor="red"
                  counts={counts.deletions || {}}
                  reqType="deletion"
                  entities={ENTITIES}
                  onCountClick={handleCountClick}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={24} style={{ animation: "dc-spin 1s linear infinite", color: "#3B82F6" }} />
        </div>
      )}

      {/* ── LEVEL 2 ── */}
      {!isLoading && level === LEVEL.USER_LIST && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              USER'S {entityLabel.toUpperCase()} {reqType === "addition" ? "ADDITION" : "DELETION"} REQUESTS
            </h1>
            {userList.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, background: "#edf2f7", color: "#475569", padding: "3px 10px", borderRadius: 20 }}>
                {userList.length} user{userList.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="dc-body">
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: "center" }}>SN.</th>
                    <th>State Name</th>
                    <th>Headquarter Name</th>
                    <th>User Name</th>
                    <th style={{ textAlign: "center" }}>Total Request</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.length === 0 ? (
                    <EmptyRow cols={5} />
                  ) : (
                    userList.map((row, i) => (
                      <tr key={row.employeeId || i}>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{row.stateName || "—"}</td>
                        <td style={{ fontWeight: 500 }}>{row.districtName || "—"}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.employeeName || "—"}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleUserClick(row)}
                            style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13.5 }}
                          >
                            {row.totalRequests || 0}
                            <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── LEVEL 3 ── */}
      {!isLoading && level === LEVEL.FINAL_LIST && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {entityLabel.toUpperCase()} REQUESTS <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>— {selectedUser?.employeeName}</span>
            </h1>
          </div>
          <div className="dc-body">
            <div className="ucr-table-container">
              <FinalTable
                category={category}
                rows={finalList}
                checkedIds={checkedIds}
                onToggle={toggleCheck}
                onToggleAll={toggleAll}
              />
            </div>
          </div>

          <div className="dc-footer" style={{ gap: 12 }}>
            {checkedIds.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: 20, border: "1px solid #dbeafe", marginRight: "auto", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {checkedIds.length} selected
              </span>
            )}
            {reqType === "addition" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!checkedIds.length) return setError("Please select at least one record.");
                    setError(""); setRejectReason(""); setRejectPopup(true);
                  }}
                  disabled={!checkedIds.length || isSubmitting}
                  className="dc-delete-footer-btn"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={!checkedIds.length || isSubmitting}
                  className="dc-submit-btn"
                >
                  {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Check size={14} />} Approve
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!checkedIds.length) return setError("Please select at least one record.");
                    setError(""); setRejectReason(""); setRejectPopup(true);
                  }}
                  disabled={!checkedIds.length || isSubmitting}
                  className="dc-delete-footer-btn"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!checkedIds.length || isSubmitting}
                  className="dc-submit-btn"
                  style={{ background: "#e11d48 !important", boxHighlight: "rgba(225,29,72,0.3)" }}
                >
                  {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Trash2 size={14} />} Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── REJECT POPUP ── */}
      {rejectPopup && (
        <div className="dc-overlay">
          <div className="dc-popup" style={{ maxWidth: 420, padding: 24 }}>
            <h3 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "#1e293b", width: "100%", textAlign: "left" }}>Rejection Message</h3>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, width: "100%", textAlign: "left" }}>Provide a reason for rejecting {checkedIds.length} record(s).</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Type reason here…" style={{ width: "100%", height: 100, borderRadius: 8, border: "1.5px solid #e2e8f0", padding: 12, fontSize: 13, outline: "none", marginBottom: 20, resize: "none", fontFamily: "Inter, sans-serif", color: "#1e293b" }} />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", width: "100%" }}>
              <button type="button" onClick={() => { setRejectPopup(false); setRejectReason(""); }} style={{ padding: "8px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cancel</button>
              <button type="button" onClick={handleRejectSubmit} disabled={!rejectReason.trim() || isSubmitting} style={{ padding: "8px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: (!rejectReason.trim() || isSubmitting) ? 0.6 : 1, transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS POPUP ── */}
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
// SummaryPanel
// ═══════════════════════════════════════════════════════════════════
function SummaryPanel({ title, accentColor, counts, reqType, entities, onCountClick }) {
  const isBlue = accentColor === "blue";

  return (
    <div>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf2f7", display: "flex", alignItems: "center", gap: 12 }}>
        <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", flex: 1 }}>{title}</h3>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "3px 10px", borderRadius: 20, background: isBlue ? "rgba(59,130,246,0.06)" : "rgba(239,68,68,0.06)", color: isBlue ? "#2563eb" : "#dc2626" }}>
          {reqType}
        </span>
      </div>

      <div style={{ padding: "0 12px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <colgroup>
            <col style={{ width: "60%" }} />
            <col style={{ width: "40%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600, color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>Request For</th>
              <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600, color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.category} style={{ borderBottom: "1px solid #edf2f7" }}>
                <td style={{ padding: "16px 24px", textAlign: "center", color: "#475569", fontWeight: 500 }}>{entity.label}</td>
                <td style={{ padding: "16px 24px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => onCountClick(reqType, entity.category)}
                    style={{ background: "none", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", color: isBlue ? "#2563eb" : "#dc2626", padding: "2px 8px", borderRadius: 6 }}
                  >
                    {counts[entity.category] ?? 0}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Column Mapping matrix definitions per configuration category ───
const COLUMNS = {
  area: [
    { key: "stateName",    label: "State Name" },
    { key: "districtName", label: "Headquarter Name" },
    { key: "employeeName", label: "User Name" },
    { key: "areaName",     label: "Area Name" },
    { key: "areaCode",     label: "Area Code" },
    { key: "areaType",     label: "Type" },
  ],
  doctor: [
    { key: "stateName",    label: "State Name" },
    { key: "districtName", label: "Headquarter Name" },
    { key: "employeeName", label: "User Name" },
    { key: "areaName",     label: "Area Name" },
    { key: "doctorName",   label: "Doctor Name" },
    { key: "doctorCode",   label: "Doctor Code" },
    { key: "mslNo",        label: "MSL No." },
    { key: "phone",        label: "Mobile No." },
  ],
  provider: [
    { key: "stateName",    label: "State Name" },
    { key: "districtName", label: "Headquarter Name" },
    { key: "employeeName", label: "User Name" },
    { key: "areaName",     label: "Area Name" },
    { key: "providerName", label: "Provider Name" },
    { key: "providerCode", label: "Provider Code" },
    { key: "type",         label: "Provider Type" },
    { key: "phone",        label: "Mobile No." },
  ],
};

const getValue = (row, key) => {
  switch (key) {
    case "stateName":
      return row.district?.state?.stateName || row.district?.state?.state_name || row.state?.stateName || row.state?.state_name || row.stateName || row.state_name || "—";
    case "districtName":
      return row.district?.districtName || row.district?.district_name || row.district?.name || row.districtName || row.district_name || row.hqName || "—";
    case "employeeName":
      return row.employee?.name || row.employee?.employeeName || row.employeeName || row.userName || row.user_name || "—";
    case "areaName":
      return row.area?.areaName || row.area?.area_name || row.area?.name || row.areaName || row.area_name || "—";
    case "areaCode":
      return row.areaCode || row.area_code || row.area?.areaCode || "—";
    case "areaType":
      return row.areaType || row.area_type || row.area?.areaType || row.type || "—";
    case "doctorName":
      return row.doctorName || row.doctor_name || row.doctor?.name || row.name || "—";
    case "doctorCode":
      return row.doctorCode || row.doctor_code || row.doctor?.doctorCode || "—";
    case "mslNo":
      return row.mslNo || row.msl_no || row.doctor?.mslNo || "—";
    case "providerName":
      return row.providerName || row.provider_name || row.chemistName || row.chemist_name || row.name || "—";
    case "providerCode":
      return row.providerCode || row.provider_code || row.chemistCode || row.chemist_code || "—";
    case "phone":
      return row.phone || row.mobile || row.mobile_no || row.mobileNo || "—";
    case "type":
      return row.type || row.providerType || row.provider_type || "—";
    default:
      return row[key] ?? "—";
  }
};

// ═══════════════════════════════════════════════════════════════════
// FinalTable
// ═══════════════════════════════════════════════════════════════════
function FinalTable({ category, rows, checkedIds, onToggle, onToggleAll }) {
  const cols    = COLUMNS[category] || COLUMNS.area;
  const allIds  = rows.map((r) => r.id);
  const allChk  = allIds.length > 0 && checkedIds.length === allIds.length;
  const someChk = checkedIds.length > 0 && !allChk;

  return (
    <table className="ucr-table">
      <thead>
        <tr>
          <th style={{ width: 60, textAlign: "center" }}>
            <IndeterminateCheckbox
              checked={allChk}
              indeterminate={someChk}
              onChange={() => onToggleAll(allIds)}
            />
          </th>
          {cols.map((c) => (
            <th key={c.key}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <EmptyRow cols={cols.length + 1} />
        ) : (
          rows.map((row) => {
            const checked = checkedIds.includes(row.id);
            return (
              <tr
                key={row.id}
                onClick={() => onToggle(row.id)}
                style={{ background: checked ? "rgba(59, 130, 246, 0.05)" : "transparent" }}
              >
                <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(row.id)}
                    style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#3B82F6" }}
                  />
                </td>
                {cols.map((c) => (
                  <td key={c.key} style={{ color: checked ? "#2563eb" : "#475569" }}>
                    {getValue(row, c.key)}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

// ═══════════════════════════════════════════════════════════════════
// IndeterminateCheckbox
// ═══════════════════════════════════════════════════════════════════
function IndeterminateCheckbox({ checked, indeterminate, onChange }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      style={{
        width: 16, height: 16, borderRadius: 4,
        border: `2px solid ${checked || indeterminate ? "#3B82F6" : "#cbd5e1"}`,
        background: checked || indeterminate ? "#3B82F6" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", margin: "0 auto", transition: "all 0.15s",
        boxShadow: checked || indeterminate ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
      }}
    >
      {indeterminate && !checked ? (
        <div style={{ width: 8, height: 2, borderRadius: 2, background: "#fff" }} />
      ) : checked ? (
        <svg viewBox="0 0 12 10" style={{ width: 10, height: 8, color: "#fff" }} fill="none">
          <path
            d="M1 5l3.5 3.5L11 1"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FSelect — Searchable Portal Dropdown Component
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
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none" }} className="dc-field-wrap">
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

// ─── EmptyRow ─────────────────────────────────────────────────────────────────
function EmptyRow({ cols }) {
  return (
    <tr>
      <td colSpan={cols} style={{ padding: "48px 16px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <ClipboardList size={28} style={{ color: "#cbd5e2" }} />
          <p style={{ margin: 0, fontWeight: 500 }}>No records found.</p>
        </div>
      </td>
    </tr>
  );
}