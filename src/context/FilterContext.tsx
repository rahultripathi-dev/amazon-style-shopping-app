import React, { createContext, useContext, useState } from 'react';
import type { Filters } from '../types';

interface FilterContextType {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  productIds: number[];
  setProductIds: (ids: number[]) => void;
}

const defaultFilters: Filters = {
    category: '',
    brands: [],
    minPrice: '',
    maxPrice: '',
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [productIds, setProductIds] = useState<number[]>([]);

  return (
    <FilterContext.Provider value={{ filters, setFilters, page, setPage, productIds, setProductIds }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext(): FilterContextType {
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error('useFilterContext must be used inside FilterProvider');
    return ctx;
}
