'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  images: string[];
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  category: string;
  lastUpdated: string;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof InventoryItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      setInventory(data.inventory);
      setFilteredInventory(data.inventory);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = inventory;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    setFilteredInventory(filtered);
  }, [searchQuery, statusFilter, inventory, sortField, sortDirection]);

  const updateStock = async (productId: string, newStock: number) => {
    setUpdatingStock(productId);
    try {
      const response = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });

      if (response.ok) {
        await fetchInventory();
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setUpdatingStock(null);
    }
  };

  const bulkUpdateStock = async () => {
    if (!confirm(`Update stock for ${selectedProducts.length} products?`)) return;

    try {
      await Promise.all(
        selectedProducts.map(id =>
          fetch(`/api/admin/inventory/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: 0 }), // Example: Set to 0
          })
        )
      );
      await fetchInventory();
      setSelectedProducts([]);
      setShowBulkUpdate(false);
    } catch (error) {
      console.error('Failed to bulk update:', error);
    }
  };

  const toggleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_stock':
        return { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
      case 'low_stock':
        return { icon: ExclamationTriangleIcon, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Low Stock' };
      case 'out_of_stock':
        return { icon: ClockIcon, color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
      default:
        return { icon: ClockIcon, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  const SortIcon = ({ field }: { field: keyof InventoryItem }) => {
    if (sortField !== field) return <ChevronDownIcon className="w-4 h-4 opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const lowStockCount = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out_of_stock').length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-gray-600">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p>
          Track and manage product stock levels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-gray-600 text-3xl font-bold">{inventory.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ClockIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full placeholder-gray-400 pl-10 pr-4 py-2 border rounded-lg text-gray-600 focus:outline-none focus:border-black"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 text-gray-600 py-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          {selectedProducts.length > 0 && (
            <Button
              onClick={() => setShowBulkUpdate(true)}
              variant="outline"
              size="md"
            >
              Bulk Update ({selectedProducts.length})
            </Button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden text-gray-600">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredInventory.length && filteredInventory.length > 0}
                    onChange={() => {
                      if (selectedProducts.length === filteredInventory.length) {
                        setSelectedProducts([]);
                      } else {
                        setSelectedProducts(filteredInventory.map(i => i._id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Product</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('sku')}>
                  <div className="flex items-center space-x-1">
                    <span>SKU</span>
                    <SortIcon field="sku" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('price')}>
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    <SortIcon field="price" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('stock')}>
                  <div className="flex items-center space-x-1">
                    <span>Stock</span>
                    <SortIcon field="stock" />
                  </div>
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
              {filteredInventory.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(item._id)}
                        onChange={() => {
                          if (selectedProducts.includes(item._id)) {
                            setSelectedProducts(selectedProducts.filter(id => id !== item._id));
                          } else {
                            setSelectedProducts([...selectedProducts, item._id]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.images[0] || '/images/placeholder.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{item.sku}</td>
                    <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateStock(item._id, item.stock - 1)}
                          disabled={updatingStock === item._id || item.stock === 0}
                          className="w-6 h-6 rounded border hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="font-semibold w-12 text-center">{item.stock}</span>
                        <button
                          onClick={() => updateStock(item._id, item.stock + 1)}
                          disabled={updatingStock === item._id}
                          className="w-6 h-6 rounded border hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {updatingStock === item._id && (
                        <ArrowPathIcon className="w-5 h-5 animate-spin text-gray-400" />
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
           </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No inventory items found</p>
          </div>
        )}
      </div>

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Bulk Stock Update</h3>
            <p className="text-gray-600 mb-4">
              Update stock for {selectedProducts.length} products
            </p>
            <div className="space-y-3">
              <Button onClick={bulkUpdateStock} variant="primary" size="md" fullWidth>
                Set to Out of Stock
              </Button>
              <Button
                onClick={() => setShowBulkUpdate(false)}
                variant="outline"
                size="md"
                fullWidth
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