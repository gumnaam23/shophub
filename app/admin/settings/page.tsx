'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BellIcon,
  PaintBrushIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface Settings {
  general: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    timezone: string;
    currency: string;
    language: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    logo?: string;
    favicon?: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    fromName: string;
  };
  payment: {
    stripeKey: string;
    stripeSecret: string;
    paypalClientId: string;
    paypalSecret: string;
    currency: string;
  };
  shipping: {
    freeShippingThreshold: number;
    domesticRate: number;
    internationalRate: number;
    estimatedDays: number;
  };
  notifications: {
    orderConfirmation: boolean;
    paymentReceived: boolean;
    orderShipped: boolean;
    lowStockAlert: boolean;
    customerReview: boolean;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccessMessage('Settings saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Cog6ToothIcon },
    { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
    { id: 'email', label: 'Email', icon: EnvelopeIcon },
    { id: 'payment', label: 'Payment', icon: CurrencyDollarIcon },
    { id: 'shipping', label: 'Shipping', icon: GlobeAltIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ];

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto text-gray-600">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Store Settings</h1>
        <p className="text-gray-600">Configure your store preferences and integrations</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2"
        >
          <CheckCircleIcon className="w-5 h-5" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-1
                  ${activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      value={settings.general.storeName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, storeName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Store Email *
                    </label>
                    <input
                      type="email"
                      value={settings.general.storeEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, storeEmail: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Store Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.general.storePhone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, storePhone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, timezone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    >
                      <option value="UTC-5">Eastern Time (ET)</option>
                      <option value="UTC-6">Central Time (CT)</option>
                      <option value="UTC-7">Mountain Time (MT)</option>
                      <option value="UTC-8">Pacific Time (PT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, currency: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Language
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, language: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Store Address
                    </label>
                    <textarea
                      value={settings.general.storeAddress}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, storeAddress: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: e.target.value as 'light' | 'dark' | 'system' }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, primaryColor: e.target.value }
                      })}
                      className="w-full h-10 px-3 py-1 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={settings.appearance.logo || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, logo: e.target.value }
                      })}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      value={settings.appearance.favicon || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, favicon: e.target.value }
                      })}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b">Email Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpHost: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SMTP Port *
                    </label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpPort: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SMTP Username *
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpUser}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpUser: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SMTP Password *
                    </label>
                    <input
                      type="password"
                      value={settings.email.smtpPass}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpPass: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      From Email *
                    </label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromEmail: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      From Name *
                    </label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b">Payment Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={settings.payment.stripeKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, stripeKey: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stripe Secret Key
                    </label>
                    <input
                      type="password"
                      value={settings.payment.stripeSecret}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, stripeSecret: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      PayPal Client ID
                    </label>
                    <input
                      type="text"
                      value={settings.payment.paypalClientId}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, paypalClientId: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      PayPal Secret
                    </label>
                    <input
                      type="password"
                      value={settings.payment.paypalSecret}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, paypalSecret: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b">Shipping Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Free Shipping Threshold ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, freeShippingThreshold: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Domestic Shipping Rate ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.shipping.domesticRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, domesticRate: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      International Shipping Rate ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.shipping.internationalRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, internationalRate: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Estimated Delivery Days
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.estimatedDays}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, estimatedDays: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b">Notification Settings</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-semibold">Order Confirmation</p>
                      <p className="text-sm text-gray-600">Send email when order is placed</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderConfirmation}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, orderConfirmation: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-semibold">Payment Received</p>
                      <p className="text-sm text-gray-600">Send email when payment is received</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.paymentReceived}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, paymentReceived: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-semibold">Order Shipped</p>
                      <p className="text-sm text-gray-600">Send email when order is shipped</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderShipped}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, orderShipped: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-semibold">Low Stock Alert</p>
                      <p className="text-sm text-gray-600">Get notified when stock is low</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.lowStockAlert}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, lowStockAlert: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-semibold">Customer Review</p>
                      <p className="text-sm text-gray-600">Get notified when customer leaves a review</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.customerReview}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, customerReview: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      Enable 2FA for admin accounts to add an extra layer of security
                    </p>
                    <Button variant="outline" size="sm">
                      Configure 2FA
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">API Keys</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Generate API keys for third-party integrations
                    </p>
                    <Button variant="outline" size="sm">
                      Manage API Keys
                    </Button>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Backup & Restore</h3>
                    <p className="text-sm text-red-700 mb-3">
                      Backup your store data and restore if needed
                    </p>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        Create Backup
                      </Button>
                      <Button variant="outline" size="sm">
                        Restore Backup
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button type="submit" variant="primary" size="lg" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}