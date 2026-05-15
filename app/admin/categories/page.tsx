'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
    productCount: number;
    parentCategory?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image: '',
        description: '',
        parentCategory: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingCategory
            ? `/api/admin/categories/${editingCategory._id}`
            : '/api/admin/categories';
        const method = editingCategory ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchCategories();
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleDelete = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchCategories();
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleReorder = async (categoryId: string, direction: 'up' | 'down') => {
        const currentIndex = categories.findIndex(c => c._id === categoryId);
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= categories.length) return;

        const newCategories = [...categories];
        [newCategories[currentIndex], newCategories[newIndex]] = [newCategories[newIndex], newCategories[currentIndex]];

        // Update order numbers
        const updatedCategories = newCategories.map((cat, idx) => ({ ...cat, order: idx }));

        try {
            await fetch('/api/admin/categories/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: updatedCategories }),
            });
            setCategories(updatedCategories);
        } catch (error) {
            console.error('Failed to reorder categories:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            image: '',
            description: '',
            parentCategory: '',
            order: 0,
            isActive: true,
        });
        setEditingCategory(null);
    };

    const editCategory = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            image: category.image,
            description: category.description,
            parentCategory: category.parentCategory || '',
            order: category.order,
            isActive: category.isActive,
        });
        setShowModal(true);
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
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Categories</h1>
                    <p className="text-gray-600">
                        Manage your product categories ({categories.length} categories)
                    </p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    variant="primary"
                    size="md"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add New Category
                </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <motion.div
                        key={category._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                        {/* Category Image */}
                        <div className="relative h-48 bg-gray-100">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <PhotoIcon className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleReorder(category._id, 'up')}
                                    disabled={index === 0}
                                    className="p-1 bg-white rounded shadow-md hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronUpIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleReorder(category._id, 'down')}
                                    disabled={index === categories.length - 1}
                                    className="p-1 bg-white rounded shadow-md hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Category Info */}
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{category.name}</h3>
                                    <p className="text-sm text-gray-500">/{category.slug}</p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {category.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                {category.description || 'No description'}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {category.productCount} products
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => editCategory(category)}
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="p-1 hover:bg-red-100 rounded transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <p className="text-gray-500">No categories found</p>
                </div>
            )}

            {/* Category Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} onClick={() => setShowModal(false)}>
                        <motion.div style={{
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            width: '90%',
                            maxWidth: '28rem',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }} onClick={(e) => e.stopPropagation()}>

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                            });
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Parent Category
                                    </label>
                                    <select
                                        value={formData.parentCategory}
                                        onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    >
                                        <option value="">None (Top Level)</option>
                                        {categories
                                            .filter(c => c._id !== editingCategory?._id)
                                            .map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    />
                                </div>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">Active</span>
                                </label>

                                <div className="flex space-x-3 pt-4">
                                    <Button type="submit" variant="primary" size="lg" fullWidth>
                                        {editingCategory ? 'Update' : 'Create'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        fullWidth
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}