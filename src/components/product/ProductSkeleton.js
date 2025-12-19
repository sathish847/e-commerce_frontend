import { Fragment } from "react";
import clsx from "clsx";

const ProductSkeleton = ({ spaceBottomClass, colorClass }) => {
  return (
    <Fragment>
      <div className={clsx("product-wrap-2", spaceBottomClass, colorClass)}>
        <div className="product-img skeleton">
          <div className="skeleton-image"></div>
        </div>
        <div className="product-content-2">
          <div className="title-price-wrap-2">
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
          </div>
          <div className="pro-wishlist-2">
            <div className="skeleton-wishlist"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .skeleton {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
        }

        .skeleton-title {
          width: 80%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .skeleton-price {
          width: 60%;
          height: 14px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
        }

        .skeleton-wishlist {
          width: 32px;
          height: 32px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 50%;
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
    </Fragment>
  );
};

export default ProductSkeleton;
