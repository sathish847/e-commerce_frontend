import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const ResetPassword = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');

    if (resetToken) {
      setToken(resetToken);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);
    const newPassword = formData.get('new-password');
    const confirmPassword = formData.get('confirm-password');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://e-commerce-4-bsqw.onrender.com/auth/reset-password-with-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset successfully! You can now login with your new password.");
        setTimeout(() => {
          navigate('/login-register');
        }, 3000);
      } else {
        setError(data.message || 'Password reset failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Reset Password"
        description="Reset your password for e-commerce react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Reset Password", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <div className="login-form-container">
                    <div className="login-register-form">
                      <h4 className="text-center mb-4">Reset Your Password</h4>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="alert alert-success" role="alert">
                          {success}
                        </div>
                      )}

                      {!token ? (
                        <div className="text-center">
                          <p>Invalid reset link. Please request a new password reset.</p>
                          <Link to={process.env.PUBLIC_URL + "/login-register"}>
                            <button className="btn btn-primary">
                              Back to Login
                            </button>
                          </Link>
                        </div>
                      ) : (
                        <form onSubmit={handleResetPassword}>
                          <input
                            type="password"
                            name="new-password"
                            placeholder="New Password"
                            required
                          />
                          <input
                            type="password"
                            name="confirm-password"
                            placeholder="Confirm New Password"
                            required
                          />
                          <div className="button-box">
                            <button type="submit" disabled={isLoading}>
                              <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="text-center mt-3">
                        <Link to={process.env.PUBLIC_URL + "/login-register"}>
                          Back to Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ResetPassword;
