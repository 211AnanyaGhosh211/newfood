import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { refreshCart, useDispatchCart } from '../ContextReducer';

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatchCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const json = await response.json();
    console.log('Login Response:', json);
    if (!json.success) {
      alert("Enter valid credentials");
    } else {
      localStorage.setItem("authtoken", json.authtoken);
      localStorage.setItem("userId", json.userId);
      localStorage.setItem("userEmail", credentials.email);
      const cartData = refreshCart();
      dispatch({ type: "LOAD", payload: cartData });
      navigate("/");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#d4edda" }}>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 0 15px rgba(40,167,69,0.3)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2 className="text-center text-success mb-4">LOGIN NOW</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text bg-success text-white">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text bg-success text-white">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between mb-3">
            <Link to="/resetpassword" style={{ textDecoration: "none", color: "#28a745" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-success w-100 mb-3">
            Login
          </button>

          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/createuser" style={{ color: "#28a745", textDecoration: "none" }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
