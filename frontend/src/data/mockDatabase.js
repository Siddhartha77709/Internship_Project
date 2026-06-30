// Local mock database fallback for when the backend is offline
// Provides stock trading data for frontend-only environments

const MOCK_STOCKS = [
  { _id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', price: 213.32, previousClose: 210.15, change: 3.17, changePercent: 1.51, high: 215.80, low: 209.40, volume: 54200000, marketCap: 3280, sector: 'Technology', description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.', historicalData: genHistory(213.32, 0.018) },
  { _id: 'googl', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.25, previousClose: 175.60, change: 2.65, changePercent: 1.51, high: 180.00, low: 175.10, volume: 21300000, marketCap: 2200, sector: 'Technology', description: 'Alphabet Inc. is the parent company of Google.', historicalData: genHistory(178.25, 0.018) },
  { _id: 'msft', symbol: 'MSFT', name: 'Microsoft Corp.', price: 422.90, previousClose: 418.30, change: 4.60, changePercent: 1.10, high: 425.60, low: 417.50, volume: 18900000, marketCap: 3140, sector: 'Technology', description: 'Microsoft Corporation develops software, services, devices, and solutions worldwide.', historicalData: genHistory(422.90, 0.015) },
  { _id: 'amzn', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 189.75, previousClose: 186.40, change: 3.35, changePercent: 1.80, high: 191.20, low: 185.80, volume: 36700000, marketCap: 1980, sector: 'Consumer', description: 'Amazon.com engages in retail and cloud services. AWS is the world\'s largest cloud platform.', historicalData: genHistory(189.75, 0.020) },
  { _id: 'tsla', symbol: 'TSLA', name: 'Tesla Inc.', price: 248.10, previousClose: 241.80, change: 6.30, changePercent: 2.61, high: 252.40, low: 240.50, volume: 89500000, marketCap: 790, sector: 'Automotive', description: 'Tesla Inc. designs, develops, and sells electric vehicles and energy storage systems.', historicalData: genHistory(248.10, 0.035) },
  { _id: 'nvda', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 128.30, previousClose: 124.90, change: 3.40, changePercent: 2.72, high: 130.80, low: 124.20, volume: 310000000, marketCap: 3150, sector: 'Semiconductors', description: 'NVIDIA designs GPUs for gaming, professional visualization, data centers, and automotive markets.', historicalData: genHistory(128.30, 0.025) },
  { _id: 'meta', symbol: 'META', name: 'Meta Platforms Inc.', price: 549.60, previousClose: 540.20, change: 9.40, changePercent: 1.74, high: 554.30, low: 539.10, volume: 14200000, marketCap: 1390, sector: 'Technology', description: 'Meta builds apps and technologies including Facebook, Instagram, and WhatsApp.', historicalData: genHistory(549.60, 0.018) },
  { _id: 'nflx', symbol: 'NFLX', name: 'Netflix Inc.', price: 718.45, previousClose: 710.30, change: 8.15, changePercent: 1.15, high: 724.60, low: 708.20, volume: 4800000, marketCap: 308, sector: 'Entertainment', description: 'Netflix provides streaming entertainment services in 190+ countries.', historicalData: genHistory(718.45, 0.020) },
  { _id: 'amd', symbol: 'AMD', name: 'Advanced Micro Devices', price: 162.80, previousClose: 158.40, change: 4.40, changePercent: 2.78, high: 165.20, low: 157.90, volume: 52000000, marketCap: 263, sector: 'Semiconductors', description: 'AMD designs microprocessors and GPUs for computers, game consoles, and data centers.', historicalData: genHistory(162.80, 0.022) },
  { _id: 'intc', symbol: 'INTC', name: 'Intel Corp.', price: 20.75, previousClose: 20.20, change: 0.55, changePercent: 2.72, high: 21.10, low: 20.05, volume: 45000000, marketCap: 88, sector: 'Semiconductors', description: 'Intel designs and manufactures microprocessors and chipsets for PCs, servers, and embedded systems.', historicalData: genHistory(20.75, 0.020) }
];

function genHistory(basePrice, volatility = 0.018) {
  const history = [];
  let price = basePrice * 0.92;
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const change = price * (Math.random() * volatility * 2 - volatility);
    price = Math.max(1, parseFloat((price + change).toFixed(2)));
    history.push({ date: dateStr, price });
  }
  history[history.length - 1] = { date: history[history.length - 1].date, price: basePrice };
  return history;
}

// Simple in-memory store for mock mode
let mockUsers = [
  { _id: 'admin001', username: 'ShopEZ Admin', email: 'admin@shopez.com', password: 'admin123', role: 'ADMIN', balance: 0, createdAt: new Date().toISOString() },
  { _id: 'investor001', username: 'Demo Investor', email: 'investor@shopez.com', password: 'investor123', role: 'USER', balance: 50000, createdAt: new Date().toISOString() }
];

let mockPortfolios = {};
let mockTransactions = [];
let mockTokens = {};

export const mockDatabase = {
  getStocks() {
    return MOCK_STOCKS;
  },

  getStockById(id) {
    return MOCK_STOCKS.find(s => s._id === id || s.symbol === id?.toUpperCase()) || null;
  },

  login(email, password) {
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email');
    if (user.password !== password) throw new Error('Invalid credentials');
    const token = `mock_${user._id}_${Date.now()}`;
    mockTokens[token] = user._id;
    return { _id: user._id, username: user.username, email: user.email, role: user.role, balance: user.balance, token };
  },

  register(username, email, password, role) {
    const exists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('An account already exists with this email');
    const newUser = {
      _id: `user_${Date.now()}`,
      username,
      email,
      password,
      role: 'USER', // always USER in mock
      balance: 50000,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    const token = `mock_${newUser._id}_${Date.now()}`;
    mockTokens[token] = newUser._id;
    return { _id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role, balance: newUser.balance, token };
  },

  verifyToken(token) {
    const userId = mockTokens[token];
    if (!userId) return null;
    const user = mockUsers.find(u => u._id === userId);
    if (!user) return null;
    return { _id: user._id, username: user.username, email: user.email, role: user.role, balance: user.balance };
  },

  getPortfolio(userId) {
    if (!userId) return { holdings: [], totalInvested: 0, totalCurrentValue: 0, totalPnL: 0, totalPnLPercent: 0, balance: 0 };
    const user = mockUsers.find(u => u._id === userId);
    const portfolio = mockPortfolios[userId] || { holdings: [] };
    const enriched = portfolio.holdings.map(h => {
      const stock = MOCK_STOCKS.find(s => s.symbol === h.symbol);
      const currentPrice = stock ? stock.price : h.avgBuyPrice;
      const invested = parseFloat((h.avgBuyPrice * h.quantity).toFixed(2));
      const currentValue = parseFloat((currentPrice * h.quantity).toFixed(2));
      const pnl = parseFloat((currentValue - invested).toFixed(2));
      const pnlPercent = parseFloat(((pnl / invested) * 100).toFixed(2));
      return { ...h, currentPrice, invested, currentValue, pnl, pnlPercent };
    });
    const totalInvested = enriched.reduce((s, h) => s + h.invested, 0);
    const totalCurrentValue = enriched.reduce((s, h) => s + h.currentValue, 0);
    const totalPnL = parseFloat((totalCurrentValue - totalInvested).toFixed(2));
    const totalPnLPercent = totalInvested > 0 ? parseFloat(((totalPnL / totalInvested) * 100).toFixed(2)) : 0;
    return { holdings: enriched, totalInvested, totalCurrentValue, totalPnL, totalPnLPercent, balance: user ? user.balance : 0 };
  },

  getTradeHistory(userId) {
    if (!userId) return [];
    return mockTransactions.filter(t => t.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};
