import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import ProductGridTwo from "./ProductGridTwo";

const TabProductCups = ({
  spaceTopClass,
  spaceBottomClass,
  category,
  productTabClass
}) => {
  return (
    <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <h1 style={{fontWeight:"bolder"}}>Mugs & Cushions Collections</h1>
        <br/>
        <div className="row">
          <ProductGridTwo
            category="mugs-cushions"
            limit={8}
            spaceBottomClass="mb-25"
          />
        </div>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            to={process.env.PUBLIC_URL + "/shop-grid-standard?category=mugs-cushions"}
          >
            VIEW MORE PRODUCTS
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductCups.propTypes = {
  category: PropTypes.string,
  productTabClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductCups;