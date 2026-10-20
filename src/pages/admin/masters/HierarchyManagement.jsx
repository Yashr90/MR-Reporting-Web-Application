import React, { useState, useEffect, useRef } from "react";
import { Loader2, MapPin, CheckCircle2, AlertCircle, ChevronDown, Check, Trash2, Search, FileSpreadsheet } from "lucide-react";
import api from "../../../services/api";

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ucr-wrap {
    font-family: 'Inter', sans-serif;
    width: 100%;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Single Unified Card Container ── */
  .ucr-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: isolate;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    position: relative;
    overflow: visible;
  }

  /* ── Card Header ── */
  .ucr-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    border-radius: 16px 16px 16px 16px !important;
  }

  /* ── Form Body ── */
  .ucr-body { padding: 20px 28px 24px; background: #ffffff; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; }

  /* ── Layout Configurations ── */
  .filter-container-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    align-items: flex-end;
    margin-bottom: 25px;
  }

  .filter-container-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    align-items: flex-end;
    margin-bottom: 25px;
  }

  .tables-split-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 10px;
  }

  @media(max-width: 1024px) {
    .filter-container-3 { grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .filter-container-4 { grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .tables-split-grid { grid-template-columns: 1fr; gap: 24px; }
  }

  @media(max-width: 768px) {
    .filter-container-3, .filter-container-4 { grid-template-columns: 1fr; gap: 20px; }
    .ucr-body { padding: 20px 16px; }
    .ucr-header { padding: 20px 16px 12px; }
    .ucr-submit-btn { width: 100%; justify-content: center !important; }
  }

  /* ── Premium List Boxes ── */
  .premium-list-box {
    border: 1px solid #edf2f7;
    border-radius: 12px;
    overflow: hidden;
    height: 480px;
    background: #ffffff;
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
    display: flex;
    flex-direction: column;
  }

  .premium-list-scroll {
    overflow-y: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }
  .premium-list-scroll::-webkit-scrollbar { width: 4px; }
  .premium-list-scroll::-webkit-scrollbar-track { background: transparent; }
  .premium-list-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  /* ── Premium Tables ── */
  .premium-ui-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; white-space: nowrap; }
  .premium-ui-table thead tr { position: sticky; top: 0; z-index: 10; }
  .premium-ui-table thead { background: #f8fafc; }
  .premium-ui-table th { 
    padding: 12px 14px; 
    font-size: 11px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 0.04em; 
    color: #64748b;
    border-bottom: 1px solid #edf2f7; 
  }
  .premium-ui-table td { padding: 12px 14px; color: #475569; border-bottom: 1px solid #f8fafc; font-weight: 500; }
  .premium-ui-table tbody tr:last-child td { border-bottom: none; }
  .premium-ui-table tbody tr:hover { background: #f8fafc; }
  .premium-ui-table tbody tr.row-selected { background: rgba(59, 130, 246, 0.05) !important; }

  /* ── Dropdown list ── */
  .dc-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    z-index: 9999 !important;
    overflow: hidden;
  }

  .dc-dropdown ul {
    max-height: 220px;
    overflow-y: auto;
    padding: 6px;
    margin: 0;
    list-style: none;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }

  .dc-dropdown ul::-webkit-scrollbar { width: 4px; }
  .dc-dropdown ul::-webkit-scrollbar-track { background: transparent; }
  .dc-dropdown ul::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  .dc-opt {
    padding: 8px 12px;
    font-size: 13.5px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    transition: all 0.12s;
    font-weight: 500;
  }
  .dc-opt:hover   { background: rgba(59,130,246,0.06); color: #2563eb; }
  .dc-opt.selected { background: rgba(59,130,246,0.08); color: #2563eb; font-weight: 600; }

  /* ── System Error Banner ── */
  .ucr-error-banner {
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

  /* ── Premium Actions Buttons ── */
  .ucr-submit-btn {
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
    opacity: 1 !important;
  }
  .ucr-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
    background: #1d4ed8 !important;
  }
  .ucr-submit-btn:disabled { background: #93c5fd !important; color: #ffffff !important; cursor: not-allowed; box-shadow: none; opacity: 0.8 !important; }

  .ucr-delete-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: #e11d48 !important;
    color: #fff !important;
    box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3);
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.01em;
    height: 40px;
  }
  .ucr-delete-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(225, 29, 72, 0.45);
    background: #be123c !important;
  }
  .ucr-delete-btn:disabled { background: #fca5a5 !important; color: #ffffff !important; cursor: not-allowed; box-shadow: none; opacity: 0.8 !important; }

  .dc-overlay {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,0.3);
    backdrop-filter: blur(4px);
    padding: 16px;
  }

  .dc-popup {
    background: #ffffff;
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

  .dc-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dc-zoom { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
`;

const FH = 40;

const fieldBase = {
  width: "100%",
  height: FH,
  borderRadius: 8,
  fontSize: 14,
  color: "#1e293b",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.18s",
  fontFamily: "'Inter', sans-serif",
};

export default function HierarchyManagement() {
  // ── UI State ──
  const [activeTab, setActiveTab] = useState("Update Hierarchy");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isMapping, setIsMapping] = useState(false);
  const [filterToggle, setFilterToggle] = useState(true);

  // ── Common Dropdown Data ──
  const [states, setStates] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [districts, setDistricts] = useState([]); // 🌟 NEW: To hold districts for Headquarter mapping

  // ==========================================
  // 🟢 UPDATE HIERARCHY STATES
  // ==========================================
  const [selectedStateIds, setSelectedStateIds] = useState([]);
  const [selectedDesignationId, setSelectedDesignationId] = useState("");
  const [employees, setEmployees] = useState([]); 
  const [managers, setManagers] = useState([]);   
  const [tablesVisible, setTablesVisible] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");

  // ==========================================
  // 🔴 DELETE HIERARCHY STATES
  // ==========================================
  const [delSelectedStateIds, setDelSelectedStateIds] = useState([]);
  const [delSelectedDesignationIds, setDelSelectedDesignationIds] = useState([]);
  const [delSelectedEmployeeIds, setDelSelectedEmployeeIds] = useState([]);
  const [delEmployees, setDelEmployees] = useState([]);
  
  // Delete Table States
  const [delHierarchyData, setDelHierarchyData] = useState([]);
  const [delTableVisible, setDelTableVisible] = useState(false);
  const [delSearchQuery, setDelSearchQuery] = useState("");
  const [delSelectedRows, setDelSelectedRows] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Initial Fetch ──
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [stRes, desRes] = await Promise.all([
        api.get("/api/masters/states"),
        api.get("/api/masters/designations") // Standard designations endpoint
      ]);
      const stData = stRes.data?.data || stRes.data || [];
      const desData = desRes.data?.data || desRes.data || [];
      
      setStates(Array.isArray(stData) ? stData : []);
      setDesignations(Array.isArray(desData) ? desData : []);
    } catch (err) {
      console.error("Failed to load dropdowns", err);
    }
  };

  // ── Fetch Districts (Headquarters) based on selected states ──
  useEffect(() => {
    const fetchDistricts = async () => {
      if (delSelectedStateIds.length === 0) {
        setDistricts([]);
        return;
      }
      try {
        // Fetch districts for all selected states concurrently
        const promises = delSelectedStateIds.map(stateId => 
          api.get(`/api/masters/districts/all?stateId=${stateId}`)
        );
        const responses = await Promise.all(promises);
        
        // Combine all districts into a single array
        const combinedDistricts = responses.flatMap(res => res.data?.data || res.data || []);
        setDistricts(combinedDistricts);
      } catch (err) {
        console.error("Failed to fetch districts", err);
      }
    };
    fetchDistricts();
  }, [delSelectedStateIds]);

  // ── Delete Hierarchy: Fetch Employees Dropdown ──
  useEffect(() => {
    if (delSelectedStateIds.length > 0 && delSelectedDesignationIds.length > 0) {
      fetchDeleteEmployees();
    } else {
      // ⚛️ Clears the employee list and selection if states/designations are deselected
      setDelEmployees([]);
      setDelSelectedEmployeeIds([]);
    }
  }, [delSelectedStateIds, delSelectedDesignationIds]);

  const fetchDeleteEmployees = async () => {
    try {
      const stateIdsString = delSelectedStateIds.join(',');
      const desigIdsString = delSelectedDesignationIds.join(',');
      
      const res = await api.get(`/api/masters/employees/filter-multi?stateIds=${stateIdsString}&designationIds=${desigIdsString}`);
      setDelEmployees(res.data?.data || res.data || []);
    } catch (e) {
      setDelEmployees([]);
    }
  };

  // ── Handlers: Update Hierarchy ──
  const handleGetEmployees = async () => {
    if (selectedStateIds.length === 0 || !selectedDesignationId) return;
    
    setError("");
    setIsLoading(true);
    setSelectedEmployeeIds([]);
    setSelectedManagerId("");

    const selectedDesigObj = designations.find(d => d.id.toString() === selectedDesignationId.toString());
    const designationLevel = selectedDesigObj?.level || "";
    const stateIdsString = selectedStateIds.join(',');

    try {
      const empRes = await api.get(`/api/masters/employees/hierarchy/employees?stateIds=${stateIdsString}&designationId=${selectedDesignationId}`);
      const empData = empRes.data?.data || empRes.data || [];
      setEmployees(Array.isArray(empData) ? empData : []);

      const mgrRes = await api.get(`/api/masters/employees/hierarchy/managers?stateIds=${stateIdsString}&level=${designationLevel}`);
      const mgrData = mgrRes.data?.data || mgrRes.data || [];
      setManagers(Array.isArray(mgrData) ? mgrData : []);
      
      setTablesVisible(true);
    } catch (err) {
      setError("Failed to load employees and managers.");
      setTablesVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapHierarchy = async () => {
    if (selectedEmployeeIds.length === 0 || !selectedManagerId) return;
    
    setError("");
    setIsMapping(true);

    try {
      const res = await api.put("/api/masters/employees/hierarchy/map", {
        employeeIds: selectedEmployeeIds,
        managerId: parseInt(selectedManagerId)
      });

      if (res.data?.success || res.status === 200) {
        setPopup({ isOpen: true, message: "Hierarchy Mapped Successfully!" });
        handleGetEmployees(); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to map hierarchy.");
    } finally {
      setIsMapping(false);
    }
  };

  // ── Handlers: Delete Hierarchy ──
  const handleGetDeleteDetails = async () => {
    if (delSelectedEmployeeIds.length === 0) return;
    
    setError("");
    setIsLoading(true);
    setDelSelectedRows([]);

    try {
      // POST request to fetch MRs for deletion
      const res = await api.post("/api/masters/employees/hierarchy/mrs-for-deletion", {
        employeeIds: delSelectedEmployeeIds
      });
      const data = res.data?.data || res.data || [];
      setDelHierarchyData(Array.isArray(data) ? data : []);
      setDelTableVisible(true);
    } catch (err) {
      setError("Failed to load hierarchy details for selected employees.");
      setDelTableVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHierarchy = async () => {
    if (delSelectedRows.length === 0) return;
    
    setError("");
    setIsDeleting(true);

    try {
      // PUT request to remove the manager mapping
      const res = await api.put("/api/masters/employees/hierarchy/remove", { 
        employeeIds: delSelectedRows 
      });
      
      if (res.data?.success || res.status === 200) {
        setPopup({ isOpen: true, message: "Hierarchy Removed Successfully!" });
        setDelSelectedRows([]);
        handleGetDeleteDetails(); // Refresh table
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove hierarchy.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Checkbox Handlers: Update Hierarchy ──
  const toggleEmployeeRow = (id) => setSelectedEmployeeIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAllEmployees = (e) => setSelectedEmployeeIds(e.target.checked ? employees.map(emp => emp.id) : []);

  // ── Checkbox Handlers: Delete Hierarchy ──
  const toggleDelRow = (id) => setDelSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAllDelRows = (e, filteredData) => setDelSelectedRows(e.target.checked ? filteredData.map(item => item.id) : []);

  const handleTabChange = (val) => {
    setActiveTab(val);
    setError("");
    setTablesVisible(false);
    setDelTableVisible(false);
    setDelSelectedRows([]);
  };

  // 🌟 NEW: Helper function to resolve District/Headquarter Name
  const getDistrictName = (item) => {
    // 1. Fallback if the backend already mapped it to strings
    if (item.headquarter?.hq_name) return item.headquarter.hq_name;
    if (item.headquarter && typeof item.headquarter === 'string') return item.headquarter;
    if (item.hq_name) return item.hq_name;
    if (item.district?.district_name) return item.district.district_name;
    
    // 2. Map using the districtId and the fetched districts state
    const dId = item.districtId || item.district_id;
    if (dId) {
      const match = districts.find(d => d.id === dId);
      if (match) return match.district_name || match.name;
    }
    
    return "—";
  };

  // Frontend Filter Logic for Delete Table
  const filteredDelData = delHierarchyData.filter(item => {
    const empName = item.name || item.employee_name || "";
    const mgrName = item.reportingManager?.name || item.manager_name || "";
    const empCode = item.userCode || item.emp_code || "";
    
    return empName.toLowerCase().includes(delSearchQuery.toLowerCase()) ||
           mgrName.toLowerCase().includes(delSearchQuery.toLowerCase()) ||
           empCode.toLowerCase().includes(delSearchQuery.toLowerCase());
  });

  return (
    <div className="ucr-wrap">
      <style>{STYLES}</style>

      <div className="ucr-card">
        
        {/* ── TOP HEADER & FILTER TOGGLE ── */}
        <div className="ucr-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Hierarchy Management</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Map or delete mappings inside fields workflows</p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button 
              onClick={() => setFilterToggle(!filterToggle)}
              style={{
                width: 40, height: 20, borderRadius: 100, position: "relative", border: "none", cursor: "pointer", transition: "all 0.2s",
                background: filterToggle ? "#3B82F6" : "#cbd5e1"
              }}
            >
              <div style={{ width: 14, height: 14, background: "#ffffff", borderRadius: "50%", position: "absolute", top: 3, transition: "all 0.2s", left: filterToggle ? 23 : 3 }} />
            </button>
            <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
          </div>
        </div>

        <div className="ucr-body">
          {/* ── TAB SELECTION BAR ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "12px 20px", background: "#f8fafc", borderRadius: 10, border: "1px solid #edf2f7", marginBottom: 24, flexWrap: "wrap" }}>
            {["Update Hierarchy", "Delete Hierarchy"].map(tab => (
              <label key={tab} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                  border: activeTab === tab ? "2px solid #3B82F6" : "2px solid #cbd5e1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: activeTab === tab ? "rgba(59,130,246,0.1)" : "#fff",
                  transition: "all 0.15s",
                  boxShadow: activeTab === tab ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
                }}>
                  {activeTab === tab && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />}
                </div>
                <span className="ucr-brand" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: activeTab === tab ? "#2563eb" : "#64748b" }}>
                  {tab}
                </span>
                <input type="radio" name="hierarchyTab" value={tab} checked={activeTab === tab} onChange={() => handleTabChange(tab)} style={{ display: "none" }} />
              </label>
            ))}
          </div>

          {error && (
            <div className="ucr-error-banner">
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* ── DYNAMIC FILTERS ── */}
          {filterToggle && (
            <div>
              {/* 🟢 UPDATE HIERARCHY FORM */}
              {activeTab === "Update Hierarchy" && (
                <div className="filter-container-3">
                  <MultiSelectDropdown label="SELECT STATE" options={states} selectedIds={selectedStateIds} onChange={(newIds) => { setSelectedStateIds(newIds); setTablesVisible(false); }} />
                  <FSelect label="SELECT DESIGNATION" value={selectedDesignationId} onChange={(e) => { setSelectedDesignationId(e.target.value); setTablesVisible(false); }} options={designations.map(d => ({ id: d.id, label: d.designation_name || d.name }))} />
                  <button 
                    onClick={handleGetEmployees} disabled={selectedStateIds.length === 0 || !selectedDesignationId || isLoading}
                    className="ucr-submit-btn"
                  >
                    {isLoading ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Check size={14} />} Get Employee
                  </button>
                </div>
              )}

              {/* 🔴 DELETE HIERARCHY FORM */}
              {activeTab === "Delete Hierarchy" && (
                <div className="filter-container-4">
                  <MultiSelectDropdown label="SELECT STATE" options={states} selectedIds={delSelectedStateIds} onChange={(newIds) => { setDelSelectedStateIds(newIds); setDelTableVisible(false); }} />
                  <MultiSelectDropdown label="SELECT DESIGNATION" options={designations} selectedIds={delSelectedDesignationIds} onChange={(newIds) => { setDelSelectedDesignationIds(newIds); setDelTableVisible(false); }} />
                  <MultiSelectDropdown label="SELECT EMPLOYEE" options={delEmployees} selectedIds={delSelectedEmployeeIds} onChange={(newIds) => { setDelSelectedEmployeeIds(newIds); setDelTableVisible(false); }} disabled={delSelectedStateIds.length === 0 || delSelectedDesignationIds.length === 0} />
                  <button 
                    onClick={handleGetDeleteDetails}
                    disabled={delSelectedEmployeeIds.length === 0 || isLoading}
                    className="ucr-submit-btn"
                  >
                    {isLoading ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Check size={14} />} Get Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* ── UPDATE HIERARCHY TABLES PANEL ── */}
          {/* ========================================== */}
          {activeTab === "Update Hierarchy" && tablesVisible && (
            <div className="tables-split-grid">
              
              {/* LEFT BLOCK: Employees */}
              <div className="premium-list-box">
                <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #edf2f7" }}>
                  <span className="ucr-brand" style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Employee List</span>
                </div>
                <div className="premium-list-scroll">
                  <table className="premium-ui-table">
                    <thead>
                      <tr>
                        <th style={{ width: 44, textAlign: "center" }}>
                          <input type="checkbox" onChange={toggleAllEmployees} checked={employees.length > 0 && selectedEmployeeIds.length === employees.length} style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }} />
                        </th>
                        <th>Name</th>
                        <th>State</th>
                        <th>Designation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontStyle: "italic" }}>No employees found.</td></tr>
                      ) : employees.map(emp => (
                        <tr key={emp.id} className={selectedEmployeeIds.includes(emp.id) ? "row-selected" : ""}>
                          <td style={{ textAlign: "center" }}>
                            <input type="checkbox" checked={selectedEmployeeIds.includes(emp.id)} onChange={() => toggleEmployeeRow(emp.id)} style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }} />
                          </td>
                          <td style={{ color: "#1e293b", fontWeight: 600 }}>{emp.name || emp.employee_name || "—"}</td>
                          <td style={{ fontSize: 12, color: "#64748b" }}>{emp.state?.state_name || emp.state_name || emp.state || "—"}</td>
                          <td style={{ fontSize: 12, color: "#64748b" }}>{emp.designation?.name || emp.designation?.designation_name || emp.designation_name || emp.designation || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background: "#f8fafc", padding: "10px 16px", borderTop: "1px solid #edf2f7", textAlign: "center" }}>
                  <span className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>{selectedEmployeeIds.length} Employee(s) Selected</span>
                </div>
              </div>

              {/* RIGHT BLOCK: Managers */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="premium-list-box" style={{ height: 422 }}>
                  <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #edf2f7" }}>
                    <span className="ucr-brand" style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Managers List</span>
                  </div>
                  <div className="premium-list-scroll">
                    <table className="premium-ui-table">
                      <thead>
                        <tr>
                          <th style={{ width: 54, textAlign: "center" }}>Select</th>
                          <th>Name</th>
                          <th>State</th>
                          <th>Designation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {managers.length === 0 ? (
                          <tr><td colSpan="4" style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontStyle: "italic" }}>No managers available.</td></tr>
                        ) : managers.map(mgr => (
                          <tr key={mgr.id} onClick={() => setSelectedManagerId(mgr.id)} style={{ cursor: "pointer" }} className={selectedManagerId === mgr.id ? "row-selected" : ""}>
                            <td style={{ textAlign: "center" }}>
                              <input type="radio" name="managerSelect" checked={selectedManagerId === mgr.id} onChange={() => setSelectedManagerId(mgr.id)} style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }} />
                            </td>
                            <td style={{ color: "#1e293b", fontWeight: 600 }}>{`${mgr.name || mgr.employee_name || "—"} - ${mgr.designation?.name || mgr.designation?.designation_name || mgr.designation_name || "Manager"}`}</td>
                            <td style={{ fontSize: 12, color: "#64748b" }}>{mgr.state?.state_name || mgr.state_name || mgr.state || "—"}</td>
                            <td style={{ fontSize: 12, color: "#64748b" }}>{mgr.designation?.name || mgr.designation?.designation_name || mgr.designation_name || mgr.designation || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={handleMapHierarchy} disabled={selectedEmployeeIds.length === 0 || !selectedManagerId || isMapping}
                    className="ucr-submit-btn" style={{ width: "100%" }}
                  >
                    {isMapping ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : "Map Hierarchy"}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* ── DELETE HIERARCHY TABLE PANEL ── */}
          {/* ========================================== */}
          {activeTab === "Delete Hierarchy" && delTableVisible && (
            <div style={{ border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.01)", marginTop: 10 }}>
              
              <div style={{ background: "#f8fafc", padding: "14px 20px", borderBottom: "1px solid #edf2f7", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                <span className="ucr-brand" style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>Manager Hierarchy List</span>
                
                {/* Search field */}
                <div style={{ position: "relative", width: 240 }} className="dc-field-wrap">
                  <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                    <Search size={15} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search name, code..."
                    value={delSearchQuery}
                    onChange={(e) => setDelSearchQuery(e.target.value)}
                    style={{
                      width: "100%", height: 36, borderRadius: 8, padding: "0 12px 0 36px", fontSize: 13, outline: "none", boxSizing: "border-box", border: "1.5px solid #e2e8f0", fontFamily: "'Inter', sans-serif", color: "#1e293b"
                    }}
                  />
                </div>
              </div>

              <div style={{ overflowX: "auto" }} className="premium-list-scroll">
                <table className="premium-ui-table">
                  <thead>
                    <tr>
                      <th style={{ width: 44, textAlign: "center" }}>
                        <input 
                          type="checkbox" 
                          onChange={(e) => toggleAllDelRows(e, filteredDelData)} 
                          checked={filteredDelData.length > 0 && delSelectedRows.length === filteredDelData.length} 
                          style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }}
                        />
                      </th>
                      <th>S.N.</th>
                      <th>State</th>
                      <th>Headquarter</th>
                      <th>Employee Name</th>
                      <th>Emp Code</th>
                      <th>Designation</th>
                      <th>Manager Name</th>
                      <th>Manager Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDelData.length === 0 ? (
                      <tr><td colSpan="9" style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontStyle: "italic" }}>No hierarchy records found.</td></tr>
                    ) : (
                      filteredDelData.map((item, index) => (
                        <tr key={item.id} className={delSelectedRows.includes(item.id) ? "row-selected" : ""}>
                          <td style={{ textAlign: "center" }}>
                            <input 
                              type="checkbox" 
                              checked={delSelectedRows.includes(item.id)} 
                              onChange={() => toggleDelRow(item.id)} 
                              style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }}
                            />
                          </td>
                          <td style={{ fontSize: 12, color: "#64748b" }}>{index + 1}</td>
                          <td style={{ fontSize: 12, color: "#475569" }}>{item.state?.state_name || item.state_name || item.state || "—"}</td>
                          <td style={{ fontSize: 12, color: "#475569" }}>{getDistrictName(item)}</td>
                          <td style={{ color: "#1e293b", fontWeight: 600 }}>{item.name || item.employee_name || "—"}</td>
                          <td style={{ fontSize: 12, color: "#2563eb", fontWeight: 700 }}>{item.userCode || item.emp_code || "—"}</td>
                          <td style={{ fontSize: 12, color: "#475569" }}>{item.designation?.name || item.designation?.designation_name || item.designation_name || item.designation || "—"}</td>
                          <td style={{ color: "#16a34a", fontWeight: 600 }}>{item.reportingManager?.name || item.manager_name || "—"}</td>
                          <td style={{ fontSize: 12, color: "#475569" }}>{item.reportingManager?.designation?.name || item.reportingManager?.designation?.designation_name || item.manager_designation || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="ucr-footer" style={{ borderTop: "1px solid #edf2f7" }}>
                <button 
                  onClick={handleDeleteHierarchy}
                  disabled={delSelectedRows.length === 0 || isDeleting}
                  className="ucr-delete-btn"
                >
                  {isDeleting ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Trash2 size={14} />} 
                  Delete ({delSelectedRows.length})
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ── Success Popup ── */}
      {popup.isOpen && (
        <div className="dc-overlay">
          <div className="dc-popup">
            <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.25)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
              <Check size={28} style={{ color:"#3B82F6", strokeWidth:2.5 }}/>
            </div>
            <h3 className="ucr-brand" style={{ fontSize:17, fontWeight:700, color:"#1e293b", textAlign:"center", margin:"0 0 8px", letterSpacing:"-0.01em" }}>Success</h3>
            <p style={{ fontSize:13, color:"#94a3b8", textAlign:"center", margin:"0 0 24px" }}>{popup.message}</p>
            <button
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

/* ─── Searchable Dropdown Selection Component ─── */
function FSelect({ label, value, onChange, disabled, options=[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  }, []);

  const selected    = options.find(o => String(o.id)===String(value));
  const hasVal      = Boolean(value);
  const active      = open||hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor      = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow      = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div ref={ref} style={{ position:"relative", width:"100%", userSelect:"none", zIndex: open?100:1 }} className="dc-field-wrap">
      <div onClick={()=>{ if(!disabled) setOpen(!open); }}
        style={{
          width:"100%", height:FH, borderRadius:8, padding:"0 36px 0 12px",
          fontSize:13, display:"flex", alignItems:"center",
          cursor: disabled?"not-allowed":"pointer", background: bgColor,
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled?"none":shadow, transition:"all 0.18s", boxSizing:"border-box",
        }}
      >
        <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:500, color: hasVal?(disabled?"#94a3b8":"#1e293b"):"transparent", fontSize:14 }}>
          {selected?.label||" "}
        </span>
        <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color: open?"#3B82F6":"#94a3b8", transition:"all 0.2s" }}>
          <ChevronDown size={15} style={{ transform: open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}/>
        </div>
      </div>

      <label style={{
        position:"absolute", left:10, pointerEvents:"none", zIndex:20,
        transition:"all 0.12s ease-out", fontWeight:500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}</label>

      {open && !disabled && (
        <div className="dc-dropdown">
          <ul>
            {options.length===0 && <li style={{ padding:"12px", fontSize:12, color:"#94a3b8", fontStyle:"italic" }}>No options available</li>}
            {options.map(opt => (
              <li key={opt.id}
                className={`dc-opt${String(value)===String(opt.id)?" selected":""}`}
                onMouseDown={e=>{ 
                  e.preventDefault(); 
                  onChange({ target: { value: String(opt.id) } }); 
                  setOpen(false); 
                }}
              >
                {String(value)===String(opt.id) && <Check size={12} style={{color:"#3B82F6",flexShrink:0}}/>}
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Searchable Multi-Select Dropdown Component ─── */
function MultiSelectDropdown({ label, options, selectedIds, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const hasVal = selectedIds.length > 0;
  const active = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor      = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow      = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";
  
  const displayValue = hasVal 
    ? options.filter(o => selectedIds.includes(o.id)).map(o => o.state_name || o.designation_name || o.name || o.employee_name).join(", ")
    : "";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open?100:1 }} className="dc-field-wrap">
      <div onClick={() => !disabled && setOpen(!open)}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor, border: `1.5px solid ${borderColor}`, boxShadow: shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
          {displayValue || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top:"50%", transform:"translateY(-50%)", color: open?"#3B82F6":"#94a3b8", transition: "all 0.2s", display: "flex", alignItems: "center" }}>
          <MapPin size={15} style={{ marginRight: 4, opacity: 0.7 }} />
          <ChevronDown size={14} style={{ transform: open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }} />
        </div>
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}</label>

      {open && !disabled && (
        <div className="dc-dropdown">
          <div style={{ display: "flex", borderBottom: "1px solid #edf2f7", background: "#f8fafc" }}>
            <button style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#2563eb", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onChange(options.map(o => o.id)); }}>Select All</button>
            <button style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onChange([]); }}>Deselect All</button>
          </div>
          <ul>
            {options.length === 0 && <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>}
            {options.map(opt => {
              const isSelected = selectedIds.includes(opt.id);
              return (
                <li key={opt.id} className={`dc-opt${isSelected ?" selected":""}`}
                  onMouseDown={(e) => { 
                    e.preventDefault(); 
                    onChange(isSelected ? selectedIds.filter(id => id !== opt.id) : [...selectedIds, opt.id]); 
                  }}
                >
                  <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: "#3B82F6", cursor: "pointer", marginRight: 8 }} />
                  {opt.state_name || opt.designation_name || opt.name || opt.employee_name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}