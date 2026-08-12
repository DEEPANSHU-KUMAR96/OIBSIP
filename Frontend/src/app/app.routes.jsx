import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "./protectedRoutes";

export const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f5] text-[#1e1b18] p-6 text-center">
                    <h1 className="font-display text-3xl font-bold text-[#9e0027] mb-2">
                        Artisanal Hearth
                    </h1>
                    <p className="text-base text-[#5b4040]">
                        Logged in successfully! Welcome to <code className="bg-[#e9e1dc] px-2 py-1 rounded text-[#1e1b18] font-mono text-sm">/</code>
                    </p>
                </div>
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