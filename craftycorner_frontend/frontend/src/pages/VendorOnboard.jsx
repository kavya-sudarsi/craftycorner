import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api";
import "../components/auth.css";

function VendorOnboard() {
  const location = useLocation();
  const redirectedMsg = location.state?.message;

  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [gstin, setGstin] = useState("");
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/vendors/me");
        setStatus(res.data.onboardingStatus);
        setShopName(res.data.shopName || "");
        setBio(res.data.bio || "");
        setGstin(res.data.gstin || "");
      } catch {
        // ignore
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/vendors/onboard", { shopName, bio, gstin });
      setStatus(res.data.onboardingStatus);
      setMsg("Onboarding submitted. Awaiting admin approval.");
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || "Failed to submit onboarding.";
      setMsg(`❌ ${errMsg}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Vendor Onboarding</h2>
        <p className="helper">
          Tell us about your shop. Admin will review and approve before you can sell.
        </p>

        {redirectedMsg && (
          <div
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 8,
              background: "#fffbeb",
              color: "#92400e",
            }}
          >
            {redirectedMsg}
          </div>
        )}

        {status && (
          <p>
            Current status:{" "}
            <strong
              style={{
                color:
                  status === "APPROVED"
                    ? "green"
                    : status === "REJECTED"
                    ? "red"
                    : "orange",
              }}
            >
              {status}
            </strong>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <textarea
              placeholder="Shop description / bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              style={{ width: "100%", minHeight: "80px", padding: "10px" }}
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="GSTIN (optional)"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
            />
          </div>

          <button className="btn" type="submit">
            Submit for Approval
          </button>
        </form>

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
}

export default VendorOnboard;
