import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { TrendingUp, LayoutDashboard, User, LogOut, History, PieChart } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinkStyle = (path) => ({
    fontSize: '0.95rem',
    fontWeight: '500',
    color: isActive(path) ? '#fff' : '#d1d5db',
    transition: 'var(--transition-fast)',
    borderBottom: isActive(path) ? '2px solid var(--primary)' : '2px solid transparent',
    paddingBottom: '2px'
  });

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(11, 14, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 0',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #0891b2 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16,185,129,0.3)'
          }}>
            <TrendingUp size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
            Shop<span style={{ color: '#10b981' }}>EZ</span>
            <span style={{ fontSize: '0.7rem', fontWeight: '500', color: '#6b7280', marginLeft: '6px', verticalAlign: 'middle' }}>TRADE</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={navLinkStyle('/')}>Market</Link>

          {user && user.role === 'USER' && (
            <>
              <Link to="/portfolio" style={navLinkStyle('/portfolio')} >
                Portfolio
              </Link>
              <Link to="/trades" style={navLinkStyle('/trades')}>
                Trade History
              </Link>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <Link to="/admin" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#f59e0b', fontSize: '0.95rem', fontWeight: '600',
              padding: '6px 14px', borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <LayoutDashboard size={16} /> Admin Panel
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '20px' }}>
              {user.role === 'USER' && (
                <span style={{
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  color: '#10b981', fontSize: '0.82rem', fontWeight: '700',
                  padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px'
                }}>
                  ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </span>
              )}
              <span style={{ color: '#9ca3af', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} /> Hi, <strong style={{ color: '#fff' }}>{user.username}</strong>
              </span>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: '600'
              }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.88rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
