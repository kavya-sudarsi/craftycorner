import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../utils/api";
import "../components/auth.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);

  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post("/categories", newCategory);
      toast.success("Category added");
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch {
      toast.error("Failed to add category");
    }
  }

  async function handleUpdate() {
    try {
      await api.put(`/categories/${editing.id}`, editing);
      toast.success("Category updated");
      setEditing(null);
      fetchCategories();
    } catch {
      toast.error("Failed to update category");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  }

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2 className="page-heading">Manage Categories</h2>

      <form onSubmit={handleAdd} className="category-inline-form">
        <input
          type="text"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          required
          className="category-inline-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          className="category-inline-input"
        />
        <button className="small-inline-btn" type="submit">
          Add
        </button>
      </form>

      <table className="vendor-table striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {editing?.id === c.id ? (
                  <input
                    className="table-edit-input"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                ) : (
                  <strong>{c.name}</strong>
                )}
              </td>
              <td>
                {editing?.id === c.id ? (
                  <input
                    className="table-edit-input"
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                ) : (
                  <span>{c.description || "—"}</span>
                )}
              </td>
              <td style={{ textAlign: "center" }}>
                {editing?.id === c.id ? (
                  <div className="action-btn-group">
                    <button
                      className="icon-btn edit-btn"
                      onClick={handleUpdate}
                      title="Save"
                    >
                      <FiSave size={16} />
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => setEditing(null)}
                      title="Cancel"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="action-btn-group">
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => setEditing(c)}
                      title="Edit"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleDelete(c.id)}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategories;
