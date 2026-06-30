import { Portfolio } from '../models/Portfolio.js';
import { Stock } from '../models/Stock.js';
import { User } from '../models/User.js';

// GET /api/portfolio — user's full portfolio with live P&L
export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const [portfolio, user] = await Promise.all([
      Portfolio.findOne({ userId }),
      User.findById(userId)
    ]);

    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
      return res.json({
        holdings: [],
        totalInvested: 0,
        totalCurrentValue: 0,
        totalPnL: 0,
        totalPnLPercent: 0,
        balance: user ? user.balance : 0
      });
    }

    // Fetch current prices for all held stocks
    const stocks = await Stock.find({});
    const priceMap = {};
    stocks.forEach(s => {
      priceMap[s.symbol] = s.price;
      priceMap[s._id.toString()] = s.price;
    });

    let totalInvested = 0;
    let totalCurrentValue = 0;

    const enrichedHoldings = portfolio.holdings
      .filter(h => h.quantity > 0)
      .map(h => {
        const currentPrice = priceMap[h.symbol] || priceMap[h.stockId] || h.avgBuyPrice;
        const invested = +(h.avgBuyPrice * h.quantity).toFixed(2);
        const currentValue = +(currentPrice * h.quantity).toFixed(2);
        const pnl = +(currentValue - invested).toFixed(2);
        const pnlPercent = +((pnl / invested) * 100).toFixed(2);

        totalInvested += invested;
        totalCurrentValue += currentValue;

        return {
          stockId: h.stockId,
          symbol: h.symbol,
          name: h.name,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice,
          currentPrice,
          invested,
          currentValue,
          pnl,
          pnlPercent
        };
      });

    const totalPnL = +(totalCurrentValue - totalInvested).toFixed(2);
    const totalPnLPercent = totalInvested > 0 ? +((totalPnL / totalInvested) * 100).toFixed(2) : 0;

    res.json({
      holdings: enrichedHoldings,
      totalInvested: +totalInvested.toFixed(2),
      totalCurrentValue: +totalCurrentValue.toFixed(2),
      totalPnL,
      totalPnLPercent,
      balance: user ? user.balance : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio', error: error.message });
  }
};
