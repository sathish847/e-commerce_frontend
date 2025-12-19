
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getProducts } from "../../helpers/product";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";

const ProductGridTwo = ({
  spaceBottomClass,
  colorClass,
  titlePriceClass,
  category,
  type,
  limit
}) => {
  const { products } = useSelector((state) => state.product);
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);

  const [displayLimit, setDisplayLimit] = useState(4); // Start with 4 products
  const containerRef = useRef(null);

  const allProducts = getProducts(products, category, type, limit);
  const prods = allProducts.slice(0, displayLimit);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const containerBottom = container.offsetTop + container.offsetHeight;

      // Load more when user scrolls within 200px of the container bottom
      if (scrollTop + windowHeight >= containerBottom - 200) {
        if (displayLimit < allProducts.length) {
          setDisplayLimit(prev => Math.min(prev + 4, allProducts.length));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayLimit, allProducts.length]);
  
  return (
    <div ref={containerRef} style={{ display: 'flex', flexWrap: 'nowrap', gap: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
      {prods?.map((product) => {
        return (
          <div className="product-grid-2" style={{ flex: '0 0 auto', width: '250px' }} key={product.id}>
            <ProductGridSingleTwo
              spaceBottomClass={spaceBottomClass}
              colorClass={colorClass}
              product={product}
              currency={currency}
              wishlistItem={
                wishlistItems.find(
                  (wishlistItem) => wishlistItem.id === product.id
                )
              }

              titlePriceClass={titlePriceClass}
            />
          </div>
        );
      })}

    </div>
  );
};

ProductGridTwo.propTypes = {
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  limit: PropTypes.number
};

export default ProductGridTwo;
