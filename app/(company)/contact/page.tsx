'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                alert(data.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            alert('Network error. Please try again.');
            console.error('Contact form error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: EnvelopeIcon,
            title: 'Email Us',
            details: 'support@shophub.com',
            subDetail: 'We\'ll respond within 24 hours',
            link: 'mailto:support@shophub.com',
        },
        {
            icon: PhoneIcon,
            title: 'Call Us',
            details: '+1 (555) 123-4567',
            subDetail: 'Mon-Fri, 9am-6pm EST',
            link: 'tel:+15551234567',
        },
        {
            icon: ChatBubbleLeftRightIcon,
            title: 'Live Chat',
            details: 'Chat with support',
            subDetail: 'Available 24/7',
            link: '#',
        },
        {
            icon: MapPinIcon,
            title: 'Visit Us',
            details: '123 Commerce Street',
            subDetail: 'New York, NY 10001',
            link: '#',
        },
    ];

    const faqs = [
        {
            question: 'How long does shipping take?',
            answer: 'Standard shipping takes 3-7 business days. Express shipping takes 1-3 business days.',
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer 30-day easy returns. Items must be unused and in original packaging.',
        },
        {
            question: 'Do you offer international shipping?',
            answer: 'Yes, we ship to over 50 countries worldwide.',
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-gray-300">
                            {` We're here to help! Reach out to us anytime.`}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <motion.a
                                key={method.title}
                                href={method.link}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="inline-flex p-3 bg-gray-100 rounded-full mb-4">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                                <p className="text-gray-800 font-semibold">{method.details}</p>
                                <p className="text-sm text-gray-500 mt-1">{method.subDetail}</p>
                            </motion.a>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2"
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{`Thank you! We'll get back to you soon.`}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Message *
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={submitting}
                            >
                                {submitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b last:border-0 pb-4">
                                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t">
                                <Link href="/help">
                                    <Button variant="outline" size="md" fullWidth>
                                        View All FAQs →
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-gray-100 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                                <ClockIcon className="w-5 h-5" />
                                <span>Business Hours</span>
                            </h3>
                            <div className="space-y-2 text-gray-600">
                                <div className="flex justify-between">
                                    <span>Monday - Friday:</span>
                                    <span className="font-semibold">9:00 AM - 6:00 PM EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday:</span>
                                    <span className="font-semibold">10:00 AM - 4:00 PM EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday:</span>
                                    <span className="font-semibold">Closed</span>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="h-64 bg-gray-200 relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1x3024.2219901290355!2d-74.00369368400567!3d40.71312937933077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bb3d28d%3A0x2b4d4e2b4f4b2b4d!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}