import { Fragment } from "react";
import clsx from "clsx";

const HeaderSkeleton = ({
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass
}) => {
  return (
    <Fragment>
      <div className={clsx("header-sticky-wrapper")}>
        <style>{`
          .header-sticky-wrapper {
            position: relative;
            z-index: 999;
            transition: all 0.3s ease;
          }
          .header-area .container-fluid.px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
            max-width: 100%;
          }
          .skeleton-logo {
            width: 120px;
            height: 40px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            border-radius: 4px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .skeleton-search {
            width: 100%;
            height: 40px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            border-radius: 20px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .skeleton-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            border-radius: 20px;
            animation: pulse 1.5s ease-in-out infinite;
            margin: 0 5px;
          }
          .skeleton-nav-item {
            width: 80px;
            height: 20px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            border-radius: 4px;
            animation: pulse 1.5s ease-in-out infinite;
            margin-right: 30px;
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

        <header className={clsx("header-area clearfix", headerBgClass, headerPositionClass)}>
          <div
            className={clsx(
              headerPaddingClass,
              "sticky-bar header-res-padding clearfix"
            )}
          >
            <div className={layout === "container-fluid" ? `${layout} px-0` : "container"}>
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-2 col-md-6 col-6 logo-wrapper">
                  {/* skeleton logo */}
                  <div className="skeleton-logo"></div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-12 d-none d-lg-block">
                  {/* skeleton search */}
                  <div className="header-search-left">
                    <div className="skeleton-search"></div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-6">
                  {/* skeleton icons */}
                  <div className="d-flex justify-content-end">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-icon"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* mobile menu skeleton - simplified */}
            <div className="d-lg-none">
              <div className="skeleton-nav-item" style={{width: '100%', height: '50px', margin: '10px'}}></div>
            </div>
          </div>
        </header>
        {/* Navigation menu skeleton */}
        <div className="nav-menu-container d-none d-lg-block">
          <div className="container-fluid px-0">
            <div className="row justify-content-start">
              <div className="col-12">
                <div className="d-flex">
                  <div className="skeleton-nav-item"></div>
                  <div className="skeleton-nav-item"></div>
                  <div className="skeleton-nav-item"></div>
                  <div className="skeleton-nav-item"></div>
                  <div className="skeleton-nav-item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HeaderSkeleton;
