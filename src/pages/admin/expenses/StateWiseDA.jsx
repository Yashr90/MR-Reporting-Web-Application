import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, ChevronDown, SlidersHorizontal,
  Search, ChevronLeft, ChevronRight, Wallet, Check, X, FileSpreadsheet, Edit2, Trash2, Save
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 20, 50];
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
  .ucr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 24px; }
  .ucr-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 16px; margin-bottom: 0; }

  .col-span-2 { grid-column: span 2; }
  .col-span-4 { grid-column: span 4; }

  @media(max-width: 1200px) {
    .ucr-grid-4 { grid-template-columns: repeat(3, 1fr); }
    .col-span-4 { grid-column: span 3; }
  }
  @media(max-width: 1024px) {
    .ucr-grid, .ucr-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .col-span-4 { grid-column: span 2; }
  }
  @media(max-width: 640px) {
    .ucr-grid, .ucr-grid-4 { grid-template-columns: 1fr; gap: 20px; }
    .col-span-2, .col-span-4 { grid-column: span 1 !important; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; }
    .dc-submit-btn, .dc-delete-footer-btn { width: auto !important; }
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
  }
  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 1200px; }
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

export default function StateWiseDA() {
  // ─── Master Data State ───────────────────────────────────────────────────────
  const [states, setStates] = useState([]);
  const [designations, setDesignations] = useState([]);

  // ─── Form State ──────────────────────────────────────────────────────────────
  const [selectedStateIds, setSelectedStateIds] = useState([]);
  const [selectedDesigIds, setSelectedDesigIds] = useState([]);
  const [formData, setFormData] = useState({
    hqDa: "",
    exDa: "",
    outDa: "",
    mobileAllowance: "",
    netAllowance: "",
    postageStationary: "",
    postageFreight: ""
  });

  // ─── Table & UI State ────────────────────────────────────────────────────────
  const [daList, setDaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // ─── Helper for Auth Headers ─────────────────────────────────────────────────
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  });

  // ─── Fetch Initial Data ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [stateRes, desigRes, daRes] = await Promise.all([
        api.get("/api/expense/daily-allowance/states", getAuthHeaders()),
        api.get("/api/expense/daily-allowance/designations", getAuthHeaders()),
        api.get("/api/expense/daily-allowance", getAuthHeaders()) 
      ]);

      const stateData = stateRes.data?.data || stateRes.data || [];
      const desigData = desigRes.data?.data || desigRes.data || [];
      const listData = daRes.data?.data || daRes.data || [];

      const normalizedStates = Array.isArray(stateData)
        ? stateData.map((s) => ({
            id: s.id ?? s.stateId,
            stateName: s.state_name || s.stateName || s.name || "Unknown"
          }))
        : [];

      setStates(normalizedStates);
      setDesignations(Array.isArray(desigData) ? desigData : []);
      setDaList(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError("Failed to load initial data from server.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTable = async () => {
    try {
      const res = await api.get("/api/expense/daily-allowance", getAuthHeaders());
      const data = res.data?.data || res.data || [];
      setDaList(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Failed to refresh table", err); }
  };

  // ─── Form Handlers ───────────────────────────────────────────────────────────
  const handleInputChange = useCallback((field, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleSubmit = async () => {
    setError(""); 

    if (selectedStateIds.length === 0) return setError("Please select at least one State.");
    if (selectedDesigIds.length === 0) return setError("Please select at least one Designation.");
    if (!formData.hqDa || !formData.exDa || !formData.outDa) {
      return setError("Please fill HQ DA, EX DA, and OUT DA.");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        stateIds: selectedStateIds.map(Number),
        designationIds: selectedDesigIds.map(Number),
        hqDa: Number(formData.hqDa) || 0,
        exDa: Number(formData.exDa) || 0,
        outDa: Number(formData.outDa) || 0,
        mobileAllowance: Number(formData.mobileAllowance) || 0,
        netAllowance: Number(formData.netAllowance) || 0,
        postageStationary: Number(formData.postageStationary) || 0,
        postageFreight: Number(formData.postageFreight) || 0
      };

      await api.post("/api/expense/daily-allowance", payload, getAuthHeaders());
      setPopup({ isOpen: true, message: "Daily Allowance created successfully!" });

      setSelectedStateIds([]);
      setSelectedDesigIds([]);
      setFormData({ hqDa: "", exDa: "", outDa: "", mobileAllowance: "", netAllowance: "", postageStationary: "", postageFreight: "" });

      refreshTable();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Action Handlers (Edit/Delete) ───────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/api/expense/daily-allowance/${id}`, getAuthHeaders());
      setPopup({ isOpen: true, message: "Record deleted successfully!" });
      refreshTable();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete record.");
    }
  };

  const openEditModal = (row) => {
    setEditData({ 
      ...row,
      postageStationary: row.postageStationary || "",
      postageFreight: row.postageFreight || "" 
    });
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editData.hqDa || !editData.exDa || !editData.outDa) {
      return setError("HQ DA, EX DA, and OUT DA are required.");
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        hqDa: Number(editData.hqDa) || 0,
        exDa: Number(editData.exDa) || 0,
        outDa: Number(editData.outDa) || 0,
        mobileAllowance: Number(editData.mobileAllowance) || 0,
        netAllowance: Number(editData.netAllowance) || 0,
        postageStationary: Number(editData.postageStationary) || 0,
        postageFreight: Number(editData.postageFreight) || 0
      };

      await api.put(`/api/expense/daily-allowance/${editData.id}`, payload, getAuthHeaders());
      setPopup({ isOpen: true, message: "Record updated successfully!" });
      setEditModal(false);
      refreshTable();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportExcel = () => {
    const headers = "State,Designation,HQ DA,EX DA,OUT DA,Mobile Allowance,Net Allowance,Special Allowance\n";
    const csvData = filteredData.map(row => 
      `${row.stateName},${row.designationName},${row.hqDa},${row.exDa},${row.outDa},${row.mobileAllowance},${row.netAllowance},${row.specialAllowance}`
    ).join("\n");
    
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily_allowance_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ─── Derived Data ────────────────────────────────────────────────────────────
  const stateOpts = states.map((s) => ({
    id: String(s.id),
    label: s.stateName
  })).filter((opt) => opt.id !== "");

  const desigOpts = designations.map(d => ({ 
    id: String(d.designationId || d.id || ""), 
    label: d.designationName || d.name || "Unknown" 
  })).filter(opt => opt.id !== "");

  const filteredData = daList.filter(row => 
    (row.stateName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.designationName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const goToPage = p => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Main Creation Card */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Wallet size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Daily Allowance Form</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Configure allowances per state and designation</p>
            </div>
          </div>
        </div>

        <div className="dc-body">
          <div style={{
            background: "#f8fafc",
            border: "1px solid #edf2f7",
            borderRadius: 12,
            padding: "24px 20px 20px 20px",
            position: "relative",
            overflow: "visible"
          }}>
            <div className="ucr-brand" style={{
              position: "absolute", top: -10, left: 16, background: "#fff", border: "1px solid #edf2f7",
              padding: "2px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.02em"
            }}>
              Allowance Details
            </div>

            <div className="ucr-grid-4">
              <div className="col-span-2">
                <MultiSelectDropdown
                  label="Select State"
                  options={stateOpts}
                  selectedIds={selectedStateIds}
                  onChange={setSelectedStateIds}
                  disabled={isLoading}
                />
              </div>
              <div className="col-span-2">
                <MultiSelectDropdown
                  label="Select Designation"
                  options={desigOpts}
                  selectedIds={selectedDesigIds}
                  onChange={setSelectedDesigIds}
                  disabled={isLoading}
                />
              </div>

              <FloatingInput label="Enter HQ DA *" type="number" value={formData.hqDa} onChange={(e) => handleInputChange("hqDa", e.target.value)} />
              <FloatingInput label="Enter EX DA *" type="number" value={formData.exDa} onChange={(e) => handleInputChange("exDa", e.target.value)} />
              <div className="col-span-2">
                 <FloatingInput label="Enter OUT DA *" type="number" value={formData.outDa} onChange={(e) => handleInputChange("outDa", e.target.value)} />
              </div>
            </div>

            <div style={{ borderBottom: "1px solid #edf2f7", paddingBottom: 8, marginBottom: 16, marginTop: 16 }}>
              <h3 className="ucr-brand" style={{ fontSize: 13, fontWeight: 700, color: "#64748b", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Fix Expense Details</h3>
            </div>

            <div className="ucr-grid-4" style={{ marginBottom: 0 }}>
              <FloatingInput label="Mobile Allowance" type="number" value={formData.mobileAllowance} onChange={(e) => handleInputChange("mobileAllowance", e.target.value)} />
              <FloatingInput label="Net Allowances" type="number" value={formData.netAllowance} onChange={(e) => handleInputChange("netAllowance", e.target.value)} />
              <FloatingInput label="Postage / Stationary" type="number" value={formData.postageStationary} onChange={(e) => handleInputChange("postageStationary", e.target.value)} />
              <FloatingInput label="Postage / Freight" type="number" value={formData.postageFreight} onChange={(e) => handleInputChange("postageFreight", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="dc-footer">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="dc-submit-btn"
          >
            {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={14} />}
            Create Daily Allowance
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="dc-card">
        <div className="dc-header" style={{ background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>Existing Daily Allowances</h1>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#edf2f7", color: "#475569", padding: "4px 10px", borderRadius: 20 }}>
              {filteredData.length} Total
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", width: "100%", maxWidth: 350 }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search State, Designation..."
                style={{
                  width: "100%", height: 40, borderRadius: 8, border: "1px solid #e2e8f0",
                  padding: "0 32px 0 12px", fontSize: 13, outline: "none", color: "#1e293b", background: "#fff"
                }}
              />
              <Search size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            </div>
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
        </div>

        <div className="dc-body" style={{ padding: 0 }}>
          <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
            <table className="ucr-table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center", width: 60 }}>#</th>
                  <th>State</th>
                  <th>Designation</th>
                  <th>HQ DA</th>
                  <th>EX DA</th>
                  <th>OUT DA</th>
                  <th>Mobile All.</th>
                  <th>Net All.</th>
                  <th>Special All.</th>
                  <th style={{ textAlign: "center", width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: 40 }}>
                      <Loader2 style={{ animation: "dc-spin 1s linear infinite", margin: "0 auto", color: "#3B82F6" }} size={20} />
                    </td>
                  </tr>
                ) : pagedData.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                      No records found.
                    </td>
                  </tr>
                ) : (
                  pagedData.map((row, i) => (
                    <tr key={row.id}>
                      <td style={{ color: "#64748b", textAlign: "center" }}>{(currentPage - 1) * pageSize + i + 1}</td>
                      <td style={{ fontWeight: 600, textTransform: "uppercase", color: "#1e293b" }}>{row.stateName || "—"}</td>
                      <td style={{ fontWeight: 600, color: "#2563eb" }}>{row.designationName || "—"}</td>
                      <td style={{ fontWeight: 700, color: "#1e293b" }}>₹{row.hqDa || 0}</td>
                      <td style={{ fontWeight: 700, color: "#1e293b" }}>₹{row.exDa || 0}</td>
                      <td style={{ fontWeight: 700, color: "#1e293b" }}>₹{row.outDa || 0}</td>
                      <td>₹{row.mobileAllowance || 0}</td>
                      <td>₹{row.netAllowance || 0}</td>
                      <td>₹{row.specialAllowance || 0}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 4 }}
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row.id)}
                            style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 4 }}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredData.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #edf2f7", background: "#f8fafc", fontSize: 12, flexWrap: "wrap", gap: 12, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
              <div style={{ color: "#64748b" }}>
                Showing <span style={{ fontWeight: 700, color: "#1e293b" }}>{(currentPage - 1) * pageSize + 1}</span> to <span style={{ fontWeight: 700, color: "#1e293b" }}>{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span style={{ fontWeight: 700, color: "#1e293b" }}>{filteredData.length}</span> entries
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#64748b", marginRight: 6 }}>Items per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 8px", outline: "none", cursor: "pointer", color: "#475569", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div style={{ width: 12 }} />
                <button
                  type="button"
                  onClick={() => goToPage(1)} disabled={currentPage === 1}
                  style={pagBtnStyle}
                >First</button>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                  style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
                ><ChevronLeft size={14} /></button>
                <div style={{ background: "#2563eb", color: "#fff", border: "1px solid #2563eb", borderRadius: 6, padding: "4px 12px", fontWeight: 700 }}>
                  {currentPage}
                </div>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}
                  style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
                ><ChevronRight size={14} /></button>
                <button
                  type="button"
                  onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}
                  style={pagBtnStyle}
                >Last</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (React Portal Setup) */}
      {editModal && editData && createPortal(
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(15, 23, 42, 0.3)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div className="dc-card" style={{ 
            width: "100%", maxWidth: 800, margin: 0, overflow: "visible", 
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            <div className="dc-header">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="dc-page-icon">
                  <Edit2 size={16} color="#fff" />
                </div>
                <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, textTransform: "uppercase" }}>Edit Daily Allowance</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setEditModal(false);
                  setEditData(null);
                }}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="dc-body" style={{ overflowY: "auto", flex: 1, padding: "20px 28px 24px" }}>
              <div className="ucr-grid-4">
                <div className="col-span-2">
                  <FloatingInput
                    label="State"
                    value={editData.stateName || "—"}
                    disabled
                  />
                </div>
                <div className="col-span-2">
                  <FloatingInput
                    label="Designation"
                    value={editData.designationName || "—"}
                    disabled
                  />
                </div>

                <FloatingInput
                  label="HQ DA *"
                  type="number"
                  value={editData.hqDa}
                  onChange={(e) => setEditData({ ...editData, hqDa: e.target.value })}
                />
                <FloatingInput
                  label="EX DA *"
                  type="number"
                  value={editData.exDa}
                  onChange={(e) => setEditData({ ...editData, exDa: e.target.value })}
                />
                <FloatingInput
                  label="OUT DA *"
                  type="number"
                  value={editData.outDa}
                  onChange={(e) => setEditData({ ...editData, outDa: e.target.value })}
                />
                
                <div className="col-span-4" style={{ borderBottom: "1px solid #edf2f7", paddingBottom: 8, marginTop: 16, marginBottom: 8 }}>
                  <h3 className="ucr-brand" style={{ fontSize: 13, fontWeight: 700, color: "#64748b", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Fix Expense Details</h3>
                </div>

                <FloatingInput
                  label="Mobile Allowance"
                  type="number"
                  value={editData.mobileAllowance}
                  onChange={(e) => setEditData({ ...editData, mobileAllowance: e.target.value })}
                />
                <FloatingInput
                  label="Net Allowances"
                  type="number"
                  value={editData.netAllowance}
                  onChange={(e) => setEditData({ ...editData, netAllowance: e.target.value })}
                />
                <FloatingInput
                  label="Postage / Stationary"
                  type="number"
                  value={editData.postageStationary}
                  onChange={(e) => setEditData({ ...editData, postageStationary: e.target.value })}
                />
                <FloatingInput
                  label="Postage / Freight"
                  type="number"
                  value={editData.postageFreight}
                  onChange={(e) => setEditData({ ...editData, postageFreight: e.target.value })}
                />
              </div>
            </div>

            <div className="dc-footer" style={{ gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  setEditModal(false);
                  setEditData(null);
                }}
                className="dc-delete-footer-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                disabled={isSubmitting}
                className="dc-submit-btn"
              >
                {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={14} />}
                Update Record
              </button>
            </div>
          </div>
        </div>,
        document.body
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

const pagBtnStyle = { background: "#ffffff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569", fontFamily: "'Inter', sans-serif" };

// ═══════════════════════════════════════════════════════════════════
// UI Floating Controls Input Elements
// ═══════════════════════════════════════════════════════════════════
function FloatingInput({ label, value, onChange, type = "text", disabled = false }) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== "" && value !== null && value !== undefined;
  const active = hasValue || isFocused;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 12px", fontSize: 13,
          border: `1.5px solid ${active && !disabled ? "#3B82F6" : "#e2e8f0"}`, outline: "none",
          fontWeight: 500, color: disabled ? "#94a3b8" : "#1e293b",
          background: disabled ? "#f8fafc" : isFocused ? "#eff6ff" : "#fff",
          boxShadow: isFocused && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
          transition: "all 0.18s ease-in-out"
        }}
      />
      <label
        style={{
          position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 11 : 13,
          fontWeight: 500, color: disabled ? "#cbd5e1" : (isFocused ? "#3B82F6" : hasValue ? "#64748b" : "#94a3b8"),
          background: active ? "#fff" : "transparent", transition: "all 0.12s ease-out", pointerEvents: "none",
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0", zIndex: 20
        }}
      >
        {label}
      </label>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MultiSelectDropdown — Portal Driven Selection Wrapper Component
// ═══════════════════════════════════════════════════════════════════
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
                const isSelected = selectedIds.includes(option.id || option.value);
                return (
                  <li
                    key={option.id || option.value}
                    className={`dc-opt${isSelected ? " selected" : ""}`}
                    style={{
                      padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "8px",
                      color: isSelected ? "#2563eb" : "#475569",
                      backgroundColor: isSelected ? "rgba(59,130,246,0.08)" : "#ffffff",
                      fontWeight: isSelected ? "600" : "500"
                    }}
                    onMouseDown={(e) => { e.preventDefault(); toggleValue(option.id || option.value); }}
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