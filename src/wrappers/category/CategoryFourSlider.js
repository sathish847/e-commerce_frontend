import PropTypes from "prop-types";
import clsx from "clsx";
import { useState, useEffect } from "react";
import Swiper, { SwiperSlide } from "../../components/swiper";
import CategoryFourSingle from "../../components/category/CategoryFourSingle.js";

const settings = {
  loop: false,
  spaceBetween: 30,
  autoplay: true,
  breakpoints: {
    320: {
      slidesPerView: 3,
      spaceBetween: 20
    },
    576: {
      slidesPerView: 4,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 6
    },
    992: {
      slidesPerView: 8
    }
  }
};

const CategoryFourSlider = ({ spaceTopClass, spaceBottomClass }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://e-commerce-4-bsqw.onrender.com/api/public/minicategories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();

        // API returns { success: true, count: 8, data: [...] }
        const categoriesArray = data.data || [];

        // Map API response to expected format
        const mappedCategories = categoriesArray.map((item, index) => ({
          id: item._id || `category-${index}`, // _id is already a string
          image: item.image || '', // Handle undefined image
          title: item.name || 'Unknown',
          link: `/shop-grid-filter?category=${encodeURIComponent(item.name || '')}`,
          subtitle: "Products" // Default subtitle since API doesn't provide count
        }));

        // Randomly select 8 categories
        const shuffledCategories = mappedCategories.sort(() => 0.5 - Math.random());
        const randomCategories = shuffledCategories.slice(0, 8);

        setCategories(randomCategories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={clsx("collections-area", spaceTopClass, spaceBottomClass)}>
        <div className="container-fluid">
          <div className="row">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                <div className="collection-product">
                  <div
                    className="collection-img"
                    style={{
                      borderRadius: "15px",
                      overflow: "hidden",
                      backgroundColor: "#f0f0f0",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "50%",
                        animation: "skeleton-pulse 1.5s ease-in-out infinite"
                      }}
                    />
                  </div>
                  <div className="collection-content text-center" style={{ padding: "15px 0" }}>
                    <div
                      style={{
                        height: "20px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        animation: "skeleton-pulse 1.5s ease-in-out infinite",
                        animationDelay: "0.1s"
                      }}
                    />
                    <div
                      style={{
                        height: "16px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        width: "70%",
                        margin: "0 auto",
                        animation: "skeleton-pulse 1.5s ease-in-out infinite",
                        animationDelay: "0.2s"
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes skeleton-pulse {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.5;
                }
              }
            `
          }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx("collections-area", spaceTopClass, spaceBottomClass)}>
        <div className="container-fluid">
          <div className="text-center">Error loading categories: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("collections-area", spaceTopClass, spaceBottomClass)}>
      <div className="container-fluid">
        {categories && categories.length > 0 && (
          <Swiper options={settings}>
            {categories.map(single => (
              <SwiperSlide key={single.id}>
                <CategoryFourSingle data={single} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

CategoryFourSlider.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default CategoryFourSlider;
