import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import PizzaBuilder from "../features/order/pages/PizzaBuilder";
import MyOrders from "../features/order/pages/MyOrders";
import AdminOrders from "../features/order/pages/AdminOrders";
import InventoryManagement from "../features/inventory/pages/InventoryManagement";
import ProtectedRoute from "./protectedRoutes";

export const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <PizzaBuilder />
            </ProtectedRoute>
        )
    },
    {
        path: "/my-orders",
        element: (
            <ProtectedRoute>
                <MyOrders />
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/orders",
        element: (
            <ProtectedRoute>
                <AdminOrders />
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/inventory",
        element: (
            <ProtectedRoute>
                <InventoryManagement />
            </ProtectedRoute>
        )
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);

export default appRoutes;