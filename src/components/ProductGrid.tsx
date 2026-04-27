import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface Props {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductGrid = React.memo(function ProductGrid({ products, loading, error }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 flex-1 min-h-0 content-start overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white flex flex-col gap-2.5">
            <div className="shimmer w-full aspect-square rounded-md" />
            <div className="shimmer h-3.5 rounded w-4/5" />
            <div className="shimmer h-3.5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <p className="text-gray-500">No products match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 flex-1 min-h-0 content-start overflow-hidden">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});

export default ProductGrid;
