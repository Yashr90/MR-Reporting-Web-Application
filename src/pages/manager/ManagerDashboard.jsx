import React, { useState, useEffect } from "react";
import { 
  Users, 
  CalendarCheck, 
  FileCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  AlertCircle 
} from "lucide-react";

export default function ManagerDashboard() {
  // Stat data configuration matching the Manager Panel operations
  const stats = [
    {
      title: "Active Field Team (MRs)",
      value: "12",
      change: "+2 this week",
      icon: <Users className="text-[#0D9488]" size={24} />,
      bgColor: "bg-teal-50",
    },
    {
      title: "Pending Tour Programs",
      value: "4",
      change: "Requires review",
      icon: <CalendarCheck className="text-amber-500" size={24} />,
      bgColor: "bg-amber-50",
    },
    {
      title: "Pending SFC Approvals",
      value: "8",
      change: "3 urgent",
      icon: <FileCheck className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Monthly Team Target",
      value: "78%",
      change: "On track for May",
      icon: <TrendingUp className="text-emerald-500" size={24} />,
      bgColor: "bg-emerald-50",
    },
  ];

  // Dummy data for urgent alerts/actions
  const pendingActions = [
    { id: 1, mr: "Rahul Sharma", type: "Tour Program", date: "Today, 11:30 AM", status: "Pending Approval" },
    { id: 2, mr: "Priya Patel", type: "SFC Expense", date: "Yesterday", status: "High Amount Alert" },
    { id: 3, mr: "Amit Singh", type: "DCR Missed", date: "21 May 2026", status: "Needs Review" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight brand-font">
          Welcome Back, Manager
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Here is your team's operational overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-slate-800 brand-font">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Clock size={14} className="text-slate-400" />
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Insights Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Action Items Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0D9488]" />
              <h3 className="text-base font-bold text-slate-800 brand-font">Immediate Actions Required</h3>
            </div>
            <button className="text-xs font-bold text-[#0D9488] hover:underline flex items-center gap-0.5">
              View All Approvals <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {pendingActions.map((action) => (
              <div key={action.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                    <AlertCircle size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{action.mr}</h4>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{action.type} • {action.date}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#0D9488] bg-[#0D9488]/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {action.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights Sidebar Panel */}
        <div className="bg-[#282B3A] text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle design element to copy layout aesthetic */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#0D9488]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="w-8 h-8 flex items-center justify-center bg-[#0D9488] skew-x-[-12deg] rounded-sm shadow-sm mb-6">
              <span className="relative text-white font-extrabold text-sm brand-font skew-x-[12deg]">M</span>
            </div>
            <h3 className="text-lg font-bold brand-font tracking-wide mb-2">Field Force Performance</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Your overall zone report indicates a 14% improvement in missed doctor updates compared to last month. Keep tracking daily DCR consolidations to maintain synchronization.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Monthly Target Progress</span>
              <span className="text-[#0D9488]">78% Completed</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0D9488] h-full rounded-full transition-all duration-500" style={{ width: "78%" }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}