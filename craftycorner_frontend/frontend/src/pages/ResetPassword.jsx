import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../utils/api";
import "../components/auth.css";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const passRules = {
    minLen: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordValid = Object.values(passRules).every(Boolean);
  const confirmMatch = password === confirm;

  const handle = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!passwordValid) {
      setMessage("Password does not meet the rules.");
      return;
    }
    if (!confirmMatch) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await api.post("/users/reset-password", { token, newPassword: password });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Reset failed";
      setMessage(`${msg}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset password</h2>
        <p className="helper">Set a new password for your account.</p>

        <form onSubmit={handle}>
          <div className="input-group">
            <input
              type={show ? "text" : "password"}
              placeholder="New password"
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
              placeholder="Confirm new password"
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

          <button className="btn" type="submit" disabled={!passwordValid || !confirmMatch}>
            Reset password
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
