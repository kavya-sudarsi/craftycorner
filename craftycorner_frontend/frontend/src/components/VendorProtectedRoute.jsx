// src/components/VendorProtectedRoute.jsx
import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../utils/api";

function VendorProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState(null);

  useEffect(() => {
    async function checkVendorAccess() {
      try {
        const res = await api.get("/vendors/me");
        setOnboardingStatus(res.data.onboardingStatus);
      } catch {
        setOnboardingStatus(null);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      checkVendorAccess();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Checking vendor access...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingStatus !== "APPROVED") {
    const message =
      onboardingStatus === "PENDING"
        ? "Please wait for admin approval before accessing this section."
        : "Your vendor request was rejected. Please reapply.";

    return (
      <Navigate
        to="/vendor/onboard"
        replace
        state={{ message }}
      />
    );
  }

  return children;
}

export default VendorProtectedRoute;
