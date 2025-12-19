import PropTypes from "prop-types";
import clsx from "clsx";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div className={clsx("welcome-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="welcome-content text-center">
          <h5>Who Are We</h5>
          <h1>Welcome To E-commerce</h1>
          <p>
            Welcome to our E-commerce website, your trusted destination for premium products that blend quality, innovation, and everyday convenience. Founded in 2015 with a passion for connecting passionate makers and discerning shoppers, we've grown into a vibrant online marketplace serving thousands of customers worldwide. Our journey began in a small garage workshop, where our founders dreamed of creating a space that not only sells exceptional goods—from handcrafted home essentials to cutting-edge tech gadgets—but also fosters a community built on trust, sustainability, and joy.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default SectionTitleWithText;
