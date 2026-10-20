// MGViewDoctorChemist.jsx
import React, { useState, useEffect } from "react";
import {
  Loader2,
  AlertCircle,
  Search,
  Check,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import api from "../../../../services/api";

/* ─── Static Options ──────────────────────────────────────────────────────── */
const REPORT_TYPE_OPTIONS = [
  { id: "doctor", label: "Doctor" },
  { id: "chemist", label: "Chemist" },
  { id: "stockist", label: "Stockist" },
];

const CATEGORY_OPTIONS = [
  { id: "A", label: "A" },
  { id: "A+", label: "A+" },
  { id: "B", label: "B" },
  { id: "B+", label: "B+" },
  { id: "C", label: "C" },
  { id: "Core", label: "Core" },
  { id: "SuperCore", label: "SuperCore" },
];

/* ─── Design System – blue theme ───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  .mgvc-wrap { font-family:'Inter',sans-serif; width:100%; padding-bottom:32px; }
  .dc-card { background:#fff !important; border:1px solid #edf2f7; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.03); margin-bottom:24px; overflow:visible !important; }
  .dc-header { padding:24px 28px 16px; background:#fff !important; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; border-radius:16px 16px 0 0 !important; }
  .dc-page-icon { width:34px; height:34px; border-radius:8px; background:linear-gradient(135deg,#2563eb,#1d4ed8); display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(37,99,235,0.25); }
  .dc-body { padding:20px 28px 24px; background:#fff !important; border-bottom-left-radius:16px; border-bottom-right-radius:16px; }
  .dc-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:18px 16px; align-items:end; margin-bottom:16px; }
  @media(max-width:1200px){ .dc-grid-4{grid-template-columns:repeat(3,1fr);} }
  @media(max-width:900px){ .dc-grid-4{grid-template-columns:repeat(2,1fr); gap:20px;} }
  @media(max-width:640px){ .dc-grid-4{grid-template-columns:1fr; gap:20px;} .dc-body{padding:20px 16px;} .dc-header{padding:20px 16px 12px;} }
  .dc-radio-group { display:flex; align-items:center; gap:20px; margin-bottom:20px; padding:12px 20px; background:#f8fafc; border-radius:10px; border:1px solid #edf2f7; }
  .dc-radio-label { display:flex; align-items:center; gap:8px; cursor:pointer; font-size:13.5px; font-weight:500; }
  .dc-radio-label.disabled { cursor:not-allowed; opacity:0.5; }
  .dc-submit-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 24px; border-radius:8px; font-size:14px; font-weight:600; border:none; cursor:pointer; background:#2563eb !important; color:#fff !important; box-shadow:0 4px 14px rgba(37,99,235,0.3); transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif; height:40px; justify-content:center; width:100%; }
  .dc-submit-btn:hover:not(:disabled){ background:#1d4ed8 !important; transform:translateY(-1px); }
  .dc-submit-btn:disabled{ background:#e2e8f0 !important; color:#94a3b8 !important; cursor:not-allowed; box-shadow:none; }
  .ucr-table-container { border:1px solid #edf2f7; border-radius:12px; overflow-x:auto; background:#fff !important; box-shadow:0 2px 12px rgba(0,0,0,0.01); margin-bottom:16px; }
  .ucr-table { width:100%; border-collapse:collapse; font-size:13px; text-align:left; min-width:1200px; }
  .ucr-table thead { background:#2563eb; }
  .ucr-table th { padding:14px 16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#fff; border-bottom:1px solid #1d4ed8; border-right:1px solid rgba(255,255,255,0.15); white-space:nowrap; }
  .ucr-table th:last-child{border-right:none;}
  .ucr-table td { padding:12px 16px; color:#374151; border-bottom:1px solid #edf2f7; border-right:1px solid #edf2f7; font-weight:500; }
  .ucr-table td:last-child{border-right:none;}
  .ucr-table tbody tr:hover{background:#f8fafc;}
  .dc-pagination-btn { background:#cccccc; color:#fff; border:none; border-radius:6px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.2s; }
  .dc-pagination-btn:hover:not(:disabled){background:#b3b3b3;}
  .dc-pagination-btn:disabled{background:#e5e7eb;color:#9ca3af;cursor:not-allowed;}
  .ucr-field-wrap { display:flex; flex-direction:column; gap:4px; position:relative; }
`;

export default function MGViewDoctorChemist() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [geoMode, setGeoMode] = useState("hierarchical");
  const [selectedState, setSelectedState] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedHeadquarter, setSelectedHeadquarter] = useState("");
  const [reportTypes, setReportTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 20;

  const [imageModal, setImageModal] = useState({ open: false, row: null });

  const isSubmitDisabled = reportTypes.length === 0 || (geoMode === "hierarchical" && !selectedState);

  const handleGenerate = async () => {
    if (isSubmitDisabled) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        geoMode,
        state: selectedState,
        area: selectedArea,
        headquarter: selectedHeadquarter,
        types: reportTypes.map(t => t.id).join(","),
        categories: categories.map(c => c.id).join(","),
      };
      const resp = await api.fetchDoctorChemistStockistReport(params);
      setTableData(resp.data || []);
      setShowTable(true);
      setPage(1);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const filtered = tableData.filter(row => {
    const s = search.toLowerCase();
    return (
      row.employeeName?.toLowerCase().includes(s) ||
      row.providerName?.toLowerCase().includes(s) ||
      row.state?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openImageModal = row => setImageModal({ open: true, row });
  const closeImageModal = () => setImageModal({ open: false, row: null });

  return (
    <div className="mgvc-wrap">
      <style>{STYLES}</style>
      <div className="dc-card">
        <div className="dc-header">
          <div className="dc-page-icon"><FileSpreadsheet size={20} /></div>
          <h2 className="ucr-brand" style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
            View Doctor / Chemist / Stockist Report
          </h2>
        </div>
        <div className="dc-body">
          <div className="dc-radio-group">
            <label className="dc-radio-label disabled">
              <input type="radio" name="geoMode" value="geographical" disabled />
              <span>Geographical</span>
            </label>
            <label className="dc-radio-label">
              <input
                type="radio"
                name="geoMode"
                value="hierarchical"
                checked={geoMode === "hierarchical"}
                onChange={() => setGeoMode("hierarchical")}
              />
              <span>Hierarchical</span>
            </label>
          </div>
          <div className="dc-grid-4">
            <div>
              <SingleDropdown label="SELECT STATE" value={selectedState} onSelect={setSelectedState} options={[]} />
            </div>
            <div>
              <SingleDropdown label="SELECT AREA" value={selectedArea} onSelect={setSelectedArea} options={[]} />
            </div>
            <div>
              <SingleDropdown label="SELECT HEADQUARTER" value={selectedHeadquarter} onSelect={setSelectedHeadquarter} options={[]} />
            </div>
            <div>
              <MultiDropdown label="REPORT TYPE" selected={reportTypes} onSelect={setReportTypes} options={REPORT_TYPE_OPTIONS} />
            </div>
            {reportTypes.some(rt => rt.id === "doctor") && (
              <div style={{ gridColumn: "span 4" }}>
                <MultiDropdown label="DOCTOR CATEGORY" selected={categories} onSelect={setCategories} options={CATEGORY_OPTIONS} />
              </div>
            )}
          </div>
          <div style={{ marginTop: 6 }}>
            <button type="button" onClick={handleGenerate} disabled={isSubmitDisabled} className="dc-submit-btn" style={{ background: isSubmitDisabled ? "#e2e8f0" : "#2563eb", color: isSubmitDisabled ? "#94a3b8" : "#fff" }}>
              {loading ? (
                <Loader2 size={14} style={{ color: "#2563eb", animation: "ucr-spin 1s linear infinite" }} />
              ) : (
                <Check size={14} />
              )}
              Generate Report
            </button>
          </div>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: "#ef4444", marginTop: 12 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      </div>

      {showTable && (
        <div className="dc-card" style={{ marginTop: 24 }}>
          <div className="dc-header" style={{ background: "#f8fafc", borderBottom: "1px solid #edf2f7" }}>
            <h2 className="ucr-brand" style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Report Results</h2>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>( {filtered.length} records )</span>
          </div>
          <div className="dc-body">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ height: 36, padding: "0 12px 0 32px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 12, color: "#111827", outline: "none", width: 180, fontWeight: 600, background: "#fff" }} />
            </div>
            <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
              <table className="ucr-table">
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: "center" }}>#</th>
                    <th>State Name</th>
                    <th>Headquarter</th>
                    <th>Area</th>
                    <th>Employee Name</th>
                    <th>Provider Name</th>
                    <th>Contact No.</th>
                    <th>Provider Code</th>
                    <th>Provider Type</th>
                    <th>Date of Birth</th>
                    <th>Date of Anniversary</th>
                    <th>Degree</th>
                    <th>Specialization</th>
                    <th>Category</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Frequency Visit</th>
                    <th>Focus Products</th>
                    <th>Products Already Using</th>
                    <th>Pan Card Uploaded</th>
                    <th>Visit Card Uploaded</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, idx) => {
                    const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                    return (
                      <tr key={idx}>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{globalIdx}</td>
                        <td>{row.state || "—"}</td>
                        <td>{row.headquarter || "—"}</td>
                        <td>{row.area || "—"}</td>
                        <td style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => openImageModal(row)}>{row.employeeName || "—"}</td>
                        <td>{row.providerName || "—"}</td>
                        <td>{row.contactNo || "—"}</td>
                        <td>{row.providerCode || "—"}</td>
                        <td>{row.providerType || "—"}</td>
                        <td>{row.dob || "—"}</td>
                        <td>{row.anniversary || "—"}</td>
                        <td>{row.degree || "—"}</td>
                        <td>{row.specialization || "—"}</td>
                        <td>{row.category || "—"}</td>
                        <td>{row.city || "—"}</td>
                        <td>{row.address || "—"}</td>
                        <td>{row.phone || "—"}</td>
                        <td>{row.email || "—"}</td>
                        <td>{row.frequencyVisit || "—"}</td>
                        <td>{row.focusProducts || "—"}</td>
                        <td>{row.productsUsing || "—"}</td>
                        <td>{row.panCardUploaded || "—"}</td>
                        <td>{row.visitCardUploaded || "—"}</td>
                        <td><button style={{ background: "none", border: "none", cursor: "pointer" }}><FileSpreadsheet size={14} /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button disabled={page === 1} onClick={() => setPage(1)} className="dc-pagination-btn">First</button>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="dc-pagination-btn" style={{ padding: "8px 12px" }}><ChevronLeft size={13} /></button>
                <span style={{ padding: "0 12px", fontSize: 12, fontWeight: 700, color: "#2563eb" }}>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="dc-pagination-btn" style={{ padding: "8px 12px" }}><ChevronRight size={13} /></button>
                <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="dc-pagination-btn">Last</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {imageModal.open && (
        <Modal onClose={closeImageModal} title="Upload Images">
          <div style={{ display: "grid", gap: 16 }}>
            <div><label>Image 1</label><input type="file" accept="image/*" /></div>
            <div><label>Image 2</label><input type="file" accept="image/*" /></div>
            <div><label>Image 3</label><input type="file" accept="image/*" /></div>
            {geoMode === "headquarter" && (
              <div><label>District Image</label><input type="file" accept="image/*" /></div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Helper Components ──────────────────────────────────────────────────── */

function SingleDropdown({ label, value, onSelect, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => String(o.id) === String(value));
  const hasVal = value !== "" && value !== null && value !== undefined;
  const active = open || hasVal;

  return (
    <div ref={ref} className="ucr-field-wrap" style={{ position: "relative", width: "100%", marginTop: 8 }}>
      <div onClick={() => !disabled && setOpen(p => !p)} style={{
        width: "100%", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px", border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db", borderRadius: 8,
        background: disabled ? "#f9fafb" : "#fff", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s"
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: hasVal ? "#111827" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected ? selected.label : ""}
        </span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </div>
      <label style={{
        position: "absolute", left: 10, top: active ? -8 : 10, fontSize: active ? 10 : 13, fontWeight: active ? 700 : 500,
        color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af", background: active ? "#fff" : "transparent",
        padding: active ? "0 4px" : "0", transition: "all 0.2s", textTransform: active ? "uppercase" : "none", letterSpacing: active ? "0.05em" : "normal"
      }}>{label}</label>
      {open && !disabled && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff",
          border: "1.5px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, maxHeight: 200, overflowY: "auto"
        }}>
          {options.length === 0 ? <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div> :
            options.map(o => {
              const id = String(o.id);
              const isSel = id === String(value);
              return (
                <div key={id} onClick={() => { onSelect(id); setOpen(false); }}
                  style={{
                    padding: "9px 12px", cursor: "pointer", fontSize: 13, fontWeight: isSel ? 700 : 500,
                    color: isSel ? "#2563eb" : "#374151", background: isSel ? "#eff6ff" : "transparent",
                    display: "flex", alignItems: "center", gap: 8
                  }}>
                  {isSel && <Check size={13} style={{ color: "#2563eb" }} />}
                  {o.label}
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

function MultiDropdown({ label, selected = [], onSelect, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (option) => {
    const isSel = selected.some(s => String(s.id) === String(option.id));
    if (isSel) {
      onSelect(selected.filter(s => String(s.id) !== String(option.id)));
    } else {
      onSelect([...selected, option]);
    }
  };

  const selectedLabels = selected.map(o => o.label).join(", ");
  const hasVal = selected.length > 0;
  const active = open || hasVal;

  return (
    <div ref={ref} className="ucr-field-wrap" style={{ position: "relative", width: "100%", marginTop: 8 }}>
      <div onClick={() => !disabled && setOpen(p => !p)} style={{
        width: "100%", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px", border: open ? "1.5px solid #2563eb" : "1.5px solid #d1d5db", borderRadius: 8,
        background: disabled ? "#f9fafb" : "#fff", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s"
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: hasVal ? "#111827" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>
          {selectedLabels || ""}
        </span>
        <ChevronDown size={15} style={{ color: open ? "#2563eb" : "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </div>
      <label style={{
        position: "absolute", left: 10, top: active ? -8 : 10, fontSize: active ? 10 : 13, fontWeight: active ? 700 : 500,
        color: open ? "#2563eb" : active ? "#6b7280" : "#9ca3af", background: active ? "#fff" : "transparent",
        padding: active ? "0 4px" : "0", transition: "all 0.2s", textTransform: active ? "uppercase" : "none", letterSpacing: active ? "0.05em" : "normal"
      }}>{label}</label>
      {open && !disabled && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff",
          border: "1.5px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 4, maxHeight: 200, overflowY: "auto"
        }}>
          {options.length === 0 ? <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No options</div> :
            options.map(o => {
              const id = String(o.id);
              const isSel = selected.some(s => String(s.id) === id);
              return (
                <div key={id} onClick={e => { e.stopPropagation(); toggle(o); }}
                  style={{
                    padding: "9px 12px", cursor: "pointer", fontSize: 13, fontWeight: isSel ? 700 : 500,
                    color: isSel ? "#2563eb" : "#374151", background: isSel ? "#eff6ff" : "transparent",
                    display: "flex", alignItems: "center", gap: 8
                  }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: 3, border: isSel ? "none" : "1.5px solid #cbd5e1",
                    background: isSel ? "#2563eb" : "#fff", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {isSel && <Check size={10} style={{ color: "#fff", strokeWidth: 3 }} />}
                  </span>
                  {o.label}
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100000,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        width: 450,
        maxWidth: "90%",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #edf2f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "#94a3b8",
            padding: 4
          }}>&times;</button>
        </div>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

