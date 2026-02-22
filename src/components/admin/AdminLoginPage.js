import React, { useState } from "react";
import axios from "axios";
import "../styles/AdminLogin.css";

// API Base URL
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_PROD_URL   // your live backend URL
    : "http://localhost:5001";             // local backend

export default function AdminLoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username,
        password,
      });

      if (res.data.success) {
        onLogin(res.data.token); // store token in App.js
      } else {
        setError(res.data.error || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Panel Login</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
