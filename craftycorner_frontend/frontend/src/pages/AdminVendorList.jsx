import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../components/auth.css";

function AdminVendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING"); 
  const [selected, setSelected] = useState(null); 
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchVendors() {
    try {
      setLoading(true);
      const query = filter === "PENDING" ? "?status=PENDING" : "";
      const res = await api.get(`/admin/vendors${query}`);
      const list = res.data?.content || res.data || [];
      setVendors(list);
      setError("");
    } catch (err) {
      console.error("Failed to load vendors", err);
      setError("Failed to load vendors.");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVendors();
  }, [filter]);

  async function handleApprove(id) {
    if (!window.confirm("Approve this vendor?")) return;
    try {
      setActionLoading(true);
      await api.post(`/admin/vendors/${id}/approve`);
      toast.success(" Vendor approved");
      fetchVendors();
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error(" Error approving vendor");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(id) {
    if (!rejectReason || rejectReason.trim().length < 3) {
      toast.error("Please enter a reason (min 3 chars) before rejecting.");
      return;
    }
    try {
      setActionLoading(true);
      await api.post(`/admin/vendors/${id}/reject`, { reason: rejectReason });
      toast.success(" Vendor rejected");
      setRejectReason("");
      fetchVendors();
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error(" Error rejecting vendor");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p>Loading vendors...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 className="page-heading"> Vendor Requests</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontWeight: 600, color: "var(--muted)" }}>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="ALL">All</option>
          </select>
          <button className="btn secondary" onClick={fetchVendors} style={{ marginLeft: 6 }}>
            Refresh
          </button>
        </div>
      </div>

      {vendors.length === 0 ? (
        <p>No vendors matching the filter.</p>
      ) : (
        <table className="vendor-table striped">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>User ID</th>
              <th>Shop Name</th>
              <th>GSTIN</th>
              <th>Status</th>
              <th style={{ textAlign: "center", width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.userId || (v.user && v.user.id) || "—"}</td>
                <td>{v.shopName || "—"}</td>
                <td>{v.gstin || "—"}</td>
                <td>
                  <span className={`status-badge ${v.onboardingStatus?.toLowerCase() || "pending"}`}>
                    {v.onboardingStatus || "PENDING"}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="btn"
                    onClick={() => {
                      setSelected(v);
                      setRejectReason("");
                    }}
                    style={{ marginRight: 8 }}
                  >
                    View
                  </button>
                  {v.onboardingStatus === "PENDING" && (
                    <>
                      <button className="btn" onClick={() => handleApprove(v.id)} disabled={actionLoading}>
                        Approve
                      </button>
                      <button
                        className="btn secondary"
                        onClick={() => {
                          setSelected(v);
                          setRejectReason("");
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,10,10,0.45)",
            zIndex: 60,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-card"
            style={{
              width: 760,
              maxWidth: "94%",
              background: "var(--card)",
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{selected.shopName || "Vendor details"}</h3>
              <div>
                <button className="btn secondary" onClick={() => setSelected(null)} style={{ marginRight: 8 }}>
                  Close
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <p><strong>User ID:</strong> {selected.userId || (selected.user && selected.user.id) || "—"}</p>
                <p><strong>Shop Name:</strong> {selected.shopName || "—"}</p>
                <p><strong>GSTIN:</strong> {selected.gstin || "—"}</p>
                <p><strong>Created:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</p>
              </div>

              <div>
                <p><strong>Status:</strong> <span className={`vendor-status-badge ${selected.onboardingStatus?.toLowerCase() || "pending"}`}>{selected.onboardingStatus || "PENDING"}</span></p>
                <p><strong>Approved at:</strong> {selected.approvedAt ? new Date(selected.approvedAt).toLocaleString() : "—"}</p>
                {selected.rejectionReason && (
                  <p style={{ color: "red" }}><strong>Rejection reason:</strong> {selected.rejectionReason}</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <p style={{ marginBottom: 6 }}><strong>Bio:</strong></p>
              <div style={{ padding: 12, borderRadius: 8, background: "#fff", border: "1px solid #eee" }}>
                <div style={{ whiteSpace: "pre-wrap" }}>{selected.bio || "—"}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "flex-end" }}>
              {selected.onboardingStatus !== "APPROVED" && (
                <button
                  className="btn"
                  onClick={() => handleApprove(selected.id)}
                  disabled={actionLoading}
                >
                  Approve
                </button>
              )}

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Reject reason (optional — required to send rejection)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this vendor is being rejected (visible to vendor)"
                  style={{ width: "100%", minHeight: 80, padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn secondary" onClick={() => { setRejectReason(""); setSelected(null); }}>
                  Cancel
                </button>
                <button
                  className="btn"
                  onClick={() => handleReject(selected.id)}
                  disabled={actionLoading}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminVendorList;
