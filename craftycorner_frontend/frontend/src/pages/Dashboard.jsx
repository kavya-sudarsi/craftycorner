import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import TopCategoryBar from "../components/TopCategoryBar";
import "../components/auth.css";

import HeroImg from "../assets/home/hero.png";
import Cat1 from "../assets/home/category1.png";
import Cat2 from "../assets/home/category2.png";
import Cat3 from "../assets/home/category3.png";
import Cat4 from "../assets/home/category4.png";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8082";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products"),
      ]);
      setCategories(catRes.data?.slice(0, 4) || []);
      setProducts(prodRes.data?.slice(0, 6) || []);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function handleWishlistClick(e, product) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser) {
        toast.error("Please login to add wishlist");
        return;
      }

      const userId = currentUser.id;
      const productId = product.id;

      await api.post(`/wishlist/${userId}/add/${productId}`);

      toast.success("Added to wishlist ❤️");

      setProducts((prev) =>
        prev.map((x) =>
          x.id === product.id ? { ...x, inWishlist: true } : x
        )
      );
    } catch (err) {
      toast.error("Failed to add wishlist");
    }
  }

  if (loading) return <p>Loading your dashboard…</p>;

  return (
    <div className="dashboard-container">
      <TopCategoryBar />

      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${HeroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "14px",
          padding: "70px 30px",
          color: "white",
        }}
      >
        <h1 className="hero-title">
          Welcome, <span className="highlight">{user?.name}</span> 🎨
        </h1>
        <p className="hero-subtitle">
          Explore unique handmade creations from talented local artisans.
        </p>
        <Link to="/products" className="btn" style={{ padding: "10px 18px" }}>
           Shop Now
        </Link>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2 className="page-heading">Browse Categories</h2>
        <div className="categories-grid">
          {categories.map((c) => (
            <div
              key={c.id}
              className="category-card"
              style={{
                backgroundImage: `url(${
                  c.id === 1 ? Cat1 : c.id === 2 ? Cat2 : c.id === 3 ? Cat3 : Cat4
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "180px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "flex-end",
                padding: "16px",
                color: "white",
              }}
            >
              <div className="category-body">
                <h3>{c.name}</h3>
                <p>{c.description || "Handmade wonders await!"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "50px" }}>
        <h2 className="page-heading">Featured Products</h2>

        <div className="products-grid consistent-grid">
          {products.map((p) => {
            const hasImage = p.imageUrls && p.imageUrls.length > 0;
            const imgSrc = hasImage
              ? p.imageUrls[0].startsWith("http")
                ? p.imageUrls[0]
                : `${BACKEND_BASE}${p.imageUrls[0]}`
              : "/placeholder.png";

            return (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="product-card-link"
              >
                <article className="product-card">
                  <div className="product-image-box">
                    <div
                      className="wishlist-heart"
                      onClick={(e) => handleWishlistClick(e, p)}
                    >
                      {p.inWishlist ? "❤️" : "🖤"}
                    </div>

                    <img
                      src={imgSrc}
                      alt={p.title}
                      className="product-card-thumb"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>

                  <div className="product-card-body">
                    <div className="product-row">
                      <h3 className="product-title">{p.title}</h3>
                      <div className="product-price">₹{p.basePrice}</div>
                    </div>

                    <p className="product-desc">
                      {p.description?.length > 80
                        ? p.description.slice(0, 80) + "…"
                        : p.description}
                    </p>

                    <div className="product-meta">
                      <span className="muted">{p.categoryName || "—"}</span>
                      <span className="muted">By {p.vendorName || "Seller"}</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/products" className="btn secondary">
            View All Products →
          </Link>
        </div>
      </section>
    </div>
  );
}
export default Dashboard;