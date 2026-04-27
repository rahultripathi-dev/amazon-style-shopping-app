export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews: Review[];
  discountPercentage: number;
  stock: number;
}

export interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Filters {
  category: string;
  brands: string[];
  minPrice: string;
  maxPrice: string;
}
