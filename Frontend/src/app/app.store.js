import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/auth.slice'
import orderReducer from '../features/order/state/order.slice'
import inventoryReducer from '../features/inventory/state/inventory.slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        order: orderReducer,
        inventory: inventoryReducer
    }
})