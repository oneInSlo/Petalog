import { Navigate, Route, Routes } from "react-router";
import { GuestRoute, ProtectedRoute } from "./auth/routes";
import { homePaths } from "./auth/roles";
import { AnimalRecordPage } from "./pages/animals/AnimalRecordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { MedicalRecordPage } from "./pages/medical-records/MedicalRecordPage";
import { NewMedicalRecordPage } from "./pages/medical-records/NewMedicalRecordPage";
import { OwnerDashboardPage } from "./pages/owner/OwnerDashboardPage";
import { StaffPage } from "./pages/staff/StaffPage";
import { VeterinarianDashboardPage } from "./pages/veterinarian/VeterinarianDashboardPage";

export function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["RECEPTIONIST"]} />}>
        <Route path={homePaths.RECEPTIONIST} element={<HomePage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["OWNER"]} />}>
        <Route path={homePaths.OWNER} element={<OwnerDashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["OWNER", "RECEPTIONIST", "VETERINARIAN"]} />}>
        <Route path="/animals/:id" element={<AnimalRecordPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["VETERINARIAN"]} />}>
        <Route path={homePaths.VETERINARIAN} element={<VeterinarianDashboardPage />} />
        <Route path="/animals/:id/medical-records/new" element={<NewMedicalRecordPage />} />
        <Route path="/medical-records/:id" element={<MedicalRecordPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route path={homePaths.ADMIN} element={<StaffPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
