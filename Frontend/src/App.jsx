import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import EmailSuccess from "./pages/EmailSuccess";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuditLog from "./pages/AuditLog";
import ActiveUsers from "./pages/ActiveUsers";
import AdminDashboard from "./pages/AdminDashboard";
import Chat from "./pages/Chat";

import ProtectedRoute from "./pages/ProtectedRoute";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-success" element={<EmailSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/audit-log" element={<AuditLog />} />
        <Route path="/active-users" element={<ActiveUsers />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
