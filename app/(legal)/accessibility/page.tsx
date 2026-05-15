'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  EyeIcon,
  CommandLineIcon as KeyboardIcon,
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon,
  HandRaisedIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { XCircleIcon } from 'lucide-react';

export default function AccessibilityPage() {
  const commitments = [
    {
      icon: EyeIcon,
      title: 'Visual Accessibility',
      description: 'We ensure sufficient color contrast, resizable text, and alternative text for images.',
      standards: ['WCAG 2.1 Level AA', 'High contrast mode support', 'Screen reader compatible'],
    },
    {
      icon: KeyboardIcon,
      title: 'Keyboard Navigation',
      description: 'Our website is fully navigable using a keyboard alone, without a mouse.',
      standards: ['Tab order optimization', 'Focus indicators', 'Skip to content links'],
    },
    {
      icon: SpeakerWaveIcon,
      title: 'Screen Reader Support',
      description: 'Content is structured for screen readers with proper headings, landmarks, and ARIA labels.',
      standards: ['ARIA attributes', 'Semantic HTML', 'Descriptive link text'],
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: 'Customizable Experience',
      description: 'Users can adjust font sizes, spacing, and color schemes to suit their needs.',
      standards: ['Text resizing', 'Color customization', 'Reduced motion support'],
    },
    {
      icon: HandRaisedIcon,
      title: 'Assistive Technology',
      description: 'Compatible with various assistive technologies including voice control and switch devices.',
      standards: ['Voice control compatible', 'Switch device support', 'Dragon Naturally Speaking'],
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Responsive Design',
      description: 'Our website works seamlessly across devices and screen sizes.',
      standards: ['Mobile responsive', 'Touch-friendly', 'Responsive layouts'],
    },
  ];

  const features = [
    { feature: 'Alt text for all images', status: true },
    { feature: 'Proper heading structure', status: true },
    { feature: 'Form labels and instructions', status: true },
    { feature: 'Error identification and suggestions', status: true },
    { feature: 'Timeouts can be adjusted', status: true },
    { feature: 'Pause, stop, hide moving content', status: true },
    { feature: 'Consistent navigation', status: true },
    { feature: 'Multiple ways to find pages', status: true },
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
            <div className="flex items-center space-x-3 mb-4">
              <EyeIcon className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Accessibility</h1>
            </div>
            <p className="text-xl text-gray-300">
              Our commitment to making ShopHub accessible to everyone
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Our Commitment to Accessibility</h2>
          <p className="text-gray-700 mb-4">
            At ShopHub, we are committed to ensuring that our website is accessible to all individuals, 
            regardless of ability or technology. We believe that everyone deserves to have an inclusive 
            and seamless shopping experience.
          </p>
          <p className="text-gray-700">
            We strive to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards 
            and continually work to improve the accessibility of our website. Our accessibility efforts are 
            ongoing, and we welcome feedback from users to help us enhance our platform.
          </p>
        </motion.div>

        {/* Accessibility Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-semibold mb-2">Standards:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.standards.map((standard, idx) => (
                      <li key={idx}>• {standard}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Accessibility Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Accessibility Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                {feature.status ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                )}
                <span className="text-gray-700">{feature.feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Browser and Device Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Browser & Device Support</h2>
          <p className="text-gray-700 mb-4">
            Our website is designed to work with a wide range of browsers and assistive technologies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Supported Browsers</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Google Chrome (latest version)</li>
                <li>• Mozilla Firefox (latest version)</li>
                <li>• Apple Safari (latest version)</li>
                <li>• Microsoft Edge (latest version)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Assistive Technologies</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• NVDA (NonVisual Desktop Access)</li>
                <li>• JAWS (Job Access With Speech)</li>
                <li>• VoiceOver (macOS/iOS)</li>
                <li>• TalkBack (Android)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Tips for Better Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Tips for Better Accessibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• <strong>Tab</strong> - Move forward through elements</li>
                <li>• <strong>Shift + Tab</strong> - Move backward through elements</li>
                <li>• <strong>Enter</strong> - Activate focused element</li>
                <li>• <strong>Space</strong> - Toggle checkboxes/buttons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Browser Accessibility Tools</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Zoom (Ctrl + / Ctrl -)</li>
                <li>• High contrast mode (Windows/Mac)</li>
                <li>• Reader mode (F9 or address bar)</li>
                <li>• Text spacing (Custom CSS)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Feedback and Assistance</h2>
          <p className="text-gray-700 mb-4">
            We are continuously working to improve the accessibility of our website. If you encounter any 
            accessibility barriers or have suggestions for improvement, please let us know.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Contact Accessibility Team</h3>
              <p className="text-sm text-gray-600 mb-2">
                Email us directly with your accessibility concerns:
              </p>
              <a href="mailto:accessibility@shophub.com" className="text-black font-semibold hover:underline">
                accessibility@shophub.com
              </a>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Alternative Formats</h3>
              <p className="text-sm text-gray-600">
                {`Need content in an alternative format? Contact us and we'll work to accommodate your needs.`}
              </p>
              <Link href="/contact" className="inline-block mt-3 text-black font-semibold hover:underline">
                Contact Customer Support →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Compliance Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-8 border-t text-center text-sm text-gray-500"
        >
          <p>Last Updated: January 15, 2024</p>
          <p className="mt-2">
            We are committed to maintaining our accessibility standards and will update this page as 
            improvements are made.
          </p>
        </motion.div>
      </div>
    </div>
  );
}