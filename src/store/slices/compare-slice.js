import cogoToast from 'cogo-toast';
const { createSlice } = require('@reduxjs/toolkit');

const compareSlice = createSlice({
    name: "compare",
    initialState: {
        compareItems: []
    },
    reducers: {
        addToCompare(state, action) {
            const existingItem = state.compareItems.find(item => item.id === action.payload.id);
            if (!existingItem) {
                state.compareItems.push(action.payload);
                cogoToast.success("Added To Compare", {position: "bottom-left"});
            } else {
                cogoToast.warn("Already Added To Compare", {position: "bottom-left"});
            }
        },
        deleteFromCompare(state, action) {
            state.compareItems = state.compareItems.filter(item => item.id !== action.payload);
            cogoToast.error("Removed From Compare", {position: "bottom-left"});
        },
        deleteAllFromCompare(state) {
            state.compareItems = [];
        }
    },
});

export const { addToCompare, deleteFromCompare, deleteAllFromCompare } = compareSlice.actions;
export default compareSlice.reducer;