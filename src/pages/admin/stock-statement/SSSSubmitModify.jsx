import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, CheckCircle2, ChevronDown,
  Filter, Check, Save, FileSpreadsheet
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants & Variables Matrix ───────────────────────────────────────────
const FH = 40;
const PAGE_SIZES = [10, 20, 50];

const MONTHS = [
  { value: "January", label: "January" }, { value: "February", label: "February" },
  { value: "March", label: "March" }, { value: "April", label: "April" },
  { value: "May", label: "May" }, { value: "June", label: "June" },
  { value: "July", label: "July" }, { value: "August", label: "August" },
  { value: "September", label: "September" }, { value: "October", label: "October" },
  { value: "November", label: "November" }, { value: "December", label: "December" }
];

const monthToNumber = {
  "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
  "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: String(CURRENT_YEAR - 2 + i),
  label: String(CURRENT_YEAR - 2 + i)
}));

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
    .col-span-2 { grid-column: span 1 !important; }
  }
  @media(max-width: 1024px) {
    .ucr-grid, .ucr-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  }
  @media(max-width: 640px) {
    .ucr-grid, .ucr-grid-4 { grid-template-columns: 1fr; gap: 20px; }
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

export default function SSSSubmitModify() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [filters, setFilters] = useState({
    stateId: "",
    districtId: "",
    employeeId: "",
    stockistId: "",
    month: "",
    year: String(CURRENT_YEAR)
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stockists, setStockists] = useState([]);
  const [products, setProducts] = useState([]);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  }), []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/masters/states", getAuthHeaders());
        const stateData = res.data?.data || res.data || [];
        const normalizedStates = Array.isArray(stateData) ? stateData.map((s) => ({
          id: s.id ?? s.stateId,
          stateName: s.state_name || s.stateName || s.name || "Unknown"
        })) : [];
        setStates(normalizedStates);
      } catch (err) { console.error("Failed to load states", err); }
    };
    fetchStates();
  }, [getAuthHeaders]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, districtId: "", employeeId: "", stockistId: "" }));
    setDistricts([]); setEmployees([]); setStockists([]);
    setTableVisible(false);
    
    if (filters.stateId) {
      const fetchDistricts = async () => {
        try {
          const res = await api.get(`/api/masters/districts?stateId=${filters.stateId}`, getAuthHeaders());
          const districtData = res.data?.data || res.data || [];
          const normalizedDistricts = Array.isArray(districtData) ? districtData.map((d) => ({
            id: d.id ?? d.districtId,
            districtName: d.district_name || d.districtName || d.name || "Unknown"
          })) : [];
          setDistricts(normalizedDistricts);
        } catch (err) { console.error("Failed to load districts", err); }
      };
      fetchDistricts();
    }
  }, [filters.stateId, getAuthHeaders]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, employeeId: "", stockistId: "" }));
    setEmployees([]); setStockists([]);
    setTableVisible(false);

    if (filters.districtId) {
      const fetchEmployees = async () => {
        try {
          const res = await api.get(`/api/masters/employees/filter?stateId=${filters.stateId}&districtId=${filters.districtId}`, getAuthHeaders());
          const employeeData = res.data?.data || res.data || [];
          const normalizedEmployees = Array.isArray(employeeData) ? employeeData.map((e) => ({
            id: e.id ?? e.employeeId,
            employeeName: e.employee_name || e.employeeName || e.name || "Unknown"
          })) : [];
          setEmployees(normalizedEmployees);
        } catch (err) { console.error("Failed to load employees", err); }
      };
      fetchEmployees();
    }
  }, [filters.stateId, filters.districtId, getAuthHeaders]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, stockistId: "" }));
    setStockists([]);
    setTableVisible(false);

    if (filters.employeeId) {
      const fetchStockists = async () => {
        try {
          const res = await api.get(`/api/expense/sss/providers?employeeId=${filters.employeeId}&stateId=${filters.stateId}&districtId=${filters.districtId}`, getAuthHeaders());
          const stockistData = res.data?.data || res.data || [];
          
          const normalizedStockists = Array.isArray(stockistData)
            ? stockistData.map((s) => ({
                id: String(s.id ?? ""),
                stockistName: s.providerName || s.name || "Unknown",
                type: s.type || ""
              })).filter((s) => s.id !== "")
            : [];
          
          setStockists(normalizedStockists);
        } catch (err) { 
          console.error("Failed to load stockists", err); 
        }
      };
      fetchStockists();
    }
  }, [filters.employeeId, filters.stateId, filters.districtId, getAuthHeaders]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setTableVisible(false); 
  };

  const handleFilterSubmit = async () => {
    setError("");

    if (!filters.stateId || !filters.districtId || !filters.employeeId || !filters.stockistId || !filters.month || !filters.year) {
      return setError("Please select all filter fields before submitting.");
    }

    setIsLoading(true);
    try {
      const monthNum = monthToNumber[filters.month];

      const res = await api.get(
        `/api/expense/sss/form?providerId=${filters.stockistId}&stateId=${filters.stateId}&month=${monthNum}&year=${filters.year}`,
        getAuthHeaders()
      );

      const formData = res.data?.data || {};
      const fetchedProducts = Array.isArray(formData.rows) ? formData.rows : [];

      const formattedProducts = fetchedProducts.map((p) => ({
        ...p,
        opening: String(p.opening ?? 0),
        primarySale: String(p.primarySale ?? 0),
        salesReturn: String(p.salesReturn ?? 0),
        closing: String(p.closing ?? 0),
        secondarySale: String(p.secondarySale ?? 0),
        receipt: String(p.receipt ?? 0),
        scheme: String(p.scheme ?? 0),
        expiry: String(p.expiry ?? 0),
        breakage: String(p.breakage ?? 0),
        batchRecall: String(p.batchRecall ?? 0),
        batchNumber: p.batchNumber || null
      }));

      setProducts(formattedProducts);
      setTableVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch statement data.");
      setProducts([]);
      setTableVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableChange = (index, field, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const updatedProducts = [...products];
      updatedProducts[index][field] = value;
      setProducts(updatedProducts);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const monthNum = monthToNumber[filters.month];

      const payload = {
        providerId: Number(filters.stockistId),
        month: monthNum,
        year: Number(filters.year),
        rows: products.map((p) => ({
          productId: p.productId || p.id,
          opening: Number(p.opening) || 0,
          receipt: Number(p.receipt) || 0,
          primarySale: Number(p.primarySale) || 0,
          scheme: Number(p.scheme) || 0,
          salesReturn: Number(p.salesReturn) || 0,
          closing: Number(p.closing) || 0,
          expiry: Number(p.expiry) || 0,
          breakage: Number(p.breakage) || 0,
          batchRecall: Number(p.batchRecall) || 0,
          batchNumber: p.batchNumber || null,
          secondarySale: Number(p.secondarySale) || 0
        }))
      };

      await api.post("/api/expense/sss", payload, getAuthHeaders());

      setPopup({ isOpen: true, message: "Stock-Sales & Statement submitted successfully!" });
      setTableVisible(false);
      setProducts([]);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit statement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stateOpts = states.map(s => ({ value: String(s.id), label: s.stateName })).filter(opt => opt.value !== "");
  const distOpts = districts.map(d => ({ value: String(d.id), label: d.districtName })).filter(opt => opt.value !== "");
  const empOpts = employees.map(e => ({ value: String(e.id), label: e.employeeName })).filter(opt => opt.value !== "");
  const stockOpts = stockists.map((s) => ({
    value: String(s.id),
    label: s.type ? `${s.stockistName} (${s.type})` : s.stockistName
  })).filter((opt) => opt.value !== "");

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Filter Card */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <FileSpreadsheet size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Stock-Sales & Statement Filter</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Submit or modify monthly stock and sales records</p>
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
            <div className="ucr-grid-4" style={{ marginBottom: 16 }}>
              <FloatingDropdown label="Select State" options={stateOpts} value={filters.stateId} onSelect={(v) => handleFilterChange("stateId", v)} />
              <FloatingDropdown label="Select District" options={distOpts} value={filters.districtId} onSelect={(v) => handleFilterChange("districtId", v)} disabled={!filters.stateId} />
              <FloatingDropdown label="Select Employee" options={empOpts} value={filters.employeeId} onSelect={(v) => handleFilterChange("employeeId", v)} disabled={!filters.districtId} />
              <FloatingDropdown label="Select Stockist" options={stockOpts} value={filters.stockistId} onSelect={(v) => handleFilterChange("stockistId", v)} disabled={!filters.employeeId} />
            </div>
            <div className="ucr-grid-4">
              <FloatingDropdown label="Select Month" options={MONTHS} value={filters.month} onSelect={(v) => handleFilterChange("month", v)} />
              <FloatingDropdown label="Select Year" options={YEARS} value={filters.year} onSelect={(v) => handleFilterChange("year", v)} />
              <div className="col-span-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleFilterSubmit}
                  disabled={isLoading}
                  className="dc-submit-btn"
                  style={{ width: "100%", maxWidth: 200, justifyContent: "center" }}
                >
                  {isLoading ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Check size={14} />}
                  Submit SSS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>Stock-Sales & Statement</h1>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: 60 }}>S.No</th>
                    <th>Product Name</th>
                    <th style={{ textAlign: "right" }}>Net Rate</th>
                    <th style={{ textAlign: "center", width: 120 }}>Opening</th>
                    <th style={{ textAlign: "center", width: 120 }}>Primary</th>
                    <th style={{ textAlign: "center", width: 120 }}>Sales Return</th>
                    <th style={{ textAlign: "center", width: 120 }}>Closing</th>
                    <th style={{ textAlign: "center", width: 120 }}>Secondary Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                        No products found for this selection.
                      </td>
                    </tr>
                  ) : (
                    products.map((row, index) => (
                      <tr key={row.id || index}>
                        <td style={{ color: "#64748b", textAlign: "center" }}>{index + 1}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.productName || "—"}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#1e293b" }}>₹{Number(row.netRate).toFixed(2) || 0}</td>
                        <td style={{ padding: "8px 16px" }}>
                          <TableInput value={row.opening} onChange={(val) => handleTableChange(index, "opening", val)} />
                        </td>
                        <td style={{ padding: "8px 16px" }}>
                          <TableInput value={row.primarySale} onChange={(val) => handleTableChange(index, "primarySale", val)} />
                        </td>
                        <td style={{ padding: "8px 16px" }}>
                          <TableInput value={row.salesReturn} onChange={(val) => handleTableChange(index, "salesReturn", val)} />
                        </td>
                        <td style={{ padding: "8px 16px" }}>
                          <TableInput value={row.closing} onChange={(val) => handleTableChange(index, "closing", val)} />
                        </td>
                        <td style={{ padding: "8px 16px" }}>
                          <TableInput value={row.secondarySale} onChange={(val) => handleTableChange(index, "secondarySale", val)} />
                        </td>
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
              onClick={handleFinalSubmit}
              disabled={isSubmitting || products.length === 0}
              className="dc-submit-btn"
            >
              {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={14} />}
              Submit Data
            </button>
          </div>
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

function TableInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        width: "100%", height: 34, textAlign: "center", border: `1.5px solid ${isFocused ? "#3B82F6" : "#e2e8f0"}`,
        borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#1e293b", outline: "none",
        background: "#fff", transition: "all 0.15s",
        boxShadow: isFocused ? "0 0 0 3px rgba(59,130,246,0.12)" : "none"
      }}
    />
  );
}

// ─── Searchable Portal Configuration Dropdown Component ───
function FloatingDropdown({ label, options, value, onSelect, disabled }) {
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
                  onMouseDown={() => { onSelect(opt.value); setIsOpen(false); }}
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