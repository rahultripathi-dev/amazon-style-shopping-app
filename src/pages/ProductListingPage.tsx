import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFilterContext } from '../context/FilterContext';
import { useProducts } from '../hooks/useProducts';
import { fetchCategories } from '../api/products';
import FilterPanel from '../components/FilterPanel';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import type { Category, Filters } from '../types';

export default function ProductListingPage() {
    const [showFilters, setShowFilters] = useState(true)
  const { filters, setFilters, page, setPage, setProductIds } = useFilterContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, totalPages, loading, error, allBrands } = useProducts(filters, page);

  useEffect(() => {
    const controller = new AbortController();
    setCategoriesLoading(true);
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setProductIds(products.map(p => p.id));
  }, [products]);

  const handleFilterChange = useCallback((updated: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...updated }));
    setPage(1);
  }, [setFilters, setPage]);

  const handleReset = useCallback(() => {
    setFilters({ category: '', brands: [], minPrice: '', maxPrice: '' });
    setPage(1);
    setSearchQuery('');
  }, [setFilters, setPage]);

  const handleMenuToggle = useCallback(() => setShowFilters(prev => !prev), []);

  const visibleProducts = useMemo(() =>
    searchQuery.trim()
      ? products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : products,
  [products, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onMenuToggle={handleMenuToggle} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {showFilters && (
          <FilterPanel
            categories={categories}
            allBrands={allBrands}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoriesLoading={categoriesLoading}
          />
        )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔍 Filters
            </p>
            <ProductGrid
              products={visibleProducts}
              loading={loading}
              error={error}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
