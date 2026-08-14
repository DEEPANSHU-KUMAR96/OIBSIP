import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import {
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
} from "../state/order.slice";
import {
    createOrder as createOrderApi,
    getMyOrders as getMyOrdersApi,
    getAllOrders as getAllOrdersApi,
    updateOrderStatus as updateOrderStatusApi
} from "../services/order.api";
import { fetchActiveInventory } from "../../inventory/services/inventory.api";

export function useOrder() {
    const dispatch = useDispatch();
    const {
        inventory,
        inventoryLoading,
        customization,
        myOrders,
        allOrders,
        loading,
        placingOrder,
        error,
        success
    } = useSelector((state) => state.order);

    const loadInventory = useCallback(async () => {
        dispatch(setInventoryLoading(true));
        try {
            const data = await fetchActiveInventory();
            dispatch(setInventory(data));

            // Auto-select first in-stock items if not currently selected
            if (!customization.base && data.base?.length) {
                const available = data.base.find(i => i.stock > 0) || data.base[0];
                if (available) dispatch(selectBase(available._id));
            }
            if (!customization.sauce && data.sauce?.length) {
                const available = data.sauce.find(i => i.stock > 0) || data.sauce[0];
                if (available) dispatch(selectSauce(available._id));
            }
            if (!customization.cheese && data.cheese?.length) {
                const available = data.cheese.find(i => i.stock > 0) || data.cheese[0];
                if (available) dispatch(selectCheese(available._id));
            }

            return data;
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setInventoryLoading(false));
        }
    }, [dispatch, customization.base, customization.sauce, customization.cheese]);

    const handleSelectBase = (id) => dispatch(selectBase(id));
    const handleSelectSauce = (id) => dispatch(selectSauce(id));
    const handleSelectCheese = (id) => dispatch(selectCheese(id));
    const handleToggleVeggie = (id) => dispatch(toggleVeggie(id));

    const selectedBaseObj = useMemo(() => {
        return inventory.base.find(item => item._id === customization.base) || null;
    }, [inventory.base, customization.base]);

    const selectedSauceObj = useMemo(() => {
        return inventory.sauce.find(item => item._id === customization.sauce) || null;
    }, [inventory.sauce, customization.sauce]);

    const selectedCheeseObj = useMemo(() => {
        return inventory.cheese.find(item => item._id === customization.cheese) || null;
    }, [inventory.cheese, customization.cheese]);

    const selectedVeggieObjs = useMemo(() => {
        return inventory.veggie.filter(item => customization.veggies.includes(item._id));
    }, [inventory.veggie, customization.veggies]);

    const totalPrice = useMemo(() => {
        let total = 0;
        if (selectedBaseObj) total += (selectedBaseObj.price || 0);
        if (selectedSauceObj) total += (selectedSauceObj.price || 0);
        if (selectedCheeseObj) total += (selectedCheeseObj.price || 0);
        selectedVeggieObjs.forEach(v => {
            total += (v.price || 0);
        });
        return total;
    }, [selectedBaseObj, selectedSauceObj, selectedCheeseObj, selectedVeggieObjs]);

    const isCustomizationValid = useMemo(() => {
        return Boolean(
            customization.base &&
            customization.sauce &&
            customization.cheese &&
            selectedBaseObj?.stock > 0 &&
            selectedSauceObj?.stock > 0 &&
            selectedCheeseObj?.stock > 0 &&
            selectedVeggieObjs.every(v => v.stock > 0)
        );
    }, [customization.base, customization.sauce, customization.cheese, selectedBaseObj, selectedSauceObj, selectedCheeseObj, selectedVeggieObjs]);

    const handlePlaceOrder = async () => {
        if (!isCustomizationValid) {
            dispatch(setError("Please select all required pizza components (Base, Sauce, Cheese) that are in stock."));
            return;
        }

        dispatch(setPlacingOrder(true));
        dispatch(clearError());
        dispatch(clearSuccess());

        try {
            const orderPayload = {
                base: customization.base,
                sauce: customization.sauce,
                cheese: customization.cheese,
                veggies: customization.veggies,
                totalPrice
            };

            const createdOrder = await createOrderApi(orderPayload);
            dispatch(addOrder(createdOrder));
            dispatch(setSuccess("Order placed successfully! Check tracking in My Orders."));
            dispatch(resetCustomization());
            
            // Refresh inventory after stock reduction
            await loadInventory();
            return createdOrder;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setPlacingOrder(false));
        }
    };

    const handleGetMyOrders = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await getMyOrdersApi();
            dispatch(setMyOrders(data));
            return data;
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetAllOrders = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await getAllOrdersApi();
            dispatch(setAllOrders(data));
            return data;
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateOrderStatus = async (orderId, orderStatus) => {
        dispatch(setLoading(true));
        try {
            const updated = await updateOrderStatusApi(orderId, orderStatus);
            dispatch(updateSingleOrderStatus({ id: orderId, orderStatus: updated.orderStatus || orderStatus }));
            dispatch(setSuccess(`Order #${orderId.slice(-6)} updated to "${orderStatus}"`));
            return updated;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const clearOrderError = () => dispatch(clearError());
    const clearOrderSuccess = () => dispatch(clearSuccess());

    return {
        inventory,
        inventoryLoading,
        customization,
        selectedBaseObj,
        selectedSauceObj,
        selectedCheeseObj,
        selectedVeggieObjs,
        totalPrice,
        isCustomizationValid,
        myOrders,
        allOrders,
        loading,
        placingOrder,
        error,
        success,
        loadInventory,
        handleSelectBase,
        handleSelectSauce,
        handleSelectCheese,
        handleToggleVeggie,
        handlePlaceOrder,
        handleGetMyOrders,
        handleGetAllOrders,
        handleUpdateOrderStatus,
        clearOrderError,
        clearOrderSuccess
    };
}
