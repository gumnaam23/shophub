'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface AnalyticsData {
  revenue: {
    total: number;
    percentageChange: number;
    daily: { date: string; amount: number }[];
    weekly: { week: string; amount: number }[];
    monthly: { month: string; amount: number }[];
  };
  orders: {
    total: number;
    percentageChange: number;
    averageValue: number;
    byStatus: { status: string; count: number }[];
    daily?: { date: string; amount: number }[];  // ✅ Add this
    weekly?: { week: string; amount: number }[]; // ✅ Add this
    monthly?: { month: string; amount: number }[]; // ✅ Add this
  };
  customers: {
    total: number;
    percentageChange: number;
    newCustomers: number;
    returningCustomers: number;
  };
  products: {
    topSelling: { name: string; sales: number; revenue: number }[];
    topRated: { name: string; rating: number; reviews: number }[];
    lowStock: { name: string; stock: number }[];
  };
  traffic: {
    views: number;
    uniqueVisitors: number;
    bounceRate: number;
    averageSession: number;
  };
}

type ChartItem =
  | { date: string; amount: number }
  | { week: string; amount: number }
  | { month: string; amount: number };

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'orders'>('revenue');


  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/analytics/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Failed to export analytics:', error);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }



  const maxRevenue = Math.max(...analytics.revenue[period].map(d => d.amount));
  const maxValue = maxRevenue;  // ✅ Yeh line add karo

  return (
    <div className="max-w-7xl mx-auto text-gray-600">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600">Track your store performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <Button onClick={handleExport} variant="outline" size="md">
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">${analytics.revenue.total.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {analytics.revenue.percentageChange >= 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${analytics.revenue.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analytics.revenue.percentageChange)}% from last {period}
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{analytics.orders.total.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {analytics.orders.percentageChange >= 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${analytics.orders.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analytics.orders.percentageChange)}% from last {period}
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold">{analytics.customers.total.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {analytics.customers.percentageChange >= 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${analytics.customers.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analytics.customers.percentageChange)}% from last {period}
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Avg. Order Value</p>
              <p className="text-2xl font-bold">${analytics.orders.averageValue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Performance Overview</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedChart('revenue')}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedChart === 'revenue' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setSelectedChart('orders')}
              disabled 
              className={`px-4 py-2 rounded-lg transition-colors opacity-50 cursor-not-allowed ${selectedChart === 'orders' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              Orders
            </button>

          </div>
        </div>

        <div className="h-80 relative">
          <div className="flex items-end h-full space-x-2">

            {analytics.revenue[period].map((item: ChartItem, index: number) => {
              const height = (item.amount / maxRevenue) * 100;  // Sirf revenue


              // Get label based on period
              const getLabel = () => {
                if (period === 'daily') return (item as { date: string }).date;
                if (period === 'weekly') return (item as { week: string }).week;
                return (item as { month: string }).month;
              };

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                    className={`w-full rounded-t-lg transition-all ${selectedChart === 'revenue' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {getLabel()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {analytics.products.topSelling.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <p className="font-bold">${product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
          <div className="space-y-3">
            {analytics.orders.byStatus.map((status) => (
              <div key={status.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{status.status}</span>
                  <span>{status.count} orders</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${status.status === 'delivered' ? 'bg-green-500' :
                      status.status === 'shipped' ? 'bg-blue-500' :
                        status.status === 'processing' ? 'bg-yellow-500' :
                          status.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    style={{ width: `${(status.count / analytics.orders.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Customer Insights</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{analytics.customers.newCustomers}</p>
              <p className="text-sm text-gray-500">New Customers</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{analytics.customers.returningCustomers}</p>
              <p className="text-sm text-gray-500">Returning Customers</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${(analytics.customers.returningCustomers / analytics.customers.total) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {((analytics.customers.returningCustomers / analytics.customers.total) * 100).toFixed(1)}% returning customers
          </p>
        </div>

        {/* Traffic Overview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Traffic Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Page Views</span>
              <span className="font-semibold">{analytics.traffic.views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unique Visitors</span>
              <span className="font-semibold">{analytics.traffic.uniqueVisitors.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-semibold">{analytics.traffic.bounceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Session Duration</span>
              <span className="font-semibold">{analytics.traffic.averageSession} min</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {analytics.products.lowStock.length > 0 && (
          <div className="lg:col-span-2 bg-orange-50 rounded-xl shadow-md p-6 border border-orange-200">
            <h2 className="text-xl font-bold text-orange-600 mb-4">⚠️ Low Stock Alert</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics.products.lowStock.map((product) => (
                <div key={product.name} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-semibold">{product.name}</span>
                  <span className="text-red-600 font-bold">{product.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}