import React, { useState } from 'react';
import type { Category, Filters } from '../types';
import styles from './FilterPanel.module.css';

interface Props {
  categories: Category[];
  allBrands: string[];
  filters: Filters;
  onFilterChange: (updated: Partial<Filters>) => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoriesLoading: boolean;
}

const FilterPanel = React.memo(function FilterPanel({ categories, allBrands, filters, onFilterChange, onReset, searchQuery, onSearchChange, categoriesLoading }: Props) {
  const [minInput, setMinInput] = useState(filters.minPrice);
  const [maxInput, setMaxInput] = useState(filters.maxPrice);

  function handleCategoryChange(slug: string) {
    onFilterChange({ category: filters.category === slug ? '' : slug, brands: [] });
  }

  function handleBrandChange(brand: string) {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ brands: updated });
  }

  function handlePriceApply() {
    onFilterChange({ minPrice: minInput, maxPrice: maxInput });
  }

  function handlePriceKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handlePriceApply();
  }

  return (
    <aside className={styles.panel}>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterHeader}>
        <span className={styles.filterTitle}>Filters</span>
        <button onClick={onReset} className={styles.resetBtn}>Reset all</button>
      </div>

      {/* Categories */}
      <section>
        <p className={styles.sectionHead}>Category</p>
        <div className={styles.list}>
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`shimmer ${styles.shimmerLine}`} />
              ))
            : categories.map(cat => (
                <label key={cat.slug} className={styles.label}>
                  <input
                    type="checkbox"
                    checked={filters.category === cat.slug}
                    onChange={() => handleCategoryChange(cat.slug)}
                  />
                  {cat.name}
                </label>
              ))
          }
        </div>
      </section>

      {/* Price Range */}
      <section>
        <p className={styles.sectionHead}>Price Range</p>
        <div className={styles.priceRow}>
          <input
            type="number"
            placeholder="Min"
            value={minInput}
            onChange={e => setMinInput(e.target.value)}
            onKeyDown={handlePriceKeyDown}
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxInput}
            onChange={e => setMaxInput(e.target.value)}
            onKeyDown={handlePriceKeyDown}
            className={styles.input}
          />
        </div>
        <button onClick={handlePriceApply} className={styles.applyBtn}>Apply</button>
      </section>

      {/* Brands */}
      {allBrands.length > 0 && (
        <section>
          <p className={styles.sectionHead}>Brand</p>
          <div className={styles.brandList}>
            {allBrands.map(brand => (
              <label key={brand} className={styles.label}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </section>
      )}

    </aside>
  );
});

export default FilterPanel;
