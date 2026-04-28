import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import StarRating from './StarRating';

interface Props {
  product: Product;
}

const ProductCard = React.memo(function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="border border-gray-200 rounded-lg p-3 cursor-pointer bg-white transition-shadow duration-200 flex flex-col gap-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="w-full h-36 overflow-hidden rounded-md bg-gray-50 relative">
        {!imgLoaded && <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: '6px' }} />}
        <img
          src={product.thumbnail}
          alt={product.title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      </div>
      <p className="m-0 font-semibold text-sm text-gray-900 leading-[1.3]">{product.title}</p>
      <div className="flex items-center gap-2">
        <span className="font-bold text-base text-gray-900">${product.price.toFixed(2)}</span>
        <StarRating rating={product.rating} count={product.rating} />
      </div>
    </div>
  );
});

export default ProductCard;
