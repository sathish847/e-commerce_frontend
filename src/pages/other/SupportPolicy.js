import React from "react";
import { Link } from "react-router-dom";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const SupportPolicy = () => {
  return (
    <LayoutOne>
     
      <div className="support-policy-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="support-policy-content">
                <h2>Our Support Policy</h2>
                
                {/* Customer Service Hours */}
                <div className="policy-section mb-4">
                  <h4>Customer Service Hours</h4>
                  <p>Our dedicated support team is available:</p>
                  <ul>
                    <li>Monday to Friday: 9:00 AM - 6:00 PM</li>
                    <li>Saturday: 10:00 AM - 4:00 PM</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>

                {/* Response Time */}
                <div className="policy-section mb-4">
                  <h4>Response Time</h4>
                  <p>We strive to respond to all inquiries within:</p>
                  <ul>
                    <li>Email: Within 24 hours</li>
                    <li>Phone: Under 10 minutes during business hours</li>
                    <li>Live Chat: Instant response during business hours</li>
                  </ul>
                </div>

                {/* Returns & Exchanges */}
                <div className="policy-section mb-4">
                  <h4>Returns & Exchanges</h4>
                  <ul>
                    <li>30-day return policy for unused items</li>
                    <li>Free returns for defective products</li>
                    <li>Exchange options available for size/color preferences</li>
                  </ul>
                </div>

                {/* Product Support */}
                <div className="policy-section mb-4">
                  <h4>Product Support</h4>
                  <ul>
                    <li>Product usage guidance</li>
                    <li>Maintenance tips and recommendations</li>
                    <li>Warranty claim assistance</li>
                  </ul>
                </div>

                {/* Contact Methods */}
                <div className="policy-section mb-4">
                  <h4>How to Reach Us</h4>
                  <ul>
                    <li>Email: support@yourstore.com</li>
                    <li>Phone: 1-800-SUPPORT</li>
                    <li>Live Chat: Available on website during business hours</li>
                  </ul>
                </div>

                {/* Support Button */}
                <div className="support-contact-btn text-center mt-5">
                  <Link to={process.env.PUBLIC_URL + "/contact"} className="btn btn-dark">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx="true">{`
        .support-policy-area {
          background-color: #f7f7f7;
        }
        .support-policy-content {
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(0,0,0,0.05);
        }
        .support-policy-content h2 {
          text-align: center;
          margin-bottom: 40px;
          color: #333;
        }
        .policy-section {
          margin-bottom: 30px;
        }
        .policy-section h4 {
          color: #333;
          margin-bottom: 15px;
          font-size: 20px;
        }
        .policy-section ul {
          list-style: none;
          padding-left: 0;
        }
        .policy-section ul li {
          margin-bottom: 10px;
          padding-left: 20px;
          position: relative;
        }
        .policy-section ul li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #333;
        }
        @media (max-width: 768px) {
          .support-policy-content {
            padding: 20px;
          }
          .policy-section h4 {
            font-size: 18px;
          }
        }
      `}</style>
    </LayoutOne>
  );
};

export default SupportPolicy;