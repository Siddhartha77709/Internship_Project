import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { StarRating } from '../components/StarRating.jsx';
import { Search, ShoppingCart, SlidersHorizontal, ArrowUpDown, Tag } from 'lucide-react';

export const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const { addToCart } = useCart();

  const categories = ['All', 'Electronics', 'Wearables', 'Accessories', 'Home & Kitchen', 'Furniture'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (search) {
          params.append('search', search);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory]);

  const handleSort = (a, b) => {
    const getFinalPrice = (p) => Math.round(p.price * (1 - p.discount / 100));
    if (sortBy === 'price-low') {
      return getFinalPrice(a) - getFinalPrice(b);
    }
    if (sortBy === 'price-high') {
      return getFinalPrice(b) - getFinalPrice(a);
    }
    if (sortBy === 'discount') {
      return b.discount - a.discount;
    }
    return 0; // featured/default
  };

  const sortedProducts = [...products].sort(handleSort);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%)',
        padding: '80px 24px 60px 24px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '900',
          lineHeight: '1.2',
          letterSpacing: '-0.5px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #fff 40%, var(--primary-hover) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Effortless Online Shopping
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1.15rem',
          maxWidth: '600px',
          margin: '0 auto 32px auto',
          fontWeight: '400'
        }}>
          Explore premium products, detailed reviews, and unmatched discounts. Elevate your shopping experience today.
        </p>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          <span style={{ position: 'absolute', left: '16px', top: '16px', color: '#6b7280' }}>
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search products, brands, or categories..."
            className="form-input"
            style={{
              padding: '16px 16px 16px 52px',
              fontSize: '1.05rem',
              boxShadow: 'var(--card-shadow)'
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        {/* Controls: Categories & Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '20px'
        }}>
          {/* Categories Row */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat || (cat === 'All' && !selectedCategory);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                    background: active ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: active ? 'var(--primary-hover)' : 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={16} /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 16px',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'var(--font-family)',
                cursor: 'pointer'
              }}
            >
              <option value="featured" style={{ background: '#111524' }}>Featured</option>
              <option value="price-low" style={{ background: '#111524' }}>Price: Low to High</option>
              <option value="price-high" style={{ background: '#111524' }}>Price: High to Low</option>
              <option value="discount" style={{ background: '#111524' }}>Top Discounts</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--text-muted)'
          }}>
            <SlidersHorizontal size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>No products found</h3>
            <p>Try clearing your search or choosing a different category.</p>
          </div>
        ) : (
          <div className="grid-catalog">
            {sortedProducts.map((product) => {
              const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
              const reviewCount = product.reviews?.length || 0;
              const averageRating = reviewCount > 0
                ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
                : null;

              return (
                <div key={product._id} className="glass-panel" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                }}
                >
                  {/* Floating Discount Tag */}
                  {product.discount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      zIndex: 10,
                      background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 10px rgba(217, 119, 6, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Tag size={12} />
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Product Image */}
                  <Link to={`/product/${product._id}`} style={{ display: 'block', height: '200px', overflow: 'hidden' }}>
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  </Link>

                  {/* Product Info */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>
                      {product.category}
                    </span>
                    
                    <Link to={`/product/${product._id}`} style={{ display: 'block', marginBottom: '8px' }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#fff',
                        lineHeight: '1.4',
                        height: '46px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {product.title}
                      </h3>
                    </Link>

                    {/* Ratings summary */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <StarRating rating={Math.round(averageRating || 0)} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {averageRating ? `(${reviewCount})` : '(No reviews)'}
                      </span>
                    </div>

                    {/* Price & Add to Cart footer */}
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {product.discount > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              ${product.price}
                            </span>
                            <span style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '800' }}>
                              ${discountedPrice}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '800' }}>
                            ${product.price}
                          </span>
                        )}
                      </div>

                      {product.stock > 0 ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="btn btn-primary"
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            boxShadow: 'none'
                          }}
                          title="Add to Cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      ) : (
                        <span style={{
                          color: 'var(--danger)',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          padding: '6px 12px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.15)',
                          borderRadius: '8px'
                        }}>
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
