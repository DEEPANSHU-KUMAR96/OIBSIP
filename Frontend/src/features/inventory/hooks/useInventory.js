import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
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
} from "../state/inventory.slice";
import {
    fetchActiveInventory,
    fetchAdminInventory,
    addInventoryItem as addInventoryItemApi,
    updateInventoryStock as updateInventoryStockApi,
    deleteInventoryItem as deleteInventoryItemApi
} from "../services/inventory.api";

export function useInventory() {
    const dispatch = useDispatch();
    const { items, activeGrouped, loading, error, success } = useSelector((state) => state.inventory);

    const loadActiveInventory = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await fetchActiveInventory();
            dispatch(setActiveGrouped(data));
            return data;
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const loadAdminInventory = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await fetchAdminInventory();
            dispatch(setAdminItems(data));
            return data;
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleAddItem = async (itemData) => {
        dispatch(setLoading(true));
        dispatch(clearError());
        dispatch(clearSuccess());
        try {
            const createdItem = await addInventoryItemApi(itemData);
            dispatch(addItemLocally(createdItem));
            dispatch(setSuccess(`"${createdItem.name}" added to inventory successfully.`));
            return createdItem;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateStock = async (id, stock) => {
        dispatch(clearError());
        dispatch(clearSuccess());
        try {
            const updated = await updateInventoryStockApi(id, stock);
            dispatch(updateItemStockLocally({ id, stock: updated.stock }));
            dispatch(setSuccess(`Stock for "${updated.name}" updated to ${updated.stock}.`));
            return updated;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        }
    };

    const handleDeleteItem = async (id, name = 'Item') => {
        dispatch(setLoading(true));
        dispatch(clearError());
        dispatch(clearSuccess());
        try {
            await deleteInventoryItemApi(id);
            dispatch(removeItemLocally(id));
            dispatch(setSuccess(`"${name}" deactivated successfully.`));
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const clearInventoryError = () => dispatch(clearError());
    const clearInventorySuccess = () => dispatch(clearSuccess());

    return {
        items,
        activeGrouped,
        loading,
        error,
        success,
        loadActiveInventory,
        loadAdminInventory,
        handleAddItem,
        handleUpdateStock,
        handleDeleteItem,
        clearInventoryError,
        clearInventorySuccess
    };
}
