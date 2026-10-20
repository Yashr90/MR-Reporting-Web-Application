import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Loader2, AlertCircle, ChevronDown, Check,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, X, Download, Stethoscope, Calendar as CalendarIcon
} from "lucide-react";
// Go up 4 levels: reports -> mr -> pages -> src
import api from "../../../../services/api";

// ─── Specialization options ────────────────────────────────────────────────
const SPECIALIZATION_OPTIONS = [
  { value: "Ortho", label: "Ortho" },
  { value: "Physician", label: "Physician" },
  { value: "Cardiologist", label: "Cardiologist" },
  { value: "Gen Surgery", label: "Gen Surgery" },
  { value: "Gastrologist", label: "Gastrologist" },
  { value: "Endocrinologist", label: "Endocrinologist" },
  { value: "Nephrologist", label: "Nephrologist" },
  { value: "Neurologist", label: "Neurologist" },
  { value: "Dermatologist(Plastic Surgery)", label: "Dermatologist(Plastic Surgery)" },
  { value: "Oncologist", label: "Oncologist" },
  { value: "Critical Care", label: "Critical Care" },
  { value: "Gynaecologist", label: "Gynaecologist" },
  { value: "Urologist", label: "Urologist" },
  { value: "Dental", label: "Dental" },
  { value: "Hepatologist", label: "Hepatologist" },
  { value: "Diabetologist", label: "Diabetologist" },
  { value: "Pulmonologist", label: "Pulmonologist" },
  { value: "Medical Oncology", label: "Medical Oncology" },
  { value: "Radiotherapy", label: "Radiotherapy" },
  { value: "OBG&GYN", label: "OBG&GYN" },
  { value: "Gastroenterologist", label: "Gastroenterologist" },
];

// ─── Month options ─────────────────────────────────────────────────────────
const MONTH_OPTIONS = [
  { value: "1",  label: "January" },
  { value: "2",  label: "February" },
  { value: "3",  label: "March" },
  { value: "4",  label: "April" },
  { value: "5",  label: "May" },
  { value: "6",  label: "June" },
  { value: "7",  label: "July" },
  { value: "8",  label: "August" },
  { value: "9",  label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// ─── Year options (dynamic range) ──────────────────────────────────────────
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const y = currentYear - 5 + i;
  return { value: String(y), label: String(y) };
});

// ─── Table columns ─────────────────────────────────────────────────────────
const TABLE_COLS = [
  { key: "sNo",              label: "S. No.",              center: true  },
  { key: "employeeCode",     label: "Employee Code",       center: true  },
  { key: "userName",         label: "User Name"                          },
  { key: "headquarter",      label: "Headquarter"                        },
  { key: "specialization",   label: "Specialization"                     },
  { key: "doctorName",       label: "Doctor Name"                        },
  { key: "visitDate",        label: "Visit Date",          center: true  },
  { key: "visitCount",       label: "Visit Count",         center: true  },
  { key: "pob",              label: "POB",                 center: true  },
  { key: "totalVisit",       label: "Total Visit",         center: true  },
  { key: "status",           label: "Status",              center: true  },
];

export default function SpecialityDoctorVisit() {
  const [filterOpen, setFilterOpen] = useState(true);

  // ─── Filter state ────────────────────────────────────────────────────────
  const [selectedState,          setSelectedState]          = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedMonth,          setSelectedMonth]          = useState("");
  const [selectedYear,           setSelectedYear]           = useState(String(currentYear));

  const [statesList, setStatesList] = useState([]);
  const [tableData,    setTableData]    = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError,   setTableError]   = useState("");
  const [showTable,    setShowTable]    = useState(false);

  const [page,   setPage]   = useState(1);
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState("");
  const [validationErr, setValidationErr] = useState("");

  const getAuth = useCallback(() => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  }), []);

  useEffect(() => {
    api.get("/api/masters/states", getAuth())
      .then(res => {
        const d = res.data?.data || res.data || [];
        setStatesList(Array.isArray(d) ? d.map(s => ({
          value: String(s.id ?? s.stateId),
          label: s.state_name || s.stateName || s.name || "Unknown",
        })) : []);
      }).catch(err => console.error("Failed to load states", err));
  }, [getAuth]);

  const validate = () => {
    if (!selectedState)          return "State is required!!!";
    if (!selectedSpecialization) return "Specialization is required!!!";
    if (!selectedMonth)          return "Month is required!!!";
    if (!selectedYear)           return "Year is required!!!";
    return "";
  };

  const handleViewStatus = async () => {
    const err = validate();
    if (err) { setValidationErr(err); return; }
    setValidationErr(""); setTableLoading(true); setShowTable(true);
    setTableData([]); setTableError(""); setPage(1); setSearch("");

    try {
      const p = new URLSearchParams({
        stateId: selectedState,
        specialization: selectedSpecialization,
        month: selectedMonth,
        year: selectedYear,
      });
      const res = await api.get(`/api/reports/speciality-doctor-visit?${p}`, getAuth());
      const data = res.data?.data || res.data || [];
      setTableData(Array.isArray(data) ? data : []);
    } catch (e) {
      setTableError(e.response?.data?.message || "Failed to load report.");
    } finally { setTableLoading(false); }
  };

  const handleDownload = () => {
    if (!tableData.length) return;
    const headers = TABLE_COLS.filter(c => c.key !== "sNo").map(c => c.label);
    const rows = tableData.map(r => TABLE_COLS.filter(c => c.key !== "sNo").map(c => `"${String(r[c.key] ?? "").replace(/"/g, '""')}"`));
    const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `Speciality_Doctor_Visit_${selectedMonth}_${selectedYear}.csv`;
    a.click();
  };

  const filtered   = tableData.filter(r => !search || Object.values(r).some(v => String(v ?? "").toLowerCase().includes(search.toLowerCase())));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 animate-in fade-in duration-400 pb-12 font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        <div className="px-6 sm:px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
              <Stethoscope size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Specialty Doctor Visit Summary</h2>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0, marginTop: 2 }}>Analyse specialty-wise visits by state, month & year</p>
            </div>
          </div>
          <button onClick={() => setFilterOpen(p => !p)} className={`relative w-11 h-6 rounded-full transition-colors ${filterOpen ? "bg-blue-600" : "bg-slate-300"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${filterOpen ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {filterOpen && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-6 items-start">
              <SingleDropdown label="SELECT STATE *" value={selectedState} onSelect={v => { setSelectedState(v); setValidationErr(""); }} options={statesList} />
              <SingleDropdown label="SPECIALIZATION *" value={selectedSpecialization} onSelect={v => { setSelectedSpecialization(v); setValidationErr(""); }} options={SPECIALIZATION_OPTIONS} />
              <SingleDropdown label="SELECT MONTH *" value={selectedMonth} onSelect={v => { setSelectedMonth(v); setValidationErr(""); }} options={MONTH_OPTIONS} />
              <SingleDropdown label="SELECT YEAR *" value={selectedYear} onSelect={v => { setSelectedYear(v); setValidationErr(""); }} options={YEAR_OPTIONS} />
            </div>
            {validationErr && <div className="flex items-center gap-2 text-red-500 text-xs font-bold"><AlertCircle size={13} /> {validationErr}</div>}
            <div className="pt-2 border-t border-slate-100">
              <button onClick={handleViewStatus} disabled={tableLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition-all active:scale-95 shadow-md shadow-blue-200 text-[13px] flex items-center gap-2">
                {tableLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} View Status
              </button>
            </div>
          </div>
        )}
      </div>

      {showTable && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <span style={{ fontSize: 13, fontWeight: 700 }}>Results ({filtered.length})</span>
            <div className="flex items-center gap-3">
              {tableData.length > 0 && <button onClick={handleDownload} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 hover:bg-green-700 transition-all"><Download size={13} /> Export CSV</button>}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="pl-8 pr-4 py-1.5 border border-slate-200 rounded-lg text-[12px] w-48 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {TABLE_COLS.map(col => (<th key={col.key} className={`px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${col.center ? "text-center" : "text-left"}`}>{col.label}</th>))}
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr><td colSpan={TABLE_COLS.length} className="py-16 text-center text-xs text-slate-400 font-semibold"><Loader2 className="animate-spin mx-auto mb-2" size={20} />Loading...</td></tr>
                ) : paged.length === 0 ? (
                  <tr><td colSpan={TABLE_COLS.length} className="py-16 text-center text-xs text-slate-400">No records found.</td></tr>
                ) : paged.map((row, ri) => (
                  <tr key={ri} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors bg-white text-[12px] text-slate-600">
                    {TABLE_COLS.map(col => (<td key={col.key} className={`px-3 py-2.5 ${col.center ? "text-center" : "text-left"}`}>{col.key === "sNo" ? (page - 1) * PAGE_SIZE + ri + 1 : row[col.key] || "—"}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Page {page} of {totalPages}</span>
              <div className="flex items-center gap-1">
                <PagBtn onClick={() => setPage(1)} disabled={page === 1} icon={<ChevronsLeft size={13}/>} />
                <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1} icon={<ChevronLeft size={13}/>} />
                <span className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-md">{page}</span>
                <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages} icon={<ChevronRight size={13}/>} />
                <PagBtn onClick={() => setPage(totalPages)} disabled={page === totalPages} icon={<ChevronsRight size={13}/>} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub Components ────────────────────────────────────────────────────────

function SingleDropdown({ label, value, onSelect, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => String(o.value ?? o.id) === String(value));
  const active = open || Boolean(value);
  return (
    <div ref={ref} className="relative w-full mt-1">
      <div onClick={() => !disabled && setOpen(!open)} className={`h-[38px] flex items-center justify-between px-3 border rounded-lg cursor-pointer transition-all ${open ? "border-blue-600 ring-2 ring-blue-50" : "border-slate-300"} ${disabled ? "bg-slate-50 opacity-60" : "bg-white"}`}>
        <span className="text-[13px] font-semibold text-slate-800 truncate">{selected ? selected.label : " "}</span>
        <ChevronDown size={15} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      <label className={`absolute left-2 transition-all pointer-events-none px-1 ${active ? "-top-2 text-[10px] bg-white text-blue-600 font-bold" : "top-2 text-[13px] text-slate-400"}`}>{label}</label>
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto">
          {options.map((o, i) => (<div key={i} onClick={() => { onSelect(String(o.value ?? o.id)); setOpen(false); }} className="px-4 py-2 text-[13px] hover:bg-blue-50 cursor-pointer font-medium text-slate-700">{o.label}</div>))}
        </div>
      )}
    </div>
  );
}

function FDatePicker({ label, value, onChange }) {
  const ref = useRef(null);
  return (
    <div className="relative w-full mt-1 group">
      <div onClick={() => ref.current?.showPicker()} className="h-[38px] flex items-center justify-between px-3 border border-slate-300 rounded-lg bg-white cursor-pointer group-hover:border-blue-300">
        <span className="text-[13px] font-semibold text-slate-800">{value}</span>
        <CalendarIcon size={15} className="text-slate-400" />
      </div>
      <label className={`absolute left-2 transition-all pointer-events-none px-1 ${value ? "-top-2 text-[10px] bg-white text-blue-600 font-bold" : "top-2 text-[13px] text-slate-400"}`}>{label}</label>
      <input ref={ref} type="date" value={value} onChange={e => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
  );
}

function PagBtn({ onClick, disabled, icon }) {
  return (
    <button onClick={onClick} disabled={disabled} className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all">
      {icon}
    </button>
  );
}