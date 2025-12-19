import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BillingDetailsForm from "../../components/checkout/BillingDetailsForm"; // Import the new component
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Checkout = () => {
  let cartTotalPrice = 0;
  const [showBillingModal, setShowBillingModal] = useState(false); // State for modal visibility
  const [showPaymentModal, setShowPaymentModal] = useState(false); // State for payment modal
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null); // State for payment mode
  const [orderSuccess, setOrderSuccess] = useState(false); // State for order success
  const [billingFormData, setBillingFormData] = useState(null); // State for billing form data
  const [isCheckingDetails, setIsCheckingDetails] = useState(false); // State for checking details loading
  let { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);

  const handlePlaceOrderClick = async () => {
    setIsCheckingDetails(true);

    try {
      // Get user email from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userEmail = userData.email;

      if (!userEmail) {
        alert('User email not found. Please log in again.');
        setIsCheckingDetails(false);
        return;
      }

      // Check if user details are complete
      const detailsComplete = await checkUserDetails(userEmail);

      if (detailsComplete) {
        // User details are complete, skip form and go to payment
        setShowPaymentModal(true);
      } else {
        // User details are incomplete, show billing form
        setShowBillingModal(true);
      }
    } catch (error) {
      console.error('Error checking user details:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsCheckingDetails(false);
    }
  };

  const handleCloseBillingModal = () => {
    setShowBillingModal(false);
  };

  const handleConfirmOrder = async () => {
    if (!billingFormData) {
      alert('Please fill in your billing details');
      return;
    }

    // Check if required fields are filled
    const requiredFields = ['address', 'city', 'state', 'country', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !billingFormData[field] || billingFormData[field].trim() === '');

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsCheckingDetails(true);

    try {
      // Get user email from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userEmail = userData.email;

      if (!userEmail) {
        alert('User email not found. Please log in again.');
        setIsCheckingDetails(false);
        return;
      }

      // Check if user details are complete
      const detailsComplete = await checkUserDetails(userEmail);

      if (!detailsComplete) {
        // Update user details
        const updateSuccess = await updateUserDetails(userEmail, billingFormData);

        if (!updateSuccess) {
          alert('Failed to update user details. Please try again.');
          setIsCheckingDetails(false);
          return;
        }
      }

      // Proceed to payment modal
      setShowBillingModal(false);
      setShowPaymentModal(true);

    } catch (error) {
      console.error('Error during order confirmation:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsCheckingDetails(false);
    }
  };

  const handlePaymentModeSelect = async (mode) => {
    setSelectedPaymentMode(mode);

    // Get user email from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userEmail = userData.email;

    if (userEmail) {
      // Fetch complete user details and log them
      const userDetails = await getUserDetails(userEmail);
      console.log(`User details for ${mode} payment:`, userDetails);
    }

    if (mode === 'offline') {
      setOrderSuccess(true);
      setShowPaymentModal(false);
    } else {
      // Here you would integrate your online payment gateway
      // For now, we'll just show a success message
      setOrderSuccess(true);
      setShowPaymentModal(false);
    }
  };

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  // API headers with JWT authentication
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Check if user details are complete
  const checkUserDetails = async (email) => {
    try {
      const response = await fetch(`https://e-commerce-4-bsqw.onrender.com/api/users/check-details/${email}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.detailsComplete;
      } else {
        console.error('Failed to check user details');
        return false;
      }
    } catch (error) {
      console.error('Error checking user details:', error);
      return false;
    }
  };

  // Get complete user details
  const getUserDetails = async (email) => {
    try {
      const response = await fetch(`https://e-commerce-4-bsqw.onrender.com/api/users/details/${email}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to get user details');
        return null;
      }
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  };

  // Update user details
  const updateUserDetails = async (email, details) => {
    try {
      const requestBody = {
        email: email,
        fullName: details.fullName,
        address: details.address,
        city: details.city,
        state: details.state,
        country: details.country,
        zipCode: details.zipCode,
        phoneNumber: details.phone
      };

      console.log('Sending update request to:', 'https://e-commerce-4-bsqw.onrender.com/api/users/update-details');
      console.log('Request body:', requestBody);

      const response = await fetch('https://e-commerce-4-bsqw.onrender.com/api/users/update-details', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Update response data:', data);
        return data.success;
      } else {
        const errorText = await response.text();
        console.error('Failed to update user details. Status:', response.status, 'Response:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      return false;
    }
  };

  // Handle form data change from BillingDetailsForm
  const handleFormDataChange = (formData) => {
    setBillingFormData(formData);
  };

  // Test function to verify API calls (can be removed after testing)
  const testAPIs = async () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userEmail = userData.email;

    if (!userEmail) {
      console.log('No user email found');
      return;
    }

    console.log('Testing check details API...');
    const detailsComplete = await checkUserDetails(userEmail);
    console.log('Details complete:', detailsComplete);

    if (!detailsComplete) {
      console.log('Testing update details API...');
      const testData = {
        fullName: 'John Doe',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '12345',
        phone: '+1234567890'
      };
      const updateSuccess = await updateUserDetails(userEmail, testData);
      console.log('Update success:', updateSuccess);
    }
  };

  // Uncomment the line below to test APIs on component mount
  // useEffect(() => { testAPIs(); }, []);

  return (
    <Fragment>
      <SEO
        titleTemplate="Checkout"
        description="Checkout page of e-commerce react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Checkout", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-12">
                </div>

                <div className="col-lg-5 mx-auto">
                  <div className="your-order-area">
                    <h3>Your order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountedPrice = getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              );
                              const finalProductPrice = (
                                cartItem.price * currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice = (
                                discountedPrice * currency.currencyRate
                              ).toFixed(2);

                              discountedPrice != null
                                ? (cartTotalPrice +=
                                    finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice +=
                                    finalProductPrice * cartItem.quantity);
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.name} X {cartItem.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    {discountedPrice !== null
                                      ? currency.currencySymbol +
                                        (
                                          finalDiscountedPrice *
                                          cartItem.quantity
                                        ).toFixed(2)
                                      : currency.currencySymbol +
                                        (
                                          finalProductPrice * cartItem.quantity
                                        ).toFixed(2)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>
                              {currency.currencySymbol +
                                cartTotalPrice.toFixed(2)}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method"></div>
                    </div>
                    <div className="place-order mt-25">
                      <button className="btn-hover" onClick={handlePlaceOrderClick} disabled={isCheckingDetails}>
                        {isCheckingDetails ? 'Checking Details...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
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

        {/* Billing Details Modal */}
        <Modal show={showBillingModal} onHide={handleCloseBillingModal} style={{ top: '-20%', transform: 'translateY(0)', height: 'auto' }}>
          <Modal.Header closeButton>
            <Modal.Title><b>Personal Details</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BillingDetailsForm onFormDataChange={handleFormDataChange} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseBillingModal} disabled={isCheckingDetails}>
              Close
            </Button>
            <Button variant="success" onClick={handleConfirmOrder} disabled={isCheckingDetails}>
              {isCheckingDetails ? 'Checking Details...' : 'Confirm Order'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Payment Mode Selection Modal */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title><b>Select Payment Mode</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="payment-options">
              {/* Offline Payment Option */}
              <div 
                className="payment-option mb-3 p-3" 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedPaymentMode === 'offline' ? '#f8f9fa' : 'white'
                }}
                onClick={() => handlePaymentModeSelect('offline')}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="pe-7s-cash" style={{ fontSize: '24px' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Cash on Delivery</h5>
                    <p className="mb-0 text-muted">Pay when you receive your order</p>
                  </div>
                </div>
              </div>

              {/* Online Payment Option */}
              <div 
                className="payment-option p-3" 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedPaymentMode === 'online' ? '#f8f9fa' : 'white'
                }}
                onClick={() => handlePaymentModeSelect('online')}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="pe-7s-credit" style={{ fontSize: '24px' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Online Payment</h5>
                    <p className="mb-0 text-muted">Pay securely with your credit/debit card</p>
                    <div className="mt-2">
                      <img src={process.env.PUBLIC_URL + "/assets/img/icon-img/payment.png"} alt="payment methods" style={{ maxHeight: '24px' }}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Order Success Modal */}
        <Modal show={orderSuccess} onHide={() => setOrderSuccess(false)}>
          <Modal.Header closeButton>
            <Modal.Title><b>Order Placed Successfully!</b></Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className="success-animation mb-4">
              <i className="pe-7s-check" style={{ fontSize: '48px', color: '#28a745' }}></i>
            </div>
            <h4>Thank you for your order!</h4>
            <p>{selectedPaymentMode === 'offline' ? 
              'Your order has been placed successfully. You can pay when you receive your order.' :
              'Your order has been placed successfully. You will receive a confirmation email shortly.'}
            </p>
            <Link to={process.env.PUBLIC_URL + "/"} className="btn-hover">
              Continue Shopping
            </Link>
          </Modal.Body>
        </Modal>

      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;
