import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, BarChart2, TrendingUp, DollarSign, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { mockDatabase } from '../data/mockDatabase.js';

const fmt = (n, dec = 2) => n?.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Stock form state
  const [editingStock, setEditingStock] = useState(null); // null = no edit, 'new' or {stock} for editing
  const [stockForm, setStockForm] = useState({ symbol: '', name: '', price: '', previousClose: '', high: '', low: '', volume: '', marketCap: '', sector: 'Technology', description: '' });
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');

  const authHeaders = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, stRes, uRes, tRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: authHeaders }),
        fetch('/api/stocks'),
        fetch('/api/admin/users', { headers: authHeaders }),
        fetch('/api/admin/transactions', { headers: authHeaders })
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (stRes.ok) setStocks(await stRes.json());
      if (uRes.ok) setUsers(await uRes.json());
      if (tRes.ok) setTransactions(await tRes.json());
    } catch {
      setStocks(mockDatabase.getStocks());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openNewStock = () => {
    setEditingStock('new');
    setStockForm({ symbol: '', name: '', price: '', previousClose: '', high: '', low: '', volume: '', marketCap: '', sector: 'Technology', description: '' });
    setFormMsg(''); setFormErr('');
  };

  const openEditStock = (stock) => {
    setEditingStock(stock);
    setStockForm({ symbol: stock.symbol, name: stock.name, price: stock.price, previousClose: stock.previousClose, high: stock.high, low: stock.low, volume: stock.volume, marketCap: stock.marketCap, sector: stock.sector, description: stock.description || '' });
    setFormMsg(''); setFormErr('');
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    setFormMsg(''); setFormErr('');
    const isNew = editingStock === 'new';
    const payload = {
      ...stockForm,
      price: parseFloat(stockForm.price),
      previousClose: parseFloat(stockForm.previousClose) || parseFloat(stockForm.price),
      high: parseFloat(stockForm.high) || parseFloat(stockForm.price),
      low: parseFloat(stockForm.low) || parseFloat(stockForm.price),
      volume: parseInt(stockForm.volume) || 0,
      marketCap: parseFloat(stockForm.marketCap) || 0
    };
    try {
      const res = await fetch(isNew ? '/api/stocks' : `/api/stocks/${editingStock._id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setFormMsg(isNew ? 'Stock created successfully!' : 'Stock updated successfully!');
      setEditingStock(null);
      fetchAll();
    } catch (err) { setFormErr(err.message); }
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm('Delete this stock? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/stocks/${id}`, { method: 'DELETE', headers: authHeaders });
      if (res.ok) { setFormMsg('Stock deleted.'); fetchAll(); }
      else { const d = await res.json(); setFormErr(d.message); }
    } catch { setFormErr('Delete failed.'); }
  };

  const tabs = [
    { id: 'stats', label: '📊 Overview' },
    { id: 'stocks', label: '📈 Stocks' },
    { id: 'users', label: '👥 Users' },
    { id: 'transactions', label: '📋 Transactions' }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
          🛡️ Admin <span style={{ color: '#f59e0b' }}>Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage stocks, monitor users, and review all trades.</p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap',
            color: activeTab === t.id ? '#fff' : '#6b7280',
            borderBottom: activeTab === t.id ? '2px solid #f59e0b' : '2px solid transparent',
            transition: 'var(--transition-fast)'
          }}>{t.label}</button>
        ))}
      </div>

      {loading && <div className="loader-container"><div className="spinner"></div></div>}

      {/* === OVERVIEW TAB === */}
      {activeTab === 'stats' && stats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Investors', value: stats.totalUsers, color: '#8b5cf6', icon: <Users size={20} /> },
              { label: 'Listed Stocks', value: stats.totalStocks, color: '#06b6d4', icon: <BarChart2 size={20} /> },
              { label: 'Total Trades', value: stats.totalTrades, color: '#10b981', icon: <TrendingUp size={20} /> },
              { label: 'Trade Volume', value: `$${fmt(stats.totalVolume)}`, color: '#f59e0b', icon: <DollarSign size={20} /> }
            ].map(card => (
              <div key={card.label} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: card.color }}>
                  {card.icon}
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>{card.label}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Daily Chart */}
          {stats.dailyStats?.length > 0 && (
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '20px', fontSize: '1rem', color: '#d1d5db' }}>7-Day Trade Volume</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.dailyStats}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={d => d?.slice(5)} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? Math.round(v / 1000) + 'k' : v}`} />
                  <Tooltip formatter={(v) => [`$${fmt(v)}`, 'Volume']} contentStyle={{ background: 'rgba(11,14,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="volume" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Stocks */}
          {stats.topStocks?.length > 0 && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '1rem', color: '#d1d5db' }}>Top Traded Stocks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.topStocks.map((s, i) => (
                  <div key={s.symbol} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '800', color: '#6b7280', width: '20px' }}>#{i + 1}</span>
                    <span style={{ fontWeight: '800', color: '#fff', minWidth: '60px' }}>{s.symbol}</span>
                    <span style={{ color: '#9ca3af', flex: 1, fontSize: '0.85rem' }}>{s.name}</span>
                    <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.85rem' }}>{s.count} trades</span>
                    <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem' }}>${fmt(s.volume)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === STOCKS TAB === */}
      {activeTab === 'stocks' && (
        <div>
          {(formMsg || formErr) && (
            <div style={{ marginBottom: '16px', padding: '12px 16px', background: formErr ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${formErr ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, color: formErr ? '#ef4444' : '#10b981', borderRadius: '8px', fontSize: '0.88rem' }}>
              {formMsg || formErr}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: '800', fontSize: '1.1rem' }}>Manage Stocks ({stocks.length})</h2>
            <button onClick={openNewStock} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'linear-gradient(135deg, #10b981, #0891b2)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem' }}>
              <Plus size={16} /> Add Stock
            </button>
          </div>

          {/* Inline Form */}
          {editingStock && (
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', border: '1px solid rgba(245,158,11,0.2)' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '20px', color: '#f59e0b' }}>
                {editingStock === 'new' ? '+ New Stock' : `Edit ${editingStock.symbol}`}
              </h3>
              <form onSubmit={handleStockSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  {[
                    { key: 'symbol', label: 'Symbol', placeholder: 'AAPL', disabled: editingStock !== 'new' },
                    { key: 'name', label: 'Company Name', placeholder: 'Apple Inc.' },
                    { key: 'price', label: 'Current Price ($)', placeholder: '213.50', type: 'number' },
                    { key: 'previousClose', label: 'Prev. Close ($)', placeholder: '210.00', type: 'number' },
                    { key: 'high', label: "Day's High ($)", placeholder: '215.00', type: 'number' },
                    { key: 'low', label: "Day's Low ($)", placeholder: '209.00', type: 'number' },
                    { key: 'volume', label: 'Volume', placeholder: '50000000', type: 'number' },
                    { key: 'marketCap', label: 'Market Cap ($B)', placeholder: '3280', type: 'number' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'block', marginBottom: '5px' }}>{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        className="form-input"
                        style={{ fontSize: '0.9rem' }}
                        value={stockForm[field.key]}
                        onChange={e => setStockForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        disabled={field.disabled}
                        required={['symbol', 'name', 'price'].includes(field.key)}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'block', marginBottom: '5px' }}>Sector</label>
                    <select value={stockForm.sector} onChange={e => setStockForm(p => ({ ...p, sector: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(18,24,43,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem' }}>
                      {['Technology', 'Consumer', 'Automotive', 'Semiconductors', 'Entertainment', 'Healthcare', 'Finance', 'Energy'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'block', marginBottom: '5px' }}>Description</label>
                  <textarea
                    placeholder="Company description..."
                    className="form-input"
                    rows={3}
                    style={{ resize: 'vertical', fontSize: '0.88rem' }}
                    value={stockForm.description}
                    onChange={e => setStockForm(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                    <Check size={16} /> {editingStock === 'new' ? 'Create Stock' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditingStock(null)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#9ca3af', cursor: 'pointer' }}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Symbol', 'Name', 'Price', 'Change', 'Market Cap', 'Sector', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((s, i) => {
                    const up = s.changePercent >= 0;
                    return (
                      <tr key={s._id} style={{ borderBottom: i < stocks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '14px 18px', fontWeight: '800', color: '#fff' }}>{s.symbol}</td>
                        <td style={{ padding: '14px 18px', color: '#9ca3af', fontSize: '0.88rem' }}>{s.name}</td>
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: '#fff' }}>${fmt(s.price)}</td>
                        <td style={{ padding: '14px 18px', color: up ? '#10b981' : '#ef4444', fontWeight: '600', fontSize: '0.88rem' }}>
                          {up ? '+' : ''}{s.changePercent?.toFixed(2)}%
                        </td>
                        <td style={{ padding: '14px 18px', color: '#d1d5db' }}>${s.marketCap}B</td>
                        <td style={{ padding: '14px 18px', color: '#9ca3af', fontSize: '0.82rem' }}>{s.sector}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => openEditStock(s)} style={{ padding: '6px 12px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '6px', color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => handleDeleteStock(s._id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                              <Trash2 size={12} /> Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* === USERS TAB === */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '20px' }}>All Users ({users.filter(u => u.role === 'USER').length} investors)</h2>
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['User', 'Email', 'Role', 'Balance', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 18px', fontWeight: '700', color: '#fff' }}>{u.username}</td>
                      <td style={{ padding: '14px 18px', color: '#9ca3af', fontSize: '0.88rem' }}>{u.email}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700',
                          background: u.role === 'ADMIN' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                          color: u.role === 'ADMIN' ? '#f59e0b' : '#10b981' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#10b981', fontWeight: '700' }}>
                        {u.role === 'ADMIN' ? '—' : `$${fmt(u.balance)}`}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#6b7280', fontSize: '0.82rem' }}>{fmtDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* === TRANSACTIONS TAB === */}
      {activeTab === 'transactions' && (
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '20px' }}>All Transactions ({transactions.length})</h2>
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Type', 'User', 'Stock', 'Shares', 'Price', 'Total', 'Date'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => {
                    const isBuy = t.type === 'BUY';
                    return (
                      <tr key={t._id || i} style={{ borderBottom: i < transactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', background: isBuy ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: isBuy ? '#10b981' : '#ef4444' }}>{t.type}</span>
                        </td>
                        <td style={{ padding: '14px 18px', color: '#d1d5db', fontSize: '0.88rem' }}>{t.username}</td>
                        <td style={{ padding: '14px 18px', fontWeight: '800', color: '#fff' }}>{t.symbol}</td>
                        <td style={{ padding: '14px 18px', color: '#d1d5db' }}>{t.quantity}</td>
                        <td style={{ padding: '14px 18px', color: '#d1d5db' }}>${fmt(t.price)}</td>
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: isBuy ? '#ef4444' : '#10b981' }}>${fmt(t.totalAmount)}</td>
                        <td style={{ padding: '14px 18px', color: '#6b7280', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
