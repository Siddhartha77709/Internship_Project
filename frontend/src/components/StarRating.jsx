import React from 'react';

export const StarRating = ({ rating, interactive = false, onRatingChange = null }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {stars.map((star) => {
        const fill = star <= rating ? '#f59e0b' : '#374151';
        return (
          <span
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '1.25rem',
              color: fill,
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (interactive) e.target.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              if (interactive) e.target.style.transform = 'scale(1)';
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
