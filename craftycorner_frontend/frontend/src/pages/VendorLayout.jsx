import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaBars,
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import "../components/auth.css";

function VendorLayout() {
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout" style={{ minHeight: "100vh" }}>
      <aside
        className="admin-sidebar"
        style={{
          width: collapsed ? "70px" : "220px",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: collapsed ? "center" : "flex-end",
              marginBottom: "20px",
            }}
          >
            <FaBars
              onClick={() => setCollapsed(!collapsed)}
              style={{
                cursor: "pointer",
                fontSize: "20px",
                color: "white",
              }}
              title="Toggle sidebar"
            />
          </div>

          {!collapsed && <h2>Vendor Panel</h2>}

          <nav>
            <ul>
              <li>
                <NavLink
                  to="/vendor"
                  end
                  className={({ isActive }) =>
                    `admin-link ${isActive ? "active" : ""}`
                  }
                  title="Dashboard"
                >
                  <FaTachometerAlt style={{ marginRight: collapsed ? 0 : 8 }} />
                  {!collapsed && "Dashboard"}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/vendor/products"
                  className={({ isActive }) =>
                    `admin-link ${isActive ? "active" : ""}`
                  }
                  title="Products"
                >
                  <FaBoxOpen style={{ marginRight: collapsed ? 0 : 8 }} />
                  {!collapsed && "Products"}
                </NavLink>
              </li>

              <li style={{ marginLeft: collapsed ? 0 : "20px" }}>
                <NavLink
                  to="/vendor/products/add"
                  className={({ isActive }) =>
                    `admin-link ${isActive ? "active" : ""}`
                  }
                  title="Add Product"
                >
                  <FaPlus style={{ marginRight: collapsed ? 0 : 8 }} />
                  {!collapsed && "Add Product"}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/vendor/orders"
                  className={({ isActive }) =>
                    `admin-link ${isActive ? "active" : ""}`
                  }
                  title="Orders"
                >
                  <FaShoppingCart style={{ marginRight: collapsed ? 0 : 8 }} />
                  {!collapsed && "Orders"}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/vendor/profile"
                  className={({ isActive }) =>
                    `admin-link ${isActive ? "active" : ""}`
                  }
                  title="Profile"
                >
                  <FaUser style={{ marginRight: collapsed ? 0 : 8 }} />
                  {!collapsed && "Profile"}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/vendor/onboard"
                  className={({ isActive }) =>
                    `admin-link ${isActive ? "active" : ""}`
                  }
                  title="Onboard"
                >
                  <FaUser style={{ marginRight: collapsed ? 0 : 8 }} />
                  {!collapsed && "Onboard"}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? 0 : 8,
              background: "transparent",
              border: "none",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            title="Logout"
          >
            <FaSignOutAlt />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

  
      <main className="admin-content">
        <h1 style={{ marginBottom: "16px", color: "#0d9488" }}>
          Welcome, {user?.name} 
        </h1>
        <Outlet />
      </main>
    </div>
  );
}

export default VendorLayout;
