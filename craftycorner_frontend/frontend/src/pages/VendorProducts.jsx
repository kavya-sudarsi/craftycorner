import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import "../components/auth.css";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8082";

function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);

  async function fetchProducts() {
    try {
      const res = await api.get("/vendors/products");
      setProducts(res.data.content || res.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products.");
      toast.error("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchImages(productId) {
    try {
      const res = await api.get(`/images/product/${productId}`);
      setProductImages(res.data || []);
    } catch (err) {
      console.error("Error loading images:", err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/vendors/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Failed to delete product");
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    try {
      const payload = {
        title: editingProduct.title,
        description: editingProduct.description,
        basePrice: editingProduct.basePrice,
        madeToOrder: editingProduct.madeToOrder || false,
        leadTimeDays: editingProduct.leadTimeDays || 0,
        status: editingProduct.status || "DRAFT",
        categoryId: editingProduct.categoryId,
        tags: editingProduct.tags || [],
      };

      await api.put(`/vendors/products/${editingProduct.id}`, payload);
      toast.success("Product updated!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating:", err.response?.data || err);
      toast.error("❌ Failed to update product");
    }
  }

  async function handleUploadImage(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (productImages.length + files.length > 5) {
      toast.error("⚠️ Max 5 images allowed per product");
      return;
    }

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("primaryImage", "false");

      try {
        await api.post(`/images/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Failed to upload image");
      }
    }
    fetchImages(editingProduct.id);
  }

  async function handleSetPrimary(imageId) {
    try {
      await api.put(`/images/${imageId}`, { primaryImage: true });
      toast.success("Primary image updated");
      fetchImages(editingProduct.id);
    } catch (err) {
      console.error("Error setting primary:", err);
      toast.error("Failed to set primary");
    }
  }

  async function handleDeleteImage(imageId) {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`/images/${imageId}`);
      toast.success("Image deleted");
      fetchImages(editingProduct.id);
    } catch (err) {
      console.error("Error deleting image:", err);
      toast.error("Failed to delete image");
    }
  }

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 className="page-heading">My Products</h2>
      {products.length === 0 ? (
        <p>No products yet</p>
      ) : (
        <table className="vendor-table striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Visibility</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.imageUrls && p.imageUrls.length > 0 ? (
                    <img
                      src={
                        p.imageUrls[0].startsWith("http")
                          ? p.imageUrls[0]
                          : `${BACKEND_BASE}${p.imageUrls[0]}`
                      }
                      alt="product"
                      className="product-thumb"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="placeholder"
                      className="product-thumb"
                    />
                  )}
                </td>
                <td>{p.title}</td>
                <td>{p.description}</td>
                <td>{p.categoryName || "—"}</td>
                <td>₹{p.basePrice}</td>
                <td>
                  <span className={`status-badge ${p.status?.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  {p.status === "ACTIVE" ? (
                    <span className="visibility-badge visible">Visible</span>
                  ) : (
                    <span className="visibility-badge hidden">Hidden</span>
                  )}
                </td>
                <td>
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => {
                      setEditingProduct(p);
                      fetchImages(p.id);
                    }}
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(p.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()} 
          >
            <h3>Edit Product</h3>
            <form onSubmit={handleSaveEdit} className="product-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingProduct.categoryId || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      categoryId: Number(e.target.value),
                    })
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.basePrice}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      basePrice: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingProduct.status || "ACTIVE"}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div className="form-group">
                <label>Images</label>
                {productImages.length >= 5 ? (
                  <p className="image-limit">⚠️ Max 5 images allowed</p>
                ) : (
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadImage}
                    disabled={productImages.length >= 5}
                  />
                )}
              </div>

              <div className="image-list">
                {productImages.map((img) => (
                  <div
                    key={img.id}
                    className={`image-card ${img.primaryImage ? "primary" : ""}`}
                  >
                    <img
                      src={
                        img.imageUrl.startsWith("http")
                          ? img.imageUrl
                          : `${BACKEND_BASE}${img.imageUrl}`
                      }
                      alt=""
                      className="image-thumb"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                    {img.primaryImage && <p className="primary-label">Primary</p>}
                    <div className="image-actions">
                      {!img.primaryImage && (
                        <button
                          className="icon-btn edit-btn"
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                        >
                          <FiImage size={14} /> Primary
                        </button>
                      )}
                      <button
                        className="icon-btn delete-btn"
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button className="submit-btn" type="submit">
                  Save
                </button>
                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorProducts;
