import React from "react";
import { useNavigate } from "react-router-dom";

function PageOne() {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="mb-4">Welcome</h1>
        <button
          className="btn btn-primary btn-lg m-0 py-0 mb-3"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <br />
        <button
          className="btn btn-secondary btn-lg py-0  m-0 "
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default PageOne;
