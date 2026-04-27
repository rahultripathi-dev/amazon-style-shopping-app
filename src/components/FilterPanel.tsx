import React, { useState } from 'react';
import type { Category, Filters } from '../types';

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

const shimmerWidths = ['w-[60%]', 'w-[75%]', 'w-[90%]'];

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
    <aside className="w-55 shrink-0 flex flex-col gap-6 overflow-y-auto">

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full py-1.5 pr-2 pl-8 border border-gray-300 rounded-md text-sm bg-white"
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="font-bold text-base">Filters</span>
        <button onClick={onReset} className="bg-transparent border-0 text-blue-600 cursor-pointer text-[13px] p-0">Reset all</button>
      </div>

      {/* Categories */}
      <section>
        <p className="m-0 mb-2.5 font-semibold text-sm text-gray-700">Category</p>
        <div className="flex flex-col gap-2">
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`shimmer h-4 rounded ${shimmerWidths[i % 3]}`} />
              ))
            : categories.map(cat => (
                <label key={cat.slug} className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
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
        <p className="m-0 mb-2.5 font-semibold text-sm text-gray-700">Price Range</p>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={minInput}
            onChange={e => setMinInput(e.target.value)}
            onKeyDown={handlePriceKeyDown}
            className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-sm bg-white"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxInput}
            onChange={e => setMaxInput(e.target.value)}
            onKeyDown={handlePriceKeyDown}
            className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-sm bg-white"
          />
        </div>
        <button onClick={handlePriceApply} className="w-full py-1.75 bg-blue-600 text-white border-0 rounded-md cursor-pointer font-semibold text-sm">Apply</button>
      </section>

      {/* Brands */}
      {allBrands.length > 0 && (
        <section>
          <p className="m-0 mb-2.5 font-semibold text-sm text-gray-700">Brand</p>
          <div className="flex flex-col gap-2 max-h-50 overflow-y-auto">
            {allBrands.map(brand => (
              <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
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
