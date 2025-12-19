import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import clsx from "clsx";

const BannerThirteenSingle = ({ data, spaceBottomClass }) => {
  const imageUrl = data.image.startsWith("http") ? data.image : process.env.PUBLIC_URL + data.image;
  return (
    <div className={clsx("single-banner", spaceBottomClass)} style={{ height: "300px", overflow: "hidden" }}>
      <Link to={process.env.PUBLIC_URL + data.link}>
        <img
          src={imageUrl}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Link>
    </div>
  );
};

BannerThirteenSingle.propTypes = {
  data: PropTypes.object,
  spaceBottomClass: PropTypes.string
};

export default BannerThirteenSingle;