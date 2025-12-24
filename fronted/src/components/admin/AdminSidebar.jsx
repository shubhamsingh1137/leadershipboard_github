import { NavLink } from "react-router-dom";
import { FaUsers, FaPlus, FaHome, FaChevronDown } from "react-icons/fa";
import { useState } from "react";

const AdminSidebar = () => {
  const [openEmployee, setOpenEmployee] = useState(true);

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 min-h-screen p-5">
      {/* LOGO */}
      <h2 className="text-2xl font-bold mb-10 text-center text-indigo-400">
        Admin Panel
      </h2>

      {/* MENU */}
      <nav className="space-y-2">
        {/* DASHBOARD */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-800"
            }`
          }
        >
          <FaHome />
          Dashboard
        </NavLink>

        {/* EMPLOYEE MENU */}
        <button
          onClick={() => setOpenEmployee(!openEmployee)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-3">
            <FaUsers />
            Employees
          </div>
          <FaChevronDown
            className={`transition-transform ${
              openEmployee ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* SUB MENU */}
        {openEmployee && (
          <div className="ml-8 mt-2 space-y-2">
            <NavLink
              to="/admin/create-employee"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition ${
                  isActive ? "bg-indigo-500 text-white" : "hover:bg-gray-800"
                }`
              }
            >
              ➕ Create Employee
            </NavLink>

            <NavLink
              to="/admin/employees"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition ${
                  isActive ? "bg-indigo-500 text-white" : "hover:bg-gray-800"
                }`
              }
            >
              👥 Employee List
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
