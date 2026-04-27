import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import StarRating from './StarRating';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

const ProductCard = React.memo(function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
      <div className={styles.imageWrap}>
        {!imgLoaded && <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: '6px' }} />}
        <img
          src={product.thumbnail}
          alt={product.title}
          onLoad={() => setImgLoaded(true)}
          className={`${styles.img} ${imgLoaded ? styles.imgLoaded : ''}`}
          loading="lazy"
        />
      </div>
      <p className={styles.title}>{product.title}</p>
      <div className={styles.priceRow}>
        <span className={styles.price}>${product.price.toFixed(2)}</span>
        <StarRating rating={product.rating} count={product.rating} />
      </div>
    </div>
  );
});

export default ProductCard;
