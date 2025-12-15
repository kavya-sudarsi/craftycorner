import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../components/auth.css";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const STRIPE_PUBLISHABLE = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE);

function CheckoutForm({ clientSecret, orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: "Test User" },
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        // inform backend (updates DB)
        await api.post("/payments/confirm", {
          paymentIntentId: result.paymentIntent.id,
          orderId,
        });
        toast.success("Payment successful!");
        setTimeout(() => navigate("/orders"), 1000);
      } else {
        toast.error("Payment not successful");
      }
    } catch (err) {
      console.error("confirm error:", err);
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button className="btn-primary" type="submit" disabled={!stripe || processing}>
        {processing ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("orderId");

  const [clientSecret, setClientSecret] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!orderId) throw new Error("Missing orderId in URL");
        setLoading(true);

        const [orderRes, payRes] = await Promise.all([
          api.get(`/orders/${orderId}`).catch(() => null),
          api.post(`/payments/create/${orderId}`).catch((err) => { throw err; }),
        ]);

        if (orderRes?.data) setOrder(orderRes.data);
        setClientSecret(payRes.data.clientSecret);
        // publishable key can be read from payRes.data.publishableKey if needed
      } catch (err) {
        console.error("Payment load error:", err);
        toast.error("Could not prepare payment");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (loading) return <p className="loading">Preparing payment...</p>;
  if (!clientSecret) return <p className="empty-cart">Payment not available</p>;

  return (
    <div className="payment-page">
      <h2 className="page-heading">💳 Stripe Payment</h2>
      <div className="payment-container" style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Order #{orderId}</h3>
          <p><strong>Total:</strong> ₹{order?.totalAmount?.toLocaleString() || "—"}</p>
        </div>
        <div style={{ width: 420 }}>
          <Elements stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} orderId={Number(orderId)} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
export default Payment;