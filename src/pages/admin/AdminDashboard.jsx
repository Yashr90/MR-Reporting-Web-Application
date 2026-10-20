import React, { useState, useEffect } from "react";
import {
  Users, Stethoscope, FileText, IndianRupee,
  TrendingUp, AlertCircle, Loader2, Activity,
  ArrowUpRight, Bell
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import api from "../../services/api";

// ─── Custom Tooltip Styles ────────────────────────────────────────────────────
const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  padding: "10px 14px",
  fontSize: "13px",
  background: "#fff",
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({ totalMrs: 0, activeMrs: 0, dcrsToday: 0, totalSales: 0 });
  const [targetData, setTargetData] = useState([]);
  const [dcrStatusData, setDcrStatusData] = useState([]);
  const [visitTrendData, setVisitTrendData] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        /*
        const response = await api.get('/api/admin/dashboard');
        if (response.data.success) {
          setStats(response.data.data.stats);
          setTargetData(response.data.data.targetData);
          setDcrStatusData(response.data.data.dcrStatusData);
          setVisitTrendData(response.data.data.visitTrendData);
          setRecentAlerts(response.data.data.recentAlerts);
        }
        */

        await new Promise(resolve => setTimeout(resolve, 800));

        setStats({ totalMrs: 145, activeMrs: 124, dcrsToday: 98, totalSales: 1250000 });

        setTargetData([
          { month: "Jan", target: 400000, achieved: 450000 },
          { month: "Feb", target: 450000, achieved: 420000 },
          { month: "Mar", target: 500000, achieved: 550000 },
        ]);

        setDcrStatusData([
          { name: "Submitted", value: 65, color: "#0d9488" },
          { name: "Pending", value: 20, color: "#f59e0b" },
          { name: "Locked", value: 8, color: "#f43f5e" },
          { name: "Leave", value: 5, color: "#94a3b8" }
        ]);

        setVisitTrendData([
          { day: "Mon", visits: 310 }, { day: "Tue", visits: 420 },
          { day: "Wed", visits: 380 }, { day: "Thu", visits: 450 },
          { day: "Fri", visits: 390 }, { day: "Sat", visits: 150 },
        ]);

        setRecentAlerts([
          { id: 1, msg: "5 Tour Plans pending approval for North Zone", time: "2 hours ago" },
          { id: 2, msg: "Stock discrepancy reported by Swati", time: "5 hours ago" },
          { id: 3, msg: "Monthly Target data updated", time: "1 day ago" }
        ]);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 min-h-[60vh]">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity size={18} className="text-orange-500" />
          </div>
        </div>
        <p className="text-sm text-slate-400 font-medium tracking-wide">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 p-6 space-y-7">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Live
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-400 text-sm mt-0.5">Real-time tracking of MR performance and DCR statuses.</p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Today</p>
            <p className="text-sm font-semibold text-slate-700">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <button className="relative p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-orange-600 hover:border-orange-200 hover:shadow-md transition-all duration-200">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
          </button>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Active MRs"
          value={`${stats.activeMrs} / ${stats.totalMrs}`}
          subtitle="Available in field"
          trend="+3 this week"
          icon={<Users size={20} />}
          gradient="from-blue-500 to-blue-600"
          lightBg="bg-blue-50"
          textColor="text-blue-600"
          glowColor="shadow-blue-100"
        />
        <StatCard
          title="DCRs Today"
          value={stats.dcrsToday}
          subtitle="+12% from yesterday"
          trend="↑ 12%"
          icon={<FileText size={20} />}
          gradient="from-teal-500 to-teal-600"
          lightBg="bg-teal-50"
          textColor="text-teal-600"
          glowColor="shadow-teal-100"
        />
        <StatCard
          title="Doctor Visits"
          value="1,840"
          subtitle="This week"
          trend="↑ 8%"
          icon={<Stethoscope size={20} />}
          gradient="from-violet-500 to-violet-600"
          lightBg="bg-violet-50"
          textColor="text-violet-600"
          glowColor="shadow-violet-100"
        />
        <StatCard
          title="Monthly Sales"
          value={`₹${(stats.totalSales / 100000).toFixed(1)}L`}
          subtitle="85% of target"
          trend="85% achieved"
          icon={<IndianRupee size={20} />}
          gradient="from-emerald-500 to-emerald-600"
          lightBg="bg-emerald-50"
          textColor="text-emerald-600"
          glowColor="shadow-emerald-100"
        />
      </div>

      {/* ── Main Charts Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Target vs Achievement */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-100">
                <TrendingUp size={17} className="text-orange-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Target vs Achievement</h3>
                <p className="text-xs text-slate-400 mt-0.5">Quarterly performance</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              Q1 2025
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetData} barGap={6}>
                <defs>
                  <linearGradient id="barTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  <linearGradient id="barAchieved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7043" />
                    <stop offset="100%" stopColor="#f4511e" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} dx={-8} />
                <Tooltip cursor={{ fill: '#f8fafc', radius: 6 }} contentStyle={tooltipStyle} formatter={(v) => [`₹${(v / 1000).toFixed(0)}k`]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#64748b" }} />
                <Bar dataKey="target" name="Target" fill="url(#barTarget)" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar dataKey="achieved" name="Achieved" fill="url(#barAchieved)" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DCR Status Donut */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
              <FileText size={17} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Today's DCR Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">Breakdown by category</p>
            </div>
          </div>

          <div className="flex-1 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {dcrStatusData.map((entry, i) => (
                    <filter key={i} id={`glow-${i}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  ))}
                </defs>
                <Pie data={dcrStatusData} innerRadius={52} outerRadius={72} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {dcrStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {dcrStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-500 truncate">{item.name}</span>
                <span className="text-xs font-bold text-slate-800 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Visit Trend Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                <Activity size={17} className="text-teal-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Doctor Visit Trends</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Total Visits
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitTrendData}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-8} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="visits"
                  name="Total Visits"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2.5 }}
                  activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-50 border border-red-100">
                <AlertCircle size={17} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">System Alerts</h3>
                <p className="text-xs text-slate-400 mt-0.5">{recentAlerts.length} active</p>
              </div>
            </div>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
              {recentAlerts.length}
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto flex-1 max-h-60 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
            {recentAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className="group flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50/50 border border-red-100 hover:border-red-200 hover:from-red-100/80 transition-all duration-200 cursor-default"
              >
                <div className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium leading-snug">{alert.msg}</p>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5">
            View all alerts
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Stat Card ───────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, trend, icon, gradient, lightBg, textColor, glowColor }) {
  return (
    <div className={`group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:${glowColor} hover:-translate-y-1 transition-all duration-300 overflow-hidden p-5`}>
      {/* Subtle gradient accent bar at top */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight truncate">{value}</h3>
        </div>
        <div className={`flex-shrink-0 p-3 rounded-2xl ${lightBg} ${textColor} border border-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">{subtitle}</p>
        <span className={`text-xs font-bold ${textColor} ${lightBg} px-2 py-0.5 rounded-full`}>
          {trend}
        </span>
      </div>
    </div>
  );
}