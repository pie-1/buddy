// client/src/components/layout/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}