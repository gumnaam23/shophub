'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  customer: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();
      setOrder(data.order);
      setNewStatus(data.order.status);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrder();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/invoice`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order?.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Failed to download invoice:', error);
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

  if (!order) return null;

  const statusConfig = getStatusConfig(order.orderStatus);
  const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-7xl mx-auto text-gray-600">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-gray-600 hover:text-black mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PrinterIcon className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`rounded-xl p-4 ${statusConfig.bg} border`}>
          <div className="flex items-center space-x-3">
            <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
            <div>
              <p className="text-sm text-gray-600">Order Status</p>
              <p className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 ${paymentConfig.bg} border`}>
          <div className="flex items-center space-x-3">
            <CreditCardIcon className={`w-8 h-8 ${paymentConfig.color}`} />
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className={`font-semibold ${paymentConfig.color}`}>{paymentConfig.label}</p>
            </div>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="bg-gray-50 rounded-xl p-4 border">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                {order.trackingUrl ? (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {order.trackingNumber}
                  </a>
                ) : (
                  <p className="font-semibold">{order.trackingNumber}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`} className="font-semibold hover:text-gray-600">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Price: ${item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black mb-4"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button onClick={updateOrderStatus} variant="primary" size="md" fullWidth disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <p className="font-semibold">{order.customer.name}</p>
              <div className="flex items-center space-x-2 text-sm">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${order.customer.email}`} className="text-blue-600">
                  {order.customer.email}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="space-y-2">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
              <div className="flex items-center space-x-2 text-sm pt-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span>{order.shippingAddress.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                <span>{order.shippingAddress.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}