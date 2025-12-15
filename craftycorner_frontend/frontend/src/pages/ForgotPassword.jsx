import { useState } from "react";
import api from "../utils/api";
import "../components/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/users/forgot-password", { email }); 
      setMsg("If an account exists, a reset link was sent to the email.");
    } catch (err) {
      console.error(err);
      setMsg(" Error sending reset link.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot password</h2>
        <p className="helper">Enter your email and we'll send a reset link.</p>

        <form onSubmit={handle}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit">Send reset link</button>
          {msg && <p className="message">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
export default ForgotPassword;