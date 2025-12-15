import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../components/auth.css";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8082";

function Wishlist() {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const res = await api.get(`/wishlist/${user.id}`);
      setWishlist(res.data || { items: [] });
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(itemId) {
    try {
      await api.delete(`/wishlist/${user.id}/remove/${itemId}`);
      toast.success("Removed from wishlist");

      setWishlist((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
      }));
    } catch {
      toast.error("Failed to remove item");
    }
  }

  if (!user) return <p>Please login to view wishlist.</p>;

  if (loading) return <p>Loading wishlist…</p>;

  if (!wishlist.items || wishlist.items.length === 0)
    return <p style={{ padding: "20px" }}>No items in your wishlist.</p>;

  return (
    <div className="dashboard-container">
      <h2 className="page-heading">❤️ My Wishlist</h2>

      <div className="wishlist-grid">
        {wishlist.items.map((item) => {
          const imgSrc = item.imageUrl
            ? item.imageUrl.startsWith("http")
              ? item.imageUrl
              : `${BACKEND_BASE}${item.imageUrl}`
            : "/placeholder.png";

          return (
            <Link
              to={`/products/${item.productId}`}
              key={item.id}
              className="wishlist-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={imgSrc}
                onError={(e) => (e.target.src = "/placeholder.png")}
                alt={item.title}
                className="wishlist-thumb"
              />

              <h3 className="wishlist-title">{item.title}</h3>

              <button
                className="btn small danger"
                onClick={(e) => {
                  e.preventDefault();
                  removeItem(item.id);
                }}
              >
                Remove
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default Wishlist;