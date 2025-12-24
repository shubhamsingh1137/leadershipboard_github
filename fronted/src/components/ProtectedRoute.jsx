import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <h2>Access Denied</h2>;
  }

  return children;
};

export default ProtectedRoute;
