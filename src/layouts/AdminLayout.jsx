import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu, Bell, X, ChevronDown, LogOut, User, Users,
  LayoutDashboard, LocateFixed, SlidersHorizontal, Database,
  CheckSquare, IndianRupee, Package, Target, ChevronRight,
  FileText, CalendarDays, Stethoscope, Clock, CalendarOff,
  PieChart, Box, TrendingUp, UserCog, BadgeCheck, UserPlus,
  Map, MapPin, RefreshCcw, ArrowRightLeft, LockOpen, Network,
  Route, Radio, DatabaseZap, CalendarCheck, CheckCircle,
  Banknote, Edit, Eye, Waypoints, Trash2, Send, Edit3
} from "lucide-react";

/* ─── Font & Global Styles ───────────────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    /* ── Layout root: Inter for body, Plus Jakarta Sans for brand/headings ── */
    .mr-layout {
      font-family: 'Inter', sans-serif;
    }

    .brand-font {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* ── Sidebar scrollbar ── */
    .sidebar-scroll::-webkit-scrollbar { width: 4px; }
    .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
    .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
    .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }

    /* ── Main content scrollbar (white theme) ── */
    .main-scroll::-webkit-scrollbar { width: 5px; }
    .main-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
    .main-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
    .main-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    .tooltip-shadow {
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* ── Header profile dropdown ── */
    .header-dropdown-shadow {
      box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.06);
    }

    @keyframes layout-zoom { from{opacity:0;transform:scale(0.94) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
    .header-dropdown-anim { animation: layout-zoom 0.18s cubic-bezier(0.34,1.56,0.64,1); }

    /* ── Notification badge pulse ── */
    @keyframes badge-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .badge-pulse { animation: badge-pulse 2s ease-in-out infinite; }
  `}</style>
);

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Level 1 dropdowns
  const [reportAnalysisOpen, setReportAnalysisOpen] = useState(false);
  const [masterCreationsOpen, setMasterCreationsOpen] = useState(false);
  const [approvalMasterOpen, setApprovalMasterOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);

  // Level 2 — Report Analysis
  const [dcrOpen, setDcrOpen] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [productReportOpen, setProductReportOpen] = useState(false);
  const [targetAchievementOpen, setTargetAchievementOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  // Level 2 — Master Creations
  const [crmMasterOpen, setCrmMasterOpen] = useState(false);

  const [adminProfile, setAdminProfile] = useState({ name: "Loading...", initial: "" });
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setAdminProfile({ name: "Admin", initial: "A" });
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
    setReportAnalysisOpen(menu === 'report' ? !reportAnalysisOpen : false);
    setMasterCreationsOpen(menu === 'master' ? !masterCreationsOpen : false);
    setApprovalMasterOpen(menu === 'approval' ? !approvalMasterOpen : false);
    setExpenseOpen(menu === 'expense' ? !expenseOpen : false);
    setStockOpen(menu === 'stock' ? !stockOpen : false);
    setTargetOpen(menu === 'target' ? !targetOpen : false);
  };

  const toggleL2 = (menu) => {
    setDcrOpen(menu === 'dcr' ? !dcrOpen : false);
    setProviderOpen(menu === 'provider' ? !providerOpen : false);
    setAttendanceOpen(menu === 'attendance' ? !attendanceOpen : false);
    setLeaveOpen(menu === 'leave' ? !leaveOpen : false);
    setProductReportOpen(menu === 'product' ? !productReportOpen : false);
    setTargetAchievementOpen(menu === 'targetAch' ? !targetAchievementOpen : false);
    setUserDetailsOpen(menu === 'user' ? !userDetailsOpen : false);
    setCrmMasterOpen(menu === 'crm' ? !crmMasterOpen : false);
  };

  return (
    <>
      <FontStyle />
      <div className="mr-layout min-h-screen flex bg-[#f8fafc]">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════
            SIDEBAR — UNCHANGED (dark #1a1d27 scheme)
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
                  <span className="text-white font-bold text-[16px] tracking-wide brand-font">Admin Panel</span>
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
            <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" collapsed={collapsed} />
            <SidebarLink to="/admin/live-tracking" icon={<LocateFixed size={18} />} label="Live Tracking" collapsed={collapsed} badge="live" />

            {!collapsed && <SectionDivider label="REPORTS OUTCOME" />}

            <DropdownMenu icon={<SlidersHorizontal size={18} />} label="Report Analysis"
              collapsed={collapsed} isOpen={reportAnalysisOpen} toggle={() => toggleL1('report')}>

              <NestedDropdown icon={<CalendarDays size={15} />} label="Daily Call Reports" isOpen={dcrOpen} toggle={() => toggleL2('dcr')}>
                <SubLink to="/admin/reports/dcr-consolidate" label="DCR Consolidate" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/dump-dcr" label="Dump DCR Report" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/monthly-summary" label="Monthly Summary Report" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/doctor-call-yearly" label="Doctor Call Yearly" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/daily-basic-dcr" label="Daily Basic DCR" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/dcr-status" label="DCR Status Report" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/employee-analysis" label="Employee Analysis" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/dcr-doctor-wise" label="DCR Doctor Wise" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/dcr-fy-wise" label="DCR Financial Year" icon={<FileText size={14}/>} nested />
              </NestedDropdown>

              <NestedDropdown icon={<Stethoscope size={15} />} label="Provider Reports" isOpen={providerOpen} toggle={() => toggleL2('provider')}>
                <SubLink to="/admin/reports/view-provider" label="View Provider" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/doctor-visit" label="Doctor Visit" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/chemist-visit" label="Chemist/Stockist Visit" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/missed-provider" label="Missed Provider" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/provider-analysis" label="Provider Analysis" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/consolidated-pob" label="Consolidated POB" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/pob-manager-wise" label="POB Manager Wise" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/pob-employee-wise" label="Employee Wise POB" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/pob-product-wise" label="ProductWise POB" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/update-provider-status" label="Update Status" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/speciality-doctor-report" label="Speciality Report" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/speciality-doctor-visit" label="Speciality Visit" icon={<FileText size={14}/>} nested />
              </NestedDropdown>

              <NestedDropdown icon={<Clock size={15} />} label="Attendance Reports" isOpen={attendanceOpen} toggle={() => toggleL2('attendance')}>
                <SubLink to="/admin/reports/holiday" label="Holiday Report" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/view-attendance" label="View Attendance" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/view-dcr-attendance" label="View DCR Attendance" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/view-day-plan" label="View Day Plan" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/employee-duration" label="Working Duration" icon={<FileText size={14}/>} nested />
              </NestedDropdown>

              <NestedDropdown icon={<CalendarOff size={15} />} label="Leave Reports" isOpen={leaveOpen} toggle={() => toggleL2('leave')}>
                <SubLink to="/admin/reports/leave-assign" label="Leave Assign" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/leave-overview" label="Leave Overview" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/date-wise-leave" label="Date Wise Status" icon={<FileText size={14}/>} nested />
              </NestedDropdown>

              <SubLink to="/admin/reports/crm" label="CRM Reports" icon={<PieChart size={15} />} />

              <NestedDropdown icon={<Box size={15} />} label="Product Reports" isOpen={productReportOpen} toggle={() => toggleL2('product')}>
                <SubLink to="/admin/reports/product-view" label="Product View" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/add-focus-product" label="Add Focus Product" icon={<FileText size={14}/>} nested />
              </NestedDropdown>

              <SubLink to="/admin/reports/sales" label="Sales Reports" icon={<TrendingUp size={15} />} />

              <NestedDropdown icon={<Target size={15} />} label="Target vs Achievements" isOpen={targetAchievementOpen} toggle={() => toggleL2('targetAch')}>
                <SubLink to="/admin/reports/stp-status" label="STP Status Reports" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/stp-details" label="STP Details" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/view-expense" label="View Expense" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/employee-salary" label="Employee Salary Slip" icon={<FileText size={14}/>} nested />
              </NestedDropdown>

              <NestedDropdown icon={<UserCog size={15} />} label="User Details" isOpen={userDetailsOpen} toggle={() => toggleL2('user')}>
                <SubLink to="/admin/reports/user-information" label="User Information" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/resign-reports" label="Resign Reports" icon={<FileText size={14}/>} nested />
                <SubLink to="/admin/reports/user-master-data" label="Master Data" icon={<FileText size={14}/>} nested />
              </NestedDropdown>
            </DropdownMenu>

            {!collapsed && <SectionDivider label="MASTERS" />}

            <DropdownMenu icon={<Database size={18} />} label="Master Creations"
              collapsed={collapsed} isOpen={masterCreationsOpen} toggle={() => toggleL1('master')}>
              <SubLink to="/admin/masters/designation" label="Designation Creation" icon={<BadgeCheck size={15} />} />
              <SubLink to="/admin/masters/users/create" label="User Creation" icon={<UserPlus size={15} />} />
              <SubLink to="/admin/masters/areas" label="Area Creation" icon={<Map size={15} />} />
              <SubLink to="/admin/masters/doctors" label="Doctor/Chemist Creation" icon={<Stethoscope size={15} />} />
              <SubLink to="/admin/masters/headquarter-mapping" label="Headquarter Mapping" icon={<MapPin size={15} />} />
              <SubLink to="/admin/masters/change-headquarter" label="Change Headquarter" icon={<RefreshCcw size={15} />} />
              <SubLink to="/admin/masters/transfer" label="Master Data Transfer" icon={<ArrowRightLeft size={15} />} />
              <SubLink to="/admin/masters/lock-unlock" label="Lock Open" icon={<LockOpen size={15} />} />
              <SubLink to="/admin/masters/hierarchy-management" label="Update Hierarchy" icon={<Network size={15} />} />
              <SubLink to="/admin/masters/stp" label="STP Creation" icon={<Route size={15} />} />
              <SubLink to="/admin/masters/product-creation" label="Product Creation" icon={<Box size={15} />} />
              <SubLink to="/admin/masters/broadcast" label="Broadcast Message" icon={<Radio size={15} />} />
            </DropdownMenu>

            <DropdownMenu icon={<CheckSquare size={18} />} label="Approval Master"
              collapsed={collapsed} isOpen={approvalMasterOpen} toggle={() => toggleL1('approval')}>
              <SubLink to="/admin/approvals/master-data" label="Master Data" icon={<DatabaseZap size={15} />} />
              <SubLink to="/admin/approvals/tour-program" label="Approve Tour Program" icon={<CalendarCheck size={15} />} />
              <SubLink to="/admin/approvals/stp" label="STP Approve" icon={<CheckCircle size={15} />} />
            </DropdownMenu>

            <DropdownMenu icon={<IndianRupee size={18} />} label="Expense"
              collapsed={collapsed} isOpen={expenseOpen} toggle={() => toggleL1('expense')}>
              <SubLink to="/admin/expenses/fare-rate-card" label="Fare Rate Card" icon={<Banknote size={15} />} />
              <SubLink to="/admin/expense/statewise-da" label="StateWise DA" icon={<MapPin size={15} />} />
            </DropdownMenu>

            <DropdownMenu icon={<Package size={18} />} label="Stock-Sales & Statement"
              collapsed={collapsed} isOpen={stockOpen} toggle={() => toggleL1('stock')}>
              <SubLink to="/admin/stock/submit-modify" label="Submit & Modify" icon={<Edit size={15} />} />
              <SubLink to="/admin/stock/view" label="View Stock" icon={<Eye size={15} />} />
              <SubLink to="/admin/stock/user-stockist-mapping" label="Stockist Mapping" icon={<Waypoints size={15} />} />
              <SubLink to="/admin/stock/mapping-deletion-report" label="Deletion Report" icon={<Trash2 size={15} />} />
            </DropdownMenu>

            <DropdownMenu icon={<Target size={18} />} label="Target"
              collapsed={collapsed} isOpen={targetOpen} toggle={() => toggleL1('target')}>
              <SubLink to="/admin/target/submission" label="1. Submission" icon={<Send size={15} />} />
              <SubLink to="/admin/target/modify" label="2. Modify" icon={<Edit3 size={15} />} />
              <SubLink to="/admin/target/view" label="3. View" icon={<Eye size={15} />} />
            </DropdownMenu>
          </nav>

          {/* ── Sidebar User Bottom Area ── */}
          <div className="mt-auto px-4 py-4 border-t border-white/5 bg-[#1a1d27]">
            <div className={`
              flex items-center gap-3 py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all
              ${collapsed ? "justify-center" : "cursor-pointer group"}
            `}>
              <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white font-bold text-[14px] shadow-md flex-shrink-0">
                {adminProfile.initial}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[13.5px] font-medium truncate group-hover:text-[#0284C7] transition-colors brand-font">{adminProfile.name}</p>
                  <p className="text-white/40 text-[11px] font-normal tracking-wide">Administrator</p>
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
            MAIN CONTENT AREA — WHITE THEME
            ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

          {/* ── Header — White Theme ── */}
          <header className="h-[72px] bg-white border-b border-[#edf2f7] flex items-center justify-between px-6 z-30 sticky top-0"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <Menu size={20} />
              </button>

              {/* Page title */}
              <div className="hidden md:flex flex-col justify-center">
                <h1 className="brand-font text-[15px] font-700 text-[#1e293b] leading-tight" style={{ fontWeight: 700 }}>
                  Dashboard Overview
                </h1>
                <p className="text-[11.5px] text-[#94a3b8] font-normal leading-tight mt-0.5">
                  Welcome back, {adminProfile.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              {/* Notification Bell */}
              <button className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <Bell size={19} strokeWidth={1.8} />
                <span className="badge-pulse absolute top-[9px] right-[9px] w-[7px] h-[7px] bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl border border-transparent hover:border-[#edf2f7] hover:bg-slate-50 transition-all"
                >
                  {/* Avatar */}
                  <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0"
                    style={{ boxShadow: "0 3px 8px rgba(2,132,199,0.30)" }}>
                    {adminProfile.initial}
                  </div>
                  <div className="hidden sm:flex flex-col justify-center text-left">
                    <p className="brand-font text-[13.5px] font-600 text-[#1e293b] leading-tight" style={{ fontWeight: 600 }}>
                      {adminProfile.name}
                    </p>
                    <p className="text-[11px] text-[#94a3b8] leading-tight font-normal">Administrator</p>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-slate-400 transition-transform duration-200 hidden sm:block ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                {profileOpen && (
                  <div className="header-dropdown-anim header-dropdown-shadow absolute top-[calc(100%+8px)] right-0 w-56 bg-white rounded-2xl border border-[#edf2f7] py-2 z-50">
                    {/* User info row */}
                    <div className="px-4 py-3 border-b border-[#f1f5f9]">
                      <p className="text-[10px] font-600 text-[#0284C7] uppercase tracking-wider mb-1 brand-font" style={{ fontWeight: 600 }}>
                        Account
                      </p>
                      <p className="text-[13.5px] font-600 text-[#1e293b] brand-font" style={{ fontWeight: 600 }}>
                        {adminProfile.name}
                      </p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">Administrator</p>
                    </div>

                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#64748b] hover:bg-slate-50 hover:text-[#1e293b] transition-colors">
                      <User size={14} className="text-slate-400" />
                      Profile Settings
                    </button>

                    <div className="mx-3 my-1 h-px bg-[#f1f5f9]" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors font-500 brand-font"
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

          {/* ── Main Content — White / light-grey background ── */}
          <main className="main-scroll flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

/* ─── Sidebar Helper Components — UNCHANGED ──────────────────────────────── */

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
            ? "bg-sky-600/15 text-[#7dd3fc] border border-sky-600/20"
            : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"}
          ${collapsed ? "justify-center px-0 w-11 h-11 mx-auto" : ""}
        `}
      >
        <div className="flex-shrink-0">{icon}</div>
        {!collapsed && <span className="tracking-wide whitespace-nowrap flex-1">{label}</span>}

        {!collapsed && badge === "live" && (
          <span className="border border-sky-500/30 text-sky-400 bg-sky-500/10 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
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
            <div className={`flex-shrink-0 transition-colors ${isActive ? "text-[#0284C7]" : "text-white/20 group-hover:text-[#0284C7]"}`}>
              {icon}
            </div>
            <span className="truncate">{label}</span>
          </div>
        )}
      </NavLink>
    </div>
  );
}