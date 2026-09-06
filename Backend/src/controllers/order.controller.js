// controllers/orderController.js
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/order.model.js';
import InventoryItem from '../models/InventoryItem.model.js';
import { config } from '../config/config.js';

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET,
});

const validateOrderIngredients = async ({ base, sauce, cheese, veggies }) => {
    const baseItem = await InventoryItem.findById(base);
    const sauceItem = await InventoryItem.findById(sauce);
    const cheeseItem = await InventoryItem.findById(cheese);

    if (!baseItem || !sauceItem || !cheeseItem) {
        throw new Error('One or more selected ingredients were not found.');
    }

    if (baseItem.stock <= 0 || sauceItem.stock <= 0 || cheeseItem.stock <= 0) {
        throw new Error('One or more required ingredients are out of stock.');
    }

    let veggieItems = [];
    if (veggies && veggies.length > 0) {
        veggieItems = await InventoryItem.find({ _id: { $in: veggies } });

        const outOfStockItem = veggieItems.find((item) => item.stock <= 0);
        if (outOfStockItem) {
            throw new Error(`${outOfStockItem.name} is out of stock.`);
        }
    }

    return { baseItem, sauceItem, cheeseItem, veggieItems };
};

const decrementInventoryStock = async ({ baseItem, sauceItem, cheeseItem, veggieItems }) => {
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
};

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

        const { baseItem, sauceItem, cheeseItem, veggieItems } = await validateOrderIngredients({
            base,
            sauce,
            cheese,
            veggies,
        });

        const order = await Order.create({
            user: req.user._id,
            base,
            sauce,
            cheese,
            veggies: veggies || [],
            totalPrice,
            paymentStatus: 'paid',
        });

        await decrementInventoryStock({ baseItem, sauceItem, cheeseItem, veggieItems });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        });
    }
};

// @route   POST /api/orders/create-payment-order
// @desc    create Razorpay order and persist a pending order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { base, sauce, cheese, veggies, totalPrice } = req.body;

        if (!base || !sauce || !cheese || !totalPrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await validateOrderIngredients({ base, sauce, cheese, veggies });

        const order = await Order.create({
            user: req.user._id,
            base,
            sauce,
            cheese,
            veggies: veggies || [],
            totalPrice,
            paymentStatus: 'pending',
            orderStatus: 'Order Received',
        });

        const amountInPaise = Math.round(Number(totalPrice) * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `pizza_${order._id.toString()}`,
            notes: {
                orderId: order._id.toString(),
                userId: req.user._id.toString(),
            },
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(200).json({
            message: 'Razorpay order created successfully',
            order,
            razorpayOrder,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Unable to create Razorpay order',
        });
    }
};

// @route   POST /api/orders/verify-payment
// @desc    verify Razorpay payment signature and finalize the order
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({
                message: 'Missing payment verification data',
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.paymentStatus === 'paid') {
            return res.status(200).json({
                message: 'Payment already verified',
                order,
            });
        }

        const generatedSignature = crypto
            .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        if (generatedSignature !== razorpaySignature) {
            order.paymentStatus = 'failed';
            await order.save();

            return res.status(400).json({
                message: 'Payment verification failed. Signature mismatch.',
                order,
            });
        }

        const baseItem = await InventoryItem.findById(order.base);
        const sauceItem = await InventoryItem.findById(order.sauce);
        const cheeseItem = await InventoryItem.findById(order.cheese);
        const veggieItems = await InventoryItem.find({ _id: { $in: order.veggies || [] } });

        if (!baseItem || !sauceItem || !cheeseItem) {
            order.paymentStatus = 'failed';
            await order.save();
            return res.status(400).json({ message: 'Order ingredients are no longer available' });
        }

        if (baseItem.stock <= 0 || sauceItem.stock <= 0 || cheeseItem.stock <= 0) {
            order.paymentStatus = 'failed';
            await order.save();
            return res.status(400).json({ message: 'Selected items are out of stock' });
        }

        const outOfStockVeggie = veggieItems.find((item) => item.stock <= 0);
        if (outOfStockVeggie) {
            order.paymentStatus = 'failed';
            await order.save();
            return res.status(400).json({ message: `${outOfStockVeggie.name} is out of stock` });
        }

        order.paymentStatus = 'paid';
        order.razorpayOrderId = razorpayOrderId;
        order.orderStatus = 'Order Received';
        await order.save();

        await decrementInventoryStock({
            baseItem,
            sauceItem,
            cheeseItem,
            veggieItems,
        });

        return res.status(200).json({
            message: 'Razorpay payment verified and order confirmed',
            order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Unable to verify payment',
        });
    }
};

// @route   GET /api/orders/my-orders
// @desc    show your order
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('base sauce cheese veggies', 'name')
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