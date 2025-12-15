import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import "../components/auth.css";

function AddProduct() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [madeToOrder, setMadeToOrder] = useState(false);
  const [leadTimeDays, setLeadTimeDays] = useState(0);
  const [status, setStatus] = useState("ACTIVE");
  const [images, setImages] = useState([]);

  const MAX_IMAGES = 5;

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const productRes = await api.post("/vendors/products", {
        title,
        description,
        basePrice,
        categoryId,
        madeToOrder,
        leadTimeDays,
        status,
      });

      const productId = productRes.data.id;

      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i]);
        formData.append("primaryImage", i === 0 ? "true" : "false");

        await api.post(`/images/${productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Product added successfully");
      setTimeout(() => navigate("/vendor/products"), 1200);

      resetForm();
    } catch {
      toast.error("Failed to add product");
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setBasePrice("");
    setCategoryId("");
    setMadeToOrder(false);
    setLeadTimeDays(0);
    setStatus("ACTIVE");
    setImages([]);
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > MAX_IMAGES) {
      toast.error(`You can upload up to ${MAX_IMAGES} images only`);
      return;
    }

    const validImages = files.filter((f) => f.type.startsWith("image/"));
    if (validImages.length !== files.length) {
      toast.error("Only image files are allowed");
      return;
    }

    setImages((prev) => [...prev, ...validImages]);
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="form-container">
      <h2 className="page-heading">Add Product</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Base Price (₹)</label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
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

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={madeToOrder}
              onChange={(e) => setMadeToOrder(e.target.checked)}
            />
            Made to order
          </label>
        </div>

        {madeToOrder && (
          <div className="form-group">
            <label>Lead Time (days)</label>
            <input
              type="number"
              value={leadTimeDays}
              onChange={(e) => setLeadTimeDays(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload Images (max {MAX_IMAGES})</label>
          <input type="file" multiple accept="image/*" onChange={handleImageSelect} />
        </div>

        {images.length > 0 && (
          <div className="image-list">
            {images.map((img, idx) => (
              <div key={idx} className={`image-card ${idx === 0 ? "primary" : ""}`}>
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={() => removeImage(idx)}
                >
                  ✕
                </button>
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="image-thumb"
                />
                {idx === 0 && <p className="primary-label">Primary</p>}
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="submit-btn">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
