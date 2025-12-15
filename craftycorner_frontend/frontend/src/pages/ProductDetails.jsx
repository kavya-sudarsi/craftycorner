import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8082";

function ProductDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  async function fetchOne() {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      const data = res.data;
      setProduct(data);

      if (data.imageUrls && data.imageUrls.length > 0) {
        const first = data.imageUrls[0];
        const src = first.startsWith("http")
          ? first
          : `${BACKEND_BASE}${first}`;
        setSelectedImage(src);
      }
    } catch (err) {
      console.error("Failed to fetch product", err);
      toast.error("❌ Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOne();
  }, [id]);

  const handleIncrease = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));

  async function handleAddToCart() {
    if (!token) {
      toast.error("❌ Please log in to add items to cart");
      return;
    }

    try {
      setAdding(true);

      const variantId = product?.variantId || product?.id;

      const response = await api.post("/cart/add", null, {
        params: { variantId, quantity },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(" Added to cart successfully!");
      } else {
        toast.error("⚠️ Could not add to cart, please try again.");
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      if (err.response?.status === 401) {
        toast.error("⚠️ Session expired. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || " Could not add to cart.");
      }
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p>Loading product…</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-details-page">
      <h2 className="page-heading">{product.title}</h2>

      <div className="product-details-grid">
        <div className="gallery">
          <img
            src={selectedImage || "/placeholder.png"}
            alt={product.title}
            className="main-image"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />

          <div className="thumbnail-scroll">
            {product.imageUrls?.length > 0 ? (
              product.imageUrls.map((url, i) => {
                const src = url.startsWith("http")
                  ? url
                  : `${BACKEND_BASE}${url}`;
                return (
                  <img
                    key={i}
                    src={src}
                    alt={`${product.title} ${i}`}
                    className={`thumb-small ${
                      selectedImage === src ? "active-thumb" : ""
                    }`}
                    onClick={() => setSelectedImage(src)}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                );
              })
            ) : (
              <img
                src="/placeholder.png"
                alt="placeholder"
                className="thumb-small"
              />
            )}
          </div>
        </div>

        <div className="detail-info">
          <p className="muted">Category: {product.categoryName || "—"}</p>
          <p className="muted">Seller: {product.vendorName || "—"}</p>
          <h3 className="price-text">Price: ₹{product.basePrice}</h3>

          <div style={{ marginTop: 12 }}>
            <h4>Description</h4>
            <p>{product.description || "No description available."}</p>
          </div>

          <div className="cart-actions">
            <div className="qty-control">
              <button onClick={handleDecrease} disabled={quantity <= 1}>
                –
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                readOnly
              />
              <button onClick={handleIncrease} disabled={quantity >= 10}>
                +
              </button>
            </div>

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Adding..." : "🛒 Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
