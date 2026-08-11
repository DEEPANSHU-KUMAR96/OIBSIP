import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item ka naam zaruri hai'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['base', 'sauce', 'cheese', 'veggie'],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock negative nahi ho sakta'],
    },
    lowStockThreshold: {
      type: Number,
      default: 20, // isse kam hone par admin ko email jayega
    },
    price: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const InventoryItem = mongoose.models.InventoryItem ||
mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;