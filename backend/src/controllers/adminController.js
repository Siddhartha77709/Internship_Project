import { User } from '../models/User.js';
import { Stock } from '../models/Stock.js';
import { Transaction } from '../models/Transaction.js';
import { Portfolio } from '../models/Portfolio.js';

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const [users, stocks, transactions] = await Promise.all([
      User.find({}),
      Stock.find({}),
      Transaction.find({})
    ]);

    const totalUsers = users.filter(u => u.role === 'USER').length;
    const totalStocks = stocks.length;
    const totalTrades = transactions.length;
    const totalVolume = transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);

    // Daily trade volume for the last 7 days
    const now = new Date();
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTxns = transactions.filter(t => {
        const txDate = new Date(t.createdAt).toISOString().split('T')[0];
        return txDate === dateStr;
      });
      const dayVolume = dayTxns.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
      dailyStats.push({ date: dateStr, trades: dayTxns.length, volume: +dayVolume.toFixed(2) });
    }

    // Top stocks by trade count
    const stockTrades = {};
    transactions.forEach(t => {
      if (!stockTrades[t.symbol]) stockTrades[t.symbol] = { symbol: t.symbol, name: t.stockName, count: 0, volume: 0 };
      stockTrades[t.symbol].count++;
      stockTrades[t.symbol].volume += t.totalAmount || 0;
    });
    const topStocks = Object.values(stockTrades)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(s => ({ ...s, volume: +s.volume.toFixed(2) }));

    res.json({
      totalUsers,
      totalStocks,
      totalTrades,
      totalVolume: +totalVolume.toFixed(2),
      dailyStats,
      topStocks
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin stats', error: error.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const safe = users.map(u => ({
      _id: u._id,
      username: u.username,
      email: u.email,
      role: u.role,
      balance: u.balance,
      createdAt: u.createdAt
    }));
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// GET /api/admin/transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    const sorted = transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};
