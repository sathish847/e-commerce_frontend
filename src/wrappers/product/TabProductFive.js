
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";
import { useSelector } from "react-redux";

const TabProductFive = ({
  spaceTopClass,
  spaceBottomClass,
  category,
  productTabClass
}) => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch('https://e-commerce-4-bsqw.onrender.com/api/products/new');
        if (!response.ok) {
          throw new Error('Failed to fetch new products');
        }
        const data = await response.json();

        // Handle different response structures
        const productsArray = data.data || data.products || data || [];

        setNewProducts(productsArray);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  if (loading) {
    return (
      <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
        <div className="container">
          <h1 style={{fontWeight:"bolder", textAlign: "center", marginBottom: "40px"}}>New Arrivals</h1>
          <div className="row">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 product-grid-2 mb-25">
                <div style={{
                  height: "300px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "skeleton-pulse 1.5s ease-in-out infinite"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "50%"
                  }} />
                </div>
              </div>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes skeleton-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `
          }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
        <div className="container">
          <h1 style={{fontWeight:"bolder", textAlign: "center", marginBottom: "40px"}}>New Arrivals</h1>
          <div className="text-center">Error loading new products: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <h1 style={{fontWeight:"bolder", textAlign: "center", marginBottom: "40px"}}>New Arrivals</h1>
        <div className="row">
          {newProducts.slice(0, 8).map((product) => (
            <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 product-grid-2" key={product.id || product._id}>
              <ProductGridSingleTwo
                spaceBottomClass="mb-25"
                product={product}
                currency={currency}
                wishlistItem={
                  wishlistItems.find(
                    (wishlistItem) => wishlistItem.id === product.id
                  )
                }
              />
            </div>
          ))}
        </div>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            to={process.env.PUBLIC_URL + "/shop-grid-filter?category=new"}
          >
            VIEW MORE PRODUCTS
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductFive.propTypes = {
  category: PropTypes.string,
  productTabClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductFive;
