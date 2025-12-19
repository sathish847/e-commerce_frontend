import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import MobileMenuSearch from "./sub-components/MobileSearch";
import MobileLangCurChange from "./sub-components/MobileLangCurrChange";
import MobileWidgets from "./sub-components/MobileWidgets";

const MobileMenu = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [minicategories, setMinicategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://e-commerce-4-bsqw.onrender.com/api/public/categories");
        if (response.ok) {
          const responseData = await response.json();
          console.log("Categories API Response:", responseData);
          
          let data = responseData;
          if (!Array.isArray(data)) {
            data = data.data || data.categories || Object.values(data) || [];
          }
          
          if (!Array.isArray(data)) {
            console.error("Fetched categories data is not an array:", data);
            setCategories([]);
            return;
          }

          const sortedData = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
          const activeData = sortedData.filter(cat => cat.isActive);
          setCategories(activeData);
        } else {
          console.error("Categories API request failed:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch("https://e-commerce-4-bsqw.onrender.com/api/public/subcategories");
        if (response.ok) {
          const responseData = await response.json();
          console.log("Subcategories API Response:", responseData);
          
          let data = responseData.data || [];
          
          if (!Array.isArray(data)) {
            console.error("Fetched subcategories data is not an array:", data);
            setSubcategories([]);
            return;
          }

          const activeData = data.filter(sub => sub.isActive);
          setSubcategories(activeData);
        } else {
          console.error("Subcategories API request failed:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  useEffect(() => {
    const fetchMinicategories = async () => {
      try {
        const response = await fetch("https://e-commerce-4-bsqw.onrender.com/api/public/minicategories");
        if (response.ok) {
          const responseData = await response.json();
          console.log("Minicategories API Response:", responseData);

          let data = responseData.data || [];

          if (!Array.isArray(data)) {
            console.error("Fetched minicategories data is not an array:", data);
            setMinicategories([]);
            return;
          }

          const activeData = data.filter(mini => mini.status === true);
          setMinicategories(activeData);
        } else {
          console.error("Minicategories API request failed:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching minicategories:", error);
      }
    };

    fetchMinicategories();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('userData');

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          console.log('Could not parse user data');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const groupedSubcategories = useMemo(() => {
    const groups = subcategories.reduce((acc, sub) => {
      if (!acc[sub.category]) {
        acc[sub.category] = [];
      }
      acc[sub.category].push(sub);
      return acc;
    }, {});

    // Sort each group by sortOrder
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return groups;
  }, [subcategories]);

  const groupedMinicategories = useMemo(() => {
    const groups = minicategories.reduce((acc, mini) => {
      const subKey = mini.subCategory;
      if (!acc[subKey]) {
        acc[subKey] = [];
      }
      acc[subKey].push(mini);
      return acc;
    }, {});

    // Sort each group by sortOrder
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return groups;
  }, [minicategories]);

  useEffect(() => {
    const offCanvasNav = document.querySelector("#offcanvas-navigation");
    if (offCanvasNav) {
      const offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".sub-menu");
      const anchorLinks = offCanvasNav.querySelectorAll("a");

      for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
        offCanvasNavSubMenu[i].insertAdjacentHTML(
          "beforebegin",
          "<span class='menu-expand'><i></i></span>"
        );
      }

      const menuExpand = offCanvasNav.querySelectorAll(".menu-expand");
      const numMenuExpand = menuExpand.length;

      for (let i = 0; i < numMenuExpand; i++) {
        menuExpand[i].addEventListener("click", e => {
          sideMenuExpand(e);
        });
      }

      // Add close listener only to links not in menu-item-has-children li
      for (let i = 0; i < anchorLinks.length; i++) {
        const li = anchorLinks[i].closest("li");
        if (!li || !li.classList.contains("menu-item-has-children")) {
          anchorLinks[i].addEventListener("click", () => {
            closeMobileMenu();
          });
        }
      }
    }
  }, [categories, subcategories, minicategories]); // Re-run DOM setup after all data loads

  const sideMenuExpand = e => {
    e.currentTarget.parentElement.classList.toggle("active");
  };

  const closeMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.remove("active");
  };

  const handleMenuClick = (e, hasChildren) => {
    if (hasChildren) {
      e.preventDefault();
      e.currentTarget.parentElement.classList.toggle("active");
    }
  };

  const displayCategories = categories;


  return (
    <div className="offcanvas-mobile-menu" id="offcanvas-mobile-menu">
      <button
        className="offcanvas-menu-close"
        id="mobile-menu-close-trigger"
        onClick={() => closeMobileMenu()}
      >
        <i className="pe-7s-close"></i>
      </button>
      <div className="offcanvas-wrapper">
        <div className="offcanvas-inner-content">
          {/* Mobile Menu Logo */}
          <div className="mobile-menu-logo" style={{
            padding: '20px',
            textAlign: 'center',
            borderBottom: '1px solid #eee',
            marginBottom: '10px'
          }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '150px'
            }}>
              <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
            </div>
            <style jsx>{`
              .mobile-menu-logo .logo img {
                width: 100%;
                height: auto;
                max-height: 50px;
                object-fit: contain;
              }
            `}</style>
          </div>

          {/* My Account link for mobile */}
          {isAuthenticated && userData ? (
            <div className="mobile-my-account" style={{
              padding: '15px',
              borderBottom: '1px solid #eee',
              marginBottom: '10px'
            }}>
              <Link
                to={process.env.PUBLIC_URL + "/my-account"}
                className="text-decoration-none"
                onClick={() => closeMobileMenu()}
                style={{
                  color: '#8b5cf6',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="pe-7s-user"></i>
                My Account
              </Link>
            </div>
          ) : (
            <div className="mobile-login" style={{
              padding: '15px',
              borderBottom: '1px solid #eee',
              marginBottom: '10px'
            }}>
              <Link
                to={process.env.PUBLIC_URL + "/login-register"}
                className="text-decoration-none"
                onClick={() => closeMobileMenu()}
                style={{
                  color: '#8b5cf6',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="pe-7s-lock"></i>
                Login / Register
              </Link>
            </div>
          )}

          {/* mobile nav menu */}
          <div className="offcanvas-navigation" id="offcanvas-navigation">
            <ul>
              {displayCategories.map((category) => {
                const categorySubs = groupedSubcategories[category.name] || [];
                const hasChildren = categorySubs.length > 0;
                const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
                const linkTo = hasChildren
                  ? '#'
                  : `${process.env.PUBLIC_URL}/shop-grid-standard?category=${categorySlug}`;
                return (
                  <li key={category._id} className={hasChildren ? "menu-item-has-children" : ""}>
                    <Link
                      to={linkTo}
                      onClick={(e) => handleMenuClick(e, hasChildren)}
                    >
                      {category.name}
                    </Link>
                    {hasChildren && (
                      <ul className="sub-menu">
                        {categorySubs.map((sub) => {
                          const subMinicats = groupedMinicategories[sub.name] || [];
                          const subHasChildren = subMinicats.length > 0;
                          const subSlug = sub.name.toLowerCase().replace(/\s+/g, '-');
                          const subLinkTo = subHasChildren
                            ? '#'
                            : `${process.env.PUBLIC_URL}/shop-grid-standard?category=${subSlug}`;
                          return (
                            <li key={sub._id} className={subHasChildren ? "menu-item-has-children" : ""}>
                              <Link
                                to={subLinkTo}
                                onClick={(e) => handleMenuClick(e, subHasChildren)}
                              >
                                {sub.name}
                              </Link>
                              {subHasChildren && (
                                <ul className="sub-menu">
                                  {subMinicats.map((mini) => {
                                    const miniSlug = mini.name.toLowerCase().replace(/\s+/g, '-');
                                    return (
                                      <li key={mini._id}>
                                        <Link
                                          to={`${process.env.PUBLIC_URL}/shop-grid-standard?category=${miniSlug}`}
                                          onClick={() => closeMobileMenu()}
                                        >
                                          {mini.name}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}

              {/* Additional Links */}
              <li>
                <Link
                  to={`${process.env.PUBLIC_URL}/workshop-gallery`}
                  onClick={() => closeMobileMenu()}
                >
                  Workshop Gallery
                </Link>
              </li>

            </ul>
          </div>

          {/* mobile language and currency 
          <MobileLangCurChange /> */}

          {/* mobile widgets */}
          <MobileWidgets />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
