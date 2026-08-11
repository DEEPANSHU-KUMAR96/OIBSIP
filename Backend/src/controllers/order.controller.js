// controllers/orderController.js
import Order from '../models/order.model.js';
import InventoryItem from '../models/InventoryItem.model.js';

// @route   POST /api/orders
// @desc    make new order
export const createOrder = async (req, res) => {
    try {
        const { base, sauce, cheese, veggies, totalPrice } = req.body;

        if (!base || !sauce || !cheese || !totalPrice) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // sabhi items ko dhundo
        const baseItem = await InventoryItem.findById(base);
        const sauceItem = await InventoryItem.findById(sauce);
        const cheeseItem = await InventoryItem.findById(cheese);

        if (!baseItem || !sauceItem || !cheeseItem) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        // check the stock
        if (baseItem.stock <= 0 || sauceItem.stock <= 0 || cheeseItem.stock <= 0) {
            return res.status(400).json({
                message: 'out of the stock'
            });
        }

        // check the veggies stock 
        let veggieItems = [];
        if (veggies && veggies.length > 0) {
            veggieItems = await InventoryItem.find({
                _id: { $in: veggies }
            });
            const outOfStock = veggieItems.find((v) => v.stock <= 0);
            if (outOfStock) {
                return res.status(400).json({
                    message: `${outOfStock.name} out of stock`
                });
            }
        }

        // order create karo
        const order = await Order.create({
            user: req.user._id,
            base,
            sauce,
            cheese,
            veggies: veggies || [],
            totalPrice,
        });

        // STOCK DECREMENT 
        baseItem.stock -= 1;
        sauceItem.stock -= 1;
        cheeseItem.stock -= 1;
        await baseItem.save();
        await sauceItem.save();
        await cheeseItem.save();

        for (const veggie of veggieItems) {
            veggie.stock -= 1;
            await veggie.save();
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        });
    }
};

// @route   GET /api/orders/my-orders
// @desc    show your order
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('base sauce cheese veggies', 'name') // name of the item
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        });
    }
};

// @route   GET /api/orders  (admin only)
// @desc    show all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('base sauce cheese veggies', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        });
    }
};

// @route   PUT /api/orders/:id/status  (admin only)
// @desc    for order status update
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        });
    }
};