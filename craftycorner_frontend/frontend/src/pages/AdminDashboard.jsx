import { useEffect, useState } from "react";
import api from "../utils/api";
import { FiUsers, FiBox, FiShoppingCart, FiClock } from "react-icons/fi";
import "../components/auth.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  const [recentVendors, setRecentVendors] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  async function fetchDashboardData() {
    try {
      const vendorRes = await api.get("/admin/vendors");
      const vendors = vendorRes.data.content || vendorRes.data || [];

      const totalProductsRes = await api.get("/admin/products/count");
      const recentProductsRes = await api.get("/admin/products/recent");
       
      const totalOrderRes = await api.get("/admin/orders/count")

      const pending = vendors.filter(
        (v) => v.onboardingStatus === "PENDING"
      ).length;

      setStats({
        totalVendors: vendors.length,
        pendingVendors: pending,
        totalProducts: totalProductsRes.data || 0,
        totalOrders: totalOrderRes.data || 0,

      });

      setRecentVendors(vendors.slice(-5).reverse());
      setRecentProducts(recentProductsRes.data || []);
    } catch (err) {
      console.error("Error fetching admin dashboard:", err);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="page-heading"> Admin Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dash-card teal">
          <FiUsers size={24} />
          <div>
            <p>Total Vendors</p>
            <h3>{stats.totalVendors}</h3>
          </div>
        </div>

        <div className="dash-card orange">
          <FiClock size={24} />
          <div>
            <p>Pending Vendors</p>
            <h3>{stats.pendingVendors}</h3>
          </div>
        </div>

        <div className="dash-card green">
          <FiBox size={24} />
          <div>
            <p>Total Products</p>
            <h3>{stats.totalProducts}</h3>
          </div>
        </div>

        <div className="dash-card yellow">
          <FiShoppingCart size={24} />
          <div>
            <p>Total Orders</p>
            <h3>{stats.totalOrders}</h3>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h3 className="section-title"> Recent Vendor Registrations</h3>
        {recentVendors.length === 0 ? (
          <p>No vendors found.</p>
        ) : (
          <table className="vendor-table striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Shop Name</th>
                <th>GSTIN</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentVendors.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.shopName || "—"}</td>
                  <td>{v.gstin || "—"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        v.onboardingStatus?.toLowerCase() || "pending"
                      }`}
                    >
                      {v.onboardingStatus}
                    </span>
                  </td>
                  <td>
                    {v.createdAt
                      ? new Date(v.createdAt).toLocaleDateString("en-IN", {
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

      <div className="admin-section">
        <h3 className="section-title"> Recent Product Submissions</h3>
        {recentProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="vendor-table striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.vendorName || "—"}</td>
                  <td>{p.categoryName || "—"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        p.status?.toLowerCase() || "draft"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-IN", {
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
    </div>
  );
}

export default AdminDashboard;
