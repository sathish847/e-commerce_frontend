import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const LoginRegister = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for OAuth callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const success = urlParams.get('success');
    const userData = urlParams.get('user');

    if (token && success === 'true') {
      // Store token
      localStorage.setItem('authToken', token);

      // Store user data if available in URL params
      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem('userData', JSON.stringify(user));
        } catch (e) {
          console.log('Could not parse user data from URL params');
        }
      }

      // Clear URL parameters and redirect to home
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/');
    }
  }, [navigate]);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setError("");

    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = 'https://e-commerce-4-bsqw.onrender.com/auth/google';
    } catch (err) {
      setError("Failed to initiate Google authentication");
      setIsLoading(false);
    }
  };

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get('user-email');
    const password = formData.get('user-password');

    try {
      const response = await fetch('https://e-commerce-4-bsqw.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token first
        localStorage.setItem('authToken', data.token);

        // If backend doesn't return user data, fetch it using the token
        if (!data.user) {
          try {
            const userResponse = await fetch('https://e-commerce-4-bsqw.onrender.com/auth/me', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json',
              },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              console.log('Fetched user data after login:', userData);
              localStorage.setItem('userData', JSON.stringify(userData.user || userData));
            } else {
              console.log('Failed to fetch user data after login');
              // Fallback: create minimal user object from login form data
              const formData = new FormData(e.target);
              const email = formData.get('user-email');
              const fallbackUser = { email: email, name: email.split('@')[0] };
              localStorage.setItem('userData', JSON.stringify(fallbackUser));
            }
          } catch (userFetchError) {
            console.log('Error fetching user data:', userFetchError);
            // Fallback: create minimal user object from login form data
            const formData = new FormData(e.target);
            const email = formData.get('user-email');
            const fallbackUser = { email: email, name: email.split('@')[0] };
            localStorage.setItem('userData', JSON.stringify(fallbackUser));
          }
        } else {
          // Backend returned user data
          console.log('Normal login response data:', data);
          console.log('User data to store:', data.user);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }

        // Navigate to home page
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNormalRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const name = formData.get('user-name');
    const email = formData.get('user-email');
    const password = formData.get('user-password');

    try {
      const response = await fetch('https://e-commerce-4-bsqw.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        // Navigate to home page
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
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
        titleTemplate="Login"
        description="Login page of e-commerce react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Login Register", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}
                          <div className="login-register-form">
                            <form onSubmit={handleNormalLogin}>
                              <input
                                type="email"
                                name="user-email"
                                placeholder="Email"
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <Link
                                    to={process.env.PUBLIC_URL + "/forgot-password"}
                                    style={{
                                      color: '#007bff',
                                      textDecoration: 'underline',
                                      fontSize: '14px'
                                    }}
                                  >
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button type="submit">
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>

                            <div className="divider text-center my-4">
                              <span style={{ color: '#666', fontSize: '14px' }}>or</span>
                            </div>

                            {/* Google OAuth Button */}
                            <div className="google-auth-section text-center">
                              <button
                                type="button"
                                onClick={handleGoogleAuth}
                                disabled={isLoading}
                                className="btn btn-outline-secondary d-flex align-items-center justify-content-center mx-auto"
                                style={{
                                  border: '1px solid #ddd',
                                  backgroundColor: '#fff',
                                  color: '#757575',
                                  padding: '12px 24px',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'background-color 0.2s, box-shadow 0.2s',
                                  maxWidth: '300px'
                                }}
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" className="me-2">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                {isLoading ? 'Connecting...' : 'Continue with Google'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}
                          <div className="login-register-form">
                            <form onSubmit={handleNormalRegister}>
                              <input
                                type="text"
                                name="user-name"
                                placeholder="Username"
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                              />
                              <input
                                name="user-email"
                                placeholder="Email"
                                type="email"
                              />
                              <div className="button-box">
                                <button type="submit">
                                  <span>Register</span>
                                </button>
                              </div>
                            </form>

                            <div className="divider text-center my-4">
                              <span style={{ color: '#666', fontSize: '14px' }}>or</span>
                            </div>

                            {/* Google OAuth Button */}
                            <div className="google-auth-section text-center">
                              <button
                                type="button"
                                onClick={handleGoogleAuth}
                                disabled={isLoading}
                                className="btn btn-outline-secondary d-flex align-items-center justify-content-center mx-auto"
                                style={{
                                  border: '1px solid #ddd',
                                  backgroundColor: '#fff',
                                  color: '#757575',
                                  padding: '12px 24px',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'background-color 0.2s, box-shadow 0.2s',
                                  maxWidth: '300px'
                                }}
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" className="me-2">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                {isLoading ? 'Connecting...' : 'Continue with Google'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>


    </Fragment>
  );
};

export default LoginRegister;
