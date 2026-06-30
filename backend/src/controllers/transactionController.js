import { Stock } from '../models/Stock.js';
import { Transaction } from '../models/Transaction.js';
import { Portfolio } from '../models/Portfolio.js';
import { User } from '../models/User.js';

// POST /api/trades/buy  (USER role only — enforced at router level)
export const buyStock = async (req, res) => {
  const { stockId, quantity } = req.body;
  const userId = req.user.id;

  if (!stockId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'stockId and quantity (≥1) are required' });
  }

  let user = null;
  const originalBalance = null;

  try {
    const [stock, foundUser] = await Promise.all([
      Stock.findById(stockId),
      User.findById(userId)
    ]);

    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    if (!foundUser) return res.status(404).json({ message: 'User not found' });
    user = foundUser;

    const totalCost = +(stock.price * quantity).toFixed(2);
    if (user.balance < totalCost) {
      return res.status(400).json({
        message: `Insufficient balance. Need $${totalCost.toFixed(2)}, have $${user.balance.toFixed(2)}`
      });
    }

    // 1. Deduct balance first (snapshot original for rollback)
    const balanceBefore = user.balance;
    user.balance = +(user.balance - totalCost).toFixed(2);
    await user.save();

    try {
      // 2. Update portfolio
      let portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) {
        portfolio = await Portfolio.create({ userId, holdings: [] });
      }

      const holdings = [...(portfolio.holdings || [])];
      const idx = holdings.findIndex(h => h.stockId === stockId || h.symbol === stock.symbol);

      if (idx >= 0) {
        const existing = holdings[idx];
        const totalQty = existing.quantity + quantity;
        const newAvg = +((existing.avgBuyPrice * existing.quantity + stock.price * quantity) / totalQty).toFixed(4);
        holdings[idx] = { ...existing, quantity: totalQty, avgBuyPrice: newAvg };
      } else {
        holdings.push({
          stockId: stock._id.toString(),
          symbol: stock.symbol,
          name: stock.name,
          quantity,
          avgBuyPrice: stock.price
        });
      }

      await Portfolio.findByIdAndUpdate(portfolio._id, { $set: { holdings } });

      // 3. Record transaction
      const transaction = await Transaction.create({
        userId,
        username: user.username,
        stockId: stock._id.toString(),
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'BUY',
        quantity,
        price: stock.price,
        totalAmount: totalCost
      });

      return res.status(201).json({
        message: `Successfully bought ${quantity} share(s) of ${stock.symbol}`,
        transaction,
        newBalance: user.balance
      });

    } catch (innerErr) {
      // Rollback balance if portfolio/transaction writes failed
      try {
        user.balance = balanceBefore;
        await user.save();
      } catch (_) {}
      throw innerErr;
    }

  } catch (error) {
    res.status(500).json({ message: 'Trade failed', error: error.message });
  }
};

// POST /api/trades/sell  (USER role only — enforced at router level)
export const sellStock = async (req, res) => {
  const { stockId, quantity } = req.body;
  const userId = req.user.id;

  if (!stockId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'stockId and quantity (≥1) are required' });
  }

  try {
    const [stock, user, portfolio] = await Promise.all([
      Stock.findById(stockId),
      User.findById(userId),
      Portfolio.findOne({ userId })
    ]);

    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!portfolio) return res.status(400).json({ message: 'No portfolio found. You do not own any stocks.' });

    const holdings = [...(portfolio.holdings || [])];
    const holdingIdx = holdings.findIndex(h => h.stockId === stockId || h.symbol === stock.symbol);

    if (holdingIdx < 0 || holdings[holdingIdx].quantity < quantity) {
      const owned = holdingIdx >= 0 ? holdings[holdingIdx].quantity : 0;
      return res.status(400).json({
        message: `Insufficient shares. You own ${owned} share(s) of ${stock.symbol}`
      });
    }

    const proceeds = +(stock.price * quantity).toFixed(2);
    const balanceBefore = user.balance;

    // 1. Credit balance
    user.balance = +(user.balance + proceeds).toFixed(2);
    await user.save();

    try {
      // 2. Update holdings
      holdings[holdingIdx] = {
        ...holdings[holdingIdx],
        quantity: holdings[holdingIdx].quantity - quantity
      };
      const filteredHoldings = holdings.filter(h => h.quantity > 0);
      await Portfolio.findByIdAndUpdate(portfolio._id, { $set: { holdings: filteredHoldings } });

      // 3. Record transaction
      const transaction = await Transaction.create({
        userId,
        username: user.username,
        stockId: stock._id.toString(),
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'SELL',
        quantity,
        price: stock.price,
        totalAmount: proceeds
      });

      return res.status(201).json({
        message: `Successfully sold ${quantity} share(s) of ${stock.symbol}`,
        transaction,
        newBalance: user.balance
      });

    } catch (innerErr) {
      // Rollback balance if portfolio/transaction writes failed
      try {
        user.balance = balanceBefore;
        await user.save();
      } catch (_) {}
      throw innerErr;
    }

  } catch (error) {
    res.status(500).json({ message: 'Trade failed', error: error.message });
  }
};

// GET /api/trades/history — authenticated user's own trade history
export const getTradeHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId });
    const sorted = transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trade history', error: error.message });
  }
};
