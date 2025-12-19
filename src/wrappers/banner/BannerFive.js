
import { Link } from "react-router-dom";

const BannerFive = () => {
  return (
    <div className="banner-area hm9-section-padding">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="row">
              <div className="col-lg-12">
                <div className="single-banner mb-20">
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-filter?category=chocolates"}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "https://img.freepik.com/free-psd/chocolate-shop-template-banner_23-2148669318.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </Link>
                  <div className="banner-content-3 banner-position-hm15-1">
                    
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="single-banner mb-20">
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-filter?category=flower"}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "https://thumbs.dreamstime.com/b/floral-spring-sale-banner-pink-red-blossoms-vibrant-seasonal-promotion-design-fashion-beauty-retail-floral-spring-357896260.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </Link>
                  <div className="banner-content-3 banner-position-hm15-1">
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="single-banner mb-20 middle-banner">
              <Link to={process.env.PUBLIC_URL + "/shop-grid-filter?category=cakes"}>
                <img
                  src={
                    process.env.PUBLIC_URL + "https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:4fb46b0e-fd81-50be-91c3-3b256c33c1bc/component?assetType=TEMPLATE&etag=e3d94a48c9f1484b8cd6b2fb714a1cfd&revision=8a2a46a3-40ce-4c19-a217-d69c248b5844&component_id=b84a2aa5-3e43-4101-b341-286c5f0b8666"
                  }
                  alt=""
                />
              </Link>
              <div className="banner-content-4 banner-position-hm15-2">
                
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="row">
              <div className="col-lg-12 col-md-6">
                <div className="single-banner mb-20">
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-filter?category=chocolates"}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "https://marketplace.canva.com/EAGl0bsXZGQ/1/0/1600w/canva-beige-and-gold-elegant-photo-collage-jewelry-banner-1-XdPnFlpo4.jpg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </Link>
                  <div className="banner-content-3 banner-position-hm15-2">
                    
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-6">
                <div className="single-banner mb-20">
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-filter?category=chocolates"}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "https://m.media-amazon.com/images/I/91gUhFEzYRL.png"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </Link>
                  <div className="banner-content-3 banner-position-hm15-2">
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerFive;
