import PropTypes from "prop-types";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useState, useEffect } from "react";

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });
  const [userData, setUserData] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  // API headers with JWT authentication
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Load user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem('userData');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          name: parsedUser.name || parsedUser.fullName || '',
          email: parsedUser.email || ''
        }));
      } catch (e) {
        console.log('Could not parse user data');
      }
    }
  }, []);

  // Fetch reviews for the product
  const fetchReviews = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await fetch(`https://e-commerce-4-bsqw.onrender.com/api/reviews/product/${String(productId)}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
      } else {
        console.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }
    if (!formData.message.trim()) {
      alert('Message is required');
      return;
    }
    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        productId: String(productId),
        rating: formData.rating
      };

      const response = await fetch('https://e-commerce-4-bsqw.onrender.com/api/reviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        // Reset form
        setFormData(prev => ({
          ...prev,
          message: '',
          rating: 0
        }));
        // Refresh reviews
        fetchReviews();
      } else {
        const errorData = await response.json();
        alert(`Failed to submit review: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= rating ? "fa fa-star" : "fa fa-star-o"}
        />
      );
    }
    return stars;
  };

  // Render star rating input
  const renderRatingInput = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= formData.rating ? "fa fa-star" : "fa fa-star-o"}
          style={{ cursor: 'pointer' }}
          onClick={() => handleRatingChange(i)}
        />
      );
    }
    return stars;
  };
  return (
    <div className={clsx("description-review-area", spaceBottomClass)}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">Reviews({reviews.length})</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="productDescription">
                {productFullDesc}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="review-wrapper">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading reviews...</span>
                          </div>
                          <p className="mt-2">Loading reviews...</p>
                        </div>
                      ) : reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <div key={review._id || index} className="single-review">
                            <div className="review-content">
                              <div className="review-top-wrap">
                                <div className="review-left">
                                  <div className="review-name">
                                    <h4>{review.name}</h4>
                                  </div>
                                  <div className="review-rating">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                              </div>
                              <div className="review-bottom">
                                <p>{review.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p>No reviews yet. Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="ratting-form-wrapper pl-50">
                      <h3>Add a Review</h3>
                      <div className="ratting-form">
                        <form onSubmit={handleSubmit}>
                          <div className="star-box">
                            <span>Your rating:</span>
                            <div className="ratting-star">
                              {renderRatingInput()}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="rating-form-style mb-10">
                                <input
                                  placeholder="Name"
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="rating-form-style mb-10">
                                <input
                                  placeholder="Email"
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="rating-form-style form-submit">
                                <textarea
                                  name="message"
                                  placeholder="Message"
                                  value={formData.message}
                                  onChange={handleInputChange}
                                  required
                                />
                                <input
                                  type="submit"
                                  value={submitting ? "Submitting..." : "Submit"}
                                  disabled={submitting}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ProductDescriptionTab;
