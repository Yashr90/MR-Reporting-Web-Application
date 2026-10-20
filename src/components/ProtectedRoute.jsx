import { Navigate, Outlet } from "react-router-dom";

function getFallbackRouteForRole(role) {
  if (role === "MANAGER") return "/manager";
  if (role === "MR") return "/mr";
  return "/";
}

export default function ProtectedRoute({ allowedRoles }) {
  // ─── DEV BYPASS: backend unavailable ───────────────────────
  // Remove or set DEV_BYPASS = false when backend is back
  const DEV_BYPASS = true;
  if (DEV_BYPASS) return <Outlet />;
  // ────────────────────────────────────────────────────────────

  const token = sessionStorage.getItem("token");
  const role  = sessionStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getFallbackRouteForRole(role)} replace />;
  }

  return <Outlet />;
}