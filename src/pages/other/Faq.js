import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Faq = () => {
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO
        titleTemplate="FAQ"
        description="FAQ page of e-commerce, an e-commerce platform for gifts and crafts."
      /> 
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "FAQ", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="container my-5">
          <h1 className="text-center mb-4">Frequently Asked Questions</h1>

          <div className="mb-5">
            <h2 className="mb-3">Ordering</h2>
            <div className="faq-item mb-4">
              <h4>How do I place an order?</h4>
              <p>To place an order, simply browse our products, select the items you wish to purchase, add them to your cart, and proceed to checkout. Follow the on-screen instructions to complete your purchase.</p>
            </div>
            <div className="faq-item mb-4">
              <h4>Can I modify or cancel my order?</h4>
              <p>Unfortunately, we are unable to modify or cancel orders once they have been placed. Please review your order carefully before confirming your purchase.</p>
            </div>
            <div className="faq-item mb-4">
              <h4>How can I track my order?</h4>
              <p>Once your order has shipped, you will receive a confirmation email with a tracking number. You can use this number to track your order on the carrier's website.</p>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="mb-3">Shipping</h2>
            <div className="faq-item mb-4">
              <h4>What are your shipping options?</h4>
              <p>We offer standard and expedited shipping options. Shipping costs and delivery times vary depending on your location and the shipping method selected. You can view the available options at checkout.</p>
            </div>
            <div className="faq-item mb-4">
              <h4>Do you ship internationally?</h4>
              <p>Yes, we ship to most countries worldwide. International shipping rates and delivery times will be calculated at checkout.</p>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="mb-3">Returns</h2>
            <div className="faq-item mb-4">
              <h4>What is your return policy?</h4>
              <p>We accept returns within 30 days of purchase for a full refund or exchange. Items must be in their original condition with all tags attached. Please visit our Returns page for more information on how to initiate a return.</p>
            </div>
            <div className="faq-item mb-4">
              <h4>How long does it take to process a return?</h4>
              <p>Please allow 5-7 business days for us to process your return once we have received it. You will be notified by email once your refund has been issued.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">Payment</h2>
            <div className="faq-item mb-4">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards (Visa, Mastercard, American Express), as well as PayPal.</p>
            </div>
            <div className="faq-item mb-4">
              <h4>Is my payment information secure?</h4>
              <p>Yes, we use SSL encryption to protect your personal and payment information. Your security is our top priority.</p>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Faq;
