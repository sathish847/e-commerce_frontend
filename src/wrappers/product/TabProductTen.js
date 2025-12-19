import PropTypes from "prop-types";
import clsx from "clsx";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { getProducts } from "../../helpers/product";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGridSingle from "../../components/product/ProductGridSingle";

const TabProductTen = ({
  spaceTopClass,
  spaceBottomClass,
  bgColorClass,
  category
}) => {
  const { products } = useSelector((state) => state.product);
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  

  // Get products for each category
  const newProducts = getProducts(products, category, "new", 8);
  const bestSellerProducts = getProducts(products, category, "bestSeller", 8);
  const saleProducts = getProducts(products, category, "saleItems", 8);

  return (
    <div className={clsx("product-area", spaceTopClass, spaceBottomClass, bgColorClass)}>
      <div className="container">
        <SectionTitle
          titleText="Daily Deals"
          positionClass="text-center"
          borderClass="no-border"
        />
        <Tab.Container defaultActiveKey="bestSeller">
          <Nav
            variant="pills"
            className="product-tab-list pt-30 pb-55 text-center"
          >
            <Nav.Item>
              <Nav.Link eventKey="newArrival">
                <h4>New Arrivals</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>Best Sellers</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="saleItems">
                <h4>Sale Items</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="newArrival">
              <div className="row">
                {newProducts?.map(product => (
                  <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={product.id}>
                    <ProductGridSingle
                      spaceBottomClass="mb-25"
                      product={product}
                      currency={currency}
                      cartItem={cartItems.find((cartItem) => cartItem.id === product.id)}
                      wishlistItem={wishlistItems.find((wishlistItem) => wishlistItem.id === product.id)}
                      
                    />
                  </div>
                ))}
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="bestSeller">
              <div className="row">
                {bestSellerProducts?.map(product => (
                  <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={product.id}>
                    <ProductGridSingle
                      spaceBottomClass="mb-25"
                      product={product}
                      currency={currency}
                      cartItem={cartItems.find((cartItem) => cartItem.id === product.id)}
                      wishlistItem={wishlistItems.find((wishlistItem) => wishlistItem.id === product.id)}
                      
                    />
                  </div>
                ))}
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="saleItems">
              <div className="row">
                {saleProducts?.map(product => (
                  <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={product.id}>
                    <ProductGridSingle
                      spaceBottomClass="mb-25"
                      product={product}
                      currency={currency}
                      cartItem={cartItems.find((cartItem) => cartItem.id === product.id)}
                      wishlistItem={wishlistItems.find((wishlistItem) => wishlistItem.id === product.id)}
                      
                    />
                  </div>
                ))}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

TabProductTen.propTypes = {
  bgColorClass: PropTypes.string,
  category: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductTen;
