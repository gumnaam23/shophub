'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  TagIcon,
  InformationCircleIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { UserProfile } from '@/app/components/UserProfile';
import { ShieldCheckIcon } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isLoading = status === 'loading';
  const role = session?.user?.role || 'user';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const navItems = [
    { name: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Shop', href: '/products', icon: <TagIcon className="w-5 h-5" /> },
    { name: 'About', href: '/about', icon: <InformationCircleIcon className="w-5 h-5" /> },
    { name: 'Contact', href: '/contact', icon: <PhoneIcon className="w-5 h-5" /> },
  ];

  // Add admin link if user is admin
  if (role === 'admin') {
    navItems.push({ name: 'Admin', href: '/admin', icon: <ShieldCheckIcon className="w-5 h-5" /> });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  // NOT recommended
  if (pathname.startsWith("/account") || pathname.startsWith("/admin")) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent"
            >
              ShopHub
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative group flex items-center space-x-1 transition-colors ${
                  pathname === item.href 
                    ? 'text-black font-semibold' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-64 px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-black"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist - without count */}
            <Link href="/account/wishlist">
              <HeartIcon className="w-6 h-6 text-gray-600 hover:text-black transition-colors" />
            </Link>

            {/* Cart - without count */}
            <Link href="/cart">
              <ShoppingBagIcon className="w-6 h-6 text-gray-600 hover:text-black transition-colors" />
            </Link>

            {/* User Profile Dropdown */}
            {!isLoading && (
              <UserProfile isMobile={false} />
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <button type="submit" className="absolute right-3 top-2.5">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile User Profile */}
              <div className="pt-4 border-t mt-4">
                <UserProfile isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}