import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public pages
import Home from "./Pages/home/Home";
import Login from "./Pages/login/Login";
import Register from "./Pages/register/Register";

// User dashboard
import UserDashboard from "./Pages/user-dashboard/UserDashboard";

// Manager dashboard
import ManagerDashboard from "./Pages/Manager/ManagerDashboard";
import ManagerInspect from "./Pages/Manager/ManagerInspect";

// Admin dashboard
import NewAdminDashboard from "./pages/admin/NewAdminDashboard";
import AdminInspect from './Pages/admin/AdminInspect';

import "./App.css";


const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(15,23,42,0.55)",
          "&.Mui-focused": {
            color: "#990000",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#0f172a",
          "& fieldset": {
            borderColor: "rgba(15,23,42,0.12)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(153,0,0,0.4)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#990000",
          },
        },
        input: {
          color: "#0f172a",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#000000",
        },
      },
    },
  },
});

// Smart redirect after login
const RoleRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const paths = { ADMIN: "/admin", MANAGER: "/manager", USER: "/dashboard" };
  return <Navigate to={paths[user?.role] || "/login"} replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid rgba(153,0,0,0.3)",
                borderRadius: "10px",
              },
              success: { iconTheme: { primary: "#00cc44", secondary: "#fff" } },
              error: { iconTheme: { primary: "#990000", secondary: "#fff" } },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Redirect authenticated users */}
            <Route path="/redirect" element={<RoleRedirect />} />

            {/* User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["USER"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Manager Dashboard */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute roles={["MANAGER"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/inspect/:id"
              element={
                <ProtectedRoute roles={["MANAGER"]}>
                  <ManagerInspect />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <NewAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/review/:id"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminInspect />
                </ProtectedRoute>
              }
            />

            {/* Legacy routes - keep for backwards compatibility */}
            <Route
              path="/valuations"
              element={
                <ProtectedRoute roles={["MANAGER", "ADMIN"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
