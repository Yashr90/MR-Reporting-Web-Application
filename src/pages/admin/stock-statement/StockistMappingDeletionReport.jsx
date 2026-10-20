import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, ChevronDown, Check,
  Map, Trash2, X, ChevronLeft, ChevronRight
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const FH = 40;
const PAGE_SIZES = [5, 10, 20, 50];

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
    justify-content: space-between;
    border-radius: 16px;
    border-top: 1px solid #f1f5f9;
    flex-wrap: wrap;
    gap: 12px;
  }

  /* ── Responsive Input Grids ── */
  .ucr-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 16px; margin-bottom: 0; }

  .col-span-2 { grid-column: span 2; }
  .col-span-4 { grid-column: span 4; }

  @media(max-width: 1200px) {
    .ucr-grid-4 { grid-template-columns: repeat(3, 1fr); }
    .col-span-4 { grid-column: span 3; }
  }
  @media(max-width: 1024px) {
    .ucr-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .col-span-4 { grid-column: span 2; }
  }
  @media(max-width: 640px) {
    .ucr-grid-4 { grid-template-columns: 1fr; gap: 20px; }
    .col-span-2, .col-span-4 { grid-column: span 1 !important; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; justify-content: center; flex-direction: column-reverse; }
    .dc-footer > button, .dc-footer > div { width: 100% !important; justify-content: center !important; }
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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 600px; }
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
    position: fixed; inset: 0; z-index: 9999999;
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
  }

  .dc-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; overflow: visible !important; }
`;

export default function StockistMappingDeletionReport() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [filters, setFilters] = useState({
    stateId: "",
    districtIds: [],
    employeeIds: []
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [mappedData, setMappedData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
        setStates(normalizedStates.filter(opt => opt.id !== ""));
      } catch (err) { console.error("Failed to load states", err); }
    };
    fetchStates();
  }, [getAuthHeaders]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, districtIds: [], employeeIds: [] }));
    setDistricts([]); setEmployees([]);
    setTableVisible(false);
    
    if (filters.stateId) {
      const fetchDistricts = async () => {
        try {
          const res = await api.get(`/api/masters/districts?stateId=${filters.stateId}`, getAuthHeaders());
          const districtData = res.data?.data || res.data || [];
          const normalizedDistricts = Array.isArray(districtData) ? districtData.map((d) => ({
            id: String(d.id ?? d.districtId),
            districtName: d.district_name || d.districtName || d.name || "Unknown"
          })) : [];
          setDistricts(normalizedDistricts.filter(opt => opt.id !== ""));
        } catch (err) { console.error("Failed to load districts", err); }
      };
      fetchDistricts();
    }
  }, [filters.stateId, getAuthHeaders]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, employeeIds: [] }));
    setEmployees([]);
    setTableVisible(false);

    if (filters.districtIds && filters.districtIds.length > 0) {
      const fetchEmployees = async () => {
        try {
          const query = filters.districtIds.map(id => `districtIds=${id}`).join('&');
          const res = await api.get(`/api/masters/employees/by-districts?${query}`, getAuthHeaders());
          
          const employeeData = res.data?.data || res.data || [];
          const normalizedEmployees = Array.isArray(employeeData) ? employeeData.map((e) => ({
            id: String(e.id ?? e.employeeId),
            employeeName: e.employee_name || e.employeeName || e.userName || e.name || "Unknown"
          })) : [];
          setEmployees(normalizedEmployees.filter(opt => opt.id !== ""));
        } catch (err) { console.error("Failed to load employees", err); }
      };
      fetchEmployees();
    }
  }, [filters.districtIds, getAuthHeaders]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setTableVisible(false);
    setSelectedRowIds([]);
  };

  const handleViewStatus = async () => {
    setError(""); 
    
    if (!filters.stateId || !filters.districtIds?.length || !filters.employeeIds?.length) {
      return setError("Please select State, District, and Employee before viewing status.");
    }

    setIsLoading(true);
    setSelectedRowIds([]);
    try {
      const payload = {
        stateIds: [Number(filters.stateId)],
        districtIds: filters.districtIds.map(Number),
        employeeIds: filters.employeeIds.map(Number)
      };

      const res = await api.post(`/api/masters/stockist-mapping-report/view`, payload, getAuthHeaders());
      
      const responseData = res.data?.data || res.data || {};
      const fetchedData = Array.isArray(responseData) ? responseData : (responseData.rows || []);
      
      const normalizedData = Array.isArray(fetchedData) ? fetchedData.map((row, i) => ({
        id: String(row.mappingId || row.id || i),
        districtName: row.stockistDistrictName || row.employeeDistrictName || row.districtName || "Unknown District",
        stockistName: row.stockistName || row.partyName || row.providerName || "Unknown Stockist",
        userName: row.userName || row.employeeName || row.name || "Unknown User"
      })) : [];

      setMappedData(normalizedData);
      setTableVisible(true);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch mapped data. No records found.");
      setMappedData([]);
      setTableVisible(true);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRowSelection = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRowIds.length === pagedData.length && pagedData.length > 0) {
      setSelectedRowIds(prev => prev.filter(id => !pagedData.some(row => row.id === id)));
    } else {
      const visibleIds = pagedData.map(row => row.id);
      setSelectedRowIds(prev => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleDelete = async () => {
    if (selectedRowIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selectedRowIds.length} selected mapping(s)?`)) return;

    setIsDeleting(true);
    setError(""); 

    try {
      const payload = { mappingIds: selectedRowIds.map(Number) };
      await api.post("/api/masters/stockist-mapping-report/delete", payload, getAuthHeaders());
      
      setPopup({ isOpen: true, message: "Selected mappings deleted successfully!" });
      setMappedData(prev => prev.filter(row => !selectedRowIds.includes(row.id)));
      setSelectedRowIds([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete mappings.");
    } finally {
      setIsDeleting(false);
    }
  };

  const stateOpts = states.map(s => ({ value: String(s.id), label: s.stateName }));
  const distOpts = districts.map(d => ({ value: String(d.id), label: d.districtName }));
  const empOpts = employees.map(e => ({ value: String(e.id), label: e.employeeName }));

  const totalPages = Math.max(1, Math.ceil(mappedData.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages); 
  const pagedData = mappedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const allVisibleSelected = pagedData.length > 0 && pagedData.every(row => selectedRowIds.includes(row.id));

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
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

      {/* Filter Card Container */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Map size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>MR Stockist Mapped Report</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>View and manage employee to stockist mappings</p>
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
            <div className="ucr-grid-4">
              <SingleDropdown label="Select State" options={stateOpts} value={filters.stateId} onSelect={(v) => handleFilterChange("stateId", v)} />
              <MultiDropdown label="Select District" options={distOpts} selectedIds={filters.districtIds} onChange={(v) => handleFilterChange("districtIds", v)} disabled={!filters.stateId} />
              <MultiDropdown label="Select Employee" options={empOpts} selectedIds={filters.employeeIds} onChange={(v) => handleFilterChange("employeeIds", v)} disabled={filters.districtIds.length === 0} />
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button 
                  type="button"
                  onClick={handleViewStatus} 
                  disabled={isLoading} 
                  className="dc-submit-btn"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {isLoading ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Check size={14} />}
                  View Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Sheet Card Container */}
      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Stockist Mapped Detail</h3>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: "center" }}>
                      <div 
                        onClick={toggleAllRows}
                        style={{ 
                          width: 16, height: 16, borderRadius: 4, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                          border: allVisibleSelected && pagedData.length > 0 ? "1px solid #3B82F6" : "2px solid #cbd5e1",
                          background: allVisibleSelected && pagedData.length > 0 ? "#3B82F6" : "#fff", transition: "all 0.15s"
                        }}
                      >
                        {allVisibleSelected && pagedData.length > 0 && <Check size={12} style={{ color: "#fff" }} />}
                      </div>
                    </th>
                    <th>District Name</th>
                    <th>Stockist Name</th>
                    <th>User Name</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedData.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>No mapped records found.</td>
                    </tr>
                  ) : (
                    pagedData.map((row) => (
                      <tr key={row.id} onClick={() => toggleRowSelection(row.id)} style={{ background: selectedRowIds.includes(row.id) ? "rgba(59, 130, 246, 0.05)" : "transparent" }}>
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <div 
                            onClick={() => toggleRowSelection(row.id)}
                            style={{ 
                              width: 16, height: 16, borderRadius: 4, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                              border: selectedRowIds.includes(row.id) ? "1px solid #3B82F6" : "2px solid #cbd5e1",
                              background: selectedRowIds.includes(row.id) ? "#3B82F6" : "#fff", transition: "all 0.15s"
                            }}
                          >
                            {selectedRowIds.includes(row.id) && <Check size={12} style={{ color: "#fff" }} />}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: "#475569" }}>{row.districtName}</td>
                        <td style={{ fontWeight: 700, color: "#1e293b", textTransform: "uppercase" }}>{row.stockistName}</td>
                        <td style={{ fontWeight: 600, color: "#64748b" }}>{row.userName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dc-footer">
            <button 
              type="button"
              onClick={handleDelete} 
              disabled={selectedRowIds.length === 0} 
              style={{
                height: 40, padding: "0 24px", borderRadius: 8, background: "#ef4444", color: "#fff",
                fontSize: 14, fontWeight: 600, border: "none", cursor: (selectedRowIds.length === 0) ? "not-allowed" : "pointer",
                opacity: (selectedRowIds.length === 0) ? 0.5 : 1, display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              <Trash2 size={14} />
              Delete Selected {selectedRowIds.length > 0 && `(${selectedRowIds.length})`}
            </button>

            {mappedData.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ color: "#64748b", fontSize: 12 }}>
                  Showing <span style={{ fontWeight: 700, color: "#1e293b" }}>{(safeCurrentPage - 1) * pageSize + 1}</span> to <span style={{ fontWeight: 700, color: "#1e293b" }}>{Math.min(safeCurrentPage * pageSize, mappedData.length)}</span> of <span style={{ fontWeight: 700, color: "#1e293b" }}>{mappedData.length}</span> entries
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#64748b", marginRight: 6, fontSize: 12 }}>Items per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 8px", outline: "none", cursor: "pointer", color: "#475569", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                  >
                    {PAGE_SIZES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                  <div style={{ width: 12 }} />
                  <button type="button" onClick={() => goToPage(1)} disabled={safeCurrentPage === 1} style={pagBtnStyle}>First</button>
                  <button type="button" onClick={() => goToPage(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} /></button>
                  <div style={{ background: "#2563eb", color: "#fff", border: "1px solid #2563eb", borderRadius: 6, padding: "4px 12px", fontWeight: 700, fontSize: 12 }}>{safeCurrentPage}</div>
                  <button type="button" onClick={() => goToPage(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages || totalPages === 0} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} /></button>
                  <button type="button" onClick={() => goToPage(totalPages)} disabled={safeCurrentPage === totalPages || totalPages === 0} style={pagBtnStyle}>Last</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Center-Aligned Success Popup Modal (Portal Integration) ── */}
      {popup.isOpen && createPortal(
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
        </div>,
        document.body
      )}
    </div>
  );
}

const pagBtnStyle = { background: "#ffffff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569", fontFamily: "'Inter', sans-serif" };

// ─── Searchable Portal Configuration Single Dropdown Component ───
function SingleDropdown({ label, options, value, onSelect, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = options.find((option) => String(option.value) === String(value) || String(option.id) === String(value));
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
            {options.length === 0 ? (
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
                    onMouseDown={() => { onSelect(optValue); setIsOpen(false); }}
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
function MultiDropdown({ label, options = [], selectedIds, onChange, disabled }) {
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
  const selectAll = () => onChange(options.map(o => String(o.id ?? o.value)));
  const clearAll = () => onChange([]);

  const hasValue = selectedIds.length > 0;
  const displayText = hasValue ? options.filter(o => selectedIds.includes(String(o.id ?? o.value))).map(o => o.label).join(", ") : "";
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
            {options.length === 0 ? (
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