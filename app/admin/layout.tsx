'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  TagIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  StarIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface AdminMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const menuItems: AdminMenuItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Orders', href: '/admin/orders', icon: DocumentTextIcon, badge: 12 },
  { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Inventory', href: '/admin/inventory', icon: CubeIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: StarIcon, badge: 5 },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Payments', href: '/admin/payments', icon: CurrencyDollarIcon },
  { name: 'Blogs', href: '/admin/blog', icon: PencilSquareIcon },
  { name: 'Contact', href: '/admin/contact', icon: EnvelopeIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
    } else if (session.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button - Always on top */}
      <div style={{ zIndex: 55 }} className="lg:hidden fixed top-4 left-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ x: -288 }}
        animate={{ x: isMobileMenuOpen ? 0 : -288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ zIndex: 50 }}
        className={`
    fixed left-0 top-0 h-full w-72 bg-white shadow-xl
    lg:translate-x-0
  `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-gray-500">ShopHub Dashboard</p>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'Admin'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">A</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg transition-all
                    ${isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${isActive ? 'bg-white text-black' : 'bg-red-500 text-white'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRightIcon className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.div>


      {/* Main Content */}
      <div className="lg:pl-72 min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}