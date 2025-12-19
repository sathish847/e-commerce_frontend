import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CategoryFourSingle = ({ data, sliderClass }) => {
  const imageUrl = data.image && data.image.startsWith("http") ? data.image : data.image ? process.env.PUBLIC_URL + data.image : '';

  return (
    <div className="collection-product">
      <div className="collection-img" style={{ borderRadius: "15px", overflow: "hidden" }}>
        <Link to={process.env.PUBLIC_URL + data.link}>
          <img src={imageUrl} alt="" />
        </Link>
      </div>
      <div className="collection-content text-center">
        <h4>
          <Link to={process.env.PUBLIC_URL + data.link}>{data.title}</Link>
        </h4>
      </div>
    </div>
  );
};

CategoryFourSingle.propTypes = {
  data: PropTypes.shape({}),
  sliderClass: PropTypes.string
};

export default CategoryFourSingle;
