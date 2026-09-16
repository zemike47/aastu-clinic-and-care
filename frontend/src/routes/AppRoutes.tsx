import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import PatientDashboard from "../pages/PatientDashboard";
import NurseDashboard from "../pages/NurseDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import PharmacistDashboard from "../pages/PharmacistDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import LandingPage from "../pages/LandingPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
          <Route path="/patient" element={<PatientDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["NURSE"]} />}>
          <Route path="/nurse" element={<NurseDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        <Route
          path="/pharmacist"
          element={<ProtectedRoute allowedRoles={["PHARMACIST"]} />}
        >
          <Route index element={<PharmacistDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
