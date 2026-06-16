import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { StarRating } from '../components/StarRating.jsx';
import { ArrowLeft, ShoppingCart, MessageSquare, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { mockDatabase } from '../data/mockDatabase.js';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        throw new Error('Product not found in backend');
      }
    } catch (err) {
      console.warn('Backend offline, loading product details from mock database');
      const mockProd = mockDatabase.getProductById(id);
      if (mockProd) {
        setProduct(mockProd);
      } else {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!comment) {
      setReviewError('Please write a comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment,
          username: user.username
        })
      });

      if (response.ok) {
        setComment('');
        setRating(5);
        // Refresh product details to show review
        await fetchProductDetails();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Error submitting review');
      }
    } catch (err) {
      console.warn('Backend offline, adding review to mock database');
      const updatedProduct = mockDatabase.addReview(id, rating, comment, user.username);
      if (updatedProduct) {
        setComment('');
        setRating(5);
        setProduct(updatedProduct);
      } else {
        setReviewError(err.message || 'Failed to connect to the server');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
  const reviewCount = product.reviews?.length || 0;
  const averageRating = reviewCount > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
    : null;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Back button */}
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-muted)',
        fontSize: '0.92rem',
        fontWeight: '500',
        marginBottom: '32px',
        transition: 'var(--transition-fast)'
      }}
      onMouseEnter={(e) => e.target.style.color = '#fff'}
      onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      {/* Main product display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '48px',
        marginBottom: '60px'
      }}>
        {/* Left column: Image */}
        <div style={{ position: 'relative' }}>
          <div className="glass-panel" style={{
            overflow: 'hidden',
            borderRadius: '24px',
            boxShadow: 'var(--glass-shadow)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: '100%',
                maxHeight: '480px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
          {product.discount > 0 && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.5)'
            }}>
              SAVE {product.discount}%
            </div>
          )}
        </div>

        {/* Right column: Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>
            {product.category}
          </span>
          
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.2' }}>
            {product.title}
          </h1>

          {/* Review Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <StarRating rating={Math.round(averageRating || 0)} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {averageRating ? `${averageRating} / 5 (${reviewCount} reviews)` : 'No reviews yet'}
            </span>
          </div>

          {/* Prices */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '16px',
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {product.discount > 0 ? (
              <>
                <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff' }}>
                  ₹{discountedPrice}
                </span>
                <span style={{ fontSize: '1.3rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff' }}>
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Product Description */}
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.98rem', marginBottom: '32px' }}>
            {product.description}
          </p>

          {/* Stock status indicator */}
          <div style={{ marginBottom: '24px' }}>
            {product.stock === 0 ? (
              <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Out of Stock</span>
            ) : product.stock < 5 ? (
              <span style={{ color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Only {product.stock} left in stock - order soon!
              </span>
            ) : (
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>In Stock ({product.stock} units available)</span>
            )}
          </div>

          {/* Cart Actions */}
          {product.stock > 0 && (!user || user.role === 'customer') && (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Quantity selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '4px'
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    fontSize: '1.2rem',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '700' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    fontSize: '1.2rem',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '48px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={22} color="var(--primary-hover)" /> Customer Reviews
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* List of Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {product.reviews.length === 0 ? (
              <div style={{
                padding: '40px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              product.reviews.map((rev, i) => (
                <div key={i} className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '0.98rem' }}>{rev.username}</strong>
                      <StarRating rating={rev.rating} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {new Date(rev.createdAt || rev.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: '1.5' }}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Submit a Review Form */}
          <div className="glass-panel" style={{ padding: '32px', background: 'rgba(18, 24, 43, 0.5)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Leave a Review</h3>
            
            {reviewError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}>
                {reviewError}
              </div>
            )}

            {!user ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: '16px' }}>You must be signed in to submit a review.</p>
                <Link to="/auth" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Sign In <ChevronRight size={14} />
                </Link>
              </div>
            ) : user.role !== 'customer' ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                Only verified customers can leave product reviews.
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                    Rating
                  </label>
                  <StarRating rating={rating} interactive={true} onRatingChange={setRating} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: '500', color: '#d1d5db' }}>Comment</label>
                  <textarea
                    placeholder="Describe your experience with this product..."
                    className="form-input"
                    rows={4}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
