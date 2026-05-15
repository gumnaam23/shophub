// Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  rating: number;
  reviews: number;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  tags: string[];
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

export interface SortOption {
  label: string;
  value: string;
  field: string;
  order: 'asc' | 'desc';
}
