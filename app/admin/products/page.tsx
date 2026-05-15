'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBulkAction, setIsBulkAction] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.products.map((p: Product) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, statusFilter, categoryFilter, products]);

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      const response = await fetch(`/api/admin/products/${deletingProduct._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
        setShowDeleteModal(false);
        setDeletingProduct(null);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return;

    try {
      await Promise.all(
        selectedProducts.map(id =>
          fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
        )
      );
      await fetchProducts();
      setSelectedProducts([]);
      setIsBulkAction(false);
    } catch (error) {
      console.error('Failed to bulk delete:', error);
    }
  };

  const handleBulkStatusUpdate = async (status: 'active' | 'draft' | 'archived') => {
    try {
      await Promise.all(
        selectedProducts.map(id =>
          fetch(`/api/admin/products/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          })
        )
      );
      await fetchProducts();
      setSelectedProducts([]);
      setIsBulkAction(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock < 10) return { label: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto text-gray-600">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-600">
            Manage your product catalog ({filteredProducts.length} products)
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="md">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-black"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'draft' | 'archived')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
              <button
                onClick={() => setIsBulkAction(true)}
                className="px-3 py-1 bg-black text-white rounded-lg text-sm"
              >
                Bulk Actions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Action Modal */}
      {isBulkAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Bulk Actions</h3>
              <button onClick={() => setIsBulkAction(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleBulkStatusUpdate('active')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                Set as Active
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('draft')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                Set as Draft
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('archived')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                Archive
              </button>
              <button
                onClick={handleBulkDelete}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleAllSelection}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleProductSelection(product._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.images[0] || '/images/placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold">${product.price}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${product.comparePrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{product.stock} units</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' && <CheckCircleIcon className="w-3 h-3" />}
                        {product.status === 'draft' && <ClockIcon className="w-3 h-3" />}
                        {product.status === 'archived' && <XCircleIcon className="w-3 h-3" />}
                        <span className="capitalize">{product.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/admin/products/${product._id}`}>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <PencilIcon className="w-5 h-5 text-gray-600" />
                          </button>
                        </Link>
                        <Link href={`/products/${product._id}`} target="_blank">
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <EyeIcon className="w-5 h-5 text-gray-600" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setDeletingProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <TrashIcon className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              {`Are you sure you want to delete "${deletingProduct.name}"? This action cannot be undone.`}
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleDeleteProduct} variant="primary" size="md">
                Delete
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingProduct(null);
                }}
                variant="outline"
                size="md"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}