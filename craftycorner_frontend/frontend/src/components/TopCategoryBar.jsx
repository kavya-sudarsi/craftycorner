import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

export default function TopCategoryBar({ limit = 10 }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category") || "ALL";

  useEffect(() => {
    let mounted = true;

    api.get("/categories")
      .then((res) => {
        if (!mounted) return;
        const list = res.data || [];
        setCategories(list.slice(0, limit));
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [limit]);

  function handleCategoryClick(categoryName) {
    const search = new URLSearchParams(location.search);

    if (!categoryName || categoryName === "ALL") {
      search.delete("category");
    } else {
      search.set("category", categoryName);
    }

    search.delete("page");

    navigate({
      pathname: "/products",
      search: search.toString(),
    });
  }

  return (
    <div
      style={{
        padding: "12px 0",
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <button
        className={`category-pill ${
          activeCategory === "ALL" ? "pill-active" : ""
        }`}
        onClick={() => handleCategoryClick("ALL")}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-pill ${
            activeCategory === category.name ? "pill-active" : ""
          }`}
          onClick={() => handleCategoryClick(category.name)}
        >
          {category.name}
        </button>
      ))}

      <button
        className="wishlist-top-btn"
        onClick={() => navigate("/wishlist")}
      >
        ❤️ Wishlist
      </button>
    </div>
  );
}
