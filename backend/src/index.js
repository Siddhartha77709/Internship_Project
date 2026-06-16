import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'ShopEZ E-Commerce API is running smoothly.' });
});

// Seed data function
const seedData = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Database is empty. Seeding initial products...');
      
      // 1. Create a dummy seller if none exists
      let seller = await User.findOne({ role: 'seller' });
      if (!seller) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('seller123', salt);
        seller = await User.create({
          username: 'ShopEZ Official',
          email: 'seller@shopez.com',
          password: hashedPassword,
          role: 'seller'
        });
        console.log('👤 Created official seller account (seller@shopez.com / seller123)');
      }

      // 2. Seed products
      const sampleProducts = [
        {
          title: 'ShopEZ UltraBook Pro 15',
          description: 'High performance laptop with 16GB RAM, 512GB SSD, Intel i7 processor, and a brilliant 15.6-inch borderless IPS display. Perfect for productivity and lightweight gaming.',
          price: 999,
          discount: 10,
          stock: 12,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=600&auto=format&fit=crop&q=80',
          sellerId: seller._id.toString(),
          reviews: [
            { username: 'AlexD', rating: 5, comment: 'Amazing performance, highly recommended!' },
            { username: 'SarahK', rating: 4, comment: 'Great screen and battery life, slightly heavy.' }
          ]
        },
        {
          title: 'AeroSound Wireless Headphones',
          description: 'Premium active noise-cancelling headphones featuring high-fidelity sound, 40 hours of battery life, cushiony memory foam earcups, and seamless Bluetooth 5.2 connectivity.',
          price: 199,
          discount: 15,
          stock: 25,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          sellerId: seller._id.toString(),
          reviews: [
            { username: 'MusicLover', rating: 5, comment: 'Active noise cancellation is outstanding.' }
          ]
        },
        {
          title: 'Chronos Fit Smartwatch',
          description: 'An elegant smartwatch with heart rate monitoring, sleep tracker, built-in GPS, 14 sports modes, and a vivid 1.4-inch AMOLED touch screen. Water-resistant up to 50 meters.',
          price: 149,
          discount: 20,
          stock: 3, // Low stock to trigger seller alert
          category: 'Wearables',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          sellerId: seller._id.toString(),
          reviews: [
            { username: 'Runner99', rating: 4, comment: 'GPS is accurate. Interface is lag-free.' }
          ]
        },
        {
          title: 'Voyager Anti-Theft Backpack',
          description: 'Water-resistant, durable travel backpack with hidden security pockets, a built-in USB charging port, and a padded sleeve that fits up to 15.6-inch laptops securely.',
          price: 79,
          discount: 25,
          stock: 45,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
          sellerId: seller._id.toString(),
          reviews: []
        },
        {
          title: 'HydroMax Ergonomic Flask',
          description: 'Double-walled vacuum insulated stainless steel water bottle. Keeps beverages ice-cold for 24 hours or piping hot for 12 hours. Features a leak-proof straw lid.',
          price: 29,
          discount: 0,
          stock: 50,
          category: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
          sellerId: seller._id.toString(),
          reviews: [
            { username: 'HealthyLife', rating: 5, comment: 'Best water bottle I have ever owned!' }
          ]
        },
        {
          title: 'FlexGrip Executive Office Chair',
          description: 'Ergonomic high-back office chair with 3D adjustable armrests, lumbar support, breathable mesh material, and smooth-rolling castors. Designed for 8+ hours of comfortable sitting.',
          price: 249,
          discount: 5,
          stock: 4, // Low stock to trigger alert
          category: 'Furniture',
          image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
          sellerId: seller._id.toString(),
          reviews: []
        }
      ];

      for (const p of sampleProducts) {
        await Product.create(p);
      }
      console.log('✅ Seeded 6 sample products successfully.');
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  await seedData();
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
};

startServer();
