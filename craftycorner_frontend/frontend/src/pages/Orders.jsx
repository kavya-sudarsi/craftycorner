import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import "../components/auth.css";
import { toast } from "react-toastify";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const res = await api.get(`/orders/my/${user.id}`);
    const allOrders = res.data || [];

    const paidOrders = allOrders.filter(
      (o) =>
        o.paymentStatus?.toUpperCase() === "PAID" ||
        o.status?.toUpperCase() === "PAID" ||
        o.status?.toUpperCase() === "DELIVERED"
    );

    const cleanedOrders = paidOrders.map(order => ({
      ...order,
      items: order.items.filter(
        (item, index, self) =>
          index === self.findIndex(
            i => i.productName === item.productName
          )
      ),
    }));

    setOrders(cleanedOrders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    toast.error("Failed to load your orders");
  } finally {
    setLoading(false);
  }
};


  if (loading) return <div className="orders-loading">Loading your orders…</div>;

  if (!orders.length)
    return (
      <div className="orders-empty">
        🛒 No paid orders yet. Complete your payment to see them here.
      </div>
    );

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 Your Paid Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div><strong>Order ID:</strong> {order.id}</div>
            <div>
              <strong>Date:</strong>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    order.status === "DELIVERED"
                      ? "green"
                      : order.status === "PAID"
                      ? "#1D4ED8"
                      : "#555",
                  fontWeight: "bold",
                }}
              >
                {order.status || "Processing"}
              </span>
            </div>
          </div>

          <div className="order-body">
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                 <img
                  src={
                    item.imageUrls && item.imageUrls.length > 0
                      ? `${item.imageUrls[0].startsWith("http") ? "" : "http://localhost:8082"}${item.imageUrls[0]}`
                      : "/placeholder.png"
                  }
                  alt={item.productName || "Product"}
                  className="order-item-img"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />

                  <div className="item-details">
                    <h4>{item.productName || "Unnamed Product"}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h4>Order Summary</h4>
              <p><strong>Total:</strong> ₹{order.totalAmount?.toLocaleString()}</p>
              <p><strong>Payment:</strong> {order.paymentMethod || "CARD"}</p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  style={{
                    color:
                      ["PAID", "COMPLETED"].includes(
                        order.paymentStatus?.toUpperCase()
                      )
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {["PAID", "COMPLETED"].includes(
                    order.paymentStatus?.toUpperCase()
                  )
                    ? "PAID"
                    : order.paymentStatus || "Pending"}
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
