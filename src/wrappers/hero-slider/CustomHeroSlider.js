import { useState, useEffect } from "react";
import { Navigation, Autoplay } from "swiper";
import Swiper, { SwiperSlide } from "../../components/swiper";
import { Link } from "react-router-dom";

const params = {
  modules: [Navigation, Autoplay],
  loop: false,
  speed: 3000,
  navigation: true,
  spaceBetween: 15,
  slidesPerView: 2.3,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2.5,
    },
  },
};

function CustomHeroSlider() {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://e-commerce-4-bsqw.onrender.com/api/public/herosliders')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const processedData = data.data.map(item => ({
            ...item,
            url: `/shop-grid-filter?category=${item.category}&discount=${item.discount}`
          }));
          setSliderData(processedData);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hero sliders:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="slider-area pt-0 pb-100">
      <style>
        {`
          .responsive-slider-img {
            height: 300px;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            width: 100%;
          }
          .responsive-slider-img img {
            transition: transform 0.3s ease;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .responsive-slider-img:hover img {
            transform: scale(1.02);
          }
          @media (max-width: 767px) {
            .responsive-slider-img {
              height: 180px;
              border-radius: 10px;
            }
          }
          .nav-style-1 .swiper-button-prev::after,
          .nav-style-1 .swiper-button-next::after {
            color: #000;
          }
          .swiper-slide {
            padding: 4px;
          }
          .slider-area {
            padding: 10px 0;
          }
          @keyframes loading {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      <div className="container-fluid">
        {loading ? (
          <div className="slider-active nav-style-1">
            <Swiper options={params}>
              {[...Array(3)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="single-slider-2 bg-img responsive-slider-img skeleton"
                    style={{
                      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation: "loading 1.5s infinite",
                      borderRadius: "15px",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          sliderData && sliderData.length > 0 && (
            <div className="slider-active nav-style-1">
              <Swiper options={params}>
                {sliderData.map((single) => (
                  <SwiperSlide key={single.id}>
                    <Link to={process.env.PUBLIC_URL + single.url}>
                      <div
                        className="single-slider-2 bg-img responsive-slider-img"
                        style={{
                          cursor: "pointer",
                          overflow: "hidden",
                          borderRadius: "15px",
                        }}
                      >
                        <img
                          src={single.backgroundImage}
                          alt="slider"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CustomHeroSlider;
