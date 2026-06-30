import { Stock } from '../models/Stock.js';

// GET /api/stocks — list all stocks (public)
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({});
    // Return without heavy historical data for listing
    const lite = stocks.map(s => ({
      _id: s._id,
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      previousClose: s.previousClose,
      change: s.change,
      changePercent: s.changePercent,
      high: s.high,
      low: s.low,
      volume: s.volume,
      marketCap: s.marketCap,
      sector: s.sector
    }));
    res.json(lite);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stocks', error: error.message });
  }
};

// GET /api/stocks/:id — single stock with full history (public)
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stock', error: error.message });
  }
};

// POST /api/stocks — admin creates a stock
export const createStock = async (req, res) => {
  try {
    const { symbol, name, price, previousClose, high, low, volume, marketCap, sector, description, historicalData } = req.body;
    if (!symbol || !name || !price) {
      return res.status(400).json({ message: 'Symbol, name, and price are required' });
    }

    const exists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Stock with this symbol already exists' });

    const change = +(price - (previousClose || price)).toFixed(2);
    const changePercent = previousClose ? +((change / previousClose) * 100).toFixed(2) : 0;

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name,
      price,
      previousClose: previousClose || price,
      change,
      changePercent,
      high: high || price,
      low: low || price,
      volume: volume || 0,
      marketCap: marketCap || 0,
      sector: sector || 'Technology',
      description: description || '',
      historicalData: historicalData || []
    });

    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create stock', error: error.message });
  }
};

// PUT /api/stocks/:id — admin updates a stock (price, info, etc.)
export const updateStock = async (req, res) => {
  try {
    const { price, name, high, low, volume, marketCap, sector, description } = req.body;

    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const newPrice = price !== undefined ? price : stock.price;
    const change = +(newPrice - stock.previousClose).toFixed(2);
    const changePercent = +((change / stock.previousClose) * 100).toFixed(2);

    // If price updated, add today's price to historical data
    let historicalData = stock.historicalData || [];
    if (price !== undefined && price !== stock.price) {
      const today = new Date().toISOString().split('T')[0];
      const existing = historicalData.findIndex(h => h.date === today);
      if (existing >= 0) {
        historicalData[existing] = { date: today, price: newPrice };
      } else {
        historicalData = [...historicalData, { date: today, price: newPrice }];
      }
    }

    const updated = await Stock.findByIdAndUpdate(req.params.id, {
      $set: {
        price: newPrice,
        name: name || stock.name,
        high: high !== undefined ? high : stock.high,
        low: low !== undefined ? low : stock.low,
        volume: volume !== undefined ? volume : stock.volume,
        marketCap: marketCap !== undefined ? marketCap : stock.marketCap,
        sector: sector || stock.sector,
        description: description !== undefined ? description : stock.description,
        change,
        changePercent,
        historicalData
      }
    }, { new: true });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock', error: error.message });
  }
};

// DELETE /api/stocks/:id — admin deletes a stock
export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete stock', error: error.message });
  }
};
