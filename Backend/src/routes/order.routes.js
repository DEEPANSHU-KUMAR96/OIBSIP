import express from 'express';
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from '../controllers/order.controller.js';

import { protect, adminOnly } from '../middleware/user.middleware.js';

const router = express.Router();

// User routes -> login required
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);

router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;