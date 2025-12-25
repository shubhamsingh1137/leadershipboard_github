import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Building2,
  Briefcase,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import api from "../../api/Api";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    loading: true,
  });

  // Fetching real-time data from API
  const fetchDashboardData = async () => {
    try {
      setStatsData((prev) => ({ ...prev, loading: true }));
      const response = await api.get("/admin/employees");

      // Counting data from the same endpoint used in Employee page
      setStatsData({
        totalEmployees: response.data.data.length,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStatsData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const navigate = useNavigate();

  const stats = [
    {
      id: 1,
      name: "Total Employees",
      value: statsData.loading ? "..." : statsData.totalEmployees,
      change: "+12% last month",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      id: 2,
      name: "Active Projects",
      value: "18",
      change: "4 ending soon",
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      id: 3,
      name: "Open Positions",
      value: "05",
      change: "2 new today",
      icon: UserPlus,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      id: 4,
      name: "Office Locations",
      value: "03",
      change: "Domestic & Int.",
      icon: Building2,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-blue-800 p-8 rounded-4xl shadow-2xl text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-100 mb-2">
            <TrendingUp size={18} />
            <span className="text-sm font-medium tracking-wider uppercase">
              Overview Dashboard
            </span>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            Welcome Back, Admin 👋
          </h1>
          <p className="text-indigo-100/80 max-w-lg leading-relaxed">
            Your organization is growing! You have{" "}
            <span className="text-white font-bold underline decoration-indigo-400 decoration-2 underline-offset-4">
              {statsData.totalEmployees} active employees
            </span>{" "}
          </p>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 right-12 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors`}
              >
                <stat.icon size={24} />
              </div>
              <span
                onClick={() => navigate("/admin/employees")}
                className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all"
              >
                <ArrowUpRight size={12} className="mr-1" /> View Details
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {stat.name}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-800">
                  {stat.value}
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2 flex items-center">
                <Clock size={12} className="mr-1" /> {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
