'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  StarIcon as StarSolidIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  addedAt: string;
}

export default function WishlistPage() {
  const { status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [movingAll, setMovingAll] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/account/wishlist');
      const data = await response.json();
      if (data.success) {
        setWishlistItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setRemovingId(productId);
    try {
      const response = await fetch('/api/account/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      const data = await response.json();
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        // Dispatch event to update wishlist count in navbar
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = async (item: WishlistItem) => {
    setAddingToCart(item.productId);
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.productId,
          quantity: 1
        }),
      });

      if (response.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const moveAllToCart = async () => {
    setMovingAll(true);
    try {
      const itemsToAdd = wishlistItems.map(item => ({
        productId: item.productId,
        quantity: 1
      }));

      const response = await fetch('/api/cart/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToAdd }),
      });

      const data = await response.json();
      
      if (data.success) {
        window.dispatchEvent(new Event('cartUpdated'));
        // Optional: Clear wishlist after moving all to cart
        // for (const item of wishlistItems) {
        //   await removeFromWishlist(item.productId);
        // }
      }
    } catch (error) {
      console.error('Failed to move all to cart:', error);
    } finally {
      setMovingAll(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-12 text-center"
      >
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6">
          <HeartIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">Please Sign In</h3>
        <p className="text-gray-600 mb-6">
          Sign in to view and manage your wishlist
        </p>
        <Link href="/auth/login">
          <Button variant="primary" size="lg">
            Sign In
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 ">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button
              onClick={moveAllToCart}
              variant="outline"
              size="md"
              disabled={movingAll}
            >
              {movingAll ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Move All to Cart
            </Button>
          )}
        </div>
      </motion.div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-12 text-center"
        >
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6">
            <HeartIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Save items you love to your wishlist and come back to them later
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                layout
                className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <Link href={`/products/${item.productId}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.productId);
                      }}
                      disabled={removingId === item.productId}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform disabled:opacity-50"
                    >
                      {removingId === item.productId ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-gray-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-500 capitalize mb-2">{item.category}</p>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(item.rating) ? (
                          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                        )
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({item.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    {item.comparePrice && item.comparePrice > item.price ? (
                      <>
                        <span className="text-2xl font-bold text-red-500">${item.price}</span>
                        <span className="text-gray-400 line-through">${item.comparePrice}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">${item.price}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => addToCart(item)}
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={!item.inStock || addingToCart === item.productId}
                    >
                      {addingToCart === item.productId ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShoppingCartIcon className="w-4 h-4 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Link href={`/products/${item.productId}`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-400 mt-3">
                    Added on {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}