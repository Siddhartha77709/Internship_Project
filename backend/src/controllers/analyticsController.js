import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // 1. Get all products of the seller
    const products = await Product.find({ sellerId });
    const productIds = products.map(p => p._id.toString());
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    // 2. Get all orders
    const orders = await Order.find({});

    let totalRevenue = 0;
    let totalUnitsSold = 0;
    const productSalesMap = new Map(); // productId -> quantity sold
    const dailySalesMap = new Map(); // YYYY-MM-DD -> revenue

    // Initialize last 7 days for sales chart
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailySalesMap.set(dateString, 0);
    }

    // Process orders
    for (const order of orders) {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];

      for (const item of order.items) {
        const prodId = item.productId.toString();
        if (productIds.includes(prodId)) {
          const revenue = item.price * item.quantity;
          totalRevenue += revenue;
          totalUnitsSold += item.quantity;

          // Track per-product sales
          const prevSales = productSalesMap.get(prodId) || 0;
          productSalesMap.set(prodId, prevSales + item.quantity);

          // Track daily sales (only if within our date range)
          if (dailySalesMap.has(orderDate)) {
            const prevDailyRev = dailySalesMap.get(orderDate) || 0;
            dailySalesMap.set(orderDate, prevDailyRev + revenue);
          }
        }
      }
    }

    // Format top products
    const topProducts = [];
    productSalesMap.forEach((units, prodId) => {
      const prod = productMap.get(prodId);
      if (prod) {
        topProducts.push({
          productId: prodId,
          title: prod.title,
          price: prod.price,
          category: prod.category,
          unitsSold: units,
          revenue: units * Math.round(prod.price * (1 - prod.discount / 100))
        });
      }
    });
    topProducts.sort((a, b) => b.unitsSold - a.unitsSold);

    // Format low stock alerts
    const lowStockAlerts = products
      .filter(p => p.stock < 5)
      .map(p => ({
        productId: p._id,
        title: p.title,
        stock: p.stock
      }));

    // Format daily sales for charting
    const salesHistory = [];
    dailySalesMap.forEach((revenue, date) => {
      salesHistory.push({
        date: date.substring(5), // Keep MM-DD format for charts
        revenue
      });
    });

    res.json({
      totalRevenue,
      totalUnitsSold,
      totalActiveProducts: products.length,
      topProducts: topProducts.slice(0, 5),
      lowStockAlerts,
      salesHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error compiling analytics', error: error.message });
  }
};
