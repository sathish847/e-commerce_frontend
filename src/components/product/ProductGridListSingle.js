import PropTypes from "prop-types";
import { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";


const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [cartMessageType, setCartMessageType] = useState(''); // 'success' or 'error'
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
      // console.log('Adding to wishlist:', { productId, quantity: 1 });

      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity: 1 })
      });

      // console.log('Response status:', response.status);

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

  // Check if product is in cart
  const checkCartStatus = async () => {
    if (!getAuthToken()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success && data.data && data.data.items) {
        const cartItem = data.data.items.find(item => item.product.id === product.id);
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

  // Check wishlist and cart status on component mount
  useEffect(() => {
    checkWishlistStatus();
    checkCartStatus();
  }, []);

  return (
    <Fragment>
        <div className={clsx("product-wrap", spaceBottomClass)}>
          <div className="product-img product-img-container">
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

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
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
              <div className="pro-same-action pro-cart">
                {product.affiliateLink ? (
                  <a
                    href={product.affiliateLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {" "}
                    Buy now{" "}
                  </a>
                ) : product.variation && product.variation.length >= 1 ? (
                  <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                    Select Option
                  </Link>
                ) : product.stock && product.stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className={isInCart ? "active" : ""}
                    disabled={isInCart || cartLoading}
                    title={isInCart ? "Added to cart" : "Add to cart"}
                  >
                    {" "}
                    <i className="pe-7s-cart"></i>{" "}
                    {isInCart ? "Added" : "Add to cart"}
                  </button>
                ) : (
                  <button disabled className="active">
                    Out of Stock
                  </button>
                )}
              </div>
              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-content text-center">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {product.name}
              </Link>
            </h3>
            {product.rating && product.rating > 0 ? (
              <div className="product-rating">
                <Rating ratingValue={product.rating} />
              </div>
            ) : (
              ""
            )}
            <div className="product-price">
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

            {/* Cart Toast Notification */}
            {cartMessage && (
              <div
                className={`cart-toast ${cartMessageType}`}
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
                .wishlist-toast, .cart-toast {
                  transition: all 0.3s ease-out;
                }
              `
            }} />
          </div>
        </div>
        <div className="shop-list-wrap mb-30">
          <div className="row">
            <div className="col-xl-4 col-md-5 col-sm-6">
              <div className="product-list-image-wrap">
                <div className="product-img">
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    <img
                      className="default-img img-fluid"
                      src={process.env.PUBLIC_URL + product.image[0]}
                      alt=""
                    />
                    {product.image.length > 1 ? (
                      <img
                        className="hover-img img-fluid"
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
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-md-7 col-sm-6">
              <div className="shop-list-content">
                <h3>
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    {product.name}
                  </Link>
                </h3>
                <div className="product-list-price">
                  {discountedPrice !== null ? (
                    <Fragment>
                      <span>
                        {currency.currencySymbol + finalDiscountedPrice}
                      </span>
                      {" "}
                      <span className="old">
                        {currency.currencySymbol + finalProductPrice}
                      </span>
                    </Fragment>
                  ) : (
                    <span>{currency.currencySymbol + finalProductPrice} </span>
                  )}
                </div>
                {product.rating && product.rating > 0 ? (
                  <div className="rating-review">
                    <div className="product-list-rating">
                      <Rating ratingValue={product.rating} />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {product.shortDescription ? (
                  <p>{product.shortDescription}</p>
                ) : (
                  ""
                )}

                <div className="shop-list-actions d-flex align-items-center">
                  <div className="shop-list-btn btn-hover">
                    {product.affiliateLink ? (
                      <a
                        href={product.affiliateLink}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {" "}
                        Buy now{" "}
                      </a>
                    ) : product.variation && product.variation.length >= 1 ? (
                      <Link
                        to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                      >
                        Select Option
                      </Link>
                    ) : product.stock && product.stock > 0 ? (
                      <button
                        onClick={handleAddToCart}
                        className={isInCart ? "active" : ""}
                        disabled={isInCart || cartLoading}
                        title={isInCart ? "Added to cart" : "Add to cart"}
                      >
                        {" "}
                        <i className="pe-7s-cart"></i>{" "}
                        {isInCart ? "Added" : "Add to cart"}
                      </button>
                    ) : (
                      <button disabled className="active">
                        Out of Stock
                      </button>
                    )}
                  </div>

                  <div className="shop-list-wishlist ml-10">
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
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        
      />
    </Fragment>
  );
};

ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({}),
  
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({})
};

export default ProductGridListSingle;
