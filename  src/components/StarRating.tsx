import React from 'react';

interface Props {
  rating: number;
  count?: number;
}

export default function StarRating({ rating, count }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half = !filled && i < rating;
    return { filled, half };
  });

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {stars.map((star, i) => (
        <span
          key={i}
          style={{
            color: star.filled || star.half ? '#f5a623' : '#d1d5db',
            fontSize: '14px',
          }}
        >
          {star.filled ? '★' : star.half ? '⯨' : '☆'}
        </span>
      ))}
      {count !== undefined && (
        <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: 2 }}>
          ({rating.toFixed(1)})
        </span>
      )}
    </span>
  );
}
