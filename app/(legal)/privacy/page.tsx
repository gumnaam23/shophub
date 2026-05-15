'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  EyeIcon,
  Cog6ToothIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { ClockIcon } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: 'information',
      title: 'Information We Collect',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We collect information you provide directly to us, such as when you create an account, make a purchase, 
            subscribe to our newsletter, or contact customer support. This may include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Name, email address, phone number, and shipping/billing addresses</li>
            <li>Payment information (processed securely by our payment partners)</li>
            <li>Account preferences and communication settings</li>
            <li>Order history and product reviews</li>
            <li>Communications with our customer support team</li>
          </ul>
          <p className="text-gray-700">
            We also automatically collect certain information when you visit our website, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, links clicked)</li>
            <li>Location information (based on your IP address)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: Cog6ToothIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Process and fulfill your orders, including sending order confirmations and shipping updates</li>
            <li>Manage your account and provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website, products, and services</li>
            <li>Detect and prevent fraud, security incidents, and other harmful activity</li>
            <li>Comply with legal obligations and enforce our terms of service</li>
            <li>Personalize your shopping experience and show relevant product recommendations</li>
          </ul>
          <p className="text-gray-700">
            We process your information based on legitimate business interests, contract performance, 
            legal compliance, and your consent where required.
          </p>
        </div>
      ),
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: GlobeAltIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Service Providers:</strong> With third-party vendors who help us operate our business (payment processors, shipping carriers, email services, analytics providers)</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of our company</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>With Your Consent:</strong> When you authorize us to share your information</li>
          </ul>
          <p className="text-gray-700">
            We ensure all third-party providers maintain appropriate data protection measures.
          </p>
        </div>
      ),
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: ShieldCheckIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
            <li>PCI DSS compliance for payment processing</li>
            <li>Regular security assessments and vulnerability scans</li>
            <li>Access controls and authentication for employee data access</li>
            <li>Secure data storage with encryption at rest</li>
          </ul>
          <p className="text-gray-700">
            While we strive to protect your information, no method of transmission over the Internet is 100% secure.
          </p>
        </div>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: EyeIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We use cookies and similar technologies to enhance your browsing experience. For detailed information, 
            please see our <Link href="/cookies" className="text-black font-semibold hover:underline">Cookie Policy</Link>.
          </p>
          <p className="text-gray-700">Types of cookies we use include:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Essential Cookies:</strong> Required for website functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: BuildingLibraryIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
          </ul>
          <p className="text-gray-700">
            To exercise these rights, please contact us at <a href="mailto:privacy@shophub.com" className="text-black font-semibold hover:underline">privacy@shophub.com</a>.
            We will respond to your request within 30 days.
          </p>
        </div>
      ),
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      icon: ShieldCheckIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Our website is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you believe we have collected information from 
            a child under 13, please contact us immediately.
          </p>
        </div>
      ),
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: ClockIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We retain your personal information for as long as necessary to fulfill the purposes outlined 
            in this Privacy Policy, unless a longer retention period is required by law. This includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Account information: Until you delete your account</li>
            <li>Order history: For tax and legal compliance (typically 7 years)</li>
            <li>Marketing data: Until you unsubscribe</li>
            <li>Communication records: For customer service quality</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'international',
      title: 'International Data Transfers',
      icon: GlobeAltIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We are based in the United States and process your information in the US. If you are accessing 
            our website from outside the US, please be aware that your information may be transferred to, 
            stored, and processed in the US where our servers are located. We ensure appropriate safeguards 
            are in place for international data transfers.
          </p>
        </div>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to This Policy',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            {`We may update this Privacy Policy from time to time. We will notify you of any material changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage 
            you to review this Privacy Policy periodically.`}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300 mb-4">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
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
              <nav className="space-y-2">
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
                  transition={{ delay: index * 0.05 }}
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
              <h3 className="font-bold text-lg mb-3">Contact Us</h3>
              <p className="text-gray-700 mb-2">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-1 text-gray-700">
                <p>Email: <a href="mailto:privacy@shophub.com" className="text-black font-semibold hover:underline">privacy@shophub.com</a></p>
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