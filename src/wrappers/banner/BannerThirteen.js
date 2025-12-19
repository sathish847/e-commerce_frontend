import PropTypes from "prop-types";
import clsx from "clsx";
import { Navigation, Autoplay } from "swiper";
import Swiper, { SwiperSlide } from "../../components/swiper";
import bannerData from "../../data/banner/banner-thirteen.json";
import BannerThirteenSingle from "../../components/banner/BannerThirteenSingle.js";

const settings = {
  modules: [Navigation, Autoplay],
  loop: true,
  spaceBetween: 30,
  slidesPerView: 1,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: true,
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 1,
    },
  },
};

const BannerThirteen = ({ spaceBottomClass }) => {
  return (
    <div className={clsx("banner-area", "banner-thirteen-wrapper", spaceBottomClass)}>
      <style>{`
        .banner-thirteen-wrapper .single-banner img {
          transition: transform 0.3s ease;
          will-change: transform;
        }
        .banner-thirteen-wrapper .single-banner:hover img {
          transform: scale(1.02);
        }
        .banner-thirteen-wrapper .nav-style-1 .swiper-button-prev::after,
        .banner-thirteen-wrapper .nav-style-1 .swiper-button-next::after {
            color: #333;
        }
      `}</style>
      <div className="container">
        <div className="slider-active nav-style-1">
          {bannerData && (
            <Swiper options={settings}>
              {bannerData.map(single => (
                <SwiperSlide key={single.id}>
                  <BannerThirteenSingle data={single} spaceBottomClass="mb-30" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

BannerThirteen.propTypes = {
  spaceBottomClass: PropTypes.string
};

export default BannerThirteen;
