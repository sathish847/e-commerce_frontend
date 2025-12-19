import { Fragment, useState, useEffect } from 'react';
import Paginator from 'react-hooks-paginator';
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom"
import { getSortedProducts } from '../../helpers/product';
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopSidebar from '../../wrappers/product/ShopSidebar';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import ProductSkeletonGridList from '../../components/product/ProductSkeletonGridList';

const ShopGridStandard = () => {
    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pageLimit = 15;
    const { pathname, search } = useLocation();

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    }

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const urlParams = new URLSearchParams(search);
                const searchQuery = urlParams.get('search');
                const isNewFilter = urlParams.get('filter') === 'new';

                let apiUrl;
                if (searchQuery) {
                    apiUrl = `https://e-commerce-4-bsqw.onrender.com/api/public/products/search?name=${encodeURIComponent(searchQuery)}`;
                } else if (isNewFilter) {
                    apiUrl = 'https://e-commerce-4-bsqw.onrender.com/api/products/new';
                } else {
                    apiUrl = 'https://e-commerce-4-bsqw.onrender.com/api/products';
                }

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const productsData = data.data || data.products || data;
                setProducts(productsData);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search]);

    useEffect(() => {
        const category = new URLSearchParams(search).get("category");
        if (category) {
            setSortType("category");
            setSortValue(category);
        } else {
            setSortType("");
            setSortValue("");
        }
    }, [search]);

    useEffect(() => {
        let sortedProducts = getSortedProducts(products, sortType, sortValue);
        const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, products, sortType, sortValue, filterSortType, filterSortValue ]);

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
                        {loading ? (
                            <div className="row">
                                <div className="col-lg-3 order-2 order-lg-1">
                                    {/* shop sidebar skeleton */}
                                    <div className="skeleton" style={{ height: '400px', marginBottom: '30px' }}></div>
                                </div>
                                <div className="col-lg-9 order-1 order-lg-2">
                                    {/* shop topbar skeleton */}
                                    <div className="skeleton" style={{ height: '60px', marginBottom: '35px' }}></div>

                                    {/* shop page content skeleton */}
                                    <div className="shop-bottom-area mt-35">
                                        <div className={layout === 'grid three-column' ? 'row three-column' : 'row'}>
                                            <ProductSkeletonGridList count={9} spaceBottomClass="mb-25" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="row">
                                <div className="col-12">
                                    <div className="text-center">
                                        <div className="alert alert-danger" role="alert">
                                            <h4 className="alert-heading">Error Loading Products</h4>
                                            <p>{error}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => window.location.reload()}
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-lg-3 order-2 order-lg-1">
                                    {/* shop sidebar */}
                                    <ShopSidebar products={products} getSortParams={getSortParams} sideSpaceClass="mr-30"/>
                                </div>
                                <div className="col-lg-9 order-1 order-lg-2">
                                    {/* shop topbar default */}
                                    <ShopTopbar getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={currentData.length} />

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
                        )}
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}


export default ShopGridStandard;
