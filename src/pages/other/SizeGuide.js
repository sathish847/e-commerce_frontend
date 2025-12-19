import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const SizeGuide = () => {
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO
        titleTemplate="Size Guide"
        description="Size Guide page of e-commerce, an e-commerce platform for gifts and crafts."
      />
      <LayoutOne headerTop="notvisible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Size Guide", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="container my-5">
          <h1 className="text-center mb-4">Size Guide</h1>
          <p className="lead text-center mb-5">
            Find your perfect fit with our detailed size guide. Please note that sizes may vary slightly between brands, so use this as a general guide.
          </p>

          <div className="mb-5">
            <h2 className="mb-3">How to Measure</h2>
            <ul>
              <li><strong>Bust:</strong> Measure around the fullest part of your bust, keeping the tape parallel to the floor.</li>
              <li><strong>Waist:</strong> Measure around your natural waistline, which is the narrowest part of your torso.</li>
              <li><strong>Hips:</strong> Measure around the fullest part of your hips, with your feet together.</li>
              <li><strong>Inseam:</strong> Measure from the top of your inner thigh down to the bottom of your ankle.</li>
            </ul>
          </div>

          <div className="mb-5">
            <h2 className="mb-3">Women's Clothing Size Chart (Inches)</h2>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust</th>
                  <th>Waist</th>
                  <th>Hips</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XS (0-2)</td>
                  <td>32-33"</td>
                  <td>24-25"</td>
                  <td>34.5-35.5"</td>
                </tr>
                <tr>
                  <td>S (4-6)</td>
                  <td>34-35"</td>
                  <td>26-27"</td>
                  <td>36.5-37.5"</td>
                </tr>
                <tr>
                  <td>M (8-10)</td>
                  <td>36-37"</td>
                  <td>28-29"</td>
                  <td>38.5-39.5"</td>
                </tr>
                <tr>
                  <td>L (12-14)</td>
                  <td>38.5-40"</td>
                  <td>30.5-32"</td>
                  <td>41-42.5"</td>
                </tr>
                <tr>
                  <td>XL (16-18)</td>
                  <td>41.5-43"</td>
                  <td>33.5-35"</td>
                  <td>44-45.5"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-5">
            <h2 className="mb-3">Men's Clothing Size Chart (Inches)</h2>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>35-37"</td>
                  <td>29-31"</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>38-40"</td>
                  <td>32-34"</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>41-43"</td>
                  <td>35-37"</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>44-46"</td>
                  <td>38-40"</td>
                </tr>
                <tr>
                  <td>XXL</td>
                  <td>47-49"</td>
                  <td>41-43"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="mb-3">International Size Conversion</h2>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>US</th>
                  <th>UK</th>
                  <th>Europe</th>
                  <th>Australia</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XS</td>
                  <td>6</td>
                  <td>34</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>S</td>
                  <td>8-10</td>
                  <td>36-38</td>
                  <td>8-10</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>12-14</td>
                  <td>40-42</td>
                  <td>12-14</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>16-18</td>
                  <td>44-46</td>
                  <td>16-18</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>20-22</td>
                  <td>48-50</td>
                  <td>20-22</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default SizeGuide;
