'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

export default function PaymentMethodsPage() {
  const paymentMethods = [
    {
      name: 'Credit & Debit Cards',
      description: 'We accept all major credit and debit cards',
      icon: CreditCardIcon,
      cards: ['Visa', 'MasterCard', 'American Express', 'Discover'],
      features: ['Instant payment', 'Secure processing', 'Rewards points eligible'],
    },
    {
      name: 'Digital Wallets',
      description: 'Fast and secure checkout with digital wallets',
      icon: DevicePhoneMobileIcon,
      wallets: ['Apple Pay', 'Google Pay', 'Shop Pay', 'PayPal'],
      features: ['One-click checkout', 'Biometric authentication', 'No card details needed'],
    },
    {
      name: 'Bank Transfers',
      description: 'Direct bank transfer payments',
      icon: BuildingLibraryIcon,
      features: ['No fees', 'Secure banking', 'Verified by bank'],
    },
  ];

  const securityFeatures = [
    { feature: 'SSL Encryption', description: '256-bit SSL encryption for all transactions' },
    { feature: 'PCI Compliance', description: 'Level 1 PCI DSS compliant' },
    { feature: 'Fraud Protection', description: 'Advanced fraud detection system' },
    { feature: '3D Secure', description: 'Additional authentication for card payments' },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Methods</h1>
            <p className="text-xl text-gray-300">
              Secure and convenient payment options for every customer
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Payment Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold">{method.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    
                    {method.cards && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {method.cards.map((card, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {card}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {method.wallets && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-3">
                          {method.wallets.map((wallet, idx) => (
                            <div key={idx} className="w-12 h-8 relative">
                              <Image
                                src={`/images/payments/${wallet.toLowerCase().replace(' ', '-')}.svg`}
                                alt={wallet}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t pt-4 mt-2">
                      <p className="font-semibold text-sm mb-2">Features:</p>
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
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Security Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <ShieldCheckIcon className="w-6 h-6" />
                <span>Your Security is Our Priority</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <LockClosedIcon className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">{feature.feature}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Security Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Secure Checkout Process</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">SSL Encryption</p>
                    <p className="text-gray-600 text-sm">
                      All data transmitted between your browser and our servers is encrypted using 256-bit SSL technology.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">PCI Compliance</p>
                    <p className="text-gray-600 text-sm">
                      We are Level 1 PCI DSS compliant, the highest security standard for payment processing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Fraud Protection</p>
                    <p className="text-gray-600 text-sm">
                      Advanced fraud detection systems monitor all transactions in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Billing Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Billing Information</h2>
              <div className="space-y-3 text-gray-600">
                <p>• Your billing address must match the address on file with your payment method</p>
                <p>• We accept international credit cards for global customers</p>
                <p>• All prices are displayed and charged in USD unless specified otherwise</p>
                <p>• Sales tax is applied based on your shipping address</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Frequently Asked */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-bold text-lg mb-3">Frequently Asked</h3>
              <div className="space-y-3">
                <Link href="/help/payment-faq" className="block text-sm text-gray-600 hover:text-black">
                  • Is it safe to save my card information?
                </Link>
                <Link href="/help/payment-faq" className="block text-sm text-gray-600 hover:text-black">
                  • What payment methods do you accept?
                </Link>
                <Link href="/help/payment-faq" className="block text-sm text-gray-600 hover:text-black">
                  • How do I update my billing information?
                </Link>
                <Link href="/help/payment-faq" className="block text-sm text-gray-600 hover:text-black">
                  • Why was my payment declined?
                </Link>
              </div>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
            >
              <h3 className="font-bold text-lg mb-2">Need Help with Payment?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our support team is available 24/7 to assist with payment issues.
              </p>
              <Link href="/contact">
                <Button variant="primary" size="md" fullWidth>
                  Contact Support
                </Button>
              </Link>
            </motion.div>

            {/* Accepted Payment Icons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-bold text-lg mb-3">We Accept</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="w-5 h-5" />
                  <span className="text-sm">Visa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="w-5 h-5" />
                  <span className="text-sm">MasterCard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="w-5 h-5" />
                  <span className="text-sm">Amex</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="w-5 h-5" />
                  <span className="text-sm">Discover</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                  <span className="text-sm">Apple Pay</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                  <span className="text-sm">Google Pay</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingLibraryIcon className="w-5 h-5" />
                  <span className="text-sm">PayPal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingLibraryIcon className="w-5 h-5" />
                  <span className="text-sm">Bank Transfer</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center space-x-8"
        >
          <div className="text-center">
            <LockClosedIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Secure Payment</p>
          </div>
          <div className="text-center">
            <ShieldCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Fraud Protection</p>
          </div>
          <div className="text-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Verified by Visa</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}