'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface Order {
    _id: string;
    orderNumber: string;
    customer: {
        name: string;
        email: string;
    };
    total: number;
    orderStatus: string;
    paymentStatus: string;
    items: number;
    createdAt: string;
    estimatedDelivery?: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/orders');
            const data = await response.json();
            setOrders(data.orders);
            setFilteredOrders(data.orders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = orders;

        if (searchQuery) {
            filtered = filtered.filter(o =>
                o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => o.orderStatus === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [searchQuery, statusFilter, orders]);

    const updateOrderStatus = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            const response = await fetch(`/api/admin/orders/${selectedOrder._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                await fetchOrders();
                setShowStatusModal(false);
                setSelectedOrder(null);
                setNewStatus('');
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: { label: 'Pending', color: 'text-orange-600', bg: 'bg-orange-100', icon: ClockIcon },
            processing: { label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-100', icon: ClockIcon },
            shipped: { label: 'Shipped', color: 'text-purple-600', bg: 'bg-purple-100', icon: TruckIcon },
            delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircleIcon },
            cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100', icon: XCircleIcon },
        };
        return configs[status as keyof typeof configs] || configs.pending;
    };

    const getPaymentStatusConfig = (status: string) => {
        return status === 'paid'
            ? { label: 'Paid', color: 'text-green-600', bg: 'bg-green-100' }
            : { label: 'Pending', color: 'text-red-600', bg: 'bg-red-100' };
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Orders</h1>
                <p className="text-gray-600">
                    Manage and track customer orders ({filteredOrders.length} orders)
                </p>
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
                            placeholder="Search by order number, customer name, or email..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-black"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => {
                                const statusConfig = getStatusConfig(order.orderStatus);
                                const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-semibold">{order.orderNumber}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold">{order?.customer?.name}</p>
                                                <p className="text-sm text-gray-500">{order?.customer?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {Array.isArray(order.items)
                                                ? order.items.reduce((total, item) => total + (item.quantity || 1), 0)
                                                : 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold">${order.total.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                <span>{statusConfig.label}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.color}`}>
                                                {paymentConfig.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Link href={`/admin/orders/${order._id}`}>
                                                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                        <EyeIcon className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setNewStatus(order.orderStatus);
                                                        setShowStatusModal(true);
                                                    }}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No orders found</p>
                    </div>
                )}
            </div>

            {/* Update Status Modal */}
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
                        <p className="text-gray-600 mb-4">
                            Order: <span className="font-semibold">{selectedOrder.orderNumber}</span>
                        </p>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black mb-6"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="flex space-x-3">
                            <Button onClick={updateOrderStatus} variant="primary" size="md">
                                Update
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setSelectedOrder(null);
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