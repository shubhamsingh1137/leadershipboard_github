import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaTrophy,
  FaArrowRight,
  FaSignOutAlt,
  FaThLarge,
  FaUserCircle,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdminLoggedIn = user?.role === "admin";

  const isEmployeeLoggedIn = user?.role === "employee";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="bg-indigo-600 p-2.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200">
            <FaThLarge className="text-white" size={18} />
          </div>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
            LEADERSHIP-BOARD{" "}
            <span className="text-slate-400 font-light">LS</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
            >
              Partner Login
            </button>
          )}

          {isAdminLoggedIn && (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="px-6 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-full hover:bg-indigo-100 transition-all"
              >
                Admin Console
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-indigo-600 transition-all shadow-lg"
              >
                Employee Login
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="p-2.5 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100"
                title="Admin Sign Out"
              >
                <FaSignOutAlt />
              </button>
            </>
          )}

          {isEmployeeLoggedIn && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                <FaUserCircle className="text-indigo-600" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                  {user.name}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-full hover:bg-rose-100 transition-all"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-4 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              {isEmployeeLoggedIn
                ? "Employee Portal Active"
                : "The Future of Workforce Management"}
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              {isEmployeeLoggedIn
                ? `Welcome Back, ${user.name.split(" ")[0]}`
                : "Unite Your Team."}{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500">
                Accelerate Your Vision.
              </span>
            </h2>

            <button
              onClick={() => {
                if (isEmployeeLoggedIn) navigate("/employee");
                else if (isAdminLoggedIn) navigate("/admin");
                else navigate("/login");
              }}
              className="group relative px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-3 mx-auto"
            >
              {isEmployeeLoggedIn || isAdminLoggedIn
                ? "Open Dashboard"
                : "Launch Dashboard"}
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>

        <section className="bg-slate-50 py-24 px-6 border-y border-slate-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FaTrophy className="text-amber-500" size={24} />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Performance Insights
                </h3>
              </div>
              <h4 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-snug">
                Real-time Leaderboards.
              </h4>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Gamify project milestones and recognize top performers.
              </p>
            </div>

            {/* LEADERBOARD UI PREVIEW */}
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
              <h5 className="font-black text-slate-800 mb-6 flex justify-between items-center uppercase text-xs tracking-widest">
                Top Performers <span>XP Score</span>
              </h5>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl italic opacity-50">
                      01
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30" />
                    <span className="font-bold">Alpha Squad</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                    98.4 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-16 px-8 text-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <h4 className="text-xl font-black tracking-tighter italic text-center md:text-left">
            LEADERSHIP-BOARD <span className="text-indigo-500">LS</span>
          </h4>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
    <div
      className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Home;
