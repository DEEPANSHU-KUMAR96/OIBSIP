import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    activeGrouped: {
        base: [],
        sauce: [],
        cheese: [],
        veggie: []
    },
    loading: false,
    error: null,
    success: null
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setAdminItems(state, action) {
            state.items = action.payload || [];
        },
        setActiveGrouped(state, action) {
            state.activeGrouped = {
                base: action.payload?.base || [],
                sauce: action.payload?.sauce || [],
                cheese: action.payload?.cheese || [],
                veggie: action.payload?.veggie || []
            };
        },
        addItemLocally(state, action) {
            state.items.push(action.payload);
        },
        updateItemStockLocally(state, action) {
            const { id, stock } = action.payload;
            const index = state.items.findIndex(item => item._id === id);
            if (index !== -1) {
                state.items[index].stock = stock;
            }
        },
        removeItemLocally(state, action) {
            const id = action.payload;
            state.items = state.items.filter(item => item._id !== id);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setSuccess(state, action) {
            state.success = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        clearSuccess(state) {
            state.success = null;
        }
    }
});

export const {
    setAdminItems,
    setActiveGrouped,
    addItemLocally,
    updateItemStockLocally,
    removeItemLocally,
    setLoading,
    setError,
    setSuccess,
    clearError,
    clearSuccess
} = inventorySlice.actions;

export default inventorySlice.reducer;
