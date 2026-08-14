import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    inventory: {
        base: [],
        sauce: [],
        cheese: [],
        veggie: []
    },
    inventoryLoading: false,
    customization: {
        base: null,
        sauce: null,
        cheese: null,
        veggies: []
    },
    myOrders: [],
    allOrders: [],
    loading: false,
    placingOrder: false,
    error: null,
    success: null
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setInventory(state, action) {
            state.inventory = {
                base: action.payload.base || [],
                sauce: action.payload.sauce || [],
                cheese: action.payload.cheese || [],
                veggie: action.payload.veggie || []
            };
        },
        setInventoryLoading(state, action) {
            state.inventoryLoading = action.payload;
        },
        selectBase(state, action) {
            state.customization.base = action.payload;
        },
        selectSauce(state, action) {
            state.customization.sauce = action.payload;
        },
        selectCheese(state, action) {
            state.customization.cheese = action.payload;
        },
        toggleVeggie(state, action) {
            const veggieId = action.payload;
            const exists = state.customization.veggies.includes(veggieId);
            if (exists) {
                state.customization.veggies = state.customization.veggies.filter(id => id !== veggieId);
            } else {
                state.customization.veggies.push(veggieId);
            }
        },
        resetCustomization(state) {
            state.customization = {
                base: state.inventory.base.find(b => b.stock > 0)?._id || null,
                sauce: state.inventory.sauce.find(s => s.stock > 0)?._id || null,
                cheese: state.inventory.cheese.find(c => c.stock > 0)?._id || null,
                veggies: []
            };
        },
        setMyOrders(state, action) {
            state.myOrders = action.payload;
        },
        setAllOrders(state, action) {
            state.allOrders = action.payload;
        },
        addOrder(state, action) {
            state.myOrders.unshift(action.payload);
        },
        updateSingleOrderStatus(state, action) {
            const { id, orderStatus } = action.payload;
            const myIndex = state.myOrders.findIndex(o => o._id === id);
            if (myIndex !== -1) {
                state.myOrders[myIndex].orderStatus = orderStatus;
            }
            const allIndex = state.allOrders.findIndex(o => o._id === id);
            if (allIndex !== -1) {
                state.allOrders[allIndex].orderStatus = orderStatus;
            }
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setPlacingOrder(state, action) {
            state.placingOrder = action.payload;
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
    setInventory,
    setInventoryLoading,
    selectBase,
    selectSauce,
    selectCheese,
    toggleVeggie,
    resetCustomization,
    setMyOrders,
    setAllOrders,
    addOrder,
    updateSingleOrderStatus,
    setLoading,
    setPlacingOrder,
    setError,
    setSuccess,
    clearError,
    clearSuccess
} = orderSlice.actions;

export default orderSlice.reducer;
