import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          fontWeight: 500,
          color: "#0d9488",
          backgroundColor: "#f8fafb",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length) {
    const hasRole = user?.roles?.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
