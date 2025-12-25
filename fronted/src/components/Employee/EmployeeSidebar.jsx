import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaChevronDown,
  FaListUl,
  FaChartLine,
  FaTrophy,
  FaBullseye,
  FaRocket,
  FaGem,
} from "react-icons/fa";
import { useState } from "react";

const EmployeeSidebar = () => {
  const [openTeam, setOpenTeam] = useState(true);

  return (
    <aside className="w-72 bg-[#0f172a] text-slate-300 h-screen flex flex-col shrink-0 border-r border-slate-800 shadow-2xl relative overflow-hidden">
      {/* --- BACKGROUND DECORATION (Subtle Glow) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-indigo-600/10 blur-[80px] rounded-full"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-32 h-32 bg-purple-600/10 blur-[70px] rounded-full"></div>

      {/* --- SIDEBAR HEADER --- */}
      <div className="p-6 relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 animate-pulse"></div>
            <div className="relative bg-linear-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
              <FaRocket className="text-white text-xl rotate-12" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white leading-tight">
              EMPLOYEE
            </h2>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              Member Portal
            </span>
          </div>
        </div>
      </div>

      {/* --- MENU AREA --- */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 relative scrollbar-hide z-10">
        {/* SECTION: OVERVIEW */}
        <div className="mb-6">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
            Your Performance
          </p>

          <NavLink
            to="/employee"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-linear-to-r from-indigo-600/20 to-transparent text-white border-l-4 border-indigo-500"
                  : "hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <FaHome className="text-lg opacity-70 group-hover:opacity-100" />
            <span className="font-semibold text-sm">Personal Dashboard</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-linear-to-r from-indigo-600/20 to-transparent text-white border-l-4 border-indigo-500"
                  : "hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <FaChartLine className="text-lg opacity-70" />
            <span className="font-semibold text-sm">Growth Metrics</span>
          </NavLink>
        </div>

        {/* SECTION: NETWORK */}
        <div className="mb-6">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
            Company Network
          </p>

          <button
            onClick={() => setOpenTeam(!openTeam)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
              openTeam ? "text-white" : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaUsers
                className={`text-lg ${
                  openTeam ? "text-indigo-400" : "opacity-70"
                }`}
              />
              <span className="font-semibold text-sm">Colleagues</span>
            </div>
            <FaChevronDown
              className={`text-[10px] transition-transform duration-300 ${
                openTeam ? "rotate-180" : "opacity-40"
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openTeam ? "max-h-20 mt-1" : "max-h-0"
            }`}
          >
            <div className="ml-6 border-l border-slate-800 space-y-1">
              <NavLink
                to="/employee/user"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? "text-indigo-400 bg-indigo-500/5 font-bold"
                      : "text-slate-500 hover:text-slate-200"
                  }`
                }
              >
                <FaListUl className="text-[10px]" /> Team Directory
              </NavLink>
            </div>
          </div>
        </div>

        {/* SECTION: ACHIEVEMENTS (Decorative Placeholder) */}
        <div>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
            Milestones
          </p>
          <div className="px-4 py-3 flex items-center gap-3 opacity-40">
            <FaTrophy className="text-amber-500" />
            <span className="text-xs font-medium italic">
              Monthly Leaderboard
            </span>
          </div>
          <div className="px-4 py-3 flex items-center gap-3 opacity-40">
            <FaBullseye className="text-rose-500" />
            <span className="text-xs font-medium italic">Active Goals</span>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR FOOTER (Enhanced User Profile) --- */}
      <div className="p-4 mt-auto relative z-10">
        <div className="p-4 bg-linear-to-b from-slate-900/50 to-slate-900 border border-slate-800 rounded-4xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur group-hover:blur-md transition-all opacity-30"></div>
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-lg relative overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Employee&background=6366f1&color=fff"
                  alt="avatar"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">
                Akash Sharma
              </p>
              <div className="flex items-center gap-1 text-indigo-400">
                <FaGem className="text-[10px]" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Pro Member
                </span>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-2 bg-slate-800/50 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-[11px] font-bold rounded-xl transition-all border border-slate-700/50">
            Sign Out Account
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </aside>
  );
};

export default EmployeeSidebar;
