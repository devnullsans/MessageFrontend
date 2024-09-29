import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCompany } from "../utils/api"; // Adjust the import based on your file structure
import toast from "react-hot-toast";

function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  console.log(location);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const verifyData = { email, otp };
      const result = await verifyCompany(verifyData);

      toast.success("Email verified successfully!");
      navigate("/dashboard"); // Redirect to the next page after successful verification
    } catch (error) {
      toast.error("Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: 800,
      }}
      className="container d-flex"
    >
      <form className="register-form m-auto" onSubmit={handleSubmit}>
        <h2>Verify your Email ID</h2>
        <p>Please enter the OTP sent to {email}:</p>
        <div className="form-group">
          <label htmlFor="otp">OTP:</label>
          <input
            type="text"
            id="otp"
            className="form-control"
            minLength={4}
            maxLength={4}
            value={otp}
            title={"OTP should be 4 letters"}
            onChange={(e) => setOtp(e.target.value)}
            onInvalid={(event) => {
              event.preventDefault(); // Prevent default browser validation message
              toast.error(
                !event.target.value ? `${event.target.validationMessage && "OTP is required"}` : `${event.target.title}`
              );
            }}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email ID"}
        </button>
      </form>
    </div>
  );
}

export default Verify;
