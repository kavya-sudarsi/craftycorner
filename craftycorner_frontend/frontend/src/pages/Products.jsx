import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../components/auth.css";
import TopCategoryBar from "../components/TopCategoryBar";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8082";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const location = useLocation();
  const navigate = useNavigate();

  const keyword = query.get("keyword") || "";
  const category = query.get("category") || "";
  const page = parseInt(query.get("page") || "0", 10);
  const size = parseInt(query.get("size") || "12", 10);

  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  async function fetchProducts() {
    try {
      setLoading(true);

      const hasFilters =
        (keyword && keyword.trim() !== "") || (category && category.trim() !== "");

      let res;
      if (hasFilters) {
        res = await api.get("/search/products", {
          params: {
            keyword: keyword || undefined,
            category: category || undefined,
            page,
            size,
            sortBy: query.get("sortBy") || "newest",
          },
        });
        setProducts(res.data?.content || res.data || []);
      } else {
        res = await api.get("/products");
        setProducts(res.data || []);
      }
    } catch (err) {
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function getImgSrc(p) {
    if (!p.imageUrls || p.imageUrls.length === 0) return "/placeholder.png";
    const first = p.imageUrls[0];
    return first.startsWith("http") ? first : `${BACKEND_BASE}${first}`;
  }

  async function handleWishlistClick(e, product) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast.error("Please login to add wishlist");
        return;
      }

      const userId = user.id;
      const productId = product.id;

      await api.post(`/wishlist/${userId}/add/${productId}`);

      toast.success("Added to wishlist ❤️");

      setProducts((prev) =>
        prev.map((x) =>
          x.id === product.id ? { ...x, inWishlist: true } : x
        )
      );
    } catch (err) {
      toast.error("Failed to add to wishlist");
    }
  }

  if (loading) return <p>Loading products…</p>;

  return (
    <div className="dashboard-container">
      <TopCategoryBar />

      <div
        className="top-filter-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h2 className="page-heading">
          {keyword ? `Results for "${keyword}"` : "🛍️ All Products"}
        </h2>

        <div style={{ display: "flex", gap: 8 }}>
          <select
            className="filter-select"
            value={(query.get("sortBy") || "newest").toLowerCase()}
            onChange={(e) => {
              const s = new URLSearchParams(location.search);
              s.set("sortBy", e.target.value.toLowerCase());
              s.delete("page");
              navigate({ pathname: "/products", search: s.toString() });
            }}
          >
            <option value="newest">Newest</option>
            <option value="priceasc">Price: Low → High</option>
            <option value="pricedesc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid consistent-grid">
          {products.map((p) => (
            <Link to={`/products/${p.id}`} key={p.id} className="product-card-link">
              <article className="product-card">
                <div className="product-image-box">

                  <div
                    className="wishlist-heart"
                    onClick={(e) => handleWishlistClick(e, p)}
                  >
                    {p.inWishlist ? "❤️" : "🖤"}
                  </div>

                  <img
                    src={getImgSrc(p)}
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
          ))}
        </div>
      )}
    </div>
  );
}
export default Products;