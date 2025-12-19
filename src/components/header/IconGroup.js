import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";

const IconGroup = ({ iconWhiteClass }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };

  // API base URL
  const API_BASE_URL = 'https://e-commerce-4-bsqw.onrender.com/api';

  // Get auth token from localStorage
  const getAuthToken = useCallback(() => localStorage.getItem('authToken'), []);

  // API headers with JWT authentication
  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  }), [getAuthToken]);

  // Fetch wishlist count
  const fetchWishlistCount = useCallback(async () => {
    if (!getAuthToken()) {
      setWishlistCount(0);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success && data.data) {
        setWishlistCount(data.data.length);
      } else {
        setWishlistCount(0);
      }
    } catch (err) {
      console.error('Error fetching wishlist count:', err);
      setWishlistCount(0);
    }
  }, [getAuthToken, getAuthHeaders]);

  // Fetch cart count
  const fetchCartCount = useCallback(async () => {
    if (!getAuthToken()) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart/count`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setCartCount(data.count || 0);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setCartCount(0);
    }
  }, [getAuthToken, getAuthHeaders]);

  useEffect(() => {
    const checkAuth = () => {
      // Check authentication status
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('userData');

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          console.log('Could not parse user data');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }

      // Fetch counts after auth check
      fetchWishlistCount();
      fetchCartCount();
    };

    // Check immediately
    checkAuth();

    // Also check when localStorage changes (for cross-tab updates)
    window.addEventListener('storage', checkAuth);

    // Listen for wishlist updates from product components
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    // Listen for cart updates from product components
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchWishlistCount, fetchCartCount]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery && searchQuery.trim();
    if (q) {
      navigate(`${process.env.PUBLIC_URL}/shop-grid-filter?search=${encodeURIComponent(q)}`);
      setShowSearchModal(false);
      setSearchQuery("");
    }
  };

  return (
      <div className={clsx("header-right-wrap", iconWhiteClass)} >
      {isAuthenticated && userData ? (
        <div className="same-style header-user-info">
          {/* Desktop view */}
          <Link
            to={process.env.PUBLIC_URL + "/my-account"}
            className="d-none d-lg-inline-flex text-decoration-none"
            style={{
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '6px 12px',
              borderRadius: '20px',
              background: '#8b5cf6',
              border: 'none',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#7c3aed';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#8b5cf6';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
            }}
          >
            My Account
          </Link>

          {/* Mobile view - removed My Account button from header */}
        </div>
      ) : (
        <div className="same-style header-login">
          <Link to={process.env.PUBLIC_URL + "/login-register"} className="d-none d-lg-inline-flex" style={{color: 'white', fontSize: '12px'}}>

            Login / Register
          </Link>
        </div>
      )}

      {/* Mobile Search Icon */}
      <div className="same-style header-search-mobile d-block d-lg-none" style={{marginLeft: '10px', marginTop: '2px'}}>
        <button
          className="search-toggle-button"
          onClick={() => setShowSearchModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: iconWhiteClass ? 'white' : 'inherit',
            fontSize: '28px',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <i className="pe-7s-search" />
        </button>
      </div>

      <div className="same-style header-wishlist position-relative" style={{marginLeft: '10px', marginTop: '2px'}}>
        <Link to={process.env.PUBLIC_URL + "/wishlist"} className="text-decoration-none d-flex align-items-center">
          <i className="pe-7s-like" style={{fontSize: '28px', color: iconWhiteClass ? 'white' : 'inherit'}} />
          {wishlistCount > 0 && (
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle"
                  style={{
                    fontSize: '11px',
                    minWidth: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          )}
        </Link>
      </div>
      <div className="same-style header-cart position-relative" style={{marginLeft: '15px', marginTop: '2px'}}>
        <Link to={process.env.PUBLIC_URL + "/cart"} className="text-decoration-none d-flex align-items-center">
          <i className="pe-7s-shopbag" style={{fontSize: '28px', color: iconWhiteClass ? 'white' : 'inherit'}} />
          {cartCount > 0 && (
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle"
                  style={{
                    fontSize: '11px',
                    minWidth: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>
      </div>
      

      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>

      {/* Modern Search Overlay */}
      {showSearchModal && (
        <div
          className="search-overlay"
          onClick={() => setShowSearchModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '120px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div
            className="search-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '500px',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div
              className="search-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Search Products
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <div
                className="search-input-container"
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '50px',
                  padding: '5px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              >
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '15px 60px 15px 25px',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '18px',
                    fontWeight: '400',
                    color: '#333',
                    borderRadius: '45px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '18px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
                  }}
                >
                  <i className="pe-7s-search"></i>
                </button>
              </div>
            </form>

            <div
              style={{
                marginTop: '20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px'
              }}
            >
              Press Enter to search or click outside to close
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .search-overlay input::placeholder {
              color: #999;
              font-weight: 300;
            }

            .search-overlay input:focus::placeholder {
              color: #ccc;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};



export default IconGroup;
