'use client';


import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon,
  HeartIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Button from '@/app/components/ui/Button';

interface SearchResult {
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
  isOnSale: boolean;
  isNewProduct: boolean;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
  onSale: boolean;
  isNewProduct: boolean;
}

interface FilterSectionProps {
  title: string;
  section: 'categories' | 'price' | 'rating' | 'other';
  children: React.ReactNode;
}


export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 1000],
    rating: null,
    inStock: false,
    onSale: false,
    isNewProduct: false,
  });

  const itemsPerPage = 12;

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query && !categoryParam) {
        setResults([]);
        setFilteredResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = `/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(categoryParam)}`;
        const response = await fetch(url);
        const data = await response.json();
        setResults(data.results);
        setFilteredResults(data.results);
        setSuggestions(data.suggestions || []);
        
        if (query) {
          saveRecentSearch(query);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, categoryParam]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...results];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    // Price filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(p => p.rating >= filters.rating!);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Sale filter
    if (filters.onSale) {
      filtered = filtered.filter(p => p.isOnSale);
    }

    // New filter
    if (filters.isNewProduct) {
      filtered = filtered.filter(p => p.isNewProduct);
    }

    // Sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNewProduct ? 1 : 0) - (a.isNewProduct ? 1 : 0));
        break;
      default:
        // relevance - keep original order
        break;
    }

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [results, filters, sortBy]);

  // Get unique categories from results
  const categories = [...new Set(results.map(p => p.category))];
  const maxPrice = Math.max(...results.map(p => p.price), 1000);
  const priceRange: [number, number] = [0, maxPrice];

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      rating: null,
      inStock: false,
      onSale: false,
      isNewProduct: false,
    });
  };

  const hasActiveFilters = () => {
    return filters.categories.length > 0 ||
      filters.priceRange[1] < maxPrice ||
      filters.rating !== null ||
      filters.inStock ||
      filters.onSale ||
      filters.isNewProduct;
  };

  // Product Card Component
  const ProductCard = ({ product, index }: { product: SearchResult; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      >
        <Link href={`/products/${product.slug}`}>
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 space-y-1">
              {product.isOnSale && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  SALE
                </div>
              )}
              {product.isNewProduct && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Only {product.stock} left
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
              {isHovered && product.stock > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-2 left-2 right-2 flex justify-center space-x-2"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic
                    }}
                    className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
            
            {/* Rating */}
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

            {/* Price */}
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

            <p className="text-xs text-gray-500 mt-2 capitalize">{product.category}</p>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Product List View Component
  const ProductListItem = ({ product, index }: { product: SearchResult; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 h-48 flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.isOnSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              SALE
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-xl mb-2 hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                i < Math.floor(product.rating) ? (
                  <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                ) : (
                  <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                )
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {product.isOnSale && product.comparePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-500">${product.price}</span>
                  <span className="text-gray-400 line-through ml-2">${product.comparePrice}</span>
                </>
              ) : (
                <span className="text-2xl font-bold">${product.price}</span>
              )}
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  // Filter Sidebar Component
  const FilterSidebar = ({ onClose }: { onClose?: () => void }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [expandedSections, setExpandedSections] = useState({
      categories: true,
      price: true,
      rating: true,
      other: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const applyFilters = () => {
      setFilters(localFilters);
      if (onClose) onClose();
    };

    const FilterSection = ({ title, section, children }: FilterSectionProps) => (
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection(section)}
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

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h3 className="text-xl font-bold">Filters</h3>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <FilterSection title="Categories" section="categories">
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
        )}

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
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

        {/* Rating */}
        <FilterSection title="Customer Rating" section="rating">
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

        {/* Other Filters */}
        <FilterSection title="Other Filters" section="other">
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
                checked={localFilters.isNewProduct}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  isNewProduct: e.target.checked,
                })}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm">New Arrivals</span>
            </label>
          </div>
        </FilterSection>

        {/* Filter Actions */}
        <div className="mt-6 space-y-3">
          <Button onClick={applyFilters} variant="primary" size="md" fullWidth>
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" size="md" fullWidth>
            Reset All
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Searching for products...</p>
        </div>
      </div>
    );
  }

  return (
<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>}>      <div className="container mx-auto px-4">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Search Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            {query && (
              <span>
                Found <span className="font-semibold">{filteredResults.length}</span> results for {`"`}
                <span className="font-semibold">{query}</span>{`"`}
              </span>
            )}
            {categoryParam && !query && (
              <span>
                Showing <span className="font-semibold">{filteredResults.length}</span> products in {`"`}
                <span className="font-semibold capitalize">{categoryParam}</span>{`"`}
              </span>
            )}
            {!query && !categoryParam && (
              <span>Showing all <span className="font-semibold">{filteredResults.length}</span> products</span>
            )}
          </p>
        </motion.div>

        {/* Suggestions */}
        {suggestions.length > 0 && query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <p className="text-sm text-gray-500 mb-2">Did you mean:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && !categoryParam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-sm text-gray-500 mb-2">Recent Searches:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {term}
                </Link>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem('recentSearches');
                  setRecentSearches([]);
                }}
                className="px-3 py-1 text-sm text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Filter and Sort Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters() && (
                <span className="bg-black text-white text-xs rounded-full px-2 py-0.5">
                  {filters.categories.length + (filters.rating ? 1 : 0) + 
                   (filters.inStock ? 1 : 0) + (filters.onSale ? 1 : 0) + 
                   (filters.isNewProduct ? 1 : 0) + (filters.priceRange[1] < maxPrice ? 1 : 0)}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-1 border rounded-lg p-1 bg-white">
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

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border rounded-lg focus:outline-none focus:border-black"
            >
              <option value="relevance">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Active Filters:</span>
            {filters.categories.map(cat => (
              <span key={cat} className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span className="capitalize">{cat}</span>
                <button onClick={() => setFilters({
                  ...filters,
                  categories: filters.categories.filter(c => c !== cat)
                })}>
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.rating && (
              <span className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>{filters.rating}+ Stars</span>
                <button onClick={() => setFilters({ ...filters, rating: null })}>
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.priceRange[1] < maxPrice && (
              <span className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>Under ${filters.priceRange[1]}</span>
                <button onClick={() => setFilters({ ...filters, priceRange: [0, maxPrice] })}>
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.inStock && (
              <span className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>In Stock</span>
                <button onClick={() => setFilters({ ...filters, inStock: false })}>
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.onSale && (
              <span className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>On Sale</span>
                <button onClick={() => setFilters({ ...filters, onSale: false })}>
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isNewProduct  && (
              <span className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>New Arrivals</span>
                <button onClick={() => setFilters({ ...filters, isNewProduct: false })}>
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {paginatedResults.length} of {filteredResults.length} products
        </div>

        {/* Search Results */}
        {filteredResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {`We couldn't find any products matching your search.`}
            </p>
            <div className="space-x-3">
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
              <Link href="/products">
                <Button variant="primary">
                  Browse All Products
                </Button>
              </Link>
            </div>

            {/* Suggestions for empty results */}
            {query && (
              <div className="mt-8 pt-6 border-t">
                <p className="text-gray-600 mb-3">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['shirt', 'shoes', 'bag', 'watch', 'electronics'].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${term}`}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedResults.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedResults.map((product, index) => (
              <ProductListItem key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === page
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 3 || page === currentPage + 3) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
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
              <FilterSidebar onClose={() => setIsFilterOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Suspense>
  );
}