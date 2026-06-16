import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(9, 12, 22, 0.9)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '40px 20px',
      marginTop: 'auto',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '0.9rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px', fontWeight: '700', letterSpacing: '1px' }}>
            Shop<span style={{ color: '#8b5cf6' }}>EZ</span>
          </h3>
          <p style={{ fontSize: '0.85rem', maxWidth: '300px' }}>Your one-stop destination for effortless online shopping. Premium products, secure checkout, fast delivery.</p>
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <li><a href="/" style={{ hover: { color: '#fff' } }}>Catalog</a></li>
              <li><a href="/cart">Cart</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>Account</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <li><a href="/auth">Customer Portal</a></li>
              <li><a href="/auth?role=seller">Seller Hub</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', fontSize: '0.8rem' }}>
        &copy; {new Date().getFullYear()} ShopEZ Inc. All rights reserved. Designed for excellence.
      </div>
    </footer>
  );
};

export default Footer;
