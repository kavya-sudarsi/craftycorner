import { useEffect, useState } from "react";
import api from "../utils/api";
import { FiBox, FiCheckCircle, FiClock, FiDollarSign } from "react-icons/fi";
import "../components/auth.css";

function VendorDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pendingOrders: 0,
    earnings: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);

async function fetchStats() {
  try {
    const productRes = await api.get("/vendors/products");
    const products = productRes.data || [];

    const total = products.length;
    const active = products.filter((p) => p.status === "ACTIVE").length;

    // REAL ORDERS
    const orderRes = await api.get("/vendors/orders");
    const orders = orderRes.data || [];

    const pendingOrders = orders.filter(o => o.status === "PENDING").length;

    setStats({
      total,
      active,
      pendingOrders,
      earnings: 0, 
    });

    setRecentProducts(products.slice(-5).reverse());
  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}


  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="page-heading">Vendor Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dash-card teal">
          <FiBox size={24} />
          <div>
            <p>Total Products</p>
            <h3>{stats.total}</h3>
          </div>
        </div>

        <div className="dash-card green">
          <FiCheckCircle size={24} />
          <div>
            <p>Active Products</p>
            <h3>{stats.active}</h3>
          </div>
        </div>

        <div className="dash-card orange">
          <FiClock size={24} />
          <div>
            <p>Pending Orders</p>
            <h3>{stats.pendingOrders}</h3>
          </div>
        </div>

        <div className="dash-card yellow">
          <FiDollarSign size={24} />
          <div>
            <p>Earnings</p>
            <h3>₹{stats.earnings}</h3>
          </div>
        </div>
      </div>

      <div className="recent-products">
        <h3> Recent Products</h3>
        {recentProducts.length === 0 ? (
          <p>No products added yet</p>
        ) : (
          <table className="vendor-table striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.imageUrls?.length > 0 ? (
                      <img
                        src={p.imageUrls[0]}
                        alt="product"
                        className="dash-thumb"
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />
                    ) : (
                      <img
                        src="/placeholder.png"
                        alt="placeholder"
                        className="dash-thumb"
                      />
                    )}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.categoryName || "—"}</td>
                  <td>₹{p.basePrice}</td>
                  <td>
                    <span className={`status-badge ${p.status?.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default VendorDashboard;
