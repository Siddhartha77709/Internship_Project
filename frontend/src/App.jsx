import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CustomerOrders from './pages/CustomerOrders.jsx';

// Protected Route for Sellers
const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'seller') {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Protected Route for Customers
const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'customer') {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function AppContent() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: '1 0 auto' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />

            {/* Customer Only Routes */}
            <Route 
              path="/checkout" 
              element={
                <CustomerRoute>
                  <Checkout />
                </CustomerRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <CustomerRoute>
                  <CustomerOrders />
                </CustomerRoute>
              } 
            />

            {/* Seller Only Routes */}
            <Route 
              path="/dashboard" 
              element={
                <SellerRoute>
                  <Dashboard />
                </SellerRoute>
              } 
            />

            {/* Fallback Catch-All */}
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
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
