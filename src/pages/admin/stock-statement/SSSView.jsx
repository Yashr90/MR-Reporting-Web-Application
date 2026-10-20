import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Loader2, AlertCircle, CheckCircle2, ChevronDown,
  Filter, Check, Save, FileSpreadsheet, ChevronLeft, ChevronRight, Edit2
} from "lucide-react";
import api from "../../../services/api";

// ─── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 20, 50];
const FH = 40;

const MONTHS = [
  { value: "January", label: "January" }, { value: "February", label: "February" },
  { value: "March", label: "March" }, { value: "April", label: "April" },
  { value: "May", label: "May" }, { value: "June", label: "June" },
  { value: "July", label: "July" }, { value: "August", label: "August" },
  { value: "September", label: "September" }, { value: "October", label: "October" },
  { value: "November", label: "November" }, { value: "December", label: "December" }
];

const monthToNumber = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: String(CURRENT_YEAR - 2 + i),
  label: String(CURRENT_YEAR - 2 + i)
}));

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
  .ucr-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px; }
  .ucr-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 16px; margin-bottom: 0; }

  .col-span-2 { grid-column: span 2; }
  .col-span-4 { grid-column: span 4; }

  @media(max-width: 1200px) {
    .ucr-grid-4 { grid-template-columns: repeat(3, 1fr); }
    .col-span-2 { grid-column: span 1 !important; }
  }
  @media(max-width: 991px) {
    .ucr-grid-2 { grid-template-columns: 1fr !important; gap: 24px; }
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
    .dc-submit-btn { width: auto !important; }
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

  /* ── Premium Compact Table Container with Uniform Custom Scroll Track ── */
  .ucr-table-container {
    border: 1px solid #edf2f7;
    border-radius: 12px;
    overflow-x: auto;
    background: #ffffff !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.01);
    margin-bottom: 16px;
    -webkit-overflow-scrolling: touch;
  }

  /* Custom Scrollbar Styles matching the reference images exactly */
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

  .ucr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left; min-width: 1200px; }
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
`;

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (value) => `₹${toNumber(value).toFixed(2)}`;

const normalizeReportRow = (row = {}) => ({
  ...row,
  providerId: row.providerId ?? row.stockistId ?? row.partyId ?? null,
  partyName: row.partyName || row.stockistName || row.providerName || "-",
  productId: row.productId ?? row.id ?? null,
  productName: row.productName || "-",
  productCode: row.productCode || "",
  netRate: toNumber(row.netRate),
  opening: toNumber(row.opening),
  openingValue: toNumber(row.openingValue),
  receipt: toNumber(row.receipt ?? row.recipt),
  primarySale: toNumber(row.primarySale),
  primaryValue: toNumber(row.primaryValue),
  scheme: toNumber(row.scheme),
  total: toNumber(row.total),
  salesReturn: toNumber(row.salesReturn ?? row.return),
  returnValue: toNumber(row.returnValue),
  closing: toNumber(row.closing),
  closingValue: toNumber(row.closingValue),
  expiry: toNumber(row.expiry),
  expiryValue: toNumber(row.expiryValue),
  breakage: toNumber(row.breakage),
  breakageValue: toNumber(row.breakageValue),
  batchRecall: toNumber(row.batchRecall),
  batchRecallValue: toNumber(row.batchRecallValue),
  batchNumber: row.batchNumber || "-",
  secondarySale: toNumber(row.secondarySale ?? row.secSales),
  secondarySaleValue: toNumber(row.secondarySaleValue ?? row.secSalesValue)
});

const calculateFrontEndTotals = (rows) => {
  const totals = {
    partyName: "TOTAL",
    productName: "",
    netRate: 0,
    opening: 0,
    openingValue: 0,
    receipt: 0,
    primarySale: 0,
    primaryValue: 0,
    scheme: 0,
    total: 0,
    salesReturn: 0,
    returnValue: 0,
    closing: 0,
    closingValue: 0,
    expiry: 0,
    expiryValue: 0,
    breakage: 0,
    breakageValue: 0,
    batchRecall: 0,
    batchRecallValue: 0,
    batchNumber: "--",
    secondarySale: 0,
    secondarySaleValue: 0
  };

  rows.forEach((row) => {
    totals.opening += row.opening;
    totals.openingValue += row.openingValue;
    totals.receipt += row.receipt;
    totals.primarySale += row.primarySale;
    totals.primaryValue += row.primaryValue;
    totals.scheme += row.scheme;
    totals.total += row.total;
    totals.salesReturn += row.salesReturn;
    totals.returnValue += row.returnValue;
    totals.closing += row.closing;
    totals.closingValue += row.closingValue;
    totals.expiry += row.expiry;
    totals.expiryValue += row.expiryValue;
    totals.breakage += row.breakage;
    totals.breakageValue += row.breakageValue;
    totals.batchRecall += row.batchRecall;
    totals.batchRecallValue += row.batchRecallValue;
    totals.secondarySale += row.secondarySale;
    totals.secondarySaleValue += row.secondarySaleValue;
  });

  return totals;
};

const buildSummaryRows = (rows, selectedProviderCount) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const key = String(row.productId ?? row.productCode ?? row.productName);

    if (!grouped.has(key)) {
      grouped.set(key, {
        productId: row.productId,
        partyName: selectedProviderCount > 1 ? "Multiple Parties" : row.partyName,
        productName: row.productName,
        netRate: row.netRate,
        secondarySale: row.secondarySale,
        secondarySaleValue: row.secondarySaleValue
      });
      return;
    }

    const existing = grouped.get(key);
    existing.secondarySale += row.secondarySale;
    existing.secondarySaleValue += row.secondarySaleValue;
  });

  return Array.from(grouped.values());
};

const getTop5Rows = (rows) =>
  [...rows]
    .sort((a, b) => {
      if (b.secondarySale !== a.secondarySale) {
        return b.secondarySale - a.secondarySale;
      }
      return b.secondarySaleValue - a.secondarySaleValue;
    })
    .slice(0, 5);

const getBottom5Rows = (rows) =>
  [...rows]
    .sort((a, b) => {
      if (a.secondarySale !== b.secondarySale) {
        return a.secondarySale - b.secondarySale;
      }
      return a.secondarySaleValue - b.secondarySaleValue;
    })
    .slice(0, 5);

const escapeCsv = (value) => {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export default function SSSView() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [tableVisible, setTableVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    stateIds: [],
    districtIds: [],
    employeeIds: [],
    stockistIds: [],
    month: "",
    year: String(CURRENT_YEAR)
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stockists, setStockists] = useState([]);

  const [top5Data, setTop5Data] = useState([]);
  const [bottom5Data, setBottom5Data] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportTotals, setReportTotals] = useState(null);

  const getAuthHeaders = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    }),
    []
  );

  const clearReportData = useCallback(() => {
    setTableVisible(false);
    setTop5Data([]);
    setBottom5Data([]);
    setReportData([]);
    setReportTotals(null);
    setCurrentPage(1);
    setError("");
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/expense/sss-view/states", getAuthHeaders());
        const stateData = res.data?.data || res.data || [];

        const normalizedStates = Array.isArray(stateData)
          ? stateData.map((s) => ({
              id: String(s.id ?? s.stateId ?? ""),
              stateName: s.name || s.state_name || s.stateName || "Unknown"
            })).filter((s) => s.id !== "")
          : [];

        setStates(normalizedStates);
      } catch (err) {
        console.error("Failed to load states", err);
      }
    };

    fetchStates();
  }, [getAuthHeaders]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      districtIds: [],
      employeeIds: [],
      stockistIds: []
    }));
    setDistricts([]);
    setEmployees([]);
    setStockists([]);
    clearReportData();

    if (filters.stateIds.length > 0) {
      const fetchDistricts = async () => {
        try {
          const query = filters.stateIds.map((id) => `stateIds=${id}`).join("&");
          const res = await api.get(`/api/expense/sss-view/districts?${query}`, getAuthHeaders());
          const districtData = res.data?.data || res.data || [];

          const normalizedDistricts = Array.isArray(districtData)
            ? districtData.map((d) => ({
                id: String(d.id ?? d.districtId ?? ""),
                districtName: d.name || d.district_name || d.districtName || "Unknown"
              })).filter((d) => d.id !== "")
            : [];

          setDistricts(normalizedDistricts);
        } catch (err) {
          console.error("Failed to load districts", err);
        }
      };

      fetchDistricts();
    }
  }, [filters.stateIds, getAuthHeaders, clearReportData]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      employeeIds: [],
      stockistIds: []
    }));
    setEmployees([]);
    setStockists([]);
    clearReportData();

    if (filters.districtIds.length > 0) {
      const fetchEmployees = async () => {
        try {
          const query = filters.districtIds.map((id) => `districtIds=${id}`).join("&");
          const res = await api.get(`/api/expense/sss-view/employees?${query}`, getAuthHeaders());
          const employeeData = res.data?.data || res.data || [];

          const normalizedEmployees = Array.isArray(employeeData)
            ? employeeData.map((e) => ({
                id: String(e.id ?? e.employeeId ?? ""),
                employeeName: e.name || e.employee_name || e.employeeName || "Unknown"
              })).filter((e) => e.id !== "")
            : [];

          setEmployees(normalizedEmployees);
        } catch (err) {
          console.error("Failed to load employees", err);
        }
      };

      fetchEmployees();
    }
  }, [filters.districtIds, getAuthHeaders, clearReportData]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      stockistIds: []
    }));
    setStockists([]);
    clearReportData();

    if (filters.employeeIds.length > 0) {
      const fetchStockists = async () => {
        try {
          const query = filters.employeeIds.map((id) => `employeeIds=${id}`).join("&");
          const res = await api.get(`/api/expense/sss-view/providers?${query}`, getAuthHeaders());
          const stockistData = res.data?.data || res.data || [];

          const normalizedStockists = Array.isArray(stockistData)
            ? stockistData.map((s) => ({
                id: String(s.id ?? s.providerId ?? s.stockistId ?? ""),
                stockistName: s.name || s.providerName || s.stockistName || "Unknown",
                type: s.type || ""
              })).filter((s) => s.id !== "")
            : [];

          setStockists(normalizedStockists);
        } catch (err) {
          console.error("Failed to load stockists", err);
        }
      };

      fetchStockists();
    }
  }, [filters.employeeIds, getAuthHeaders, clearReportData]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    clearReportData();
  };

  const handleViewStatus = async () => {
    setError("");

    if (
      !filters.stateIds.length ||
      !filters.districtIds.length ||
      !filters.employeeIds.length ||
      !filters.stockistIds.length ||
      !filters.month ||
      !filters.year
    ) {
      return setError("Please select all filter fields before viewing status.");
    }

    setIsLoading(true);
    try {
      const payload = {
        stateIds: filters.stateIds.map(Number),
        districtIds: filters.districtIds.map(Number),
        employeeIds: filters.employeeIds.map(Number),
        providerIds: filters.stockistIds.map(Number),
        month: monthToNumber[filters.month],
        year: Number(filters.year)
      };

      const res = await api.post("/api/expense/sss-view/report", payload, getAuthHeaders());

      const responseData = res.data?.data || {};
      const rawRows = Array.isArray(responseData.rows)
        ? responseData.rows.map(normalizeReportRow)
        : [];

      const totals = responseData.totals
        ? normalizeReportRow(responseData.totals)
        : calculateFrontEndTotals(rawRows);

      const summaryRows = buildSummaryRows(rawRows, filters.stockistIds.length);

      setTop5Data(getTop5Rows(summaryRows));
      setBottom5Data(getBottom5Rows(summaryRows));
      setReportData(rawRows);
      setReportTotals(totals);
      setCurrentPage(1);
      setTableVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch statement data.");
      setTop5Data([]);
      setBottom5Data([]);
      setReportData([]);
      setReportTotals(null);
      setCurrentPage(1);
      setTableVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData.length) return;

    const headers = [
      "Party Name", "Product Name", "Net Rate", "Opening", "Opening Value", "Receipt",
      "Primary Sale", "Primary Value", "Scheme", "Total", "Return", "Return Value",
      "Closing", "Closing Value", "Expiry", "Expiry Value", "Breakage", "Breakage Value",
      "BatchRecall", "BatchRecall Value", "Batch Number", "Secondary Sale", "Secondary Sale Value"
    ];

    const rows = reportData.map((row) => [
      row.partyName, row.productName, row.netRate, row.opening, row.openingValue, row.receipt,
      row.primarySale, row.primaryValue, row.scheme, row.total, row.salesReturn, row.returnValue,
      row.closing, row.closingValue, row.expiry, row.expiryValue, row.breakage, row.breakageValue,
      row.batchRecall, row.batchRecallValue, row.batchNumber, row.secondarySale, row.secondarySaleValue
    ]);

    if (reportTotals) {
      rows.push([
        "TOTAL", "", "", reportTotals.opening, reportTotals.openingValue, reportTotals.receipt,
        reportTotals.primarySale, reportTotals.primaryValue, reportTotals.scheme, reportTotals.total,
        reportTotals.salesReturn, reportTotals.returnValue, reportTotals.closing, reportTotals.closingValue,
        reportTotals.expiry, reportTotals.expiryValue, reportTotals.breakage, reportTotals.breakageValue,
        reportTotals.batchRecall, reportTotals.batchRecallValue, "--", reportTotals.secondarySale, reportTotals.secondarySaleValue
      ]);
    }

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sss_consolidate_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const totalValue = (key) => {
    if (reportTotals) return toNumber(reportTotals[key]);
    return reportData.reduce((sum, row) => sum + toNumber(row[key]), 0);
  };

  const stateOpts = states.map((s) => ({ id: String(s.id), value: String(s.id), label: s.stateName }));
  const distOpts = districts.map((d) => ({ id: String(d.id), value: String(d.id), label: d.districtName }));
  const empOpts = employees.map((e) => ({ id: String(e.id), value: String(e.id), label: e.employeeName }));
  const stockOpts = stockists.map((s) => ({
    id: String(s.id),
    value: String(s.id),
    label: s.type ? `${s.stockistName} (${s.type})` : s.stockistName
  }));

  const totalPages = Math.max(1, Math.ceil(reportData.length / pageSize));
  const pagedData = reportData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="dc-wrap">
      <style>{STYLES}</style>

      {error && (
        <div className="dc-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Filter Card */}
      <div className="dc-card">
        <div className="dc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dc-page-icon">
              <FileSpreadsheet size={16} color="#fff" />
            </div>
            <div>
              <h2 className="ucr-brand" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.2 }}>SSS Consolidate Summary</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>View aggregated stock and sales records</p>
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
            <div className="ucr-grid-4" style={{ margin: "0 0 16px" }}>
              <MultiSelectDropdown label="Select State" options={stateOpts} selectedIds={filters.stateIds} onChange={(v) => handleFilterChange("stateIds", v)} />
              <MultiSelectDropdown label="Select District" options={distOpts} selectedIds={filters.districtIds} onChange={(v) => handleFilterChange("districtIds", v)} disabled={!filters.stateIds.length} />
              <MultiSelectDropdown label="Select Employee" options={empOpts} selectedIds={filters.employeeIds} onChange={(v) => handleFilterChange("employeeIds", v)} disabled={!filters.districtIds.length} />
              <FloatingDropdown label="Select Month" options={MONTHS} value={filters.month} onSelect={(v) => handleFilterChange("month", v)} />
            </div>
            <div className="ucr-grid-4">
              <FloatingDropdown label="Select Year" options={YEARS} value={filters.year} onSelect={(v) => handleFilterChange("year", v)} />
              <MultiSelectDropdown label="Select Stockist" options={stockOpts} selectedIds={filters.stockistIds} onChange={(v) => handleFilterChange("stockistIds", v)} disabled={!filters.employeeIds.length} />
              <div className="col-span-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleViewStatus}
                  disabled={isLoading}
                  className="dc-submit-btn"
                  style={{ width: "100%", maxWidth: 180, justifyContent: "center" }}
                >
                  {isLoading ? <Loader2 size={14} style={{ animation: "dc-spin 1s linear infinite" }} /> : <Check size={14} />}
                  View Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Charts Cards Grid */}
      {tableVisible && (
        <div className="ucr-grid-2">
          {/* Top 5 Selling Products Card Container */}
          <div className="dc-card">
            <div className="dc-header" style={{ background: "#f8fafc" }}>
              <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Top 5 Selling Products</h3>
            </div>
            <div className="dc-body" style={{ padding: "20px 28px 24px" }}>
              <div className="ucr-table-container">
                <table className="ucr-table" style={{ minWidth: 550 }}>
                  <thead>
                    <tr>
                      <th>Party Name</th>
                      <th>Product Name</th>
                      <th style={{ textAlign: "right" }}>Net Rate</th>
                      <th style={{ textAlign: "right" }}>Sec. Sales</th>
                      <th style={{ textAlign: "right" }}>Sec. Sales Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top5Data.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>No data available</td>
                      </tr>
                    ) : (
                      top5Data.map((row, i) => (
                        <tr key={`${row.productId}-${i}`}>
                          <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.partyName}</td>
                          <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.productName}</td>
                          <td style={{ textAlign: "right" }}>{formatCurrency(row.netRate)}</td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "#1e293b" }}>{row.secondarySale}</td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "#2563eb" }}>{formatCurrency(row.secondarySaleValue)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom 5 Selling Products Card Container */}
          <div className="dc-card">
            <div className="dc-header" style={{ background: "#f8fafc" }}>
              <h3 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Bottom 5 Selling Products</h3>
            </div>
            <div className="dc-body" style={{ padding: "20px 28px 24px" }}>
              <div className="ucr-table-container">
                <table className="ucr-table" style={{ minWidth: 550 }}>
                  <thead>
                    <tr>
                      <th>Party Name</th>
                      <th>Product Name</th>
                      <th style={{ textAlign: "right" }}>Net Rate</th>
                      <th style={{ textAlign: "right" }}>Sec. Sales</th>
                      <th style={{ textAlign: "right" }}>Sec. Sales Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bottom5Data.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>No data available</td>
                      </tr>
                    ) : (
                      bottom5Data.map((row, i) => (
                        <tr key={`${row.productId}-${i}`}>
                          <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.partyName}</td>
                          <td style={{ fontWeight: 600, color: "#1e293b" }}>{row.productName}</td>
                          <td style={{ textAlign: "right" }}>{formatCurrency(row.netRate)}</td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "#1e293b" }}>{row.secondarySale}</td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "#e11d48" }}>{formatCurrency(row.secondarySaleValue)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Consolidated Report Table Card */}
      {tableVisible && (
        <div className="dc-card">
          <div className="dc-header" style={{ background: "#f8fafc" }}>
            <h1 className="ucr-brand" style={{ fontSize: 14, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>SSS Consolidate Report</h1>
            <button
              type="button"
              onClick={handleExportExcel}
              style={{
                height: 40, width: 40, borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0",
                color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.15)"
              }}
              title="Export to Excel"
            >
              <FileSpreadsheet size={16} />
            </button>
          </div>

          <div className="dc-body" style={{ padding: 0 }}>
            <div className="ucr-table-container" style={{ border: "none", borderRadius: "0 0 16px 16px" }}>
              <table className="ucr-table" style={{ minWidth: 2200 }}>
                <thead>
                  <tr>
                    <th style={{ borderRight: "1px solid #edf2f7" }}>Party Name</th>
                    <th style={{ borderRight: "1px solid #edf2f7" }}>Product Name</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Net Rate</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Opening</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Opening Value</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Receipt</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Primary Sale</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Primary Value</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Scheme</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Total</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Return</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Return Value</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Closing</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Closing Value</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Expiry</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Expiry Value</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Breakage</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>Breakage Value</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>BatchRecall</th>
                    <th style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>BatchRecall Value</th>
                    <th style={{ textAlign: "center", borderRight: "1px solid #edf2f7" }}>Batch Number</th>
                    <th style={{ textAlign: "right" }}>Secondary Sale</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedData.length === 0 ? (
                    <tr>
                      <td colSpan={22} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontStyle: "italic" }}>No report data found.</td>
                    </tr>
                  ) : (
                    pagedData.map((row, index) => (
                      <tr key={`${row.providerId ?? "p"}-${row.productId ?? "prd"}-${index}`}>
                        <td style={{ fontWeight: 600, color: "#1e293b", borderRight: "1px solid #edf2f7" }}>{row.partyName}</td>
                        <td style={{ fontWeight: 600, color: "#1e293b", borderRight: "1px solid #edf2f7" }}>{row.productName}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{formatCurrency(row.netRate)}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.opening}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7", fontWeight: 700, color: "#1e293b" }}>{formatCurrency(row.openingValue)}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.receipt}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.primarySale}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7", fontWeight: 700, color: "#1e293b" }}>{formatCurrency(row.primaryValue)}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.scheme}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.total}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.salesReturn}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7", fontWeight: 700, color: "#1e293b" }}>{formatCurrency(row.returnValue)}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.closing}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7", fontWeight: 700, color: "#1e293b" }}>{formatCurrency(row.closingValue)}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.expiry}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7", fontWeight: 700, color: "#1e293b" }}>{formatCurrency(row.expiryValue)}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.breakage}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7", fontWeight: 700, color: "#1e293b" }}>{formatCurrency(row.breakageValue)}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7" }}>{row.batchRecall}</td>
                        <td style={{ textAlign: "right", borderRight: "1px solid #edf2f7", fontWeight: 700, color: "#1e293b" }}>{formatCurrency(row.batchRecallValue)}</td>
                        <td style={{ textAlign: "center", borderRight: "1px solid #edf2f7" }}>{row.batchNumber}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#3B82F6" }}>{row.secondarySale}</td>
                      </tr>
                    ))
                  )}
                </tbody>

                {reportData.length > 0 && (
                  <tfoot>
                    <tr style={{ background: "#2563eb" }}>
                      <td colSpan={2} style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Total</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>--</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("opening")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{formatCurrency(totalValue("openingValue"))}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("receipt")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("primarySale")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{formatCurrency(totalValue("primaryValue"))}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("scheme")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("total")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("salesReturn")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{formatCurrency(totalValue("returnValue"))}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("closing")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{formatCurrency(totalValue("closingValue"))}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("expiry")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{formatCurrency(totalValue("expiryValue"))}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("breakage")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{formatCurrency(totalValue("breakageValue"))}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{totalValue("batchRecall")}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.2)" }}>{formatCurrency(totalValue("batchRecallValue"))}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>--</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "right" }}>{totalValue("secondarySale")}</td>
                    </tr>
                  </tfoot>
                )}
              </table>

              {reportData.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #edf2f7", background: "#f8fafc", fontSize: 12, flexWrap: "wrap", gap: 12, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                  <div style={{ color: "#64748b" }}>
                    Showing <span style={{ fontWeight: 700, color: "#1e293b" }}>{(currentPage - 1) * pageSize + 1}</span> to <span style={{ fontWeight: 700, color: "#1e293b" }}>{Math.min(currentPage * pageSize, reportData.length)}</span> of <span style={{ fontWeight: 700, color: "#1e293b" }}>{reportData.length}</span> entries
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#64748b", marginRight: 6 }}>Items per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                      style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 8px", outline: "none", cursor: "pointer", color: "#475569", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
                    >
                      {PAGE_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div style={{ width: 12 }} />
                    <button type="button" onClick={() => goToPage(1)} disabled={currentPage === 1} style={pagBtnStyle}>First</button>
                    <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} /></button>
                    <div style={{ background: "#2563eb", color: "#fff", border: "1px solid #2563eb", borderRadius: 6, padding: "4px 12px", fontWeight: 700 }}>{currentPage}</div>
                    <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} style={{ ...pagBtnStyle, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} /></button>
                    <button type="button" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} style={pagBtnStyle}>Last</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const pagBtnStyle = { background: "#ffffff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569", fontFamily: "'Inter', sans-serif" };

// ─── Searchable Portal Configuration Dropdown Component ───
function FloatingDropdown({ label, options, value, onSelect, disabled }) {
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
          padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20
        }}
      >
        {label}
      </label>

      {isOpen && !disabled && createPortal(
        <div className="dc-portal-dropdown" style={{ position: "absolute", top: coords.top + 4, left: coords.left, width: coords.width }}>
          <ul style={{ maxHeight: 200, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none", background: "#ffffff" }}>
            {options.length === 0 ? (
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No options available</li>
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

// ═══════════════════════════════════════════════════════════════════
// MultiSelectDropdown — Searchable Portal Multi-Select Configuration Component
// ═══════════════════════════════════════════════════════════════════
function MultiSelectDropdown({ label, options, selectedIds, onChange, disabled = false }) {
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
    if (selectedIds.includes(value)) {
      onChange(selectedIds.filter((item) => item !== value));
      return;
    }
    onChange([...selectedIds, value]);
  };

  const selectAll = () => onChange(options.map((option) => option.id || option.value));
  const clearAll = () => onChange([]);

  const selectedLabel = options
    .filter((option) => selectedIds.includes(option.id || option.value))
    .map((option) => option.label)
    .join(", ");

  const hasValue = selectedIds.length > 0;
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
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: hasValue ? (disabled ? "#94a3b8" : "#1e293b") : "transparent", fontSize: 14 }}>
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
          padding: active ? "0 5px" : "0", transition: "all 0.12s ease-out", pointerEvents: "none", zIndex: 20
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
              <li style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No option available</li>
            ) : (
              options.map((option) => {
                const isSelected = selectedIds.includes(option.id || option.value);
                return (
                  <li
                    key={option.id || option.value}
                    className={`dc-opt${isSelected ? " selected" : ""}`}
                    style={{
                      padding: "10px 14px", fontSize: "13.5px", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "8px",
                      color: isSelected ? "#2563eb" : "#475569",
                      backgroundColor: isSelected ? "rgba(59,130,246,0.08)" : "#ffffff",
                      fontWeight: isSelected ? "600" : "500"
                    }}
                    onMouseDown={(e) => { e.preventDefault(); toggleValue(option.id || option.value); }}
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