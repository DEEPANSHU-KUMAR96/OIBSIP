
import InventoryItem from '../models/inventoryItem.model.js';

// @route   GET /api/inventory
// @desc    show all active items
export const getAllItems = async (req, res) => {
  try {
    const items = await InventoryItem.find({
         isActive: true 
        });

    const grouped = {
      base: items.filter((i) => i.category === 'base'),
      sauce: items.filter((i) => i.category === 'sauce'),
      cheese: items.filter((i) => i.category === 'cheese'),
      veggie: items.filter((i) => i.category === 'veggie'),
    };

    res.status(200).json(grouped);
  } catch (error) {
    res.status(500).json({
         message: 'Server error', error: error.message 
        });
  }
};

// @route   GET /api/inventory/admin  (admin only)
// @desc    show all items
export const getAllItemsForAdmin = async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ category: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
         message: 'Server error', error: error.message
         });
  }
};

// @route   POST /api/inventory  (admin only)
// @desc    add new item
export const addItem = async (req, res) => {
  try {
    const { name, category, stock, price, lowStockThreshold } = req.body;

    if (!name || !category) {
      return res.status(400).json({
         message: 'name and category are required'
         });
    }

    const item = await InventoryItem.create({
      name,
      category,
      stock: stock || 0,
      price: price || 0,
      lowStockThreshold: lowStockThreshold || 20,
    });

    res.status(201).json(item);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({
         message: firstError 
        });
    }
    res.status(500).json({
         message: 'Server error', error: error.message 
        });
  }
};

// @route   PUT /api/inventory/:id  (admin only)
// @desc   for Stock update 
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        message: 'Item not found'
     });
    }

    item.stock = stock;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
         message: 'Server error', error: error.message
         });
  }
};

// @route   DELETE /api/inventory/:id  (admin only)
// @desc    deactivate item 
export const deleteItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
         message: 'Item not found' 
        });
    }

    item.isActive = false;
    await item.save();

    res.status(200).json({
         message: 'Item deactivated successfully' 
        });
  } catch (error) {
    res.status(500).json({ 
        message: 'Server error', error: error.message 
    });
  }
};