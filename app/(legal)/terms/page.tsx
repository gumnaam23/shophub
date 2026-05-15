'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DocumentTextIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  ScaleIcon,
  ShieldCheckIcon,
  BanknotesIcon as GavelIcon,
} from '@heroicons/react/24/outline';

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            {`By accessing or using ShopHub's website, mobile application, or services, you agree to be bound by 
            these Terms of Service. If you do not agree to these terms, please do not use our services.`}
          </p>
          <p className="text-gray-700">
            These terms apply to all users, including visitors, customers, merchants, and contributors of content.
          </p>
        </div>
      ),
    },
    {
      id: 'account',
      title: 'Account Registration',
      icon: ShieldCheckIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            To access certain features, you may need to create an account. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Be at least 18 years old or have parental consent</li>
          </ul>
          <p className="text-gray-700">
            We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
          </p>
        </div>
      ),
    },
    {
      id: 'purchases',
      title: 'Purchases and Payments',
      icon: ShoppingBagIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            When you make a purchase on our website, you agree to the following terms:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>All prices are listed in USD and are subject to change without notice</li>
            <li>We reserve the right to refuse or cancel orders for any reason (including pricing errors)</li>
            <li>You agree to pay all charges incurred by your account, including applicable taxes</li>
            <li>Payment information must be valid and current</li>
            <li>We use third-party payment processors and do not store full payment details</li>
            <li>Order confirmation emails do not guarantee acceptance of your order</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping and Delivery',
      icon: TruckIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Our shipping and delivery terms include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Delivery estimates are provided for convenience and are not guaranteed</li>
            <li>Risk of loss transfers to you upon delivery to the carrier</li>
            <li>We are not responsible for delays caused by carriers, weather, or customs</li>
            <li>Shipping costs are non-refundable unless due to our error</li>
            <li>International orders may be subject to customs duties and taxes</li>
            <li>You are responsible for providing accurate shipping information</li>
          </ul>
          <p className="text-gray-700">
            For more details, please see our <Link href="/shipping-info" className="text-black font-semibold hover:underline">Shipping Information</Link> page.
          </p>
        </div>
      ),
    },
    {
      id: 'returns',
      title: 'Returns and Refunds',
      icon: CreditCardIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Our return and refund policy is governed by the following terms:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Items must be returned within 30 days of delivery</li>
            <li>Products must be unused, with original tags and packaging</li>
            <li>Refunds are issued to the original payment method</li>
            <li>Return shipping is free for eligible items</li>
            <li>Final sale and personalized items cannot be returned</li>
            <li>{`We reserve the right to deny returns that don't meet our policy`}</li>
          </ul>
          <p className="text-gray-700">
            For complete details, please review our <Link href="/returns" className="text-black font-semibold hover:underline">Returns Policy</Link>.
          </p>
        </div>
      ),
    },
    {
      id: 'content',
      title: 'User Content',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            By submitting reviews, comments, or other content, you grant us a non-exclusive, royalty-free license to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Use, reproduce, and modify your content</li>
            <li>Display your content on our website and marketing materials</li>
            <li>Allow other users to view and interact with your content</li>
          </ul>
          <p className="text-gray-700">
            You represent that you own or have permission to share the content and that it does not violate 
            any laws or third-party rights. We reserve the right to remove content that is inappropriate, 
            offensive, or violates our policies.
          </p>
        </div>
      ),
    },
    {
      id: 'prohibited',
      title: 'Prohibited Activities',
      icon: GavelIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Violating any laws or regulations</li>
            <li>Infringing on intellectual property rights</li>
            <li>Attempting to interfere with our website or servers</li>
            <li>Using bots, scrapers, or automated methods to access our site</li>
            <li>Uploading malicious code or viruses</li>
            <li>Harassing, abusing, or harming others</li>
            <li>Collecting user information without consent</li>
            <li>Impersonating others or providing false information</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'intellectual',
      title: 'Intellectual Property',
      icon: ScaleIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            All content on our website, including text, graphics, logos, images, and software, is the property 
            of ShopHub or our licensors and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-gray-700">
            You may not reproduce, distribute, modify, or create derivative works of our content without our 
            express written permission. ShopHub and our logo are registered trademarks.
          </p>
        </div>
      ),
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      icon: GavelIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            To the maximum extent permitted by law, ShopHub shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages arising from inability to use our services</li>
            <li>Third-party conduct or content on our website</li>
          </ul>
          <p className="text-gray-700">
            Our total liability shall not exceed the amount you paid for products in the past 12 months.
            Some jurisdictions do not allow certain liability limitations, so this may not apply to you.
          </p>
        </div>
      ),
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      icon: ShieldCheckIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            You agree to indemnify and hold ShopHub harmless from any claims, damages, losses, or expenses 
            arising from your violation of these Terms, your use of our services, or your violation of any 
            third-party rights.
          </p>
        </div>
      ),
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We may terminate or suspend your account immediately, without prior notice, for conduct that 
            violates these Terms or is harmful to our business. Upon termination, your right to use our 
            services will cease immediately.
          </p>
        </div>
      ),
    },
    {
      id: 'governing',
      title: 'Governing Law',
      icon: ScaleIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of the State of New York, 
            without regard to conflict of law provisions. Any legal action arising from these Terms shall be 
            filed exclusively in federal or state courts located in New York County.
          </p>
        </div>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
            posting. Your continued use of our services after changes constitutes acceptance of the modified Terms. 
            Material changes will be notified via email or website notice.
          </p>
        </div>
      ),
    },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-300 mb-4">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-gray-400">
              Last Updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold text-lg mb-3">Contents</h3>
              <nav className="space-y-2 max-h-[70vh] overflow-y-auto">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-gray-600 hover:text-black transition-colors py-1"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white rounded-xl shadow-md p-6 scroll-mt-24"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  {section.content}
                </motion.div>
              );
            })}

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-100 rounded-xl p-6"
            >
              <h3 className="font-bold text-lg mb-3">Questions About Terms?</h3>
              <p className="text-gray-700 mb-2">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-1 text-gray-700">
                <p>Email: <a href="mailto:legal@shophub.com" className="text-black font-semibold hover:underline">legal@shophub.com</a></p>
                <p>Phone: <a href="tel:+15551234567" className="text-black font-semibold hover:underline">+1 (555) 123-4567</a></p>
                <p>Address: 123 Commerce St, New York, NY 10001, USA</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}