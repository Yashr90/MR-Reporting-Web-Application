import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, ChevronDown, Filter, 
  Check, FileSpreadsheet, ChevronLeft, ChevronRight, Calendar
} from "lucide-react";
import api from "../../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 20, 50];
const FH = 40;
const MONTHS_LIST = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_LIST   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const REPORT_OF_OPTIONS = [
  { id: "Chemist", value: "Chemist", label: "Chemist" },
  { id: "Stockist", value: "Stockist", label: "Stockist" }
];

/* ─── Premium UI Design System Styles ────────────────────────────────────── */
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
    background: linear-gradient(135deg, #3B82F6, #2563eb);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(59,130,246,0.2);
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
    align-items: center;
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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 1600px; }
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

  .ucr-cal {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 290px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    z-index: 999999;
    padding: 16px;
  }
  .ucr-cal-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; }
  .ucr-cal-nav-btn { width: 28px; height: 28px; border-radius: 8px; background: #ffffff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .ucr-cal-select-group { display: flex; align-items: center; gap: 4px; }
  .ucr-cal-select-wrap { position: relative; display: flex; align-items: center; }
  .ucr-cal-native-select { appearance: none; background: #f8fafc; color: #2563eb; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 22px 4px 10px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none; }
  .ucr-cal-weekday-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 6px; }
  .ucr-cal-weekday { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; }
  .ucr-cal-days-grid { display: grid; grid-template-columns: repeat(7, 1fr); row-gap: 4px; column-gap: 4px; }
  .ucr-cal-day-cell { width: 100%; aspect-ratio: 1; border-radius: 50%; border: none; font-size: 13px; font-weight: 500; cursor: pointer; background: transparent; display: flex; align-items: center; justify-content: center; }
  .ucr-cal-day-cell:hover:not(.selected) { background: #f1f5f9; }
  .ucr-cal-day-cell.selected { background: #2563eb !important; color: #ffffff !important; font-weight: 600; }
  .ucr-cal-day-cell.today:not(.selected) { color: #2563eb; font-weight: 700; background: rgba(59, 130, 246, 0.08); }
`;

export default function MRChemistStockistVisitReport() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fields strictly initialized as blank/empty strings per requirements
  const [filters, setFilters] = useState({
    type: "",
    reportOf: [],
    fromDate: "",
    toDate: ""
  });

  // Mock payload structured directly to model the screenshots layout patterns
  const [reportData, setReportData] = useState([]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewStatus = async () => {
    setError("");
    if (!filters.type || !filters.reportOf.length || !filters.fromDate || !filters.toDate) {
      setError("Please fill all mandatory filter fields before viewing status.");
      return;
    }

    setIsLoading(true);
    try {
      // Direct API integration point logic
      // const res = await api.post("/api/mr/reports/chemist-stockist-visit", filters);
      
      // Injecting structure reflecting the provided reference table screenshots architecture
      setReportData([
        {
          sno: 1,
          stateName: "UTTARAKHAND",
          hqName: "HARIDWAR",
          areaName: "DELHI",
          providerName: "Ashu Stockist",
          code: "0",
          address: "---",
          phone: "0",
          status: "true",
          totalVisit: 3,
          visitDates: "19-05-2026,07-05-2026,13-04-2026",
          products: [
            { name: "Doloceta-500", pob: "0.00", orderQty: "0.00", sampleQty: "0.00" },
            { name: "DIPRO", pob: "792.00", orderQty: "8.00", sampleQty: "9.00" }
          ],
          discussion: "dvb"
        },
        {
          sno: 2,
          stateName: "UTTARAKHAND",
          hqName: "HARIDWAR",
          areaName: "CENTRAL DELHI",
          providerName: "G",
          code: "---",
          address: "---",
          phone: "0",
          status: "false",
          totalVisit: 1,
          visitDates: "24-04-2026",
          products: [
            { name: "---", pob: "---", orderQty: "---", sampleQty: "---" }
          ],
          discussion: "d"
        },
        {
          sno: 3,
          stateName: "UTTARAKHAND",
          hqName: "HARIDWAR",
          areaName: "AGRA",
          providerName: "HJK",
          code: "---",
          address: "---",
          phone: "0",
          status: "false",
          totalVisit: 1,
          visitDates: "24-04-2026",
          products: [
            { name: "---", pob: "---", orderQty: "---", sampleQty: "---" }
          ],
          discussion: "ghk"
        }
      ]);
      setTableVisible(true);
    } catch (err) {
      setError("Failed to fetch visit records.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData.length) return;
    
    let csvContent = [
      ["S.No.", "State Name", "Headquarter Name", "Area Name", "Provider Name", "Code", "Address", "Phone", "Status", "Total Visit", "Visit Dates", "Product Name", "POB", "Order Qty", "Sample Qty", "Discussion"].join(",")
    ];

    reportData.forEach(row => {
      row.products.forEach((prod, index) => {
        csvContent.push([
          index === 0 ? row.sno : "",
          index === 0 ? row.stateName : "",
          index === 0 ? row.hqName : "",
          index === 0 ? row.areaName : "",
          index === 0 ? row.providerName : "",
          index === 0 ? row.code : "",
          index === 0 ? row.address : "",
          index === 0 ? row.phone : "",
          index === 0 ? row.status : "",
          index === 0 ? row.totalVisit : "",
          index === 0 ? `"${row.visitDates}"` : "",
          prod.name,
          prod.pob,
          prod.orderQty,
          prod.sampleQty,
          index === 0 ? row.discussion : ""
        ].join(","));
      });
    });

    const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Chemist_Stockist_Visit_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* Filter Module Card Panel */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Filter size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>Chemist / Stockist Visit Report</h2>
            </div>
          </div>
          
          {/* Custom Filter Toggle Button per requirements */}
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
              <FloatingDropdown 
                label="SELECT TYPE *" 
                options={[{ value: "Self", label: "Self" }]} 
                value={filters.type} 
                onSelect={(v) => handleFilterChange("type", v)} 
              />
              <MultiSelectDropdown 
                label="SELECT REPORT OF *" 
                options={REPORT_OF_OPTIONS} 
                selectedIds={filters.reportOf} 
                onChange={(v) => handleFilterChange("reportOf", v)} 
              />
              <FDatePicker 
                label="FROM DATE" 
                value={filters.fromDate} 
                onChange={(v) => handleFilterChange("fromDate", v)} 
              />
              <FDatePicker 
                label="TO DATE" 
                value={filters.toDate} 
                onChange={(v) => handleFilterChange("toDate", v)} 
              />
              <div style={{ marginTop: "6px" }}>
                <button type="button" onClick={handleViewStatus} disabled={isLoading} className="dc-submit-btn">
                  {isLoading ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Check size={14} />}
                  View Status
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
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>Chemist / Stockist Visit Details</h1>
            <button
              type="button"
              onClick={handleExportExcel}
              style={{
                height: 40, width: 40, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe",
                color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.1)"
              }}
              title="Export to Excel"
            >
              <FileSpreadsheet size={16} />
            </button>
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
                    <th>Provider Name</th>
                    <th>Code</th>
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
                  {reportData.map((row, rIdx) => (
                    <React.Fragment key={rIdx}>
                      {row.products.map((prod, pIdx) => (
                        <tr key={`${rIdx}-${pIdx}`}>
                          {pIdx === 0 && (
                            <>
                              <td rowSpan={row.products.length}>{row.sno}</td>
                              <td rowSpan={row.products.length}>{row.stateName}</td>
                              <td rowSpan={row.products.length}>{row.hqName}</td>
                              <td rowSpan={row.products.length}>{row.areaName}</td>
                              <td rowSpan={row.products.length} style={{ fontWeight: 600, color: "#1e293b" }}>{row.providerName}</td>
                              <td rowSpan={row.products.length}>{row.code}</td>
                              <td rowSpan={row.products.length}>{row.address}</td>
                              <td rowSpan={row.products.length}>{row.phone}</td>
                              <td rowSpan={row.products.length}>
                                <span style={{ color: row.status === "true" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{row.status}</span>
                              </td>
                              <td rowSpan={row.products.length} style={{ textAlign: "center" }}>{row.totalVisit}</td>
                              <td rowSpan={row.products.length} style={{ fontSize: "12px", whiteSpace: "normal", maxWdith: "180px" }}>{row.visitDates}</td>
                            </>
                          )}
                          <td>{prod.name}</td>
                          <td>{prod.pob}</td>
                          <td>{prod.orderQty}</td>
                          <td>{prod.sampleQty}</td>
                          {pIdx === 0 && (
                            <td rowSpan={row.products.length} style={{ borderRight: "none" }}>{row.discussion}</td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Portal Context Dropdown Overlay Engine Components ──────────────
function FloatingDropdown({ label, options, value, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = options.find((option) => String(option.value) === String(value));
  const active = isOpen || Boolean(value);

  useEffect(() => {
    const handleOutsideClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTriggerClick = () => {
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
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 14, display: "flex",
          alignItems: "center", border: `1.5px solid ${isOpen ? "#2563eb" : value ? "#bfdbfe" : "#e2e8f0"}`, cursor: "pointer",
          background: isOpen ? "#eff6ff" : "#ffffff", transition: "all 0.18s", boxSizing: "border-box"
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: "#1e293b" }}>
          {selectedOption?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#2563eb" : "#94a3b8" }}>
          <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </div>
      </div>
      <label style={{ position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 11 : 13, fontWeight: 500, color: isOpen ? "#2563eb" : "#64748b", background: active ? "#ffffff" : "transparent", padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20 }}>
        {label}
      </label>

      {isOpen && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {options.map((opt) => (
              <li
                key={opt.value}
                className="dc-opt"
                style={{ color: String(value) === String(opt.value) ? "#2563eb" : "#475569", backgroundColor: String(value) === String(opt.value) ? "rgba(59,130,246,0.08)" : "#ffffff" }}
                onMouseDown={(e) => { e.preventDefault(); onSelect(opt.value); setIsOpen(false); }}
              >
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

function MultiSelectDropdown({ label, options, selectedIds, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTriggerClick = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
    setIsOpen(!isOpen);
  };

  const toggleValue = (val) => {
    if (selectedIds.includes(val)) {
      onChange(selectedIds.filter((item) => item !== val));
    } else {
      onChange([...selectedIds, val]);
    }
  };

  const selectedLabel = options.filter((o) => selectedIds.includes(o.value)).map((o) => o.label).join(", ");
  const active = isOpen || selectedIds.length > 0;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", marginTop: "6px" }} className="ucr-field-wrap">
      <div
        onClick={handleTriggerClick}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 14, display: "flex",
          alignItems: "center", border: `1.5px solid ${isOpen ? "#2563eb" : selectedIds.length > 0 ? "#bfdbfe" : "#e2e8f0"}`, cursor: "pointer",
          background: isOpen ? "#eff6ff" : "#ffffff", transition: "all 0.18s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: "#1e293b" }}>
          {selectedLabel || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: isOpen ? "#2563eb" : "#94a3b8" }}>
          <ChevronDown size={15} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </div>
      <label style={{ position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 11 : 13, fontWeight: 500, color: isOpen ? "#2563eb" : "#64748b", background: active ? "#ffffff" : "transparent", padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20 }}>
        {label}
      </label>

      {isOpen && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ padding: "4px 0", margin: 0, listStyle: "none", background: "#ffffff" }}>
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.value);
              return (
                <li
                  key={option.value}
                  className="dc-opt"
                  style={{ backgroundColor: isSelected ? "rgba(59,130,246,0.08)" : "#ffffff" }}
                  onMouseDown={(e) => { e.preventDefault(); toggleValue(option.value); }}
                >
                  <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: "#2563eb", marginRight: 8 }} />
                  {option.label}
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

function FDatePicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const parsed = (value && !isNaN(Date.parse(value))) ? new Date(value + "T00:00:00") : today;
  const [view, setView] = useState({ y: parsed.getFullYear(), m: parsed.getMonth() });
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const active = open || Boolean(value);
  const prevMonth = () => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 });
  const nextMonth = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 });

  const selectDay = (day) => {
    const ds = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(ds);
    setOpen(false);
  };

  const firstDow = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const displayVal = value ? new Date(value + "T00:00:00").toLocaleDateString("en-GB") : "";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", marginTop: "6px" }} className="ucr-field-wrap">
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 14, display: "flex",
          alignItems: "center", border: `1.5px solid ${open ? "#2563eb" : value ? "#bfdbfe" : "#e2e8f0"}`, cursor: "pointer",
          background: open ? "#eff6ff" : "#ffffff", transition: "all 0.18s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: "#1e293b", fontFamily: "monospace" }}>
          {displayVal || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#2563eb" : "#94a3b8" }}>
          <Calendar size={15} />
        </div>
      </div>

      <label style={{ position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 11 : 13, fontWeight: 500, color: open ? "#2563eb" : "#64748b", background: active ? "#ffffff" : "transparent", padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20 }}>
        {label}
      </label>

      {open && (
        <div className="ucr-cal">
          <div className="ucr-cal-header">
            <button type="button" onClick={prevMonth} className="ucr-cal-nav-btn"><ChevronLeft size={14} /></button>
            <div className="ucr-cal-select-group">
              <div className="ucr-cal-select-wrap">
                <select value={view.m} onChange={e => setView({ ...view, m: Number(e.target.value) })} className="ucr-cal-native-select">
                  {MONTHS_LIST.map((m, i) => (
                    <option key={i} value={i}>{m.slice(0, 3)}</option>
                  ))}
                </select>
              </div>
              <div className="ucr-cal-select-wrap">
                <select value={view.y} onChange={e => setView({ ...view, y: Number(e.target.value) })} className="ucr-cal-native-select">
                  {Array.from({ length: 21 }, (_, i) => 2015 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" onClick={nextMonth} className="ucr-cal-nav-btn"><ChevronRight size={14} /></button>
          </div>

          <div className="ucr-cal-weekday-grid">
            {DAYS_LIST.map(d => <div key={d} className="ucr-cal-weekday">{d}</div>)}
          </div>

          <div className="ucr-cal-days-grid">
            {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const ds = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => selectDay(d)}
                  className={`ucr-cal-day-cell ${value === ds ? "selected" : ""}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}