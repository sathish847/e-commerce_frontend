import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BillingDetailsForm from "../../components/checkout/BillingDetailsForm";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const MyAccount = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingFormData, setBillingFormData] = useState(null);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  // API headers with JWT authentication
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Fetch complete user details
  const fetchUserDetails = async (email) => {
    try {
      const response = await fetch(`https://e-commerce-4-bsqw.onrender.com/api/users/details/${email}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();

        // Handle different response structures
        const userInfo = data.data || data.user || data;

        setUserData(userInfo);
        setError(null);
      } else {
        setError('Failed to load user details');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('userData');
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login-register');
      return;
    }

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        // Fetch complete user details from API
        fetchUserDetails(parsedUser.email);
      } catch (e) {
        console.log('Could not parse user data');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  // Handle form data change from BillingDetailsForm
  const handleFormDataChange = (formData) => {
    setBillingFormData(formData);
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

  // Handle update details confirmation
  const handleUpdateDetails = async () => {
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

    setIsUpdatingDetails(true);

    try {
      // Get user email from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userEmail = userData.email;

      if (!userEmail) {
        alert('User email not found. Please log in again.');
        setIsUpdatingDetails(false);
        return;
      }

      // Update user details
      const updateSuccess = await updateUserDetails(userEmail, billingFormData);

      if (updateSuccess) {
        alert('Personal details updated successfully!');
        setShowBillingModal(false);
        // Refresh user data
        fetchUserDetails(userEmail);
      } else {
        alert('Failed to update personal details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating details:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  const handleCloseBillingModal = () => {
    setShowBillingModal(false);
    setBillingFormData(null);
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of e-commerce react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "My Account", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="my-account-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              {/* Sidebar Navigation */}
              <div className="col-lg-3 col-md-4">
                <div className="my-account-sidebar">
                  <div className="account-sidebar-header mb-4">
                    <div className="account-avatar text-center mb-3">
                      <div className="avatar-circle mx-auto">
                        <i className="pe-7s-user"></i>
                      </div>
                      {userData && (
                        <h6 className="mt-2">{userData.fullName || userData.name || 'User'}</h6>
                      )}
                    </div>
                  </div>

                  <div className="account-menu">
                    <ul className="list-unstyled">
                      <li className="active">
                        <a href="#profile">
                          <i className="pe-7s-user"></i> Profile Information
                        </a>
                      </li>
                      {/*
                        <li>
                        <a href="#orders">
                          <i className="pe-7s-shopbag"></i> My Orders
                        </a>
                      </li>
                      <li>
                        <a href="#wishlist">
                          <i className="pe-7s-like"></i> Wishlist
                        </a>
                      </li>
                      */}
                      <li className="update-details-menu-item">
                        <button
                          onClick={() => setShowBillingModal(true)}
                          className="update-details-btn"
                        >
                          <i className="pe-7s-edit"></i> Update Personal Details
                        </button>
                      </li>
                      <li className="logout-menu-item">
                        <button
                          onClick={handleLogout}
                          className="logout-btn"
                        >
                          <i className="pe-7s-power"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-lg-9 col-md-8">
                <div className="my-account-content">
                  {/* Profile Information */}
                  <div className="account-section mb-4" id="profile">
                    <div className="section-header mb-3">
                      <h5><i className="pe-7s-user"></i> Profile Information</h5>
                    </div>

                    {loading && (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading account details...</p>
                      </div>
                    )}

                    {error && (
                      <div className="alert alert-danger">
                        <i className="pe-7s-attention"></i> {error}
                      </div>
                    )}

                    {userData && !loading && (
                      <div className="profile-info-grid">
                        <div className="row">
                          {/* Personal Information Card */}
                          <div className="col-md-6 mb-4">
                            <div className="info-card">
                              <div className="card-header">
                                <h6><i className="pe-7s-id"></i> Personal Details</h6>
                              </div>
                              <div className="card-body">
                                <div className="info-item">
                                  <label>Full Name</label>
                                  <span>{userData.fullName || userData.name || 'Not provided'}</span>
                                </div>
                                <div className="info-item">
                                  <label>Email Address</label>
                                  <span>{userData.email || 'Not provided'}</span>
                                </div>
                                <div className="info-item">
                                  <label>Phone Number</label>
                                  <span>{userData.phoneNumber || 'Not provided'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Address Information Card */}
                          <div className="col-md-6 mb-4">
                            <div className="info-card">
                              <div className="card-header">
                                <h6><i className="pe-7s-map-marker"></i> Address Details</h6>
                              </div>
                              <div className="card-body">
                                <div className="info-item">
                                  <label>Street Address</label>
                                  <span>{userData.address || 'Not provided'}</span>
                                </div>
                                <div className="info-item">
                                  <label>City</label>
                                  <span>{userData.city || 'Not provided'}</span>
                                </div>
                                <div className="info-item">
                                  <label>State</label>
                                  <span>{userData.state || 'Not provided'}</span>
                                </div>
                                <div className="info-item">
                                  <label>Country</label>
                                  <span>{userData.country || 'Not provided'}</span>
                                </div>
                                <div className="info-item">
                                  <label>Postal Code</label>
                                  <span>{userData.zipCode || 'Not provided'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          .my-account-sidebar {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
          }

          .avatar-circle {
            width: 80px;
            height: 80px;
            background: #000000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            margin-bottom: 10px;
          }

          .account-menu ul li {
            margin-bottom: 5px;
          }

          .account-menu ul li a {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            color: #666;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.3s ease;
          }

          .account-menu ul li a:hover,
          .account-menu ul li.active a {
            background: #f8f8f8;
            color: #000;
          }

          .account-menu ul li a i {
            margin-right: 10px;
            width: 20px;
          }

          .update-details-menu-item {
            margin-bottom: 10px;
          }

          .update-details-btn {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            width: 100%;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .update-details-btn:hover {
            background: #0056b3;
            transform: translateY(-1px);
          }

          .update-details-btn i {
            margin-right: 10px;
            width: 20px;
          }

          .logout-menu-item {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
          }

          .logout-btn {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 6px;
            width: 100%;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .logout-btn:hover {
            background: #c82333;
            transform: translateY(-1px);
          }

          .logout-btn i {
            margin-right: 10px;
            width: 20px;
          }

          .info-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          }

          .info-card .card-header {
            background: #f8f8f8;
            border-bottom: 1px solid #e0e0e0;
            padding: 15px 20px;
          }

          .info-card .card-header h6 {
            margin: 0;
            color: #000;
          }

          .info-card .card-body {
            padding: 20px;
          }

          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .info-item:last-child {
            border-bottom: none;
          }

          .info-item label {
            font-weight: 600;
            color: #666;
            margin: 0;
          }

          .info-item span {
            color: #000;
            text-align: right;
          }

          .section-header h5 {
            color: #000;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }

          .section-header h5 i {
            margin-right: 8px;
          }

          @media (max-width: 768px) {
            .my-account-sidebar {
              margin-bottom: 30px;
            }
          }
        `}</style>

        {/* Billing Details Modal */}
        <Modal show={showBillingModal} onHide={handleCloseBillingModal} style={{ top: '-20%', transform: 'translateY(0)', height: 'auto' }}>
          <Modal.Header closeButton>
            <Modal.Title><b>Update Personal Details</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BillingDetailsForm onFormDataChange={handleFormDataChange} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseBillingModal} disabled={isUpdatingDetails}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateDetails} disabled={isUpdatingDetails}>
              {isUpdatingDetails ? 'Updating...' : 'Update Details'}
            </Button>
          </Modal.Footer>
        </Modal>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
