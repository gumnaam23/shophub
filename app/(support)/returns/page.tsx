'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowPathIcon,
  ClockIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

export default function ReturnsPolicyPage() {
  const steps = [
    {
      title: 'Initiate Return',
      description: 'Log into your account, go to "My Orders", and click "Return Item" on the order you want to return.',
      icon: DocumentTextIcon,
    },
    {
      title: 'Pack Your Item',
      description: 'Pack the item in original packaging with all tags attached. Include the return slip provided.',
      icon: TruckIcon,
    },
    {
      title: 'Ship It Back',
      description: 'Print the free return shipping label and drop off at any carrier location.',
      icon: ArrowPathIcon,
    },
    {
      title: 'Get Refund',
      description: 'Once received and inspected, we\'ll process your refund within 3-5 business days.',
      icon: CreditCardIcon,
    },
  ];

  const returnConditions = [
    { condition: 'Item must be unused and in original condition', eligible: true },
    { condition: 'Original packaging and tags must be intact', eligible: true },
    { condition: 'Return initiated within 30 days of delivery', eligible: true },
    { condition: 'Custom or personalized items', eligible: false },
    { condition: 'Final sale or clearance items', eligible: false },
    { condition: 'Gift cards', eligible: false },
    { condition: 'Intimate apparel (for hygiene reasons)', eligible: false },
    { condition: 'Electronics with activated warranty', eligible: false },
  ];

  const refundTimeline = [
    { action: 'Return received at warehouse', timeframe: '1-2 days', icon: CheckCircleIcon },
    { action: 'Quality inspection', timeframe: '2-3 days', icon: CheckCircleIcon },
    { action: 'Refund processed', timeframe: '3-5 days', icon: CreditCardIcon },
    { action: 'Refund appears on statement', timeframe: '5-10 days', icon: ClockIcon },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns Policy</h1>
            <p className="text-xl text-gray-300 mb-6">
              30-day easy returns. Shop with confidence.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span>Free returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-green-400" />
                <span>30-day window</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCardIcon className="w-5 h-5 text-green-400" />
                <span>Full refund</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Return Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">How to Return an Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <Icon className="w-8 h-8" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-300" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Return Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Return Eligibility</h2>
              <div className="space-y-3">
                {returnConditions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-gray-700">{item.condition}</span>
                    {item.eligible ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Refund Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Refund Timeline</h2>
              <div className="space-y-4">
                {refundTimeline.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{item.action}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{item.timeframe}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Exceptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
            >
              <h3 className="font-semibold text-yellow-800 mb-2">Exceptions & Notes</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• For defective or damaged items, please contact support within 7 days of delivery</li>
                <li>• Return shipping is free for all eligible returns within the US</li>
                <li>• International returns: customer responsible for return shipping costs</li>
                <li>• Refunds are issued to the original payment method only</li>
                <li>• Exchange requests are processed as returns + new order</li>
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/account/orders">
                  <Button variant="primary" size="md" fullWidth>
                    Start a Return
                  </Button>
                </Link>
                <Link href="/help/tracking">
                  <Button variant="outline" size="md" fullWidth>
                    Track Your Return
                  </Button>
                </Link>
                <button className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-black">
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print Return Label</span>
                </button>
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our support team is here to assist you with any return-related questions.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="md" fullWidth>
                  Contact Support
                </Button>
              </Link>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-bold text-lg mb-3">Common Questions</h3>
              <div className="space-y-3 text-sm">
                <Link href="/help/return-faq" className="block text-gray-600 hover:text-black">
                  → How do I return a gift?
                </Link>
                <Link href="/help/return-faq" className="block text-gray-600 hover:text-black">
                  → Can I exchange an item?
                </Link>
                <Link href="/help/return-faq" className="block text-gray-600 hover:text-black">
                  → What if my item is damaged?
                </Link>
                <Link href="/help/return-faq" className="block text-gray-600 hover:text-black">
                  → How long do refunds take?
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
          <p>Last updated: January 1, 2024</p>
          <p className="mt-2">
            For detailed information about our return policy, please review our{' '}
            <Link href="/terms" className="text-black hover:underline">
              Terms of Service
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}