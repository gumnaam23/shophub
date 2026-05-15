'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

// ✅ ToggleSwitch component - OUTSIDE the main component
const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-black' : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false,
  });

  // Load preferences from API
  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/cookie-preferences');
      const data = await response.json();
      if (data.success && data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // Save preferences to API
  const savePreferences = async (prefs: CookiePreferences) => {
    try {
      const response = await fetch('/api/cookie-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: prefs }),
      });
      
      if (response.ok) {
        localStorage.setItem('cookieConsent', 'true');
        setPreferences(prefs);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  };

  // ✅ Fixed useEffect - no direct setState in effect body
  useEffect(() => {
    const checkConsent = async () => {
      const hasConsented = localStorage.getItem('cookieConsent');
      if (!hasConsented) {
        setShowBanner(true);
      } else {
        await loadPreferences();
      }
    };
    
    checkConsent();
  }, []);

  const acceptAll = async () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    await savePreferences(allPreferences);
    setShowBanner(false);
  };

  const rejectAll = async () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    await savePreferences(minimalPreferences);
    setShowBanner(false);
  };

  const saveSettings = async () => {
    await savePreferences(preferences);
    setShowSettings(false);
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-lg border-t"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">🍪 Cookie Settings</h3>
                <p className="text-sm text-gray-600">
                  {`We use cookies to enhance your browsing experience. By clicking "Accept All", you consent to our use of cookies.`}
                </p>
                <Link href="/cookie-policy" className="text-sm text-black underline mt-2 inline-block">
                  Learn more
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center space-x-1 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Customize</span>
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>

          {/* Settings Modal */}
          <AnimatePresence>
            {showSettings && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                  onClick={() => setShowSettings(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 50 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50 w-full max-w-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Cookie Preferences</h3>
                    <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 rounded-full">
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Essential Cookies</p>
                        <p className="text-xs text-gray-500">Required for website functionality</p>
                      </div>
                      <span className="text-green-600 text-sm">Always Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Analytics Cookies</p>
                        <p className="text-xs text-gray-500">Help us improve our website</p>
                      </div>
                      <ToggleSwitch 
                        enabled={preferences.analytics}
                        onChange={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Functional Cookies</p>
                        <p className="text-xs text-gray-500">Remember your preferences</p>
                      </div>
                      <ToggleSwitch 
                        enabled={preferences.functional}
                        onChange={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Marketing Cookies</p>
                        <p className="text-xs text-gray-500">Personalized advertising</p>
                      </div>
                      <ToggleSwitch 
                        enabled={preferences.marketing}
                        onChange={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                      />
                    </div>
                  </div>
                  <Button onClick={saveSettings} variant="primary" size="md" fullWidth>
                    Save Preferences
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}