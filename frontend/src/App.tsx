import { Navigate, Route, Routes } from "react-router";
import { GuestRoute, ProtectedRoute } from "./auth/routes";
import { homePaths, type Role } from "./auth/roles";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { OwnerDashboardPage } from "./pages/owner/OwnerDashboardPage";
import { StaffPage } from "./pages/staff/StaffPage";

const rolesWithHomePage: Role[] = ["RECEPTIONIST", "VETERINARIAN"];

export function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {rolesWithHomePage.map((role) => (
        <Route key={role} element={<ProtectedRoute roles={[role]} />}>
          <Route path={homePaths[role]} element={<HomePage />} />
        </Route>
      ))}
      <Route element={<ProtectedRoute roles={["OWNER"]} />}>
        <Route path={homePaths.OWNER} element={<OwnerDashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route path={homePaths.ADMIN} element={<StaffPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
