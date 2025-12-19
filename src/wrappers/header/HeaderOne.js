import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import clsx from "clsx";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import HeaderSkeleton from "../../components/header/HeaderSkeleton";

const HeaderOne = ({
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
  loading = false
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery && searchQuery.trim();
    if (q) {
      navigate(`${process.env.PUBLIC_URL}/shop-grid-filter?search=${encodeURIComponent(q)}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      {top !== "notvisible" && (
        <div className="header-top-bar">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="header-contact-info">
                  <span className="contact-item">
                    <i className="fa fa-phone"></i>
                    +1 (555) 123-4567
                  </span>
                  <span className="contact-item">
                    <i className="fa fa-envelope"></i>
                    info@example.com
                  </span>  
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12 text-end">
                <div className="header-top-links">
                  <Link to={`${process.env.PUBLIC_URL}/about`} className="top-link">
                    About
                  </Link>
                    <Link to={`${process.env.PUBLIC_URL}/workshop-gallery`} className="top-link">
                    Workshop Gallery
                  </Link>
                    <Link to={`${process.env.PUBLIC_URL}/faq`} className="top-link">
                    FAQ
                  </Link>
                  <Link to={`${process.env.PUBLIC_URL}/contact`} className="top-link">
                    Contact
                  </Link>
                   <div className="social-section">
                    <span className="follow-text">Follow Us:</span>
                    <div className="social-links">
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fa fa-facebook"></i>
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fa fa-twitter"></i>
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fa fa-instagram"></i>
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </div>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* mobile menu - render outside header wrapper so it's always available */}
      <MobileMenu />

      {/* Mobile-only header bar with hamburger menu */}
      <div className="mobile-header-bar d-block d-lg-none">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-6">
              {/* Mobile logo */}
              <div className="mobile-logo-wrapper">
                <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
              </div>
            </div>
            <div className="col-6 text-end">
              <button
                className="mobile-aside-button"
                onClick={() => {
                  const offcanvasMobileMenu = document.querySelector("#offcanvas-mobile-menu");
                  if (offcanvasMobileMenu) {
                    offcanvasMobileMenu.classList.add("active");
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b5cf6',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '10px'
                }}
              >
                <i className="pe-7s-menu" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={clsx("header-sticky-wrapper", scroll > headerTop && "stick")}>
        <style>{`
          /* Top Bar Styles */
          .header-top-bar {
            background-color: #8b5cf6;
            padding: 10px 0;
            font-size: 14px;
            color: white;
          }
          .header-contact-info {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            margin-left: 30px;
          }
          .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
          }
          .contact-item i {
            color: #ffffff;
            font-size: 16px;
          }
          .header-top-links {
            display: flex;
            justify-content: flex-end;
            gap: 25px;
            flex-wrap: wrap;
          }
          .top-link {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
            padding: 5px 0;
          }
          .top-link:hover {
            color: #ffffff;
            text-decoration: underline;
          }
          .social-section {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: 20px;
          }
          .follow-text {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            font-size: 14px;
            white-space: nowrap;
          }
          .social-links {
            display: flex;
            gap: 15px;
          }
          .social-link {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            font-size: 16px;
            transition: color 0.3s ease;
            padding: 5px;
          }
          .social-link:hover {
            color: #ffffff;
            transform: scale(1.1);
          }
          .social-link i {
            font-size: 16px;
          }
          /* Responsive adjustments */
          @media (max-width: 767px) {
            .header-sticky-wrapper,
            .header-top-bar {
              display: none !important;
            }
            .header-contact-info {
              flex-direction: column;
              gap: 8px;
              margin-bottom: 8px;
            }
            .header-top-links {
              flex-direction: column;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }
            .social-section {
              margin-left: 10px;
              gap: 8px;
            }
            .social-links {
              gap: 10px;
            }
            .follow-text {
              font-size: 13px;
            }
            .contact-item, .top-link {
              font-size: 13px;
            }
            .social-link {
              font-size: 14px;
            }
          }
          .header-sticky-wrapper {
            position: relative;
            z-index: 999;
            transition: all 0.3s ease;
          }
          .header-sticky-wrapper.stick {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 999;
          }
          .header-sticky-wrapper.stick .header-area {
            box-shadow: none;
          }
          /* Logo alignment: increase logo width and move slightly left */
          .header-area .logo-wrapper {
            padding-left: 8px; /* move logo a bit to the left */
          }
          .header-area .logo-wrapper .logo img {
            width: 120px; /* reduced logo width */
            height: auto;
            display: block;
          }
          /* Remove container gutters when using container-fluid layout */
          .header-area .container-fluid.px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
            max-width: 100%;
          }
          /* Search styling: move down slightly and make rounded for desktop */
          .header-search-left {
            margin-top: 16px;
          }
          .header-search-left input {
            width: 100%;
            padding: 10px 14px;
            border-radius: 20px;
            border: 1px solid #e6e6e6;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            transition: box-shadow 0.15s ease, border-color 0.15s ease;
          }
          .header-search-left input:focus {
            outline: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
            border-color: #d0d0d0;
          }
          /* Login and Register button styling - Violet Design */
          .header-login a,
          .header-register a,
          .header-user-info span,
          .header-order-history a,
          .header-logout button,
          .cart-wrap .icon-cart {
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 20px;
            text-decoration: none;
            transition: all 0.3s ease;
            background: #8b5cf6;
            border: none;
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            cursor: pointer;
          }
          .header-login a i,
          .header-register a i,
          .header-user-info span i,
          .header-order-history a i,
          .cart-wrap .icon-cart i {
            font-size: 14px;
            color: #ffffff !important;
          }
          .header-login a:hover,
          .header-register a:hover,
          .header-user-info span:hover,
          .header-order-history a:hover,
          .header-logout button:hover,
          .cart-wrap .icon-cart:hover {
            background: #7c3aed;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
            color: #ffffff;
          }
          .cart-wrap .icon-cart .count-style {
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          /* Make nav bar full-bleed and force items to start at the left edge */
          .nav-menu-container {
            width: 100%;
            background: white;
          }
          .nav-menu-container .container-fluid.px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
            max-width: 90%;
          }
          .nav-menu-container .main-menu > nav > ul {
            display: flex !important;
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .nav-menu-container .main-menu > nav > ul > li {
            margin-right: 30px;
          }
          /* Mobile header bar styling */
          .mobile-header-bar {
            background: white;
            padding: 10px 0;
            border-bottom: 1px solid #e6e6e6;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .mobile-header-bar .mobile-logo-wrapper .logo img {
            width: 100px;
            height: auto;
            max-height: 40px;
            object-fit: contain;
          }
          .mobile-header-bar .mobile-aside-button {
            transition: all 0.3s ease;
          }
          .mobile-header-bar .mobile-aside-button:hover {
            color: #7c3aed !important;
            transform: scale(1.1);
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
                  {/* header logo */}
                  <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-12 d-none d-lg-block">
                  {/* search next to logo (desktop) - no icon, direct search input */}
                  <div className="header-search-left">
                    <form onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        aria-label="Search"
                      />
                    </form>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-6">
                  {/* Icon group */}
                  <IconGroup />
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Navigation menu below header */}
        <div className="nav-menu-container d-none d-lg-block">
          <div className="container-fluid px-0">
            <div className="row justify-content-start">
              <div className="col-12">
                <NavMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string
};

export default HeaderOne;
