import PropTypes from "prop-types";
import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";

const ProductGridSingleTwo = ({
  product,
  currency,
  wishlistItem,
  spaceBottomClass,
  colorClass,
  titlePriceClass
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);
  const dispatch = useDispatch();

  // API base URL
  const API_BASE_URL = 'https://e-commerce-4-bsqw.onrender.com/api';

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  // API headers with JWT authentication
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Check if product is in wishlist
  const checkWishlistStatus = async () => {
    if (!getAuthToken()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/check/${product.id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setIsInWishlist(data.data);
      }
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  // Add product to wishlist
  const handleAddToWishlist = async () => {
    if (!getAuthToken()) {
      // Redirect to login if not authenticated
      window.location.href = process.env.PUBLIC_URL + "/login-register";
      return;
    }

    // Check if already in wishlist
    if (isInWishlist) {
      setWishlistMessage('This item is already in your wishlist!');
      setMessageType('info');
      setTimeout(() => {
        setWishlistMessage('');
        setMessageType('');
      }, 3000);
      return;
    }

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);
      setWishlistMessage('');
      setMessageType('');

      const productId = product.id;

      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity: 1 })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        const textResponse = await response.text();
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        // Check if it's a duplicate error (409 Conflict)
        if (response.status === 409 || (data.message && data.message.includes('already'))) {
          setIsInWishlist(true);
          setWishlistMessage('This item is already in your wishlist!');
          setMessageType('info');
        } else {
          throw new Error(data.message || `Server error: ${response.status}`);
        }
      } else if (data.success) {
        setIsInWishlist(true);
        setWishlistMessage('Added to wishlist successfully!');
        setMessageType('success');

        // Dispatch event to update header wishlist count
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        throw new Error(data.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setWishlistMessage(`Error: ${err.message}`);
      setMessageType('error');
    } finally {
      setWishlistLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => {
        setWishlistMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  // Check wishlist status on component mount
  useEffect(() => {
    checkWishlistStatus();
  }, []);

  return (
    <Fragment>
      <div className={clsx("product-wrap-2", spaceBottomClass, colorClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            <img
              className="default-img"
              src={process.env.PUBLIC_URL + product.image[0]}
              alt=""
            />
            {product.image.length > 1 ? (
              <img
                className="hover-img"
                src={process.env.PUBLIC_URL + product.image[1]}
                alt=""
              />
            ) : (
              ""
            )}
          </Link>
          {product.discount || product.new ? (
            <div className="product-img-badges">
              {product.discount ? (
                <span className="pink">-{product.discount}%</span>
              ) : (
                ""
              )}
              {product.new ? <span className="purple">New</span> : ""}
            </div>
          ) : (
            ""
          )}

          {/* Removed product action buttons */}
        </div>
        <div className="product-content-2">
          <div
            className={`title-price-wrap-2 ${
              titlePriceClass ? titlePriceClass : ""
            }`}
          >
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {product.name}
              </Link>
            </h3>
            <div className="price-2">
              {discountedPrice !== null ? (
                <Fragment>
                  <span>
                    {currency.currencySymbol + finalDiscountedPrice}
                  </span>{" "}
                  <span className="old">
                    {currency.currencySymbol + finalProductPrice}
                  </span>
                </Fragment>
              ) : (
                <span>{currency.currencySymbol + finalProductPrice} </span>
              )}
            </div>
          </div>
          <div className="pro-wishlist-2">
            <button
              className={isInWishlist ? "active" : ""}
              disabled={isInWishlist || wishlistLoading}
              title={
                isInWishlist
                  ? "Added to wishlist"
                  : "Add to wishlist"
              }
              onClick={handleAddToWishlist}
            >
              <i className="fa fa-heart-o" />
            </button>
          </div>
          {/* Wishlist Toast Notification */}
          {wishlistMessage && (
            <div
              className={`wishlist-toast ${messageType}`}
              style={{
                position: 'fixed',
                top: '80px',
                right: '20px',
                zIndex: 9999,
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                minWidth: '300px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                backgroundColor: messageType === 'success' ? '#28a745' :
                               messageType === 'error' ? '#dc3545' :
                               messageType === 'info' ? '#17a2b8' : '#ffc107',
                color: 'white',
                border: 'none',
                animation: 'slideInRight 0.3s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <i
                  className={
                    messageType === 'success' ? 'fa fa-check-circle' :
                    messageType === 'error' ? 'fa fa-exclamation-circle' :
                    messageType === 'info' ? 'fa fa-info-circle' : 'fa fa-exclamation-triangle'
                  }
                  style={{ fontSize: '16px' }}
                ></i>
                {wishlistMessage}
              </div>
            </div>
          )}

          {/* Toast Animation Styles */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes slideInRight {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              .wishlist-toast {
                transition: all 0.3s ease-out;
              }
            `
          }} />
        </div>
      </div>
    </Fragment>
  );
};

ProductGridSingleTwo.propTypes = {
  wishlistItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
};

export default ProductGridSingleTwo;
