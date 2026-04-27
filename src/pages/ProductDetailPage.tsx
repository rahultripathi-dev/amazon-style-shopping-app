import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import { useFilterContext } from '../context/FilterContext';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import type { Product } from '../types';
import styles from './ProductDetailPage.module.css';

const noop = () => {};

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
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Header searchQuery="" onSearchChange={noop} onMenuToggle={noop} />
        <div className={styles.container}>
          <div className={`shimmer ${styles.skeletonBackBtn}`} />
          <div className={styles.card}>
            <div className={styles.skeletonLeft}>
              <div className={`shimmer ${styles.skeletonImage}`} />
              <div className={styles.skeletonThumbRow}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`shimmer ${styles.skeletonThumb}`} />
                ))}
              </div>
            </div>
            <div className={styles.skeletonRight}>
              <div className="shimmer" style={{ height: '32px', width: '60%', borderRadius: '4px' }} />
              <div className={styles.skeletonPriceRow}>
                <div className="shimmer" style={{ height: '36px', width: '80px', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '20px', width: '120px', borderRadius: '4px' }} />
              </div>
              <div className={styles.skeletonMetaLines}>
                <div className="shimmer" style={{ height: '14px', width: '40%', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '14px', width: '35%', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '14px', width: '30%', borderRadius: '4px' }} />
              </div>
              <div className={styles.skeletonSection}>
                <div className="shimmer" style={{ height: '18px', width: '30%', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '14px', width: '100%', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '14px', width: '90%', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '14px', width: '80%', borderRadius: '4px' }} />
              </div>
              <div className={styles.skeletonReviews}>
                <div className="shimmer" style={{ height: '18px', width: '25%', borderRadius: '4px' }} />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className={styles.skeletonReviewCard}>
                    <div className="shimmer" style={{ height: '14px', width: '40%', borderRadius: '4px' }} />
                    <div className="shimmer" style={{ height: '12px', width: '90%', borderRadius: '4px' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <Header searchQuery="" onSearchChange={noop} onMenuToggle={noop} />
        <div className={styles.errorWrap}>
          <p className={styles.errorText}>{error ?? 'Product not found.'}</p>
          <button onClick={() => navigate('/')} className={styles.backBtn}>← Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header searchQuery="" onSearchChange={noop} onMenuToggle={noop} />

      <div className={styles.container}>
        <button onClick={() => navigate('/')} className={styles.backBtn}>← Back</button>

        <div className={styles.card}>

          {/* Images */}
          <div className={styles.imageCol}>
            <div className={styles.mainImageWrap}>
              {!imgLoaded && <div className="shimmer" style={{ position: 'absolute', inset: 0 }} />}
              <img
                src={selectedImage}
                alt={product.title}
                onLoad={() => setImgLoaded(true)}
                className={`${styles.mainImage} ${imgLoaded ? styles.mainImageLoaded : ''}`}
              />
            </div>

            <div className={styles.thumbRow}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`${styles.thumb} ${selectedImage === img ? styles.thumbActive : ''}`}
                />
              ))}
            </div>

            {productIds.length > 0 && (
              <div className={styles.navRow}>
                <button
                  onClick={() => prevId && navigate(`/product/${prevId}`, { replace: true })}
                  disabled={!prevId}
                  className={styles.navBtn}
                >
                  ← Prev
                </button>
                {productIds.map((pid, i) => (
                  <button
                    key={pid}
                    onClick={() => navigate(`/product/${pid}`, { replace: true })}
                    className={`${styles.navBtn} ${pid === Number(id) ? styles.navBtnActive : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => nextId && navigate(`/product/${nextId}`, { replace: true })}
                  disabled={!nextId}
                  className={styles.navBtn}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <h1 className={styles.productTitle}>{product.title}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              <StarRating rating={product.rating} count={product.rating} />
            </div>

            <div className={styles.metaList}>
              <span><strong>Brand:</strong> {product.brand}</span>
              <span><strong>Category:</strong> {product.category}</span>
              <span><strong>Stock:</strong> {product.stock} units</span>
              {product.discountPercentage > 0 && (
                <span className={styles.discount}>
                  <strong>Discount:</strong> {product.discountPercentage.toFixed(1)}% off
                </span>
              )}
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.description}>{product.description}</p>
            </div>

            {product.reviews?.length > 0 && (
              <div>
                <h2 className={styles.reviewsTitle}>Reviews</h2>
                <div className={styles.reviewList}>
                  {product.reviews.map((review, i) => (
                    <div key={i} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <strong className={styles.reviewerName}>{review.reviewerName}</strong>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
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
