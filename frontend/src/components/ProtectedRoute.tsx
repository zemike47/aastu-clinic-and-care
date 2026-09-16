import { Navigate, Outlet } from "react-router-dom";

import { getCurrentUser } from "../services/auth.service";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
