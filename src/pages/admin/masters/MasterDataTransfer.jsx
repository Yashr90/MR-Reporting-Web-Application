import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, MapPin, CheckCircle2, ArrowRightLeft,
  ChevronDown, AlertCircle, Search, Users, Check, Save
} from "lucide-react";
import api from "../../../services/api";

const TRANSFER_TYPES = [
  { value: "Area",     label: "Area" },
  { value: "Doctor", label: "Doctor" },
  { value: "Chemist",  label: "Chemist" },
  { value: "Stockist", label: "Stockist" },
];

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

  .ucr-page-icon {
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
  .ucr-body { padding: 20px 28px 24px; background: #ffffff; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; }

  /* ── Form Footer ── */
  .ucr-footer {
    padding: 20px 28px 24px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-radius: 16px;
    border-top: 1px solid #f1f5f9;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ucr-divider {
    border: none;
    border-top: 1px solid #f1f5f9;
    margin: 24px 0 28px;
  }

  /* ── Responsive Input Grids ── */
  .ucr-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }

  .ucr-gender-row { 
    display: flex; 
    align-items: center; 
    gap: 20px; 
    flex-wrap: wrap; 
    margin: 16px 0 24px; 
    padding: 12px 20px; 
    background: #f8fafc; 
    border-radius: 10px; 
    border: 1px solid #edf2f7; Sundar
  }

  @media(max-width: 1024px) {
    .ucr-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  }
  @media(max-width: 768px) {
    .ucr-grid { grid-template-columns: 1fr; gap: 20px; }
    .ucr-body { padding: 20px 16px; }
    .ucr-header { padding: 20px 16px 12px; }
    .ucr-footer { padding: 16px; flex-direction: column; align-items: stretch; text-align: center; }
    .ucr-submit-btn { width: 100%; justify-content: center !important; }
  }

  /* ── Three Column Flex Transfer Blocks ── */
  .transfer-block-container {
    display: flex;
    gap: 18px;
    margin-bottom: 25px;
  }
  @media(max-width: 900px) {
    .transfer-block-container {
      flex-direction: column;
      gap: 20px;
    }
  }

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

  /* ── Submission Button ── */
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

  /* ── Premium Styled Tables inside Transfer Panel ── */
  .premium-transfer-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; }
  .premium-transfer-table th { padding: 10px 14px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; border-bottom: 1px solid #f1f5f9; }
  .premium-transfer-table td { padding: 10px 14px; color: #475569; border-bottom: 1px solid #f8fafc; font-weight: 500; }
  .premium-transfer-table tbody tr:hover { background: #f8fafc; }

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

export default function MasterDataTransfer() {
  const [transferType, setTransferType] = useState("Area");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const [states, setStates] = useState([]);
  const [fromEmployees, setFromEmployees] = useState([]);
  const [toEmployees, setToEmployees] = useState([]);

  const [selectedStateIds, setSelectedStateIds] = useState([]);
  const [fromEmployeeId, setFromEmployeeId] = useState("");
  const [toEmployeeId, setToEmployeeId] = useState("");

  const [fromAreas, setFromAreas] = useState([]);
  const [toAreas, setToAreas] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [selectedFromAreaId, setSelectedFromAreaId] = useState("");
  const [selectedProviderIds, setSelectedProviderIds] = useState([]);
  const [selectedToAreaId, setSelectedToAreaId] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => { fetchStates(); }, []);

  useEffect(() => {
    if (selectedStateIds.length > 0) {
      fetchEmployees(selectedStateIds.join(","));
    } else {
      setFromEmployees([]); setToEmployees([]);
      setFromEmployeeId(""); setToEmployeeId("");
    }
  }, [selectedStateIds]);

  useEffect(() => {
    if (selectedStateIds.length > 0 && fromEmployeeId) {
      setToEmployees(fromEmployees.filter(e => String(e.id) !== String(fromEmployeeId)));
    } else {
      setToEmployees([]);
    }
    setToEmployeeId("");
    resetTables();
  }, [fromEmployeeId]);

  const handleTypeChange = (val) => { setTransferType(val); resetTables(); setError(""); };

  const resetTables = () => {
    setFromAreas([]); setToAreas([]); setProviders([]);
    setSelectedAreaIds([]); setSelectedFromAreaId("");
    setSelectedProviderIds([]); setSelectedToAreaId("");
    setDetailsVisible(false);
  };

  const fetchStates = async () => {
    try {
      const res = await api.get("/api/masters/states");
      const data = res.data?.data || res.data || [];
      setStates(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchEmployees = async (stateIdsString) => {
    try {
      const res = await api.get(`/api/masters/employees/by-states?stateIds=${stateIdsString}`);
      const data = res.data?.data || res.data || [];
      setFromEmployees(Array.isArray(data) ? data : []);
    } catch { setFromEmployees([]); }
  };

  const handleViewDetails = async () => {
    if (selectedStateIds.length === 0 || !fromEmployeeId || !toEmployeeId) return;
    setError(""); setIsLoadingDetails(true); resetTables();
    try {
      const fromRes = await api.get(`/api/masters/areas/filter?employeeId=${fromEmployeeId}`);
      const fromData = fromRes.data?.data || fromRes.data || [];
      setFromAreas(Array.isArray(fromData) ? fromData : []);
      if (transferType !== "Area") {
        const toRes = await api.get(`/api/masters/areas/filter?employeeId=${toEmployeeId}`);
        const toData = toRes.data?.data || toRes.data || [];
        setToAreas(Array.isArray(toData) ? toData : []);
      }
      setDetailsVisible(true);
    } catch { setError("Failed to load areas for the selected employees."); }
    finally { setIsLoadingDetails(false); }
  };

  const handleSourceAreaClick = async (areaId) => {
    if (transferType === "Area") return;
    setSelectedFromAreaId(areaId); setSelectedProviderIds([]); setIsLoadingProviders(true);
    try {
      const endpoint = transferType === "Doctor"
        ? `/api/masters/doctors/area/${areaId}`
        : `/api/masters/providers/area/${areaId}?type=${transferType}`;
      const res = await api.get(endpoint);
      const data = res.data?.data || res.data || [];
      setProviders(Array.isArray(data) ? data : []);
    } catch { setProviders([]); setError(`Failed to load ${transferType}s.`); }
    finally { setIsLoadingProviders(false); }
  };

  const executeTransfer = async () => {
    setError(""); setIsTransferring(true);
    try {
      let endpoint = "", payload = {};
      if (transferType === "Area") {
        endpoint = "/api/masters/areas/transfer";
        payload = { areaIds: selectedAreaIds, newEmployeeId: parseInt(toEmployeeId) };
      } else if (transferType === "Doctor") {
        endpoint = "/api/masters/doctors/transfer";
        payload = { providerIds: selectedProviderIds, newEmployeeId: parseInt(toEmployeeId), newAreaId: parseInt(selectedToAreaId) };
      } else {
        endpoint = "/api/masters/providers/transfer";
        payload = { providerIds: selectedProviderIds, newEmployeeId: parseInt(toEmployeeId), newAreaId: parseInt(selectedToAreaId) };
      }
      const res = await api.put(endpoint, payload);
      if (res.data?.success || res.status === 200) {
        setPopup({ isOpen: true, message: `${transferType} Data Transferred Successfully!` });
        handleViewDetails();
      }
    } catch (err) { setError(err.response?.data?.message || "Transfer failed. Please try again."); }
    finally { setIsTransferring(false); }
  };

  const toggleProviderRow = (id) => setSelectedProviderIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAllProviders = (e) => setSelectedProviderIds(e.target.checked ? providers.map(p => p.id) : []);
  const toggleAreaRow = (id) => setSelectedAreaIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAllAreas = (e) => setSelectedAreaIds(e.target.checked ? fromAreas.map(a => a.id) : []);

  return (
    <div className="ucr-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="ucr-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <div className="ucr-card">
        {/* Header */}
        <div className="ucr-header">
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div className="ucr-page-icon">
              <ArrowRightLeft size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize:16, fontWeight:700, color:"#1e293b", letterSpacing:"-0.01em", lineHeight:1.2 }}>Master Data Transfer</h1>
              <p style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Transfer Areas, Doctors, Chemists, or Stockists between employees</p>
            </div>
          </div>
        </div>

        <div className="ucr-body">
          {/* Transfer Type Selection */}
          <div className="ucr-gender-row">
            <span className="ucr-brand" style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.04em", marginRight:8 }}>Transfer Type:</span>
            {TRANSFER_TYPES.map(type => (
              <label key={type.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                  border: transferType === type.value ? "2px solid #3B82F6" : "2px solid #cbd5e1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: transferType === type.value ? "rgba(59,130,246,0.1)" : "#fff",
                  transition: "all 0.15s",
                  boxShadow: transferType === type.value ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
                }}>
                  {transferType === type.value && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />}
                </div>
                <span className="ucr-brand" style={{ fontSize: 13, fontWeight: transferType === type.value ? 700 : 500, color: transferType === type.value ? "#1e293b" : "#64748b", transition: "all 0.15s" }}>
                  {type.label}
                </span>
                <input type="radio" name="transferType" value={type.value} checked={transferType === type.value} onChange={() => handleTypeChange(type.value)} style={{ display: "none" }} />
              </label>
            ))}
          </div>

          <div className="ucr-grid">
            <MultiSelectDropdown
              label="Select State"
              options={states}
              selectedIds={selectedStateIds}
              onChange={(newIds) => {
                setSelectedStateIds(newIds);
                setFromEmployeeId(""); setToEmployeeId("");
                resetTables();
              }}
            />
            <FSelect
              label="From Employee"
              name="fromEmployeeId"
              value={fromEmployeeId}
              disabled={selectedStateIds.length === 0}
              onChange={(e) => setFromEmployeeId(e.target.value)}
              options={fromEmployees.map(e => ({ id: e.id, label: e.name || e.employee_name }))}
            />
            <FSelect
              label="To Employee"
              name="toEmployeeId"
              value={toEmployeeId}
              disabled={!fromEmployeeId}
              onChange={(e) => setToEmployeeId(e.target.value)}
              options={toEmployees.map(e => ({ id: e.id, label: e.name || e.employee_name }))}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: detailsVisible ? 0 : 4 }}>
            <button
              onClick={handleViewDetails}
              disabled={selectedStateIds.length === 0 || !fromEmployeeId || !toEmployeeId || isLoadingDetails}
              className="ucr-submit-btn"
            >
              {isLoadingDetails ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Search size={14} />}
              View Details
            </button>
          </div>

          {detailsVisible && (
            <>
              <hr className="ucr-divider" />
              {transferType === "Area" ? (
                <div style={{ border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.01)" }}>
                  <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #edf2f7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>SELECT AREAS TO TRANSFER</span>
                    <span style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{fromAreas.length} TOTAL</span>
                  </div>
                  <div style={{ maxHeight: 400, overflowY: "auto" }}>
                    <table className="premium-transfer-table">
                      <thead style={{ background: "#ffffff", position: "sticky", top: 0, zIndex: 5, boxShadow: "0 1px 0 #edf2f7" }}>
                        <tr>
                          <th style={{ padding: "12px", width: 50, textAlign: "center" }}>
                            <input type="checkbox" onChange={toggleAllAreas} checked={fromAreas.length > 0 && selectedAreaIds.length === fromAreas.length} style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }} />
                          </th>
                          <th style={{ padding: "12px", textAlign: "left" }}>AREA NAME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fromAreas.map(area => (
                          <tr key={area.id} onClick={() => toggleAreaRow(area.id)} style={{ cursor: "pointer", background: selectedAreaIds.includes(area.id) ? "rgba(59, 130, 246, 0.05)" : "transparent" }}>
                            <td style={{ padding: "10px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={selectedAreaIds.includes(area.id)} onChange={() => toggleAreaRow(area.id)} style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }} />
                            </td>
                            <td style={{ padding: "10px", color: selectedAreaIds.includes(area.id) ? "#2563eb" : "#475569", fontWeight: selectedAreaIds.includes(area.id) ? 600 : 500 }}>{area.area_name || area.areaName || area.name || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="ucr-footer" style={{ borderTop: "1px solid #edf2f7" }}>
                    <span className="ucr-brand" style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginRight: "auto", textTransform: "uppercase", letterSpacing: "0.04em" }}>{selectedAreaIds.length} SELECTED</span>
                    <button onClick={executeTransfer} disabled={selectedAreaIds.length === 0 || isTransferring} className="ucr-submit-btn">
                      {isTransferring ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <ArrowRightLeft size={14} />} Transfer Areas
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="transfer-block-container">
                    {/* Source Areas */}
                    <div style={{ flex: 1, border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: 400, boxShadow: "0 2px 12px rgba(0,0,0,0.01)" }}>
                      <div className="ucr-brand" style={{ background: "#f8fafc", padding: "12px 14px", borderBottom: "1px solid #edf2f7", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>1. SOURCE AREAS</div>
                      <div style={{ flex: 1, overflowY: "auto" }}>
                        {fromAreas.map(area => (
                          <div key={area.id} onClick={() => handleSourceAreaClick(area.id)}
                            style={{
                              padding: "12px 14px", fontSize: 13.5, cursor: "pointer", borderBottom: "1px solid #f8fafc",
                              background: selectedFromAreaId === area.id ? "rgba(59, 130, 246, 0.05)" : "transparent",
                              color: selectedFromAreaId === area.id ? "#2563eb" : "#475569",
                              fontWeight: selectedFromAreaId === area.id ? 600 : 500,
                              borderLeft: selectedFromAreaId === area.id ? "3px solid #3B82F6" : "3px solid transparent",
                              transition: "all 0.12s"
                            }}>
                            {area.area_name || area.areaName || area.name || "—"}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Providers */}
                    <div style={{ flex: 1, border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: 400, boxShadow: "0 2px 12px rgba(0,0,0,0.01)" }}>
                      <div className="ucr-brand" style={{ background: "#eff6ff", padding: "12px 14px", borderBottom: "1px solid #bfdbfe", fontSize: 11, fontWeight: 700, color: "#2563eb", display: "flex", justifyContent: "space-between", alignItems: "center", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        <span>2. SELECT {transferType.toUpperCase()}S</span>
                        {providers.length > 0 && <input type="checkbox" onChange={toggleAllProviders} checked={selectedProviderIds.length === providers.length} style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }} />}
                      </div>
                      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
                        {isLoadingProviders ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><Loader2 size={20} style={{ animation: "ucr-spin 1s linear infinite", color: "#3B82F6" }} /></div>
                        ) : providers.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "32px 16px", color: "#94a3b8", fontStyle: "italic", fontSize: 13 }}>No entries available.</div>
                        ) : providers.map(p => (
                          <div key={p.id} onClick={() => toggleProviderRow(p.id)}
                            style={{
                              padding: "12px 14px", fontSize: 13.5, cursor: "pointer", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: 10,
                              background: selectedProviderIds.includes(p.id) ? "rgba(59, 130, 246, 0.05)" : "transparent",
                              color: selectedProviderIds.includes(p.id) ? "#2563eb" : "#475569",
                              fontWeight: selectedProviderIds.includes(p.id) ? 600 : 500,
                              transition: "all 0.12s"
                            }}>
                            <input type="checkbox" checked={selectedProviderIds.includes(p.id)} onChange={() => toggleProviderRow(p.id)} onClick={(e) => e.stopPropagation()} style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {p.doctor_name || p.doctorName || p.chemist_name || p.chemistName || p.stockist_name || p.stockistName || p.name || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Destination */}
                    <div style={{ flex: 1, border: "1px solid #edf2f7", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: 400, boxShadow: "0 2px 12px rgba(0,0,0,0.01)" }}>
                      <div className="ucr-brand" style={{ background: "#f8fafc", padding: "12px 14px", borderBottom: "1px solid #edf2f7", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>3. DESTINATION AREA</div>
                      <div style={{ flex: 1, overflowY: "auto" }}>
                        {toAreas.map(area => (
                          <div key={area.id} onClick={() => setSelectedToAreaId(area.id)}
                            style={{
                              padding: "12px 14px", fontSize: 13.5, cursor: "pointer", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center",
                              background: selectedToAreaId === area.id ? "rgba(22, 163, 74, 0.05)" : "transparent",
                              color: selectedToAreaId === area.id ? "#16a34a" : "#475569",
                              fontWeight: selectedToAreaId === area.id ? 600 : 500,
                              borderLeft: selectedToAreaId === area.id ? "3px solid #16a34a" : "3px solid transparent",
                              transition: "all 0.12s"
                            }}>
                            {area.area_name || area.areaName || area.name || "—"}
                            {selectedToAreaId === area.id && <Check size={14} style={{ color: "#16a34a" }} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ucr-footer" style={{ background: "#ffffff", borderTop: "none", paddingTop: 4 }}>
                    <button onClick={executeTransfer} disabled={selectedProviderIds.length === 0 || !selectedToAreaId || isTransferring} className="ucr-submit-btn">
                      {isTransferring ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <ArrowRightLeft size={14} />} Complete Transfer
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Success Popup */}
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
function FSelect({ label, name, value, onChange, disabled, options=[] }) {
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
                onMouseDown={(e)=>{ 
                  e.preventDefault(); 
                  onChange({ target: { name, value: String(opt.id) } }); 
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
function MultiSelectDropdown({ label, options, selectedIds, onChange }) {
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
  const bgColor      = open ? "#eff6ff" : "#ffffff";
  const shadow      = open ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";
  const displayVal = hasVal ? options.filter(o => selectedIds.includes(o.id)).map(o => o.state_name).join(", ") : "";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open?100:1 }} className="dc-field-wrap">
      <div onClick={() => setOpen(!open)}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px", fontSize: 13, display: "flex", alignItems: "center",
          cursor: "pointer", background: bgColor, border: `1.5px solid ${borderColor}`, boxShadow: shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? "#1e293b" : "transparent", fontSize: 14 }}>
          {displayVal || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top:"50%", transform:"translateY(-50%)", color: open?"#3B82F6":"#94a3b8", transition: "all 0.2s" }}>
          <MapPin size={15} style={{ transform: open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }} />
        </div>
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents:"none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>{label}</label>

      {open && (
        <div className="dc-dropdown">
          <div style={{ display: "flex", borderBottom: "1px solid #edf2f7", background: "#f8fafc" }}>
            <button style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#2563eb", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onChange(options.map(o => o.id)); }}>Select All</button>
            <button style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 700, background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseDown={(e) => { e.preventDefault(); onChange([]); }}>Clear</button>
          </div>
          <ul>
            {options.length === 0 && <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>}
            {options.map(opt => (
              <li key={opt.id} className={`dc-opt${selectedIds.includes(opt.id)?" selected":""}`}
                onMouseDown={(e) => { 
                  e.preventDefault(); 
                  onChange(selectedIds.includes(opt.id) ? selectedIds.filter(i => i !== opt.id) : [...selectedIds, opt.id]); 
                }}
              >
                <input type="checkbox" checked={selectedIds.includes(opt.id)} readOnly style={{ accentColor: "#3B82F6", cursor: "pointer", marginRight: 8 }} />
                {opt.state_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}