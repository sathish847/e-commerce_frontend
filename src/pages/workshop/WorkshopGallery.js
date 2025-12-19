import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const WorkshopGallery = () => {
  let { pathname } = useLocation();

  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Function to fetch workshops from API
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/workshops');

      if (!response.ok) {
        throw new Error('Failed to fetch workshops');
      }

      const data = await response.json();

      if (data.success) {
        // Filter only active workshops and add videoId
        const activeWorkshops = data.data
          .filter(workshop => workshop.status === 'active')
          .map(workshop => ({
            ...workshop,
            videoId: extractYouTubeId(workshop.youtubeLink)
          }));
        setWorkshops(activeWorkshops);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  return (
    <Fragment>
      <SEO
        titleTemplate="Workshop Gallery"
        description="Watch our workshop videos and learn handmade crafts techniques."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Workshop Gallery", path: process.env.PUBLIC_URL + pathname }
          ]}
        />

        {/* workshop gallery section */}
        <div className="workshop-gallery-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center mb-50">
                  <h2 className="title">Workshop Gallery</h2>
                  <p className="text">
                    Discover our collection of workshop videos featuring handmade crafts,
                    tutorials, and creative techniques. Learn from our expert artisans and
                    bring your creative ideas to life.
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              {loading ? (
                <div className="col-lg-12 text-center">
                  <div className="loading-spinner">
                    <p>Loading workshops...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="col-lg-12 text-center">
                  <div className="error-message">
                    <p>Error loading workshops: {error}</p>
                    <button onClick={fetchWorkshops} className="btn btn-primary">
                      Try Again
                    </button>
                  </div>
                </div>
              ) : workshops.length === 0 ? (
                <div className="col-lg-12 text-center">
                  <p>No workshops available at the moment.</p>
                </div>
              ) : (
                workshops.map((workshop, index) => (
                  <div key={workshop._id || index} className="col-lg-6 col-md-6 col-sm-12 mb-30">
                    <div className="workshop-video-item">
                      <div className="video-wrapper">
                        {workshop.videoId ? (
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${workshop.videoId}`}
                            title={workshop.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="video-placeholder">
                            <p>Invalid YouTube URL</p>
                          </div>
                        )}
                      </div>
                      <div className="video-info pt-20">
                        <h4 className="video-title">{workshop.title}</h4>
                        <p className="video-description">{workshop.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default WorkshopGallery;
