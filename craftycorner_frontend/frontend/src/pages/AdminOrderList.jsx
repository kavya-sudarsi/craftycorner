import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  FiEye,
  FiTrash2,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import "../components/auth.css";

const STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
};

function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // order for modal
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders");
      setOrders(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      toast.error("❌ Failed to load orders");
      setOrders([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return setFiltered(orders);
    const f = orders.filter(
      (o) =>
        String(o.id).includes(q) ||
        (o.items || []).some((it) =>
          (it.productName || "").toLowerCase().includes(q)
        ) ||
        (String(o.userId) || "").includes(q) ||
        (o.paymentMethod || "").toLowerCase().includes(q)
    );
    setFiltered(f);
    setCurrentPage(1);
  }, [search, orders]);

  async function updateStatus(orderId, newStatus) {
    if (!window.confirm(`Change status to ${newStatus} ?`)) return;
    try {
      setActionLoading(true);
      await api.put(`/admin/orders/${orderId}/status`, null, {
        params: { status: newStatus },
      });
      toast.success(` Order ${orderId} marked ${newStatus}`);
      await fetchOrders();
      // keep modal fresh if open
      if (selected && selected.id === orderId) {
        const updated = (await api.get(`/admin/orders/${orderId}`)).data;
        setSelected(updated);
      }
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("❌ Failed to update status");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel(orderId) {
    // Cancel is just status update to CANCELLED in our flow
    await updateStatus(orderId, STATUS.CANCELLED);
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 className="page-heading">Order Management</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by ID / product / user / payment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ minWidth: 260 }}
          />
          <button className="btn secondary" onClick={fetchOrders}>Refresh</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="vendor-table striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.userId ?? "—"}</td>
                <td>{(o.items || []).length}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <span className={`status-badge ${ (o.status || "").toLowerCase() }`}>
                    {o.status}
                  </span>
                </td>
                <td>
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <div className="action-btn-group">
                    <button
                      className="icon-btn edit-btn"
                      title="View"
                      onClick={async () => {
                        try {
                          const res = await api.get(`/admin/orders/${o.id}`);
                          setSelected(res.data);
                        } catch (err) {
                          console.error(err);
                          toast.error("❌ Failed to load order details");
                        }
                      }}
                    >
                      <FiEye size={16} />
                    </button>

                    {o.status === STATUS.PENDING && (
                      <>
                        <button
                          className="icon-btn edit-btn"
                          title="Mark as Paid"
                          onClick={() => updateStatus(o.id, STATUS.PAID)}
                        >
                          <FiCheckCircle size={16} />
                        </button>
                        <button
                          className="icon-btn delete-btn"
                          title="Cancel"
                          onClick={() => handleCancel(o.id)}
                        >
                          <FiXCircle size={16} />
                        </button>
                      </>
                    )}

                    {o.status === STATUS.PAID && (
                      <>
                        <button
                          className="icon-btn edit-btn"
                          title="Mark as Shipped"
                          onClick={() => updateStatus(o.id, STATUS.SHIPPED)}
                        >
                          <FiTruck size={16} />
                        </button>
                        <button
                          className="icon-btn delete-btn"
                          title="Cancel"
                          onClick={() => handleCancel(o.id)}
                        >
                          <FiXCircle size={16} />
                        </button>
                      </>
                    )}

                    {o.status === STATUS.SHIPPED && (
                      <button
                        className="icon-btn edit-btn"
                        title="Mark as Delivered"
                        onClick={() => updateStatus(o.id, STATUS.DELIVERED)}
                      >
                        <FiCheckCircle size={16} />
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="pagination-bar" style={{ marginTop: 12 }}>
          <button
            className="btn secondary"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>
          <span>
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            className="btn secondary"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}

      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,10,10,0.45)",
            zIndex: 60,
          }}
        >
          <div
            className="modal-card order-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Order #{selected.id}</h3>
              <div>
                <button className="btn secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>

            <div className="order-info-grid" style={{ marginTop: 12 }}>
              <div>
                <p><strong>User ID:</strong> {selected.userId || "—"}</p>
                <p><strong>Payment:</strong> {selected.paymentMethod || "—"} / {selected.paymentStatus || "—"}</p>
                <p><strong>Total:</strong> ₹{selected.totalAmount}</p>
              </div>

              <div>
                <p><strong>Status:</strong> <span className={`status-badge ${selected.status?.toLowerCase()}`}>{selected.status}</span></p>
                <p><strong>Created:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</p>
                <p><strong>Updated:</strong> {selected.updatedAt ? new Date(selected.updatedAt).toLocaleString() : "—"}</p>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <h4 style={{ marginBottom: 8 }}>Items</h4>
              <table className="vendor-table striped order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((it) => (
                    <tr key={it.id}>
                      <td style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {it.imageUrls && it.imageUrls.length > 0 ? (
                          <img src={it.imageUrls[0]} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 6, background: "#f3f3f3" }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700 }}>{it.productName || "—"}</div>
                        </div>
                      </td>
                      <td>{it.productVariantId ?? "—"}</td>
                      <td>{it.quantity}</td>
                      <td>₹{it.price}</td>
                      <td>₹{it.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              {selected.status === STATUS.PENDING && (
                <>
                  <button className="btn" onClick={() => updateStatus(selected.id, STATUS.PAID)} disabled={actionLoading}>Mark Paid</button>
                  <button className="btn secondary" onClick={() => handleCancel(selected.id)} disabled={actionLoading}>Cancel</button>
                </>
              )}

              {selected.status === STATUS.PAID && (
                <>
                  <button className="btn" onClick={() => updateStatus(selected.id, STATUS.SHIPPED)} disabled={actionLoading}>Mark Shipped</button>
                  <button className="btn secondary" onClick={() => handleCancel(selected.id)} disabled={actionLoading}>Cancel</button>
                </>
              )}

              {selected.status === STATUS.SHIPPED && (
                <button className="btn" onClick={() => updateStatus(selected.id, STATUS.DELIVERED)} disabled={actionLoading}>Mark Delivered</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminOrderList;
