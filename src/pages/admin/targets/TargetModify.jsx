import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, CheckCircle2, ChevronDown, Check,
  Target, Edit, Save, ChevronLeft, ChevronRight
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants & Matrix Variables ───────────────────────────────────────────
const FH = 40;
const PAGE_SIZES = [5, 10, 20, 50];
const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: String(CURRENT_YEAR - 1 + i),
  label: String(CURRENT_YEAR - 1 + i)
}));

const MONTH_COLUMNS = [
  { key: "jan", label: "Jan" }, { key: "feb", label: "Feb" }, { key: "mar", label: "March" },
  { key: "apr", label: "April" }, { key: "may", label: "May" }, { key: "jun", label: "June" },
  { key: "jul", label: "July" }, { key: "aug", label: "Aug" }, { key: "sep", label: "Sep" },
  { key: "oct", label: "Oct" }, { key: "nov", label: "Nov" }, { key: "dec", label: "Dec" }
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
    justify-content: flex-end;
    border-radius: 16px;
    border-top: 1px solid #f1f5f9;
  }

  /* ── Original Balanced Radio Input Grid Row Layout ── */
  .ucr-grid-4 { 
    display: grid; 
    grid-template-columns: 160px repeat(3, 1fr); 
    gap: 18px 16px; 
    align-items: center; 
    margin-bottom: 20px;
  }
  .ucr-grid-4:last-of-type {
    margin-bottom: 0;
  }

  .col-span-2 { grid-column: span 2; }
  .col-span-4 { grid-column: span 4; }

  @media(max-width: 1200px) {
    .ucr-grid-4 { grid-template-columns: 140px repeat(3, 1fr); }
  }
  @media(max-width: 1024px) {
    .ucr-grid-4 { grid-template-columns: 1fr; gap: 14px; }
    .hide-on-mobile { display: none; }
  }
  @media(max-width: 768px) {
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; justify-content: center; }
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
    text-align: center;
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

  /* ── Overlay and Popups ── */
  .dc-overlay { position: fixed; inset: 0; z-index: 9999999; display: flex; align-items: center; justify-content: center; background: rgba(15,23,42,0.3); backdrop-filter: blur(4px); padding: 16px; }
  .dc-popup { background: #ffffff !important; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 24px 60px rgba(0,0,0,0.1); padding: 36px 32px; max-width: 360px; width: 100%; display: flex; flex-direction: column; align-items: center; }
  .dc-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; overflow: visible !important; }
  
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
    color: #ffffff !important;
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
`;

export default function TargetModify() {
  // ─── UI State ────────────────────────────────────────────────────────────────
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  // ─── Filter State ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    stateId: "",
    districtIds: [],
    employeeId: "",
    year: String(CURRENT_YEAR)
  });

  // ─── Master Data ─────────────────────────────────────────────────────────────
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ─── Table Data State ────────────────────────────────────────────────────────
  const [targetData, setTargetData] = useState({
    jan: "", feb: "", mar: "", apr: "", may: "", jun: "",
    jul: "", aug: "", sep: "", oct: "", nov: "", dec: ""
  });

  // ─── Helper for Auth Headers ─────────────────────────────────────────────────
  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  }), []);

  // 1. Fetch States on Mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/masters/states", getAuthHeaders());
        const stateData = res.data?.data || res.data || [];
        const normalizedStates = Array.isArray(stateData) ? stateData.map((s) => ({
          id: String(s?.id ?? s?.stateId ?? ""),
          stateName: s?.state_name || s?.stateName || s?.name || "Unknown"
        })) : [];
        setStates(normalizedStates.filter(opt => opt.id !== ""));
      } catch (err) { console.error("Failed to load states", err); }
    };
    fetchStates();
  }, [getAuthHeaders]);

  // 2. Fetch Districts when State changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, districtIds: [], employeeId: "" }));
    setDistricts([]); setEmployees([]);
    setTableVisible(false);
    
    if (filters.stateId) {
      const fetchDistricts = async () => {
        try {
          const res = await api.get(`/api/masters/districts?stateId=${filters.stateId}`, getAuthHeaders());
          const districtData = res.data?.data || res.data || [];
          const normalizedDistricts = Array.isArray(districtData) ? districtData.map((d) => ({
            id: String(d?.id ?? d?.districtId ?? ""),
            districtName: d?.district_name || d?.districtName || d?.name || "Unknown"
          })) : [];
          setDistricts(normalizedDistricts.filter(opt => opt.id !== ""));
        } catch (err) { console.error("Failed to load districts", err); }
      };
      fetchDistricts();
    }
  }, [filters.stateId, getAuthHeaders]);

  // 3. Fetch Employees when District changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, employeeId: "" }));
    setEmployees([]);
    setTableVisible(false);

    if (filters.districtIds && filters.districtIds.length > 0) {
      const fetchEmployees = async () => {
        try {
          const districtQuery = filters.districtIds.join(',');
          const res = await api.get(`/api/target/submission/employees?stateId=${filters.stateId}&districtId=${districtQuery}`, getAuthHeaders());
          const employeeData = res.data?.data || res.data || [];
          
          const normalizedEmployees = Array.isArray(employeeData) ? employeeData.map((e) => {
            const name = e?.name || e?.employee_name || "Unknown";
            const type = e?.type || e?.designation || "";
            return {
              id: String(e?.id ?? e?.employeeId ?? ""),
              employeeName: type ? `${name}-(${type})` : name
            };
          }) : [];
          setEmployees(normalizedEmployees.filter(opt => opt.id !== ""));
        } catch (err) { console.error("Failed to load employees", err); }
      };
      fetchEmployees();
    }
  }, [filters.districtIds, filters.stateId, getAuthHeaders]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setTableVisible(false); 
  };

  const handleFetchTargetData = async () => {
    setError(""); 
    if (!filters.stateId || !filters.districtIds?.length || !filters.employeeId || !filters.year) {
      return setError("Please select State, District, Employee, and Year to load existing targets.");
    }

    setIsLoading(true);
    try {
      const res = await api.get(`/api/target/submission/modify/form?employeeId=${filters.employeeId}&year=${filters.year}`, getAuthHeaders());
      const fetchedData = res.data?.data?.monthlyTargets || {};
      
      setTargetData({
        jan: fetchedData["1"] ?? "",
        feb: fetchedData["2"] ?? "",
        mar: fetchedData["3"] ?? "",
        apr: fetchedData["4"] ?? "",
        may: fetchedData["5"] ?? "",
        jun: fetchedData["6"] ?? "",
        jul: fetchedData["7"] ?? "",
        aug: fetchedData["8"] ?? "",
        sep: fetchedData["9"] ?? "",
        oct: fetchedData["10"] ?? "",
        nov: fetchedData["11"] ?? "",
        dec: fetchedData["12"] ?? ""
      });

      setTableVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch existing target data. Loading empty form.");
      setTargetData({
        jan: "", feb: "", mar: "", apr: "", may: "", jun: "",
        jul: "", aug: "", sep: "", oct: "", nov: "", dec: ""
      });
      setTableVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableChange = (monthKey, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTargetData(prev => ({ ...prev, [monthKey]: value }));
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(""); 

    try {
      const payload = {
        employeeId: Number(filters.employeeId),
        year: Number(filters.year),
        monthlyTargets: {
          "1": Number(targetData.jan) || 0,
          "2": Number(targetData.feb) || 0,
          "3": Number(targetData.mar) || 0,
          "4": Number(targetData.apr) || 0,
          "5": Number(targetData.may) || 0,
          "6": Number(targetData.jun) || 0,
          "7": Number(targetData.jul) || 0,
          "8": Number(targetData.aug) || 0,
          "9": Number(targetData.sep) || 0,
          "10": Number(targetData.oct) || 0,
          "11": Number(targetData.nov) || 0,
          "12": Number(targetData.dec) || 0
        }
      };

      await api.put("/api/target/submission/modify", payload, getAuthHeaders());
      setPopup({ isOpen: true, message: "Targets modified successfully!" });
      setTableVisible(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to modify target data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stateOpts = states.map(s => ({ value: String(s.id), label: s.stateName }));
  const distOpts = districts.map(d => ({ value: String(d.id), label: d.districtName }));
  const empOpts = employees.map(e => ({ value: String(e.id), label: e.employeeName }));

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
              <Target size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Target Modify</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Adjust and update existing monthly targets</p>
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
            {/* Row 1: User wise Selection Row */}
            <div className="ucr-grid-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "5px solid #2563eb", background: "#fff" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>* User wise</span>
              </div>
              <SingleDropdown label="Select State" options={stateOpts} value={filters.stateId} onSelect={(v) => handleFilterChange("stateId", v)} />
              <MultiSelectDropdown label="Select District" options={distOpts} selectedIds={filters.districtIds} onChange={(v) => handleFilterChange("districtIds", v)} disabled={!filters.stateId} />
              <SingleDropdown label="Select Employee" options={empOpts} value={filters.employeeId} onSelect={(v) => handleFilterChange("employeeId", v)} disabled={!filters.districtIds?.length} />
            </div>

            {/* Row 2: Monthly Timeline Row */}
            <div className="ucr-grid-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "5px solid #2563eb", background: "#fff" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>* Monthly</span>
              </div>
              <SingleDropdown label="Select Year" options={YEARS} value={filters.year} onSelect={(v) => handleFilterChange("year", v)} />
              <div className="col-span-2 hide-on-mobile"></div>
            </div>

            {/* Row 3: Amount Wise Action Button Row */}
            <div className="ucr-grid-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "5px solid #2563eb", background: "#fff" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>* Amount Wise</span>
              </div>
              <div style={{ display: "flex", height: 40, alignItems: "center" }}>
                <button 
                  type="button"
                  onClick={handleFetchTargetData} 
                  disabled={isLoading} 
                  className="dc-submit-btn"
                  style={{ width: "100%", justifyContent: "center", background: "#2563eb" }}
                >
                  {isLoading ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Edit size={14} />}
                  Modify Target
                </button>
              </div>
              <div className="col-span-2 hide-on-mobile"></div>
            </div>
          </div>
        )}
      </div>

      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Target Modify Form</h3>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
              <table className="ucr-table">
                <thead>
                  <tr>
                    {MONTH_COLUMNS.map((month) => (
                      <th key={month.key} style={{ minWidth: 100 }}>
                        {month.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {MONTH_COLUMNS.map((month) => (
                      <td key={month.key} style={{ padding: "12px 8px" }}>
                        <TableInput 
                          value={targetData[month.key]} 
                          onChange={(val) => handleTableChange(month.key, val)} 
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="dc-footer">
            <button 
              type="button"
              onClick={handleFinalSubmit} 
              disabled={isSubmitting} 
              className="dc-submit-btn"
              style={{ background: "#2563eb" }}
            >
              {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={14} />}
              Submit Target
            </button>
          </div>
        </div>
      )}

      {/* Center-Aligned Success Popup Modal */}
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

function TableInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input 
      type="text" 
      value={value ?? ""} 
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

// ─── Searchable Portal Configuration Single Dropdown Component ───
function SingleDropdown({ label, options = [], value, onSelect, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = (options || []).find((option) => String(option?.value) === String(value) || String(option?.id) === String(value));
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
            {(!options || options.length === 0) ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No options available</li>
            ) : (
              options.map((opt, i) => {
                const optValue = opt?.id ?? opt?.value;
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

// ─── Searchable Portal Multi-Select Configuration Dropdown Component ───
function MultiSelectDropdown({ label, options = [], selectedIds = [], onChange, disabled }) {
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
  const selectAll = () => onChange((options || []).map(o => String(o?.id ?? o?.value)));
  const clearAll = () => onChange([]);

  const hasValue = selectedIds.length > 0;
  const displayText = hasValue ? (options || []).filter(o => selectedIds.includes(String(o?.id ?? o?.value))).map(o => o?.label).join(", ") : "";
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
            {(!options || options.length === 0) ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No options available</li>
            ) : (
              options.map((opt, idx) => {
                const optId = String(opt?.id ?? opt?.value);
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