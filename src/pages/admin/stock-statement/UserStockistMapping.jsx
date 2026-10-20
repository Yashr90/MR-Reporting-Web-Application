import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, CheckCircle2, ChevronDown,
  Check, Users, Save, ChevronLeft, ChevronRight
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZES = [5, 10, 20];
const FH = 40;

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
  .ucr-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

  @media(max-width: 991px) {
    .ucr-grid-2 { grid-template-columns: 1fr !important; gap: 24px; }
    .left-filter-col { border-right: none !important; border-bottom: 1px solid #edf2f7; padding-bottom: 24px !important; }
  }
  @media(max-width: 640px) {
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

  /* Clean grey layout scrollbar underneath selection tables */
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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 500px; }
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
  }
  .ucr-table td { 
    padding: 11px 16px; 
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

export default function UserStockistMapping() {
  // ─── App State ───────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [isLeftLoading, setIsLeftLoading] = useState(false);
  const [isRightLoading, setIsRightLoading] = useState(false);

  const [statesList, setStatesList] = useState([]);

  // Left Filter Selection states
  const [leftFilters, setLeftFilters] = useState({ stateId: "", districtIds: [] });
  const [leftDistricts, setLeftDistricts] = useState([]);
  const [stockists, setStockists] = useState([]);
  const [selectedStockistId, setSelectedStockistId] = useState(null);
  
  const [leftPage, setLeftPage] = useState(1);
  const [leftPageSize, setLeftPageSize] = useState(5);

  // Right Filter Selection states
  const [rightFilters, setRightFilters] = useState({ stateId: "", districtIds: [] });
  const [rightDistricts, setRightDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  
  const [rightPage, setRightPage] = useState(1);
  const [rightPageSize, setRightPageSize] = useState(5);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  }), []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/masters/states", getAuthHeaders());
        const stateData = res.data?.data || res.data || [];
        const normalizedStates = Array.isArray(stateData) ? stateData.map((s) => ({
          id: String(s.id ?? s.stateId),
          stateName: s.state_name || s.stateName || s.name || "Unknown"
        })) : [];
        setStatesList(normalizedStates.filter(opt => opt.id !== ""));
      } catch (err) { console.error("Failed to load states", err); }
    };
    fetchStates();
  }, [getAuthHeaders]);

  useEffect(() => {
    if (leftFilters.stateId) {
      setLeftFilters(prev => ({ ...prev, districtIds: [] }));
      api.get(`/api/masters/districts?stateId=${leftFilters.stateId}`, getAuthHeaders())
        .then(res => {
          const data = res.data?.data || res.data || [];
          setLeftDistricts(Array.isArray(data) ? data.map(d => ({
            id: String(d.id ?? d.districtId), label: d.district_name || d.districtName || d.name || "Unknown"
          })) : []);
        }).catch(err => console.error(err));
    } else {
      setLeftDistricts([]);
    }
  }, [leftFilters.stateId, getAuthHeaders]);

  useEffect(() => {
    if (leftFilters.districtIds.length > 0) {
      setIsLeftLoading(true);
      const query = `districtIds=${leftFilters.districtIds.join(',')}`;
      
      api.get(`/api/masters/stockist-mappings/stockists?stateId=${leftFilters.stateId}&${query}`, getAuthHeaders())
        .then(res => {
          const data = res.data?.data || res.data || [];
          setStockists(Array.isArray(data) ? data.map(s => ({
            id: String(s.stockistId ?? s.id ?? s.partyId ?? s.providerId ?? ""), 
            headquarterName: s.headquarterName || s.hqName || "Unknown HQ",
            stockistName: s.providerName || s.stockistName || s.stockist_name || s.partyName || s.name || "Unknown"
          })).filter(s => s.id !== "") : []); 
          setLeftPage(1);
        }).catch(err => {
          console.error("Stockist fetch error", err);
          setStockists([]);
        }).finally(() => {
          setIsLeftLoading(false);
        });
    } else {
      setStockists([]);
      setSelectedStockistId(null);
    }
  }, [leftFilters.districtIds, leftFilters.stateId, getAuthHeaders]);

  useEffect(() => {
    if (rightFilters.stateId) {
      setRightFilters(prev => ({ ...prev, districtIds: [] }));
      api.get(`/api/masters/districts?stateId=${rightFilters.stateId}`, getAuthHeaders())
        .then(res => {
          const data = res.data?.data || res.data || [];
          setRightDistricts(Array.isArray(data) ? data.map(d => ({
            id: String(d.id ?? d.districtId), label: d.district_name || d.districtName || d.name || "Unknown"
          })) : []);
        }).catch(err => console.error(err));
    } else {
      setRightDistricts([]);
    }
  }, [rightFilters.stateId, getAuthHeaders]);

  useEffect(() => {
    if (rightFilters.districtIds.length > 0) {
      setIsRightLoading(true);
      const query = `districtIds=${rightFilters.districtIds.join(',')}`;
      const stockistQuery = selectedStockistId ? `&stockistId=${selectedStockistId}` : "";
      
      api.get(`/api/masters/stockist-mappings/employees?stateId=${rightFilters.stateId}&${query}${stockistQuery}`, getAuthHeaders())
        .then(res => {
          const data = res.data?.data || res.data || [];
          const normalizedEmployees = [];
          const preSelectedIds = [];

          if (Array.isArray(data)) {
            data.forEach(e => {
              const id = String(e.employeeId ?? e.id ?? "");
              if (!id) return;
              
              const name = e.userName || e.employee_name || e.employeeName || e.name || "Unknown";
              const desig = e.designationName || e.designation_name || e.designation || "";
              
              normalizedEmployees.push({
                id,
                headquarterName: e.headquarterName || e.hqName || "Unknown HQ",
                employeeName: desig ? `${name}-(${desig})` : name
              });

              if (e.mapped) preSelectedIds.push(id);
            });
          }
          
          setEmployees(normalizedEmployees);
          setSelectedEmployeeIds(selectedStockistId ? preSelectedIds : []);
          setRightPage(1);
        }).catch(err => {
          console.error("Employee fetch error", err);
          setEmployees([]);
          setSelectedEmployeeIds([]);
        }).finally(() => {
          setIsRightLoading(false);
        });
    } else {
      setEmployees([]);
      setSelectedEmployeeIds([]);
    }
  }, [rightFilters.districtIds, rightFilters.stateId, selectedStockistId, getAuthHeaders]);

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const toggleAllEmployees = () => {
    if (selectedEmployeeIds.length === employees.length && employees.length > 0) {
      setSelectedEmployeeIds([]);
    } else {
      setSelectedEmployeeIds(employees.map(e => e.id));
    }
  };

  const handleMapSubmit = async () => {
    if (!selectedStockistId) return setError("Please select a Stockist to map.");

    setIsSubmitting(true);
    setError(""); 

    try {
      const payload = {
        stockistId: Number(selectedStockistId),
        employeeIds: selectedEmployeeIds.map(Number)
      };

      await api.put("/api/masters/stockist-mappings/map", payload, getAuthHeaders());
      setPopup({ isOpen: true, message: "Stockist mapped successfully!" });
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to map stockist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const leftTotalPages = Math.max(1, Math.ceil(stockists.length / leftPageSize));
  const pagedStockists = stockists.slice((leftPage - 1) * leftPageSize, leftPage * leftPageSize);
  const goToLeftPage = (page) => setLeftPage(Math.min(Math.max(1, page), leftTotalPages));

  const rightTotalPages = Math.max(1, Math.ceil(employees.length / rightPageSize));
  const pagedEmployees = employees.slice((rightPage - 1) * rightPageSize, rightPage * rightPageSize);
  const goToRightPage = (page) => setRightPage(Math.min(Math.max(1, page), rightTotalPages));

  const stateOpts = statesList.map(s => ({ value: String(s.id), label: s.stateName }));

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Main Header Card */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Users size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>User-Stockist Mapping</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Map stockists to employees across states and districts</p>
            </div>
          </div>
        </div>

        <div className="dc-body" style={{ padding: 0 }}>
          <div className="ucr-grid-2">
            {/* Left Filter col */}
            <div className="left-filter-col" style={{ padding: 24, borderRight: "1px solid #edf2f7" }}>
              <div style={{ marginBottom: 16 }}>
                <h3 className="ucr-brand" style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filter For Stockist Selection</h3>
              </div>
              <div className="ucr-grid-2">
                <SingleDropdown 
                  label="Select State" 
                  options={stateOpts} 
                  value={leftFilters.stateId} 
                  onSelect={(v) => setLeftFilters(prev => ({ ...prev, stateId: v }))} 
                />
                <MultiSelectDropdown 
                  label="Select District" 
                  options={leftDistricts} 
                  selectedIds={leftFilters.districtIds} 
                  onChange={(v) => setLeftFilters(prev => ({ ...prev, districtIds: v }))} 
                  disabled={!leftFilters.stateId} 
                />
              </div>
            </div>

            {/* Right Filter col */}
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <h3 className="ucr-brand" style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filter For Employee Selection</h3>
              </div>
              <div className="ucr-grid-2">
                <SingleDropdown 
                  label="Select State" 
                  options={stateOpts} 
                  value={rightFilters.stateId} 
                  onSelect={(v) => setRightFilters(prev => ({ ...prev, stateId: v }))} 
                />
                <MultiSelectDropdown 
                  label="Select District" 
                  options={rightDistricts} 
                  selectedIds={rightFilters.districtIds} 
                  onChange={(v) => setRightFilters(prev => ({ ...prev, districtIds: v }))} 
                  disabled={!rightFilters.stateId} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ucr-grid-2">
        {/* LEFT TABLE: Stockists Dashboard Layout */}
        {leftFilters.stateId && leftFilters.districtIds.length > 0 && (
          <div className="dc-card" style={{ marginBottom: 0, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div className="dc-header" style={{ background: "#f8fafc" }}>
              <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Stockist's To Be Mapped</h3>
            </div>
            
            <div className="dc-body" style={{ padding: 0, flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="ucr-table-container" style={{ border: "none", borderRadius: 0, flex: 1 }}>
                <table className="ucr-table" style={{ minWidth: 500 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 60, textAlign: "center" }}>Select</th>
                      <th>Headquarter Name</th>
                      <th>Stockist Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLeftLoading ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center", padding: 40 }}>
                          <Loader2 style={{ animation: "dc-spin 1s linear infinite", margin: "0 auto", color: "#3B82F6" }} size={20} />
                        </td>
                      </tr>
                    ) : stockists.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                          No stockists found for the selected filters.
                        </td>
                      </tr>
                    ) : (
                      pagedStockists.map((row) => (
                        <tr 
                          key={row.id} 
                          onClick={() => setSelectedStockistId(row.id)}
                          style={{ background: selectedStockistId === row.id ? "rgba(59, 130, 246, 0.05)" : "transparent" }}
                        >
                          <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                            <div 
                              onClick={() => setSelectedStockistId(row.id)}
                              style={{ 
                                width: 16, height: 16, borderRadius: "50%", margin: "0 auto", cursor: "pointer",
                                border: selectedStockistId === row.id ? "5px solid #3B82F6" : "2px solid #cbd5e1",
                                background: "#fff", transition: "all 0.15s"
                              }} 
                            />
                          </td>
                          <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.headquarterName}</td>
                          <td style={{ fontWeight: 600, color: "#2563eb" }}>{row.stockistName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {stockists.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #edf2f7", background: "#f8fafc", fontSize: 12, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ color: "#64748b" }}>
                    Showing <span style={{ fontWeight: 700, color: "#1e293b" }}>{(leftPage - 1) * leftPageSize + 1}</span> to <span style={{ fontWeight: 700, color: "#1e293b" }}>{Math.min(leftPage * leftPageSize, stockists.length)}</span> of <span style={{ fontWeight: 700, color: "#1e293b" }}>{stockists.length}</span> entries
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <select
                      value={leftPageSize}
                      onChange={(e) => { leftPageSize(Number(e.target.value)); setLeftPage(1); }}
                      style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 8px", outline: "none", cursor: "pointer", color: "#475569", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                    >
                      {PAGE_SIZES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                    <button type="button" onClick={() => goToLeftPage(leftPage - 1)} disabled={leftPage === 1} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} /></button>
                    <button type="button" onClick={() => goToLeftPage(leftPage + 1)} disabled={leftPage === leftTotalPages || leftTotalPages === 0} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="dc-footer" style={{ justifyContent: "flex-start", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
              <button
                type="button"
                onClick={handleMapSubmit}
                disabled={isSubmitting || !selectedStockistId}
                className="dc-submit-btn"
              >
                {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={14} />}
                Map Stockiest's
              </button>
            </div>
          </div>
        )}

        {/* RIGHT COMPACT TABLE: Employees List */}
        {rightFilters.stateId && rightFilters.districtIds.length > 0 && (
          <div className="dc-card" style={{ marginBottom: 0, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div className="dc-header" style={{ background: "#f8fafc" }}>
              <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Employees List</h3>
            </div>
            
            <div className="dc-body" style={{ padding: 0, flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="ucr-table-container" style={{ border: "none", borderRadius: 0, flex: 1 }}>
                <table className="ucr-table" style={{ minWidth: 500 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 60, textAlign: "center" }}>
                        <div 
                          onClick={toggleAllEmployees}
                          style={{ 
                            width: 16, height: 16, borderRadius: 4, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            border: selectedEmployeeIds.length === employees.length && employees.length > 0 ? "1px solid #3B82F6" : "2px solid #cbd5e1",
                            background: selectedEmployeeIds.length === employees.length && employees.length > 0 ? "#3B82F6" : "#fff",
                            transition: "all 0.15s"
                          }}
                        >
                          {selectedEmployeeIds.length === employees.length && employees.length > 0 && <Check size={12} style={{ color: "#fff" }} />}
                        </div>
                      </th>
                      <th>Headquarter Name</th>
                      <th>User Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isRightLoading ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center", padding: 40 }}>
                          <Loader2 style={{ animation: "dc-spin 1s linear infinite", margin: "0 auto", color: "#3B82F6" }} size={20} />
                        </td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                          No employees found for the selected filters.
                        </td>
                      </tr>
                    ) : (
                      pagedEmployees.map((row) => (
                        <tr 
                          key={row.id} 
                          onClick={() => toggleEmployeeSelection(row.id)}
                          style={{ background: selectedEmployeeIds.includes(row.id) ? "rgba(59, 130, 246, 0.05)" : "transparent" }}
                        >
                          <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                            <div 
                              onClick={() => toggleEmployeeSelection(row.id)}
                              style={{ 
                                width: 16, height: 16, borderRadius: 4, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                border: selectedEmployeeIds.includes(row.id) ? "1px solid #3B82F6" : "2px solid #cbd5e1",
                                background: selectedEmployeeIds.includes(row.id) ? "#3B82F6" : "#fff", transition: "all 0.15s"
                              }}
                            >
                              {selectedEmployeeIds.includes(row.id) && <Check size={12} style={{ color: "#fff" }} />}
                            </div>
                          </td>
                          <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.headquarterName}</td>
                          <td style={{ fontWeight: 600, color: "#475569" }}>{row.employeeName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {employees.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #edf2f7", background: "#f8fafc", fontSize: 12, flexWrap: "wrap", gap: 12, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                  <div style={{ color: "#64748b" }}>
                    Showing <span style={{ fontWeight: 700, color: "#1e293b" }}>{(rightPage - 1) * rightPageSize + 1}</span> to <span style={{ fontWeight: 700, color: "#1e293b" }}>{Math.min(rightPage * rightPageSize, employees.length)}</span> of <span style={{ fontWeight: 700, color: "#1e293b" }}>{employees.length}</span> entries
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <select
                      value={rightPageSize}
                      onChange={(e) => { setRightPageSize(Number(e.target.value)); setRightPage(1); }}
                      style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 8px", outline: "none", cursor: "pointer", color: "#475569", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                    >
                      {PAGE_SIZES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                    <button type="button" onClick={() => goToRightPage(rightPage - 1)} disabled={rightPage === 1} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} /></button>
                    <button type="button" onClick={() => goToRightPage(rightPage + 1)} disabled={rightPage === rightTotalPages || rightTotalPages === 0} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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

const pagBtnStyle = { background: "#ffffff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569", fontFamily: "'Inter', sans-serif" };

// ─── Searchable Portal Configuration Dropdown Component ───
function SingleDropdown({ label, options, value, onSelect, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = options.find((option) => String(option.value) === String(value));
  const hasVal = Boolean(value);
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
            {options.length === 0 ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No options available</li>
            ) : (
              options.map((opt) => (
                <li
                  key={opt.value}
                  className={`dc-opt${String(value) === String(opt.value) ? " selected" : ""}`}
                  style={{
                    padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                    color: String(value) === String(opt.value) ? "#2563eb" : "#475569",
                    backgroundColor: String(value) === String(opt.value) ? "rgba(59,130,246,0.08)" : "#ffffff",
                    fontWeight: String(value) === String(opt.value) ? "600" : "500"
                  }}
                  onMouseDown={(e) => { e.preventDefault(); onSelect(opt.value); setIsOpen(false); }}
                >
                  {String(value) === String(opt.value) && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Searchable Portal Multi-Select Dropdown Component ───
function MultiSelectDropdown({ label, options, selectedIds, onChange, disabled = false }) {
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

  const toggleValue = (value) => {
    if (selectedIds.includes(value)) {
      onChange(selectedIds.filter((item) => item !== value));
      return;
    }
    onChange([...selectedIds, value]);
  };

  const selectAll = () => onChange(options.map((option) => option.id || option.value));
  const clearAll = () => onChange([]);

  const selectedLabel = options
    .filter((option) => selectedIds.includes(option.id || option.value))
    .map((option) => option.label)
    .join(", ");

  const hasValue = selectedIds.length > 0;
  const active = isOpen || hasValue;
  const borderColor = isOpen ? "#3B82F6" : hasValue ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff";
  const shadow  = isOpen && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = isOpen ? "#3B82F6" : hasValue ? "#64748b" : "#94a3b8";

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
          {selectedLabel || " "}
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
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectAll(); }}
              style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#2563eb", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Select All
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); clearAll(); }}
              style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Clear All
            </button>
          </div>

          <ul style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0", margin: 0, listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No option available</li>
            ) : (
              options.map((option) => {
                const optId = String(option.id || option.value);
                const isSelected = selectedIds.includes(optId);
                return (
                  <li
                    key={optId}
                    className={`dc-opt${isSelected ? " selected" : ""}`}
                    style={{
                      padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "8px",
                      color: isSelected ? "#2563eb" : "#475569",
                      backgroundColor: isSelected ? "rgba(59,130,246,0.08)" : "#ffffff",
                      fontWeight: isSelected ? "600" : "500"
                    }}
                    onMouseDown={(e) => { e.preventDefault(); toggleValue(optId); }}
                  >
                    <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: "#3B82F6", cursor: "pointer", marginRight: 4 }} />
                    {option.label}
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