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
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem("user"));

  // ===== ROLE CHECK =====
  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* ================= MODERN NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="bg-indigo-600 p-2.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200">
            <FaThLarge className="text-white" size={18} />
          </div>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            LEADERSHIP-BOARD{" "}
            <span className="text-slate-400 font-light">LS</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
            >
              Partner Login
            </button>
          ) : (
            <>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="px-6 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-full hover:bg-indigo-100 transition-all"
                >
                  Admin Console
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-full hover:bg-rose-100 transition-all"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-4 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              The Future of Workforce Management
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Unite Your Team. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                Accelerate Your Vision.
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl leading-relaxed mb-12 font-medium">
              Stratix OS provides the high-performance infrastructure to manage
              squads, track project velocity, and optimize organizational
              efficiency in real-time.
            </p>

            {!isLoggedIn && (
              <button
                onClick={() => navigate("/login")}
                className="group relative px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-3 mx-auto"
              >
                Launch Dashboard{" "}
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            )}
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
            <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300 rounded-full blur-[120px]"></div>
          </div>
        </section>

        {/* PERFORMANCE / LEADERBOARD SECTION */}
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
                Cultivate Excellence with <br />
                Real-time Leaderboards.
              </h4>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Gamify project milestones and recognize top performers. Our
                intelligent ranking system evaluates squad contributions,
                helping you identify leadership potential.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Dynamic Squad Tracking",
                  "Project Velocity Metrics",
                  "KPI Recognition",
                  "Automated Reporting",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 font-bold text-slate-700 text-sm"
                  >
                    <div className="p-1 bg-indigo-100 rounded text-indigo-600">
                      <FaRocket size={10} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* LEADERBOARD UI PREVIEW */}
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
              <h5 className="font-black text-slate-800 mb-6 flex justify-between items-center uppercase text-xs tracking-widest">
                Top Performers Week 52 <span>XP Score</span>
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
                {[
                  {
                    rank: "02",
                    team: "Shadow Lynx",
                    xp: "92.1",
                    color: "text-slate-400",
                  },
                  {
                    rank: "03",
                    team: "Quantum Crew",
                    xp: "89.5",
                    color: "text-amber-700",
                  },
                ].map((squad, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-black text-xl italic ${squad.color}`}
                      >
                        {squad.rank}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <span className="font-bold text-slate-700">
                        {squad.team}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {squad.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaShieldAlt />}
              title="Secure Core"
              desc="Bank-grade authorization using Laravel Sanctum for ironclad data protection."
              color="bg-emerald-50 text-emerald-600"
            />
            <FeatureCard
              icon={<FaUsers />}
              title="Squad Control"
              desc="Deploy project groups instantly with granular role-based permissions."
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard
              icon={<FaChartLine />}
              title="Analytics Engine"
              desc="Translate daily operations into actionable data insights and growth charts."
              color="bg-purple-50 text-purple-600"
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-16 px-8 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-black mb-2 tracking-tighter italic">
              LEADERSHIP-BOARD <span className="text-indigo-500">LS</span>
            </h4>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Standardizing workforce intelligence for high-growth enterprises
              globally.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">
              Protocol
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Security
            </a>
          </div>
          <p className="text-slate-600 text-[10px] font-medium">
            © {new Date().getFullYear()} Stratix Systems. All Rights Reserved.
          </p>
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
