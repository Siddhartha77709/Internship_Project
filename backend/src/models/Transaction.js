import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const transactionSchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  username:    { type: String, required: true },
  stockId:     { type: String, required: true },
  symbol:      { type: String, required: true, uppercase: true },
  stockName:   { type: String, required: true },
  type:        { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity:    { type: Number, required: true, min: 1 },
  price:       { type: Number, required: true }, // price per share at trade time
  totalAmount: { type: Number, required: true }  // quantity * price
}, { timestamps: true });

export const Transaction = createModel('Transaction', transactionSchema);
