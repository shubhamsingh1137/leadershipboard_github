import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem("user"));

  // ===== ROLE CHECK =====
  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-600 to-purple-600">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Office Management
        </h1>

        <div className="space-x-4">
          {/* LOGIN → visible for guest & admin */}
          {!isEmployee && (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          )}

          {/* ADMIN DASHBOARD */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Dashboard
            </button>
          )}

          {/* LOGOUT → ONLY EMPLOYEE */}
          {isEmployee && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-10 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Office Management System
          </h2>

          <p className="text-gray-600 mb-8 text-lg">
            A complete solution to manage employees, roles, attendance and daily
            office operations efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
            <div className="p-6 border rounded-lg hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">Role Based Access</h3>
              <p className="text-sm">
                Admin and Employee access with proper authorization.
              </p>
            </div>

            <div className="p-6 border rounded-lg hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">
                Employee Management
              </h3>
              <p className="text-sm">
                Create, manage and track employee records efficiently.
              </p>
            </div>

            <div className="p-6 border rounded-lg hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">Secure System</h3>
              <p className="text-sm">
                Laravel Sanctum based authentication & authorization.
              </p>
            </div>
          </div>

          {/* CTA */}
          {!isEmployee && (
            <button
              onClick={() => navigate("/login")}
              className="mt-10 bg-indigo-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Get Started
            </button>
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white text-center py-4 text-gray-600 text-sm">
        © {new Date().getFullYear()} Office Management System. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Home;
