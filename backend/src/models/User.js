import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  balance:  { type: Number, default: 50000 } // Virtual balance in USD
}, { timestamps: true });

export const User = createModel('User', userSchema);
