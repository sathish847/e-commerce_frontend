import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";

const Product = () => {
  let { pathname } = useLocation();
  let { id } = useParams();
  const { products, loading } = useSelector((state) => state.product);
  const product = products && Array.isArray(products) ? products.find(product => product.id === parseInt(id)) : null;

  // Show loading spinner while products are being fetched
  if (loading) {
    return (
      <Fragment>
        <SEO
          titleTemplate="Loading Product"
          description="Loading product details."
        />
        <LayoutOne headerTop="visible">
          <Breadcrumb
            pages={[
              {label: "Home", path: process.env.PUBLIC_URL + "/" },
              {label: "Shop Product", path: process.env.PUBLIC_URL + pathname }
            ]}
          />
          <div className="error-area pt-40 pb-100">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-8 text-center">
                  <div className="error">
                    <div className="flone-preloader-wrapper">
                      <div className="flone-preloader">
                        <span />
                        <span />
                      </div>
                    </div>
                    <h2>Loading Product...</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LayoutOne>
      </Fragment>
    );
  }

  if (!product) {
    return (
      <Fragment>
        <SEO
          titleTemplate="Product Not Found"
          description="Product not found page."
        />
        <LayoutOne headerTop="visible">
          <Breadcrumb
            pages={[
              {label: "Home", path: process.env.PUBLIC_URL + "/" },
              {label: "Shop Product", path: process.env.PUBLIC_URL + pathname }
            ]}
          />
          <div className="error-area pt-40 pb-100">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-8 text-center">
                  <div className="error">
                    <h1>404</h1>
                    <h2>Product Not Found</h2>
                    <p>
                      Sorry, the product you're looking for doesn't exist.
                    </p>
                    <a
                      href={process.env.PUBLIC_URL + "/"}
                      className="error-btn"
                    >
                      Back to home page
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LayoutOne>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="Product Page"
        description="Product Page of  react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Shop Product", path: process.env.PUBLIC_URL + pathname }
          ]}
        />

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />

        {/* product description tab */}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product.fullDescription}
          productId={product.id}
        />

        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={product.category[0]}
        />
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
