import axios from "axios";

const authApiInstance = axios.create({
    baseURL: '/api/auth',
    withCredentials: true
});

// Attach accessToken on every request
authApiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export async function register({ name, email, password }) {
    try {
        const response = await authApiInstance.post('/register', { name, email, password });
        if (response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Registration failed";
        throw new Error(message);
    }
}

export async function login({ email, password }) {
    try {
        const response = await authApiInstance.post('/login', { email, password });
        if (response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Login failed";
        throw new Error(message);
    }
}

export async function getMe() {
    try {
        const response = await authApiInstance.get('/me');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to fetch user";
        throw new Error(message);
    }
}

export async function logout() {
    try {
        const response = await authApiInstance.post('/logout');
        localStorage.removeItem('accessToken');
        return response.data;
    } catch (error) {
        localStorage.removeItem('accessToken');
        const message = error.response?.data?.message || error.message || "Logout failed";
        throw new Error(message);
    }
}