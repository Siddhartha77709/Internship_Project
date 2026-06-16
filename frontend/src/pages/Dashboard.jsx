import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockDatabase } from '../data/mockDatabase.js';
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  IndianRupee,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Truck,
  TrendingUp,
  Boxes
} from 'lucide-react';

export const Dashboard = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  // Analytics states
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Products states
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    category: 'Electronics',
    image: ''
  });

  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const categories = ['Electronics', 'Wearables', 'Accessories', 'Home & Kitchen', 'Furniture'];

  // Fetch functions
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch('/api/analytics/seller', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error('API response not OK');
      }
    } catch (err) {
      console.warn('Backend offline, generating mock analytics');
      if (user) {
        const data = mockDatabase.getSellerAnalytics(user._id);
        const mockProducts = mockDatabase.getProducts().filter(p => p.sellerId === user._id);
        const topProducts = mockProducts.map(p => ({
          title: p.title,
          category: p.category,
          revenue: Math.round(p.price * (1 - p.discount / 100) * 3),
          unitsSold: 3
        })).slice(0, 3);

        setAnalytics({
          totalRevenue: data.stats.totalEarnings || topProducts.reduce((acc, p) => acc + p.revenue, 0),
          totalUnitsSold: data.stats.totalItemsSold || (topProducts.length * 3),
          totalActiveProducts: mockProducts.length,
          lowStockAlerts: mockProducts.filter(p => p.stock < 5).map(p => ({ title: p.title, stock: p.stock })),
          salesHistory: data.monthlySales,
          topProducts
        });
      }
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const userResp = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userResp.ok) {
        const userData = await userResp.json();
        const prodResp = await fetch(`/api/products?sellerId=${userData._id}`);
        if (prodResp.ok) {
          const prodData = await prodResp.json();
          setProducts(prodData);
        } else {
          throw new Error('Failed to fetch seller products');
        }
      } else {
        throw new Error('Auth token verification failed');
      }
    } catch (err) {
      console.warn('Backend offline, loading seller products from mock database');
      if (user) {
        const allProds = mockDatabase.getProducts();
        const sellerProds = allProds.filter(p => p.sellerId === user._id);
        setProducts(sellerProds);
      }
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch('/api/orders/seller', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error('API response not OK');
      }
    } catch (err) {
      console.warn('Backend offline, loading seller orders from mock database');
      if (user) {
        const data = mockDatabase.getOrders(user._id, user.role);
        setOrders(data);
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Product Form Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          discount: Number(productForm.discount || 0),
          stock: Number(productForm.stock)
        })
      });

      if (response.ok) {
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          title: '',
          description: '',
          price: '',
          discount: '',
          stock: '',
          category: 'Electronics',
          image: ''
        });
        fetchProducts();
      } else {
        throw new Error('Failed to save product in backend');
      }
    } catch (err) {
      console.warn('Backend offline, saving product listing to mock database');
      if (user) {
        const mockProductsList = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');
        if (editingProduct) {
          const idx = mockProductsList.findIndex(p => p._id === editingProduct._id);
          if (idx !== -1) {
            mockProductsList[idx] = {
              ...mockProductsList[idx],
              ...productForm,
              price: Number(productForm.price),
              discount: Number(productForm.discount || 0),
              stock: Number(productForm.stock),
              updatedAt: new Date().toISOString()
            };
          }
        } else {
          const newProd = {
            _id: "mock_product_" + Math.random().toString(36).substr(2, 9),
            ...productForm,
            price: Number(productForm.price),
            discount: Number(productForm.discount || 0),
            stock: Number(productForm.stock),
            sellerId: user._id,
            reviews: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          mockProductsList.unshift(newProd);
        }
        localStorage.setItem('shopez_mock_products', JSON.stringify(mockProductsList));
        
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          title: '',
          description: '',
          price: '',
          discount: '',
          stock: '',
          category: 'Electronics',
          image: ''
        });
        fetchProducts();
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category,
      image: product.image
    });
    setShowProductForm(true);
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          fetchProducts();
        } else {
          throw new Error('Delete failed on backend');
        }
      } catch (err) {
        console.warn('Backend offline, deleting product from mock database');
        const mockProductsList = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');
        const filtered = mockProductsList.filter(p => p._id !== productId);
        localStorage.setItem('shopez_mock_products', JSON.stringify(filtered));
        fetchProducts();
      }
    }
  };

  // Order Status Handler
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchOrders();
      } else {
        throw new Error('Fulfillment update failed on backend');
      }
    } catch (err) {
      console.warn('Backend offline, updating order status in mock database');
      const mockOrdersList = JSON.parse(localStorage.getItem('shopez_mock_orders') || '[]');
      const idx = mockOrdersList.findIndex(o => o._id === orderId);
      if (idx !== -1) {
        mockOrdersList[idx].status = newStatus;
        localStorage.setItem('shopez_mock_orders', JSON.stringify(mockOrdersList));
      }
      fetchOrders();
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px 80px 20px' }}>
      
      {/* Dashboard Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Seller Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            Manage inventory, view analytics, and fulfill customer orders in real time.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="glass-panel" style={{ display: 'flex', padding: '6px', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: activeTab === 'analytics' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'analytics' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <LayoutDashboard size={16} /> Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: activeTab === 'products' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'products' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <Package size={16} /> Inventory
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'orders' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'var(--transition-fast)'
            }}
          >
            <ListOrdered size={16} /> Orders
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div>
          {analyticsLoading ? (
            <div className="loader-container"><div className="spinner"></div></div>
          ) : analytics ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Stat Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px'
              }}>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '16px', borderRadius: '12px', color: 'var(--secondary)' }}>
                    <IndianRupee size={28} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '500' }}>Total Revenue</span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>₹{analytics.totalRevenue}</h2>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', color: 'var(--success)' }}>
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '500' }}>Units Sold</span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{analytics.totalUnitsSold}</h2>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '12px', color: 'var(--primary-hover)' }}>
                    <Boxes size={28} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '500' }}>Active Listings</span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{analytics.totalActiveProducts}</h2>
                  </div>
                </div>
              </div>

              {/* Low Stock Banners */}
              {analytics.lowStockAlerts.length > 0 && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--accent-yellow)'
                }}>
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Low Stock Warnings:</strong> {analytics.lowStockAlerts.map(p => `${p.title} (${p.stock} left)`).join(', ')}. Please update inventory.
                  </div>
                </div>
              )}

              {/* Chart & Top Products Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '30px'
              }}>
                {/* Sales Chart */}
                <div className="glass-panel" style={{ padding: '30px', background: 'rgba(18, 24, 43, 0.55)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '24px' }}>Revenue: Last 7 Days</h3>
                  <div style={{ width: '100%', height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.salesHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
                        <Tooltip contentStyle={{ background: '#111524', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Selling Products */}
                <div className="glass-panel" style={{ padding: '30px', background: 'rgba(18, 24, 43, 0.55)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '20px' }}>Top Selling Products</h3>
                  
                  {analytics.topProducts.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No items sold yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {analytics.topProducts.map((p, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '12px',
                          borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.92rem', color: '#fff' }}>{p.title}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.category}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--primary-hover)' }}>${p.revenue}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.unitsSold} units</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : null}
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGER */}
      {activeTab === 'products' && (
        <div>
          {/* Add Product Button */}
          {!showProductForm && (
            <button
              onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="btn btn-primary"
              style={{ marginBottom: '24px' }}
            >
              <Plus size={16} /> Add Product Listing
            </button>
          )}

          {/* Form Modal/Section */}
          {showProductForm && (
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', background: 'rgba(18, 24, 43, 0.8)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px' }}>
                {editingProduct ? 'Edit Product Listing' : 'Add New Product Listing'}
              </h3>
              
              <form onSubmit={handleProductSubmit} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Product Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price ($)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Discount (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inventory Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category</label>
                    <select
                      className="form-input"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c} style={{ background: '#111524' }}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Image URL (Royalty Free Unsplash recommended)</label>
                    <input
                      type="url"
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="form-input"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      required
                    />
                  </div>

                  {/* Form Actions */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Listings</button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({
                          title: '',
                          description: '',
                          price: '',
                          discount: '',
                          stock: '',
                          category: 'Electronics',
                          image: ''
                        });
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* Listings Table */}
          {productsLoading ? (
            <div className="loader-container"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
              <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3>No products listed</h3>
              <p>Create your first listing to display products in the customer catalog.</p>
            </div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '16px 24px' }}>Item Details</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Base Price</th>
                    <th style={{ padding: '16px' }}>Discount</th>
                    <th style={{ padding: '16px' }}>Stock</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.9rem', transition: 'var(--transition-fast)' }}>
                      <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={p.image} alt={p.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                        <strong style={{ color: '#fff' }}>{p.title}</strong>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className="badge badge-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>{p.category}</span>
                      </td>
                      <td style={{ padding: '16px', color: '#fff', fontWeight: '600' }}>₹{p.price}</td>
                      <td style={{ padding: '16px', color: p.discount > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                        {p.discount > 0 ? `${p.discount}%` : '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          color: p.stock < 5 ? 'var(--danger)' : '#fff',
                          fontWeight: '600'
                        }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditClick(p)}
                            style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', padding: '6px' }}
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p._id)}
                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDER FULFILLER */}
      {activeTab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div className="loader-container"><div className="spinner"></div></div>
          ) : orders.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
              <ListOrdered size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3>No orders received</h3>
              <p>When customers buy your products, they will appear here for fulfillment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((order) => (
                <div key={order._id} className="glass-panel" style={{ padding: '24px', background: 'rgba(18, 24, 43, 0.55)' }}>
                  
                  {/* Order header row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: '16px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <strong>Order ID: #{order._id}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Shipping Address summary */}
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Ship To: </span>
                      <strong>{order.shippingDetails.name}</strong> ({order.shippingDetails.address}, {order.shippingDetails.city})
                    </div>
                  </div>

                  {/* Order content row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}>
                    
                    {/* Items List */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', margin: '4px 0' }}>
                          <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>x{item.quantity}</span>
                          <span style={{ color: '#fff' }}>{item.title}</span>
                          <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Fulfill actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      borderLeft: '1px solid rgba(255,255,255,0.05)',
                      paddingLeft: '20px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fulfillment Status</span>
                        
                        {order.status === 'delivered' ? (
                          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
                            <CheckCircle size={14} /> Delivered
                          </span>
                        ) : order.status === 'shipped' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
                              <Truck size={14} /> Shipped
                            </span>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'delivered')}
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: '6px' }}
                            >
                              Deliver
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--warning)', fontSize: '0.9rem', fontWeight: '600' }}>Pending</span>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'shipped')}
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '6px', boxShadow: 'none' }}
                            >
                              Ship Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
