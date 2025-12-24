import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaChevronDown,
  FaPlus,
  FaListUl,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import { useState } from "react";

const AdminSidebar = () => {
  const [openEmployee, setOpenEmployee] = useState(true);

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 h-screen flex flex-col shrink-0 border-r border-slate-800 shadow-2xl overflow-hidden">
      {/* --- SIDEBAR HEADER (Lerdership Board Style) --- */}
      <div className="p-8 bg-linear-to-b from-slate-900 to-slate-950">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-500/20 p-2 rounded-xl">
            <FaTrophy className="text-indigo-400 text-xl" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Simpel{" "}
            <span className="text-indigo-500 font-medium text-sm block tracking-widest">
              LEADERSHIP BOARD
            </span>
          </h2>
        </div>
      </div>

      {/* --- MENU AREA --- */}
      {/* 'scrollbar-hide' class use ki gayi hai scrollbar chupane ke liye */}
      <nav
        className="flex-1 overflow-y-auto px-4 space-y-1.5 scroll-smooth pb-10 scrollbar-hide"
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        {/* Section Label */}
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">
          Main Menu
        </p>

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

        {/* --- Dropdown Section --- */}
        <div className="pt-4">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Management
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

          {/* Submenu with Animation */}
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
                <FaListUl className="text-[10px]" /> View List
              </NavLink>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="my-6 border-t border-slate-800 mx-4"></div>

        {/* More Items placeholder to test scroll */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-30 cursor-not-allowed grayscale"
          >
            <div className="w-5 h-5 bg-slate-800 rounded-full"></div>
            <div className="h-3 w-24 bg-slate-800 rounded"></div>
          </div>
        ))}
      </nav>

      {/* --- SIDEBAR FOOTER (User Info) --- */}
      <div className="p-4 bg-slate-900/40 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">
              Admin Account
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              admin@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* CSS to hide scrollbar (Add this to your index.css or App.css) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
