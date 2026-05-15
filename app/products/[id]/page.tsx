'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  ChevronRightIcon,
  StarIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Button from '@/app/components/ui/Button';
import { FaFacebook as FacebookIcon, FaTwitter as TwitterIcon } from 'react-icons/fa';
import { useCallback, useMemo } from 'react';
import { Pagination, Product, RelatedProduct, Review, ReviewStats } from '@/types/productDetail';
import { useSession } from 'next-auth/react';




// Image Gallery Component
const ImageGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {isZoomed && (
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${images[selectedImage]})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '200%',
              opacity: 0.95,
            }}
          />
        )}
      </motion.div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-black' : 'border-transparent'
                }`}
            >
              <Image src={image} alt={`${name} - Image ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Quantity Selector Component
const QuantitySelector = ({ quantity, setQuantity, stock }: { quantity: number; setQuantity: (q: number) => void; stock: number }) => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-gray-600">Quantity:</span>
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          disabled={quantity >= stock}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
      <span className="text-sm text-gray-500">{stock} items available</span>
    </div>
  );
};

// Add to Cart Button Component
const AddToCartButton = ({
  product,
  onAddToCart
}: {
  product: Product;
  quantity: number;
  onAddToCart: () => void;
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    onAddToCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleClick}
        variant="primary"
        size="lg"
        fullWidth
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? (
          'Out of Stock'
        ) : isAdded ? (
          <span className="flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Added to Cart!
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <ShoppingCartIcon className="w-5 h-5 mr-2" />
            Add to Cart
          </span>
        )}
      </Button>

      {product.stock > 0 && product.stock < 10 && (
        <p className="text-sm text-orange-600 text-center">
          Only {product.stock} left in stock - order soon
        </p>
      )}
    </div>
  );
};

// Share Modal Component
const ShareModal = ({ isOpen, onClose, productName }: { isOpen: boolean; onClose: () => void; productName: string }) => {
  const shareOptions = [
    { icon: FacebookIcon, name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
    { icon: TwitterIcon, name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(productName)}` },
    { icon: EnvelopeIcon, name: 'Email', url: `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(window.location.href)}` },
  ];

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 max-w-md mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Share this product</h3>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-2">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <option.icon className="w-5 h-5" />
              <span>{option.name}</span>
            </a>
          ))}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              onClose();
            }}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full"
          >
            <LinkIcon className="w-5 h-5" />
            <span>Copy link</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

// Product Info Component
const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  onAddToCart
}: {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  onAddToCart: () => void;
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="space-y-6 text-gray-800">
      <div>
        <Link href={`/categories/${product.category}`} className="text-sm text-gray-500 hover:text-black capitalize">
          {product.category}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(product.rating) ? (
                <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
              ) : (
                <StarIcon key={i} className="w-5 h-5 text-gray-300" />
              )
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {product.rating} out of 5 ({product.reviews} reviews)
          </span>
        </div>
      </div>

      <div className="border-t border-b py-4">
        <div className="flex items-center space-x-3">
          {product.isOnSale && product.comparePrice ? (
            <>
              <span className="text-3xl font-bold text-red-500">${product.price}</span>
              <span className="text-xl text-gray-400 line-through">${product.comparePrice}</span>
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                Save ${(product.comparePrice - product.price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold">${product.price}</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={product.stock} />

      <div className="space-y-3">
        <AddToCartButton product={product} quantity={quantity} onAddToCart={onAddToCart} />

        <div className="flex space-x-3">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isWishlisted ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
            <span>Wishlist</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShareIcon className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-3">
          <TruckIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm">Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center space-x-3">
          <ArrowPathIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm">30-day easy returns</span>
        </div>
        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm">Secure payment</span>
        </div>
      </div>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} productName={product.name} />
    </div>
  );
};

// Specifications Component
const Specifications = ({ specifications }: { specifications?: Record<string, string> }) => {
  if (!specifications || Object.keys(specifications).length === 0) return null;

  return (
    <div className="border rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="flex justify-between py-2 border-b">
            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reviews Component
const Reviews = ({
  productId,
  initialReviews,
  onReviewSubmitted
}: {
  productId: string;
  initialReviews: Review[];
  onReviewSubmitted?: () => void;
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: [] as string[]
  });

  // Calculate statistics from reviews data
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: []
      };
    }

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: reviews.filter(r => Math.floor(r.rating) === stars).length,
      percentage: (reviews.filter(r => Math.floor(r.rating) === stars).length / reviews.length) * 100,
    }));

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution
    };
  }, [reviews]);

  // Sort reviews based on selected option
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      return a.rating - b.rating;
    });
  }, [reviews, sortBy]);

  // Fetch reviews from API
  const fetchReviews = useCallback(async (page = 1, sort = sortBy) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&page=${page}&limit=10&sortBy=${sort}`);
      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          setReviews(data.data);
        } else {
          setReviews(prev => [...prev, ...data.data]);
        }
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId, sortBy]);

  // Initial fetch or when sort changes
  useEffect(() => {
    fetchReviews(1, sortBy);
  }, [fetchReviews, sortBy]);

  // Submit review handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ...newReview
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Reset form
      setNewReview({ rating: 5, title: '', comment: '', images: [] });
      setShowReviewForm(false);

      // Refresh reviews
      await fetchReviews(1, sortBy);

      // Callback if provided
      if (onReviewSubmitted) onReviewSubmitted();

    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark review as helpful
  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setReviews(prev => prev.map(review =>
          review._id === reviewId
            ? { ...review, helpful: data.helpful }
            : review
        ));
      }
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  // Load more reviews (pagination)
  const loadMoreReviews = async () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      await fetchReviews(pagination.currentPage + 1, sortBy);
    }
  };

  return (
    <div className="space-y-6 text-gray-600">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border rounded-xl p-6 bg-gray-50"
        >
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    {star <= newReview.rating ? (
                      <StarSolid className="w-8 h-8 text-yellow-400" />
                    ) : (
                      <StarIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            {submissionError && (
              <div className="text-red-600 text-sm">{submissionError}</div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Statistics Section */}
      {reviewStats.totalReviews > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold">{reviewStats.averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center md:justify-start mt-2">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(reviewStats.averageRating) ? (
                    <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <StarIcon key={i} className="w-5 h-5 text-gray-300" />
                  )
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Based on {reviewStats.totalReviews} reviews
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {reviewStats.ratingDistribution.map(({ stars, percentage }) => (
                <div key={stars} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{stars} stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12">{Math.round(percentage)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Dropdown */}
      <div className="flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
          className="px-3 py-1 border rounded-lg focus:outline-none focus:border-black"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && reviews.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      )}

      {/* Reviews List */}
      {!loading && sortedReviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this product!
        </div>
      )}

      <div className="space-y-4">
        {sortedReviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.userAvatar ? (
                      <Image
                        src={review.userAvatar}
                        alt={review.userName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-gray-500 font-semibold">
                        {review.userName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{review.userName || 'Anonymous'}</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? (
                          <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                {review.verified && (
                  <span className="text-xs text-green-600">✓ Verified Purchase</span>
                )}
              </div>
            </div>

            <h4 className="font-semibold mt-2">{review.title}</h4>
            <p className="text-gray-600 mt-1">{review.comment}</p>

            {/* Helpful Button */}
            <button
              onClick={() => handleMarkHelpful(review._id)}
              className="mt-3 text-sm text-gray-500 hover:text-black transition-colors"
            >
              👍 Helpful ({review.helpful || 0})
            </button>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {pagination && pagination.currentPage < pagination.totalPages && (
        <div className="text-center">
          <button
            onClick={loadMoreReviews}
            disabled={loading}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
};


// Related Products Component
const RelatedProducts = ({ products, currentProductId }: { products: RelatedProduct[]; currentProductId: string }) => {
  const filteredProducts = products.filter(p => p._id !== currentProductId).slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="mt-12 text-gray-800">
      <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link href={`/products/${product._id}`}>
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="mt-3">
                <h4 className="font-semibold group-hover:text-gray-600">{product.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  {product.isOnSale && product.comparePrice ? (
                    <>
                      <span className="font-bold text-red-500">${product.price}</span>
                      <span className="text-sm text-gray-400 line-through">${product.comparePrice}</span>
                    </>
                  ) : (
                    <span className="font-bold">${product.price}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating) ? (
                      <StarSolid key={i} className="w-3 h-3 text-yellow-400" />
                    ) : (
                      <StarIcon key={i} className="w-3 h-3 text-gray-300" />
                    )
                  ))}
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Breadcrumb Component
const Breadcrumb = ({ product }: { product: Product }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-black">Home</Link>
      <ChevronRightIcon className="w-4 h-4" />
      <Link href="/products" className="hover:text-black">Products</Link>
      <ChevronRightIcon className="w-4 h-4" />
      <Link href={`/categories/${product.category}`} className="hover:text-black capitalize">
        {product.category}
      </Link>
      <ChevronRightIcon className="w-4 h-4" />
      <span className="text-black">{product.name}</span>
    </nav>
  );
};

// Loading Skeleton
const ProductSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-2xl"></div>
      </div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);



// Main Single Product Page Component
export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { data: session } = useSession();


  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Fetch product data by ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        }

        // Fetch related products (same category)
        if (data.data?.category) {
          const relatedRes = await fetch(`/api/products?category=${data.data.category}&limit=5`);
          const relatedData = await relatedRes.json();
          if (relatedData.success) {
            setRelatedProducts(relatedData.data);
          }
        }

        // Mock reviews (replace with actual API call)
        setReviews([]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);


  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Check if user is logged in
      const isLoggedIn = session.user.id;


      if (isLoggedIn) {
        // ✅ LOGGED IN USER - Backend API call
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: quantity
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to add to cart');
        }

        console.log('Product added to cart in backend');
      } else {
        throw new Error
      }

      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));

      // Optional: Show success toast/notification
      console.log('Product added to cart successfully');

    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Optional: Show error toast/notification
      alert(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };


  if (loading) return <ProductSkeleton />;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ImageGallery images={product.images} name={product.name} />
          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>

        <div className="mt-12">
          <div className="border-b flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-lg font-semibold transition-colors ${activeTab === 'description' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
                }`}
            >
              Description
            </button>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <button
                onClick={() => setActiveTab('specifications')}
                className={`pb-3 text-lg font-semibold transition-colors ${activeTab === 'specifications' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
                  }`}
              >
                Specifications
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-lg font-semibold transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
                }`}
            >
              Reviews
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose max-w-none"
              >
                <p className="text-gray-600 leading-relaxed">{product.longDescription || product.description}</p>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Specifications specifications={product.specifications} />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Reviews productId={product._id} initialReviews={reviews} />
              </motion.div>
            )}
          </div>
        </div>

        <RelatedProducts products={relatedProducts} currentProductId={product._id} />
      </div>
    </div>
  );
}