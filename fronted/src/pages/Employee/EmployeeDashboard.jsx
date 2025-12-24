import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaChevronRight,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext"; // AuthContext import karein
import EmployeeSidebar from "../../components/Employee/EmployeeSidebar";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Context se user data nikalein
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time-based Greeting
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

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
      <EmployeeSidebar />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        {/* -------- TOP BAR (Enhanced for Employee) -------- */}
        <header className="shrink-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/employee")}
              className="group p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm border border-indigo-100"
            >
              <FaHome
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                {getGreeting()}{" "}
                <FaChevronRight className="text-[8px] text-indigo-400" />
              </div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight">
                Welcome back,{" "}
                <span className="text-indigo-600">
                  {user?.name?.split(" ")[0] || "Employee"}
                </span>{" "}
                👋
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Real-time Clock Widget */}
            <div className="hidden xl:flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-200/50">
              <div className="flex items-center gap-2 text-slate-500 border-r border-slate-300 pr-4 text-xs font-bold">
                <FaCalendarAlt className="text-indigo-500" /> {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-700">
                <FaClock className="text-indigo-500 animate-pulse" />{" "}
                {formattedTime}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-200">
                <FaBell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="h-8 w-px bg-slate-200"></div>

              {/* User Profile Info */}
              <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">
                    {user?.name || "Member Name"}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    ACTIVE SESSION
                  </p>
                </div>

                {/* Profile Image / Initials */}
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  {user?.profile_image ? (
                    <img
                      src={`http://localhost:8000/storage/${user.profile_image}`}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md relative"
                      alt="profile"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-black shadow-lg relative border-2 border-white">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* -------- PAGE CONTENT AREA -------- */}
        <main className="flex-1 overflow-hidden bg-[#f8fafc] flex flex-col relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] -z-10"></div>

          <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
