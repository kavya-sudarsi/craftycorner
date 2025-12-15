import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import "../components/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const emailValid = /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      setMessage("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/users/login", { email, password });
      const token = res.data?.token || res.data;

      login(token); 

      const me = await api.get("/users/me");
      const roles = me.data.roles || [];

      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("ROLE_VENDOR")) {
        navigate("/vendor");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Invalid credentials";
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShow((s) => !s)} aria-hidden>
              {show ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <div>
              New here? <Link to="/register">Register</Link>
            </div>
          </div>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
