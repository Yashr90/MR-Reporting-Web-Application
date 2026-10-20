import React, { useState, useEffect, useRef } from "react";
import { Loader2, ArrowLeft, Trash2, Check, ChevronDown, MapPin, PlusCircle, Search, AlertCircle } from "lucide-react";
import api from "../../../services/api";

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hm-wrap {
    font-family: 'Inter', sans-serif;
    width: 100%;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Single Unified Card Container ── */
  .hm-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: isolate;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    position: relative;
    overflow: visible;
  }

  /* ── Card Header ── */
  .hm-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    border-radius: 16px 16px 16px 16px !important;
  }

  .hm-page-icon {
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
  .hm-body { padding: 20px 28px 24px; background: #ffffff; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; }

  /* ── Layout Panels & Controls ── */
  .hm-controls { 
    display: flex; 
    align-items: flex-end; 
    gap: 18px; 
    margin-bottom: 25px; 
    flex-wrap: wrap; 
  }
  .hm-controls-state { width: 280px; flex-shrink: 0; }
  .hm-controls-btns { display: flex; gap: 12px; flex-wrap: wrap; }

  .hm-panels { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 24px; 
  }
  .hm-create-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 18px; 
    margin-bottom: 25px; 
  }

  @media(max-width: 1024px) {
    .hm-controls-state { width: 100%; }
    .hm-controls-btns { width: 100%; }
  }
  @media(max-width: 768px) {
    .hm-panels { grid-template-columns: 1fr; gap: 24px; }
    .hm-create-grid { grid-template-columns: 1fr; gap: 20px; }
    .hm-body { padding: 20px 16px; }
    .hm-header { padding: 20px 16px 12px; }
    .hm-controls { gap: 20px; }
    .hm-controls-btns button { flex: 1; justify-content: center !important; }
  }

  /* ── Panel Box Lists ── */
  .hm-panel-box { 
    border: 1px solid #edf2f7; 
    border-radius: 12px; 
    overflow: hidden; 
    height: 320px; 
    background: #ffffff; 
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
  }
  .hm-panel-box.mapped { border-color: #bfdbfe; }
  .hm-panel-scroll { overflow-y: auto; height: 100%; scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
  .hm-panel-scroll::-webkit-scrollbar { width: 4px; }
  .hm-panel-scroll::-webkit-scrollbar-track { background: transparent; }
  .hm-panel-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  /* ── Premium Styled Table ── */
  .hm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; }
  .hm-table thead tr { position: sticky; top: 0; z-index: 10; }
  .hm-table thead.avail-head { background: #f8fafc; }
  .hm-table thead.mapped-head { background: #eff6ff; }
  
  .hm-table th { 
    padding: 10px 14px; 
    font-size: 11px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 0.04em; 
    border-bottom: 1px solid #f1f5f9; 
  }
  .hm-table th.th-avail { color: #64748b; }
  .hm-table th.th-mapped { color: #2563eb; }
  
  .hm-table td { padding: 10px 14px; color: #475569; border-bottom: 1px solid #f8fafc; font-weight: 500; }
  .hm-table tbody tr:last-child td { border-bottom: none; }
  .hm-table tbody tr:hover { background: #f8fafc; }
  .hm-table tbody tr.row-avail-sel { background: rgba(59, 130, 246, 0.05) !important; }
  .hm-table tbody tr.row-mapped-sel { background: #fef2f2 !important; }

  /* ── Dropdown List ── */
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
  .dc-opt:hover { background: rgba(59,130,246,0.06); color: #2563eb; }
  .dc-opt.selected { background: rgba(59,130,246,0.08); color: #2563eb; font-weight: 600; }

  /* ── Buttons ── */
  .hm-btn-primary { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    padding: 10px 24px; 
    border-radius: 8px; 
    font-size: 14px; 
    font-weight: 600; 
    border: none; 
    cursor: pointer; 
    background: linear-gradient(135deg, #3B82F6, #2563eb); 
    color: #fff; 
    box-shadow: 0 4px 14px rgba(59,130,246,0.2); 
    transition: all 0.2s; 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    letter-spacing: 0.01em; 
    height: 40px; 
    white-space: nowrap;
  }
  .hm-btn-primary:hover:not(:disabled) { 
    transform: translateY(-1px); 
    box-shadow: 0 6px 20px rgba(59,130,246,0.3); 
    background: linear-gradient(135deg, #60a5fa, #3B82F6); 
  }
  .hm-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .hm-btn-outline { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    padding: 10px 24px; 
    border-radius: 8px; 
    font-size: 14px; 
    font-weight: 600; 
    border: 1.5px solid #e2e8f0; 
    cursor: pointer; 
    background: #ffffff; 
    color: #475569; 
    transition: all 0.15s ease; 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    height: 40px; 
    white-space: nowrap;
  }
  .hm-btn-outline:hover { border-color: #3B82F6; color: #2563eb; background: #eff6ff; }

  .hm-btn-map { 
    width: 100%; 
    padding: 10px 0; 
    border-radius: 8px; 
    border: none; 
    cursor: pointer; 
    font-size: 13.5px; 
    font-weight: 600; 
    transition: all 0.2s; 
    font-family: 'Plus Jakarta Sans', sans-serif;
    height: 40px;
  }
  .hm-btn-map.do-map { 
    background: linear-gradient(135deg, #3B82F6, #2563eb); 
    color: #fff; 
    box-shadow: 0 4px 12px rgba(59,130,246,0.15); 
  }
  .hm-btn-map.do-map:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59,130,246,0.25); }
  .hm-btn-map.do-unmap { 
    background: linear-gradient(135deg, #f87171, #ef4444); 
    color: #fff; 
    box-shadow: 0 4px 12px rgba(239,68,68,0.15); 
  }
  .hm-btn-map.do-unmap:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(239,68,68,0.25); }
  .hm-btn-map.inactive { background: #f8fafc; border: 1px solid #e2e8f0; color: #94a3b8; cursor: not-allowed; }

  .hm-empty { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    padding: 36px 16px; 
    text-align: center; 
    border: 1px dashed #e2e8f0; 
    border-radius: 12px; 
    background: #f8fafc; 
  }

  /* ── System Error Banner ── */
  .hm-error-banner {
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

  /* ── Overlay Popups ── */
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

  @keyframes hm-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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

/* ═══════════════════════════════════════════════════════════════════════════
    MAIN COMPONENT — all logic & API unchanged
═══════════════════════════════════════════════════════════════════════════ */
export default function HeadquarterMapping() {
  const [isLoading,      setIsLoading]      = useState(false);
  const [view,            setView]            = useState("mapping");
  const [error,           setError]           = useState("");
  const [popup,           setPopup]           = useState({ isOpen: false, message: "" });

  const [states,          setStates]          = useState([]);
  const [selectedState,   setSelectedState]   = useState("");

  const [unmappedDistricts, setUnmappedDistricts] = useState([]);
  const [mappedDistricts,   setMappedDistricts]   = useState([]);
  const [checkedUnmapped,   setCheckedUnmapped]   = useState([]);
  const [checkedMapped,     setCheckedMapped]     = useState([]);

  const [newDistrictName, setNewDistrictName] = useState("");
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  useEffect(() => { fetchStates(); }, []);

  const fetchStates = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/masters/states");
      if (response.data?.success) setStates(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch states", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDistricts = async () => {
    if (!selectedState) return;
    setIsLoading(true); setError("");
    try {
      const [allRes, mappedRes] = await Promise.all([
        api.get(`/api/masters/districts/all?stateId=${selectedState}`),
        api.get(`/api/masters/districts?stateId=${selectedState}`)
      ]);
      const allDistricts = allRes.data?.data    || [];
      const activeMapped = mappedRes.data?.data || [];
      const mappedIds    = activeMapped.map(d => d.id);
      setMappedDistricts(activeMapped);
      setUnmappedDistricts(allDistricts.filter(d => !mappedIds.includes(d.id)));
      setCheckedUnmapped([]); setCheckedMapped([]);
    } catch (err) {
      setError("Failed to fetch district mapping data.");
    } finally {
      setIsLoading(false);
    }
  };

  const moveDistricts = async (direction) => {
    const isMapping   = direction === "right";
    const selectedIds = isMapping ? checkedUnmapped : checkedMapped;
    if (selectedIds.length === 0) return;
    setIsLoading(true); setError("");
    try {
      const response = await api.put("/api/masters/districts/status", {
        districtIds: selectedIds, isActive: isMapping
      });
      if (response.status === 200 || response.data?.success) {
        setPopup({ isOpen: true, message: isMapping ? "Districts Mapped Successfully" : "Removed Mapped Districts Successfully" });
        await handleGetDistricts();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update district status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDistrict = async () => {
    if (!selectedState || !newDistrictName) return;
    setIsSubmitting(true); setError("");
    try {
      const response = await api.post("/api/masters/districts", {
        stateId: parseInt(selectedState), districtName: newDistrictName
      });
      if (response.status === 200 || response.status === 201 || response.data?.success) {
        setPopup({ isOpen: true, message: "District Created Successfully" });
        setNewDistrictName("");
        setView("mapping");
        await handleGetDistricts();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create district.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDistrict = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    setIsLoading(true); setError("");
    try {
      const response = await api.delete(`/api/masters/districts/${id}`);
      if (response.status === 200 || response.status === 204 || response.data?.success) {
        setPopup({ isOpen: true, message: "District Deleted Successfully" });
        await handleGetDistricts();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete district.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheck = (id, listType) => {
    if (listType === "unmapped") {
      setCheckedUnmapped(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setCheckedMapped(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
  };

  const toggleAll = (listType, e) => {
    if (listType === "unmapped") {
      setCheckedUnmapped(e.target.checked ? unmappedDistricts.map(d => d.id) : []);
    } else {
      setCheckedMapped(e.target.checked ? mappedDistricts.map(d => d.id) : []);
    }
  };

  const showPanels = unmappedDistricts.length > 0 || mappedDistricts.length > 0;

  return (
    <div className="hm-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="hm-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <div className="hm-card">

        {/* ── Header ── */}
        <div className="hm-header">
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div className="hm-page-icon">
              <MapPin size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize:16, fontWeight:700, color:"#1e293b", letterSpacing:"-0.01em", lineHeight:1.2 }}>
                {view === "mapping" ? "District Mapping" : "Headquarter Creation"}
              </h1>
              <p style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>
                {view === "mapping" ? "Map or unmap districts to a state" : "Create a new district entry"}
              </p>
            </div>
          </div>
          {view === "creation" && (
            <button className="hm-btn-outline" onClick={() => setView("mapping")}>
              <ArrowLeft size={14}/> Back
            </button>
          )}
        </div>

        <div className="hm-body">

          {/* ══ MAPPING VIEW ══ */}
          {view === "mapping" && (
            <>
              {/* Controls */}
              <div className="hm-controls">
                <div className="hm-controls-state">
                  <FSelect
                    label="Select State"
                    value={selectedState}
                    onChange={v => setSelectedState(v)}
                    options={states.map(s => ({ id: s.id, label: s.state_name }))}
                  />
                </div>
                <div className="hm-controls-btns">
                  <button className="hm-btn-primary" onClick={handleGetDistricts} disabled={!selectedState || isLoading}>
                    {isLoading
                      ? <Loader2 size={14} style={{ animation:"hm-spin 1s linear infinite" }}/>
                      : <Search size={14}/>}
                    Get Districts
                  </button>
                  <button className="hm-btn-outline" onClick={() => setView("creation")}>
                    <PlusCircle size={14}/> Create New
                  </button>
                </div>
              </div>

              {showPanels ? (
                <div className="hm-panels">

                  {/* Available */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                      <span className="ucr-brand" style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.04em" }}>Available</span>
                      <span style={{ fontSize:11, background:"#f1f5f9", color:"#64748b", padding:"3px 10px", borderRadius:20, fontWeight:600 }}>{unmappedDistricts.length}</span>
                    </div>
                    <div className="hm-panel-box">
                      <div className="hm-panel-scroll">
                        <table className="hm-table">
                          <thead className="avail-head">
                            <tr>
                              <th style={{ width:44, textAlign:"center" }}>
                                <input type="checkbox"
                                  onChange={(e) => toggleAll("unmapped", e)}
                                  checked={unmappedDistricts.length > 0 && checkedUnmapped.length === unmappedDistricts.length}
                                  style={{ width:14, height:14, accentColor:"#3B82F6", cursor:"pointer" }}
                                />
                              </th>
                              <th className="th-avail">District Name</th>
                              <th style={{ width:44, textAlign:"center" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {unmappedDistricts.length === 0 ? (
                              <tr><td colSpan="3" style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontStyle:"italic" }}>No available districts.</td></tr>
                            ) : unmappedDistricts.map(d => (
                              <tr key={d.id} className={checkedUnmapped.includes(d.id) ? "row-avail-sel" : ""}>
                                <td style={{ textAlign:"center" }}>
                                  <input type="checkbox"
                                    checked={checkedUnmapped.includes(d.id)}
                                    onChange={() => toggleCheck(d.id, "unmapped")}
                                    style={{ width:14, height:14, accentColor:"#3B82F6", cursor:"pointer" }}
                                  />
                                </td>
                                <td style={{ color: checkedUnmapped.includes(d.id) ? "#2563eb" : "#475569", fontWeight: checkedUnmapped.includes(d.id) ? 600 : 500 }}>
                                  {d.districtName || d.district_name || d.name}
                                </td>
                                <td style={{ textAlign:"center" }}>
                                  <button
                                    onClick={() => handleDeleteDistrict(d.id, d.districtName || d.district_name || d.name)}
                                    style={{ border:"none", background:"none", cursor:"pointer", color:"#cbd5e1", padding:"5px", borderRadius:6, display:"inline-flex", alignItems:"center", transition:"all 0.15s" }}
                                    onMouseEnter={e => { e.currentTarget.style.color="#ef4444"; e.currentTarget.style.background="#fef2f2"; }}
                                    onMouseLeave={e => { e.currentTarget.style.color="#cbd5e1"; e.currentTarget.style.background="none"; }}
                                  >
                                    <Trash2 size={14}/>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div style={{ marginTop:14 }}>
                      <button
                        className={`hm-btn-map ${checkedUnmapped.length > 0 ? "do-map" : "inactive"}`}
                        onClick={() => moveDistricts("right")}
                        disabled={checkedUnmapped.length === 0}
                      >
                        Map Selected ({checkedUnmapped.length})
                      </button>
                    </div>
                  </div>

                  {/* Mapped */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                      <span className="ucr-brand" style={{ fontSize:11, fontWeight:700, color:"#2563eb", textTransform:"uppercase", letterSpacing:"0.04em" }}>Mapped</span>
                      <span style={{ fontSize:11, background:"#eff6ff", color:"#2563eb", padding:"3px 10px", borderRadius:20, fontWeight:600 }}>{mappedDistricts.length}</span>
                    </div>
                    <div className="hm-panel-box mapped">
                      <div className="hm-panel-scroll">
                        <table className="hm-table">
                          <thead className="mapped-head">
                            <tr>
                              <th style={{ width:44, textAlign:"center" }}>
                                <input type="checkbox"
                                  onChange={(e) => toggleAll("mapped", e)}
                                  checked={mappedDistricts.length > 0 && checkedMapped.length === mappedDistricts.length}
                                  style={{ width:14, height:14, accentColor:"#3B82F6", cursor:"pointer" }}
                                />
                              </th>
                              <th className="th-mapped">District Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mappedDistricts.length === 0 ? (
                              <tr><td colSpan="2" style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontStyle:"italic" }}>No mapped districts.</td></tr>
                            ) : mappedDistricts.map(d => (
                              <tr key={d.id} className={checkedMapped.includes(d.id) ? "row-mapped-sel" : ""}>
                                <td style={{ textAlign:"center" }}>
                                  <input type="checkbox"
                                    checked={checkedMapped.includes(d.id)}
                                    onChange={() => toggleCheck(d.id, "mapped")}
                                    style={{ width:14, height:14, accentColor:"#3B82F6", cursor:"pointer" }}
                                  />
                                </td>
                                <td style={{ color: checkedMapped.includes(d.id) ? "#dc2626" : "#475569", fontWeight: checkedMapped.includes(d.id) ? 600 : 500 }}>
                                  {d.districtName || d.district_name || d.name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div style={{ marginTop:14 }}>
                      <button
                        className={`hm-btn-map ${checkedMapped.length > 0 ? "do-unmap" : "inactive"}`}
                        onClick={() => moveDistricts("left")}
                        disabled={checkedMapped.length === 0}
                      >
                        Unmap Selected ({checkedMapped.length})
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="hm-empty">
                  <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.12)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                    <MapPin size={22} style={{ color:"#3B82F6" }}/>
                  </div>
                  <p style={{ fontSize:13.5, color:"#64748b", fontWeight: 500, margin:0 }}>Select a state and click "Get Districts" to begin.</p>
                </div>
              )}
            </>
          )}

          {/* ══ CREATION VIEW ══ */}
          {view === "creation" && (
            <div style={{ maxWidth:600, margin:"0 auto", paddingTop:8 }}>
              <div className="hm-create-grid">
                <FSelect
                  label="Select State"
                  value={selectedState}
                  onChange={v => setSelectedState(v)}
                  options={states.map(s => ({ id: s.id, label: s.state_name }))}
                />
                <FInput
                  label="District Name"
                  value={newDistrictName}
                  onChange={e => setNewDistrictName(e.target.value)}
                  required
                />
              </div>
              <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:20, display:"flex", justifyContent:"flex-end" }}>
                <button
                  onClick={handleCreateDistrict}
                  disabled={!selectedState || !newDistrictName || isSubmitting}
                  className="hm-btn-primary"
                  style={{ padding:"10px 32px" }}
                >
                  {isSubmitting
                    ? <Loader2 size={14} style={{ animation:"hm-spin 1s linear infinite" }}/>
                    : <Check size={14}/>}
                  Create District
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

/* ─── Text Input ─────────────────────────────────────────────────────────── */
function FInput({ label, value, onChange, required, disabled }) {
  const [focus, setFocus] = useState(false);
  const hasVal  = Boolean(value?.toString().trim());
  const active  = focus || hasVal;

  const borderColor = focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow  = focus && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position:"relative", width:"100%", height:FH }}>
        <input
          type="text" value={value||""} onChange={onChange}
          required={required} disabled={disabled}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          placeholder=" "
          style={{
            ...fieldBase,
            padding: "0 12px",
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
            color: disabled ? "#94a3b8" : "#1e293b",
          }}
        />
        <label style={{
          position:"absolute", left:10, pointerEvents:"none", zIndex:20,
          transition:"all 0.12s ease-out", fontWeight:500, top: active ? "0" : "50%",
          transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
        }}>{label}{required ? " *" : ""}</label>
      </div>
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

  const handleSelect = (optId) => {
    onChange(String(optId));
    setOpen(false);
  };

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
                onMouseDown={e=>{ e.preventDefault(); handleSelect(opt.id); }}
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