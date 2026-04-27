import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';
import styles from './ProductGrid.module.css';

interface Props {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductGrid = React.memo(function ProductGrid({ products, loading, error }: Props) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={`shimmer ${styles.skeletonImage}`} />
            <div className={`shimmer ${styles.skeletonLine} ${styles.skeletonLineLong}`} />
            <div className={`shimmer ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.center}>
        <p className={styles.emptyText}>No products match your filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});

export default ProductGrid;
