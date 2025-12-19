import React, { useState } from "react";

const BillingDetailsForm = ({ onFormDataChange }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);

    // Pass form data to parent component
    if (onFormDataChange) {
      onFormDataChange(updatedFormData);
    }
  };

  return (
    <div className="billing-info-wrap">
        <div className="row">
        {/* Full Name */}
        <div className="col-lg-12">
          <div className="billing-info mb-20">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="col-lg-12">
          <div className="billing-info mb-20">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Street Address */}
        <div className="col-lg-12">
          <div className="billing-info mb-20">
            <label>Street Address</label>
            <input
              className="billing-address"
              placeholder="House number and street name"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Country and Postal Code */}
        <div className="col-lg-6 col-md-6">
          <div className="billing-info mb-20">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your country"
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6">
          <div className="billing-info mb-20">
            <label>Postal Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Enter postal code"
            />
          </div>
        </div>

        {/* State and City/Town */}
        <div className="col-lg-6 col-md-6">
          <div className="billing-info mb-20">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter your state"
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6">
          <div className="billing-info mb-20">
            <label>Town / City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetailsForm;
