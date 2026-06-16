import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Package, Calendar, Clock, MapPin, IndianRupee, PackageCheck } from 'lucide-react';
import { mockDatabase } from '../data/mockDatabase.js';

export const CustomerOrders = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/customer', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          throw new Error('API response not OK');
        }
      } catch (err) {
        console.warn('Backend offline, loading customer orders from mock database');
        if (user) {
          const data = mockDatabase.getOrders(user._id, user.role);
          setOrders(data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === 'delivered') return 'var(--success)';
    if (status === 'shipped') return 'var(--secondary)';
    return 'var(--warning)'; // pending
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px 80px 20px', minHeight: 'calc(100vh - 160px)' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Package size={28} color="var(--primary-hover)" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 auto',
          color: 'var(--text-muted)'
        }}>
          <PackageCheck size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>No Orders Found</h2>
          <p>You haven't placed any orders yet. Place some mock orders from the catalog to see them here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '28px', background: 'rgba(18, 24, 43, 0.55)' }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                paddingBottom: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                    Order ID: <span style={{ color: 'var(--secondary)' }}>#{order._id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  border: '1px solid',
                  borderColor: getStatusColor(order.status),
                  color: getStatusColor(order.status),
                  background: `${getStatusColor(order.status)}15`,
                  letterSpacing: '0.5px'
                }}>
                  {order.status}
                </div>
              </div>

              {/* Order content */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px'
              }}>
                {/* Product Items List */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>Items</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span>
                          <strong style={{ color: '#fff' }}>{item.title}</strong>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>x{item.quantity}</span>
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>Shipping Destination</h4>
                  <div style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                    <div style={{ color: '#fff', fontWeight: '600' }}>{order.shippingDetails.name}</div>
                    <div style={{ display: 'flex', gap: '6px', color: 'var(--text-muted)', marginTop: '4px', alignItems: 'flex-start' }}>
                      <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{order.shippingDetails.address}, {order.shippingDetails.city} - {order.shippingDetails.zip}</span>
                    </div>
                  </div>
                </div>

                {/* Total Payment Details */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingLeft: '30px'
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Amount Paid</span>
                  <div style={{
                    fontSize: '1.6rem',
                    fontWeight: '800',
                    color: 'var(--primary-hover)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <IndianRupee size={20} />
                    {order.totalAmount}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
