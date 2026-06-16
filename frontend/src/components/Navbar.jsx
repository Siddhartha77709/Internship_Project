import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingBag, ShoppingCart, LayoutDashboard, User, LogOut, PackageOpen } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(11, 14, 23, 0.75)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 0',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #6d28d9 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--primary-glow) 0 4px 10px'
          }}>
            <ShoppingBag size={20} color="#fff" />
          </div>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            letterSpacing: '0.5px',
            color: '#fff'
          }}>
            Shop<span style={{ color: 'var(--primary-hover)' }}>EZ</span>
          </span>
        </Link>

        {/* Action Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#d1d5db',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
          >
            Catalog
          </Link>

          {/* Cart Icon (Only show/useful for customers or guest users) */}
          {(!user || user.role === 'customer') && (
            <Link to="/cart" style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              color: '#d1d5db',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--secondary)'}
            onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: 'var(--secondary)',
                  color: '#0b0e17',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Seller Dashboard Link */}
          {user && user.role === 'seller' && (
            <Link to="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--primary-hover)',
              fontSize: '0.95rem',
              fontWeight: '600',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <LayoutDashboard size={16} />
              Seller Hub
            </Link>
          )}

          {/* User Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                color: '#9ca3af',
                fontSize: '0.88rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <User size={14} />
                Hi, <strong style={{ color: '#fff' }}>{user.username}</strong>
              </span>

              {/* Customer Orders */}
              {user.role === 'customer' && (
                <Link to="/orders" style={{
                  color: '#9ca3af',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  <PackageOpen size={14} />
                  My Orders
                </Link>
              )}

              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.88rem',
                  fontWeight: '600'
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.88rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
