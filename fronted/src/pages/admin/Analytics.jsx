import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  Layers,
  CheckCircle,
  Briefcase,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import api from "../../api/Api.js"; // Aapka API instance
import Swal from "sweetalert2";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/analytics");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Analytics Error:", error);
      Swal.fire("Error", "Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  // Chart Colors
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              System Insights
            </h1>
            <p className="text-slate-500 font-medium">
              Real-time performance metrics of squads & tasks
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            <TrendingUp size={16} /> Refresh Data
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Squads"
            value={data?.summary?.total_groups || 0}
            icon={<Layers className="text-indigo-600" />}
            sub="Active team units"
            color="bg-indigo-50"
          />
          <StatCard
            title="Active Projects"
            value={data?.summary?.active_projects || 0}
            icon={<Briefcase className="text-emerald-600" />}
            sub="Projects in progress"
            color="bg-emerald-50"
          />
          <StatCard
            title="Team Strength"
            value={data?.summary?.total_employees || 0}
            icon={<Users className="text-amber-600" />}
            sub="Registered employees"
            color="bg-amber-50"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Status Distribution (Pie Chart) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle size={20} className="text-indigo-600" /> Task Status
              Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.task_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="total"
                    nameKey="status"
                  >
                    {data?.task_distribution?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart for Workload (Sample logic) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-rose-600" /> Efficiency
              Metrics
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.task_distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar
                    dataKey="total"
                    fill="#6366f1"
                    radius={[10, 10, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, sub, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className={`${color} p-4 rounded-2xl`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-slate-400 font-bold text-sm">Real-time</span>
    </div>
    <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
      {title}
    </h4>
    <div className="text-4xl font-black text-slate-900 mb-1">{value}</div>
    <p className="text-slate-400 text-sm font-medium">{sub}</p>
  </div>
);

export default Analytics;
