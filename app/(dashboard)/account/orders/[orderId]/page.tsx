'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PrinterIcon,
  MapPinIcon,
  CreditCardIcon,
  ArchiveBoxIcon as PackageIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  items: OrderItem[];
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
  timeline: {
    status: string;
    date: string;
    description: string;
  }[];
}

export default function SingleOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/account/orders/${orderId}`);
        if (!response.ok) throw new Error('Order not found');
        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        router.push('/account/orders');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setCancelling(true);
    try {
      const response = await fetch(`/api/account/orders/${orderId}/cancel`, {
        method: 'POST',
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder.order);
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        icon: ClockIcon, 
        color: 'text-orange-600', 
        bg: 'bg-orange-100',
        border: 'border-orange-200',
        label: 'Pending',
        step: 1
      },
      processing: { 
        icon: ArrowPathIcon, 
        color: 'text-blue-600', 
        bg: 'bg-blue-100',
        border: 'border-blue-200',
        label: 'Processing',
        step: 2
      },
      shipped: { 
        icon: TruckIcon, 
        color: 'text-purple-600', 
        bg: 'bg-purple-100',
        border: 'border-purple-200',
        label: 'Shipped',
        step: 3
      },
      delivered: { 
        icon: CheckCircleIcon, 
        color: 'text-green-600', 
        bg: 'bg-green-100',
        border: 'border-green-200',
        label: 'Delivered',
        step: 4
      },
      cancelled: { 
        icon: XCircleIcon, 
        color: 'text-red-600', 
        bg: 'bg-red-100',
        border: 'border-red-200',
        label: 'Cancelled',
        step: 0
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPaymentStatusConfig = (status: string) => {
    return status === 'paid'
      ? { color: 'text-green-600', bg: 'bg-green-100', label: 'Paid', icon: CheckCircleIcon }
      : { color: 'text-red-600', bg: 'bg-red-100', label: 'Pending', icon: XCircleIcon };
  };

  const handlePrint = () => {
    window.print();
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">{`The order you're looking for doesn't exist.`}</p>
        <Link href="/account/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
  const StatusIcon = statusConfig.icon;
  const PaymentIcon = paymentConfig.icon;

  const timelineSteps = [
    { status: 'Order Placed', key: 'pending', description: 'Your order has been received' },
    { status: 'Processing', key: 'processing', description: 'Your order is being prepared' },
    { status: 'Shipped', key: 'shipped', description: 'Your order is on the way' },
    { status: 'Delivered', key: 'delivered', description: 'Your order has been delivered' },
  ];

  const currentStep = statusConfig.step;

  return (
    <div className="max-w-7xl mx-auto text-gray-600">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/account/orders"
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
          </div>
        </div>
      </motion.div>

      {/* Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className={`rounded-xl p-4 ${statusConfig.bg} border ${statusConfig.border}`}>
          <div className="flex items-center space-x-3">
            <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
            <div>
              <p className="text-sm text-gray-600">Order Status</p>
              <p className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 ${paymentConfig.bg} border ${paymentConfig.color === 'text-green-600' ? 'border-green-200' : 'border-red-200'}`}>
          <div className="flex items-center space-x-3">
            <PaymentIcon className={`w-8 h-8 ${paymentConfig.color}`} />
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className={`font-semibold ${paymentConfig.color}`}>{paymentConfig.label}</p>
            </div>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                {order.trackingUrl ? (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {order.trackingNumber}
                  </a>
                ) : (
                  <p className="font-semibold">{order.trackingNumber}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Order Timeline */}
      {order.status !== 'cancelled' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-6">Order Timeline</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {timelineSteps.map((step, index) => {
                const isCompleted = currentStep >= index + 1;
                const isCurrent = currentStep === index + 1;
                
                return (
                  <div key={step.key} className="relative flex items-start">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`font-semibold ${
                        isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.status}
                      </h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {isCurrent && order.estimatedDelivery && (
                        <p className="text-sm text-blue-600 mt-1">
                          Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="absolute left-6 -bottom-4 w-0.5 h-8 bg-blue-500 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 pb-4 border-b last:border-0">
                  <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold hover:text-gray-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Price: ${item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    {order.status === 'delivered' && (
                      <Link href={`/products/${item.slug}/review`}>
                        <button className="text-sm text-blue-600 hover:underline mt-2">
                          Write a Review
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Order Summary and Shipping Info */}
        <div className="space-y-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
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
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-sm text-gray-600">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
              </div>
              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="flex items-start space-x-3">
              <CreditCardIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold capitalize">{order.paymentMethod}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.paymentStatus === 'paid' ? 'Payment completed' : 'Payment pending'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cancel Order Button */}
          {order.status === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={handleCancelOrder}
                variant="outline"
                size="lg"
                fullWidth
                disabled={cancelling}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}