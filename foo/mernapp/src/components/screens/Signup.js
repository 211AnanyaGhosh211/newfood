import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    Geolocation: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.Geolocation,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert('Enter valid credentials');
    } else {
      navigate('/login');
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#d4edda' }}>
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(40,167,69,0.3)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h2 className="text-center text-success mb-4">SIGN UP</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text bg-success text-white">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              name="name"
              value={credentials.name}
              onChange={onChange}
              required
            />
          </div>

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

          <div className="input-group mb-4">
            <span className="input-group-text bg-success text-white">
              <i className="fas fa-map-marker-alt"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              name="Geolocation"
              value={credentials.Geolocation}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
