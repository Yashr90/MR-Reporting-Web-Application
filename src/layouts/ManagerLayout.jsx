import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu, Bell, X, ChevronDown, LogOut, User,
  LayoutDashboard, ChevronRight,
  CalendarDays, Stethoscope, CalendarCheck, Receipt,
  ClipboardList, Eye, CalendarRange, Activity,
  Map, SlidersHorizontal, IndianRupee, BookOpen,
  ShoppingBag, UserCheck, FileCheck, Wallet,
  FilePlus, FileText, BarChart2
} from "lucide-react";
// import api from "../services/api";

/* ─── Font & Global Styles ───────────────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    .manager-layout { font-family: 'Inter', sans-serif; }
    .brand-font { font-family: 'Plus Jakarta Sans', sans-serif; }

    /* ── Sidebar scrollbar ── */
    .sidebar-scroll::-webkit-scrollbar { width: 4px; }
    .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
    .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
    .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }

    /* ── Main content scrollbar ── */
    .main-scroll::-webkit-scrollbar { width: 5px; }
    .main-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
    .main-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
    .main-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    .tooltip-shadow {
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* ── Header dropdown ── */
    @keyframes header-zoom { from{opacity:0;transform:scale(0.94) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
    .header-dropdown-anim { animation: header-zoom 0.18s cubic-bezier(0.34,1.56,0.64,1); }
    .header-dropdown-shadow { box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.06); }

    /* ── Notification badge pulse ── */
    @keyframes badge-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .badge-pulse { animation: badge-pulse 2s ease-in-out infinite; }
  `}</style>
);

export default function ManagerLayout() {
  const [sidebarOpen,        setSidebarOpen]        = useState(false);
  const [collapsed,          setCollapsed]          = useState(false);
  const [profileOpen,        setProfileOpen]        = useState(false);

  // Level 1 dropdowns
  const [reportAnalysisOpen, setReportAnalysisOpen] = useState(false);
  const [approvalMasterOpen, setApprovalMasterOpen] = useState(false);
  const [expenseOpen,        setExpenseOpen]        = useState(false);

  // Level 2 — Report Analysis sub-menus
  const [dcrOpen,            setDcrOpen]            = useState(false);
  const [providerReportOpen, setProviderReportOpen] = useState(false);
  const [tpReportOpen,       setTpReportOpen]       = useState(false);
  const [expenseReportOpen,  setExpenseReportOpen]  = useState(false);

  const [managerProfile, setManagerProfile] = useState({ name: "Loading...", initial: "" });
  const navigate   = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setManagerProfile({ name: "Manager User", initial: "M" });
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const toggleL1 = (menu) => {
    setReportAnalysisOpen(menu === "report"   ? !reportAnalysisOpen : false);
    setApprovalMasterOpen(menu === "approval" ? !approvalMasterOpen : false);
    setExpenseOpen(        menu === "expense" ? !expenseOpen        : false);
    if (menu !== "report") {
      setDcrOpen(false);
      setProviderReportOpen(false);
      setTpReportOpen(false);
      setExpenseReportOpen(false);
    }
  };

  const toggleL2 = (menu) => {
    setDcrOpen(            menu === "dcr"      ? !dcrOpen            : false);
    setProviderReportOpen( menu === "provider" ? !providerReportOpen : false);
    setTpReportOpen(       menu === "tp"       ? !tpReportOpen       : false);
    setExpenseReportOpen(  menu === "expense"  ? !expenseReportOpen  : false);
  };

  return (
    <>
      <FontStyle />
      <div className="manager-layout min-h-screen flex bg-[#f8fafc]">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════
            SIDEBAR — exact same as AdminLayout
        ══════════════════════════════════════════════════════════════ */}
        <aside className={`
          fixed lg:sticky top-0 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${collapsed ? "lg:w-[88px] overflow-visible" : "lg:w-[280px] overflow-hidden"}
          h-screen flex flex-col
          bg-[#1a1d27] border-r border-white/5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] select-none shadow-2xl lg:shadow-none
        `}>

          {/* ── Brand Header ── */}
          <div className={`
            flex items-center flex-shrink-0 h-[72px] px-6 border-b border-white/5
            ${collapsed ? "justify-center" : "justify-between"}
          `}>
            {!collapsed ? (
              <div className="flex items-center justify-between w-full animate-in fade-in duration-500">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#0284C7] to-[#0369A1] skew-x-[-12deg] rounded-lg shadow-lg shadow-sky-600/30">
                    <span className="relative text-white font-bold text-base brand-font skew-x-[12deg]">M</span>
                  </div>
                  <span className="text-white font-bold text-[16px] tracking-wide brand-font">Manager Panel</span>
                </div>
                <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block text-white/40 hover:text-white transition-colors">
                  <Menu size={18} />
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button onClick={() => setCollapsed(!collapsed)} className="text-white/40 hover:text-white transition-colors">
                <Menu size={20} />
              </button>
            )}
          </div>

          {/* ── Navigation ── */}
          <nav className={`flex-1 py-4 space-y-1 ${collapsed ? "overflow-visible" : "sidebar-scroll overflow-y-auto"}`}>

            <SidebarLink
              to="/manager/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              collapsed={collapsed}
            />

            {!collapsed && <SectionDivider label="ANALYTICS" />}

            <DropdownMenu
              icon={<Activity size={18} />}
              label="Report Analysis"
              collapsed={collapsed}
              isOpen={reportAnalysisOpen}
              toggle={() => toggleL1("report")}
            >
              <NestedDropdown icon={<CalendarDays size={15} />} label="Daily Call Reports" isOpen={dcrOpen} toggle={() => toggleL2("dcr")}>
                <SubLink to="/manager/reports/dcr-consolidate"         label="DCR Consolidate"               icon={<ClipboardList size={14} />} nested />
                <SubLink to="/manager/reports/team-attendance"         label="Team Attendance"               icon={<UserCheck size={14} />}     nested />
                <SubLink to="/manager/reports/financial-yearly-joint"  label="Financial Yearly Joint Work"   icon={<BarChart2 size={14} />}     nested />
                <SubLink to="/manager/reports/doctor-activity-yearly"  label="Doctor Activity Report Yearly" icon={<Stethoscope size={14} />}   nested />
                <SubLink to="/manager/reports/monthly-summary"         label="Monthly Summary Report"        icon={<FileText size={14} />}      nested />
                <SubLink to="/manager/reports/call-avg-working"        label="Call Avg. & Working Report"    icon={<Activity size={14} />}      nested />
              </NestedDropdown>

              <NestedDropdown icon={<Stethoscope size={15} />} label="Doctor/Chemist/Stockiest" isOpen={providerReportOpen} toggle={() => toggleL2("provider")}>
                <SubLink to="/manager/reports/view-doctor-chemist"     label="View Doctor/Chemist"            icon={<Eye size={14} />}           nested />
                <SubLink to="/manager/reports/doctor-visit"            label="Doctor Visit"                   icon={<Stethoscope size={14} />}   nested />
                <SubLink to="/manager/reports/chemist-stockiest-visit" label="Chemist/Stockiest Visit Report" icon={<Activity size={14} />}      nested />
                <SubLink to="/manager/reports/missed-doctor-chemist"   label="Missed Doctor/Chemist"          icon={<CalendarRange size={14} />} nested />
                <SubLink to="/manager/reports/station-details"         label="Station Details"                icon={<Map size={14} />}           nested />
              </NestedDropdown>

              <NestedDropdown icon={<CalendarCheck size={15} />} label="TP Reports" isOpen={tpReportOpen} toggle={() => toggleL2("tp")}>
                <SubLink to="/manager/reports/view-tp"                label="View TP"                icon={<Eye size={14} />} nested />
                <SubLink to="/manager/reports/tour-program-deviation"  label="Tour Program Deviation" icon={<Map size={14} />} nested />
              </NestedDropdown>

              <NestedDropdown icon={<Receipt size={15} />} label="Expense Reports" isOpen={expenseReportOpen} toggle={() => toggleL2("expense")}>
                <SubLink to="/manager/reports/view-expense" label="View Expense" icon={<Eye size={14} />} nested />
              </NestedDropdown>
            </DropdownMenu>

            {!collapsed && <SectionDivider label="CORE OPERATIONS" />}

            <DropdownMenu
              icon={<ShoppingBag size={18} />}
              label="Approval Master"
              collapsed={collapsed}
              isOpen={approvalMasterOpen}
              toggle={() => toggleL1("approval")}
            >
              <SubLink to="/manager/approval/master-data"      label="Master Data"          icon={<SlidersHorizontal size={15} />} />
              <SubLink to="/manager/approval/approve-tour"     label="Approve Tour Program" icon={<CalendarCheck size={15} />}    />
              <SubLink to="/manager/approval/sfc-approve"      label="SFC Approve"          icon={<FileCheck size={15} />}        />
              <SubLink to="/manager/approval/finalize-expense" label="Finalize Expense"     icon={<Wallet size={15} />}           />
            </DropdownMenu>

            <DropdownMenu
              icon={<IndianRupee size={18} />}
              label="Expense"
              collapsed={collapsed}
              isOpen={expenseOpen}
              toggle={() => toggleL1("expense")}
            >
              <SubLink to="/manager/expense/create-stp"  label="Create STP"  icon={<FilePlus size={15} />}  />
              <SubLink to="/manager/expense/sfc-details" label="SFC Details" icon={<FileText size={15} />}  />
            </DropdownMenu>

            {!collapsed && <SectionDivider label="RESOURCES" />}

            <SidebarLink
              to="/manager/hr-policy"
              icon={<BookOpen size={18} />}
              label="HR Policy"
              collapsed={collapsed}
            />
          </nav>

          {/* ── Sidebar User Bottom Area ── */}
          <div className="mt-auto px-4 py-4 border-t border-white/5 bg-[#1a1d27]">
            <div className={`
              flex items-center gap-3 py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all
              ${collapsed ? "justify-center" : "cursor-pointer group"}
            `}>
              <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white font-bold text-[14px] shadow-md flex-shrink-0">
                {managerProfile.initial}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[13.5px] font-medium truncate group-hover:text-[#0284C7] transition-colors brand-font">
                    {managerProfile.name}
                  </p>
                  <p className="text-white/40 text-[11px] font-normal tracking-wide">Manager</p>
                </div>
              )}
              {!collapsed && (
                <button onClick={handleLogout} className="p-1.5 text-white/40 hover:text-white transition-colors">
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════
            MAIN CONTENT AREA — exact same as AdminLayout
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

          {/* ── Header ── */}
          <header
            className="h-[72px] bg-white border-b border-[#edf2f7] flex items-center justify-between px-6 z-30 sticky top-0"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:flex flex-col justify-center">
                <h1 className="brand-font text-[15px] text-[#1e293b] leading-tight" style={{ fontWeight: 700 }}>
                  Dashboard Overview
                </h1>
                <p className="text-[11.5px] text-[#94a3b8] font-normal leading-tight mt-0.5">
                  Welcome back, {managerProfile.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              {/* Notification Bell */}
              <button className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <Bell size={19} strokeWidth={1.8} />
                <span className="badge-pulse absolute top-[9px] right-[9px] w-[7px] h-[7px] bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl border border-transparent hover:border-[#edf2f7] hover:bg-slate-50 transition-all"
                >
                  <div
                    className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0"
                    style={{ boxShadow: "0 3px 8px rgba(2,132,199,0.30)" }}
                  >
                    {managerProfile.initial}
                  </div>
                  <div className="hidden sm:flex flex-col justify-center text-left">
                    <p className="brand-font text-[13.5px] text-[#1e293b] leading-tight" style={{ fontWeight: 600 }}>
                      {managerProfile.name}
                    </p>
                    <p className="text-[11px] text-[#94a3b8] leading-tight font-normal">Manager</p>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-slate-400 transition-transform duration-200 hidden sm:block ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="header-dropdown-anim header-dropdown-shadow absolute top-[calc(100%+8px)] right-0 w-56 bg-white rounded-2xl border border-[#edf2f7] py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#f1f5f9]">
                      <p className="text-[10px] text-[#0284C7] uppercase tracking-wider mb-1 brand-font" style={{ fontWeight: 600 }}>
                        Account
                      </p>
                      <p className="text-[13.5px] text-[#1e293b] brand-font" style={{ fontWeight: 600 }}>
                        {managerProfile.name}
                      </p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">Manager</p>
                    </div>

                    <button
                      onClick={() => { setProfileOpen(false); navigate("/manager/profile"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#64748b] hover:bg-slate-50 hover:text-[#1e293b] transition-colors"
                    >
                      <User size={14} className="text-slate-400" />
                      My Profile
                    </button>

                    <div className="mx-3 my-1 h-px bg-[#f1f5f9]" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors brand-font"
                      style={{ fontWeight: 500 }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ── Main Content ── */}
          <main className="main-scroll flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

/* ─── Sidebar Helper Components — exact same as AdminLayout ──────────────── */

function SectionDivider({ label }) {
  return (
    <div className="px-6 pt-5 pb-2 flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0284C7]/70">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#0284C7]/15"></div>
    </div>
  );
}

function SidebarLink({ to, icon, label, collapsed, badge }) {
  return (
    <div className="px-3 mb-0.5 relative group">
      <NavLink
        to={to}
        className={({ isActive }) => `
          flex items-center gap-3 px-3 py-[10px] rounded-[12px] transition-all duration-150 text-[13.5px] font-medium
          ${isActive
            ? "bg-[#0284C7]/15 text-[#7dd3fc] border border-sky-600/20"
            : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"}
          ${collapsed ? "justify-center px-0 w-11 h-11 mx-auto" : ""}
        `}
      >
        <div className="flex-shrink-0">{icon}</div>
        {!collapsed && <span className="tracking-wide whitespace-nowrap flex-1">{label}</span>}
        {!collapsed && badge === "live" && (
          <span className="border border-blue-500/30 text-blue-400 bg-blue-500/10 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
            {badge}
          </span>
        )}
        {!collapsed && badge && badge !== "live" && (
          <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full lowercase tracking-wide shadow-sm">
            {badge}
          </span>
        )}
      </NavLink>

      {collapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-[#12151e] text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap tooltip-shadow">
          {label}
        </div>
      )}
    </div>
  );
}

function DropdownMenu({ icon, label, collapsed, isOpen, toggle, children }) {
  return (
    <div className="mb-0.5">
      <div className="px-3 relative group">
        <button
          onClick={toggle}
          className={`
            w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] transition-all duration-150 text-[13.5px] font-medium border border-transparent
            ${isOpen
              ? "text-[#7dd3fc] bg-white/5"
              : "text-white/60 hover:bg-white/5 hover:text-white"}
            ${collapsed ? "justify-center px-0 w-11 h-11 mx-auto" : ""}
          `}
        >
          <div className="flex-shrink-0">{icon}</div>
          {!collapsed && <span className="tracking-wide text-left flex-1">{label}</span>}
          {!collapsed && (
            <ChevronRight size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-90 text-[#0284C7]" : "text-white/30 group-hover:text-white"}`} />
          )}
        </button>

        {collapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-[#12151e] text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap tooltip-shadow">
            {label}
          </div>
        )}
      </div>

      {!collapsed && isOpen && (
        <div className="mt-1 pb-1 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function NestedDropdown({ label, isOpen, toggle, icon, children }) {
  return (
    <div className="mb-0.5">
      <div className="px-3">
        <button
          onClick={toggle}
          className={`
            group w-full flex items-center justify-between px-3 py-[9px] pl-8 rounded-[10px] text-[13px] font-medium transition-all duration-150
            ${isOpen ? "text-[#7dd3fc]" : "text-white/50 hover:bg-white/5 hover:text-white"}
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className={`flex-shrink-0 transition-colors ${isOpen ? "text-[#0284C7]" : "text-white/20 group-hover:text-white/60"}`}>
              {icon}
            </div>
            <span>{label}</span>
          </div>
          <ChevronRight size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-90 text-[#0284C7]" : "text-white/20 group-hover:text-white/60"}`} />
        </button>
      </div>

      {isOpen && (
        <div className="mt-0.5 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function SubLink({ to, label, nested, icon }) {
  return (
    <div className="px-3 mb-0.5">
      <NavLink
        to={to}
        className={({ isActive }) => `
          group flex items-center w-full px-3 py-[8px] rounded-[10px] text-[13px] font-medium transition-all duration-150
          ${nested ? "pl-10" : "pl-8"}
          ${isActive
            ? "bg-sky-600/10 text-[#7dd3fc]"
            : "text-white/40 hover:bg-white/5 hover:text-[#7dd3fc]"}
        `}
      >
        {({ isActive }) => (
          <div className="flex items-center gap-2.5">
            <div className={`flex-shrink-0 transition-colors ${isActive ? "text-[#0284C7]" : "text-white/20 group-hover:text-[#7dd3fc]"}`}>
              {icon}
            </div>
            <span className="truncate">{label}</span>
          </div>
        )}
      </NavLink>
    </div>
  );
}