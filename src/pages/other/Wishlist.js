import { Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addToCart } from "../../store/slices/cart-slice";

const Wishlist = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(new Set());

  // API base URL
  const API_BASE_URL = 'https://e-commerce-4-bsqw.onrender.com/api';

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  // API headers with JWT authentication
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Memoized currency calculations
  const currencyRate = currency.currencyRate;
  const currencySymbol = currency.currencySymbol;

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch wishlist');
      }

      if (data.success) {
        setWishlistItems(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch wishlist');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId, quantity = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to wishlist');
      }

      if (data.success) {
        // Refresh wishlist after adding
        await fetchWishlist();
      } else {
        throw new Error(data.message || 'Failed to add item to wishlist');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error adding to wishlist:', err);
    }
  };

  // Update wishlist item quantity
  const updateWishlistItem = async (productId, quantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update wishlist item');
      }

      if (data.success) {
        // Refresh wishlist after updating
        await fetchWishlist();
      } else {
        throw new Error(data.message || 'Failed to update wishlist item');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating wishlist item:', err);
    }
  };

  // Remove item from wishlist with optimistic updates
  const removeFromWishlist = useCallback(async (productId) => {
    const operationId = `remove-${productId}`;
    if (operationLoading.has(operationId)) return;

    // Optimistic update - remove item immediately from UI
    const originalItems = [...wishlistItems];
    const updatedItems = wishlistItems.filter(item => {
      const product = item.productId || item;
      return product.id !== productId;
    });

    setWishlistItems(updatedItems);
    setOperationLoading(prev => new Set(prev).add(operationId));
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Revert optimistic update on failure
        setWishlistItems(originalItems);
        throw new Error(data.message || 'Failed to remove item from wishlist');
      }

      // Success - item already removed from UI, just trigger cart update
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      // Revert on error
      setWishlistItems(originalItems);
      setError(err.message);
      console.error('Error removing from wishlist:', err);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  }, [wishlistItems, operationLoading]);

  // Clear entire wishlist with optimistic updates
  const clearWishlist = useCallback(async () => {
    const operationId = 'clear-all';
    if (operationLoading.has(operationId)) return;

    // Optimistic update - clear items immediately from UI
    const originalItems = [...wishlistItems];
    setWishlistItems([]);
    setOperationLoading(prev => new Set(prev).add(operationId));
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Revert optimistic update on failure
        setWishlistItems(originalItems);
        throw new Error(data.message || 'Failed to clear wishlist');
      }

      // Success - items already cleared from UI
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      // Revert on error
      setWishlistItems(originalItems);
      setError(err.message);
      console.error('Error clearing wishlist:', err);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  }, [wishlistItems, operationLoading]);

  // Check if product is in wishlist
  const checkProductInWishlist = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/check/${productId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check wishlist status');
      }

      return data.success && data.data;
    } catch (err) {
      console.error('Error checking wishlist status:', err);
      return false;
    }
  };

  // Load wishlist on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, []);
  

  return (
    <Fragment>
      <SEO
        titleTemplate="Wishlist"
        description="Wishlist page of e-commerce react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Wishlist", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {!getAuthToken() ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Please login to view your wishlist <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/login-register"}>
                        Login Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="fa fa-spinner fa-spin"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Loading wishlist...
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="fa fa-exclamation-triangle"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {error} <br />
                      <button
                        onClick={fetchWishlist}
                        className="btn btn-primary mt-3"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : wishlistItems && wishlistItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your wishlist items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((wishlistItem, key) => {
                            // Handle both direct product objects and populated wishlist items
                            const product = wishlistItem.productId || wishlistItem;
                            const discountedPrice = getDiscountPrice(
                              product.price,
                              product.discount
                            );
                            const finalProductPrice = (
                              product.price * currencyRate
                            ).toFixed(2);
                            const finalDiscountedPrice = (
                              discountedPrice * currencyRate
                            ).toFixed(2);

                            const isRemoving = operationLoading.has(`remove-${product.id}`);

                            return (
                              <tr key={product.id || key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      product.id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        process.env.PUBLIC_URL +
                                        (product.image && product.image[0] ? product.image[0] : '')
                                      }
                                      alt=""
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      product.id
                                    }
                                  >
                                    {product.name}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currencySymbol + finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {currencySymbol + finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {currencySymbol + finalProductPrice}
                                    </span>
                                  )}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    disabled={isRemoving}
                                    style={{ opacity: isRemoving ? 0.5 : 1 }}
                                  >
                                    {isRemoving ? (
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
                          onClick={clearWishlist}
                          disabled={operationLoading.has('clear-all')}
                          style={{ opacity: operationLoading.has('clear-all') ? 0.5 : 1 }}
                        >
                          {operationLoading.has('clear-all') ? (
                            <>
                              <i className="fa fa-spinner fa-spin mr-2"></i>
                              Clearing...
                            </>
                          ) : (
                            'Clear Wishlist'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in wishlist <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Add Items
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

export default Wishlist;
