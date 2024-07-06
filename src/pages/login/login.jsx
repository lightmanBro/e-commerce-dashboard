import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./Auth.scss";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState("login");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      setView("resetPassword");
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      setError("Login failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:4000/forget-password", { email });
      setMessage(`Check your email for reset link: ${response.data.resetUrl}`);
      setError("");
    } catch (err) {
      setError("Failed to send reset link");
      setMessage("");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`http://127.0.0.1:4000/reset-password/${token}`, { password });
      setMessage("Password reset successful");
      setError("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Password reset failed");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      {view === "login" && (
        <div className="auth-form">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <button onClick={() => setView("forgotPassword")}>Forgot Password?</button>
        </div>
      )}

      {view === "forgotPassword" && (
        <div className="auth-form">
          <h2>Forgot Password</h2>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleForgotPassword}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
          <button onClick={() => setView("login")}>Back to Login</button>
        </div>
      )}

      {view === "resetPassword" && (
        <div className="auth-form">
          <h2>Reset Password</h2>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleResetPassword}>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Reset Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Auth;
