
"use client"
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ShoppingCartIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  HeartIcon,
  EyeIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Button from '@/app/components/ui/Button';
import { ICategory, IProduct } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export interface CartItemType {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: number;
  isOnSale?: boolean;
  comparePrice?: number;
}

export interface CartType {
  items: CartItemType[];
  totalItems: number;
  totalPrice: number;
}

// Hero Component
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroImages = [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={heroImages[currentImage]}
              alt="Hero background"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div style={{ y, opacity }} className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Summer Collection 2024
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            Discover the latest trends with up to 50% off
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button variant="primary" size="lg">
              Shop Now <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImage === index ? 'w-8 bg-white' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

// Featured Categories Component
const CategoriesSection = ({ categories }: { categories: ICategory[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of products across various categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl"
            >
              <div className="relative h-80">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <motion.div
                animate={{ y: hoveredIndex === index ? -10 : 0 }}
                className="absolute bottom-0 left-0 right-0 p-6 text-white"
              >
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm mb-3">{category.productCount}+ Products</p>
                <Button variant="outline" size="sm">
                  Shop Now <ArrowRightIcon className="w-4 h-4 ml-1 inline" />
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product, index }: { product: IProduct; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter()

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();

      if (!sessionData?.user?.id) {
        alert('Please login to add items to cart');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        }),
      });

      if (response.ok) {
        console.log('Product added to cart successfully');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const error = await response.json();
        console.error('Failed to add to cart:', error.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Button mein
  <Button
    variant="primary"
    size="sm"
    onClick={() => handleAddToCart()}  // ✅ Arrow function wrapper
    disabled={isAddingToCart}
  >
    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
  </Button>



  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <Link href={`/products/${product._id}`}>
        <div className="relative h-80 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {product.isOnSale && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
              SALE
            </div>
          )}

          {product.isNewProduct  && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
              NEW
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white p-3 rounded-full hover:bg-gray-100"
              onClick={(e) => e.preventDefault()}
            >
              <EyeIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-3 rounded-full transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white'
                }`}
            >
              <HeartIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-white p-3 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <div className="flex items-center">
              <StarSolidIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm ml-1">{product.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              {product.isOnSale && product.comparePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-500">${product.price}</span>
                  <span className="text-gray-400 line-through ml-2">${product.comparePrice}</span>
                </>
              ) : (
                <span className="text-2xl font-bold">${product.price}</span>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAddToCart()}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Featured Products Section
const FeaturedProductsSection = ({ products, title, icon }: {
  products: IProduct[];
  title: string;
  icon: React.ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {icon}
              <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            </div>
            <p className="text-gray-600">Handpicked just for you</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full border disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full border disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Free Shipping",
      description: "On orders over $50"
    },
    {
      icon: <ArrowPathIcon className="w-8 h-8" />,
      title: "30-Day Returns",
      description: "Easy returns policy"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Dedicated customer service"
    }
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">Trusted by thousands of happy customers</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{testimonials[currentIndex].name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg italic">{`"${testimonials[currentIndex].comment}"`}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'w-8 bg-black' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Newsletter Section
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 3000);
      } else {
        setError(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new products and upcoming sales
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            />
            <Button type="submit" variant="primary" size="md" disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-red-400"
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence>
            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 text-green-400"
              >
                Thank you for subscribing! 🎉
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};


type Testimonial = {
  name: string;
  avatar: string;
  comment: string;
};
// Main Homepage Component
export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<IProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel API calls
        const [featuredRes, newRes, bestRes, categoriesRes] = await Promise.all([
          fetch('/api/products?isFeatured=true&limit=8'),
          fetch('/api/products?isNew=true&limit=8'),
          fetch('/api/products?rating=4.5&limit=8'),
          fetch('/api/categories?limit=4'),
        ]);

        const featuredData = await featuredRes.json();
        const newData = await newRes.json();
        const bestData = await bestRes.json();
        const categoriesData = await categoriesRes.json();

        // Set data if success
        if (featuredData.success) {
          setFeaturedProducts(featuredData.data);
        }

        if (newData.success) {
          setNewArrivals(newData.data);
        }

        if (bestData.success) {
          setBestSellers(bestData.data);
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock testimonials for demo
  const testimonials = [
    {
      name: "John Doe",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=200&q=80",
      comment: "Amazing products! The quality is outstanding and delivery was super fast."
    },
    {
      name: "Jane Smith",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&fit=crop&w=200&q=80",
      comment: "Best shopping experience ever. Customer support is very helpful!"
    },
    {
      name: "Mike Johnson",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&fit=crop&w=200&q=80",
      comment: "Great variety of products at reasonable prices. Will shop again!"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection categories={categories} />
        <FeaturedProductsSection
          products={featuredProducts}
          title="Featured Products"
          icon={<FireIcon className="w-8 h-8 text-red-500" />}
        />
        <FeaturedProductsSection
          products={newArrivals}
          title="New Arrivals"
          icon={<SparklesIcon className="w-8 h-8 text-yellow-500" />}
        />
        <FeaturedProductsSection
          products={bestSellers}
          title="Best Sellers"
          icon={<StarSolidIcon className="w-8 h-8 text-yellow-500" />}
        />
        <TestimonialsSection testimonials={testimonials} />
        <NewsletterSection />
      </main>
    </>
  );
}