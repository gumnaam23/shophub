'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  StarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Button from '@/app/components/ui/Button';
import { useSession } from 'next-auth/react';


// Types
interface Product {
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
  createdAt?: string;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  tags: string[];
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

interface SortOption {
  label: string;
  value: string;
  field: keyof Product;
  order: 'asc' | 'desc';
}

// Filter Section Component - Moved outside render
const FilterSection = ({ 
  title, 
  section, 
  expandedSections, 
  onToggle, 
  children 
}: { 
  title: string; 
  section: string; 
  expandedSections: Record<string, boolean>;
  onToggle: (section: string) => void;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-200 py-4">
    <button
      onClick={() => onToggle(section)}
      className="flex justify-between items-center w-full text-left font-semibold"
    >
      <span>{title}</span>
      {expandedSections[section] ? (
        <ChevronUpIcon className="w-5 h-5" />
      ) : (
        <ChevronDownIcon className="w-5 h-5" />
      )}
    </button>
    <AnimatePresence>
      {expandedSections[section] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 space-y-2"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Filter Sidebar Component
const FilterSidebar = ({ 
  filters, 
  setFilters, 
  categories, 
  tags, 
  priceRange,
  onClose,
  isMobile
}: { 
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  categories: string[];
  tags: string[];
  priceRange: [number, number];
  onClose?: () => void;
  isMobile?: boolean;
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    tags: true,
    other: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section as keyof typeof prev] }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    if (onClose) onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      priceRange: [priceRange[0], priceRange[1]],
      rating: null,
      tags: [],
      inStock: false,
      onSale: false,
      isNew: false,
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    if (onClose) onClose();
  };

  return (
    <div className="p-4 text-gray-600">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <h3 className="text-xl font-bold">Filters</h3>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <FilterSection title="Categories" section="categories" expandedSections={expandedSections} onToggle={toggleSection}>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.categories.includes(category)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setLocalFilters({
                      ...localFilters,
                      categories: [...localFilters.categories, category],
                    });
                  } else {
                    setLocalFilters({
                      ...localFilters,
                      categories: localFilters.categories.filter(c => c !== category),
                    });
                  }
                }}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm capitalize">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" section="price" expandedSections={expandedSections} onToggle={toggleSection}>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">${localFilters.priceRange[0]}</span>
            <span className="text-sm">${localFilters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            value={localFilters.priceRange[1]}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              priceRange: [priceRange[0], parseInt(e.target.value)],
            })}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Customer Rating" section="rating" expandedSections={expandedSections} onToggle={toggleSection}>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2">
              <input
                type="radio"
                name="rating"
                checked={localFilters.rating === rating}
                onChange={() => setLocalFilters({
                  ...localFilters,
                  rating: localFilters.rating === rating ? null : rating,
                })}
                className="text-black focus:ring-black"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  i < rating ? (
                    <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                  )
                ))}
                <span className="text-sm ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <FilterSection title="Tags" section="tags" expandedSections={expandedSections} onToggle={toggleSection}>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (localFilters.tags.includes(tag)) {
                    setLocalFilters({
                      ...localFilters,
                      tags: localFilters.tags.filter(t => t !== tag),
                    });
                  } else {
                    setLocalFilters({
                      ...localFilters,
                      tags: [...localFilters.tags, tag],
                    });
                  }
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  localFilters.tags.includes(tag)
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Other Filters */}
      <FilterSection title="Other Filters" section="other" expandedSections={expandedSections} onToggle={toggleSection}>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={localFilters.inStock}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                inStock: e.target.checked,
              })}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm">In Stock Only</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={localFilters.onSale}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                onSale: e.target.checked,
              })}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm">On Sale</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={localFilters.isNew}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                isNew: e.target.checked,
              })}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm">New Arrivals</span>
          </label>
        </div>
      </FilterSection>

      {/* Filter Actions */}
      <div className="mt-6 space-y-3">
        <Button onClick={handleApplyFilters} variant="primary" size="md" fullWidth>
          Apply Filters
        </Button>
        <Button onClick={handleResetFilters} variant="outline" size="md" fullWidth>
          Reset All
        </Button>
      </div>
    </div>
  );
};

// Product Card Component


const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const { status } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentImage = 0;

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/wishlist/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product._id }),
          });
          const data = await response.json();
          if (data.success) {
            setIsWishlisted(data.isInWishlist);
          }
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [product._id, status]);

  // Handle add to wishlist
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== 'authenticated') {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login';
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        });
        const data = await response.json();
        if (data.success) {
          setIsWishlisted(false);
          // Dispatch event to update wishlist count in navbar
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        });
        const data = await response.json();
        if (data.success) {
          setIsWishlisted(true);
          // Dispatch event to update wishlist count in navbar
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-gray-600"
    >
      <Link href={`/products/${product._id}`}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <div className="relative w-full h-full">
            <Image
              src={product.images[currentImage]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.isOnSale && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">SALE</div>
            )}
            {product.isNew && (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">NEW</div>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                Only {product.stock} left
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            disabled={isLoading}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform disabled:opacity-50"
          >
            <HeartIcon 
              className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                i < Math.floor(product.rating) ? (
                  <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                ) : (
                  <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                )
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          <div className="flex items-center space-x-2">
            {product.isOnSale && product.comparePrice ? (
              <>
                <span className="text-2xl font-bold text-red-500">${product.price}</span>
                <span className="text-gray-400 line-through">${product.comparePrice}</span>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={index} className="px-3 py-1">...</span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 border rounded-lg ${
              currentPage === page ? 'bg-black text-white' : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
};

// Main Products Page Component
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
    const sortOptions: SortOption[] = useMemo(() => [
    { label: 'Featured', value: 'featured', field: 'isFeatured', order: 'desc' },
    { label: 'Price: Low to High', value: 'price_asc', field: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price_desc', field: 'price', order: 'desc' },
    { label: 'Newest First', value: 'newest', field: 'createdAt', order: 'desc' },
    { label: 'Rating: High to Low', value: 'rating', field: 'rating', order: 'desc' },
  ], []); //

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    rating: null,
    tags: [],
    inStock: false,
    onSale: false,
    isNew: false,
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.rating) {
      result = result.filter(p => p.rating >= filters.rating!);
    }

    if (filters.tags.length > 0) {
      result = result.filter(p => p.tags.some(tag => filters.tags.includes(tag)));
    }

    if (filters.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    if (filters.onSale) {
      result = result.filter(p => p.isOnSale);
    }

    if (filters.isNew) {
      result = result.filter(p => p.isNew);
    }

    const sortOption = sortOptions.find(opt => opt.value === sortBy);
    if (sortOption) {
      result.sort((a, b) => {
        const aVal = a[sortOption.field];
        const bVal = b[sortOption.field];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOption.order === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          return sortOption.order === 'asc' ? (aVal === bVal ? 0 : aVal ? 1 : -1) : (aVal === bVal ? 0 : aVal ? -1 : 1);
        }
        return 0;
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, filters, sortBy, searchQuery, sortOptions]);

  const categories = [...new Set(products.map(p => p.category))];
  const tags = [...new Set(products.flatMap(p => p.tags))];
  const maxPrice = Math.max(...products.map(p => p.price), 1000);
  const priceRange: [number, number] = [0, maxPrice];

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-gray-600">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-2 border rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <FunnelIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <button
              onClick={() => {
                setFilters({
                  categories: [],
                  priceRange: [0, 1000],
                  rating: null,
                  tags: [],
                  inStock: false,
                  onSale: false,
                  isNew: false,
                });
                setSearchQuery('');
              }}
              className="text-black underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </div>

            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden flex">
                    <Link href={`/products/${product.slug}`} className="flex flex-1">
                      <div className="relative w-48 h-48 flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="text-2xl font-bold">${product.price}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      {/* Mobile Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
            >
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                tags={tags}
                priceRange={priceRange}
                onClose={() => setIsFilterOpen(false)}
                isMobile
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}