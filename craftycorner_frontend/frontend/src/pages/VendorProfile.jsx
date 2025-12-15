import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../components/auth.css";

function VendorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [gstin, setGstin] = useState("");

  async function fetchProfile() {
    try {
      const res = await api.get("/vendors/me");
      if (res?.data) {
        setProfile(res.data);
        setShopName(res.data.shopName || "");
        setBio(res.data.bio || "");
        setGstin(res.data.gstin || "");
      } else {
        setProfile(null);
        setShopName("");
        setBio("");
        setGstin("");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      toast.error("❌ Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.put("/vendors/me", {
        shopName,
        bio,
        gstin,
      });
      setProfile(res.data);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("❌ Failed to update profile");
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="vendor-profile-container">
      <h2 className="page-heading">Vendor Profile</h2>

      <form className="vendor-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Shop Name</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="John's Craft Studio"
            required
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe your shop..."
          />
        </div>

        <div className="form-group">
          <label>GSTIN</label>
          <input
            type="text"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            placeholder="Optional"
          />
        </div>

        {profile && (
          <>
            <p className="vendor-status-line">
              <strong>Status:</strong>{" "}
              <span
                className={`vendor-status-badge ${
                  profile.onboardingStatus?.toLowerCase() || ""
                }`}
              >
                {profile.onboardingStatus}
              </span>
            </p>

            {profile.rejectionReason && (
              <p style={{ color: "red" }}>
                Rejected reason: {profile.rejectionReason}
              </p>
            )}
          </>
        )}

        <button className="submit-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default VendorProfile;
