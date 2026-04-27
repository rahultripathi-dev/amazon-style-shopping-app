import React from 'react';
import styles from './StarRating.module.css';

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
    <span className={styles.wrap}>
      {stars.map((star, i) => (
        <span
          key={i}
          className={`${styles.star} ${star.filled || star.half ? styles.starFilled : styles.starEmpty}`}
        >
          {star.filled ? '★' : star.half ? '⯨' : '☆'}
        </span>
      ))}
      {count !== undefined && (
        <span className={styles.count}>({rating.toFixed(1)})</span>
      )}
    </span>
  );
});

export default StarRating;
