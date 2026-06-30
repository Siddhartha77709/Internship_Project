import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const historicalDataSchema = new mongoose.Schema({
  date:  { type: String, required: true }, // 'YYYY-MM-DD'
  price: { type: Number, required: true }
}, { _id: false });

const stockSchema = new mongoose.Schema({
  symbol:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  name:          { type: String, required: true, trim: true },
  price:         { type: Number, required: true },
  previousClose: { type: Number, required: true },
  change:        { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  high:          { type: Number, required: true },
  low:           { type: Number, required: true },
  volume:        { type: Number, default: 0 },
  marketCap:     { type: Number, default: 0 }, // in billions
  sector:        { type: String, default: 'Technology' },
  description:   { type: String, default: '' },
  historicalData: [historicalDataSchema]
}, { timestamps: true });

export const Stock = createModel('Stock', stockSchema);
