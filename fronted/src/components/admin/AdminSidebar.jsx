import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaChevronDown,
  FaListUl,
  FaChartLine,
  FaTrophy,
  FaLayerGroup,
  FaPlusCircle,
} from "react-icons/fa";
import { useState } from "react";

const AdminSidebar = () => {
  const [openEmployee, setOpenEmployee] = useState(true);
  const [openGroups, setOpenGroups] = useState(true); // Groups dropdown ke liye state

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 h-screen flex flex-col shrink-0 border-r border-slate-800 shadow-2xl overflow-hidden">
      {/* --- SIDEBAR HEADER --- */}
      <div className="p-8 bg-linear-to-b from-slate-900 to-slate-950">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-500/20 p-2 rounded-xl">
            <FaTrophy className="text-indigo-400 text-xl" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Admin{" "}
            <span className="text-indigo-500 font-medium text-sm block tracking-widest">
              LEADERSHIP BOARD
            </span>
          </h2>
        </div>
      </div>

      {/* --- MENU AREA --- */}
      <nav
        className="flex-1 overflow-y-auto px-4 space-y-1.5 scroll-smooth pb-10 scrollbar-hide"
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">
          Main Menu
        </p>

        {/* Dashboard Link */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              isActive
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
                : "hover:bg-slate-900 hover:text-white"
            }`
          }
        >
          <FaHome className="text-lg group-hover:scale-110 transition-transform" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        {/* Analytics Link */}
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              isActive
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                : "hover:bg-slate-900 hover:text-white"
            }`
          }
        >
          <FaChartLine className="text-lg" />
          <span className="font-medium">Analytics</span>
        </NavLink>

        {/* --- Employee Management Dropdown --- */}
        <div className="pt-4">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Staffing
          </p>
          <button
            onClick={() => setOpenEmployee(!openEmployee)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
              openEmployee ? "bg-slate-900/50 text-white" : "hover:bg-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaUsers
                className={`text-lg transition-colors ${
                  openEmployee ? "text-indigo-400" : ""
                }`}
              />
              <span className="font-medium">Employees</span>
            </div>
            <FaChevronDown
              className={`text-xs transition-transform duration-500 ${
                openEmployee ? "rotate-180 text-indigo-400" : "text-slate-600"
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openEmployee ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 pl-4 border-l border-slate-800 space-y-1">
              <NavLink
                to="/admin/employees"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "text-indigo-400 font-bold"
                      : "text-slate-500 hover:text-slate-200 hover:bg-slate-900"
                  }`
                }
              >
                <FaListUl className="text-[10px]" /> View Employees List
              </NavLink>
            </div>
          </div>
        </div>

        {/* --- NAYA SECTION: Team Groups Management --- */}
        <div className="pt-2">
          <button
            onClick={() => setOpenGroups(!openGroups)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
              openGroups ? "bg-slate-900/50 text-white" : "hover:bg-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaLayerGroup
                className={`text-lg transition-colors ${
                  openGroups ? "text-indigo-400" : ""
                }`}
              />
              <span className="font-medium">Team Groups</span>
            </div>
            <FaChevronDown
              className={`text-xs transition-transform duration-500 ${
                openGroups ? "rotate-180 text-indigo-400" : "text-slate-600"
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openGroups ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 pl-4 border-l border-slate-800 space-y-1">
              <NavLink
                to="/admin/admin_group"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "text-indigo-400 font-bold"
                      : "text-slate-500 hover:text-slate-200 hover:bg-slate-900"
                  }`
                }
              >
                <FaPlusCircle className="text-[10px]" /> Manage & Assign
              </NavLink>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="my-6 border-t border-slate-800 mx-4"></div>

        <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
          Upcoming Features
        </p>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-20 grayscale cursor-not-allowed"
          >
            <div className="w-5 h-5 bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-20 bg-slate-800 rounded"></div>
          </div>
        ))}
      </nav>

      {/* --- SIDEBAR FOOTER --- */}
      <div className="p-4 bg-slate-900/40 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-colors group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">
              Admin Account
            </p>
            <p className="text-[10px] text-slate-500 truncate font-mono">
              STATION-CONTROL-01
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
