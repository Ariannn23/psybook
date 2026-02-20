import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import PatientsPage from "@/pages/patients/PatientsPage";
import AddPatientPage from "@/pages/patients/AddPatientPage";
import PatientDetailsPage from "@/pages/patients/PatientDetailsPage";
import EditPatientPage from "@/pages/patients/EditPatientPage";
import AppointmentsPage from "@/pages/appointments/AppointmentsPage";
import AddAppointmentPage from "@/pages/appointments/AddAppointmentPage";
import ServicesPage from "@/pages/services/ServicesPage";
import AvailabilityPage from "@/pages/settings/AvailabilityPage";
import ProfilePage from "@/pages/settings/ProfilePage";
import UsersPage from "@/pages/admin/UsersPage";
import { Loader2 } from "lucide-react";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      >
        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/new" element={<AddPatientPage />} />
        <Route path="patients/edit/:id" element={<EditPatientPage />} />
        <Route path="patients/:id" element={<PatientDetailsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointments/new" element={<AddAppointmentPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
