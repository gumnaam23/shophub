'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EyeIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type StatusFilter = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/account/orders');
        const data = await response.json();
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchQuery, orders]);

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { icon: ClockIcon, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Pending' },
      processing: { icon: ArrowPathIcon, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
      shipped: { icon: TruckIcon, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Shipped' },
      delivered: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
      cancelled: { icon: XCircleIcon, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPaymentStatusConfig = (status: string) => {
    return status === 'paid'
      ? { color: 'text-green-600', bg: 'bg-green-100', label: 'Paid' }
      : { color: 'text-red-600', bg: 'bg-red-100', label: 'Pending' };
  };

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track and manage all your orders in one place
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-4 mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === filter.value
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black w-full md:w-64"
            />
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-12 text-center"
        >
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No orders matching "${searchQuery}"`
              : "You haven't placed any orders yet"}
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4 text-gray-600">
          {filteredOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedOrder === order._id;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <Link href={`/account/orders/${order._id}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.color}`}>
                          {paymentConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </Link>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                        <span className="text-sm font-semibold">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
                  {order.trackingNumber && (
                    <div className="flex items-center space-x-2 text-sm">
                      <TruckIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <Link href={`/account/orders/${order._id}/invoice`}>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-black">
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        <span>Invoice</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t p-6 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Items Details */}
                      <div>
                        <h4 className="font-semibold mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className="relative w-12 h-12 rounded overflow-hidden bg-white">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{item.name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-semibold mb-3">Order Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>Free</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>${(order.total * 0.1).toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {order.estimatedDelivery && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <TruckIcon className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">
                                Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 space-y-2">
                          {order.status === 'delivered' && (
                            <Link href={`/account/orders/${order._id}/review`}>
                              <Button variant="outline" size="sm" fullWidth>
                                Write a Review
                              </Button>
                            </Link>
                          )}
                          {order.status === 'pending' && (
                            <button className="w-full text-sm text-red-600 hover:text-red-700">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}