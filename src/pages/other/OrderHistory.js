import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import orderHistoryData from "../../data/order-history.json";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import SEO from "../../components/seo";

const OrderHistory = () => {
  let { pathname } = useLocation();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success";
      case "processing":
        return "bg-warning";
      case "in transit":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Order History"
        description="View your order history and track your purchases."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Order History", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="order-history-area pt-80 pb-80">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="order-history-wrapper">
                  <h2 className="text-center mb-5">Order History</h2>
                  {orderHistoryData.orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="order-item card mb-4 shadow-sm"
                    >
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-0">Order #{order.orderId}</h5>
                          <small>Placed on {order.date}</small>
                        </div>
                        <div className="text-end">
                          <span
                            className={`badge ${getStatusColor(
                              order.status
                            )} text-white`}
                          >
                            {order.status}
                          </span>
                          <div className="mt-1">
                            <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-8">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="d-flex align-items-center mb-3"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                  }}
                                  className="me-3"
                                />
                                <div>
                                  <Link
                                    to={`${process.env.PUBLIC_URL}/product/${item.id}`}
                                    className="text-dark text-decoration-none"
                                  >
                                    <h6 className="mb-1">{item.name}</h6>
                                  </Link>
                                  <p className="mb-0">
                                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="col-md-4">
                            <div className="shipping-info">
                              <h6 className="mb-2">Shipping Address</h6>
                              <p className="mb-2">{order.shippingAddress}</p>
                              <h6 className="mb-2">
                                {order.deliveryDate
                                  ? "Delivered on"
                                  : "Estimated Delivery"}
                              </h6>
                              <p className="mb-2">
                                {order.deliveryDate || order.estimatedDelivery}
                              </p>
                              <h6 className="mb-2">Payment Method</h6>
                              <p className="mb-0">{order.paymentMethod}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default OrderHistory;