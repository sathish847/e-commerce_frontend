import { Fragment, useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import Paginator from 'react-hooks-paginator';
import { useLocation } from "react-router-dom";
import { getSortedProducts } from '../../helpers/product';
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopTopbarFilter from '../../wrappers/product/ShopTopbarFilter';
import ShopProducts from '../../wrappers/product/ShopProducts';

const ShopGridFilter = () => {
    const [layout, setLayout] = useState('grid three-column');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDiscount, setFilterDiscount] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const { products } = useSelector((state) => state.product);
    const [isMobile, setIsMobile] = useState(false); // New state for mobile view

    const pageLimit = 15;
    let { pathname, search } = useLocation();

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    }

    useEffect(() => {
        const category = new URLSearchParams(search).get("category");
        if (category) {
            setFilterCategory(category);
        } else {
            setFilterCategory("");
        }
    }, [search]);

    useEffect(() => {
        const discount = new URLSearchParams(search).get("discount");
        if (discount) {
            setFilterDiscount(discount);
        } else {
            setFilterDiscount("");
        }
    }, [search]);

    // Effect to handle window resize for mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767); // Based on $xs-layout breakpoint
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial value

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let sortedProducts = [];

        if (filterCategory === "new") {
            // Special handling for new products
            sortedProducts = products.filter(product => product.new);
        } else if (filterCategory) {
            // Regular category filtering
            sortedProducts = getSortedProducts(products, "category", filterCategory);
        } else {
            // No category filter
            sortedProducts = products;
        }

        if (filterDiscount) {
            sortedProducts = getSortedProducts(sortedProducts, "discount", filterDiscount);
        }
        const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
        setSortedProducts(filterSortedProducts);

        // Adjust layout for mobile if isMobile is true
        const currentLayout = isMobile ? 'grid one-column' : layout;
        setCurrentData(filterSortedProducts.slice(offset, offset + pageLimit));
        setLayout(currentLayout); // Update layout state based on mobile view
    }, [offset, products, filterSortType, filterSortValue, filterCategory, filterDiscount, isMobile]); // Added filterDiscount to dependencies

    return (
        <Fragment>
            <SEO
                titleTemplate="Shop Page"
                description="Shop page of e-commerce react minimalist eCommerce template."
            />

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb 
                    pages={[
                        {label: "Home", path: process.env.PUBLIC_URL + "/" },
                        {label: "Shop", path: process.env.PUBLIC_URL + pathname }
                    ]} 
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* shop topbar filter */}
                                <ShopTopbarFilter getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={currentData.length} />

                                {/* shop page content default */}
                                <ShopProducts layout={layout} products={currentData} />

                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={sortedProducts.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}

export default ShopGridFilter;
