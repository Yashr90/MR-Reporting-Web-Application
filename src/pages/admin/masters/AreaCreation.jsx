import React, { useState, useEffect, useRef } from "react";
import {
  Loader2, Save, Edit2, Trash2, MapPinned, ChevronDown, Check, AlertCircle
} from "lucide-react";
import api from "../../../services/api";

/* ─── Premium UI Styles & Utilities ──────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=500;600;700;800&family=Inter:wght=400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ac-wrap {
    font-family: 'Inter', sans-serif;
    width: 100%;
    background: #ffffff;
  }

  .ucr-brand { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Single Unified Card Container (Removed overflow:hidden to allow dropdown visibility) ── */
  .ac-card {
    background: #ffffff;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    isolation: isolate;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    position: relative;
  }

  /* ── Card Header (Forced Top Corner Rounding Match to fix background bleed) ── */
  .ac-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
  }

  /* ── Sub-section Table Header ── */
  .ac-section-header {
    padding: 24px 28px 16px;
    background: #ffffff;
    border-top: 1px solid #f1f5f9;
  }

  .ac-page-icon {
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
  .ac-body { padding: 20px 28px 24px; background: #ffffff; }

  /* ── Responsive Input Grids ── */
  .ac-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    align-items: center;
  }

  @media(max-width: 1200px) { .ac-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(max-width: 900px)  { .ac-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
  @media(max-width: 640px)  {
    .ac-grid { grid-template-columns: 1fr; gap: 20px; }
    .ac-body { padding: 20px 16px; }
    .ac-header { padding: 20px 16px 12px; border-top-left-radius: 16px !important; border-top-right-radius: 16px !important; }
    .ac-section-header { padding: 20px 16px 12px; }
    .ac-submit-btn { width: 100%; justify-content: center !important; }
  }

  /* ── Dropdown list ── */
  .ac-dropdown {
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

  .ac-dropdown ul {
    max-height: 220px;
    overflow-y: auto;
    padding: 6px;
    margin: 0;
    list-style: none;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }

  .ac-dropdown ul::-webkit-scrollbar { width: 4px; }
  .ac-dropdown ul::-webkit-scrollbar-track { background: transparent; }
  .ac-dropdown ul::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  .ac-opt {
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
  .ac-opt:hover   { background: rgba(59,130,246,0.06); color: #2563eb; }
  .ac-opt.selected { background: rgba(59,130,246,0.08); color: #2563eb; font-weight: 600; }

  /* ── Forced Browser Autocomplete/Autofill Override ── */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    box-shadow: 0 0 0 1000px #ffffff inset !important;
    -webkit-text-fill-color: #1e293b !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* ── Submission Button ── */
  .ac-submit-btn {
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
    justify-content: center;
    flex-shrink: 0;
  }
  .ac-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.3);
    background: linear-gradient(135deg, #60a5fa, #3B82F6);
  }
  .ac-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ac-overlay {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,0.3);
    backdrop-filter: blur(4px);
    padding: 16px;
  }

  .ac-popup {
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
    animation: ac-zoom 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* ── Table Styling (Forced Bottom Corner Rounding Match) ── */
  .ac-table-wrap {
    overflow-x: auto;
    background: #ffffff;
    border-bottom-left-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
  }

  .ac-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    text-align: left;
    min-width: 1000px;
  }

  .ac-table th {
    background: #f8fafc;
    padding: 14px 20px;
    color: #64748b;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    border-bottom: 1px solid #edf2f7;
  }

  .ac-table td {
    padding: 14px 20px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.15s;
  }

  .ac-table tr:last-child td {
    border-bottom: none;
  }

  .ac-table tr:last-child td:first-child {
    border-bottom-left-radius: 16px !important;
  }
  .ac-table tr:last-child td:last-child {
    border-bottom-right-radius: 16px !important;
  }

  .ac-table tr:hover td {
    background: rgba(59, 130, 246, 0.02);
  }

  .ac-badge {
    background: rgba(59, 130, 246, 0.08);
    color: #2563eb;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
  }

  .ac-action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    color: #94a3b8;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .ac-action-btn.edit:hover {
    background: rgba(59, 130, 246, 0.06);
    color: #2563eb;
  }

  .ac-action-btn.delete:hover {
    background: #fef2f2;
    color: #ef4444;
  }

  .ac-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }

  @keyframes ac-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ac-zoom { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
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

export default function AreaCreation() {
  const [isLoading,    setIsLoading]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");
  const [popup,        setPopup]        = useState({ isOpen: false, message: "" });
  const [editingId,    setEditingId]    = useState(null);

  const [states,    setStates]    = useState([]);
  const [districts, setDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [areas,     setAreas]     = useState([]);

  const [formData, setFormData] = useState({
    stateId: "", districtId: "", employeeId: "",
    areaName: "", areaCode: "", areaType: ""
  });

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    if (formData.stateId) fetchDistrictsByState(formData.stateId);
    else { setDistricts([]); setEmployees([]); }
  }, [formData.stateId]);

  useEffect(() => {
    if (formData.stateId && formData.districtId) fetchFilteredEmployees(formData.stateId, formData.districtId);
    else setEmployees([]);
  }, [formData.stateId, formData.districtId]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [statesRes, areasRes] = await Promise.all([
        api.get('/api/masters/states'),
        api.get('/api/masters/areas')
      ]);
      if (statesRes.data?.success) setStates(statesRes.data.data);
      if (areasRes.data?.success)  setAreas(areasRes.data.data);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistrictsByState = async (stateId) => {
    try {
      const response = await api.get(`/api/masters/districts?stateId=${stateId}`);
      if (response.data?.success) setDistricts(response.data.data);
    } catch (err) {
      console.error("Failed to fetch districts", err);
      setDistricts([]);
    }
  };

  const fetchFilteredEmployees = async (stateId, districtId) => {
    try {
      const response = await api.get(`/api/masters/employees/filter?stateId=${stateId}&districtId=${districtId}`);
      if (response.data?.success) setEmployees(response.data.data);
    } catch (err) {
      console.error("Failed to fetch filtered employees", err);
      setEmployees([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "areaCode" ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleStateChange = (e) => {
    setFormData(prev => ({ ...prev, stateId: e.target.value, districtId: "", employeeId: "" }));
  };

  const handleDistrictChange = (e) => {
    setFormData(prev => ({ ...prev, districtId: e.target.value, employeeId: "" }));
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      stateId:    item.stateId    || item.state?.id    || item.state_id    || "",
      districtId: item.districtId || item.district?.id || item.district_id || "",
      employeeId: item.employeeId || item.employee?.id || item.employee_id || "",
      areaName:   item.areaName   || item.area_name    || "",
      areaCode:   item.areaCode   || item.area_code    || "",
      areaType:   item.areaType   || item.area_type    || item.type        || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this area?")) return;
    setError("");
    try {
      const response = await api.delete(`/api/masters/areas/${id}`);
      if (response.status === 200 || response.status === 204 || response.data?.success) {
        setPopup({ isOpen: true, message: "Area deleted successfully!" });
        fetchInitialData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete area.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const payload = {
      stateId:    parseInt(formData.stateId),
      districtId: parseInt(formData.districtId),
      employeeId: parseInt(formData.employeeId),
      areaName:   formData.areaName,
      areaCode:   formData.areaCode || null,
      areaType:   formData.areaType
    };
    try {
      let response;
      if (editingId) {
        response = await api.put(`/api/masters/areas/${editingId}`, payload);
      } else {
        response = await api.post('/api/masters/areas', payload);
      }
      if (response.status === 200 || response.status === 201 || response.data?.success) {
        setPopup({ isOpen: true, message: editingId ? "Area updated successfully!" : "Area created successfully!" });
        setFormData({ stateId: "", districtId: "", employeeId: "", areaName: "", areaCode: "", areaType: "" });
        setEditingId(null);
        fetchInitialData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save area.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAreas = areas.filter(item => {
    const sId = item.stateId    || item.state_id    || item.state?.id;
    const dId = item.districtId || item.district_id || item.district?.id;
    const eId = item.employeeId || item.employee_id || item.employee?.id;
    return sId?.toString() === formData.stateId?.toString() &&
           dId?.toString() === formData.districtId?.toString() &&
           eId?.toString() === formData.employeeId?.toString();
  });

  const selectedStateName    = states.find(s    => s.id?.toString() === formData.stateId)?.state_name       || "N/A";
  const selectedDistrictName = districts.find(d => d.id?.toString() === formData.districtId)?.district_name || "N/A";
  const selectedEmployeeName = employees.find(e => e.id?.toString() === formData.employeeId)?.name           || "N/A";

  return (
    <div className="ac-wrap">
      <style>{STYLES}</style>

      {/* ── Single Unified Card Container ── */}
      <div className="ac-card">
        {/* Main Card Header */}
        <div className="ac-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="ac-page-icon">
              <MapPinned size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {editingId ? "Edit Employee Area" : "Employee Area Creation"}
              </h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                {editingId ? "Update the area details below" : "Fill in the details to create a new area"}
              </p>
            </div>
          </div>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setFormData({ stateId: "", districtId: "", employeeId: "", areaName: "", areaCode: "", areaType: "" }); }}
              style={{ fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 500 }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Form Body Area */}
        <div className="ac-body">
          {error && (
            <div className="ac-error-banner">
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="ac-grid" style={{ marginBottom: 18 }}>
              <FSelect
                label="Select State" name="stateId" value={formData.stateId}
                onChange={handleStateChange} required
                options={states.map(s => ({ id: s.id, label: s.state_name }))}
              />
              <FSelect
                label="Select District" name="districtId" value={formData.districtId}
                onChange={handleDistrictChange} required disabled={!formData.stateId}
                options={districts.map(d => ({ id: d.id, label: d.district_name }))}
              />
              <FSelect
                label="Select Employee" name="employeeId" value={formData.employeeId}
                onChange={handleInputChange} required disabled={!formData.districtId}
                options={employees.map(e => ({ id: e.id, label: e.name }))}
              />
              <FInput
                label="Area Name" name="areaName" value={formData.areaName}
                onChange={handleInputChange} required
              />
            </div>

            <div className="ac-grid" style={{ alignItems: "flex-end" }}>
              <FInput
                label="Area Code" name="areaCode" value={formData.areaCode}
                onChange={handleInputChange}
              />
              <FSelect
                label="Area Type" name="areaType" value={formData.areaType}
                onChange={handleInputChange} required
                options={[
                  { id: "HQ", label: "HQ (Headquarter)" },
                  { id: "EX", label: "EX (Ex-Station)" },
                ]}
              />
              <div />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={isSubmitting} className="ac-submit-btn" style={{ width: "100%" }}>
                  {isSubmitting ? (
                    <Loader2 size={14} style={{ animation: "ac-spin 1s linear infinite" }} />
                  ) : editingId ? (
                    <Edit2 size={14} />
                  ) : (
                    <Save size={14} />
                  )}
                  {editingId ? "Update Area" : "Create Area"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sub-section Integrated Inner Table Header */}
        {formData.stateId && formData.districtId && formData.employeeId && (
          <>
            <div className="ac-section-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                Employee Area List
              </h2>
              {filteredAreas.length > 0 && (
                <span className="ac-badge">
                  {filteredAreas.length} area{filteredAreas.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div style={{ padding: "0 0 0 0" }}>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0", color: "#3B82F6" }}>
                  <Loader2 size={24} style={{ animation: "ac-spin 1s linear infinite", marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: 0 }}>Loading areas...</p>
                </div>
              ) : filteredAreas.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px", margin: "0 24px 24px 24px", textAlign: "center", border: "2px dashed #e2e8f0", borderRadius: 14, background: "#f8fafc" }}>
                  <div style={{ background: "#ffffff", padding: 14, borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPinned size={24} style={{ color: "#94a3b8" }} />
                  </div>
                  <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No Areas Found</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", maxWidth: 320, margin: 0 }}>
                    There are no areas assigned to this employee yet.
                  </p>
                </div>
              ) : (
                <div className="ac-table-wrap">
                  <table className="ac-table">
                    <thead>
                      <tr>
                        {["State Name", "Headquarter Name", "Employee Name", "Area Name", "Type", "Status", "Total Doctor", "Total Chemist", "Total Stockist", "Edit", "Delete"].map((h, i) => (
                          <th key={i} style={{ paddingLeft: i === 0 ? "28px" : "20px", paddingRight: i === 10 ? "28px" : "20px", textAlign: i >= 4 && i <= 8 ? "center" : "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAreas.map(item => (
                        <tr key={item.id} style={{ background: editingId === item.id ? "rgba(59,130,246,0.04)" : "transparent" }}>
                          <td style={{ paddingLeft: "28px" }}>{selectedStateName}</td>
                          <td>{selectedDistrictName}</td>
                          <td>{selectedEmployeeName}</td>
                          <td style={{ color: "#1e293b", fontWeight: 600 }}>{item.areaName || item.area_name}</td>
                          <td style={{ textAlign: "center" }}>
                            <span className="ac-badge" style={{ background: "#f1f5f9", color: "#475569" }}>
                              {item.areaType || item.area_type || item.type}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", color: "#64748b" }}>{item.status?.toString() || 'true'}</td>
                          <td style={{ textAlign: "center", fontWeight: 600 }}>{item.totalDoctor || item.total_doctor || 0}</td>
                          <td style={{ textAlign: "center", fontWeight: 600 }}>{item.totalChemist || item.total_chemist || 0}</td>
                          <td style={{ textAlign: "center", fontWeight: 600 }}>{item.totalStockist || item.total_stockist || 0}</td>
                          <td style={{ textAlign: "left" }}>
                            <button onClick={() => handleEditClick(item)} className="ac-action-btn edit" title="Edit Area">
                              <Edit2 size={15} />
                            </button>
                          </td>
                          <td style={{ textAlign: "left", paddingRight: "28px" }}>
                            <button onClick={() => handleDeleteClick(item.id)} className="ac-action-btn delete" title="Delete Area">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Success Popup ── */}
      {popup.isOpen && (
        <div className="ac-overlay">
          <div className="ac-popup">
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <Check size={28} style={{ color: "#3B82F6", strokeWidth: 2.5 }} />
            </div>
            <h3 className="ucr-brand" style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
              Success
            </h3>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 24px" }}>{popup.message}</p>
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

/* ── Floating Label Input ── */
function FInput({ label, name, type = "text", value, onChange, required, disabled, error }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = error ? "#fca5a5" : focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow  = focus && !disabled ? (error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(59,130,246,0.15)") : "none";
  const labelColor = error ? "#dc2626" : focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="ac-field-wrap">
      <div style={{ position: "relative", width: "100%", height: FH }}>
        <input
          type={type} id={name} name={name} value={value || ""}
          onChange={onChange} required={required} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
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
          position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
          transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
          transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
        }}>
          {label}{required ? " *" : ""}
        </label>
      </div>
    </div>
  );
}

/* ── Searchable Dropdown Selection Component ── */
function FSelect({ label, name, value, onChange, required, disabled, options = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected   = options.find(o => String(o.id) === String(value));
  const hasVal      = Boolean(value);
  const active      = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor     = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow      = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor  = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  const handleSelect = (optId) => {
    onChange({ target: { name, value: String(optId) } });
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none", zIndex: open ? 100 : 1 }} className="ac-field-wrap">
      <div
        onClick={() => { if (!disabled) setOpen(!open); }}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor,
          border: `1.5px solid ${disabled ? "#f1f5f9" : borderColor}`,
          boxShadow: disabled ? "none" : shadow, transition: "all 0.18s", boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasVal ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
          {selected?.label || " "}
        </span>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: open ? "#3B82F6" : "#94a3b8", transition: "all 0.2s" }}>
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>

      <label style={{
        position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
        transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
        transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
        color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
        padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
      }}>
        {label}{required ? " *" : ""}
      </label>

      {open && !disabled && (
        <div className="ac-dropdown">
          <ul>
            {options.length === 0 && (
              <li style={{ padding: "12px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>
            )}
            {options.map(opt => (
              <li key={opt.id}
                className={`ac-opt${String(value) === String(opt.id) ? " selected" : ""}`}
                onMouseDown={e => { e.preventDefault(); handleSelect(opt.id); }}
              >
                {String(value) === String(opt.id) && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}