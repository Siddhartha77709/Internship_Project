import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { CreditCard, CheckCircle2, ChevronRight, MapPin, Loader, ShieldAlert, Sparkles } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, clearCart, discountedTotal, originalTotal } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Form states
  const [name, setName] = useState(user?.username || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Processing states
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !address || !city || !zip || !cardNumber || !expiry || !cvv) {
      setErrorMsg('Please fill in all shipping and payment details.');
      return;
    }

    setLoading(true);

    try {
      // 1. Submit order to Backend
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.discountedPrice,
          quantity: item.quantity
        })),
        shippingDetails: { name, address, city, zip }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order execution failed.');
      }

      // 2. Mock payment processing delay
      setTimeout(() => {
        setPlacedOrder(data);
        clearCart();
        setOrderSuccess(true);
        setLoading(false);
      }, 2000);

    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete order. Please try again.');
      setLoading(false);
    }
  };

  // Payment loading screen
  if (loading) {
    return (
      <div className="container animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{ padding: '60px 40px', maxWidth: '440px' }}>
          <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '24px' }}>
            <div className="spinner" style={{ width: '64px', height: '64px', borderWidth: '4px' }}></div>
            <CreditCard size={28} style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--primary-hover)'
            }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Processing Payment...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Securing order transaction and updating inventories. Please do not close or refresh this page.</p>
        </div>
      </div>
    );
  }

  // Order Confirmation Success screen
  if (orderSuccess && placedOrder) {
    return (
      <div className="container animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px 100px 20px',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{
          padding: '48px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: 'var(--primary-glow) 0 10px 40px -10px',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <div style={{ color: 'var(--success)', display: 'inline-flex', marginBottom: '20px' }}>
            <CheckCircle2 size={64} className="pulse-glow" style={{ borderRadius: '50%' }} />
          </div>
          
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', marginBottom: '8px' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '32px' }}>
            Thank you for shopping with ShopEZ. Your order has been placed successfully.
          </p>

          {/* Receipt Info */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'left',
            marginBottom: '32px',
            fontSize: '0.9rem'
          }}>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Order ID:</span>
              <strong style={{ color: 'var(--secondary)' }}>#{placedOrder._id}</strong>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px', marginBottom: '12px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Shipping To:</div>
              <div>{placedOrder.shippingDetails.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                {placedOrder.shippingDetails.address}, {placedOrder.shippingDetails.city} - {placedOrder.shippingDetails.zip}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Items:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {placedOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>{item.title} (x{item.quantity})</span>
                    <strong style={{ color: '#fff' }}>${item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '700' }}>
              <span>Total Paid:</span>
              <span style={{ color: 'var(--primary-hover)' }}>${placedOrder.totalAmount}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
              Continue Shopping
            </Link>
            <Link to="/orders" className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px 80px 20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '32px' }}>Checkout</h1>

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'var(--danger)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '0.9rem'
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePay} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 2fr) minmax(280px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Shipping & Payment Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Shipping Details */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="var(--primary-hover)" /> Shipping Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Main St, Apt 4B"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>City</label>
                  <input
                    type="text"
                    placeholder="e.g. New York"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Postal Code / ZIP</label>
                  <input
                    type="text"
                    placeholder="e.g. 10001"
                    className="form-input"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="var(--primary-hover)" /> Mock Payment
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 1234 5678"
                  className="form-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="form-input"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="form-input"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Checkout Item Summary */}
        <div className="glass-panel" style={{ padding: '32px', background: 'rgba(18, 24, 43, 0.6)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '20px' }}>Items Summary</h2>

          {/* List of items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', maxHeight: '240px', overflowY: 'auto', paddingRight: '8px' }}>
            {cartItems.map((item) => (
              <div key={item.productId} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1, fontSize: '0.85rem', overflow: 'hidden' }}>
                  <div style={{ color: '#fff', fontWeight: '600', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {item.title}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>x{item.quantity} at ${item.discountedPrice}</div>
                </div>
                <strong style={{ fontSize: '0.9rem' }}>${item.discountedPrice * item.quantity}</strong>
              </div>
            ))}
          </div>

          {/* Pricing Math */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '0.9rem',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>${originalTotal}</span>
            </div>
            
            {originalTotal > discountedTotal && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: '600' }}>
                <span>Savings</span>
                <span>-${originalTotal - discountedTotal}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#fff',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px'
            }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--primary-hover)' }}>${discountedTotal}</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '12px',
            background: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: 'var(--accent-yellow)',
            marginBottom: '24px',
            lineHeight: '1.4'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>Sandbox Mode: Do NOT enter actual credit card details. Fill forms with dummy inputs.</span>
          </div>

          {/* Execute payment button */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px' }}>
            <Sparkles size={16} /> Pay & Complete Order
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
