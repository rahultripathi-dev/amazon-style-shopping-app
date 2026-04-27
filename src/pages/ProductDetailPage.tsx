import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import { useFilterContext } from '../context/FilterContext';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import type { Product } from '../types';

const noop = () => {};

const navBtnBase = 'px-2.5 py-1.5 rounded-md border cursor-pointer text-[13px] [&:hover:not(:disabled)]:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60';
const navBtnDefault = 'bg-white text-gray-900 font-normal border-gray-200';
const navBtnActive = 'bg-blue-600 text-white font-semibold border-blue-600';

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
      <div className="min-h-screen bg-gray-100">
        <Header searchQuery="" onSearchChange={noop} onMenuToggle={noop} />
        <div className="max-w-250 mx-auto px-4 py-6">
          <div className="shimmer h-9 w-20 rounded-md" />
          <div className="flex gap-10 mt-5 bg-white rounded-xl p-8 flex-wrap">
            <div className="flex-[0_0_360px] flex flex-col gap-3">
              <div className="shimmer w-full aspect-square rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="shimmer w-15 h-15 rounded-md shrink-0" />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-65 flex flex-col gap-4">
              <div className="shimmer h-8 w-[60%] rounded" />
              <div className="flex gap-3 items-center">
                <div className="shimmer h-9 w-20 rounded" />
                <div className="shimmer h-5 w-30 rounded" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="shimmer h-3.5 w-[40%] rounded" />
                <div className="shimmer h-3.5 w-[35%] rounded" />
                <div className="shimmer h-3.5 w-[30%] rounded" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="shimmer h-4.5 w-[30%] rounded" />
                <div className="shimmer h-3.5 w-full rounded" />
                <div className="shimmer h-3.5 w-[90%] rounded" />
                <div className="shimmer h-3.5 w-[80%] rounded" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="shimmer h-4.5 w-1/4 rounded" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg flex flex-col gap-2">
                    <div className="shimmer h-3.5 w-[40%] rounded" />
                    <div className="shimmer h-3 w-[90%] rounded" />
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
      <div className="min-h-screen bg-gray-100">
        <Header searchQuery="" onSearchChange={noop} onMenuToggle={noop} />
        <div className="flex flex-col items-center justify-center min-h-100 gap-4">
          <p className="text-red-600 font-semibold">{error ?? 'Product not found.'}</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm font-medium">← Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header searchQuery="" onSearchChange={noop} onMenuToggle={noop} />

      <div className="max-w-250 mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm font-medium">← Back</button>

        <div className="flex gap-10 mt-5 bg-white rounded-xl p-8 flex-wrap">

          {/* Images */}
          <div className="flex-[0_0_360px] flex flex-col gap-3">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200 relative">
              {!imgLoaded && <div className="shimmer" style={{ position: 'absolute', inset: 0 }} />}
              <img
                src={selectedImage}
                alt={product.title}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-15 h-15 object-contain rounded-md cursor-pointer bg-gray-50 ${selectedImage === img ? 'border-2 border-blue-600' : 'border border-gray-200'}`}
                />
              ))}
            </div>

            {productIds.length > 0 && (
              <div className="flex justify-center items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => prevId && navigate(`/product/${prevId}`, { replace: true })}
                  disabled={!prevId}
                  className={`${navBtnBase} ${navBtnDefault}`}
                >
                  ← Prev
                </button>
                {productIds.map((pid, i) => (
                  <button
                    key={pid}
                    onClick={() => navigate(`/product/${pid}`, { replace: true })}
                    className={`${navBtnBase} ${pid === Number(id) ? navBtnActive : navBtnDefault}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => nextId && navigate(`/product/${nextId}`, { replace: true })}
                  disabled={!nextId}
                  className={`${navBtnBase} ${navBtnDefault}`}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-65 flex flex-col gap-4">
            <h1 className="m-0 text-2xl font-bold text-gray-900">{product.title}</h1>

            <div className="flex items-center gap-3">
              <span className="text-[28px] font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <StarRating rating={product.rating} count={product.rating} />
            </div>

            <div className="flex flex-col gap-1.5 text-sm text-gray-700">
              <span><strong>Brand:</strong> {product.brand}</span>
              <span><strong>Category:</strong> {product.category}</span>
              <span><strong>Stock:</strong> {product.stock} units</span>
              {product.discountPercentage > 0 && (
                <span className="text-green-600">
                  <strong>Discount:</strong> {product.discountPercentage.toFixed(1)}% off
                </span>
              )}
            </div>

            <div>
              <h2 className="text-base font-semibold m-0 mb-2">Description</h2>
              <p className="m-0 text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {product.reviews?.length > 0 && (
              <div>
                <h2 className="text-base font-semibold m-0 mb-3">Reviews</h2>
                <div className="flex flex-col gap-3">
                  {product.reviews.map((review, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <strong className="text-sm">{review.reviewerName}</strong>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="m-0 text-[13px] text-gray-600">{review.comment}</p>
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
