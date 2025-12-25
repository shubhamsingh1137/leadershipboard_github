import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaChevronRight,
} from "react-icons/fa";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <AdminSidebar />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        {/* -------- TOP BAR -------- */}
        <header className="shrink-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="group p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
            >
              <FaHome
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Admin <FaChevronRight className="text-[8px]" /> Overview
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Control Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-4 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-slate-700 border-r border-slate-300 pr-3 text-[13px] font-semibold whitespace-nowrap">
                <FaCalendarAlt className="text-xs" /> {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-mono font-bold text-slate-700 w-20">
                <FaClock className="text-xs animate-pulse" /> {formattedTime}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
                <FaBell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none">
                    Admin
                  </p>
                  <p className="text-[11px] font-medium text-indigo-500 mt-1">
                    Online
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black shadow-lg">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* -------- PAGE CONTENT AREA (No Scroll Here) -------- */}

        <main className="flex-1 overflow-hidden bg-[#f8fafc] flex flex-col">
          <div className="flex-1 flex flex-col p-8 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
