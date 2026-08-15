import express from 'express';
import {
    createOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from '../controllers/order.controller.js';

import { protect, adminOnly } from '../middleware/user.middleware.js';

const router = express.Router();

// User routes -> login required
router.post('/', protect, createOrder);
router.post('/create-payment-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyRazorpayPayment);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;