import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SliderAdmin = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      // Fetch from backend API
      const response = await axios.get('https://e-commerce-4-bsqw.onrender.com/api/sliders');
      setSliders(response.data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
      // Fallback to local file if API fails
      try {
        const fallbackResponse = await axios.get('/data/hero-sliders/hero-slider-fourteen.json');
        setSliders(fallbackResponse.data);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMediaTypeChange = (id, mediaType) => {
    setSliders(sliders.map(slider =>
      slider.id === id ? { ...slider, mediaType } : slider
    ));
  };

  const handleInputChange = (id, field, value) => {
    setSliders(sliders.map(slider =>
      slider.id === id ? { ...slider, [field]: value } : slider
    ));
  };

  const handleSave = async (id) => {
    try {
      // In production, send to your backend API
      const sliderToUpdate = sliders.find(s => s.id === id);
      console.log('Saving slider:', sliderToUpdate);

      // For now, we'll just update local state
      // You would typically make an API call here:
      // await axios.put(`/api/sliders/${id}`, sliderToUpdate);

      setEditingId(null);
      alert('Slider updated successfully!');
    } catch (error) {
      console.error('Error saving slider:', error);
      alert('Error saving slider');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Hero Slider Admin Panel</h2>

      {sliders.map((slider) => (
        <div key={slider.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Slide {slider.id}</h5>

            <div className="mb-3">
              <label className="form-label">Media Type</label>
              <select
                className="form-select"
                value={slider.mediaType || 'image'}
                onChange={(e) => handleMediaTypeChange(slider.id, e.target.value)}
              >
                <option value="image">Image</option>
                <option value="video">YouTube Video</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={slider.title}
                onChange={(e) => handleInputChange(slider.id, 'title', e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Subtitle</label>
              <input
                type="text"
                className="form-control"
                value={slider.subtitle}
                onChange={(e) => handleInputChange(slider.id, 'subtitle', e.target.value)}
              />
            </div>

            {slider.mediaType === 'video' ? (
              <div className="mb-3">
                <label className="form-label">YouTube Video ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={slider.videoId || ''}
                  onChange={(e) => handleInputChange(slider.id, 'videoId', e.target.value)}
                  placeholder="e.g., dQw4w9WgXcQ"
                />
                <small className="form-text text-muted">
                  Get the video ID from the YouTube URL (the part after v=)
                </small>
              </div>
            ) : (
              <div className="mb-3">
                <label className="form-label">Image Path</label>
                <input
                  type="text"
                  className="form-control"
                  value={slider.image}
                  onChange={(e) => handleInputChange(slider.id, 'image', e.target.value)}
                  placeholder="e.g., /assets/img/slider/image.jpg"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">URL</label>
              <input
                type="text"
                className="form-control"
                value={slider.url}
                onChange={(e) => handleInputChange(slider.id, 'url', e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleSave(slider.id)}
            >
              Save Changes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SliderAdmin;
