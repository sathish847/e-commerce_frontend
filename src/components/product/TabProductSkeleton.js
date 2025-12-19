import { Fragment } from "react";
import clsx from "clsx";
import ProductSkeleton from "./ProductSkeleton";

const TabProductSkeleton = ({
  spaceTopClass,
  spaceBottomClass,
  productCount = 8
}) => {
  return (
    <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="skeleton-title-main"></div>
        <br />
        <div className="row">
          {Array.from({ length: productCount }, (_, index) => (
            <div
              className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 product-grid-2"
              key={index}
            >
              <ProductSkeleton spaceBottomClass="mb-25" />
            </div>
          ))}
        </div>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <div className="skeleton-view-more"></div>
        </div>
      </div>

      <style jsx>{`
        .skeleton-title-main {
          width: 300px;
          height: 32px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
          margin: 0 auto;
        }

        .skeleton-view-more {
          width: 200px;
          height: 20px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
          margin: 0 auto;
        }

        @keyframes pulse {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TabProductSkeleton;
