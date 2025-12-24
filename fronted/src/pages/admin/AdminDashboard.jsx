import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaClock } from "react-icons/fa";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  // Live time update
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = time.toLocaleTimeString();

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ================= SIDEBAR ================= */}
      <AdminSidebar />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">
        {/* -------- TOP BAR -------- */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
              title="Go to Home"
            >
              <FaHome size={18} />
            </button>

            <h1 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Date & Time */}
            <div className="hidden md:flex flex-col text-right text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Admin Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
              A
            </div>
          </div>
        </header>

        {/* -------- PAGE CONTENT -------- */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* -------- FOOTER -------- */}
        <footer className="bg-white text-center py-3 text-sm text-gray-500 border-t">
          © {new Date().getFullYear()} Office Management System. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
