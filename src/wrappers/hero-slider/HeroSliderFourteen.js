
import { useState, useEffect } from 'react';
import axios from 'axios';
import { EffectFade } from 'swiper';
import Swiper, { SwiperSlide } from "../../components/swiper";
import HeroSliderFourteenSingle from "../../components/hero-slider/HeroSliderFourteenSingle.js";

const params = {
  effect: "fade",
  fadeEffect: {
    crossFade: true
  },
  modules: [EffectFade],
  loop: true,
  speed: 1000,
  navigation: true,
  autoHeight: false,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  }
};

const HeroSliderFourteen = () => {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public/sliders');
        if (response.data.success) {
          setSliderData(response.data.data.filter(slider => slider.status));
        }
      } catch (error) {
        console.error('Error fetching slider data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();
  }, []);

  if (loading) {
    return (
      <div className="slider-area">
        <div className="slider-active-2 nav-style-3">
          <div className="slider-height-5 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slider-area">
      <div className="slider-active-2 nav-style-3">
        <Swiper options={params} className="overflow-hidden">
          {sliderData?.map((single, key) => (
            <SwiperSlide key={single._id}>
              <HeroSliderFourteenSingle
                data={single}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSliderFourteen;
