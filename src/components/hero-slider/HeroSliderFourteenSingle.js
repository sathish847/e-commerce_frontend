import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HeroSliderFourteenSingle = ({ data }) => {
  return (
    <div className="slider-height-5 d-flex align-items-center bg-img position-relative overflow-hidden">
      {data.mediaType === 'video' ? (
        // Video background (direct video URL or YouTube)
        <div
          className="position-absolute w-100 h-100"
          style={{
            top: 0,
            left: 0,
            zIndex: -1,
            overflow: 'hidden'
          }}
        >
          {data.youtubeUrl ? (
            // YouTube video
            <iframe
              src={`https://www.youtube.com/embed/${data.youtubeUrl.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=1&loop=1&playlist=${data.youtubeUrl.split('v=')[1]?.split('&')[0]}&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                width: '200%',
                height: '200%',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                pointerEvents: 'none'
              }}
              title="Background Video"
            />
          ) : (
            // Direct video file
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                objectFit: 'fill',
                pointerEvents: 'none'
              }}
            >
              <source src={data.image} type="video/mp4" />
            </video>
          )}
        </div>
      ) : (
        // Image background
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: `url(${data.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            top: 0,
            left: 0,
            zIndex: -1
          }}
        />
      )}

      {/* Overlay for better text readability */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          top: 0,
          left: 0,
          zIndex: 0
        }}
      />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            <div className="slider-content-6 slider-animated-1 text-center">
              <h1 className="animated">{data.title}</h1>
              <p className="animated">{data.subtitle}</p>
              <div className="slider-btn-5 btn-hover">
                <Link
                  className="animated"
                  to={(() => {
                    if (data.url === 'custom') {
                      return `/shop-grid-filter?category=all&discount=${data.discount || 0}`;
                    } else if (data.url && data.url.startsWith('/category/')) {
                      const category = data.url.split('/category/')[1];
                      return `/shop-grid-filter?category=${category}&discount=${data.discount || 0}`;
                    } else {
                      return data.url;
                    }
                  })()}
                >
                  {data.buttonName || 'SHOP NOW'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroSliderFourteenSingle.propTypes = {
  data: PropTypes.shape({})
};

export default HeroSliderFourteenSingle;
