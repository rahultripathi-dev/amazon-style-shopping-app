import React, { useState } from 'react';
import type { Category, Filters } from '../types';

interface Props {
  categories: Category[];
  allBrands: string[];
  filters: Filters;
  onFilterChange: (updated: Partial<Filters>) => void;
  onReset: () => void;
}

export default function FilterPanel({ categories, allBrands, filters, onFilterChange, onReset }: Props) {
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
    <aside style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '16px' }}>Filters</span>
        <button onClick={onReset} style={linkBtnStyle}>Reset all</button>
      </div>

      {/* Categories */}
      <section>
        <p style={sectionHeadStyle}>Category</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(cat => (
            <label key={cat.slug} style={labelStyle}>
              <input
                type="checkbox"
                checked={filters.category === cat.slug}
                onChange={() => handleCategoryChange(cat.slug)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <p style={sectionHeadStyle}>Price Range</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={minInput}
            onChange={e => setMinInput(e.target.value)}
            onKeyDown={handlePriceKeyDown}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxInput}
            onChange={e => setMaxInput(e.target.value)}
            onKeyDown={handlePriceKeyDown}
            style={inputStyle}
          />
        </div>
        <button onClick={handlePriceApply} style={applyBtnStyle}>Apply</button>
      </section>

      {/* Brands */}
      {allBrands.length > 0 && (
        <section>
          <p style={sectionHeadStyle}>Brand</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {allBrands.map(brand => (
              <label key={brand} style={labelStyle}>
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
}

const sectionHeadStyle: React.CSSProperties = { margin: '0 0 10px 0', fontWeight: 600, fontSize: '14px', color: '#374151' };
const labelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#374151' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' };
const applyBtnStyle: React.CSSProperties = { width: '100%', padding: '7px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' };
const linkBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', padding: 0 };
