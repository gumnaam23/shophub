'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MapPinIcon,
    HomeIcon,
    BuildingOfficeIcon,
    CheckBadgeIcon,
    XMarkIcon,
    PhoneIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface Address {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    type: 'home' | 'work' | 'other';
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        type: 'home',
        isDefault: false,
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/account/addresses');
            const data = await response.json();
            setAddresses(data.addresses);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingAddress
            ? `/api/account/addresses/${editingAddress._id}`
            : '/api/account/addresses';

        const method = editingAddress ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchAddresses();
                setShowForm(false);
                setEditingAddress(null);
                resetForm();
            }
        } catch (error) {
            console.error('Failed to save address:', error);
        }
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        setDeletingId(addressId);
        try {
            const response = await fetch(`/api/account/addresses/${addressId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchAddresses();
            }
        } catch (error) {
            console.error('Failed to delete address:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const setDefaultAddress = async (addressId: string) => {
        try {
            const response = await fetch(`/api/account/addresses/${addressId}/default`, {
                method: 'PUT',
            });

            if (response.ok) {
                await fetchAddresses();
            }
        } catch (error) {
            console.error('Failed to set default address:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
            type: 'home',
            isDefault: false,
        });
    };

    const editAddress = (address: Address) => {
        setEditingAddress(address);
        setFormData(address);
        setShowForm(true);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'home':
                return <HomeIcon className="w-5 h-5" />;
            case 'work':
                return <BuildingOfficeIcon className="w-5 h-5" />;
            default:
                return <MapPinIcon className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'home':
                return 'bg-blue-100 text-blue-600';
            case 'work':
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto text-gray-600">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Addresses</h1>
                    <p className="text-gray-600">
                        Manage your shipping addresses for faster checkout
                    </p>
                </div>

                {/* Show/Hide button */}
                {!showForm && (
                    <Button
                        onClick={() => {
                            resetForm();
                            setEditingAddress(null);
                            setShowForm(true);
                        }}
                        variant="primary"
                        size="md"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New Address
                    </Button>
                )}
            </motion.div>

            {/* Agar showForm true hai to form dikhao, warna addresses dikhao */}
            {showForm ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h2>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingAddress(null);
                                resetForm();
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Address Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as  'home' | 'work' | 'other' })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.addressLine1}
                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Address Line 2 (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.addressLine2}
                                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    ZIP Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    required
                                >
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <span className="text-sm">Set as default address</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" variant="primary" size="lg" fullWidth>
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                fullWidth
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingAddress(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                /* Addresses Grid */
                loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : addresses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md p-12 text-center"
                    >
                        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6">
                            <MapPinIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No addresses saved</h3>
                        <p className="text-gray-600 mb-6">
                            Add your first address to make checkout faster and easier
                        </p>
                        <Button
                            onClick={() => setShowForm(true)}
                            variant="primary"
                            size="lg"
                        >
                            Add Your First Address
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address, index) => (
                            <motion.div
                                key={address._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white rounded-xl shadow-md p-6 border-2 transition-all ${address.isDefault ? 'border-black' : 'border-transparent'
                                    }`}
                            >
                                {address.isDefault && (
                                    <div className="absolute top-4 right-4">
                                        <span className="inline-flex items-center space-x-1 bg-black text-white text-xs px-2 py-1 rounded-full">
                                            <CheckBadgeIcon className="w-3 h-3" />
                                            <span>Default</span>
                                        </span>
                                    </div>
                                )}

                                {/* Address Type Badge */}
                                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs mb-3 ${getTypeColor(address.type)}`}>
                                    {getTypeIcon(address.type)}
                                    <span className="capitalize">{address.type}</span>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-2 mb-4">
                                    <h3 className="font-bold text-lg">{address.fullName}</h3>
                                    <p className="text-gray-600 text-sm">{address.addressLine1}</p>
                                    {address.addressLine2 && (
                                        <p className="text-gray-600 text-sm">{address.addressLine2}</p>
                                    )}
                                    <p className="text-gray-600 text-sm">
                                        {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-gray-600 text-sm">{address.country}</p>
                                    <div className="flex items-center space-x-3 pt-2">
                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                            <PhoneIcon className="w-4 h-4" />
                                            <span>{address.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                            <EnvelopeIcon className="w-4 h-4" />
                                            <span>{address.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2 pt-4 border-t">
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => setDefaultAddress(address._id)}
                                            className="flex-1 text-sm text-gray-600 hover:text-black transition-colors py-2"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => editAddress(address)}
                                        className="flex items-center justify-center space-x-1 flex-1 text-sm text-gray-600 hover:text-black transition-colors py-2"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address._id)}
                                        disabled={deletingId === address._id}
                                        className="flex items-center justify-center space-x-1 flex-1 text-sm text-red-600 hover:text-red-700 transition-colors py-2"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span>{deletingId === address._id ? '...' : 'Delete'}</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}