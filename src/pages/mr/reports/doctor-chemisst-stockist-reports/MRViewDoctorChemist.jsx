import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, ChevronDown, Filter, 
  Check, FileSpreadsheet, Search, X
} from "lucide-react";
import api from "../../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 20, 50];

const REPORT_OF_OPTIONS = [
  { id: "Doctor", label: "Doctor" },
  { id: "Chemist", label: "Chemist" },
  { id: "Stockist", label: "Stockist" }
];

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

/* ─── Premium UI Design System Styles (Matching reference Image 2) ────────── */
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
  .dc-opt:hover { background: rgba(59,130,246,0.06) !important; color: #2563eb; }
  .dc-opt.selected { background: rgba(59,130,246,0.08) !important; color: #2563eb; font-weight: 600; }

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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; min-width: 1700px; }
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
  .dc-submit-btn:disabled { background: #93c5fd !important; cursor: not-allowed; box-shadow: none; }

  .ucr-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ucr-zoom { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  .dropdown-portal { animation: ucr-zoom 0.15s ease; }
`;

export default function MRViewDoctorChemist() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [areasList, setAreasList] = useState([]);

  // Filters setup: areas, status, reportOf, categories
  const [filters, setFilters] = useState({
    areas: [],
    status: "active",
    reportOf: [],
    categories: []
  });

  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch areas from backend dynamically on component load
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await api.get("/api/mr/area-creation/areas");
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          setAreasList(data.map(item => ({
            id: String(item.id || item._id || item.areaCode || ""),
            label: item.areaName || item.area_name || item.name || "Unknown Area"
          })));
        }
      } catch (err) {
        console.warn("First area endpoint failed, trying fallback...", err);
        try {
          const res = await api.get("/api/areas");
          const data = res.data?.data || res.data || [];
          if (Array.isArray(data)) {
            setAreasList(data.map(item => ({
              id: String(item.id || item._id || item.areaCode || ""),
              label: item.areaName || item.area_name || item.name || "Unknown Area"
            })));
          }
        } catch (fallbackErr) {
          console.error("Failed to load areas from backend", fallbackErr);
          setError("Failed to load areas from backend API. Please make sure the backend is running.");
        }
      }
    };

    fetchAreas();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };
      
      // If we deselect "Doctor" from "reportOf", reset categories filter
      if (field === "reportOf" && !value.includes("Doctor")) {
        updated.categories = [];
      }
      return updated;
    });
  };

  const handleViewReport = async () => {
    setError("");
    if (!filters.status) {
      setError("Please select a status.");
      return;
    }
    if (!filters.reportOf.length) {
      setError("Please choose at least one item under 'Get Report Of'.");
      return;
    }

    setIsLoading(true);
    setTableVisible(false);
    setReportData([]);
    setPage(1);

    const queryParams = new URLSearchParams();
    if (filters.areas.length > 0) {
      queryParams.append("areaIds", filters.areas.join(","));
    }
    queryParams.append("status", filters.status === "active" ? "true" : "false");
    queryParams.append("reportOf", filters.reportOf.join(","));

    if (filters.reportOf.includes("Doctor") && filters.categories.length > 0) {
      queryParams.append("categories", filters.categories.join(","));
    }

    try {
      let response;
      try {
        response = await api.get(`/api/mr/reports/view-provider?${queryParams.toString()}`);
      } catch (e1) {
        try {
          response = await api.get(`/api/reports/view-provider?${queryParams.toString()}`);
        } catch (e2) {
          try {
            response = await api.get(`/api/reports/chemist-stockist-visit?${queryParams.toString()}`);
          } catch (e3) {
            // Throw custom error if all fail
            throw new Error("Unable to retrieve report from backend endpoints.");
          }
        }
      }

      const resData = response?.data?.data || response?.data || [];
      if (Array.isArray(resData)) {
        setReportData(resData);
      } else {
        setReportData([]);
      }
      setTableVisible(true);
    } catch (err) {
      setError(err.message || "Failed to fetch report records from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData.length) return;
    
    let csvContent = [
      ["S.No.", "State Name", "Headquarter Name", "Area Name", "Provider Type", "Provider Name", "Code", "Category", "Specialization", "Degree", "Address", "Phone", "Status", "Total Visit", "Visit Dates", "Product Name", "POB", "Order Qty", "Sample Qty", "Discussion"].join(",")
    ];

    reportData.forEach((row, rIdx) => {
      const products = Array.isArray(row.products) && row.products.length > 0 
        ? row.products 
        : [{ name: row.productName || row.product_name || "—", pob: row.pob || "0.00", orderQty: row.orderQty || row.order_qty || "0.00", sampleQty: row.sampleQty || row.sample_qty || "0.00" }];

      products.forEach((prod, pIdx) => {
        csvContent.push([
          pIdx === 0 ? rIdx + 1 : "",
          pIdx === 0 ? `"${row.stateName || row.state_name || "—"}"` : "",
          pIdx === 0 ? `"${row.headquarterName || row.hqName || row.hq_name || "—"}"` : "",
          pIdx === 0 ? `"${row.areaName || row.area_name || "—"}"` : "",
          pIdx === 0 ? `"${row.providerType || row.type || "—"}"` : "",
          pIdx === 0 ? `"${row.providerName || row.name || "—"}"` : "",
          pIdx === 0 ? `"${row.code || row.providerCode || "—"}"` : "",
          pIdx === 0 ? `"${row.category || "—"}"` : "",
          pIdx === 0 ? `"${row.specialization || row.speciality || "—"}"` : "",
          pIdx === 0 ? `"${row.degree || "—"}"` : "",
          pIdx === 0 ? `"${row.address || "—"}"` : "",
          pIdx === 0 ? `"${row.phone || "—"}"` : "",
          pIdx === 0 ? `"${String(row.status).toLowerCase() === "active" || String(row.status) === "true" || row.status === true ? "Active" : "Inactive"}"` : "",
          pIdx === 0 ? row.totalVisit || row.totalVisits || 0 : "",
          pIdx === 0 ? `"${row.visitDates || row.dates || "—"}"` : "",
          `"${prod.name || prod.productName || "—"}"`,
          `"${prod.pob || "0.00"}"`,
          `"${prod.orderQty || prod.order_qty || "0.00"}"`,
          `"${prod.sampleQty || prod.sample_qty || "0.00"}"`,
          pIdx === 0 ? `"${row.discussion || row.remarks || "—"}"` : ""
        ].join(","));
      });
    });

    const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Doctor_Chemist_Stockist_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search filter
  const filteredRecords = reportData.filter(row => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    // Check main row fields
    const mainMatch = [
      row.stateName, row.state_name,
      row.headquarterName, row.hqName, row.hq_name,
      row.areaName, row.area_name,
      row.providerType, row.type,
      row.providerName, row.name,
      row.code, row.providerCode,
      row.category,
      row.specialization, row.speciality,
      row.degree,
      row.address,
      row.phone,
      row.discussion, row.remarks
    ].some(val => String(val || "").toLowerCase().includes(term));

    // Check product list
    const prodMatch = Array.isArray(row.products) && row.products.some(p =>
      [p.name, p.productName, p.pob, p.orderQty, p.order_qty, p.sampleQty, p.sample_qty]
        .some(val => String(val || "").toLowerCase().includes(term))
    );

    return mainMatch || prodMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pagedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Filter Module Card Panel */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Filter size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>Doctor / Chemist / Stockist Report</h2>
            </div>
          </div>
          
          {/* Custom Filter Toggle Button (Blue switch) */}
          <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
              <div style={{ width: 40, height: 20, borderRadius: 100, position: "relative", cursor: "pointer", transition: "0.2s", background: isFilterOpen ? "#2563eb" : "#cbd5e1" }}>
                <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: isFilterOpen ? 23 : 3, transition: "0.2s" }} />
              </div>
            </div>
          </button>
        </div>

        {isFilterOpen && (
          <div className="dc-body">
            <div className="ucr-grid-4">
              
              {/* Select Area - Multi select dropdown */}
              <MultiSelectDropdown 
                label="Select Area" 
                options={areasList} 
                selectedIds={filters.areas} 
                onChange={(v) => handleFilterChange("areas", v)} 
              />

              {/* Select Status - Single select dropdown */}
              <SingleDropdown 
                label="Select Status *" 
                options={STATUS_OPTIONS} 
                value={filters.status} 
                onSelect={(v) => handleFilterChange("status", v)} 
              />

              {/* Get Report Of - Multi select dropdown */}
              <MultiSelectDropdown 
                label="Get Report Of *" 
                options={REPORT_OF_OPTIONS} 
                selectedIds={filters.reportOf} 
                onChange={(v) => handleFilterChange("reportOf", v)} 
              />

              {/* Select Category - Multi select dropdown (Conditional on "Doctor" being selected) */}
              {filters.reportOf.includes("Doctor") && (
                <MultiSelectDropdown 
                  label="Select Category" 
                  options={CATEGORY_OPTIONS} 
                  selectedIds={filters.categories} 
                  onChange={(v) => handleFilterChange("categories", v)}
                  useCategoryColors={true}
                />
              )}

              <div style={{ marginTop: "6px" }}>
                <button type="button" onClick={handleViewReport} disabled={isLoading} className="dc-submit-btn">
                  {isLoading ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Check size={14} />}
                  View Report
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Report Data Collection Table UI Panel Component */}
      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>Report Details</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                <input 
                  type="text" 
                  placeholder="Search Records..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  style={{ height: 36, padding: "0 12px 0 32px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 12, color: "#111827", outline: "none", width: 200, fontWeight: 600, background: "#fff", transition: "all 0.15s" }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
              </div>
              <button
                type="button"
                onClick={handleExportExcel}
                style={{
                  height: 36, width: 36, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe",
                  color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.1)"
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
                    <th>S. No.</th>
                    <th>State Name</th>
                    <th>Headquarter Name</th>
                    <th>Area Name</th>
                    <th>Provider Type</th>
                    <th>Provider Name</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Specialization</th>
                    <th>Degree</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Total Visit</th>
                    <th>Visit Dates</th>
                    <th>Product Name</th>
                    <th>POB</th>
                    <th>Order Qty</th>
                    <th>Sample Qty</th>
                    <th style={{ borderRight: "none" }}>Discussion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={20} style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontStyle: "italic" }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    pagedRecords.map((row, rIdx) => {
                      const products = Array.isArray(row.products) && row.products.length > 0 
                        ? row.products 
                        : [{ name: row.productName || row.product_name || "—", pob: row.pob || "—", orderQty: row.orderQty || row.order_qty || "—", sampleQty: row.sampleQty || row.sample_qty || "—" }];

                      return products.map((prod, pIdx) => {
                        const isFirstProduct = pIdx === 0;
                        const globalIndex = (page - 1) * pageSize + rIdx + 1;
                        return (
                          <tr key={`${rIdx}-${pIdx}`}>
                            {isFirstProduct && (
                              <>
                                <td rowSpan={products.length} style={{ textAlign: "center" }}>{globalIndex}</td>
                                <td rowSpan={products.length}>{row.stateName || row.state_name || "—"}</td>
                                <td rowSpan={products.length}>{row.headquarterName || row.hqName || row.hq_name || "—"}</td>
                                <td rowSpan={products.length}>{row.areaName || row.area_name || "—"}</td>
                                <td rowSpan={products.length}>
                                  <span style={{
                                    padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                    background: String(row.providerType || row.type).toLowerCase() === "doctor" ? "#eff6ff" : String(row.providerType || row.type).toLowerCase() === "chemist" ? "#ecfdf5" : "#fffbeb",
                                    color: String(row.providerType || row.type).toLowerCase() === "doctor" ? "#1d4ed8" : String(row.providerType || row.type).toLowerCase() === "chemist" ? "#047857" : "#b45309",
                                    border: `1px solid ${String(row.providerType || row.type).toLowerCase() === "doctor" ? "#bfdbfe" : String(row.providerType || row.type).toLowerCase() === "chemist" ? "#a7f3d0" : "#fde68a"}`
                                  }}>
                                    {row.providerType || row.type || "—"}
                                  </span>
                                </td>
                                <td rowSpan={products.length} style={{ fontWeight: 600, color: "#1e293b" }}>{row.providerName || row.name || "—"}</td>
                                <td rowSpan={products.length}>{row.code || row.providerCode || "—"}</td>
                                <td rowSpan={products.length}>
                                  {row.category ? (
                                    <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "#f5f3ff", color: "#6d28d9" }}>
                                      {row.category}
                                    </span>
                                  ) : "—"}
                                </td>
                                <td rowSpan={products.length}>{row.specialization || row.speciality || "—"}</td>
                                <td rowSpan={products.length}>{row.degree || "—"}</td>
                                <td rowSpan={products.length}>{row.address || "—"}</td>
                                <td rowSpan={products.length}>{row.phone || "—"}</td>
                                <td rowSpan={products.length}>
                                  <span style={{
                                    padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                                    background: String(row.status).toLowerCase() === "active" || String(row.status) === "true" || row.status === true ? "#ecfdf5" : "#fef2f2",
                                    color: String(row.status).toLowerCase() === "active" || String(row.status) === "true" || row.status === true ? "#047857" : "#b91c1c",
                                    border: `1px solid ${String(row.status).toLowerCase() === "active" || String(row.status) === "true" || row.status === true ? "#a7f3d0" : "#fecaca"}`
                                  }}>
                                    {String(row.status).toLowerCase() === "active" || String(row.status) === "true" || row.status === true ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td rowSpan={products.length} style={{ textAlign: "center" }}>{row.totalVisit || row.totalVisits || 0}</td>
                                <td rowSpan={products.length} style={{ fontSize: "12px", whiteSpace: "normal", maxWidth: "160px" }}>{row.visitDates || row.dates || "—"}</td>
                              </>
                            )}
                            <td>{prod.name || prod.productName || "—"}</td>
                            <td>{prod.pob || "—"}</td>
                            <td>{prod.orderQty || prod.order_qty || "—"}</td>
                            <td>{prod.sampleQty || prod.sample_qty || "—"}</td>
                            {isFirstProduct && (
                              <td rowSpan={products.length} style={{ borderRight: "none" }}>{row.discussion || row.remarks || "—"}</td>
                            )}
                          </tr>
                        );
                      });
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredRecords.length > 0 && (
              <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyBetween: "space-between", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Rows per page:</span>
                  <select 
                    value={pageSize} 
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} 
                    style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "4px 8px", fontSize: 13, fontWeight: 600, outline: "none", color: "#475569", cursor: "pointer" }}
                  >
                    {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                    Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredRecords.length)} of {filteredRecords.length}
                  </span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button 
                    type="button" 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    style={{
                      height: 32, padding: "0 12px", border: "1.5px solid #e2e8f0", background: "#fff", borderRadius: 8,
                      fontSize: 13, fontWeight: 600, color: page === 1 ? "#cbd5e1" : "#475569",
                      cursor: page === 1 ? "not-allowed" : "pointer", transition: "0.15s"
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 600, padding: "0 6px" }}>
                    Page {page} of {totalPages}
                  </span>
                  <button 
                    type="button" 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)}
                    style={{
                      height: 32, padding: "0 12px", border: "1.5px solid #e2e8f0", background: "#fff", borderRadius: 8,
                      fontSize: 13, fontWeight: 600, color: page === totalPages ? "#cbd5e1" : "#475569",
                      cursor: page === totalPages ? "not-allowed" : "pointer", transition: "0.15s"
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Single Dropdown Portal Component ─────────────────────────────────────────
function SingleDropdown({ label, value, onSelect, options = [], disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = options.find((opt) => String(opt.id ?? opt.value) === String(value));
  const active = isOpen || Boolean(value);

  useEffect(() => {
    const handleOutsideClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", marginTop: "6px" }} className="ucr-field-wrap">
      <div
        onClick={handleTriggerClick}
        style={{
          width: "100%", height: 38, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${isOpen ? "#2563eb" : value ? "#bfdbfe" : "#e2e8f0"}`, cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff", transition: "all 0.18s", boxSizing: "border-box"
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: value ? "#1e293b" : "transparent" }}>
          {selectedOption?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#2563eb" : "#94a3b8" }}>
          <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label style={{ position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 10 : 13, fontWeight: 600, color: isOpen ? "#2563eb" : active ? "#64748b" : "#94a3b8", background: active ? "#ffffff" : "transparent", padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20 }}>
        {label}
      </label>

      {isOpen && !disabled && createPortal(
        <div className="dc-portal-dropdown dropdown-portal" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 && <li style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>No options available</li>}
            {options.map((opt) => {
              const optVal = String(opt.id ?? opt.value);
              const isSelected = String(value) === optVal;
              return (
                <li
                  key={optVal}
                  className="dc-opt"
                  style={{ color: isSelected ? "#2563eb" : "#475569", backgroundColor: isSelected ? "rgba(59,130,246,0.08)" : "#ffffff" }}
                  onMouseDown={(e) => { e.preventDefault(); onSelect(optVal); setIsOpen(false); }}
                >
                  {isSelected && <Check size={12} style={{ color: "#2563eb", flexShrink: 0 }} />}
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Multi Select Dropdown Portal Component ──────────────────────────────────
function MultiSelectDropdown({ label, options = [], selectedIds = [], onChange, disabled, useCategoryColors = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
    setIsOpen(!isOpen);
  };

  const toggleValue = (val) => {
    const stringVal = String(val);
    if (selectedIds.includes(stringVal)) {
      onChange(selectedIds.filter((item) => String(item) !== stringVal));
    } else {
      onChange([...selectedIds, stringVal]);
    }
  };

  const selectAll = () => {
    onChange(options.map(o => String(o.id ?? o.value)));
  };

  const deselectAll = () => {
    onChange([]);
  };

  const selectedObjects = options.filter((o) => selectedIds.includes(String(o.id ?? o.value)));
  const selectedLabel = selectedObjects.map((o) => o.label).join(", ");
  const active = isOpen || selectedIds.length > 0;

  // Custom coloring style from reference Image 3
  const selectAllBg = useCategoryColors ? "#2ebd85" : "#2563eb";
  const deselectAllBg = useCategoryColors ? "#d25c54" : "#ef4444";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", marginTop: "6px" }} className="ucr-field-wrap">
      <div
        onClick={handleTriggerClick}
        style={{
          width: "100%", height: 38, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${isOpen ? "#2563eb" : selectedIds.length > 0 ? "#bfdbfe" : "#e2e8f0"}`, cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "#f8fafc" : isOpen ? "#eff6ff" : "#ffffff", transition: "all 0.18s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: selectedIds.length > 0 ? "#1e293b" : "transparent" }}>
          {selectedLabel || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#2563eb" : "#94a3b8" }}>
          <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </div>
      <label style={{ position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 10 : 13, fontWeight: 600, color: isOpen ? "#2563eb" : active ? "#64748b" : "#94a3b8", background: active ? "#ffffff" : "transparent", padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20 }}>
        {label}
      </label>

      {isOpen && !disabled && createPortal(
        <div className="dc-portal-dropdown dropdown-portal" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          
          {/* Custom Actions: Select All / Deselect All */}
          <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectAll(); }}
              style={{
                flex: 1, padding: "8px 12px", border: "none", color: "#ffffff", background: selectAllBg,
                fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "opacity 0.15s", outline: "none"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Select All
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); deselectAll(); }}
              style={{
                flex: 1, padding: "8px 12px", border: "none", color: "#ffffff", background: deselectAllBg,
                fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "opacity 0.15s", outline: "none"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Deselect All
            </button>
          </div>

          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 && <li style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>No options available</li>}
            {options.map((option) => {
              const optVal = String(option.id ?? option.value);
              const isSelected = selectedIds.includes(optVal);
              return (
                <li
                  key={optVal}
                  className="dc-opt"
                  style={{ backgroundColor: isSelected ? "rgba(59,130,246,0.08)" : "#ffffff" }}
                  onMouseDown={(e) => { e.preventDefault(); toggleValue(optVal); }}
                >
                  <div style={{
                    width: 14, height: 14, borderRadius: 4, border: isSelected ? "none" : "1.5px solid #cbd5e1",
                    background: isSelected ? "#2563eb" : "transparent", display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0, marginRight: 8
                  }}>
                    {isSelected && <Check size={10} style={{ color: "#ffffff" }} />}
                  </div>
                  <span style={{ fontWeight: isSelected ? 600 : 500, color: isSelected ? "#2563eb" : "#475569" }}>
                    {option.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}
