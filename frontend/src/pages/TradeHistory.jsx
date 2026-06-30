import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrade } from '../context/TradeContext.jsx';
import { mockDatabase } from '../data/mockDatabase.js';

const fmt = (n) => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const TradeHistory = () => {
  const { token } = useAuth();
  const { portfolioRefreshTick } = useTrade();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/trades/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setTrades(await res.json());
        else setTrades(mockDatabase.getTradeHistory());
      } catch {
        setTrades(mockDatabase.getTradeHistory());
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchHistory();
  }, [token, portfolioRefreshTick]);

  const filtered = filter === 'ALL' ? trades : trades.filter(t => t.type === filter);

  const totalBought = trades.filter(t => t.type === 'BUY').reduce((s, t) => s + t.totalAmount, 0);
  const totalSold = trades.filter(t => t.type === 'SELL').reduce((s, t) => s + t.totalAmount, 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
          📋 Trade <span style={{ color: '#10b981' }}>History</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Your complete record of buy and sell transactions.</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Trades', value: trades.length, color: '#fff' },
          { label: 'Total Bought', value: `$${fmt(totalBought)}`, color: '#ef4444' },
          { label: 'Total Sold', value: `$${fmt(totalSold)}`, color: '#10b981' }
        ].map(card => (
          <div key={card.label} className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['ALL', 'BUY', 'SELL'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem',
            background: filter === f ? (f === 'BUY' ? '#10b981' : f === 'SELL' ? '#ef4444' : '#8b5cf6') : 'rgba(255,255,255,0.05)',
            color: filter === f ? '#fff' : '#9ca3af', transition: 'var(--transition-fast)'
          }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="loader-container"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <History size={48} style={{ color: '#374151', marginBottom: '16px' }} />
          <p style={{ color: '#6b7280' }}>No trades yet. Head to the Market to make your first trade.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Type', 'Stock', 'Shares', 'Price/Share', 'Total', 'Date'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const isBuy = t.type === 'BUY';
                  return (
                    <tr key={t._id || i} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isBuy ? <ArrowUpCircle size={18} color="#10b981" /> : <ArrowDownCircle size={18} color="#ef4444" />}
                          <span style={{ fontWeight: '700', fontSize: '0.88rem', color: isBuy ? '#10b981' : '#ef4444' }}>{t.type}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: '800', color: '#fff' }}>{t.symbol}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{t.stockName}</div>
                      </td>
                      <td style={{ padding: '16px 18px', color: '#d1d5db', fontWeight: '600' }}>{t.quantity}</td>
                      <td style={{ padding: '16px 18px', color: '#d1d5db' }}>${fmt(t.price)}</td>
                      <td style={{ padding: '16px 18px', fontWeight: '700', color: isBuy ? '#ef4444' : '#10b981' }}>
                        {isBuy ? '-' : '+'}${fmt(t.totalAmount)}
                      </td>
                      <td style={{ padding: '16px 18px', color: '#6b7280', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {fmtDate(t.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;
