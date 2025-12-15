// src/contexts/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import api from "../utils/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCurrentUser() {
      if (!token) {
        setUser(null);
        localStorage.removeItem("user");
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [token]);

  function login(jwtToken) {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
