import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const shippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingDetails: shippingSchema,
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Order = createModel('Order', orderSchema);
export default Order;
