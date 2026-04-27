import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import { useFilterContext } from '../context/FilterContext';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import type { Product } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { productIds } = useFilterContext();
  const currentIndex = productIds.indexOf(Number(id));
  const prevId = currentIndex > 0 ? productIds[currentIndex - 1] : null;
  const nextId = currentIndex < productIds.length - 1 ? productIds[currentIndex + 1] : null;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id!, controller.signal);
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Header searchQuery="" onSearchChange={() => {}} onMenuToggle={() => {}} />
        <div style={centerStyle}>
          <div style={spinnerStyle} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Header searchQuery="" onSearchChange={() => {}} onMenuToggle={() => {}} />
        <div style={centerStyle}>
          <p style={{ color: '#dc2626', fontWeight: 600 }}>{error ?? 'Product not found.'}</p>
          <button onClick={() => navigate('/')} style={backBtnStyle}>← Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Header searchQuery="" onSearchChange={() => {}} onMenuToggle={() => {}} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        <button onClick={() => navigate('/')} style={backBtnStyle}>← Back</button>

        <div style={{ display: 'flex', gap: '40px', marginTop: '20px', backgroundColor: '#fff', borderRadius: '12px', padding: '32px', flexWrap: 'wrap' }}>

          {/* Images */}
          <div style={{ flex: '0 0 360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <img
                src={selectedImage}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '6px',
                    border: selectedImage === img ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb',
                  }}
                />
              ))}
            </div>

            {productIds.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => prevId && navigate(`/product/${prevId}`, { replace: true })}
                  disabled={!prevId}
                  style={navBtnStyle(!prevId)}
                >
                  ← Prev
                </button>
                {productIds.map((pid, i) => (
                  <button
                    key={pid}
                    onClick={() => navigate(`/product/${pid}`, { replace: true })}
                    style={navBtnStyle(false, pid === Number(id))}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => nextId && navigate(`/product/${nextId}`, { replace: true })}
                  disabled={!nextId}
                  style={navBtnStyle(!nextId)}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111827' }}>{product.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>${product.price.toFixed(2)}</span>
              <StarRating rating={product.rating} count={product.rating} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: '#374151' }}>
              <span><strong>Brand:</strong> {product.brand}</span>
              <span><strong>Category:</strong> {product.category}</span>
              <span><strong>Stock:</strong> {product.stock} units</span>
              {product.discountPercentage > 0 && (
                <span style={{ color: '#16a34a' }}>
                  <strong>Discount:</strong> {product.discountPercentage.toFixed(1)}% off
                </span>
              )}
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>Description</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{product.description}</p>
            </div>

            {product.reviews?.length > 0 && (
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0' }}>Reviews</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {product.reviews.map((review, i) => (
                    <div key={i} style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '14px' }}>{review.reviewerName}</strong>
                        <StarRating rating={review.rating} />
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}

const centerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' };
const spinnerStyle: React.CSSProperties = { width: '36px', height: '36px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' };
const backBtnStyle: React.CSSProperties = { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 };
const navBtnStyle = (disabled: boolean, active = false): React.CSSProperties => ({
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  backgroundColor: active ? '#2563eb' : '#fff',
  color: active ? '#fff' : disabled ? '#9ca3af' : '#111827',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: active ? 600 : 400,
  fontSize: '13px',
  opacity: disabled ? 0.6 : 1,
});
