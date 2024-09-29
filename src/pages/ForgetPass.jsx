import React, { useState } from "react";
import { forgotPassword, verifyCompanyReset } from "../utils/api"; // Assuming verifyOtp is your OTP verification API
import { useNavigate } from "react-router-dom";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeOtp = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage("Password reset link has been sent to your email.");
      setError("");
      setOtpSent(true); // Show OTP input after successful email submission
    } catch (error) {
      setError("Failed to send password reset link. Please try again.");
      setMessage("");
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyCompanyReset({ email, otp }); // Assuming this API verifies the OTP
      setError("");
      navigate("/reset-password", { state: { email } }); // Navigate to reset password page
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
      setMessage("");
    }
  };

  return (
    <div style={{ height: "100vh" }} className="d-flex">
      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          textAlign: "center",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>Forgot Password</h2>
        <form onSubmit={otpSent ? handleSubmitOtp : handleSubmitEmail}>
          {!otpSent ? (
            <>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChangeEmail}
                placeholder="Enter Your Email"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                Send Reset Link
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleChangeOtp}
                placeholder="Enter OTP"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                Verify OTP
              </button>
            </>
          )}
        </form>
        {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgetPass;
