import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaSignOutAlt,
  FaFolderOpen,
} from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import "../components/auth.css";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-wrapper">
      <aside className={`admin-side ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-toggle" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </div>

        {!collapsed && <h2 className="admin-title">Admin Panel</h2>}

        <nav className="admin-nav">
          <NavLink to="/admin" end className="admin-item">
            <FaTachometerAlt className="admin-icon" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/admin/vendors" className="admin-item">
            <FaUsers className="admin-icon" />
            {!collapsed && <span>Vendors</span>}
          </NavLink>

          <NavLink to="/admin/products" className="admin-item">
            <FaBoxOpen className="admin-icon" />
            {!collapsed && <span>Products</span>}
          </NavLink>

          <NavLink to="/admin/categories" className="admin-item">
            <FaFolderOpen className="admin-icon" />
            {!collapsed && <span>Categories</span>}
          </NavLink>

          <NavLink to="/admin/orders" className="admin-item">
            <FaShoppingCart className="admin-icon" />
            {!collapsed && <span>Orders</span>}
          </NavLink>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
