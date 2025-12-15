import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../components/auth.css";
import { FiCheckCircle, FiXCircle, FiTrash2 } from "react-icons/fi";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  async function fetchProducts() {
    try {
      setLoading(true);
      const url =
        filter === "ALL" ? "/admin/products" : `/admin/products?status=${filter}`;
      const res = await api.get(url);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const result = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(lowerSearch) ||
        p.vendorName?.toLowerCase().includes(lowerSearch)
    );
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [search, products]);

  async function handleApprove(id) {
    try {
      await api.post(`/admin/products/${id}/approve`);
      toast.success(" Product approved");
      fetchProducts();
    } catch (err) {
      toast.error("Error approving product");
    }
  }

  async function handleReject(id) {
    try {
      await api.post(`/admin/products/${id}/reject`);
      toast.warn(" Product rejected");
      fetchProducts();
    } catch (err) {
      toast.error("Error rejecting product");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success(" Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Error deleting product");
    }
  }

  if (loading) return <p>Loading products...</p>;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="dashboard-container">
      <div className="admin-header">
        <h2 className="page-heading"> Product Management</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder=" Search by title or vendor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <label className="filter-label">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DRAFT">Draft</option>
          </select>

          <button className="btn secondary" onClick={fetchProducts}>
            Refresh
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
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
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.vendorName || "—"}</td>
                <td>{p.categoryName || "—"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      (p.status || "").toLowerCase()
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <div className="action-btn-group">

                    <button
                      className="icon-btn edit-btn"
                      onClick={() => handleApprove(p.id)}
                      title="Approve"
                    >
                      <FiCheckCircle size={18} />
                    </button>

                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleReject(p.id)}
                      title="Reject"
                    >
                      <FiXCircle size={18} />
                    </button>

                    <button
                     className="icon-btn admin-delete-btn"
                      onClick={() => handleDelete(p.id)}
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="btn secondary"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>
          <span>
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            className="btn secondary"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminProductList;
