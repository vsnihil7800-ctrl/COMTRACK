import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AboutPage, Error404Page, FeaturesPage, ForgotPasswordPage, NotificationsPage } from "./pages/SimplePages";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { ComplaintSubmitPage, ComplaintTrackingPage } from "./pages/ComplaintPages";
import VerifyEmailPage from "./pages/VerifyEmailPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AmbulancePage = lazy(() => import("./pages/AmbulancePage"));
const SOSPage = lazy(() => import("./pages/SOSPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

const fallback = <div className="glass rounded-xl p-4">Loading...</div>;

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Suspense fallback={fallback}><HomePage /></Suspense>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={fallback}><DashboardPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ambulance"
          element={
            <ProtectedRoute>
              <Suspense fallback={fallback}><AmbulancePage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <ComplaintSubmitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/track"
          element={
            <ProtectedRoute>
              <ComplaintTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <Suspense fallback={fallback}><SOSPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={fallback}><ProfilePage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Suspense fallback={fallback}><AdminDashboardPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Error404Page />} />
      </Route>
    </Routes>
  );
}
