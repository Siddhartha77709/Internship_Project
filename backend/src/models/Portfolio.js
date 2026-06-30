import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const holdingSchema = new mongoose.Schema({
  stockId:      { type: String, required: true },
  symbol:       { type: String, required: true, uppercase: true },
  name:         { type: String, required: true },
  quantity:     { type: Number, required: true, min: 0 },
  avgBuyPrice:  { type: Number, required: true }
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  userId:   { type: String, required: true, unique: true },
  holdings: [holdingSchema]
}, { timestamps: true });

export const Portfolio = createModel('Portfolio', portfolioSchema);
