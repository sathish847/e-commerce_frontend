import React, { Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const ForgotPassword = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      // First, generate the reset token from backend
      const response = await fetch('https://e-commerce-4-bsqw.onrender.com/auth/generate-password-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Send email using EmailJS
        const resetLink = `${window.location.origin}/reset-password?token=${data.data.resetToken}`;

        const emailParams = {
          to_email: email,
          reset_link: resetLink,
          expires_in: data.data.expiresIn,
        };

        // You'll need to configure EmailJS with your service ID, template ID, and public key
        // For now, I'll use placeholder values - you'll need to replace these
        await emailjs.send(
          'service_pwhixct', // Replace with your EmailJS service ID
          'template_tcyx1dk', // Replace with your EmailJS template ID
          emailParams,
          'J28EhvqC4a_lx8EGe' // Replace with your EmailJS public key
        );

        setMessage("Password reset link has been sent to your email!");
        setEmail("");
        setTimeout(() => {
          navigate('/login-register');
        }, 3000);
      } else {
        setError(data.message || 'Failed to generate reset token');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Forgot Password"
        description="Reset your password for e-commerce react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Login Register", path: process.env.PUBLIC_URL + "/login-register" },
            {label: "Forgot Password", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <div className="login-form-container">
                    <div className="login-register-form">
                      <h4 className="text-center mb-4">Forgot Your Password?</h4>
                      <p className="text-center text-muted mb-4">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      {message && (
                        <div className="alert alert-success" role="alert">
                          {message}
                        </div>
                      )}

                      <form onSubmit={handleForgotPassword}>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="mb-3"
                        />
                        <div className="button-box">
                          <button type="submit" disabled={isLoading}>
                            <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
                          </button>
                        </div>
                      </form>

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

export default ForgotPassword;
