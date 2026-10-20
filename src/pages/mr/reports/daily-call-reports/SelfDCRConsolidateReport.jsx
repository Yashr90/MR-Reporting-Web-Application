import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  Check,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  SlidersHorizontal,
} from "lucide-react";
import api from "../../../../services/api";

// ─── Global responsive styles (Exact match to Reference) ────────────────────
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  .ucr-wrap  { width:100%; padding-bottom:48px; font-family:Inter,sans-serif; }
  .ucr-card  { background:#fff; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,0.07); border:1px solid #f3f4f6; overflow:visible; margin-bottom: 24px; }
  .ucr-header{ padding:16px 20px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; gap:12px; }
  .ucr-body  { padding:24px; }
  .ucr-footer{ padding:14px 24px; background:#f9fafb; border-top:1px solid #f3f4f6; display:flex; align-items:center; justify-content:flex-end; border-radius:0 0 16px 16px; }
  .ucr-divider{ border:none; border-top:1px solid #f3f4f6; margin:0 0 24px; }

  /* 3 cols layout built over responsive specs */
  .ucr-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:28px; align-items: flex-end; }

  /* 2 cols tablet */
  @media(max-width:1024px){
    .ucr-grid  { grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:20px; }
    .ucr-body  { padding:18px; }
    .ucr-footer{ padding:12px 18px; }
    .ucr-header{ padding:14px 18px; }
  }

  /* 1 col mobile */
  @media(max-width:600px){
    .ucr-grid  { grid-template-columns:1fr; gap:12px; margin-bottom:16px; }
    .ucr-body  { padding:14px; }
    .ucr-footer{ padding:12px 14px; }
    .ucr-header{ padding:12px 14px; }
    .ucr-submit-btn{ width:100%; justify-content:center; }
  }

  /* Table layout architecture derived from reference specs */
  .ucr-table-container {
    overflow-x: auto;
    background: #fff;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }
  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .ucr-table thead { background: #f9fafb; border-bottom: 1px solid #f3f4f6; }
  .ucr-table th { padding: 12px 16px; text-align: left; font-weight: 700; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; border-right: 1px solid #f3f4f6; }
  .ucr-table td { padding: 12px 16px; color: #374151; border-bottom: 1px solid #f3f4f6; white-space: nowrap; border-right: 1px solid #f3f4f6; font-weight: 600; }
  .ucr-table th:last-child, .ucr-table td:last-child { border-right: none; }

  @keyframes ucr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ucr-zoom { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  .dropdown-portal { animation: ucr-zoom 0.15s ease; }
`;

const FH = 36;
const BLUE = "#2563eb";
const PAGE_SIZES = [10, 20, 50];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt) ? d : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const triggerDownload = (blob, name) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
};

const SUMMARY_DATA = [];
const PROVIDER_DATA = [];
const VISIT_DATA = {};
const PRODUCT_DATA = {};

const getVisitData = (date, type) => VISIT_DATA[`${date}|${type}`] || [];
const getProductData = (date, type, idx) => PRODUCT_DATA[`${date}|${type}|${idx}`] || [];

const statusStyle = (s) => {
  if (s === "Working") return { color: "#16a34a", background: "#dcfce7", border: "1px solid #bbf7d0" };
  if (s === "Holiday") return { color: "#d97706", background: "#fef3c7", border: "1px solid #fcd34d" };
  if (s === "Leave") return { color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca" };
  return { color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe" };
};

export default function SelfDCRConsolidateReport() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validErr, setValidErr] = useState("");

  const [expandedSummaryId, setExpandedSummaryId] = useState(null);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const [sumPage, setSumPage] = useState(1);
  const [sumPageSize, setSumPageSize] = useState(10);
  const [sumSearch, setSumSearch] = useState("");

  const SUMMARY_COLS = [
    { key: "sNo", label: "#", center: true },
    { key: "headQuarter", label: "Head Quarter" },
    { key: "employeeCode", label: "Emp. Code", center: true },
    { key: "employeeName", label: "Employee Name" },
    { key: "managerName", label: "Manager Name" },
    { key: "designation", label: "Designation", center: true },
    { key: "mobile", label: "Mobile", center: true },
    { key: "lastDcr", label: "Last DCR", center: true },
    { key: "totalDcr", label: "Total DCR", center: true, drill: true },
    { key: "doctorCallCount", label: "Doctor Calls", center: true },
    { key: "doctorPob", label: "Doctor POB", center: true },
    { key: "chemistCallCount", label: "Chemist Calls", center: true },
    { key: "stockistCallCount", label: "Stockist Calls", center: true },
    { key: "totalCallCount", label: "Total Calls", center: true },
    { key: "doctorChemistPob", label: "Doc/Chem POB", center: true },
  ];

  const getAuth = useCallback(() => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  }), []);

  const filteredSum = SUMMARY_DATA.filter((r) =>
    !sumSearch || Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(sumSearch.toLowerCase()))
  );
  const pagedSum = filteredSum.slice((sumPage - 1) * sumPageSize, sumPage * sumPageSize);

  const handleView = async () => {
    const err = !fromDate ? "From Date is required!" : !toDate ? "To Date is required!" : fromDate > toDate ? "From Date cannot be after To Date." : "";
    if (err) {
      setValidErr(err);
      return;
    }
    setValidErr("");
    setLoading(true);
    setExpandedSummaryId(null);
    setExpandedVisit(null);
    setExpandedProduct(null);

    await new Promise((r) => setTimeout(r, 600));
    setShowTable(true);
    setLoading(false);
  };

  const handleExcel = () => {
    const cols = SUMMARY_COLS.filter((c) => c.key !== "sNo");
    const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const hdr = `<Row>${cols.map((c) => `<Cell><Data ss:Type="String">${esc(c.label)}</Data></Cell>`).join("")}</Row>`;
    const rows = filteredSum.map((r, i) => `<Row><Cell><Data ss:Type="Number">${i + 1}</Data></Cell>${cols.map((c) => `<Cell><Data ss:Type="String">${esc(c.key === "lastDcr" ? fmt(r[c.key]) : r[c.key])}</Data></Cell>`).join("")}</Row>`);
    const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="DCR Summary"><Table>${hdr}${rows.join("")}</Table></Worksheet></Workbook>`;
    triggerDownload(new Blob([xml], { type: "application/vnd.ms-excel" }), "SelfDCR_Summary.xls");
  };

  return (
    <div className="ucr-wrap">
      <style>{STYLES}</style>

      {/* FILTER CARD */}
      <div className="ucr-card">
        <div className="ucr-header" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SlidersHorizontal size={17} style={{ color: BLUE }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Self DCR Consolidate Report</h2>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0, marginTop: 2 }}>View and analyse your daily call reports by date range.</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.07em" }}>FILTER</span>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                width: 34, height: 18, borderRadius: 20, background: filterOpen ? BLUE : "#d1d5db",
                position: "relative", cursor: "pointer", border: "none", transition: "all 0.2s"
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 2, left: filterOpen ? 18 : 2, transition: "all 0.2s"
              }} />
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="ucr-body">
            <div className="ucr-grid">
              <div>
                <FloatingDatePicker label="From Date" value={fromDate} onChange={(v) => { setFromDate(v); setValidErr(""); }} />
              </div>
              <div>
                <FloatingDatePicker label="To Date" value={toDate} onChange={(v) => { setToDate(v); setValidErr(""); }} />
              </div>
              <div>
                <button
                  onClick={handleView}
                  disabled={loading}
                  className="ucr-submit-btn"
                  style={{
                    height: FH,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: (!fromDate || !toDate) ? "#e5e7eb" : BLUE,
                    color: (!fromDate || !toDate) ? "#9ca3af" : "#fff",
                    border: "none",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: (!fromDate || !toDate) ? "not-allowed" : "pointer",
                    boxShadow: (!fromDate || !toDate) ? "none" : "0 2px 8px rgba(37,99,235,0.25)",
                    transition: "all 0.15s",
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? <Loader2 size={14} style={{ animation: "ucr-spin 1s linear infinite" }} /> : <Check size={14} />}
                  View Status
                </button>
              </div>
            </div>
            {validErr && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 16px", color: "#dc2626", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={16} /> {validErr}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LEVEL-1: SUMMARY TABLE */}
      {showTable && (
        <div className="ucr-card" style={{ animation: "ucr-zoom 0.2s ease" }}>
          <SectionHeader
            title="Self DCR Summary"
            count={filteredSum.length}
            onExcel={handleExcel}
            search={sumSearch}
            onSearch={(v) => { setSumSearch(v); setSumPage(1); }}
          />
          <div className="ucr-body" style={{ padding: 0 }}>
            <div className="ucr-table-container">
              <table className="ucr-table">
                <thead>
                  <tr>
                    {SUMMARY_COLS.map((col) => (
                      <th key={col.key} style={{ textAlign: col.center ? "center" : "left" }}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedSum.length === 0 ? (
                    <tr><td colSpan={SUMMARY_COLS.length} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No data found.</td></tr>
                  ) : pagedSum.map((row, ri) => (
                    <React.Fragment key={row.id || ri}>
                      <tr>
                        {SUMMARY_COLS.map((col) => (
                          <td key={col.key} style={{ textAlign: col.center ? "center" : "left" }}>
                            {col.key === "sNo" ? (
                              <span style={{ color: "#6b7280" }}>{ri + 1 + (sumPage - 1) * sumPageSize}</span>
                            ) : col.key === "lastDcr" ? (
                              fmt(row[col.key])
                            ) : col.drill ? (
                              <button
                                onClick={() => setExpandedSummaryId((p) => (p === row.id ? null : row.id))}
                                style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}
                              >
                                {row[col.key] || 0}
                                {expandedSummaryId === row.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            ) : (
                              <span style={col.key === "employeeName" || col.key === "managerName" ? {fontWeight: 600, color: "#111827"} : {}}>{row[col.key] ?? "—"}</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {expandedSummaryId === row.id && (
                        <tr>
                          <td colSpan={SUMMARY_COLS.length} style={{ padding: 0, background: "#f9fafb" }}>
                            <ProviderTable
                              expandedVisit={expandedVisit}
                              onToggleVisit={(vk) => { setExpandedVisit((p) => (p === vk ? null : vk)); setExpandedProduct(null); }}
                              expandedProduct={expandedProduct}
                              onToggleProduct={(pk) => setExpandedProduct((p) => (p === pk ? null : pk))}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <PaginationFooter
                data={filteredSum}
                page={sumPage}
                pageSize={sumPageSize}
                setPage={setSumPage}
                setPageSize={setSumPageSize}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════  LEVEL-2  */
function ProviderTable({ expandedVisit, onToggleVisit, expandedProduct, onToggleProduct }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const COLS = [
    { key: "sNo", label: "#", center: true },
    { key: "empName", label: "Employee Name" },
    { key: "date", label: "Date", center: true },
    { key: "workingStatus", label: "Working Status", center: true },
    { key: "doctorCount", label: "Doctor Count", center: true, type: "doctor" },
    { key: "chemistCount", label: "Chemist Count", center: true, type: "chemist" },
    { key: "stockistCount", label: "Stockist Count", center: true, type: "stockist" },
    { key: "doctorPob", label: "Doctor POB", center: true },
    { key: "chemistPob", label: "Chemist POB", center: true },
    { key: "stockistPob", label: "Stockist POB", center: true },
    { key: "expenses", label: "Expenses", center: true },
    { key: "meetings", label: "Meetings", center: true },
  ];

  const filtered = PROVIDER_DATA.filter((r) =>
    !search || Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ padding: "16px" }}>
      <div className="ucr-table-container" style={{ border: `1px solid #dbeafe`, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", borderRadius: "12px" }}>
        <div style={{ padding: "12px 16px", background: "#eff6ff", borderBottom: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e40af" }}>DCR Provider Count Details</span>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search..."
              style={{ padding: "0 12px 0 32px", height: 32, borderRadius: 8, border: "1px solid #bfdbfe", fontSize: 12, outline: "none", width: 180, color: "#111827", fontWeight: 600, background: "#fff" }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#bfdbfe"}
            />
          </div>
        </div>
        <table className="ucr-table">
          <thead>
            <tr style={{ background: "#f8fbff" }}>
              {COLS.map((col) => (
                <th key={col.key} style={{ textAlign: col.center ? "center" : "left", color: "#1e40af", borderColor: "#dbeafe" }}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={COLS.length} style={{ textAlign: "center", padding: 24, color: "#9ca3af" }}>No records found.</td></tr>
            ) : paged.map((row, ri) => (
              <React.Fragment key={ri}>
                <tr>
                  {COLS.map((col) => {
                    const vKey = col.type ? `${row.date}|${col.type}` : null;
                    const isOpen = vKey && expandedVisit === vKey;
                    return (
                      <td key={col.key} style={{ textAlign: col.center ? "center" : "left", borderColor: "#dbeafe" }}>
                        {col.key === "sNo" ? ri + 1 + (page - 1) * pageSize
                          : col.key === "date" ? fmt(row[col.key])
                            : col.key === "workingStatus" ? (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, ...statusStyle(row.workingStatus) }}>{row.workingStatus}</span>
                            ) : col.type && row[col.key] > 0 ? (
                              <button
                                onClick={() => onToggleVisit(vKey)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", gap: 3, margin: "0 auto" }}
                              >
                                {row[col.key]} {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            ) : row[col.key] ?? "—"}
                      </td>
                    );
                  })}
                </tr>
                {COLS.filter((c) => c.type).map((col) => {
                  const vKey = `${row.date}|${col.type}`;
                  if (expandedVisit !== vKey) return null;
                  return (
                    <tr key={vKey}>
                      <td colSpan={COLS.length} style={{ padding: 0, background: "#f0f9ff", borderColor: "#dbeafe" }}>
                        <VisitTable
                          date={row.date}
                          type={col.type}
                          data={getVisitData(row.date, col.type)}
                          expandedProduct={expandedProduct}
                          onToggleProduct={onToggleProduct}
                        />
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <PaginationFooter data={filtered} page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════  LEVEL-3  */
function VisitTable({ date, type, data, expandedProduct, onToggleProduct }) {
  const COLS = [
    { key: "sNo", label: "#", center: true },
    { key: "doctor", label: "Doctor/Entity" },
    { key: "category", label: "Category", center: true },
    { key: "jointWork", label: "Joint Work", center: true },
    { key: "phone", label: "Phone", center: true },
    { key: "specialization", label: "Specialization" },
    { key: "timeIn", label: "Time In", center: true },
    { key: "timeOut", label: "Time Out", center: true },
    { key: "productPob", label: "Product POB", center: true },
    { key: "productCount", label: "Product Count", center: true, drill: true },
    { key: "remark", label: "Remark" },
  ];

  return (
    <div style={{ padding: "12px 24px" }}>
      <div className="ucr-table-container" style={{ border: `1px solid #bae6fd`, borderRadius: "12px" }}>
        <div style={{ padding: "8px 16px", background: "#e0f2fe", borderBottom: "1px solid #bae6fd", fontSize: 12, fontWeight: 700, color: "#0369a1" }}>
          {type.toUpperCase()} VISIT DETAILS — {fmt(date)}
        </div>
        <table className="ucr-table">
          <thead>
            <tr style={{ background: "#f0f9ff" }}>
              {COLS.map((col) => (
                <th key={col.key} style={{ textAlign: col.center ? "center" : "left", color: "#0369a1", borderColor: "#bae6fd" }}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={COLS.length} style={{ textAlign: "center", padding: 20, color: "#0369a1" }}>No records found.</td></tr>
            ) : data.map((row, ri) => {
              const pKey = `${date}|${type}|${ri}`;
              return (
                <React.Fragment key={ri}>
                  <tr>
                    {COLS.map((col) => (
                      <td key={col.key} style={{ textAlign: col.center ? "center" : "left", borderColor: "#bae6fd" }}>
                        {col.key === "sNo" ? ri + 1
                          : col.drill && row[col.key] > 0 ? (
                            <button
                              onClick={() => onToggleProduct(pKey)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", gap: 3, margin: "0 auto" }}
                            >
                              {row[col.key]} {expandedProduct === pKey ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          ) : row[col.key] || "—"}
                      </td>
                    ))}
                  </tr>
                  {expandedProduct === pKey && (
                    <tr>
                      <td colSpan={COLS.length} style={{ padding: 0, background: "#fefce8", borderColor: "#bae6fd" }}>
                        <ProductTable doctor={row.doctor} data={getProductData(date, type, ri)} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════  LEVEL-4  */
function ProductTable({ doctor, data }) {
  const COLS = [
    { key: "sn", label: "#", center: true },
    { key: "productName", label: "Product Name" },
    { key: "orderQty", label: "Order Qty", center: true },
    { key: "sampleQty", label: "Sample Qty", center: true },
    { key: "schemeQty", label: "Scheme Qty", center: true },
  ];
  return (
    <div style={{ padding: "12px 32px" }}>
      <div className="ucr-table-container" style={{ border: `1px solid #fde68a`, borderRadius: "12px" }}>
        <div style={{ padding: "6px 12px", background: "#fef9c3", borderBottom: "1px solid #fde68a", fontSize: 11, fontWeight: 700, color: "#92400e" }}>
          PRODUCTS — {doctor}
        </div>
        <table className="ucr-table">
          <thead>
            <tr style={{ background: "#fefce8" }}>
              {COLS.map((col) => (
                <th key={col.key} style={{ textAlign: col.center ? "center" : "left", color: "#92400e", borderColor: "#fde68a" }}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={COLS.length} style={{ textAlign: "center", padding: 16, color: "#92400e" }}>No items found.</td></tr>
            ) : data.map((row, ri) => (
              <Row key={ri}>
                {COLS.map((col) => (
                  <td key={col.key} style={{ textAlign: col.center ? "center" : "left", borderColor: "#fde68a" }}>{row[col.key] ?? "—"}</td>
                ))}
              </Row>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════  COMPONENTS  */
function SectionHeader({ title, count, onExcel, search, onSearch }) {
  return (
    <div className="ucr-header" style={{ background: "#f9fafb", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h3>
        <span style={{ fontSize: 11, fontWeight: 700, background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: 20, border: "1px solid #bfdbfe" }}>
          {count} Total
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", maxWidth: 350, width: "100%" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search report..."
            style={{ width: "100%", padding: "0 12px 0 32px", height: 32, borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 12, outline: "none", color: "#111827", fontWeight: 600, background: "#fff", transition: "all 0.15s" }}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>
        {onExcel && (
          <button 
            onClick={onExcel} 
            style={{ height: 32, width: 32, borderRadius: 8, background: "#eff6ff", border: "1px solid #dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#eff6ff"}
            title="Export to Excel"
          >
            <FileSpreadsheet size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function PaginationFooter({ data, page, pageSize, setPage, setPageSize }) {
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const from = data.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, data.length);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f3f4f6", background: "#f9fafb", fontSize: 11, flexWrap: "wrap", gap: 12 }}>
      <div style={{ color: "#6b7280", fontWeight: 600 }}>
        Showing <span style={{ fontWeight: 700, color: "#374151" }}>{from}</span> to <span style={{ fontWeight: 700, color: "#374151" }}>{to}</span> of <span style={{ fontWeight: 700, color: "#374151" }}>{data.length}</span> entries
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#6b7280", fontWeight: 600 }}>Items per page:</span>
        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "2px 24px 2px 8px", outline: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: "#fff" }}>
          {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ width: 12 }} />
        <NavBtn icon={<ChevronsLeft size={13} />} onClick={() => setPage(1)} disabled={page === 1} />
        <NavBtn icon={<ChevronLeft size={13} />} onClick={() => setPage(page - 1)} disabled={page === 1} />
        <div style={{ background: BLUE, color: "#fff", borderRadius: 6, padding: "4px 10px", fontWeight: 700 }}>{page}</div>
        <NavBtn icon={<ChevronRight size={13} />} onClick={() => setPage(page + 1)} disabled={page === totalPages || totalPages === 0} />
        <NavBtn icon={<ChevronsRight size={13} />} onClick={() => setPage(totalPages)} disabled={page === totalPages || totalPages === 0} />
      </div>
    </div>
  );
}

function NavBtn({ icon, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, transition: "all 0.15s" }}
    >
      {icon}
    </button>
  );
}

/* ── Custom FloatingDatePicker ────────────────────────────────────────── */
function FloatingDatePicker({ label, value, onChange, disabled }) {
  const [open,  setOpen]  = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const today  = new Date();
  const parsed = (value && !isNaN(Date.parse(value))) ? new Date(value + "T00:00:00") : today;
  const [view, setView]   = useState({ y: parsed.getFullYear(), m: parsed.getMonth() });
  const ref = useRef(null);

  const hasVal = Boolean(value);
  const active = open || hasVal;

  const openMenu = () => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: 270 // fixed calendar width
      });
    }
    setOpen(true);
  };

  const prevMonth = () => setView(v => v.m===0 ? {y:v.y-1,m:11} : {y:v.y,m:v.m-1});
  const nextMonth = () => setView(v => v.m===11 ? {y:v.y+1,m:0} : {y:v.y,m:v.m+1});

  const selectDay = (day) => {
    const ds = `${view.y}-${String(view.m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(ds);
    setOpen(false);
  };

  const firstDow    = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m+1, 0).getDate();

  const displayVal = hasVal
  ? new Date(value + "T00:00:00").toLocaleDateString("en-GB")
  : "";

  const selStr = (d) => `${view.y}-${String(view.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  return (
    <div className="relative w-full select-none" style={{ position: "relative" }}>
      <div
        ref={ref}
        onClick={openMenu}
        style={{
          width: "100%", height: FH, borderRadius: 8, padding: "0 12px", fontSize: 13, display: "flex",
          alignItems: "center", border: `1.5px solid ${active && !disabled ? "#2563eb" : "#d1d5db"}`,
          cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#f3f4f6" : "#fff",
          transition: "border-color 0.2s", boxSizing: "border-box"
        }}
      >
        <span style={{ flex: 1, fontWeight: 600, color: hasVal ? "#111827" : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>
          {displayVal || " "}
        </span>
        <CalendarIcon size={15} style={{ color: open ? "#2563eb" : "#9ca3af", flexShrink: 0 }} />
      </div>
      
      <label
        style={{
          position: "absolute", left: 10, top: active ? -9 : 10, fontSize: active ? 10 : 12,
          fontWeight: 600, color: disabled ? "#9ca3af" : (active ? "#2563eb" : "#9ca3af"), background: disabled ? (active ? "#f3f4f6" : "transparent") : "#fff",
          padding: "0 4px", transition: "0.2s", pointerEvents: "none",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "calc(100% - 20px)", zIndex: 11
        }}
      >
        {label}
      </label>

      {open && !disabled && (
        <Portal top={pos.top} left={pos.left} width={pos.width} onClose={() => setOpen(false)}>
          <div style={{ background: "#fff", overflow: "hidden" }}>
            <div style={{ background:"#2563eb", padding:"14px 14px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button
                onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); prevMonth(); }}
                style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:6, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", flexShrink:0 }}
              >
                <ChevronLeft size={14}/>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <select
                  value={view.m}
                  onChange={(e) => setView({ ...view, m: Number(e.target.value) })}
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "2px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none" }}
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i} style={{ color: "#000" }}>{m}</option>
                  ))}
                </select>
                <select
                  value={view.y}
                  onChange={(e) => setView({ ...view, y: Number(e.target.value) })}
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "2px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none" }}
                >
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map((y) => (
                    <option key={y} value={y} style={{ color: "#000" }}>{y}</option>
                  ))}
                </select>
              </div>
              <button
                onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); nextMonth(); }}
                style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:6, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", flexShrink:0 }}
              >
                <ChevronRight size={14}/>
              </button>
            </div>

            <div style={{ padding:"10px 12px 4px", background:"#f9fafb", borderBottom:"1px solid #f3f4f6" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, textAlign:"center" }}>
                {DAYS.map(d => (
                  <div key={d} style={{ fontSize:10, fontWeight:700, color:"#9ca3af", padding:"2px 0" }}>{d}</div>
                ))}
              </div>
            </div>

            <div style={{ padding:"8px 12px 12px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, textAlign:"center" }}>
                {Array.from({ length: firstDow }).map((_,i) => <div key={`e${i}`}/>)}

                {Array.from({ length: daysInMonth }).map((_,i) => {
                  const d      = i + 1;
                  const ds     = selStr(d);
                  const isSel  = value === ds;
                  const isToday = ds === todayStr;

                  return (
                    <button key={d}
                      onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); selectDay(d); }}
                      style={{
                        width:"100%", aspectRatio:"1", borderRadius:"50%", border:"none",
                        fontSize:12, fontWeight: isSel||isToday ? 700 : 400,
                        cursor:"pointer", transition:"all 0.12s",
                        background: isSel ? "#2563eb" : isToday ? "#eff6ff" : "transparent",
                        color: isSel ? "#fff" : isToday ? "#2563eb" : "#374151",
                        boxShadow: isSel ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                        outline: isToday && !isSel ? "1.5px solid #bfdbfe" : "none",
                        padding: 0, display: "flex", alignItems: "center", justifyContent: "center"
                      }}
                      onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background="#eff6ff"; }}
                      onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background= isToday?"#eff6ff":"transparent"; }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

// ─── Portal Utility ─────────────────────────────────────────────────────────

function Portal({ top, left, width, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  
  return (
    <div ref={ref} style={{ position: "fixed", top, left, width, zIndex: 9999, background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", overflow: "hidden" }} className="dropdown-portal">
      <div style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}