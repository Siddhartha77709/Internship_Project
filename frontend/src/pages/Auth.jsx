import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, User, ShieldCheck, TrendingUp } from 'lucide-react';

export const Auth = () => {
  const { user, login, register, error, setError } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setError(null); }, []);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    setError(null);
    if (!email || !password || (!isLogin && !username)) {
      setLocalError('Please fill out all fields.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password, role);
        setSuccessMsg('Account created! Logging you in...');
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 160px)', padding: '40px 20px'
    }}>
      <div className="glass-panel pulse-glow" style={{ width: '100%', maxWidth: '480px', padding: '40px', background: 'rgba(18, 24, 43, 0.9)' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #0891b2)', padding: '10px', borderRadius: '12px' }}>
              <TrendingUp size={24} color="#fff" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: '800' }}>
              Shop<span style={{ color: '#10b981' }}>EZ</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '6px' }}>TRADE</span>
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '28px' }}>
          {['Sign In', 'Register'].map((label, i) => {
            const active = isLogin === (i === 0);
            return (
              <button key={label} onClick={() => { setIsLogin(i === 0); setLocalError(''); setError(null); }} style={{
                flex: 1, paddingBottom: '12px', background: 'none', border: 'none',
                color: active ? '#fff' : '#6b7280', fontWeight: '600', fontSize: '1rem',
                cursor: 'pointer', borderBottom: active ? '2px solid #10b981' : '2px solid transparent',
                transition: 'var(--transition-fast)'
              }}>{label}</button>
            );
          })}
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '6px', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '28px', textAlign: 'center' }}>
          {isLogin ? 'Sign in to access your trading portal' : 'Join ShopEZ Trade — start with $50,000 virtual funds'}
        </p>

        {(localError || error) && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem' }}>
            {localError || error}
          </div>
        )}
        {successMsg && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#d1d5db' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#6b7280' }}><User size={18} /></span>
                <input type="text" placeholder="e.g. JohnTrader" className="form-input" style={{ paddingLeft: '44px' }}
                  value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#d1d5db' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#6b7280' }}><Mail size={18} /></span>
              <input type="email" placeholder="e.g. john@example.com" className="form-input" style={{ paddingLeft: '44px' }}
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#d1d5db' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#6b7280' }}><Lock size={18} /></span>
              <input type="password" placeholder="••••••••" className="form-input" style={{ paddingLeft: '44px' }}
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#d1d5db' }}>Account Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[{ val: 'USER', icon: '📈', label: 'Investor' }, { val: 'ADMIN', icon: '🛡️', label: 'Admin' }].map(({ val, icon, label }) => (
                  <label key={val} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                    border: `1px solid ${role === val ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                    background: role === val ? 'rgba(16,185,129,0.1)' : 'transparent',
                    transition: 'var(--transition-fast)'
                  }}>
                    <input type="radio" name="role" value={val} checked={role === val} onChange={() => setRole(val)} style={{ display: 'none' }} />
                    {icon} {label}
                  </label>
                ))}
              </div>
              {role === 'ADMIN' && (
                <p style={{ fontSize: '0.78rem', color: '#f59e0b' }}>⚠️ Admin accounts require approval. Registration will create an Investor account instead.</p>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px', background: 'linear-gradient(135deg, #10b981, #0891b2)', border: 'none' }} disabled={loading}>
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '28px', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.82rem', color: '#9ca3af' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '600', marginBottom: '6px' }}>
            <ShieldCheck size={14} /> Demo Accounts
          </div>
          <div><strong>Investor:</strong> investor@shopez.com / <code>investor123</code></div>
          <div style={{ marginTop: '3px' }}><strong>Admin:</strong> admin@shopez.com / <code>admin123</code></div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
