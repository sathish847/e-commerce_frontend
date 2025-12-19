const { createSlice } = require('@reduxjs/toolkit');

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        loading: true,
    },
    reducers: {
        setProducts(state, action) {
            state.products = action.payload;
            state.loading = false;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    },
});

export const { setProducts, setLoading } = productSlice.actions;
export default productSlice.reducer;
