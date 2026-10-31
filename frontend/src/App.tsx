import { Navigate, Route, Routes } from "react-router";
import { GuestRoute, ProtectedRoute } from "./auth/routes";
import { homePaths, type Role } from "./auth/roles";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { HomePage } from "./pages/HomePage";

const roles = Object.keys(homePaths) as Role[];

export function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {roles.map((role) => (
        <Route key={role} element={<ProtectedRoute roles={[role]} />}>
          <Route path={homePaths[role]} element={<HomePage />} />
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
