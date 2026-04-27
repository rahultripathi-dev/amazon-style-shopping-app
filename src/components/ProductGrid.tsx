import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface Props {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export default function ProductGrid({ products, loading, error }: Props) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
        minHeight: '580px',
        alignContent: 'start',
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="shimmer" style={{ width: '100%', aspectRatio: '1', borderRadius: '6px' }} />
            <div className="shimmer" style={{ height: '14px', width: '80%' }} />
            <div className="shimmer" style={{ height: '14px', width: '50%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#6b7280' }}>No products match your filters.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '16px',
      flex: 1,
      minHeight: '580px',
      alignContent: 'start',
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const centerStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '580px',
};

