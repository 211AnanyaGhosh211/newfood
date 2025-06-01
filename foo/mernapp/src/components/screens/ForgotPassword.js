import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Set new password
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/reset-password/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email
        }),
      });
      
      const json = await response.json();
      
      if (json.success) {
        setMessage('OTP has been sent to your registered email. Please check your inbox.');
        setStep(2);
      } else {
        setMessage(json.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/reset-password/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        }),
      });
      
      const json = await response.json();
      
      if (json.success) {
        setMessage('OTP verified successfully. Please set your new password.');
        setStep(3);
      } else {
        setMessage(json.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/reset-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: newPassword
        }),
      });
      
      const json = await response.json();
      
      if (json.success) {
        setMessage('Password has been reset successfully. You can now login with your new password.');
        navigate('/login');
      } else {
        setMessage(json.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">
                {step === 1 ? 'Reset Password' : step === 2 ? 'Enter OTP' : 'Set New Password'}
              </h3>
              
              {message && (
                <div className="alert alert-info" role="alert">
                  {message}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your registered email"
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Send OTP
                    </button>
                    <Link to="/login" className="btn btn-secondary">
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder="Enter the OTP sent to your email"
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Verify OTP
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setStep(1);
                      setMessage('');
                    }}>
                      Back
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter your new password"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your new password"
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Reset Password
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setStep(1);
                      setMessage('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}>
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;