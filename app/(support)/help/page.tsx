'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  DocumentTextIcon,
  TruckIcon,
  ArrowPathIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserIcon,
  ShoppingBagIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  articles: number;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const categories: HelpCategory[] = [
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon, description: 'Track orders, cancellations, modifications', articles: 12 },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon, description: 'Delivery times, tracking, costs', articles: 8 },
    { id: 'returns', name: 'Returns', icon: ArrowPathIcon, description: 'Return policy, refunds, exchanges', articles: 6 },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon, description: 'Payment methods, billing', articles: 7 },
    { id: 'account', name: 'Account', icon: UserIcon, description: 'Profile, settings, security', articles: 10 },
    { id: 'support', name: 'Support', icon: ChatBubbleLeftRightIcon, description: 'Contact us, FAQs', articles: 5 },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section. Click on the order number to view detailed tracking information including current status and estimated delivery date. You will also receive email updates with tracking links once your order ships.',
    },
    {
      id: '2',
      category: 'orders',
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled within 1 hour of placement. To cancel, go to "My Orders" and click "Cancel Order". If the cancellation window has passed, please contact customer support. Modifications are not possible after order confirmation, but you can cancel and place a new order.',
    },
    {
      id: '3',
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-7 business days. Express shipping takes 1-3 business days. International shipping may take 7-14 business days depending on the destination. You will receive a tracking number once your order ships.',
    },
    {
      id: '4',
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary by location. Please check our shipping page for specific details about your country. Customs fees may apply and are the responsibility of the customer.',
    },
    {
      id: '5',
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy from the date of delivery. Items must be unused, in original packaging, and with all tags attached. To initiate a return, visit your orders page and click "Return Item". Return shipping is free for defective items.',
    },
    {
      id: '6',
      category: 'returns',
      question: 'How long do refunds take?',
      answer: 'Refunds are processed within 3-5 business days after we receive and inspect your return. The refund will be credited to your original payment method. It may take an additional 3-7 business days for the refund to appear on your statement.',
    },
    {
      id: '7',
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. For specific payment method details, please visit our payment methods page.',
    },
    {
      id: '8',
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We are PCI compliant and never store full credit card details on our servers. All transactions are processed through secure payment gateways.',
    },
    {
      id: '9',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You will receive a password reset link. Click the link and follow the instructions to create a new password. For security, password reset links expire after 24 hours.',
    },
    {
      id: '10',
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Account Settings > Security > Delete Account. Please note this action is permanent and will remove all your order history, saved addresses, and personal information. You will receive a confirmation email once deletion is complete.',
    },
    {
      id: '11',
      category: 'support',
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team via email at support@shophub.com, phone at +1 (555) 123-4567, or live chat available 24/7. Our support hours are Monday to Friday, 9 AM - 6 PM EST. We typically respond within 24 hours.',
    },
    {
      id: '12',
      category: 'support',
      question: 'Do you have a physical store?',
      answer: 'Currently we operate exclusively online. However, we have distribution centers in New York, Los Angeles, and Chicago to ensure fast shipping across the United States. We plan to open physical stores in major cities in 2025.',
    },
  ];

  const popularArticles = [
    { title: 'How to track your order', link: '/help/tracking', icon: TruckIcon },
    { title: 'Return policy explained', link: '/returns', icon: ArrowPathIcon },
    { title: 'Payment methods', link: '/payment-methods', icon: CreditCardIcon },
    { title: 'Shipping information', link: '/shipping-info', icon: TruckIcon },
    { title: 'Account security tips', link: '/help/security', icon: ShieldCheckIcon },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              How can we help you?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 mb-8"
            >
              Find answers to your questions about orders, shipping, returns, and more
            </motion.p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-3 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 bg-white rounded-xl shadow-md text-left transition-all ${
                    selectedCategory === category.id ? 'ring-2 ring-black' : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                      <span className="text-xs text-gray-500">{category.articles} articles</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => {
              const Icon = article.icon;
              return (
                <Link
                  key={index}
                  href={article.link}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{article.title}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-sm text-gray-600 hover:text-black"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <QuestionMarkCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No FAQs found matching your search.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t p-4 bg-gray-50"
                      >
                        <p className="text-gray-700">{faq.answer}</p>
                        {faq.category === 'support' && (
                          <div className="mt-4 pt-3 border-t">
                            <Link href="/contact">
                              <Button variant="outline" size="sm">
                                Contact Support
                              </Button>
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowContactForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>Live Chat</span>
            </button>
            <Link href="/contact">
              <button className="flex items-center space-x-2 px-6 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
                <span>Email Us</span>
              </button>
            </Link>
            <Link href="/contact">
              <button className="flex items-center space-x-2 px-6 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition-colors">
                <PhoneIcon className="w-5 h-5" />
                <span>Call Us</span>
              </button>
            </Link>
          </div>
          <div className="mt-6 flex justify-center items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-1">
              <DocumentTextIcon className="w-4 h-4" />
              <span>Average response: &lt; 2 hours</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Links Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Orders</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help/tracking" className="text-gray-600 hover:text-black">Track Order</Link></li>
                <li><Link href="/help/cancel-order" className="text-gray-600 hover:text-black">Cancel Order</Link></li>
                <li><Link href="/returns" className="text-gray-600 hover:text-black">Return Items</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Account</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account/settings" className="text-gray-600 hover:text-black">Profile Settings</Link></li>
                <li><Link href="/help/reset-password" className="text-gray-600 hover:text-black">Reset Password</Link></li>
                <li><Link href="/account/addresses" className="text-gray-600 hover:text-black">Manage Addresses</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Policies</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-600 hover:text-black">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-black">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-600 hover:text-black">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="text-gray-600 hover:text-black">Blog</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-black">FAQ</Link></li>
                <li><Link href="/sitemap" className="text-gray-600 hover:text-black">Sitemap</Link></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowContactForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Chat with Support</h3>
                <button onClick={() => setShowContactForm(false)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 text-center py-8">
                  Our support team is online! Click below to start a live chat session.
                </p>
                <Button variant="primary" size="lg" fullWidth>
                  Start Live Chat
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Average response time: 1-2 minutes
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}