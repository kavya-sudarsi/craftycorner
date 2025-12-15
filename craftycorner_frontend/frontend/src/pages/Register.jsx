import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../utils/api";
import "../components/auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const emailValid = /\S+@\S+\.\S+/.test(email);

  const passRules = {
    minLen: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordValid = Object.values(passRules).every(Boolean);
  const confirmMatch = password === confirm;

  const canSubmit = emailValid && passwordValid && confirmMatch && name.trim().length > 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!canSubmit) {
      setMessage("Please fix the errors before submitting.");
      return;
    }
    try {
      await api.post("/users/register", { name, email, password });
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Registration failed";
      setMessage(` ${errMsg}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an account</h2>
        

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <span className="eye-icon" onClick={() => setShow((s) => !s)}>
              {show ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group">
            <input
              type={showC ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShowC((s) => !s)}>
              {showC ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {!passwordValid && password.length > 0 && (
            <ul className="pass-rules">
              <li style={{ color: passRules.minLen ? "green" : "red" }}>
                ● Minimum 8 characters
              </li>
              <li style={{ color: passRules.upper ? "green" : "red" }}>
                ● At least one uppercase letter
              </li>
              <li style={{ color: passRules.lower ? "green" : "red" }}>
                ● At least one lowercase letter
              </li>
              <li style={{ color: passRules.number ? "green" : "red" }}>
                ● At least one number
              </li>
              <li style={{ color: passRules.special ? "green" : "red" }}>
                ● At least one special character (!@#$…)
              </li>
            </ul>
          )}

          {!confirmMatch && confirm.length > 0 && (
            <p className="small-error">Passwords do not match</p>
          )}

          <button className="btn" type="submit" disabled={!canSubmit}>
            Create account
          </button>

          <div className="auth-links" style={{ marginTop: 12 }}>
            <div>
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
