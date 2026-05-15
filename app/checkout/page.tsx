'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CreditCardIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    UserIcon,
    LockClosedIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    DocumentTextIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolidIcon } from '@heroicons/react/24/solid';
import Button from '@/app/components/ui/Button';
import { Address, CartItem, OrderSummary, PaymentDetails } from '@/types/checkout';
import { TagIcon } from 'lucide-react';

// Types for store settings
interface StoreSettings {
    general: {
        storeName: string;
        storeEmail: string;
        storePhone: string;
        storeAddress: string;
        timezone: string;
        currency: string;
        language: string;
    };
    shipping: {
        freeShippingThreshold: number;
        domesticRate: number;
        internationalRate: number;
        estimatedDays: number;
    };
    tax: {
        rate: number;
        enabled: boolean;
    };
}

// Step Indicator Component
const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => {
    return (
        <div className="mb-8 text-gray-600">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step} className="flex-1 relative">
                        <div className="flex items-center">
                            <div className={`flex-1 ${index > 0 ? 'ml-[-10px]' : ''}`}>
                                <div className={`h-1 ${index < currentStep ? 'bg-black' : index === currentStep ? 'bg-black/50' : 'bg-gray-200'}`} />
                            </div>
                            <div className="relative">
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${index < currentStep ? 'bg-black text-white' :
                                        index === currentStep ? 'bg-black/80 text-white border-2 border-black' :
                                            'bg-gray-200 text-gray-400'}
                `}>
                                    {index < currentStep ? (
                                        <CheckCircleIcon className="w-5 h-5" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <p className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                                    {step}
                                </p>
                            </div>
                            <div className={`flex-1 ${index === steps.length - 1 ? 'hidden' : ''}`}>
                                <div className={`h-1 ${index < currentStep ? 'bg-black' : 'bg-gray-200'}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Shipping Form Component
const ShippingForm = ({
    address,
    setAddress,
    onNext
}: {
    address: Address;
    setAddress: (addr: Address) => void;
    onNext: () => void;
}) => {
    const [errors, setErrors] = useState<Partial<Address>>({});

    const validateForm = () => {
        const newErrors: Partial<Address> = {};

        if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!address.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) newErrors.email = 'Invalid email format';
        if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!address.city.trim()) newErrors.city = 'City is required';
        if (!address.state.trim()) newErrors.state = 'State is required';
        if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white rounded-2xl shadow-md p-6 text-gray-600"
        >
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={address.fullName}
                                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={address.email}
                                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="john@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={address.phone}
                                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Address Line 1 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={address.addressLine1}
                                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="123 Main St"
                            />
                        </div>
                        {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                        <input
                            type="text"
                            value={address.addressLine2}
                            onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            placeholder="Apt 4B"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="New York"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            State <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="NY"
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={address.zipCode}
                            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="10001"
                        />
                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={address.country}
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button type="submit" variant="primary" size="lg">
                        Continue to Payment
                        <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

// Payment Form Component
const PaymentForm = ({
    payment,
    setPayment,
    onBack,
    onNext
}: {
    payment: PaymentDetails;
    setPayment: (pay: PaymentDetails) => void;
    onBack: () => void;
    onNext: () => void;
}) => {
    const [errors, setErrors] = useState<Partial<PaymentDetails>>({});
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

    const validateForm = () => {
        const newErrors: Partial<PaymentDetails> = {};

        if (paymentMethod === 'card') {
            if (!payment.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
            if (!/^\d{16}$/.test(payment.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
            if (!payment.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
            if (!payment.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
            if (!/^\d{2}\/\d{2}$/.test(payment.expiryDate)) newErrors.expiryDate = 'Invalid format (MM/YY)';
            if (!payment.cvv.trim()) newErrors.cvv = 'CVV is required';
            if (!/^\d{3,4}$/.test(payment.cvv)) newErrors.cvv = 'Invalid CVV';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onNext();
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
        return v.replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) {
            return `${v.slice(0, 2)}/${v.slice(2)}`;
        }
        return v;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white rounded-2xl shadow-md p-6 text-gray-600"
        >
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

            {/* Payment Method Selection */}
            <div className="mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 p-4 border-2 rounded-lg transition-all ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'
                            }`}
                    >
                        <CreditCardIcon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">Credit Card</p>
                    </button>
                    <button
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex-1 p-4 border-2 rounded-lg transition-all ${paymentMethod === 'paypal' ? 'border-black bg-gray-50' : 'border-gray-200'
                            }`}
                    >
                        <BanknotesIcon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">PayPal</p>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {paymentMethod === 'card' ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Card Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={payment.cardNumber}
                                onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Cardholder Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={payment.cardName}
                                onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.cardName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="JOHN DOE"
                            />
                            {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Expiry Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={payment.expiryDate}
                                    onChange={(e) => setPayment({ ...payment, expiryDate: formatExpiry(e.target.value) })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    CVV <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={payment.cvv}
                                    onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="123"
                                    maxLength={4}
                                />
                                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                            <LockClosedIcon className="w-4 h-4" />
                            <span>Your payment information is encrypted and secure</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <BanknotesIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">
                            You will be redirected to PayPal to complete your payment
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <ShieldCheckIcon className="w-4 h-4" />
                            <span>Secure payment by PayPal</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" size="lg" onClick={onBack}>
                        <ChevronLeftIcon className="w-5 h-5 mr-2" />
                        Back to Shipping
                    </Button>
                    <Button type="submit" variant="primary" size="lg">
                        Review Order
                        <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

interface OrderReviewProps {
    cartItems: CartItem[];
    address: Address;
    orderSummary: OrderSummary;
    couponCode: string | null;
    discount: number;
    isApplyingCoupon: boolean;
    couponError: string;
    onApplyCoupon: (code: string) => Promise<void>;
    onRemoveCoupon: () => void;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    settings: StoreSettings | null;
}

const OrderReview = ({
    cartItems,
    address,
    orderSummary,
    couponCode,
    discount,
    isApplyingCoupon,
    couponError,
    onApplyCoupon,
    onRemoveCoupon,
    onBack,
    onSubmit,
    isSubmitting,
    settings
}: OrderReviewProps) => {
    const [couponInput, setCouponInput] = useState('');

    const handleApplyCoupon = () => {
        if (couponInput.trim()) {
            onApplyCoupon(couponInput);
            setCouponInput('');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-6 text-gray-900"
        >
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Order Items</h3>
                <div className="space-y-3">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center space-x-4 py-3 border-b">
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
                <div className="space-y-1 text-gray-600">
                    <p>{address.fullName}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                    <p>{address.email}</p>
                </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Apply Coupon</h3>
                {couponCode ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <TagIcon className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-600">{couponCode}</span>
                            <span className="text-green-600">-${discount.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={onRemoveCoupon}
                            className="text-red-500 hover:text-red-600"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                            />
                            <Button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || !couponInput.trim()}
                                variant="outline"
                                size="sm"
                            >
                                {isApplyingCoupon ? 'Applying...' : 'Apply'}
                            </Button>
                        </div>
                        {couponError && (
                            <p className="text-red-500 text-sm">{couponError}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${orderSummary.subtotal.toFixed(2)}</span>
                    </div>

                    {orderSummary.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount {couponCode && `(${couponCode})`}</span>
                            <span>-${orderSummary.discount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax ({settings?.tax?.rate || 10}%)</span>
                        <span>${orderSummary.tax.toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span>${orderSummary.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                {settings?.shipping?.freeShippingThreshold && orderSummary.subtotal < settings.shipping.freeShippingThreshold && (
                    <p className="text-sm text-gray-500 mt-2">
                        Add ${(settings.shipping.freeShippingThreshold - orderSummary.subtotal).toFixed(2)} more for free shipping
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={onBack}>
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Back to Payment
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Place Order
                            <DocumentTextIcon className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
};

// Order Confirmation Component
const OrderConfirmation = ({ orderId }: { orderId: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
        >
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
                <CheckSolidIcon className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-2">
                Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-gray-600 mb-6">
                Order ID: <span className="font-semibold">{orderId}</span>
            </p>
            <p className="text-gray-500 text-sm mb-8">
                A confirmation email has been sent to your email address.
            </p>
            <div className="space-x-4">
                <Link href={`/account/orders/${orderId}`}>
                    <Button variant="outline" size="lg">
                        View Order
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="primary" size="lg">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

// Main Checkout Page
export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [settings, setSettings] = useState<StoreSettings | null>(null);

    // Coupon state variables
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [couponId, setCouponId] = useState<string | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponError, setCouponError] = useState('');

    const [address, setAddress] = useState<Address>({
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
    });

    const [payment, setPayment] = useState<PaymentDetails>({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const steps = ['Shipping', 'Payment', 'Review'];

    // Fetch store settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                if (data.success) {
                    setSettings(data.settings);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    // Calculate order summary with discount and settings
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Shipping calculation based on settings
    const freeShippingThreshold = settings?.shipping?.freeShippingThreshold || 50;
    const domesticRate = settings?.shipping?.domesticRate || 5.99;
    const shipping = subtotal >= freeShippingThreshold ? 0 : domesticRate;

    // Tax calculation based on settings
    const taxRate = settings?.tax?.rate || 10;
    const tax = (subtotal - discount) * (taxRate / 100);
    const total = subtotal - discount + shipping + tax;

    const orderSummary = { subtotal, discount, shipping, tax, total };

    // Apply Coupon Function
    const applyCoupon = async (code: string) => {
        setIsApplyingCoupon(true);
        setCouponError('');

        try {
            const response = await fetch('/api/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code.toUpperCase(),
                    subtotal
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid coupon code');
            }

            setDiscount(data.discount);
            setCouponCode(data.couponCode);
            setCouponId(data.couponId);

        } catch (error: unknown) {
            if (error instanceof Error) {
                setCouponError(error.message);
            } else {
                setCouponError('Something went wrong');
            }
            throw error;
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    // Remove Coupon Function
    const removeCoupon = () => {
        setDiscount(0);
        setCouponCode(null);
        setCouponId(null);
        setCouponError('');
    };

    // Load cart items
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const response = await fetch('/api/cart');
                const data = await response.json();

                if (data.items) {
                    setCartItems(data.items);
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);



    const handlePlaceOrder = async () => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    shippingAddress: address,
                    paymentMethod: payment.cardNumber ? 'card' : 'paypal',
                    orderSummary: {
                        subtotal,
                        discount,
                        shipping,
                        tax,
                        total
                    },
                    couponCode: couponCode,
                    couponId: couponId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            setOrderId(data.order._id);

            // Clear cart from localStorage
            localStorage.removeItem('cart');

            // Clear cart from backend
            const sessionRes = await fetch('/api/auth/session');
            const sessionData = await sessionRes.json();

            if (sessionData?.user?.id) {
                await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ clearAll: true })
                });
            }

            window.dispatchEvent(new Event('cartUpdated'));
            setOrderComplete(true);
            setCurrentStep(3);
        } catch (error) {
            console.error('Order placement failed:', error);
            alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (cartItems.length === 0 && !orderComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <Link href="/products">
                        <Button variant="primary">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="container mx-auto px-4 py-8">
                <OrderConfirmation orderId={orderId} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-black mb-4">
                            <ChevronLeftIcon className="w-4 h-4 mr-2" />
                            Back to Cart
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-600">Checkout</h1>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator currentStep={currentStep} steps={steps} />

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <ShippingForm
                                address={address}
                                setAddress={setAddress}
                                onNext={() => setCurrentStep(1)}
                            />
                        )}

                        {currentStep === 1 && (
                            <PaymentForm
                                payment={payment}
                                setPayment={setPayment}
                                onBack={() => setCurrentStep(0)}
                                onNext={() => setCurrentStep(2)}
                            />
                        )}

                        {currentStep === 2 && (
                            <OrderReview
                                cartItems={cartItems}
                                address={address}
                                orderSummary={orderSummary}
                                couponCode={couponCode}
                                discount={discount}
                                isApplyingCoupon={isApplyingCoupon}
                                couponError={couponError}
                                onApplyCoupon={applyCoupon}
                                onRemoveCoupon={removeCoupon}
                                onBack={() => setCurrentStep(1)}
                                onSubmit={handlePlaceOrder}
                                isSubmitting={isSubmitting}
                                settings={settings}
                            />
                        )}
                    </AnimatePresence>

                    {/* Security Notice */}
                    {currentStep < 3 && (
                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <LockClosedIcon className="w-4 h-4" />
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <ShieldCheckIcon className="w-4 h-4" />
                                    <span>Privacy Protected</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}