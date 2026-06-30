import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, BarChart2, RefreshCw } from 'lucide-react';
import { mockDatabase } from '../data/mockDatabase.js';

const fmt = (n) => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [sortBy, setSortBy] = useState('marketCap');

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stocks');
      if (res.ok) {
        const data = await res.json();
        setStocks(data);
      } else {
        setStocks(mockDatabase.getStocks());
      }
    } catch {
      setStocks(mockDatabase.getStocks());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStocks(); }, []);

  const sectors = ['All', ...new Set(stocks.map(s => s.sector).filter(Boolean))];

  const filtered = stocks
    .filter(s => {
      const q = search.toLowerCase();
      return (s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    })
    .filter(s => sector === 'All' || s.sector === sector)
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'change') return b.changePercent - a.changePercent;
      if (sortBy === 'volume') return b.volume - a.volume;
      return b.marketCap - a.marketCap; // default
    });

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
          📈 Live <span style={{ color: '#10b981' }}>Market</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Browse stocks, track price trends, and execute simulated trades.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6b7280' }} />
          <input
            type="text"
            placeholder="Search symbol or company..."
            className="form-input"
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sector}
          onChange={e => setSector(e.target.value)}
          style={{ background: 'rgba(18,24,43,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ background: 'rgba(18,24,43,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <option value="marketCap">Sort: Market Cap</option>
          <option value="price">Sort: Price</option>
          <option value="change">Sort: % Change</option>
          <option value="volume">Sort: Volume</option>
        </select>

        <button onClick={fetchStocks} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Market Stats Banner */}
      {stocks.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { label: 'Listed Stocks', value: stocks.length, color: '#fff' },
            { label: 'Gainers', value: stocks.filter(s => s.changePercent >= 0).length, color: '#10b981' },
            { label: 'Decliners', value: stocks.filter(s => s.changePercent < 0).length, color: '#ef4444' },
            { label: 'Avg Change', value: `${(stocks.reduce((s, t) => s + t.changePercent, 0) / stocks.length).toFixed(2)}%`, color: '#f59e0b' }
          ].map(stat => (
            <div key={stat.label} className="glass-panel" style={{ padding: '16px 24px', flex: '1', minWidth: '120px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Stocks Grid */}
      {loading ? (
        <div className="loader-container"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <BarChart2 size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>No stocks match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map(stock => {
            const isUp = stock.changePercent >= 0;
            return (
              <Link key={stock._id} to={`/stock/${stock._id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-panel" style={{
                  padding: '22px', cursor: 'pointer', transition: 'var(--transition-smooth)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  ':hover': { borderColor: '#10b981' }
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = isUp ? '#10b981' : '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          background: isUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: isUp ? '#10b981' : '#ef4444',
                          fontWeight: '800', fontSize: '1.1rem', padding: '2px 8px', borderRadius: '6px', letterSpacing: '0.5px'
                        }}>{stock.symbol}</span>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                          {stock.sector}
                        </span>
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{stock.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>${fmt(stock.price)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', color: isUp ? '#10b981' : '#ef4444', fontSize: '0.88rem', fontWeight: '600', marginTop: '4px' }}>
                        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isUp ? '+' : ''}{fmt(stock.change)} ({isUp ? '+' : ''}{stock.changePercent?.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
                    {[
                      { label: 'High', value: `$${fmt(stock.high)}` },
                      { label: 'Low', value: `$${fmt(stock.low)}` },
                      { label: 'Mkt Cap', value: `$${stock.marketCap}B` }
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{item.label}</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#d1d5db', marginTop: '2px' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Market;
