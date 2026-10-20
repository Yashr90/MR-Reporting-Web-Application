import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Check,
  Trash2,
  Edit2,
  MapPin,
  Save,
  Users,
  Filter,
} from "lucide-react";
import api from "../../../services/api";

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

  .dc-divider {
    border: none;
    border-top: 1px solid #f1f5f9;
    margin: 24px 0 28px;
  }

  /* ── Responsive Input Grids ── */
  .dc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 25px;
  }
  .filter-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  @media(max-width: 1200px) {
    .dc-grid { grid-template-columns: repeat(3, 1fr); }
    .filter-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media(max-width: 900px) {
    .dc-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  }
  @media(max-width: 640px) {
    .dc-grid, .filter-grid { grid-template-columns: 1fr; gap: 20px; }
    .dc-body { padding: 20px 16px; }
    .dc-header { padding: 20px 16px 12px; }
    .dc-footer { padding: 16px; }
    .dc-submit-btn, .dc-delete-footer-btn { width: 100% !important; justify-content: center !important; }
  }

  /* ── Responsive Premium Table Container ── */
  .ucr-table-container {
    border: 1px solid #edf2f7;
    border-radius: 12px;
    overflow-x: auto;
    background: #ffffff !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
    -webkit-overflow-scrolling: touch;
  }
  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 800px; }
  .ucr-table thead tr { position: sticky; top: 0; z-index: 10; }
  .ucr-table thead { background: #f8fafc; }
  .ucr-table th { 
    padding: 12px 14px; 
    font-size: 11px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 0.04em; 
    color: #64748b;
    border-bottom: 1px solid #edf2f7; 
    white-space: nowrap;
  }
  .ucr-table td { padding: 12px 14px; color: #475569; border-bottom: 1px solid #f8fafc; font-weight: 500; white-space: nowrap; }
  .ucr-table tbody tr:last-child td { border-bottom: none; }
  .ucr-table tbody tr:hover { background: #f8fafc; }
  .ucr-table tbody tr.row-selected { background: rgba(59, 130, 246, 0.05) !important; }

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

  .dc-field-wrap { display: flex; flex-direction: column; gap: 4px; position: relative; }

  @keyframes dc-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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

export default function STPCreation() {
  // ── UI State ──────────────────────────────────────────────────────────────
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterToggle, setFilterToggle] = useState(true);
  const [editingStpId, setEditingStpId] = useState(null);

  // ── Dropdown Data ─────────────────────────────────────────────────────────
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [areas, setAreas] = useState([]);

  // ── Selections ────────────────────────────────────────────────────────────
  const [selectedDesignationId, setSelectedDesignationId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  // ── Form State ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fromArea: "",
    toArea: "",
    type: "",
    frc: "",
    distance: "",
    frequencyVisit: "",
  });

  // ── Table Data ────────────────────────────────────────────────────────────
  const [stpData, setStpData] = useState([]);
  const [selectedStpIds, setSelectedStpIds] = useState([]);

  // ── Initial Fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const res = await api.get("/api/masters/designations");
      const data = res.data?.data || res.data || [];
      setDesignations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load designations");
    }
  };

  useEffect(() => {
    if (selectedDesignationId) {
      fetchEmployees(selectedDesignationId);
    } else {
      setEmployees([]);
      setSelectedEmployeeId("");
    }
  }, [selectedDesignationId]);

  const fetchEmployees = async (designationId) => {
    try {
      const res = await api.get(`/api/masters/employees/designation/${designationId}`);
      const data = res.data?.data || res.data || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (e) {
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchAreasAndStpData(selectedEmployeeId);
    } else {
      setAreas([]);
      setStpData([]);
      setSelectedStpIds([]);
      setEditingStpId(null);
      setFormData({ fromArea: "", toArea: "", type: "", frc: "", distance: "", frequencyVisit: "" });
    }
  }, [selectedEmployeeId]);

  const fetchAreasAndStpData = async (empId) => {
    setIsLoading(true);
    try {
      const areaRes = await api.get(`/api/masters/areas/employee/${empId}`);
      const areaData = areaRes.data?.data || areaRes.data || [];
      setAreas(Array.isArray(areaData) ? areaData : []);

      const stpRes = await api.get(`/api/masters/stps/employee/${empId}`);
      const stpResData = stpRes.data?.data || stpRes.data || [];
      setStpData(Array.isArray(stpResData) ? stpResData : []);
    } catch (e) {
      console.error("Failed to load areas or STP data");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Form Handlers ─────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "fromArea" && value && !editingStpId) {
        const selectedAreaObj = areas.find(
          (a) => (a.area?.id || a.id).toString() === value.toString()
        );
        if (selectedAreaObj) {
          const targetObj = selectedAreaObj.area || selectedAreaObj;
          const areaType = targetObj.type || targetObj.area_type || targetObj.areaType;
          if (areaType) newData.type = areaType;
        }
      }
      return newData;
    });
  };

  const handleFrcChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      frc: numbersOnly ? `Days: ${numbersOnly}` : "",
    }));
  };

  const handleEditClick = (item) => {
    setEditingStpId(item.id);
    const fromAreaId = item.fromArea?.id || item.fromAreaId || "";
    const toAreaId = item.toArea?.id || item.toAreaId || "";
    const areaType = item.areaType || item.type || "";

    setFormData({
      fromArea: fromAreaId.toString(),
      toArea: toAreaId.toString(),
      type: areaType,
      frc: item.frc ? `Days: ${item.frc}` : "",
      distance: item.distance || "",
      frequencyVisit: item.frequencyVisit || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveStp = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        designationId: parseInt(selectedDesignationId),
        employeeId: parseInt(selectedEmployeeId),
        fromAreaId: parseInt(formData.fromArea),
        toAreaId: parseInt(formData.toArea),
        areaType: formData.type,
        frc: parseInt(String(formData.frc).replace(/\D/g, "")) || 0,
        distance: parseFloat(formData.distance),
        frequencyVisit: parseInt(formData.frequencyVisit),
      };

      let res;
      if (editingStpId) {
        res = await api.put(`/api/masters/stps/${editingStpId}`, payload);
      } else {
        res = await api.post("/api/masters/stps", payload);
      }

      if (res.data?.success || res.status === 200 || res.status === 201) {
        setPopup({
          isOpen: true,
          message: editingStpId ? "STP Updated Successfully!" : "STP Created Successfully!",
        });
        setFormData({ fromArea: "", toArea: "", type: "", frc: "", distance: "", frequencyVisit: "" });
        setEditingStpId(null);
        fetchAreasAndStpData(selectedEmployeeId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save STP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handletextSelectChange = (name, val) => {
    handleInputChange({ target: { name, value: val } });
  };

  const handleDeleteStp = async () => {
    if (selectedStpIds.length === 0 || isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/api/masters/stps/delete", { stpIds: selectedStpIds });
      setPopup({ isOpen: true, message: "STP Deleted Successfully!" });
      setSelectedStpIds([]);
      fetchAreasAndStpData(selectedEmployeeId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete STP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Checkbox ──────────────────────────────────────────────────────────────
  const toggleStpRow = (id) =>
    setSelectedStpIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleAllStpRows = (e) =>
    setSelectedStpIds(e.target.checked ? stpData.map((item) => item.id) : []);

  const isFormValid =
    formData.fromArea &&
    formData.toArea &&
    formData.type &&
    formData.distance &&
    formData.frequencyVisit &&
    selectedEmployeeId;

  const getAreaProps = (a) => {
    const id = a.area?.id || a.id;
    const name =
      a.area?.name ||
      a.area?.areaName ||
      a.area?.area_name ||
      a.name ||
      a.areaName ||
      a.area_name ||
      "Unknown Area";
    return { id, name };
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

      {/* Header & Filters Card */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <Filter size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>STP Creation</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Manage Standard Tour Plans for employees</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterToggle(!filterToggle)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="ucr-brand" style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Filter</span>
              <div style={{ width: 40, height: 20, borderRadius: 100, position: "relative", cursor: "pointer", transition: "0.2s", background: filterToggle ? "#3B82F6" : "#cbd5e1" }}>
                <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: filterToggle ? 23 : 3, transition: "0.2s" }} />
              </div>
            </div>
          </button>
        </div>

        {filterToggle && (
          <div className="dc-body">
            <div className="filter-grid">
              <FSelect
                label="Select Designation"
                name="designationSelect"
                value={selectedDesignationId}
                onChange={(e) => {
                  setSelectedDesignationId(e.target.value);
                  setSelectedEmployeeId("");
                }}
                options={designations.map((d) => ({ id: d.id, label: d.designation_name || d.name }))}
              />
              <FSelect
                label="Employee Name"
                name="employeeSelect"
                value={selectedEmployeeId}
                disabled={!selectedDesignationId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                options={employees.map((e) => ({ id: e.id, label: e.name || e.employee_name }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Card */}
      <div
        className="dc-card"
        style={{ opacity: selectedEmployeeId ? 1 : 0.6, pointerEvents: selectedEmployeeId ? "auto" : "none" }}
      >
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <MapPin size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {editingStpId ? "Edit STP Details" : "New STP Details"}
              </h1>
            </div>
          </div>
          {editingStpId && (
            <button
              type="button"
              onClick={() => {
                setEditingStpId(null);
                setFormData({ fromArea: "", toArea: "", type: "", frc: "", distance: "", frequencyVisit: "" });
              }}
              style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
            >
              CANCEL EDIT
            </button>
          )}
        </div>

        <form onSubmit={handleSaveStp}>
          <div className="dc-body">
            <div className="dc-grid">
              <FSelect
                label="From Area"
                name="fromArea"
                value={formData.fromArea}
                onChange={(e) => handletextSelectChange("fromArea", e.target.value)}
                options={areas.map((a) => { const { id, name } = getAreaProps(a); return { id, label: name }; })}
              />
              <FSelect
                label="To Area"
                name="toArea"
                value={formData.toArea}
                onChange={(e) => handletextSelectChange("toArea", e.target.value)}
                options={areas.map((a) => { const { id, name } = getAreaProps(a); return { id, label: name }; })}
              />
              <FSelect
                label="Type"
                name="type"
                value={formData.type}
                onChange={(e) => handletextSelectChange("type", e.target.value)}
                options={[{ id: "HQ", label: "HQ" }, { id: "EX", label: "EX" }]}
              />
              <FInput label="FRC (e.g. 15)" name="frc" value={formData.frc} onChange={handleFrcChange} />
            </div>
            <div className="dc-grid">
              <FInput label="Distance" name="distance" type="number" value={formData.distance} onChange={handleInputChange} />
              <FInput label="Frequency Visit" name="frequencyVisit" type="number" value={formData.frequencyVisit} onChange={handleInputChange} />
            </div>
          </div>

          <div className="dc-footer">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="dc-submit-btn"
            >
              {isSubmitting
                ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} />
                : <Save size={14} />
              }
              {editingStpId ? "Update STP" : "Add STP"}
            </button>
          </div>
        </form>
      </div>

      {/* Table Card */}
      {selectedEmployeeId && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>STP DATA</h1>
          </div>

          <div className="dc-body">
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 44, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        onChange={toggleAllStpRows}
                        checked={stpData.length > 0 && selectedStpIds.length === stpData.length}
                        style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }}
                      />
                    </th>
                    <th>No.</th>
                    <th>From Area</th>
                    <th>To Area</th>
                    <th>Type</th>
                    <th>Distance</th>
                    <th>Frequency</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: 40 }}>
                        <Loader2 size={20} style={{ animation: "dc-spin 1s linear infinite", color: "#3B82F6" }} />
                      </td>
                    </tr>
                  ) : stpData.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                        No STP data found.
                      </td>
                    </tr>
                  ) : (
                    stpData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={selectedStpIds.includes(item.id) ? "row-selected" : ""}
                        style={{ background: selectedStpIds.includes(item.id) ? "rgba(59, 130, 246, 0.05)" : undefined }}
                      >
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedStpIds.includes(item.id)}
                            onChange={() => toggleStpRow(item.id)}
                            style={{ width: 14, height: 14, accentColor: "#3B82F6", cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ color: "#64748b" }}>{index + 1}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>
                          {item.fromArea?.name || item.fromArea?.areaName || item.fromAreaName || "—"}
                        </td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>
                          {item.toArea?.name || item.toArea?.areaName || item.toAreaName || "—"}
                        </td>
                        <td>{item.areaType || item.type || "—"}</td>
                        <td>{item.distance}</td>
                        <td>{item.frequencyVisit}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleEditClick(item)}
                            style={{ border: "none", background: "none", cursor: "pointer", color: "#2563eb", padding: "5px", borderRadius: 6, display: "inline-flex", alignItems: "center" }}
                          >
                            <Edit2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete footer */}
          <div className="dc-footer" style={{ justifyContent: "flex-start" }}>
            <button
              type="button"
              onClick={handleDeleteStp}
              disabled={selectedStpIds.length === 0 || isSubmitting}
              className="dc-delete-footer-btn"
            >
              {isSubmitting
                ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} />
                : <Trash2 size={14} />
              }
              Delete Selected ({selectedStpIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
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

// ═══════════════════════════════════════════════════════════════════
// FInput — floating label text input
// ═══════════════════════════════════════════════════════════════════
function FInput({ label, name, type = "text", value, onChange, disabled }) {
  const [focus, setFocus] = useState(false);
  const hasVal = Boolean(value?.toString().trim());
  const active = focus || hasVal;

  const borderColor = focus ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : focus ? "#eff6ff" : "#ffffff";
  const shadow  = focus && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = focus ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div className="dc-field-wrap">
      <div style={{ position: "relative", width: "100%", height: FH }}>
        <input
          type={type}
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder=" "
          style={{
            ...fieldBase,
            padding: "0 12px",
            background: bgColor + " !important",
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadow,
            color: disabled ? "#94a3b8" : "#1e293b",
          }}
        />
        <label
          style={{
            position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
            transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
            transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
            color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
            padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
          }}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FSelect Portal Dropdown (Bypasses any parent overflow/clipping bugs)
// ═══════════════════════════════════════════════════════════════════
function FSelect({ label, name, value, onChange, disabled, options = [] }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(!open);
  };

  const selected = options.find((o) => String(o.id) === String(value));
  const hasVal = Boolean(value);
  const active = open || hasVal;
  const borderColor = open ? "#3B82F6" : hasVal ? "#bfdbfe" : "#e2e8f0";
  const bgColor = disabled ? "#f8fafc" : open ? "#eff6ff" : "#ffffff";
  const shadow  = open && !disabled ? "0 0 0 3px rgba(59,130,246,0.15)" : "none";
  const labelColor = open ? "#3B82F6" : hasVal ? "#64748b" : "#94a3b8";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", userSelect: "none" }} className="dc-field-wrap">
      <div
        onClick={handleTriggerClick}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 36px 0 12px",
          fontSize: 13, display: "flex", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer", background: bgColor + " !important",
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
      <label
        style={{
          position: "absolute", left: 10, pointerEvents: "none", zIndex: 20,
          transition: "all 0.12s ease-out", fontWeight: 500, top: active ? "0" : "50%",
          transform: active ? "translateY(-50%)" : "translateY(-50%)", fontSize: active ? 11 : 13,
          color: disabled ? "#cbd5e1" : labelColor, background: active ? "#ffffff" : "transparent",
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
        }}
      >
        {label}
      </label>
      
      {open && !disabled && createPortal(
        <div style={{
          position: "absolute",
          top: coords.top + 4,
          left: coords.left,
          width: coords.width,
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04)",
          zIndex: 9999999,
          overflow: "hidden"
        }}>
          <ul style={{ maxHeight: "220px", overflowY: "auto", margin: 0, padding: "6px", listStyle: "none", backgroundColor: "#ffffff" }}>
            {options.length === 0 && <li style={{ padding: "12px", fontSize: "12px", color: "#94a3b8", fontStyle: "italic", backgroundColor: "#ffffff" }}>No options available</li>}
            {options.map((opt) => (
              <li
                key={opt.id}
                className={`dc-opt${String(value) === String(opt.id) ? " selected" : ""}`}
                style={{
                  padding: "10px 14px",
                  fontSize: "13.5px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: String(value) === String(opt.id) ? "#2563eb" : "#475569",
                  backgroundColor: String(value) === String(opt.id) ? "rgba(59,130,246,0.08)" : "#ffffff",
                  fontWeight: String(value) === String(opt.id) ? "600" : "500"
                }}
                onMouseDown={(e) => { 
                  e.preventDefault(); 
                  onChange({ target: { name, value: String(opt.id) } }); 
                  setOpen(false); 
                }}
              >
                {String(value) === String(opt.id) && <Check size={12} style={{ color: "#3B82F6", flexShrink: 0 }} />}
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