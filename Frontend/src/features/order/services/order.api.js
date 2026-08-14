import axios from "axios";

const orderApiInstance = axios.create({
    baseURL: '/api/orders',
    withCredentials: true
});

orderApiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export async function createOrder({ base, sauce, cheese, veggies, totalPrice }) {
    try {
        const response = await orderApiInstance.post('/', { base, sauce, cheese, veggies, totalPrice });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to create order";
        throw new Error(message);
    }
}

export async function getMyOrders() {
    try {
        const response = await orderApiInstance.get('/my-orders');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to fetch your orders";
        throw new Error(message);
    }
}

export async function getAllOrders() {
    try {
        const response = await orderApiInstance.get('/');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to fetch all orders";
        throw new Error(message);
    }
}

export async function updateOrderStatus(orderId, orderStatus) {
    try {
        const response = await orderApiInstance.put(`/${orderId}/status`, { orderStatus });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to update order status";
        throw new Error(message);
    }
}
