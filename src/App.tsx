
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Attendance from "./pages/Attendance";
import Library from "./pages/Library";
import Performance from "./pages/Performance";
import Information from "./pages/Information";
import TestScores from "./pages/TestScores";
import NotFound from "./pages/NotFound";
import StudentManagement from "./pages/StudentManagement";
import VolunteerManagement from "./pages/VolunteerManagement";
import VolunteerFeedback from "./pages/VolunteerFeedback";
import Reviews from "./pages/Reviews";
import UserDirectory from "./pages/UserDirectory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute allowedRoles={["admin", "volunteer"]}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute allowedRoles={["admin", "volunteer", "student"]}>
                  <Library />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute allowedRoles={["admin", "volunteer", "student"]}>
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/information"
              element={
                <ProtectedRoute allowedRoles={["admin", "volunteer", "student"]}>
                  <Information />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-scores"
              element={
                <ProtectedRoute allowedRoles={["admin", "volunteer"]}>
                  <TestScores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-management"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <StudentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer-management"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <VolunteerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer-feedback"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <VolunteerFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute allowedRoles={["admin", "volunteer", "student"]}>
                  <Reviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-directory"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserDirectory />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
