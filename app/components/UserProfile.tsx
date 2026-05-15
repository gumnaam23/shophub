'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  MapPinIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { IUser } from '@/models/User';

interface UserProfileProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function UserProfile({ isMobile = false, onClose }: UserProfileProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isSignedIn = session?.user;
  const user = session?.user;
  const role = (user as IUser)?.role || 'user';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-3">
        <Link href="/auth/login" onClick={onClose}>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Sign In
          </button>
        </Link>
        <Link href="/auth/register" onClick={onClose}>
          <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    );
  }

  // Mobile version (no dropdown, just full menu)
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
            {role === 'admin' && (
              <div className="text-xs text-red-500 font-medium mt-0.5">Admin</div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Link href="/profile" onClick={onClose}>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <UserIcon className="w-5 h-5" />
              <span>My Profile</span>
            </div>
          </Link>
          <Link href="/orders" onClick={onClose}>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingBagIcon className="w-5 h-5" />
              <span>My Orders</span>
            </div>
          </Link>
          <Link href="/wishlist" onClick={onClose}>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <HeartIcon className="w-5 h-5" />
              <span>Wishlist</span>
            </div>
          </Link>
          <Link href="/addresses" onClick={onClose}>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MapPinIcon className="w-5 h-5" />
              <span>Saved Addresses</span>
            </div>
          </Link>
          <Link href="/payment-methods" onClick={onClose}>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <CreditCardIcon className="w-5 h-5" />
              <span>Payment Methods</span>
            </div>
          </Link>
          <Link href="/change-password" onClick={onClose}>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <KeyIcon className="w-5 h-5" />
              <span>Change Password</span>
            </div>
          </Link>
          {role === 'admin' && (
            <Link href="/admin" onClick={onClose}>
              <div className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600">
                <ShieldCheckIcon className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </div>
            </Link>
          )}
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop version (dropdown)
  return (
    <div className="relative text-gray-800">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border z-50 overflow-hidden"
          >
            {/* User Info Section */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                  {role === 'admin' && (
                    <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">My Profile</span>
                </div>
              </Link>
              <Link href="/orders" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <ShoppingBagIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">My Orders</span>
                </div>
              </Link>
              <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <HeartIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Wishlist</span>
                </div>
              </Link>
              <Link href="/addresses" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <MapPinIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Saved Addresses</span>
                </div>
              </Link>
              <Link href="/payment-methods" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <CreditCardIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Payment Methods</span>
                </div>
              </Link>
              <Link href="/change-password" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <KeyIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Change Password</span>
                </div>
              </Link>
              <Link href="/settings" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Settings</span>
                </div>
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* Admin Section (if admin) */}
            {role === 'admin' && (
              <>
                <div className="py-2">
                  <Link href="/admin" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors cursor-pointer">
                      <ShieldCheckIcon className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Admin Dashboard</span>
                    </div>
                  </Link>
                </div>
                <div className="border-t"></div>
              </>
            )}

            {/* Logout Button */}
            <div className="py-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors cursor-pointer text-red-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}