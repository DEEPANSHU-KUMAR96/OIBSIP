import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem('accessToken') || null;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: initialToken,
        isAuthenticated: !!initialToken,
        loading: false,
        error: null
    },
    reducers: {
        login(state, action) {
            const payload = action.payload || {};
            // Backend returns: { _id, name, email, role, accessToken }
            state.user = {
                _id: payload._id,
                name: payload.name,
                email: payload.email,
                role: payload.role,
            };
            state.token = payload.accessToken || state.token;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('accessToken');
        },
        setUser(state, action) {
            // getMe returns: { _id, name, email, role, isVerified, createdAt }
            const data = action.payload;
            state.user = {
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                isVerified: data.isVerified,
                createdAt: data.createdAt,
            };
            state.isAuthenticated = true;
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        }
    }
});

export const { login, logout, setUser, setLoading, setError, clearError } = authSlice.actions;

export default authSlice.reducer;