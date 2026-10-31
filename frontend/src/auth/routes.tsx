import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";
import { homePaths, type Role } from "./roles";

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Nalaganje ...
    </div>
  );
}

export function ProtectedRoute({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homePaths[user.role]} replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <Navigate to={homePaths[user.role]} replace />;
  return <Outlet />;
}
