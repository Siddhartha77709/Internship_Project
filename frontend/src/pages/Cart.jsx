import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Trash2, ShoppingBag, ArrowRight, Tag, Info } from 'lucide-react';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, originalTotal, discountedTotal, totalSavings } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/auth?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{ padding: '60px 40px', maxWidth: '480px' }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '20px',
            borderRadius: '50%',
            display: 'inline-flex',
            marginBottom: '24px',
            color: 'var(--primary-hover)'
          }}>
            <ShoppingBag size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '32px', lineHeight: '1.5' }}>
            Looks like you haven't added any products to your shopping bag yet. Explore our catalog to find premium deals.
          </p>
          <Link to="/" className="btn btn-primary" style={{ padding: '12px 30px' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px 80px 20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '32px' }}>Your Shopping Cart</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 2fr) minmax(280px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cartItems.map((item) => (
            <div key={item.productId} className="glass-panel" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px',
              flexWrap: 'wrap'
            }}>
              {/* Product Thumbnail */}
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />

              {/* Product Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Link to={`/product/${item.productId}`} style={{ display: 'block', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>{item.title}</h3>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {item.discount > 0 ? (
                    <>
                      <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary-hover)' }}>
                        ${item.discountedPrice}
                      </span>
                      <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        ${item.price}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                      ${item.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '2px'
              }}>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  -
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  +
                </button>
              </div>

              {/* Total Item Price */}
              <div style={{ minWidth: '80px', textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                  ${item.discountedPrice * item.quantity}
                </span>
                {item.discount > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600' }}>
                    Saved ${ (item.price - item.discountedPrice) * item.quantity }
                  </span>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.productId)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Right Column: Checkout Summary Panel */}
        <div className="glass-panel" style={{ padding: '32px', background: 'rgba(18, 24, 43, 0.6)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '24px' }}>Order Summary</h2>

          {/* Pricing breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>${originalTotal}</span>
            </div>
            
            {totalSavings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: '600' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={14} /> ShopEZ Discounts
                </span>
                <span>-${totalSavings}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#fff'
            }}>
              <span>Total</span>
              <span>${discountedTotal}</span>
            </div>
          </div>

          {/* Prompt info */}
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '12px',
            background: 'rgba(6, 182, 212, 0.05)',
            border: '1px solid rgba(6, 182, 212, 0.1)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#22d3ee',
            marginBottom: '24px',
            lineHeight: '1.4'
          }}>
            <Info size={18} style={{ flexShrink: 0 }} />
            <span>Secure Checkout guarantees mock transactions for demo purposes. No actual money will be charged.</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckoutRedirect}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
          >
            {user ? 'Proceed to Checkout' : 'Sign In to Checkout'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
