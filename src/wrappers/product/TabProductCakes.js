import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import ProductGridTwo from "./ProductGridTwo";

const TabProductCakes = ({
  spaceTopClass,
  spaceBottomClass,
  category,
  productTabClass
}) => {
  return (
    <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <h1 style={{fontWeight:"bolder"}}>Cake Collections</h1>
        <br/>
        <div className="row">
          <ProductGridTwo
            category="cakes"
            limit={4}
            spaceBottomClass="mb-25"
          />
        </div>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            to={process.env.PUBLIC_URL + "/shop-grid-standard?category=cakes"}
          >
            VIEW MORE PRODUCTS
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductCakes.propTypes = {
  category: PropTypes.string,
  productTabClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductCakes;