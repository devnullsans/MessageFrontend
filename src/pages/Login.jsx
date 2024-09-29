import React, { useContext, useState } from "react";
import { fetchCompany, login } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";
import "../Login.css";

const Login = () => {
  const [email, setEmail] = useState("javheri.om2003@gmail.com");
  const [password, setPassword] = useState("Om@123123");
  const navigate = useNavigate();
  const { dispatch, fetchCompanyData } = useContext(GlobalContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      dispatch({ type: "SIGNIN", payload: fetchCompanyData() });
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="input-group">
          <label htmlFor="email" className="login-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="login-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <button type="button" onClick={() => navigate("/register")} className="register-button">
          Register
        </button>
        <a onClick={() => navigate("/forget-pass")} className="forget-password-link">
          Forget Password?
        </a>
      </form>
    </div>
  );
};

export default Login;
