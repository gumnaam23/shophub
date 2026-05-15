'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

export default function ShippingInfoPage() {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      deliveryTime: '3-7 business days',
      cost: '$5.99',
      freeThreshold: 'Free on orders $50+',
      icon: TruckIcon,
      features: ['Tracking included', 'Delivery confirmation'],
    },
    {
      name: 'Express Shipping',
      deliveryTime: '1-3 business days',
      cost: '$12.99',
      freeThreshold: 'Not available',
      icon: ClockIcon,
      features: ['Priority handling', 'Real-time tracking', 'Faster delivery'],
    },
    {
      name: 'Overnight Shipping',
      deliveryTime: 'Next business day',
      cost: '$24.99',
      freeThreshold: 'Not available',
      icon: ClockIcon,
      features: ['Guaranteed next day', 'Signature required', 'Premium support'],
    },
  ];

  const internationalZones = [
    { zone: 'Canada & Mexico', deliveryTime: '5-10 business days', cost: 'From $15.99' },
    { zone: 'Europe', deliveryTime: '7-14 business days', cost: 'From $19.99' },
    { zone: 'Asia & Australia', deliveryTime: '10-18 business days', cost: 'From $24.99' },
    { zone: 'Rest of World', deliveryTime: '14-21 business days', cost: 'From $29.99' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
            <p className="text-xl text-gray-300">
              Fast, reliable shipping to your doorstep
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Shipping Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Shipping Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">{method.name}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="font-semibold">{method.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-semibold">{method.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Free Shipping:</span>
                      <span className="text-sm text-green-600">{method.freeThreshold}</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm font-semibold mb-2">Features:</p>
                    <ul className="space-y-1">
                      {method.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Domestic Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Domestic Shipping (USA)</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Delivery Areas</p>
                    <p className="text-gray-600 text-sm">
                      We ship to all 50 states, including Alaska, Hawaii, and Puerto Rico.
                      PO boxes and APO/FPO addresses are accepted via USPS.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Processing Time</p>
                    <p className="text-gray-600 text-sm">
                      Orders are processed within 24 hours on business days.
                      You will receive a tracking number once your order ships.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-gray-600 text-sm">
                      Free standard shipping on all orders over $50. No promo code needed!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* International Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">International Shipping</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Region</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Delivery Time</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internationalZones.map((zone, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-sm">{zone.zone}</td>
                        <td className="px-4 py-3 text-sm">{zone.deliveryTime}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{zone.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> International customers are responsible for any customs duties, taxes, or fees imposed by their country.
                </p>
              </div>
            </motion.div>

            {/* Tracking Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Order Tracking</h2>
              <p className="text-gray-600 mb-4">
               {` All orders come with free tracking. You'll receive a tracking number via email once your order ships.`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold mb-2">Track via Email</p>
                  <p className="text-sm text-gray-600">
                    Check your email for shipping confirmation with tracking link
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold mb-2">Track via Account</p>
                  <p className="text-sm text-gray-600">
                   {` Log into your account and go to "My Orders" for real-time updates`}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/account/orders">
                  <Button variant="outline" size="md" fullWidth>
                    Track Your Order
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <h3 className="font-bold text-blue-800 mb-3">📦 Shipping Alerts</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Orders placed before 2 PM EST ship same day</li>
                <li>• Weekend orders ship on Monday</li>
                <li>• Holiday schedules may affect delivery times</li>
                <li>• Signature may be required for orders over $200</li>
              </ul>
            </motion.div>

            {/* Holiday Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-bold text-lg mb-3">Holiday Shipping Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thanksgiving:</span>
                  <span>No delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Christmas Eve:</span>
                  <span>Limited delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Christmas Day:</span>
                  <span>No delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{`New Year's Day:`}</span>
                  <span>No delivery</span>
                </div>
              </div>
              <Link href="/help/holiday-shipping" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
                View full holiday schedule →
              </Link>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-bold text-lg mb-3">Common Questions</h3>
              <div className="space-y-3 text-sm">
                <Link href="/help/shipping-faq" className="block text-gray-600 hover:text-black">
                  → Can I change my shipping address?
                </Link>
                <Link href="/help/shipping-faq" className="block text-gray-600 hover:text-black">
                  → What if my package is lost?
                </Link>
                <Link href="/help/shipping-faq" className="block text-gray-600 hover:text-black">
                  → Do you offer expedited shipping?
                </Link>
                <Link href="/help/shipping-faq" className="block text-gray-600 hover:text-black">
                  → How do I track international orders?
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Policy Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t text-center text-sm text-gray-500"
        >
          <p>For questions about shipping, please contact our support team.</p>
          <div className="flex justify-center space-x-4 mt-3">
            <Link href="/contact" className="text-black hover:underline">
              Contact Support
            </Link>
            <Link href="/returns" className="text-black hover:underline">
              Returns Policy
            </Link>
            <Link href="/help" className="text-black hover:underline">
              Help Center
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}