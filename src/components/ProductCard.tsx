import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import StarRating from './StarRating';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', borderRadius: '6px', backgroundColor: '#f9fafb', position: 'relative' }}>
        {!imgLoaded && <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: '6px' }} />}
        <img
          src={product.thumbnail}
          alt={product.title}
          onLoad={() => setImgLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          loading="lazy"
        />
      </div>
      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#111827', lineHeight: '1.3' }}>
        {product.title}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>
          ${product.price.toFixed(2)}
        </span>
        <StarRating rating={product.rating} count={product.rating} />
      </div>
    </div>
  );
}
