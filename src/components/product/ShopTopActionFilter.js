import PropTypes from "prop-types";
import React, { Fragment } from "react";

const ShopTopActionFilter = ({
  getFilterSortParams,
  productCount,
  sortedProductCount
}) => {
  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
            <select
              onChange={e => getFilterSortParams("filterSort", e.target.value)}
            >
              <option value="default">Default</option>
              <option value="priceHighToLow">Price - High to Low</option>
              <option value="priceLowToHigh">Price - Low to High</option>
            </select>
          </div>
          <p>
            Showing {sortedProductCount} of {productCount} result
          </p>
        </div>
      </div>
    </Fragment>
  );
};

ShopTopActionFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  productCount: PropTypes.number,
  sortedProductCount: PropTypes.number
};

export default ShopTopActionFilter;
