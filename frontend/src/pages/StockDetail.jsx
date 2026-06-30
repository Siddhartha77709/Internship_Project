import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, ArrowLeft, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrade } from '../context/TradeContext.jsx';
import { mockDatabase } from '../data/mockDatabase.js';

const fmt = (n, dec = 2) => n?.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(11,14,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.78rem', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: '#10b981', fontWeight: '700', fontSize: '1rem' }}>${fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const StockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, refreshBalance } = useAuth();
  const { triggerPortfolioRefresh } = useTrade();

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [tradeMsg, setTradeMsg] = useState('');
  const [tradeError, setTradeError] = useState('');
  const [trading, setTrading] = useState(false);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`/api/stocks/${id}`);
        if (res.ok) setStock(await res.json());
        else setStock(mockDatabase.getStockById(id));
      } catch {
        setStock(mockDatabase.getStockById(id));
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [id]);

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (qty < 1) { setTradeError('Quantity must be at least 1'); return; }
    setTrading(true);
    setTradeMsg('');
    setTradeError('');
    try {
      const endpoint = tradeType === 'BUY' ? '/api/trades/buy' : '/api/trades/sell';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ stockId: stock._id, quantity: Number(qty) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Trade failed');
      setTradeMsg(data.message);
      await refreshBalance();
      triggerPortfolioRefresh();
    } catch (err) {
      setTradeError(err.message);
    } finally {
      setTrading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;
  if (!stock) return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ color: '#ef4444' }}>Stock not found.</p>
      <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '16px' }}>← Back to Market</button>
    </div>
  );

  const isUp = stock.changePercent >= 0;
  const totalCost = (stock.price * qty).toFixed(2);
  const chartData = (stock.historicalData || []).map(h => ({ date: h.date?.slice(5), price: h.price }));

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      {/* Back */}
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Market
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
        {/* Left: Stock Info + Chart */}
        <div>
          {/* Header */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>{stock.symbol}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>{stock.sector}</span>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '1rem' }}>{stock.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>${fmt(stock.price)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', color: isUp ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '1rem', marginTop: '8px' }}>
                  {isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  {isUp ? '+' : ''}{fmt(stock.change)} ({isUp ? '+' : ''}{stock.changePercent?.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              {[
                { label: 'Open', value: `$${fmt(stock.previousClose)}` },
                { label: "Day's High", value: `$${fmt(stock.high)}` },
                { label: "Day's Low", value: `$${fmt(stock.low)}` },
                { label: 'Market Cap', value: `$${stock.marketCap}B` }
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontWeight: '700', color: '#e5e7eb' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Chart */}
          {chartData.length > 0 && (
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '20px', fontSize: '1rem', color: '#d1d5db' }}>30-Day Price History</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="price" stroke={isUp ? '#10b981' : '#ef4444'} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: isUp ? '#10b981' : '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Description */}
          {stock.description && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '0.95rem', color: '#9ca3af' }}>About {stock.name}</h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '0.9rem' }}>{stock.description}</p>
            </div>
          )}
        </div>

        {/* Right: Trade Panel */}
        <div>
          <div className="glass-panel" style={{ padding: '28px', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '20px', fontSize: '1.1rem' }}>Execute Trade</h3>

            {!user ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <AlertCircle size={32} style={{ color: '#6b7280', marginBottom: '12px' }} />
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '16px' }}>Sign in to trade {stock.symbol}</p>
                <button onClick={() => navigate('/auth')} className="btn btn-primary" style={{ width: '100%' }}>Sign In to Trade</button>
              </div>
            ) : user.role === 'ADMIN' ? (
              <p style={{ color: '#6b7280', fontSize: '0.88rem', textAlign: 'center', padding: '16px 0' }}>Admin accounts cannot execute trades.</p>
            ) : (
              <form onSubmit={handleTrade} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Buy / Sell toggle */}
                <div style={{ display: 'flex', gap: '0', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', overflow: 'hidden' }}>
                  {['BUY', 'SELL'].map(t => (
                    <button key={t} type="button" onClick={() => { setTradeType(t); setTradeMsg(''); setTradeError(''); }} style={{
                      flex: 1, padding: '11px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', transition: 'var(--transition-fast)',
                      background: tradeType === t ? (t === 'BUY' ? '#10b981' : '#ef4444') : 'transparent',
                      color: tradeType === t ? '#fff' : '#6b7280'
                    }}>{t}</button>
                  ))}
                </div>

                {/* Available balance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#6b7280' }}>Available Balance</span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>
                    ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Quantity */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#d1d5db', display: 'block', marginBottom: '6px' }}>Quantity (shares)</label>
                  <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-input" style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: '700' }} />
                </div>

                {/* Cost summary */}
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>
                    <span>Price per share</span><span style={{ color: '#fff' }}>${fmt(stock.price)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>
                    <span>Shares</span><span style={{ color: '#fff' }}>× {qty}</span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#fff' }}>
                    <span>Total {tradeType === 'BUY' ? 'Cost' : 'Proceeds'}</span>
                    <span style={{ color: tradeType === 'BUY' ? '#ef4444' : '#10b981' }}>${totalCost}</span>
                  </div>
                </div>

                {tradeMsg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>{tradeMsg}</div>}
                {tradeError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>{tradeError}</div>}

                <button type="submit" disabled={trading} style={{
                  padding: '14px', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer',
                  background: tradeType === 'BUY' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#fff', transition: 'var(--transition-fast)', opacity: trading ? 0.7 : 1
                }}>
                  {trading ? 'Processing...' : `${tradeType} ${qty} Share${qty > 1 ? 's' : ''}`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
