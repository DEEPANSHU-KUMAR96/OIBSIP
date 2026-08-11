import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // which user placed the order
      required: true,
    },

    // Pizza builder ke 4 steps
    base: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true,
    },
    sauce: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true,
    },
    cheese: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true,
    },
    veggies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryItem', // multiple veggies can be added
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
    },

    orderStatus: {
      type: String,
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
      default: 'Order Received',
    },
  },
  { timestamps: true }
);

const Order =  mongoose.model('Order', orderSchema);

export default Order