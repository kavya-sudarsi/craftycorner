import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../components/auth.css";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8082";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchCart() {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      toast.error("❌ Could not load your cart");
    } finally {
      setLoading(false);
    }
  }

async function handleRemove(itemId) {
  try {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));

    const res = await api.delete(`/cart/remove/${itemId}`);
    if (res?.data) {
      setCart(res.data);
    } else {
      await fetchCart();
    }
    toast.info("Item removed");
  } catch (err) {
    console.error("Remove failed:", err);
    toast.error("Could not remove item");
    await fetchCart(); 
  }
}


  async function handleClear() {
    try {
      await api.delete(`/cart/clear`);
      setCart({ items: [], totalAmount: 0 });
      toast.info("🧹 Cart cleared");
    } catch (err) {
      console.error("Clear cart failed:", err);
      toast.error(" Could not clear cart");
    }
  }

  const handleIncrease = async (itemId, qty) => {
    const newQty = qty + 1;
    try {
      await api.put(`/cart/update/${itemId}`, null, {
        params: { quantity: newQty },
      });
      await fetchCart();
    } catch (err) {
      console.error("Increase failed:", err);
      toast.error("⚠️ Could not update quantity");
    }
  };

  const handleDecrease = async (itemId, qty) => {
    if (qty <= 1) return;
    const newQty = qty - 1;
    try {
      await api.put(`/cart/update/${itemId}`, null, {
        params: { quantity: newQty },
      });
      await fetchCart();
    } catch (err) {
      console.error("Decrease failed:", err);
      toast.error("⚠️ Could not update quantity");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="loading">Loading your cart…</p>;
  if (!cart || !cart.items || cart.items.length === 0)
    return <p className="empty-cart">Your cart is empty 🛒</p>;

  return (
    <div className="cart-wrapper">
      <div className="proceed-bar">
        <button
          className="proceed-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Buy ({cart.items.length} item
          {cart.items.length > 1 ? "s" : ""})
        </button>
      </div>

      <div className="cart-list">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-card">
            <div className="cart-left">
              <img
                src={`${BACKEND_BASE}${item.imageUrl || "/placeholder.png"}`}
                alt={item.productName}
                className="cart-img"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>

            <div className="cart-right">
              <h4 className="cart-name">{item.productName}</h4>
              <p className="cart-variant">{item.variantDetails}</p>
              <p className="cart-stock">In stock</p>
              <p className="cart-price">
                ₹{(item.totalPrice || 0).toLocaleString()}
              </p>

              <div className="qty-box">
                <button
                  className="qty-btn"
                  onClick={() => handleDecrease(item.id, item.quantity)}
                >
                  –
                </button>
                <span>{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleIncrease(item.id, item.quantity)}
                >
                  +
                </button>
              </div>

              <div className="cart-actions">
                <button className="delete-btn" onClick={() => handleRemove(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>
          Items: <span>₹{(cart.totalAmount || 0).toLocaleString()}</span>
        </p>
        <p>Delivery: <span style={{ color: "#22c55e" }}>Free</span></p>
        <h4>
          Total:{" "}
          <span className="cart-total">
            ₹{(cart.totalAmount || 0).toLocaleString()}
          </span>
        </h4>

        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Proceed to Checkout →
        </button>

        <button className="clear-btn" onClick={handleClear}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}
export default Cart;
