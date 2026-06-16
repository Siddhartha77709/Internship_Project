import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'seller'],
    default: 'customer'
  }
}, {
  timestamps: true
});

export const User = createModel('User', userSchema);
