import { Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(new Set());

  let { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);

  // Memoized currency calculations
  const currencyRate = currency.currencyRate;
  const currencySymbol = currency.currencySymbol;

  // API base URL
  const API_BASE_URL = 'https://e-commerce-4-bsqw.onrender.com/api';

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  // API headers with JWT authentication
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setCartData(data);
        setError(null);
      } else {
        setError(data.message || 'Failed to load cart');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update item quantity with optimistic updates
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    const operationId = `update-${productId}`;
    if (!getAuthToken() || operationLoading.has(operationId)) return;

    // Optimistic update - update quantity immediately in UI
    const originalCartData = { ...cartData };
    const updatedItems = cartData.items.map(item => {
      const product = item.productId;
      if (product.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartData({ ...cartData, items: updatedItems });
    setOperationLoading(prev => new Set(prev).add(operationId));
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity: newQuantity })
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on failure
        setCartData(originalCartData);
        throw new Error(data.message || 'Failed to update quantity');
      }

      // Success - quantity already updated in UI, just trigger cart count update
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      // Revert on error
      setCartData(originalCartData);
      setError(err.message);
      console.error('Error updating quantity:', err);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  }, [cartData, operationLoading]);

  // Remove item from cart with optimistic updates
  const removeItem = useCallback(async (productId) => {
    const operationId = `remove-${productId}`;
    if (!getAuthToken() || operationLoading.has(operationId)) return;

    // Optimistic update - remove item immediately from UI
    const originalCartData = { ...cartData };
    const updatedItems = cartData.items.filter(item => {
      const product = item.productId;
      return product.id !== productId;
    });

    setCartData({ ...cartData, items: updatedItems });
    setOperationLoading(prev => new Set(prev).add(operationId));
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on failure
        setCartData(originalCartData);
        throw new Error(data.message || 'Failed to remove item');
      }

      // Success - item already removed from UI, just trigger cart count update
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      // Revert on error
      setCartData(originalCartData);
      setError(err.message);
      console.error('Error removing item:', err);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  }, [cartData, operationLoading]);

  // Clear entire cart with optimistic updates
  const clearCart = useCallback(async () => {
    const operationId = 'clear-all';
    if (!getAuthToken() || operationLoading.has(operationId)) return;

    // Optimistic update - clear items immediately from UI
    const originalCartData = { ...cartData };
    setCartData({ ...cartData, items: [] });
    setOperationLoading(prev => new Set(prev).add(operationId));
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on failure
        setCartData(originalCartData);
        throw new Error(data.message || 'Failed to clear cart');
      }

      // Success - items already cleared from UI, just trigger cart count update
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      // Revert on error
      setCartData(originalCartData);
      setError(err.message);
      console.error('Error clearing cart:', err);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  }, [cartData, operationLoading]);

  // Memoized cart totals calculation
  const cartTotals = useMemo(() => {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      return {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
      };
    }

    let subtotal = 0;
    cartData.items.forEach(item => {
      const product = item.productId;
      const quantity = item.quantity || 1;
      const discountedPrice = getDiscountPrice(product.price, product.discount);
      const price = discountedPrice !== null ?
        discountedPrice * currencyRate :
        product.price * currencyRate;
      subtotal += price * quantity;
    });

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      shippingText: shipping === 0 ? 'Free' : currencySymbol + shipping.toFixed(2)
    };
  }, [cartData, currencyRate, currencySymbol]);

  // Load cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Cart page of e-commerce react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Cart", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {loading ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-config"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Loading cart...
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-attention"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {error} <br />
                      <button onClick={fetchCart} className="cart-btn-2" style={{marginTop: '10px'}}>
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : cartData && cartData.items && cartData.items.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartData.items.map((cartItem, key) => {
                            const product = cartItem.productId;
                            const quantity = cartItem.quantity || 1; // Default to 1 if not provided
                            const discountedPrice = getDiscountPrice(
                              product.price,
                              product.discount
                            );
                            const finalProductPrice = (
                              product.price * currency.currencyRate
                            ).toFixed(2);
                            const finalDiscountedPrice = (
                              discountedPrice * currency.currencyRate
                            ).toFixed(2);

                            // Calculate subtotal if not provided by API
                            const subtotal = cartItem.subtotal ||
                              (discountedPrice !== null ? finalDiscountedPrice * quantity : finalProductPrice * quantity);

                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      product._id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        product.image && product.image[0]
                                          ? (product.image[0].startsWith('data:') ? product.image[0] : process.env.PUBLIC_URL + product.image[0])
                                          : process.env.PUBLIC_URL + "/assets/img/no-image.jpg"
                                      }
                                      alt=""
                                    />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      product._id
                                    }
                                  >
                                    {product.name}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currency.currencySymbol +
                                          finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {currency.currencySymbol +
                                          finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {currency.currencySymbol +
                                        finalProductPrice}
                                    </span>
                                  )}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      disabled={operationLoading.has(`update-${product.id}`)}
                                      onClick={() =>
                                        updateQuantity(product.id, Math.max(1, quantity - 1))
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={quantity}
                                      readOnly
                                    />
                                    <button
                                      className="inc qtybutton"
                                      disabled={operationLoading.has(`update-${product.id}`)}
                                      onClick={() =>
                                        updateQuantity(product.id, quantity + 1)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal">
                                  {currency.currencySymbol + parseFloat(subtotal).toFixed(2)}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() => removeItem(product.id)}
                                    disabled={operationLoading.has(`remove-${product.id}`)}
                                    style={{ opacity: operationLoading.has(`remove-${product.id}`) ? 0.5 : 1 }}
                                  >
                                    {operationLoading.has(`remove-${product.id}`) ? (
                                      <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                      <i className="fa fa-times"></i>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button
                          onClick={clearCart}
                          disabled={operationLoading.has('clear-all')}
                          style={{ opacity: operationLoading.has('clear-all') ? 0.5 : 1 }}
                        >
                          {operationLoading.has('clear-all') ? (
                            <>
                              <i className="fa fa-spinner fa-spin mr-2"></i>
                              Clearing...
                            </>
                          ) : (
                            'Clear Shopping Cart'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  

                  <div className="col-lg-4 col-md-6" style={{display: 'none'}}>
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form>
                          <input type="text" required name="name" />
                          <button className="cart-btn-2" type="submit">
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h5>
                        Subtotal{" "}
                        <span>
                          {currencySymbol + cartTotals.subtotal}
                        </span>
                      </h5>
                      <h5>
                        Tax{" "}
                        <span>
                          {currencySymbol + cartTotals.tax}
                        </span>
                      </h5>
                      <h5>
                        Shipping{" "}
                        <span>
                          {cartTotals.shippingText}
                        </span>
                      </h5>

                      <h4 className="grand-totall-title">
                        Grand Total{" "}
                        <span>
                          {currencySymbol + cartTotals.total}
                        </span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
