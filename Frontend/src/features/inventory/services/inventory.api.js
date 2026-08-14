import axios from "axios";

const inventoryApiInstance = axios.create({
    baseURL: '/api/inventory',
    withCredentials: true
});

inventoryApiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export async function fetchActiveInventory() {
    try {
        const response = await inventoryApiInstance.get('/');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to fetch inventory";
        throw new Error(message);
    }
}

export async function fetchAdminInventory() {
    try {
        const response = await inventoryApiInstance.get('/admin');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to fetch admin inventory";
        throw new Error(message);
    }
}

export async function addInventoryItem({ name, category, stock, price, lowStockThreshold }) {
    try {
        const response = await inventoryApiInstance.post('/', {
            name,
            category,
            stock: Number(stock),
            price: Number(price),
            lowStockThreshold: Number(lowStockThreshold || 20)
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to add inventory item";
        throw new Error(message);
    }
}

export async function updateInventoryStock(id, stock) {
    try {
        const response = await inventoryApiInstance.put(`/${id}`, { stock: Number(stock) });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to update stock";
        throw new Error(message);
    }
}

export async function deleteInventoryItem(id) {
    try {
        const response = await inventoryApiInstance.delete(`/${id}`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to delete inventory item";
        throw new Error(message);
    }
}
