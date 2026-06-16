import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export const createOrder = async (req, res) => {
  const { items, shippingDetails } = req.body;

  try {
    if (!items || items.length === 0 || !shippingDetails) {
      return res.status(400).json({ message: 'Items and shipping details are required' });
    }

    // Verify stock and calculate totals
    let totalAmount = 0;
    const itemsToSave = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.title || item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.title}` });
      }

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();

      const itemPrice = Math.round(product.price * (1 - product.discount / 100));
      totalAmount += itemPrice * item.quantity;
      
      itemsToSave.push({
        productId: product._id,
        title: product.title,
        price: itemPrice,
        quantity: item.quantity
      });
    }

    const order = await Order.create({
      customerId: req.user.id,
      items: itemsToSave,
      totalAmount,
      shippingDetails,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error processing order', error: error.message });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id });
    // Sort manually if mock sort isn't implemented fully
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders', error: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    // 1. Get all products owned by this seller
    const sellerProducts = await Product.find({ sellerId: req.user.id });
    const productIds = sellerProducts.map(p => p._id.toString());

    // 2. Find all orders containing any of those product IDs
    const allOrders = await Order.find({});
    
    // Filter orders that contain at least one of the seller's products
    const sellerOrders = allOrders.filter(order => {
      return order.items.some(item => productIds.includes(item.productId.toString()));
    });

    // Format orders so the seller only sees their items or knows which items belong to them
    // (We will return full orders for dashboard simplicity, but filter the visual representation on the frontend)
    sellerOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(sellerOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (!['pending', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status type' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
