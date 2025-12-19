import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductCartQuantity } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";


const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
}) => {
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [cartMessageType, setCartMessageType] = useState('');
  const [wishlistMessageType, setWishlistMessageType] = useState('');

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

  // Check if product is in cart
  const checkCartStatus = async () => {
    if (!getAuthToken()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success && data.items) {
        const cartItem = data.items.find(item => item.productId && item.productId.id === product.id);
        setIsInCart(cartItem ? true : false);
      }
    } catch (err) {
      console.error('Error checking cart status:', err);
    }
  };

  // Add product to cart
  const handleAddToCart = async () => {
    if (!getAuthToken()) {
      // Redirect to login if not authenticated
      window.location.href = process.env.PUBLIC_URL + "/login-register";
      return;
    }

    if (cartLoading) return;

    try {
      setCartLoading(true);
      setCartMessage('');
      setCartMessageType('');

      const productId = product.id;

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity: quantityCount })
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
        throw new Error(data.message || `Server error: ${response.status}`);
      } else if (data.success) {
        setIsInCart(true);
        setCartMessage('Added to cart successfully!');
        setCartMessageType('success');

        // Dispatch event to update header cart count
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartMessage(`Error: ${err.message}`);
      setCartMessageType('error');
    } finally {
      setCartLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => {
        setCartMessage('');
        setCartMessageType('');
      }, 3000);
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
      setWishlistMessageType('info');
      setTimeout(() => {
        setWishlistMessage('');
        setWishlistMessageType('');
      }, 3000);
      return;
    }

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);
      setWishlistMessage('');
      setWishlistMessageType('');

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
          setWishlistMessageType('info');
        } else {
          throw new Error(data.message || `Server error: ${response.status}`);
        }
      } else if (data.success) {
        setIsInWishlist(true);
        setWishlistMessage('Added to wishlist successfully!');
        setWishlistMessageType('success');

        // Dispatch event to update header wishlist count
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        throw new Error(data.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setWishlistMessage(`Error: ${err.message}`);
      setWishlistMessageType('error');
    } finally {
      setWishlistLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => {
        setWishlistMessage('');
        setWishlistMessageType('');
      }, 3000);
    }
  };

  // Load wishlist and cart status on component mount
  useEffect(() => {
    checkWishlistStatus();
    checkCartStatus();
  }, []);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  return (
    <div className="product-details-content ml-70">
      <h2>{product.name}</h2>
      <div className="product-details-price">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{currency.currencySymbol + finalDiscountedPrice}</span>{" "}
            <span className="old">
              {currency.currencySymbol + finalProductPrice}
            </span>
          </Fragment>
        ) : (
          <span>{currency.currencySymbol + finalProductPrice} </span>
        )}
      </div>
      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pro-details-list">
        <p>{product.shortDescription}</p>
      </div>

      {product.variation ? (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => {
                return (
                  <label
                    className={`pro-details-color-content--single ${single.color}`}
                    key={key}
                  >
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      checked={
                        single.color === selectedProductColor ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variation &&
                product.variation.map(single => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, key) => {
                        return (
                          <label
                            className={`pro-details-size-content--single`}
                            key={key}
                          >
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={
                                singleSize.name === selectedProductSize
                                  ? "checked"
                                  : ""
                              }
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <span className="size-name">{singleSize.name}</span>
                          </label>
                        );
                      })
                    : "";
                })}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality">
          <div className="cart-plus-minus">
            <button
              onClick={() =>
                setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
              }
              className="dec qtybutton"
            >
              -
            </button>
            <input
              className="cart-plus-minus-box"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button
              onClick={() =>
                setQuantityCount(
                  quantityCount < productStock - productCartQty
                    ? quantityCount + 1
                    : quantityCount
                )
              }
              className="inc qtybutton"
            >
              +
            </button>
          </div>
          <div className="pro-details-cart btn-hover">
            {productStock && productStock > 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={isInCart || cartLoading}
                className={isInCart ? "active" : ""}
                title={isInCart ? "Added to cart" : "Add to cart"}
              >
                {" "}
                {isInCart ? "Added to Cart" : "Add To Cart"}{" "}
              </button>
            ) : (
              <button disabled>Out of Stock</button>
            )}
          </div>
          <div className="pro-details-wishlist">
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
              <i className="pe-7s-like" />
            </button>
          </div>
         {/*  <div className="pro-details-compare">
            <button
              className={compareItem !== undefined ? "active" : ""}
              disabled={compareItem !== undefined}
              title={
                compareItem !== undefined
                  ? "Added to compare"
                  : "Add to compare"
              }
              onClick={() => dispatch(addToCompare(product))}
            >
              <i className="pe-7s-shuffle" />
            </button>
          </div> */}
        </div>
      )}
      {product.category ? (
        <div className="pro-details-meta">
          <span>Categories :</span>
          <ul>
            {product.category.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
      {product.tag ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}

      {/* Cart Toast Notification */}
      {cartMessage && (
        <div
          className={`cart-toast ${cartMessageType}`}
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
            backgroundColor: cartMessageType === 'success' ? '#28a745' :
                           cartMessageType === 'error' ? '#dc3545' :
                           cartMessageType === 'info' ? '#17a2b8' : '#ffc107',
            color: 'white',
            border: 'none',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <i
              className={
                cartMessageType === 'success' ? 'fa fa-check-circle' :
                cartMessageType === 'error' ? 'fa fa-exclamation-circle' :
                cartMessageType === 'info' ? 'fa fa-info-circle' : 'fa fa-exclamation-triangle'
              }
              style={{ fontSize: '16px' }}
            ></i>
            {cartMessage}
          </div>
        </div>
      )}

      {/* Wishlist Toast Notification */}
      {wishlistMessage && (
        <div
          className={`wishlist-toast ${wishlistMessageType}`}
          style={{
            position: 'fixed',
            top: '120px',
            right: '20px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: wishlistMessageType === 'success' ? '#28a745' :
                           wishlistMessageType === 'error' ? '#dc3545' :
                           wishlistMessageType === 'info' ? '#17a2b8' : '#ffc107',
            color: 'white',
            border: 'none',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <i
              className={
                wishlistMessageType === 'success' ? 'fa fa-check-circle' :
                wishlistMessageType === 'error' ? 'fa fa-exclamation-circle' :
                wishlistMessageType === 'info' ? 'fa fa-info-circle' : 'fa fa-exclamation-triangle'
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
          .cart-toast, .wishlist-toast {
            transition: all 0.3s ease-out;
          }
        `
      }} />

      {/* <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>*/}
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  cartItems: PropTypes.array,
  
  currency: PropTypes.shape({}),
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({})
};

export default ProductDescriptionInfo;
