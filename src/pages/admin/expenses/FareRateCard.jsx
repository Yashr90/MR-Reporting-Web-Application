import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  Edit2,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  Check
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
  .ucr-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 16px; }

  .col-span-2 { grid-column: span 2; }
  .col-span-4 { grid-column: span 4; }

  @media(max-width: 1200px) {
    .ucr-grid, .ucr-grid-4 { grid-template-columns: repeat(3, 1fr); }
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

  /* ── Premium Table Container with Clean Spacing ── */
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
  
  /* Compact Vertical Height Spacing */
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

const FH = 40;

const ALLOWANCE_OPTIONS = [
  { value: "KM Wise", label: "KM Wise" },
  { value: "Lumsum", label: "Lumsum" },
];
const APPLICABLE_OPTIONS = [
  { value: "hq", label: "HQ" },
  { value: "ex", label: "EX" },
];

function createEmptyRule() {
  return {
    localId: `${Date.now()}-${Math.random()}`,
    fromDistance: "",
    toDistance: "",
    allowanceType: "",
    applicableTo: "",
    fare: "",
    frcCode: "",
    description: "",
  };
}

function normalizeDesignation(option) {
  return {
    id: String(option?.id ?? option?.designationId ?? option?.value ?? "").trim(),
    name: String(
      option?.name ??
        option?.designation_name ??
        option?.designationName ??
        option?.label ??
        "Unknown"
    ).trim(),
  };
}

function normalizeFrcRecord(item, index = 0) {
  const designationId =
    item?.designationId ??
    item?.designation?.id ??
    item?.designation_id ??
    item?.designationCode ??
    "";

  const designationName =
    item?.designationName ??
    item?.designation?.name ??
    item?.designation?.designation_name ??
    item?.designation_name ??
    item?.name ??
    "-";

  return {
    id: item?.id ?? item?.frcId ?? item?._id ?? `frc-${index}`,
    designationId: String(designationId ?? ""),
    designationName: String(designationName ?? "-").trim() || "-",
    fromDistance: item?.fromDistance ?? item?.from_distance ?? "",
    toDistance: item?.toDistance ?? item?.to_distance ?? "",
    allowanceType:
      item?.allowanceType ?? item?.allowance_to_be_get ?? item?.allowance ?? "",
    applicableTo: item?.applicableTo ?? item?.applicable_to ?? "",
    fare: item?.fare ?? item?.taPerKm ?? item?.ta_per_km ?? "",
    description: item?.description ?? "",
    frcCode: item?.frcCode ?? item?.frc_code ?? "",
  };
}

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

export default function FareRateCard() {
  const [designations, setDesignations] = useState([]);
  const [selectedDesignationIds, setSelectedDesignationIds] = useState([]);
  const [rules, setRules] = useState([createEmptyRule()]);

  const [records, setRecords] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const [searchQuery, setSearchQuery] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const clearNotifications = () => {
    setError("");
  };

  const fetchDesignations = useCallback(async () => {
    try {
      const response = await api.get("/api/expense/frc/designations");
      const payload = response?.data?.data ?? response?.data ?? [];
      const normalized = Array.isArray(payload)
        ? payload
            .map(normalizeDesignation)
            .filter((item) => item.id && item.name)
        : [];
      setDesignations(normalized);
    } catch (error) {
      try {
        const fallbackResponse = await api.get("/api/masters/designations");
        const fallbackPayload =
          fallbackResponse?.data?.data ?? fallbackResponse?.data ?? [];
        const normalizedFallback = Array.isArray(fallbackPayload)
          ? fallbackPayload
              .map(normalizeDesignation)
              .filter((item) => item.id && item.name)
          : [];
        setDesignations(normalizedFallback);
      } catch (err) {
        setError("Failed to load designation list.");
      }
    }
  }, []);

  const fetchFrcRecords = useCallback(async ({ revealTable = false } = {}) => {
    setIsTableLoading(true);
    try {
      const response = await api.get("/api/expense/frc");
      const payload = response?.data?.data ?? response?.data ?? [];
      const normalized = Array.isArray(payload)
        ? payload.map((item, index) => normalizeFrcRecord(item, index))
        : [];
      setRecords(normalized);

      if (revealTable || normalized.length > 0) {
        setShowTable(true);
      }
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load Fare Rate Card records."));
    } finally {
      setIsTableLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      setIsLoadingInitial(true);
      clearNotifications();
      await Promise.all([fetchDesignations(), fetchFrcRecords()]);
      if (isMounted) {
        setIsLoadingInitial(false);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [fetchDesignations, fetchFrcRecords]);

  const selectedDesignationNames = useMemo(() => {
    const selected = new Set(selectedDesignationIds);
    return designations
      .filter((designation) => selected.has(designation.id))
      .map((designation) => designation.name);
  }, [designations, selectedDesignationIds]);

  const updateRule = useCallback((localId, key, value) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.localId === localId
          ? {
              ...rule,
              [key]: value,
            }
          : rule
      )
    );
  }, []);

  const addRule = () => {
    setRules((prev) => [...prev, createEmptyRule()]);
  };

  const removeRule = (localId) => {
    setRules((prev) => prev.filter((rule) => rule.localId !== localId));
  };

  const validateRules = () => {
    if (selectedDesignationIds.length === 0) {
      return "Please select at least one designation.";
    }

    if (rules.length === 0) {
      return "Please add at least one Fare Rate Designation card.";
    }

    for (let index = 0; index < rules.length; index += 1) {
      const rule = rules[index];
      const rowNo = index + 1;

      const isMissingRequiredField =
        !rule.fromDistance ||
        !rule.toDistance ||
        !rule.allowanceType ||
        !rule.applicableTo ||
        !rule.fare ||
        !rule.frcCode ||
        !rule.description;

      if (isMissingRequiredField) {
        return `Please fill all fields in Fare Rate Designation #${rowNo}.`;
      }

      const fromDistance = Number(rule.fromDistance);
      const toDistance = Number(rule.toDistance);
      const fare = Number(rule.fare);

      if (Number.isNaN(fromDistance) || Number.isNaN(toDistance) || Number.isNaN(fare)) {
        return `Distance and fare should be valid numbers in row #${rowNo}.`;
      }

      if (fromDistance < 0 || toDistance < 0 || fare < 0) {
        return `Negative values are not allowed in row #${rowNo}.`;
      }

      if (fromDistance > toDistance) {
        return `From distance must be less than or equal to To distance in row #${rowNo}.`;
      }
    }

    return "";
  };

  const handleCreateFrc = async () => {
    clearNotifications();
    const validationMessage = validateRules();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const rowsPayload = rules.map((rule) => ({
        fromDistance: Number(rule.fromDistance),
        toDistance: Number(rule.toDistance),
        allowanceType: rule.allowanceType,
        applicableTo: rule.applicableTo,
        fare: Number(rule.fare),
        frcCode: rule.frcCode.trim(),
        description: rule.description.trim(),
      }));

      const payload = {
        designationIds: selectedDesignationIds.map((id) => Number(id)),
        rows: rowsPayload,
      };

      await api.post("/api/expense/frc", payload);

      setPopup({ isOpen: true, message: "Fare Rate Card created successfully." });
      setRules([createEmptyRule()]);
      setSelectedDesignationIds([]);
      setShowTable(true);
      await fetchFrcRecords({ revealTable: true });
    } catch (error) {
      setError(getErrorMessage(error, "Failed to create Fare Rate Card."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (record) => {
    setEditingRecord({ ...record });
    setIsEditModalOpen(true);
    clearNotifications();
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord?.id) {
      setError("Record id is missing. Cannot update this row.");
      return;
    }

    const requiredFieldsMissing =
      !editingRecord.fromDistance ||
      !editingRecord.toDistance ||
      !editingRecord.allowanceType ||
      !editingRecord.applicableTo ||
      !editingRecord.fare ||
      !editingRecord.frcCode ||
      !editingRecord.description;

    if (requiredFieldsMissing) {
      setError("Please fill all fields before updating.");
      return;
    }

    const fromDistance = Number(editingRecord.fromDistance);
    const toDistance = Number(editingRecord.toDistance);
    const fare = Number(editingRecord.fare);

    if (Number.isNaN(fromDistance) || Number.isNaN(toDistance) || Number.isNaN(fare)) {
      setError("Distance and fare should be valid numbers.");
      return;
    }

    if (fromDistance > toDistance) {
      setError("From distance must be less than or equal to To distance.");
      return;
    }

    setIsSubmitting(true);
    clearNotifications();

    try {
      const payload = {
        fromDistance,
        toDistance,
        allowanceType: editingRecord.allowanceType,
        applicableTo: editingRecord.applicableTo,
        fare,
        frcCode: editingRecord.frcCode.trim(),
        description: editingRecord.description.trim(),
      };

      await api.put(`/api/expense/frc/${editingRecord.id}`, payload);

      setPopup({ isOpen: true, message: "Fare Rate Card updated successfully." });
      setIsEditModalOpen(false);
      setEditingRecord(null);
      await fetchFrcRecords({ revealTable: true });
    } catch (error) {
      setError(getErrorMessage(error, "Failed to update Fare Rate Card."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecord = async (record) => {
    if (!record?.id) {
      setError("Record id is missing. Cannot delete this row.");
      return;
    }

    const shouldDelete = window.confirm("Delete this Fare Rate Card record?");
    if (!shouldDelete) {
      return;
    }

    clearNotifications();
    setIsSubmitting(true);

    try {
      await api.delete(`/api/expense/frc/${record.id}`);
      setPopup({ isOpen: true, message: "Fare Rate Card deleted successfully." });
      await fetchFrcRecords({ revealTable: true });
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete Fare Rate Card."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = useMemo(() => {
    const token = searchQuery.trim().toLowerCase();
    if (!token) {
      return records;
    }

    return records.filter((record) => {
      return (
        record.designationId.toLowerCase().includes(token) ||
        record.designationName.toLowerCase().includes(token) ||
        String(record.fromDistance).toLowerCase().includes(token) ||
        String(record.toDistance).toLowerCase().includes(token) ||
        String(record.allowanceType).toLowerCase().includes(token) ||
        String(record.applicableTo).toLowerCase().includes(token) ||
        String(record.fare).toLowerCase().includes(token) ||
        String(record.frcCode).toLowerCase().includes(token) ||
        String(record.description).toLowerCase().includes(token)
      );
    });
  }, [records, searchQuery]);

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
              <Briefcase size={16} color="#fff" />
            </div>
            <div>
              <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Fare Rate Card Designation</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Create multiple fare slabs and map them to one or more designations</p>
            </div>
          </div>
        </div>

        <div className="dc-body">
          <div className="ucr-grid" style={{ marginBottom: 32 }}>
            <MultiSelectDropdown
              label="Select Designation"
              options={designations.map((designation) => ({
                value: designation.id,
                label: designation.name,
              }))}
              selectedValues={selectedDesignationIds}
              onChange={setSelectedDesignationIds}
              disabled={isLoadingInitial}
            />
            <div className="col-span-2" style={{ display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", margin: 0 }}>
                Selected: {selectedDesignationNames.length > 0 ? selectedDesignationNames.join(", ") : "None"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {rules.map((rule, index) => (
              <div
                key={rule.localId}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #edf2f7",
                  borderRadius: 12,
                  padding: "24px 20px 20px 20px",
                  position: "relative",
                  overflow: "visible"
                }}
              >
                <div className="ucr-brand" style={{
                  position: "absolute", top: -10, left: 16, background: "#fff", border: "1px solid #edf2f7",
                  padding: "2px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.02em"
                }}>
                  Fare Rate Designation #{index + 1}
                </div>

                {rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(rule.localId)}
                    style={{
                      position: "absolute", right: 12, top: 12, width: 30, height: 30, borderRadius: 8,
                      border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                    title="Delete this card"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                {/* Unified Continuous Row Layout Grid */}
                <div className="ucr-grid-4" style={{ marginBottom: 0, marginTop: rules.length > 1 ? 8 : 0 }}>
                  <FloatingInput
                    label="From Distance (KM)"
                    type="number"
                    value={rule.fromDistance}
                    onChange={(event) => updateRule(rule.localId, "fromDistance", event.target.value)}
                  />

                  <FloatingInput
                    label="To Distance (KM)"
                    type="number"
                    value={rule.toDistance}
                    onChange={(event) => updateRule(rule.localId, "toDistance", event.target.value)}
                  />

                  <FloatingDropdown
                    label="Allowance Type"
                    options={ALLOWANCE_OPTIONS}
                    value={rule.allowanceType}
                    onSelect={(value) => updateRule(rule.localId, "allowanceType", value)}
                  />

                  <FloatingDropdown
                    label="Select Applicable To"
                    options={APPLICABLE_OPTIONS}
                    value={rule.applicableTo}
                    onSelect={(value) => updateRule(rule.localId, "applicableTo", value)}
                  />

                  <FloatingInput
                    label="Enter TA Per KM"
                    type="number"
                    value={rule.fare}
                    onChange={(event) => updateRule(rule.localId, "fare", event.target.value)}
                  />

                  <FloatingInput
                    label="Enter FRC Code"
                    value={rule.frcCode}
                    onChange={(event) => updateRule(rule.localId, "frcCode", event.target.value)}
                  />

                  <div className="col-span-2">
                    <FloatingTextarea
                      label="Enter Description"
                      value={rule.description}
                      onChange={(event) => updateRule(rule.localId, "description", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dc-footer" style={{ justifyContent: "flex-start", gap: 12 }}>
          <button
            type="button"
            onClick={addRule}
            style={{
              width: 40, height: 40, borderRadius: "50%", background: "#fff", border: "1px solid #bfdbfe",
              color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
            }}
            title="Add one more Fare Rate Designation"
          >
            <Plus size={20} />
          </button>

          <button
            type="button"
            onClick={handleCreateFrc}
            disabled={isSubmitting || isLoadingInitial}
            className="dc-submit-btn"
            style={{ marginLeft: "auto" }}
          >
            {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={14} />}
            Create FRC
          </button>
        </div>
      </div>

      {/* Table Section */}
      {showTable && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>Fare Rate Card Entries</h1>
            <div style={{ position: "relative", width: 280, maxWidth: "100%" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search designation, code..."
                style={{
                  width: "100%", height: 40, borderRadius: 8, border: "1px solid #e2e8f0",
                  padding: "0 32px 0 12px", fontSize: 13, outline: "none", color: "#1e293b", background: "#fff"
                }}
              />
              <Search size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            </div>
          </div>

          <div className="dc-body" style={{ padding: "20px 28px 24px" }}>
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Designation</th>
                    <th>Name</th>
                    <th>From Distance</th>
                    <th>To Distance</th>
                    <th>Allowance To Be Get</th>
                    <th>Applicable To</th>
                    <th>Fare</th>
                    <th>Description</th>
                    <th>FRC Code</th>
                    <th style={{ textAlign: "center" }}>Edit / Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {isTableLoading ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", padding: 40 }}>
                        <Loader2 style={{ animation: "dc-spin 1s linear infinite", margin: "0 auto", color: "#3B82F6" }} size={20} />
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>
                        No fare rate card data found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record, index) => (
                      <tr key={record.id}>
                        <td style={{ color: "#64748b" }}>{index + 1}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{record.designationId || "-"}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{record.designationName || "-"}</td>
                        <td>{record.fromDistance}</td>
                        <td>{record.toDistance}</td>
                        <td>{record.allowanceType}</td>
                        <td style={{ color: "#2563eb", fontWeight: 700, textTransform: "uppercase" }}>{record.applicableTo}</td>
                        <td style={{ fontWeight: 700, color: "#1e293b" }}>{record.fare}</td>
                        <td style={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}>{record.description || "-"}</td>
                        <td style={{ fontWeight: 600 }}>{record.frcCode}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(record)}
                              style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 4 }}
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(record)}
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
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingRecord && createPortal(
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
                <h1 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Edit Fare Rate Card</h1>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingRecord(null);
                }}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="dc-body" style={{ overflowY: "auto", flex: 1, padding: "20px 28px 24px" }}>
              <div className="ucr-grid-4" style={{ marginBottom: 0 }}>
                <div className="col-span-2">
                  <FloatingInput
                    label="Designation Name"
                    value={editingRecord.designationName}
                    onChange={(event) =>
                      setEditingRecord((prev) => ({ ...prev, designationName: event.target.value }))
                    }
                    disabled
                  />
                </div>

                <FloatingInput
                  label="From Distance (KM) *"
                  type="number"
                  value={editingRecord.fromDistance}
                  onChange={(event) =>
                    setEditingRecord((prev) => ({ ...prev, fromDistance: event.target.value }))
                  }
                />

                <FloatingInput
                  label="To Distance (KM) *"
                  type="number"
                  value={editingRecord.toDistance}
                  onChange={(event) =>
                    setEditingRecord((prev) => ({ ...prev, toDistance: event.target.value }))
                  }
                />

                <FloatingDropdown
                  label="Allowance Type *"
                  options={ALLOWANCE_OPTIONS}
                  value={editingRecord.allowanceType}
                  onSelect={(value) =>
                    setEditingRecord((prev) => ({ ...prev, allowanceType: value }))
                  }
                />

                <FloatingDropdown
                  label="Select Applicable To *"
                  options={APPLICABLE_OPTIONS}
                  value={editingRecord.applicableTo}
                  onSelect={(value) =>
                    setEditingRecord((prev) => ({ ...prev, applicableTo: value }))
                  }
                />

                <FloatingInput
                  label="Enter TA Per KM *"
                  type="number"
                  value={editingRecord.fare}
                  onChange={(event) =>
                    setEditingRecord((prev) => ({ ...prev, fare: event.target.value }))
                  }
                />

                <FloatingInput
                  label="Enter FRC Code *"
                  value={editingRecord.frcCode}
                  onChange={(event) =>
                    setEditingRecord((prev) => ({ ...prev, frcCode: event.target.value }))
                  }
                />

                <div className="col-span-4">
                  <FloatingTextarea
                    label="Enter Description *"
                    value={editingRecord.description}
                    onChange={(event) =>
                      setEditingRecord((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="dc-footer" style={{ gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingRecord(null);
                }}
                className="dc-delete-footer-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateRecord}
                disabled={isSubmitting}
                className="dc-submit-btn"
              >
                {isSubmitting ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Save size={14} />}
                Update Changes
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
          padding: active ? "0 5px" : "0", letterSpacing: active ? "0.02em" : "0",
        }}
      >
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({ label, value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== "" && value !== null && value !== undefined;
  const active = hasValue || isFocused;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <textarea
        value={value ?? ""}
        onChange={onChange}
        rows={2}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%", minHeight: FH, borderRadius: 8, padding: "12px", fontSize: 13,
          border: `1.5px solid ${isFocused ? "#3B82F6" : hasValue ? "#bfdbfe" : "#e2e8f0"}`, outline: "none",
          fontWeight: 500, color: "#1e293b", background: isFocused ? "#eff6ff" : "#fff",
          boxShadow: isFocused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
          transition: "all 0.18s ease-in-out", resize: "vertical", fontFamily: "inherit"
        }}
      />
      <label
        style={{
          position: "absolute", left: 10, top: active ? 0 : "50%", transform: "translateY(-50%)", fontSize: active ? 11 : 13,
          fontWeight: 500, color: isFocused ? "#3B82F6" : hasValue ? "#64748b" : "#94a3b8", background: active ? "#fff" : "transparent",
          padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none"
        }}
      >
        {label}
      </label>
    </div>
  );
}

// ─── Searchable Portal Configuration Dropdown Component ───
function FloatingDropdown({ label, options, value, onSelect, disabled = false }) {
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
          padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none"
        }}
      >
        {label}
      </label>

      {isOpen && !disabled && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No options available</li>
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
                  onMouseDown={(e) => { e.preventDefault(); onSelect(opt.value); setIsOpen(false); }}
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

// ─── MultiSelectDropdown ───
function MultiSelectDropdown({ label, options, selectedValues, onChange, disabled = false }) {
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
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }
    onChange([...selectedValues, value]);
  };

  const selectAll = () => onChange(options.map((option) => option.value));
  const clearAll = () => onChange([]);

  const selectedLabel = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  const hasValue = selectedValues.length > 0;
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
        <span style={{ flex: 1, fontWeight: 500, color: hasValue ? "#1e293b" : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 14 }}>
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
          padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none"
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
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No designation available</li>
            ) : (
              options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <li
                    key={option.value}
                    className={`dc-opt${isSelected ? " selected" : ""}`}
                    style={{
                      padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "8px",
                      color: isSelected ? "#2563eb" : "#475569",
                      backgroundColor: isSelected ? "rgba(59,130,246,0.08)" : "#ffffff",
                      fontWeight: isSelected ? "600" : "500"
                    }}
                    onMouseDown={(e) => { e.preventDefault(); toggleValue(option.value); }}
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