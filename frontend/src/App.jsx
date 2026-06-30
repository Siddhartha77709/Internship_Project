import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { TradeProvider } from './context/TradeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Market from './pages/Market.jsx';
import StockDetail from './pages/StockDetail.jsx';
import Portfolio from './pages/Portfolio.jsx';
import TradeHistory from './pages/TradeHistory.jsx';
import Auth from './pages/Auth.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
  </div>
);

// Protected route — any authenticated user
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

// Protected route — ADMIN only
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/auth" replace />;
  return children;
};

// Protected route — USER only (investors)
const InvestorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user || user.role !== 'USER') return <Navigate to="/auth" replace />;
  return children;
};

function AppContent() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: '1 0 auto' }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Market />} />
            <Route path="/market" element={<Market />} />
            <Route path="/stock/:id" element={<StockDetail />} />
            <Route path="/auth" element={<Auth />} />

            {/* Investor only */}
            <Route path="/portfolio" element={
              <InvestorRoute><Portfolio /></InvestorRoute>
            } />
            <Route path="/trades" element={
              <InvestorRoute><TradeHistory /></InvestorRoute>
            } />

            {/* Admin only */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TradeProvider>
        <AppContent />
      </TradeProvider>
    </AuthProvider>
  );
}
