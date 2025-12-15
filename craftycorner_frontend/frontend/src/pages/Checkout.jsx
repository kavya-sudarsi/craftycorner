import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "../components/auth.css";

const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE || "http://localhost:8082";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Checkout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    addressType: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cartRes, addrRes] = await Promise.all([
          api.get("/cart"),
          api.get("/addresses").catch(() => ({ data: [] })),
        ]);
        setCart(cartRes.data);
        setAddresses(addrRes.data || []);
        if (addrRes.data?.length > 0) setSelectedAddress(addrRes.data[0]);
      } catch (err) {
        console.error("Checkout load error:", err);
        toast.error("❌ Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const total =
    cart?.items?.reduce((sum, i) => sum + (i.totalPrice || 0), 0) || 0;

  async function handleAddAddress() {
    if (!newAddress.street || !newAddress.city || !newAddress.zipCode) {
      toast.warn("Please fill required fields");
      return;
    }

    try {
      const res = await api.post("/addresses", newAddress);
      toast.success("Address added");
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddress(res.data);
      setNewAddress({
        addressType: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });
    } catch (err) {
      console.error("Add address failed:", err);
      toast.error(" Failed to add address");
    }
  }

async function handlePlaceOrder() {
  if (!user?.id) {
    toast.error("Please login first");
    return;
  }
  if (!cart?.items?.length) {
    toast.warn("Your cart is empty");
    return;
  }
  if (!selectedAddress) {
    toast.warn("Please select an address");
    return;
  }

  try {
    const orderRes = await api.post("/orders", {
      userId: user.id,
      addressId: selectedAddress.id,
      paymentMethod,
      items: cart.items.map((it) => ({
        productVariantId: it.productVariantId,
        quantity: it.quantity,
      })),
    });

    const orderId = orderRes.data.id;
    toast.success(` Order created (#${orderId})`);

    navigate(`/payment?orderId=${orderId}`);
  } catch (err) {
    console.error("Checkout failed:", err);
    toast.error("Could not complete checkout");
  }
}


  if (loading) return <p className="loading">Loading checkout…</p>;
  if (!cart || !cart.items?.length)
    return <p className="empty-cart">Your cart is empty 🛒</p>;

  return (
    <div className="checkout-page">
      <h2 className="page-heading"> Checkout</h2>
      <div className="checkout-container">
        
        <div className="checkout-left">
          <h3>Shipping Address</h3>

          {addresses.length > 0 ? (
            <div className="address-list">
              {addresses.map((addr) => (
                <label key={addr.id} className="address-card">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?.id === addr.id}
                    onChange={() => setSelectedAddress(addr)}
                  />
                  <div>
                    <strong>{addr.addressType || "Home"}</strong> —{" "}
                    {addr.street}, {addr.city}, {addr.state}, {addr.country} -{" "}
                    {addr.zipCode}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="muted">No saved addresses yet</p>
          )}

          <div className="new-address">
            <h4>Add New Address</h4>
            <select
              className="input"
              value={newAddress.addressType}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressType: e.target.value })
              }
            >
              <option value="">Select Type</option>
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
              <option value="OTHER">Other</option>
            </select>

            {["street", "city", "state", "country", "zipCode"].map((field) => (
              <input
                key={field}
                className="input"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newAddress[field]}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [field]: e.target.value })
                }
              />
            ))}

            <button className="btn-secondary" onClick={handleAddAddress}>
              ➕ Add Address
            </button>
          </div>
        </div>

        <div className="checkout-right">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.id} className="summary-item">
              <div className="summary-left">
                <img
                  src={
                    item.imageUrl
                      ? `${BACKEND_BASE}${item.imageUrl}`
                      : "/placeholder.png"
                  }
                  alt={item.productName}
                  className="summary-img"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div>
                  <p className="product-name">{item.productName}</p>
                  <p className="muted small">{item.variantDetails}</p>
                  <p className="muted small">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="item-price">
                ₹{(item.totalPrice || 0).toLocaleString()}
              </p>
            </div>
          ))}

          <hr className="divider" />
          <div className="price-summary">
            <div className="price-line">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="price-line discount">
              <span>Discount</span>
              <span>- ₹{(total * 0.05).toFixed(0)}</span>
            </div>
            <div className="price-line delivery">
              <span>Delivery Fee</span>
              <span>₹{total > 500 ? "0 (Free)" : "49"}</span>
            </div>
            <hr className="divider" />
            <div className="price-line grand-total">
              <span>Grand Total</span>
              <span>
                ₹
                {(
                  total - total * 0.05 + (total > 500 ? 0 : 49)
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <button className="btn-primary" onClick={handlePlaceOrder}>
             Place Order & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
export default Checkout;
