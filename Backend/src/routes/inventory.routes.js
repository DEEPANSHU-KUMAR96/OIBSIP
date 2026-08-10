import express from 'express';
import {
    getAllItems,
    getAllItemsForAdmin,
    addItem,
    updateStock,
    deleteItem,
} from '../controllers/inventoryController.js';

import { adminOnly, protect } from '../middleware/user.middleware.js';

const router = express.Router();


router.get('/', getAllItems);

// Admin only routes
router.get('/admin', protect, adminOnly, getAllItemsForAdmin);

router.post('/', protect, adminOnly, addItem);

router.put('/:id', protect, adminOnly, updateStock);

router.delete('/:id', protect, adminOnly, deleteItem);


export default router;