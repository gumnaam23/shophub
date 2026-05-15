'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    CircleStackIcon as CookieIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    MegaphoneIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

export default function CookiePolicyPage() {
    const [cookiePreferences, setCookiePreferences] = useState({
        essential: true,
        analytics: true,
        functional: true,
        marketing: false,
    });

    const cookieTypes = [
        {
            id: 'essential',
            name: 'Essential Cookies',
            icon: ShieldCheckIcon,
            description: 'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
            examples: ['Authentication', 'Shopping cart', 'Checkout process', 'Security tokens'],
            alwaysEnabled: true,
        },
        {
            id: 'analytics',
            name: 'Analytics Cookies',
            icon: ChartBarIcon,
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
            examples: ['Page views', 'Bounce rate', 'Traffic sources', 'User behavior'],
            alwaysEnabled: false,
        },
        {
            id: 'functional',
            name: 'Functional Cookies',
            icon: Cog6ToothIcon,
            description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
            examples: ['Language preferences', 'Location settings', 'Saved items', 'Theme preferences'],
            alwaysEnabled: false,
        },
        {
            id: 'marketing',
            name: 'Marketing Cookies',
            icon: MegaphoneIcon,
            description: 'These cookies track your browsing habits to deliver targeted advertising and measure the effectiveness of marketing campaigns.',
            examples: ['Retargeting ads', 'Social media integration', 'Email campaign tracking', 'Personalized offers'],
            alwaysEnabled: false,
        },
    ];

    // Update the handleSavePreferences function in the CookiePolicyPage component
    const handleSavePreferences = async () => {
        try {
            const response = await fetch('/api/cookie-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preferences: cookiePreferences }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Cookie preferences saved successfully!');

                // Reload page to apply new preferences
                window.location.reload();
            } else {
                alert('Failed to save preferences. Please try again.');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert('Failed to save preferences. Please try again.');
        }
    };

    // Load saved preferences on component mount
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const response = await fetch('/api/cookie-preferences');
                const data = await response.json();
                if (data.success && data.preferences) {
                    setCookiePreferences(data.preferences);
                }
            } catch (error) {
                console.error('Error loading preferences:', error);
            }
        };

        loadPreferences();
    }, []);

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
                            <CookieIcon className="w-12 h-12" />
                            <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
                        </div>
                        <p className="text-xl text-gray-300">
                            Understanding how and why we use cookies on our website
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
                            <p className="text-gray-700 mb-4">
                                Cookies are small text files that are placed on your device when you visit a website. They are widely used
                                to make websites work more efficiently and provide information to website owners. Cookies help us remember
                                your preferences, understand how you use our site, and improve your browsing experience.
                            </p>
                            <p className="text-gray-700">
                                This Cookie Policy explains what cookies are, how we use them, and how you can control your cookie preferences.
                            </p>
                        </motion.div>

                        {/* How We Use Cookies */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
                            <p className="text-gray-700 mb-4">
                                We use cookies for various purposes, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>To authenticate users and maintain secure sessions</li>
                                <li>To remember your shopping cart items and preferences</li>
                                <li>To analyze website traffic and user behavior</li>
                                <li>To personalize content and product recommendations</li>
                                <li>To deliver targeted advertising and measure campaign effectiveness</li>
                                <li>To improve website performance and load times</li>
                            </ul>
                        </motion.div>

                        {/* Cookie Types */}
                        {cookieTypes.map((type, index) => {
                            const Icon = type.icon;
                            return (
                                <motion.div
                                    key={type.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{type.name}</h3>
                                                {type.alwaysEnabled && (
                                                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                        Always Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {!type.alwaysEnabled && (
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={cookiePreferences[type.id as keyof typeof cookiePreferences]}
                                                    onChange={(e) => setCookiePreferences({
                                                        ...cookiePreferences,
                                                        [type.id]: e.target.checked,
                                                    })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mb-3">{type.description}</p>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm font-semibold mb-2">Examples:</p>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {type.examples.map((example, idx) => (
                                                <li key={idx}>• {example}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Cookie Management */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-2xl font-bold mb-4">How to Manage Cookies</h2>
                            <p className="text-gray-700 mb-4">
                                Most web browsers allow you to control cookies through their settings. You can:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                                <li>View what cookies are stored on your device</li>
                                <li>Delete all or specific cookies</li>
                                <li>Block cookies from specific websites</li>
                                <li>Block all cookies from being set</li>
                                <li>Set preferences for first-party and third-party cookies</li>
                            </ul>
                            <p className="text-gray-700">
                                Please note that disabling certain cookies may affect the functionality of our website.
                                Essential cookies cannot be disabled as they are necessary for the website to work properly.
                            </p>
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Browser Instructions:</strong> {`Visit your browser's help section to learn more about 
                  how to manage cookie settings. Popular browsers include Chrome, Firefox, Safari, and Edge.`}
                                </p>
                            </div>
                        </motion.div>

                        {/* Third-Party Cookies */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
                            <p className="text-gray-700 mb-4">
                                We also use cookies from third-party services to enhance our website. These include:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                                <li><strong>Facebook Pixel:</strong> To measure ad effectiveness and retarget visitors</li>
                                <li><strong>Stripe/PayPal:</strong> For secure payment processing</li>
                                <li><strong>Shopify/Shop Pay:</strong> For express checkout options</li>
                            </ul>
                            <p className="text-gray-700 mt-4">
                                These third-party services have their own privacy policies and cookie policies. We recommend
                                reviewing their policies for more information about how they handle your data.
                            </p>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Cookie Preference Manager */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl shadow-md p-6 sticky top-24"
                        >
                            <h3 className="text-xl font-bold mb-4">Cookie Preferences</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Customize your cookie preferences below. Essential cookies cannot be disabled.
                            </p>
                            <div className="space-y-3 mb-6">
                                {cookieTypes.map((type) => (
                                    <div key={type.id} className="flex justify-between items-center py-2 border-b">
                                        <div>
                                            <p className="font-semibold text-sm">{type.name}</p>
                                            <p className="text-xs text-gray-500">{type.description.substring(0, 60)}...</p>
                                        </div>
                                        {type.alwaysEnabled ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={cookiePreferences[type.id as keyof typeof cookiePreferences]}
                                                    onChange={(e) => setCookiePreferences({
                                                        ...cookiePreferences,
                                                        [type.id]: e.target.checked,
                                                    })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleSavePreferences} variant="primary" size="md" fullWidth>
                                Save Preferences
                            </Button>
                        </motion.div>

                        {/* More Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-100 rounded-xl p-6"
                        >
                            <h3 className="font-bold text-lg mb-3">More Information</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                For more information about how we handle your data, please review our:
                            </p>
                            <div className="space-y-2">
                                <Link href="/privacy" className="block text-sm text-black hover:underline">
                                    → Privacy Policy
                                </Link>
                                <Link href="/terms" className="block text-sm text-black hover:underline">
                                    → Terms of Service
                                </Link>
                            </div>
                        </motion.div>

                        {/* Contact */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h3 className="font-bold text-lg mb-3">Questions About Cookies?</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                If you have any questions about our use of cookies, please contact us:
                            </p>
                            <p className="text-sm">
                                <a href="mailto:privacy@shophub.com" className="text-black font-semibold hover:underline">
                                    privacy@shophub.com
                                </a>
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 pt-8 border-t text-center text-sm text-gray-500"
                >
                    <p>Last Updated: January 15, 2024</p>
                    <p className="mt-2">
                        We may update this Cookie Policy from time to time. Changes will be posted on this page.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}