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
  const [showFilters, setShowFilters] = useState(true);
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
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onMenuToggle={handleMenuToggle} />

      <div className="flex-1 overflow-hidden">
        <div className="max-w-300 mx-auto h-full px-4 py-6 flex flex-col">
          <div className="flex gap-6 flex-1 min-h-0">
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

            <div className="flex-1 flex flex-col min-h-0">
              <p className="m-0 mb-3 font-bold text-base flex items-center gap-1.5">🔍 Filters</p>
              <ProductGrid products={visibleProducts} loading={loading} error={error} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
