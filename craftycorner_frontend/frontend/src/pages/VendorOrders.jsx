import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../components/auth.css";

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const res = await api.get("/orders/vendor/my");

      setOrders(res.data || []);
    } catch (err) {
      console.error("Error loading vendor orders:", err);
      toast.error("Failed to load vendor orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2 className="page-heading">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <table className="vendor-table striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Total (₹)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}   className={`${
        o.status === "PAID" ? "paid-row" : ""
      }`}>
                <td>{o.id}</td>
                <td>{o.productTitle}</td>
                <td>{o.customerName}</td>
                <td>{o.quantity}</td>
                <td>₹{o.totalAmount}</td>

                <td>
                  <span
                    className={`order-status-badge ${o.status?.toLowerCase()}`}
                  >
                    {o.status}
                  </span>
                </td>

                <td>
                  {o.orderDate
                    ? new Date(o.orderDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VendorOrders;
