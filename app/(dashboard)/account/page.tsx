'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    UserIcon,
    ShoppingBagIcon,
    HeartIcon,
    CreditCardIcon,
    ClockIcon,
    CheckBadgeIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface OrderStats {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
    deliveredOrders: number;
}

interface RecentOrder {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: number;
}

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    image: string;
}

export default function AccountDashboard() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<OrderStats>({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch order stats
                const statsRes = await fetch('/api/account/stats');
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.data);
                }

                // Fetch recent orders
                const ordersRes = await fetch('/api/account/orders?limit=3');
                const ordersData = await ordersRes.json();
                if (ordersData.success) {
                    setRecentOrders(ordersData.orders);
                }

                // Fetch wishlist
                const wishlistRes = await fetch('/api/account/wishlist');
                const wishlistData = await wishlistRes.json();
                if (wishlistData.success) {
                    setWishlistItems(wishlistData.items);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchDashboardData();
        }
    }, [status]);

    const statCards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBagIcon,
            color: 'bg-blue-500',
            change: '+12%',
        },
        {
            title: 'Total Spent',
            value: `$${stats.totalSpent.toFixed(2)}`,
            icon: CreditCardIcon,
            color: 'bg-green-500',
            change: '+8%',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: ClockIcon,
            color: 'bg-orange-500',
            change: '-2%',
        },
        {
            title: 'Wishlist Items',
            value: wishlistItems.length,
            icon: HeartIcon,
            color: 'bg-red-500',
            change: '+5%',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">Please sign in to view your account</h2>
                <Link href="/auth/login">
                    <Button variant="primary">Sign In</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto text-gray-800">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-6 md:p-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
                            </h1>
                            <p className="text-gray-300">
                                {`Here's what's happening with your account today.`}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-2">
                            <CheckBadgeIcon className="w-5 h-5 text-green-400" />
                            <span className="text-sm">Account Verified</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-green-600 mt-2">{stat.change}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Recent Orders</h2>
                            <Link
                                href="/account/orders"
                                className="text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                View All →
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No orders yet</p>
                                <Link href="/products">
                                    <Button variant="primary" size="sm" className="mt-4">
                                        Start Shopping
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order, index) => (
                                    <div
                                        key={order._id || index}
                                        className="border rounded-lg p-4 hover:shadow-md transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                                            <div>
                                                <p className="font-semibold">{order.orderNumber}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm mt-1">
                                                    {Object.keys(order.items).length} item{Object.keys(order.items).length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="mt-2 md:mt-0 text-right">
                                                <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                                                <Link
                                                    href={`/account/orders/${order._id}`}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    View Details →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Profile Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-md p-6 mt-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Profile Information</h2>
                            <Link
                                href="/account/settings"
                                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {session?.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <UserIcon className="w-10 h-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-semibold">{session?.user?.name || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-semibold">{session?.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-semibold">January 2024</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Wishlist Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Wishlist</h2>
                            <Link
                                href="/account/wishlist"
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                View All →
                            </Link>
                        </div>

                        {wishlistItems.length === 0 ? (
                            <div className="text-center py-6">
                                <HeartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">Your wishlist is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {wishlistItems.slice(0, 3).map((item, index) => (
                                    <div key={item._id || index} className="flex items-center space-x-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                                            <p className="text-sm font-bold">${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href="/products">
                                <Button variant="primary" size="md" fullWidth>
                                    Continue Shopping
                                </Button>
                            </Link>
                            <Link href="/account/addresses">
                                <Button variant="outline" size="md" fullWidth>
                                    Add New Address
                                </Button>
                            </Link>
                            <Link href="/account/settings">
                                <Button variant="outline" size="md" fullWidth>
                                    Account Settings
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Support */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
                    >
                        <div className="text-center">
                            <div className="inline-flex p-3 bg-white rounded-full mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L16.95 7.05M19 12h2m-8 7v2m-7-7H3m5.636-6.364L7.05 5.636M12 3v2m7.071 9.95l-1.414-1.414M8.464 8.464L7.05 6.95" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Our support team is here to help you 24/7
                            </p>
                            <Link href="/contact">
                                <Button variant="outline" size="sm" fullWidth>
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}