import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, PieChart, DollarSign, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrade } from '../context/TradeContext.jsx';
import { mockDatabase } from '../data/mockDatabase.js';

const fmt = (n, dec = 2) => n?.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

const Portfolio = () => {
  const { user, token } = useAuth();
  const { portfolioRefreshTick } = useTrade();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/portfolio', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setPortfolio(await res.json());
        } else {
          setPortfolio(mockDatabase.getPortfolio(user?._id));
        }
      } catch {
        setPortfolio(mockDatabase.getPortfolio(user?._id));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPortfolio();
  }, [token, portfolioRefreshTick]);

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  const { holdings = [], totalInvested = 0, totalCurrentValue = 0, totalPnL = 0, totalPnLPercent = 0, balance = 0 } = portfolio || {};
  const totalPortfolioValue = balance + totalCurrentValue;
  const isPnLUp = totalPnL >= 0;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
          💼 My <span style={{ color: '#10b981' }}>Portfolio</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Track your holdings, monitor profit & loss, and manage investments.</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Available Cash', value: `$${fmt(balance)}`, color: '#06b6d4', icon: <DollarSign size={20} /> },
          { label: 'Invested Value', value: `$${fmt(totalInvested)}`, color: '#8b5cf6', icon: <PieChart size={20} /> },
          { label: 'Current Value', value: `$${fmt(totalCurrentValue)}`, color: '#f59e0b', icon: <Activity size={20} /> },
          {
            label: 'Total P&L',
            value: `${isPnLUp ? '+' : ''}$${fmt(Math.abs(totalPnL))} (${isPnLUp ? '+' : ''}${totalPnLPercent?.toFixed(2)}%)`,
            color: isPnLUp ? '#10b981' : '#ef4444',
            icon: isPnLUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />
          }
        ].map(card => (
          <div key={card.label} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: card.color }}>
              {card.icon}
              <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Total Portfolio Value */}
      <div className="glass-panel" style={{ padding: '20px 28px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderLeft: '4px solid #10b981' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '4px' }}>Total Portfolio Value (Cash + Holdings)</div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>${fmt(totalPortfolioValue)}</div>
        </div>
        <Link to="/" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #0891b2)', border: 'none', padding: '10px 20px' }}>
          Browse Market →
        </Link>
      </div>

      {/* Holdings Table */}
      <h2 style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '16px' }}>Current Holdings</h2>

      {holdings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <PieChart size={48} style={{ color: '#374151', marginBottom: '16px' }} />
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>You don't own any stocks yet.</p>
          <Link to="/" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #0891b2)', border: 'none' }}>
            Start Trading
          </Link>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Stock', 'Shares', 'Avg Buy', 'Current', 'Invested', 'Value', 'P&L', ''].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => {
                  const up = h.pnl >= 0;
                  return (
                    <tr key={h.symbol} style={{ borderBottom: i < holdings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'var(--transition-fast)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: '800', color: '#fff', fontSize: '1rem' }}>{h.symbol}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{h.name}</div>
                      </td>
                      <td style={{ padding: '16px 18px', color: '#d1d5db', fontWeight: '600' }}>{h.quantity}</td>
                      <td style={{ padding: '16px 18px', color: '#d1d5db' }}>${fmt(h.avgBuyPrice)}</td>
                      <td style={{ padding: '16px 18px', color: '#fff', fontWeight: '700' }}>${fmt(h.currentPrice)}</td>
                      <td style={{ padding: '16px 18px', color: '#9ca3af' }}>${fmt(h.invested)}</td>
                      <td style={{ padding: '16px 18px', color: '#fff', fontWeight: '700' }}>${fmt(h.currentValue)}</td>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ color: up ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.9rem' }}>
                          {up ? '+' : ''}${fmt(Math.abs(h.pnl))}
                        </div>
                        <div style={{ color: up ? '#10b981' : '#ef4444', fontSize: '0.78rem' }}>
                          {up ? '+' : ''}{h.pnlPercent?.toFixed(2)}%
                        </div>
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <Link to={`/stock/${h.stockId}`} style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Trade →</Link>
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

export default Portfolio;
