import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { refreshCart, useDispatchCart } from '../ContextReducer';

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const dispatch = useDispatchCart();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log('Login Response:', json);
    if (!json.success) {
      alert("Enter valid credentials");
    }
    if (json.success) {
      localStorage.setItem("authtoken", json.authtoken);
      localStorage.setItem("userId", json.userId); // Store userId from API response
      localStorage.setItem("userEmail", credentials.email);
      console.log('Stored userId:', localStorage.getItem('userId'));
      
      // Refresh cart data and dispatch it
      
      const cartData = refreshCart();
      dispatch({ type: "LOAD", payload: cartData });
      
      navigate("/");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
              id="exampleInputPassword1"
            />
            <Link to="/resetpassword" className="m-3">
              Forgot password?
            </Link>
          </div>
          

          <button type="submit" className="m-3 btn btn-success">
            Submit
          </button>
          <Link to="/createuser" className="m-3 btn btn-danger">
            Register
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
