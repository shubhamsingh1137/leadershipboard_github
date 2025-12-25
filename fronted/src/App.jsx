import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import Employees from "./pages/admin/Employee";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import EmployeeHome from "./pages/Employee/EmployeeHome";
import Users from "./pages/Employee/Users";
import AdminEmployeeGroup from "./pages/admin/AdminEmployeeGroup";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN ROUTES*/}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />

          <Route path="employees" element={<Employees />} />
          <Route path="admin_group" element={<AdminEmployeeGroup />} />
        </Route>

        {/* EMPLOYEE ROUTES */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeHome />} />

          <Route path="user" element={<Users />} />
        </Route>

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
