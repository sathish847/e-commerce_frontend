
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [minicategories, setMinicategories] = useState([]);
  const [hoveredMinicategoryImage, setHoveredMinicategoryImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultImage = process.env.PUBLIC_URL + "https://static.vecteezy.com/system/resources/thumbnails/035/994/979/small_2x/ai-generated-birthday-gift-box-free-png.png";

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [categoriesRes, subcategoriesRes, minicategoriesRes] = await Promise.all([
          fetch("https://e-commerce-4-bsqw.onrender.com/api/public/categories"),
          fetch("https://e-commerce-4-bsqw.onrender.com/api/public/subcategories"),
          fetch("https://e-commerce-4-bsqw.onrender.com/api/public/minicategories")
        ]);

        // Process categories
        if (categoriesRes.ok) {
          const responseData = await categoriesRes.json();
          console.log("Categories API Response:", responseData);

          let data = responseData;
          if (!Array.isArray(data)) {
            data = data.data || data.categories || Object.values(data) || [];
          }

          if (!Array.isArray(data)) {
            console.error("Fetched categories data is not an array:", data);
            setCategories([]);
          } else {
            const sortedData = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
            const activeData = sortedData.filter(cat => cat.isActive);
            setCategories(activeData);
          }
        } else {
          console.error("Categories API request failed:", categoriesRes.status, categoriesRes.statusText);
          setCategories([]);
        }

        // Process subcategories
        if (subcategoriesRes.ok) {
          const responseData = await subcategoriesRes.json();
          console.log("Subcategories API Response:", responseData);

          let data = responseData.data || [];

          if (!Array.isArray(data)) {
            console.error("Fetched subcategories data is not an array:", data);
            setSubcategories([]);
          } else {
            const activeData = data.filter(sub => sub.isActive);
            setSubcategories(activeData);
          }
        } else {
          console.error("Subcategories API request failed:", subcategoriesRes.status, subcategoriesRes.statusText);
          setSubcategories([]);
        }

        // Process minicategories
        if (minicategoriesRes.ok) {
          const responseData = await minicategoriesRes.json();
          console.log("Minicategories API Response:", responseData);

          let data = responseData.data || [];

          if (!Array.isArray(data)) {
            console.error("Fetched minicategories data is not an array:", data);
            setMinicategories([]);
          } else {
            const activeData = data.filter(mini => mini.status === true);
            setMinicategories(activeData);
          }
        } else {
          console.error("Minicategories API request failed:", minicategoriesRes.status, minicategoriesRes.statusText);
          setMinicategories([]);
        }

      } catch (error) {
        console.error("Error fetching navigation data:", error);
        setCategories([]);
        setSubcategories([]);
        setMinicategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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

  return (
    <div
      className={clsx(sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`)}
    >
      <style>
        {`
          .main-menu .mega-menu {
            display: flex !important;
            flex-wrap: nowrap;
            padding: 20px;
            min-width: 850px;
          }
          .mega-menu-img img {
            width: 100%;
            transition: opacity 0.3s ease-in-out;
          }

          /* Skeleton Loading Styles */
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 4px;
          }

          @keyframes skeleton-loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          .skeleton-menu-item {
            height: 20px;
            width: 80px;
            margin: 5px 0;
          }

          .skeleton-mega-menu {
            display: flex;
            gap: 20px;
            padding: 20px;
          }

          .skeleton-column {
            flex: 1;
          }

          .skeleton-title {
            height: 18px;
            width: 100px;
            margin-bottom: 10px;
          }

          .skeleton-sub-item {
            height: 16px;
            width: 60px;
            margin: 3px 0;
          }

          .skeleton-image {
            width: 200px;
            height: 150px;
            border-radius: 4px;
          }
        `}
      </style>
      <nav>
        {loading ? (
          <ul>
            {/* Skeleton for main menu items */}
            {[1, 2, 3, 4].map((index) => (
              <li key={index} className="menu-item-has-children">
                <div className="skeleton skeleton-menu-item"></div>
                <ul className="mega-menu skeleton-mega-menu">
                  {/* Skeleton for subcategories */}
                  {[1, 2, 3].map((subIndex) => (
                    <li key={subIndex} className="skeleton-column">
                      <ul>
                        <li className="skeleton skeleton-title"></li>
                        {/* Skeleton for minicategories */}
                        {[1, 2, 3, 4].map((miniIndex) => (
                          <li key={miniIndex}>
                            <div className="skeleton skeleton-sub-item"></div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                  {/* Skeleton for image */}
                  <li>
                    <ul>
                      <li>
                        <div className="skeleton skeleton-image"></div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {categories.map((category) => {
              const categorySubs = groupedSubcategories[category.name] || [];
              const hasChildren = categorySubs.length > 0;
              const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
              const linkTo = hasChildren
                ? '#'
                : `${process.env.PUBLIC_URL}/shop-grid-filter?category=${categorySlug}`;

              return (
                <li key={category._id} className={hasChildren ? "menu-item-has-children" : ""}>
                  <Link to={linkTo}>
                    {category.name}
                    {hasChildren && !sidebarMenu && (
                      <i className="fa fa-angle-down" />
                    )}
                    {hasChildren && sidebarMenu && (
                      <span>
                        <i className="fa fa-angle-right"></i>
                      </span>
                    )}
                  </Link>
                  {hasChildren && (
                    <ul className="mega-menu">
                      {categorySubs.map((sub, subIndex) => {
                        const subMinicats = groupedMinicategories[sub.name] || [];
                        const subHasChildren = subMinicats.length > 0;
                        const subSlug = sub.name.toLowerCase().replace(/\s+/g, '-');
                        const subLinkTo = subHasChildren
                          ? '#'
                          : `${process.env.PUBLIC_URL}/shop-grid-filter?category=${subSlug}`;

                        return (
                          <li key={sub._id}>
                            <ul>
                              <li className="mega-menu-title">
                                <Link to={subLinkTo}>
                                  {sub.name}
                                </Link>
                              </li>
                              {subMinicats.map((mini) => {
                                const miniSlug = mini.name.toLowerCase().replace(/\s+/g, '-');
                                return (
                                  <li key={mini._id}>
                                    <Link
                                      to={`${process.env.PUBLIC_URL}/shop-grid-filter?category=${miniSlug}`}
                                      onMouseEnter={() => setHoveredMinicategoryImage(mini.image)}
                                      onMouseLeave={() => setHoveredMinicategoryImage(null)}
                                    >
                                      {mini.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                      <li>
                        <ul>
                          <li className="mega-menu-img">
                            <Link to={process.env.PUBLIC_URL + "/shop-grid-filter"}>
                              <img src={hoveredMinicategoryImage || category.image || defaultImage} alt={category.name} />
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
};

export default NavMenu;
