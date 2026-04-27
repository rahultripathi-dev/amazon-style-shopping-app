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
      <div style={centerStyle}>
        <div style={spinnerStyle} />
        <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading products...</p>
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
  minHeight: '300px',
};

const spinnerStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  border: '4px solid #e5e7eb',
  borderTop: '4px solid #2563eb',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};
