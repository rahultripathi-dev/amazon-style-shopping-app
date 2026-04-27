import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductsByCategory } from '../api/products';
import type { Product } from '../types';
import type { Filters } from '../types';

const ITEMS_PER_PAGE = 8;

interface UseProductsResult {
  products: Product[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  allBrands: string[];
}

export function useProducts(filters: Filters, page: number): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allBrands, setAllBrands] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        let allProducts: Product[] = [];
        let total = 0;

        if (filters.category) {
          const data = await fetchProductsByCategory(filters.category, controller.signal);
          allProducts = data.products;
          total = data.total;
        } else {
          const data = await fetchProducts(200, 0, controller.signal);
          allProducts = data.products;
          total = data.total;
        }
        

        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort();
        setAllBrands(brands);

        let filtered = allProducts;

        if (filters.brands.length > 0) {
          filtered = filtered.filter(p => filters.brands.includes(p.brand));
        }

        if (filters.minPrice !== '') {
          filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
        }

        if (filters.maxPrice !== '') {
          filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
        }

        const computedTotal = filters.brands.length > 0 || filters.minPrice || filters.maxPrice
          ? filtered.length
          : total;

        setTotalPages(Math.ceil(computedTotal / ITEMS_PER_PAGE));

        const start = (page - 1) * ITEMS_PER_PAGE;
        setProducts(filtered.slice(start, start + ITEMS_PER_PAGE));
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [filters, page]);

  return { products, totalPages, loading, error, allBrands };
}
