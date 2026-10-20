import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, ChevronDown, Filter, FileSpreadsheet,
  Printer, Download, Eye, Calendar as CalendarIcon, ClipboardList, Check,
  ChevronLeft, ChevronRight
} from "lucide-react";
import api from "../../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const FH = 40;
const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["SU","MO","TU","WE","TH","FR","SA"];

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

  /* ── Responsive Architecture Grid Matrix Rules ── */
  .ucr-grid-4 { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 18px 16px; 
    align-items: center; 
  }

  .col-span-2 { grid-column: span 2; }
  .col-span-3 { grid-column: span 3; }
  .col-span-4 { grid-column: span 4; }

  @media(max-width: 1200px) {
    .ucr-grid-4 { grid-template-columns: repeat(3, 1fr); }
  }
  @media(max-width: 1024px) {
    .ucr-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  }
  @media(max-width: 768px) {
    .ucr-grid-4 { grid-template-columns: 1fr; gap: 16px; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { justify-content: center; flex-direction: column; }
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
  }

  .dc-portal-dropdown ul::-webkit-scrollbar,
  .ucr-table-container::-webkit-scrollbar {
    width: 6px; height: 6px;
  }
  .dc-portal-dropdown ul::-webkit-scrollbar-track,
  .ucr-table-container::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  .dc-portal-dropdown ul::-webkit-scrollbar-thumb,
  .ucr-table-container::-webkit-scrollbar-thumb {
    background: #cbd5e1; border-radius: 100px;
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

  /* ── Image-Matched Calendar UI Architecture ── */
  .ucr-cal {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 99999;
    margin-top: 6px;
    width: 290px;
    background: #ffffff !important;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.02);
    padding: 16px;
  }
  
  .ucr-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 0 4px;
  }
  
  .ucr-cal-nav-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent !important;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.15s;
  }
  .ucr-cal-nav-btn:hover {
    color: #1e293b;
  }
  
  .ucr-cal-select-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .ucr-cal-select-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: transparent !important;
  }
  
  .ucr-cal-native-select {
    appearance: none;
    background: transparent !important;
    border: none;
    padding: 4px 22px 4px 8px;
    font-size: 14px;
    font-weight: 700;
    color: #2563eb;
    outline: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }
  
  .ucr-cal-weekday-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    text-align: center;
    margin-bottom: 8px;
  }
  
  .ucr-cal-weekday {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.02em;
    padding: 4px 0;
  }
  
  .ucr-cal-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  
  .ucr-cal-day-cell {
    aspect-ratio: 1;
    border: none;
    background: transparent !important;
    font-size: 13px;
    font-weight: 500;
    color: #334155;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s;
    font-family: 'Inter', sans-serif;
  }
  .ucr-cal-day-cell:hover {
    background: #f1f5f9 !important;
    color: #0f172a;
  }
  .ucr-cal-day-cell.selected {
    background: #2563eb !important;
    color: #ffffff !important;
    font-weight: 700;
  }
  .ucr-cal-day-cell.today {
    background: #eff6ff !important;
    color: #2563eb !important;
    font-weight: 700;
  }

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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; }
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

  .dc-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; overflow: visible !important; }
`;

export default function DCRConsolidate() {
  // ─── UI State ────────────────────────────────────────────────────────────────
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Filter State ────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState("Geographical"); 
  const [filters, setFilters] = useState({
    geoType: "State", 
    hierType: "Employee Wise", 
    stateIds: [],
    districtIds: [],
    status: "Active",
    designationIds: [],
    employeeIds: [],
    fromDate: "",
    toDate: ""
  });

  // ─── Master Data ─────────────────────────────────────────────────────────────
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ─── Report Data State ───────────────────────────────────────────────────────
  const [reportData, setReportData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // ─── Drill-down State ────────────────────────────────────────────────────────
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // ─── Helper for Auth Headers ─────────────────────────────────────────────────
  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  }), []);

  // 1. Fetch States & Designations on Mount
  useEffect(() => {
    const fetchInitialMasters = async () => {
      try {
        const [stateRes, desigRes] = await Promise.all([
          api.get("/api/masters/states", getAuthHeaders()),
          api.get("/api/masters/designations/hierarchy", getAuthHeaders())
        ]);
        
        const stateData = stateRes.data?.data || stateRes.data || [];
        setStates(Array.isArray(stateData) ? stateData.map(s => ({
          id: String(s.id ?? s.stateId), label: s.state_name || s.stateName || s.name || "Unknown"
        })).filter(opt => opt.id !== "") : []);

        const desigData = desigRes.data?.data || desigRes.data || [];
        setDesignations(Array.isArray(desigData) ? desigData.map(d => ({
          id: String(d.id ?? d.designationId), label: d.designation_name || d.designationName || d.name || "Unknown"
        })).filter(opt => opt.id !== "") : []);
      } catch (err) { console.error("Failed to load initial masters", err); }
    };
    fetchInitialMasters();
  }, [getAuthHeaders]);

  // 2. Fetch Districts (Geographical Mode)
  useEffect(() => {
    if (viewMode === "Geographical" && filters.geoType === "Headquarter" && filters.stateIds.length > 0) {
      const query = filters.stateIds.map(id => `stateIds=${id}`).join('&');
      api.get(`/api/masters/districts/by-states?${query}`, getAuthHeaders())
        .then(res => {
          const data = res.data?.data || res.data || [];
          setDistricts(Array.isArray(data) ? data.map(d => ({
            id: String(d.id ?? d.districtId), label: d.district_name || d.districtName || d.name || "Unknown"
          })) : []);
        }).catch(err => console.error(err));
    } else {
      setDistricts([]);
    }
  }, [filters.stateIds, filters.geoType, viewMode, getAuthHeaders]);

  // 3. Fetch Employees (Hierarchical Mode)
  useEffect(() => {
    if (viewMode === "Hierarchical" && filters.designationIds.length > 0) {
      const query = filters.designationIds.map(id => `designationIds=${id}`).join('&');
      api.get(`/api/masters/employees/filter?${query}`, getAuthHeaders())
        .then(res => {
          const data = res.data?.data || res.data || [];
          setEmployees(Array.isArray(data) ? data.map(e => {
            const name = e.employee_name || e.employeeName || e.name || "Unknown";
            const desig = e.designation_name || e.designationName || e.designation || "";
            return { id: String(e.id ?? e.employeeId), label: desig ? `${name}-(${desig})` : name };
          }) : []);
        }).catch(err => console.error(err));
    } else {
      setEmployees([]);
    }
  }, [filters.designationIds, viewMode, getAuthHeaders]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setTableVisible(false);
    setSelectedEmployee(null);
  };

  const handleGenerateReport = async () => {
    setError("");
    setSelectedEmployee(null);
    setDetailData(null);

    if (!filters.fromDate || !filters.toDate) return setError("Please select From Date and To Date.");
    if (viewMode === "Geographical") {
      if (filters.stateIds.length === 0) return setError("Please select at least one State.");
      if (filters.geoType === "Headquarter" && filters.districtIds.length === 0) return setError("Please select at least one District.");
    } else {
      if (filters.designationIds.length === 0) return setError("Please select at least one Designation.");
      if (filters.employeeIds.length === 0) return setError("Please select at least one Employee.");
    }

    setIsLoading(true);
    try {
      const payload = {
        filterMode: viewMode.toUpperCase(),
        scopeType: viewMode === "Geographical" ? filters.geoType : filters.hierType,
        status: filters.status,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      if (viewMode === "Geographical") {
        payload.stateIds = filters.stateIds.map(Number);
        payload.districtIds = filters.districtIds.map(Number);
      } else {
        payload.designationIds = filters.designationIds.map(Number);
        payload.employeeIds = filters.employeeIds.map(Number);
      }

      const res = await api.post(`/api/report-analysis/dcr-consolidate/summary`, payload, getAuthHeaders());
      
      const fetchedData = res.data?.data || res.data || [];
      const dataRows = Array.isArray(fetchedData) ? fetchedData : fetchedData.rows || [];
      
      const normalizedData = dataRows.map((row, i) => ({
        id: String(row.id || row.employeeId || i),
        headquarter: row.headquarter || row.headquarterName || "Unknown",
        empCode: row.empCode || row.employeeCode || "-",
        employeeName: row.employeeName || row.userName || "Unknown",
        managerName: row.managerName || row.manager || "-",
        designation: row.designation || row.designationName || "-",
        doj: row.doj || row.dateOfJoining || "---",
        doc: row.doc || row.dateOfConfirmation || "---",
        mobile: row.mobile || row.mobileNo || "-",
        lastDcr: row.lastDcr || row.lastSubmittedDcr || "-",
        totalDcr: Number(row.totalDcr) || 0,
        docCalls: Number(row.docCalls || row.inPersonDoctorCallCount) || 0,
        docPob: Number(row.docPob || row.doctorPob) || 0,
        chemCalls: Number(row.chemCalls || row.chemistMetCount) || 0,
        stockCalls: Number(row.stockCalls || row.stockistMetCount) || 0,
        totalMet: Number(row.totalMet || row.totalProviderMet) || 0,
        totalPob: Number(row.totalPob) || 0
      }));

      setReportData(normalizedData);
      setTableVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch report data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeClick = async (emp) => {
    setSelectedEmployee(emp);
    setDetailData(null);
    setIsDetailLoading(true);
    
    try {
      const res = await api.get(`/api/report-analysis/dcr-consolidate/detail/${emp.id}?fromDate=${filters.fromDate}&toDate=${filters.toDate}`, getAuthHeaders());
      const data = res.data?.data || res.data || {};
      
      setDetailData({
        attendance: data.attendance || [],
        calls: data.calls || [],
        logs: data.logs || []
      });

      setTimeout(() => {
        document.getElementById('drilldown-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      console.error("Failed to load details", err);
      setDetailData({ attendance: [], calls: [], logs: [] });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const filteredReportData = reportData.filter(row => 
    row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.headquarter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.empCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <ClipboardList size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>DCR Consolidate Summary</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Generate daily call reports by geography or hierarchy</p>
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
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20, paddingBottom: 12, borderBottom: "1px dashed #edf2f7" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", border: viewMode === 'Geographical' ? "5px solid #2563eb" : "2px solid #cbd5e1",
                  background: "#fff", transition: "0.2s"
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: viewMode === 'Geographical' ? "#1e293b" : "#64748b" }}>Geographical</span>
                <input type="radio" style={{ display: "none" }} checked={viewMode === 'Geographical'} onChange={() => { setViewMode('Geographical'); setFilters(prev => ({...prev, stateIds: [], districtIds: []})); }} />
              </label>
              
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", border: viewMode === 'Hierarchical' ? "5px solid #2563eb" : "2px solid #cbd5e1",
                  background: "#fff", transition: "0.2s"
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: viewMode === 'Hierarchical' ? "#1e293b" : "#64748b" }}>Hierarchical</span>
                <input type="radio" style={{ display: "none" }} checked={viewMode === 'Hierarchical'} onChange={() => { setViewMode('Hierarchical'); setFilters(prev => ({...prev, designationIds: [], employeeIds: []})); }} />
              </label>
            </div>

            <div className="ucr-grid-4">
              {viewMode === "Geographical" && (
                <>
                  <SingleDropdown label="Select Type" options={[{value:"State", label:"State"}, {value:"Headquarter", label:"Headquarter"}]} value={filters.geoType} onSelect={v => handleFilterChange("geoType", v)} />
                  <MultiDropdown label="Select State" options={states} selectedIds={filters.stateIds} onChange={v => handleFilterChange("stateIds", v)} />
                  {filters.geoType === "Headquarter" && (
                    <MultiDropdown label="Select District" options={districts} selectedIds={filters.districtIds} onChange={v => handleFilterChange("districtIds", v)} disabled={!filters.stateIds.length} />
                  )}
                  <SingleDropdown label="Select Status" options={[{value:"Active", label:"Active"}, {value:"Inactive", label:"Inactive"}]} value={filters.status} onSelect={v => handleFilterChange("status", v)} />
                </>
              )}

              {viewMode === "Hierarchical" && (
                <>
                  <SingleDropdown label="Select Type" options={[{value:"Employee Wise", label:"Employee Wise"}]} value={filters.hierType} onSelect={v => handleFilterChange("hierType", v)} />
                  <SingleDropdown label="Select Status" options={[{value:"Active", label:"Active"}, {value:"Inactive", label:"Inactive"}]} value={filters.status} onSelect={v => handleFilterChange("status", v)} />
                  <MultiDropdown label="Select Designation" options={designations} selectedIds={filters.designationIds} onChange={v => handleFilterChange("designationIds", v)} />
                  <MultiDropdown label="Select Employee" options={employees} selectedIds={filters.employeeIds} onChange={v => handleFilterChange("employeeIds", v)} disabled={!filters.designationIds.length} />
                </>
              )}

              <FloatingDatePicker label="From Date" value={filters.fromDate} onChange={v => handleFilterChange("fromDate", v)} required />
              <FloatingDatePicker label="To Date" value={filters.toDate} onChange={v => handleFilterChange("toDate", v)} required />
              
              <div style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
                <button 
                  type="button"
                  onClick={handleGenerateReport} 
                  disabled={isLoading} 
                  className="dc-submit-btn"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {isLoading ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Check size={14} />}
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Summary Report Sheet Table */}
      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>DCR Consolidate Summary View</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button type="button" style={{ height: 34, padding: "0 16px", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", fontSize: 12, fontWeight: 700, borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><FileSpreadsheet size={14}/> Excel</button>
              <button type="button" style={{ height: 34, padding: "0 16px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12, fontWeight: 700, borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><Printer size={14}/> Print</button>
              <input 
                type="text" placeholder="Search Results..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: 34, padding: "0 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", width: 220, background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px", marginBottom: 0 }}>
              <table className="ucr-table" style={{ minWidth: 2000 }}>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Headquarter</th>
                    <th>Employee Code</th>
                    <th>Employee Name</th>
                    <th>Manager Name</th>
                    <th>Designation</th>
                    <th>Date Of Joining</th>
                    <th>Date Of Confirmation</th>
                    <th>Mobile</th>
                    <th>Last Submitted DCR</th>
                    <th>Total DCR</th>
                    <th>Doctor Calls Met</th>
                    <th>Doctor POB</th>
                    <th>Chemist Met</th>
                    <th>Stockist Met</th>
                    <th>Total Providers Met</th>
                    <th>Total POB</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportData.length === 0 ? (
                    <tr><td colSpan={18} style={{ padding: 40, color: "#94a3b8", fontStyle: "italic" }}>No consolidation report data matched specified query filters.</td></tr>
                  ) : filteredReportData.map((row, i) => (
                    <tr key={row.id} style={{ background: selectedEmployee?.id === row.id ? "rgba(59, 130, 246, 0.05)" : "transparent" }}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 700, color: "#1e293b" }}>{row.headquarter}</td>
                      <td>{row.empCode}</td>
                      <td>
                        <button type="button" onClick={() => handleEmployeeClick(row)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>
                          {row.employeeName}
                        </button>
                      </td>
                      <td>{row.managerName}</td>
                      <td style={{ fontWeight: 600 }}>{row.designation}</td>
                      <td>{row.doj}</td>
                      <td>{row.doc}</td>
                      <td>{row.mobile}</td>
                      <td>{row.lastDcr}</td>
                      <td style={{ color: "#1e293b", fontWeight: 700 }}>{row.totalDcr}</td>
                      <td>{row.docCalls}</td>
                      <td style={{ fontFamily: "monospace" }}>{Number(row.docPob).toFixed(2)}</td>
                      <td>{row.chemCalls}</td>
                      <td>{row.stockCalls}</td>
                      <td style={{ color: "#1e293b", fontWeight: 700 }}>{row.totalMet}</td>
                      <td style={{ color: "#2563eb", fontWeight: 700, fontFamily: "monospace" }}>{Number(row.totalPob).toFixed(2)}</td>
                      <td>
                        <button type="button" onClick={() => handleEmployeeClick(row)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#ef4444", fontWeight: 700, fontSize: 12, margin: "0 auto" }}>
                          <Eye size={13}/> View Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── DRILL-DOWN SECONDARY DATA DETAIL SHEET ─── */}
      {selectedEmployee && (
        <div id="drilldown-section" className="dc-card" style={{ border: "1px solid #bfdbfe", boxShadow: "0 10px 30px rgba(59,130,246,0.05)" }}>
          <div className="dc-header" style={{ borderBottom: "1px solid #edf2f7" }}>
            <div>
              <h3 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
                DCR Date Wise Detailed Logs <span style={{ color: "#2563eb", marginLeft: 4 }}>({selectedEmployee.employeeName})</span>
              </h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, background: "rgba(239,68,68,0.04)", border: "1px solid #fecaca", borderRadius: 2 }} /> Deviated Day Row
              </span>
            </div>
          </div>

          {isDetailLoading ? (
            <div style={{ display: "flex", justifyContent: "center", itemsCenter: "center", padding: 60 }}>
              <Loader2 size={24} style={{ animation: "dc-spin 1s linear infinite", color: "#2563eb" }} />
            </div>
          ) : detailData ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, background: "#f8fafc" }} className="hide-on-mobile">
                <div style={{ background: "#fff", border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#2563eb" }}>
                      <tr><th style={{ color: "#fff", padding: "10px 14px", fontSize: 11, textTransform: "uppercase", textAlign: "left" }}>Attendance Details</th><th style={{ color: "#fff", padding: "10px 14px", fontSize: 11, textTransform: "uppercase", width: 80 }}>Total</th></tr>
                    </thead>
                    <tbody style={{ divideY: "1px solid #f1f5f9" }}>
                      {detailData.attendance?.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: "8px 14px", fontSize: 13, color: "#475569", fontWeight: 600 }}>{item.label || item.name}</td>
                          <td style={{ padding: "8px 14px", fontSize: 13, fontWeight: 700, textAlign: "center", color: "#1e293b", background: "#f8fafc" }}>{item.total || item.value || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ background: "#fff", border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#2563eb" }}>
                      <tr><th style={{ color: "#fff", padding: "10px 14px", fontSize: 11, textTransform: "uppercase", textAlign: "left" }}>Call Summary Metrics</th><th style={{ color: "#fff", padding: "10px 14px", fontSize: 11, textTransform: "uppercase", width: 80 }}>Total</th></tr>
                    </thead>
                    <tbody style={{ divideY: "1px solid #f1f5f9" }}>
                      {detailData.calls?.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: "8px 14px", fontSize: 13, color: "#475569", fontWeight: 600 }}>{item.label || item.name}</td>
                          <td style={{ padding: "8px 14px", fontSize: 13, fontWeight: 700, textAlign: "center", color: "#1e293b", background: "#f8fafc" }}>{item.total || item.value || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ padding: 16 }}>
                <div className="ucr-table-container" style={{ marginBottom: 0 }}>
                  <table className="ucr-table" style={{ minWidth: 2600, fontSize: 12.5 }}>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Date</th>
                        <th>Working Status</th>
                        <th>Reported From</th>
                        <th>Day Start</th>
                        <th>Day End</th>
                        <th>First Call Time</th>
                        <th>Last Call Time</th>
                        <th>Travel Area</th>
                        <th>Joint Work With</th>
                        <th>Total Met</th>
                        <th>Listed Doctor Met</th>
                        <th>Unlisted Doctor Met</th>
                        <th>Total Doctor Met</th>
                        <th>Listed Doctor POB</th>
                        <th>Unlisted Doctor POB</th>
                        <th>Total Doctor POB</th>
                        <th>Listed Chemist Met</th>
                        <th>Unlisted Chemist Met</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.logs?.map((log, idx) => (
                        <tr key={idx} style={{ background: log.deviated ? "rgba(239,68,68,0.04)" : "transparent" }}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: "#2563eb" }}>{log.date}</td>
                          <td style={{ fontWeight: 600 }}>{log.status || log.workingStatus}</td>
                          <td>{log.reportFrom || log.reportedFrom || "-"}</td>
                          <td>{log.start || log.dayStart || "-"}</td>
                          <td>{log.end || log.dayEnd || "-"}</td>
                          <td>{log.firstCall || log.firstCallTime || "-"}</td>
                          <td>{log.lastCall || log.lastCallTime || "-"}</td>
                          <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{log.area}</td>
                          <td>{log.jointWork || log.jointWorkWith || "-"}</td>
                          <td style={{ fontWeight: 700, color: "#1e293b" }}>{log.totalProv || log.totalProvidersMet || 0}</td>
                          <td>{log.listDoc || log.listedDoctorMet || 0}</td>
                          <td>{log.unlistDoc || log.unlistedDoctorMet || 0}</td>
                          <td>{log.totDoc || log.totalDoctorMet || 0}</td>
                          <td style={{ fontFamily: "monospace" }}>{Number(log.listDocPob || log.listedDoctorPob || 0).toFixed(2)}</td>
                          <td style={{ fontFamily: "monospace" }}>{Number(log.unlistDocPob || log.unlistedDoctorPob || 0).toFixed(2)}</td>
                          <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{Number(log.totDocPob || log.totalDoctorPob || 0).toFixed(2)}</td>
                          <td>{log.listChem || log.listedChemistMet || 0}</td>
                          <td>{log.unlistChem || log.unlistedChemistMet || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Input Render Component Matrices ───

function FloatingDatePicker({ label, value, onChange, required }) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(value);
  const active = isFocused || hasValue;

  return (
    <div className="dc-field-wrap">
      <div style={{ position: "relative", width: "100%", height: FH }}>
        <input 
          type="date" 
          value={value || ""} 
          onChange={e => onChange(e.target.value)} 
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
          style={{
            width: "100%", height: "100%", borderRadius: 8, background: "#ffffff",
            padding: "0 12px", fontSize: 13, color: "#1e293b", transition: "all 0.15s", outline: "none",
            fontWeight: hasValue ? 600 : 500,
            border: `1.5px solid ${isFocused ? "#3B82F6" : "#e2e8f0"}`,
            boxShadow: isFocused ? "0 0 0 3px rgba(59,130,246,0.12)" : "none"
          }}
        />
        <label style={{
          position: "absolute", left: 10, pointerEvents: "none", zIndex: 10,
          transition: "all 0.15s", fontWeight: 600, letterSpacing: "0.03em",
          top: active ? 0 : "50%", transform: "translateY(-50%)",
          fontSize: active ? 11 : 13,
          color: isFocused ? "#3B82F6" : "#94a3b8",
          background: active ? "#ffffff" : "transparent", padding: active ? "0 4px" : "0"
        }}>
          {label}{required ? " *" : ""}
        </label>
      </div>
    </div>
  );
}

function SingleDropdown({ label, options = [], value, onSelect, disabled }) {
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
        width: rect.width
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

function MultiDropdown({ label, options = [], selectedIds = [], onChange, disabled }) {
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
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const toggle = id => onChange(selectedIds.includes(id) ? selectedIds.filter(i => String(i) !== String(id)) : [...selectedIds, String(id)]);
  const selectAll = () => onChange((options || []).map(o => String(o?.id || o?.value)));
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
          background: bgColor + " !important", boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box",
          boxShadow: isOpen && !disabled ? "0 0 0 3px rgba(59,130,246,0.12)" : "none"
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
                const optId = String(opt?.id || opt?.value);
                const isSel = selectedIds.includes(optId);
                return (
                  <li
                    key={idx}
                    className={`dc-opt${isSel ? " selected" : ""}`}
                    style={{
                      padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                      color: isSel ? "#2563eb" : "#475569",
                      backgroundColor: isSel ? "rgba(59,130,246,0.08)" : "#ffffff",
                      fontWeight: isSel ? "600" : "500"
                    }}
                    onMouseDown={(e) => { e.preventDefault(); toggle(optId); }}
                  >
                    <input type="checkbox" checked={isSel} readOnly style={{ accentColor: "#3B82F6", cursor: "pointer", marginRight: 4 }} />
                    {opt?.label}
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