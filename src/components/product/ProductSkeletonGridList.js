import React, { Fragment } from "react";
import ProductSkeleton from "./ProductSkeleton";

const ProductSkeletonGridList = ({ count = 9, spaceBottomClass }) => {
  return (
    <Fragment>
      {Array.from({ length: count }, (_, index) => (
        <div className="col-xl-4 col-sm-6" key={index}>
          <ProductSkeleton spaceBottomClass={spaceBottomClass} />
        </div>
      ))}
    </Fragment>
  );
};

export default ProductSkeletonGridList;
