import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/logo.png";
import "../components/auth.css";

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("keyword", value.trim());

      navigate({
        pathname: "/products",
        search: params.toString(),
      });
    }, 300);
  };

  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/vendor")
  ) {
    return null;
  }

  const isVendor = user?.roles?.includes("ROLE_VENDOR");
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo-wrap">
          <img src={logo} alt="CraftyCorner Logo" className="logo" />
          <div>
            <div className="brand-name">CraftyCorner</div>
            <div className="brand-sub">Handmade marketplace</div>
          </div>
        </Link>
      </div>

      <div className="nav-search">
        <div className="search-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
            <path
              d="M21 21L16.65 16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <input
          className="nav-search-input"
          placeholder="Search handmade crafts..."
          value={input}
          onChange={handleSearchChange}
        />
      </div>

      <div className="nav-right">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <div className="profile-section" ref={dropdownRef}>
            <button
              className="profile-btn"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              👤 {user?.name || "Profile"}
            </button>

            {showDropdown && (
              <div className="profile-dropdown">
                <Link to="/dashboard" onClick={() => setShowDropdown(false)}>
                  🏠 Dashboard
                </Link>
                <Link to="/cart" onClick={() => setShowDropdown(false)}>
                  🛒 Cart
                </Link>
                <Link to="/orders" onClick={() => setShowDropdown(false)}>
                  📦 My Orders
                </Link>

                {!isVendor && !isAdmin && (
                  <Link
                    to="/vendor/onboard"
                    onClick={() => setShowDropdown(false)}
                  >
                    🏪 Sell with us
                  </Link>
                )}

                <button className="logout-btn" onClick={logout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
