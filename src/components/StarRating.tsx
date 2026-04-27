import React from 'react';

interface Props {
  rating: number;
  count?: number;
}

const StarRating = React.memo(function StarRating({ rating, count }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half = !filled && i < rating;
    return { filled, half };
  });

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars.map((star, i) => (
        <span
          key={i}
          className={`text-sm ${star.filled || star.half ? 'text-[#f5a623]' : 'text-gray-300'}`}
        >
          {star.filled ? '★' : star.half ? '⯨' : '☆'}
        </span>
      ))}
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-0.5">({rating.toFixed(1)})</span>
      )}
    </span>
  );
});

export default StarRating;
