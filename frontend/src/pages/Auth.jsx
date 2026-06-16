import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const Auth = () => {
  const { user, login, register, error, setError } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Set default role if query param exists (e.g. ?role=seller)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'seller') {
      setRole('seller');
      setIsLogin(false); // Open register tab for seller
    }
    setError(null);
  }, [searchParams, setError]);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
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
        setSuccessMsg('Account registered successfully! Logging you in...');
      }
    } catch (err) {
      // Handled by AuthContext error, but fallback to local
      setLocalError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 160px)',
      padding: '40px 20px'
    }}>
      <div className="glass-panel pulse-glow" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '40px',
        background: 'rgba(18, 24, 43, 0.85)'
      }}>
        {/* Toggle Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => { setIsLogin(true); setLocalError(''); setError(null); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              background: 'none',
              border: 'none',
              color: isLogin ? '#fff' : '#6b7280',
              fontWeight: '600',
              fontSize: '1.05rem',
              cursor: 'pointer',
              borderBottom: isLogin ? '2px solid var(--primary)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setLocalError(''); setError(null); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              background: 'none',
              border: 'none',
              color: !isLogin ? '#fff' : '#6b7280',
              fontWeight: '600',
              fontSize: '1.05rem',
              cursor: 'pointer',
              borderBottom: !isLogin ? '2px solid var(--primary)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            Register
          </button>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
          {isLogin ? 'Sign in to access your ShopEZ portal' : 'Join ShopEZ to shop or sell effortlessly'}
        </p>

        {/* Error Messages */}
        {(localError || error) && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.88rem',
            lineHeight: '1.4'
          }}>
            {localError || error}
          </div>
        )}

        {/* Success Messages */}
        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--success)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.88rem'
          }}>
            {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Username (Only for Sign Up) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '500', color: '#d1d5db' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#6b7280' }}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. JohnDoe"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: '500', color: '#d1d5db' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#6b7280' }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: '500', color: '#d1d5db' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#6b7280' }}>
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Role selector (Only for Sign Up) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '500', color: '#d1d5db' }}>I want to be a:</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  border: `1px solid ${role === 'customer' ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                  background: role === 'customer' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'var(--transition-fast)'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                    style={{ display: 'none' }}
                  />
                  🛍️ Customer
                </label>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  border: `1px solid ${role === 'seller' ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                  background: role === 'seller' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'var(--transition-fast)'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={role === 'seller'}
                    onChange={() => setRole('seller')}
                    style={{ display: 'none' }}
                  />
                  💼 Seller
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo Accounts Tip */}
        <div style={{
          marginTop: '30px',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#9ca3af'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontWeight: '600', marginBottom: '4px' }}>
            <ShieldCheck size={14} />
            Demo Accounts Available
          </div>
          <div><strong>Seller Portal:</strong> seller@shopez.com (pwd: <code>seller123</code>)</div>
          <div style={{ marginTop: '2px' }}><strong>Or Register</strong> as a Customer or Seller directly!</div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
