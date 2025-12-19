import PropTypes from "prop-types";
import clsx from "clsx";
import ProductGridThree from "./ProductGridThree";

const TabProductThree = ({ spaceBottomClass }) => {
  return (
    <div className={clsx("product-area hm9-section-padding", spaceBottomClass)}>
      <div className="container-fluid">
        <div className="pb-55">
          <h1 style={{ fontWeight: "bold" }}>Mugs & Cushions</h1>
        </div>
        <div className="custom-row-4">
          <ProductGridThree
            category="mugs-cushions"
            type="new"
            limit={5}
            spaceBottomClass="mb-35"
          />
        </div>
      </div>
    </div>
  );
};

TabProductThree.propTypes = {
  spaceBottomClass: PropTypes.string
};

export default TabProductThree;
