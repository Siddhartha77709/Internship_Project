import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { Stock } from './models/Stock.js';
import { User } from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trades', transactionRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ShopEZ Stock Trading API is running.' });
});

// Generate 30-day historical price data
const generateHistory = (basePrice, volatility = 0.02) => {
  const history = [];
  let price = basePrice * (1 - 0.08); // Start ~8% below current
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const change = price * (Math.random() * volatility * 2 - volatility);
    price = Math.max(1, +(price + change).toFixed(2));
    history.push({ date: dateStr, price });
  }
  // Ensure last point matches current price
  history[history.length - 1].price = basePrice;
  return history;
};

const seedData = async () => {
  try {
    const stockCount = await Stock.countDocuments();
    if (stockCount === 0) {
      console.log('🌱 Seeding stocks and admin account...');

      // Create admin account
      let admin = await User.findOne({ role: 'ADMIN' });
      if (!admin) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash('admin123', salt);
        admin = await User.create({
          username: 'ShopEZ Admin',
          email: 'admin@shopez.com',
          password: hashed,
          role: 'ADMIN',
          balance: 0
        });
        console.log('👤 Created admin account: admin@shopez.com');
      }

      // Create demo investor account
      let investor = await User.findOne({ email: 'investor@shopez.com' });
      if (!investor) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash('investor123', salt);
        investor = await User.create({
          username: 'Demo Investor',
          email: 'investor@shopez.com',
          password: hashed,
          role: 'USER',
          balance: 50000
        });
        console.log('👤 Created demo investor account: investor@shopez.com');
      }

      // Seed stocks
      const stocks = [
        { symbol: 'AAPL',  name: 'Apple Inc.',           price: 213.32, previousClose: 210.15, high: 215.80, low: 209.40, volume: 54200000, marketCap: 3280, sector: 'Technology',      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. Known for the iPhone, Mac, iPad, Apple Watch, and a suite of software and services.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.',         price: 178.25, previousClose: 175.60, high: 180.00, low: 175.10, volume: 21300000, marketCap: 2200, sector: 'Technology',      description: 'Alphabet Inc. is the parent company of Google. It operates through Google Services, Google Cloud, and Other Bets. Products include Search, YouTube, Android, Maps, Gmail, Chrome, and Google Cloud Platform.' },
        { symbol: 'MSFT',  name: 'Microsoft Corp.',       price: 422.90, previousClose: 418.30, high: 425.60, low: 417.50, volume: 18900000, marketCap: 3140, sector: 'Technology',      description: 'Microsoft Corporation develops and supports software, services, devices, and solutions worldwide. Products include Windows, Azure cloud, Office 365, Xbox, LinkedIn, and GitHub.' },
        { symbol: 'AMZN',  name: 'Amazon.com Inc.',       price: 189.75, previousClose: 186.40, high: 191.20, low: 185.80, volume: 36700000, marketCap: 1980, sector: 'Consumer',        description: 'Amazon.com Inc. engages in retail and cloud services. AWS is the world\'s largest cloud platform. It also operates e-commerce, Prime Video, Alexa, Kindle, and advertising services.' },
        { symbol: 'TSLA',  name: 'Tesla Inc.',            price: 248.10, previousClose: 241.80, high: 252.40, low: 240.50, volume: 89500000, marketCap: 790,  sector: 'Automotive',      description: 'Tesla Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems. Products include Model S, 3, X, Y, Cybertruck, Powerwall, and Solar Roof.' },
        { symbol: 'NVDA',  name: 'NVIDIA Corp.',          price: 128.30, previousClose: 124.90, high: 130.80, low: 124.20, volume: 310000000, marketCap: 3150, sector: 'Semiconductors', description: 'NVIDIA Corporation is a computing infrastructure company. It designs graphics processing units (GPUs) for gaming, professional visualization, data centers, and automotive markets. Powers the AI revolution.' },
        { symbol: 'META',  name: 'Meta Platforms Inc.',   price: 549.60, previousClose: 540.20, high: 554.30, low: 539.10, volume: 14200000, marketCap: 1390, sector: 'Technology',      description: 'Meta Platforms builds apps and technologies that help people connect. Products include Facebook, Instagram, WhatsApp, Messenger, Quest VR headsets, and the Horizon metaverse platform.' },
        { symbol: 'NFLX',  name: 'Netflix Inc.',          price: 718.45, previousClose: 710.30, high: 724.60, low: 708.20, volume: 4800000,  marketCap: 308,  sector: 'Entertainment',   description: 'Netflix Inc. provides entertainment services globally. Offers TV series, films, and games across various genres. It has over 260 million paid memberships in 190+ countries.' },
        { symbol: 'AMD',   name: 'Advanced Micro Devices',price: 162.80, previousClose: 158.40, high: 165.20, low: 157.90, volume: 52000000, marketCap: 263,  sector: 'Semiconductors', description: 'AMD designs microprocessors, motherboard chipsets, embedded processors, and GPUs for computers, game consoles, and data centers. Competes with Intel and NVIDIA in CPU and GPU markets.' },
        { symbol: 'INTC',  name: 'Intel Corp.',           price: 20.75,  previousClose: 20.20,  high: 21.10,  low: 20.05,  volume: 45000000, marketCap: 88,   sector: 'Semiconductors', description: 'Intel Corporation designs and manufactures microprocessors and related chipsets for PCs, servers, and embedded systems. It is transforming into a foundry services provider while advancing AI chip technology.' }
      ];

      for (const s of stocks) {
        const change = +(s.price - s.previousClose).toFixed(2);
        const changePercent = +((change / s.previousClose) * 100).toFixed(2);
        await Stock.create({
          ...s,
          change,
          changePercent,
          historicalData: generateHistory(s.price, s.symbol === 'TSLA' ? 0.035 : 0.018)
        });
      }

      console.log(`✅ Seeded ${stocks.length} stocks successfully.`);
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
};

const startServer = async () => {
  await connectDB();
  await seedData();
  app.listen(PORT, () => {
    console.log(`🚀 ShopEZ Stock Trading API running on port ${PORT}`);
  });
};

startServer();
