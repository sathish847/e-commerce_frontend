import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import ProductGridTwo from "./ProductGridTwo";

const TabProductGeneric = ({
  title,
  category,
  limit,
  spaceTopClass,
  spaceBottomClass
}) => {
  return (
    <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <h1 style={{fontWeight:"bolder"}}>{title}</h1>
        <br/>
        <div className="row">
          <ProductGridTwo
            category={category}
            limit={limit}
            spaceBottomClass="mb-25"
          />
        </div>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            to={process.env.PUBLIC_URL + `/shop-grid-filter?category=${category}`}
          >
            VIEW MORE PRODUCTS
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductGeneric.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductGeneric;
