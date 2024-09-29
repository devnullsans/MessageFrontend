import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/api";

const ResetPass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const token = searchParams.get("token");
    try {
      const data = await resetPassword(email, password);
      setMessage("Password has been successfully reset.");
      setError("");
      navigate("/login");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
      setMessage("");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
      className="d-flex"
    >
      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
        </form>
        {message && <p style={{ color: "green", textAlign: "center", marginTop: "15px" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPass;
