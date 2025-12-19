import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from "./App";
import { store } from "./store/store";
import PersistProvider from "./store/providers/persist-provider";
import { setProducts, setLoading } from "./store/slices/product-slice"
import 'animate.css';
import 'swiper/swiper-bundle.min.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";

// Fetch products from backend API
fetch('https://e-commerce-4-bsqw.onrender.com/api/products')
  .then(response => response.json())
  .then(data => {
    // Handle different response structures
    const products = data.data || data.products || data || [];
    console.log('Fetched products:', products);
    store.dispatch(setProducts(products));
  })
  .catch(error => {
    console.error('Error fetching products:', error);
    // Fallback to static data if API fails
    import('./data/products.json').then(products => {
      store.dispatch(setProducts(products.default));
    });
  });

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
      <PersistProvider>
        <App />
      </PersistProvider>
    </Provider>
);
