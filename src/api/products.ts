import type { Product, Category, ProductsResponse } from '../types';

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(limit: number, skip: number, signal?: AbortSignal): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}&select=id,title,price,rating,thumbnail,brand,category`, { signal });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductsByCategory(slug: string, signal?: AbortSignal): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products/category/${slug}?limit=200`, { signal });
  if (!res.ok) throw new Error('Failed to fetch category products');
  return res.json();
}

export async function fetchProductById(id: string, signal?: AbortSignal): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, { signal });
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`, { signal });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
