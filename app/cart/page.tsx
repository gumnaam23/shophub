'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    TrashIcon,
    PlusIcon,
    MinusIcon,
    ShoppingBagIcon,
    ArrowLeftIcon,
    CreditCardIcon,
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    GiftIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';
import { FaCcAmex, FaCcMastercard, FaCcPaypal, FaCcVisa } from 'react-icons/fa';

// Types
interface CartItem {
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

// Cart Item Component
const CartItemComponent = ({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating
}: {
    item: CartItem;
    onUpdateQuantity: (id: string, quantity: number) => Promise<void>;
    onRemove: (id: string) => Promise<void>;
    isUpdating: boolean;
}) => {
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    const [updating, setUpdating] = useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > item.stock) return;

        setLocalQuantity(newQuantity);
        setUpdating(true);
        await onUpdateQuantity(item._id, newQuantity);
        setUpdating(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden mb-4"
        >
            <div className="flex flex-col md:flex-row items-center p-4 gap-4">
                {/* Product Image */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                    />
                    {item.isOnSale && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            SALE
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                    <Link href={`/products/${item._id}`}>
                        <h3 className="font-semibold text-lg hover:text-gray-600 transition-colors">
                            {item.name}
                        </h3>
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                        {item.isOnSale && item.comparePrice ? (
                            <>
                                <span className="text-2xl font-bold text-red-500">${item.price}</span>
                                <span className="text-gray-400 line-through">${item.comparePrice}</span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold">${item.price}</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        In Stock: {item.stock} items
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center border rounded-lg">
                        <button
                            onClick={() => handleQuantityChange(localQuantity - 1)}
                            disabled={localQuantity <= 1 || updating}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">
                            {updating ? '...' : localQuantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(localQuantity + 1)}
                            disabled={localQuantity >= item.stock || updating}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-[100px]">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold">
                            ${(item.price * localQuantity).toFixed(2)}
                        </p>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Empty Cart Component
const EmptyCart = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
        >
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
                {` Looks like you haven't added any items to your cart yet.`}
            </p>
            <Link href="/products">
                <Button variant="primary" size="lg">
                    Continue Shopping
                </Button>
            </Link>
        </motion.div>
    );
};

// Order Summary Component
const OrderSummary = ({
    subtotal,
    shipping,
    tax,
    total,
}: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-md p-6 sticky top-24"
        >
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Including ${tax.toFixed(2)} in taxes
                    </p>
                </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout">
                <Button variant="primary" size="lg" fullWidth>
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                </Button>
            </Link>

            {/* Payment Guarantees */}
            <div className="mt-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <TruckIcon className="w-4 h-4" />
                        <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>30-Day Returns</span>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t">
                <div className="flex justify-center space-x-4">
                    <FaCcVisa size={30} className="text-gray-600" />
                    <FaCcMastercard size={30} className="text-gray-600" />
                    <FaCcPaypal size={30} className="text-gray-600" />
                    <FaCcAmex size={30} className="text-gray-600" />
                </div>
            </div>
        </motion.div>
    );
};

// Free Shipping Progress Bar
const FreeShippingProgress = ({ subtotal }: { subtotal: number }) => {
    const freeShippingThreshold = 50;
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    const remaining = freeShippingThreshold - subtotal;

    if (subtotal >= freeShippingThreshold) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 "
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <TruckIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Free Shipping</span>
                </div>
                <span className="text-sm">
                    Add ${remaining.toFixed(2)} more to unlock
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
                />
            </div>
        </motion.div>
    );
};

// Main Cart Page Component
export default function CartPage() {
    const { status } = useSession();
    const isSignedIn = status === 'authenticated';
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Load cart from backend or localStorage
    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            try {
                if (isSignedIn) {
                    // Logged in user - fetch from backend
                    const response = await fetch('/api/cart');
                    if (response.ok) {
                        const data = await response.json();
                        setCartItems(data.items || []);
                    }
                } else {
                    // Guest user - load from localStorage
                    const savedCart = localStorage.getItem('cart');
                    if (savedCart) {
                        setCartItems(JSON.parse(savedCart));
                    }
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [isSignedIn]);

    // Save cart changes
    useEffect(() => {
        if (!loading && !syncing) {
            // Always save to localStorage

            // If logged in, sync to backend
            if (isSignedIn && cartItems.length > 0) {
                const syncToBackend = async () => {
                    setSyncing(true);
                    try {
                        // Sync each item to backend
                        for (const item of cartItems) {
                            await fetch('/api/cart', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    productId: item._id,
                                    quantity: item.quantity
                                })
                            });
                        }
                    } catch (error) {
                        console.error('Failed to sync cart:', error);
                    } finally {
                        setSyncing(false);
                    }
                };
                syncToBackend();
            }
        }
    }, [cartItems, loading, isSignedIn]);

    // Update quantity
    const updateQuantity = async (productId: string, newQuantity: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Remove item
    const removeItem = async (productId: string) => {
        setCartItems(prev => prev.filter(item => item._id !== productId));

        if (isSignedIn) {
            try {
                await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId })
                });
            } catch (error) {
                console.error('Failed to remove item:', error);
            }
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 text-gray-800">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="mb-8">
                    <Link href="/products" className="inline-flex items-center text-gray-600 hover:text-black mb-4">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
                </div>

                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Column */}
                        <div className="lg:col-span-2">
                            <FreeShippingProgress subtotal={subtotal} />

                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item) => (
                                    <CartItemComponent
                                        key={item._id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                        isUpdating={syncing}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Special Offers */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6"
                            >
                                <div className="flex items-center space-x-3 mb-3">
                                    <GiftIcon className="w-6 h-6 text-orange-600" />
                                    <h3 className="font-semibold text-lg">Special Offer</h3>
                                </div>
                                <p className="text-gray-700">
                                    Add ${(30 - subtotal).toFixed(2)} more to your cart and get a free gift!
                                    <Link href="/products" className="text-orange-600 hover:underline ml-2">
                                        Shop Now →
                                    </Link>
                                </p>
                            </motion.div>
                        </div>

                        {/* Order Summary Column */}
                        <div>
                            <OrderSummary
                                subtotal={subtotal}
                                shipping={shipping}
                                tax={tax}
                                total={total}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}