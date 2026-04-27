import React, { use, useEffect, useState } from 'react';
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
  const { filters, setFilters, page, setPage, productIds, setProductIds } = useFilterContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, totalPages, loading, error, allBrands } = useProducts(filters, page);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => {});

    return () => controller.abort();
  }, []);
  useEffect(() => {
    setProductIds(products.map(p => p.id))
  }, [products])

  function handleFilterChange(updated: Partial<Filters>) {
    setFilters(prev => ({ ...prev, ...updated }));
    setPage(1);
  }

  function handleReset() {
    setFilters({ category: '', brands: [], minPrice: '', maxPrice: '' });
    setPage(1);
    setSearchQuery('');
  }

  const visibleProducts = searchQuery.trim()
    ? products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onMenuToggle={() => setShowFilters(prev => !prev)}/>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        { showFilters && <FilterPanel
            categories={categories}
            allBrands={allBrands}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
