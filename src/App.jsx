import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SuperAdminPage from "./pages/SuperAdminPage";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#c33",
        }}
      >
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated && isSuperAdmin ? (
            <Navigate to="/superadmin" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated && isSuperAdmin ? (
            <Navigate to="/superadmin" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
