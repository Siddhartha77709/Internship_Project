import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(11, 14, 23, 0.9)',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '36px 0 24px'
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '28px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ background: 'linear-gradient(135deg, #10b981, #0891b2)', padding: '6px', borderRadius: '8px' }}>
                <TrendingUp size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                Shop<span style={{ color: '#10b981' }}>EZ</span> <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>TRADE</span>
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.82rem', maxWidth: '280px', lineHeight: '1.6' }}>
              A simulated stock trading platform built on the MERN stack. Practice investing with virtual funds.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#9ca3af', fontWeight: '600', fontSize: '0.82rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Market</Link>
                <Link to="/portfolio" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Portfolio</Link>
                <Link to="/trades" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Trade History</Link>
              </div>
            </div>
            <div>
              <p style={{ color: '#9ca3af', fontWeight: '600', fontSize: '0.82rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Account</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/auth" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Sign In</Link>
                <Link to="/auth" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Register</Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ color: '#4b5563', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} ShopEZ Trade. For educational purposes only. Not real financial advice.
          </p>
          <p style={{ color: '#374151', fontSize: '0.78rem' }}>
            Simulated trading · Virtual funds only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
