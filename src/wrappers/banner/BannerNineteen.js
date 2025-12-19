import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const BannerNineteen = ({ spaceTopClass, spaceBottomClass }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('https://e-commerce-4-bsqw.onrender.com/api/public/banners');
        if (response.data && Array.isArray(response.data)) {
          setBanners(response.data.slice(0, 3)); // Take first 3 banners
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className={clsx("banner-area", "banner-nineteen", spaceTopClass, spaceBottomClass)}>
        <div className="container padding-20-row-col">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="single-banner mb-20" style={{ height: '200px', backgroundColor: '#f5f5f5' }}></div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="single-banner mb-20" style={{ height: '200px', backgroundColor: '#f5f5f5' }}></div>
              <div className="single-banner mb-20" style={{ height: '200px', backgroundColor: '#f5f5f5' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("banner-area", "banner-nineteen", spaceTopClass, spaceBottomClass)}>
      <div className="container padding-20-row-col">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            {banners[0] && (
              <div className="single-banner mb-20">
                <Link to={process.env.PUBLIC_URL + `/shop-grid-filter?category=${banners[0].category}&discount=${banners[0].discount}`}>
                  <img
                    src={banners[0].backgroundImage}
                    alt={banners[0].category}
                  />
                </Link>
                <div className="banner-content-4 banner-position-hm15-2 pink-banner">
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6 col-md-6">
            {banners[1] && (
              <div className="single-banner mb-20">
                <Link to={process.env.PUBLIC_URL + `/shop-grid-filter?category=${banners[1].category}&discount=${banners[1].discount}`}>
                  <img
                    src={banners[1].backgroundImage}
                    alt={banners[1].category}
                  />
                </Link>
                <div className="banner-content-3 banner-position-hm15-2 pink-banner">
                </div>
              </div>
            )}
            {banners[2] && (
              <div className="single-banner mb-20">
                <Link to={process.env.PUBLIC_URL + `/shop-grid-filter?category=${banners[2].category}&discount=${banners[2].discount}`}>
                  <img
                    src={banners[2].backgroundImage}
                    alt={banners[2].category}
                  />
                </Link>
                <div className="banner-content-3 banner-position-hm17-1 pink-banner">
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

BannerNineteen.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default BannerNineteen;
