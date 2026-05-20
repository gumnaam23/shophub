'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeftIcon,
    PlusIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface ProductForm {
    name: string;
    description: string;
    longDescription: string;
    price: number;
    comparePrice: number;
    images: string[];
    category: string;
    tags: string[];
    stock: number;
    isFeatured: boolean;
    isNewProduct: boolean;
    isOnSale: boolean;
    status: 'active' | 'draft' | 'archived';
    specifications: Record<string, string>;
}

interface Category {
    _id: string;
    name: string;
    slug?: string;
    image?: string;
    description?: string;
}

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newTag, setNewTag] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');

    const [formData, setFormData] = useState<ProductForm>({
        name: '',
        description: '',
        longDescription: '',
        price: 0,
        comparePrice: 0,
        images: [],
        category: '',
        tags: [],
        stock: 0,
        isFeatured: false,
        isNewProduct: false,
        isOnSale: false,
        status: 'draft',
        specifications: {},
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories');
            const data = await response.json();
            if (data.categories) {
                setCategories(data.categories as Category[]);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/products/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/products');
            } else {
                const error = await response.json();
                console.error('Failed to create product:', error);
            }
        } catch (error) {
            console.error('Failed to create product:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData({ ...formData, tags: [...formData.tags, newTag] });
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    const addImage = () => {
        if (newImage && !formData.images.includes(newImage)) {
            setFormData({ ...formData, images: [...formData.images, newImage] });
            setNewImage('');
        }
    };

    const removeImage = (image: string) => {
        setFormData({ ...formData, images: formData.images.filter(i => i !== image) });
    };

    const addSpecification = () => {
        if (newSpecKey && newSpecValue) {
            setFormData({
                ...formData,
                specifications: { ...formData.specifications, [newSpecKey]: newSpecValue },
            });
            setNewSpecKey('');
            setNewSpecValue('');
        }
    };

    const removeSpecification = (key: string) => {
        const newSpecs = { ...formData.specifications };
        delete newSpecs[key];
        setFormData({ ...formData, specifications: newSpecs });
    };

    return (
        <div className="max-w-7xl mx-auto text-gray-600">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center text-gray-600 hover:text-black mb-4"
                >
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-bold">Create New Product</h1>
                <p className="text-gray-600 mt-2">Add a new product to your store</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Short Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Long Description
                                    </label>
                                    <textarea
                                        value={formData.longDescription}
                                        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                        rows={6}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Pricing</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Compare Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.comparePrice}
                                        onChange={(e) => setFormData({ ...formData, comparePrice: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Inventory</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.tags.map(tag => (
                                        <span key={tag} className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                                            <span>{tag}</span>
                                            <button type="button" onClick={() => removeTag(tag)}>
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="Add a tag"
                                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                    />
                                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                                        <PlusIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Product Images</h2>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <Image src={image} alt={`Product ${index + 1}`} fill className="object-cover" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <TrashIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                                    <span className="text-xs text-gray-400 mt-1">Add Image</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="url"
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    placeholder="Image URL"
                                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                />
                                <Button type="button" onClick={addImage} variant="outline" size="sm">
                                    Add Image
                                </Button>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Specifications</h2>
                            <div className="space-y-2 mb-4">
                                {Object.entries(formData.specifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                        <span className="font-semibold w-1/3">{key}:</span>
                                        <span className="flex-1">{value}</span>
                                        <button type="button" onClick={() => removeSpecification(key)}>
                                            <TrashIcon className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newSpecKey}
                                    onChange={(e) => setNewSpecKey(e.target.value)}
                                    placeholder="Key (e.g., Weight)"
                                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                />
                                <input
                                    type="text"
                                    value={newSpecValue}
                                    onChange={(e) => setNewSpecValue(e.target.value)}
                                    placeholder="Value (e.g., 1.5kg)"
                                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                />
                                <Button type="button" onClick={addSpecification} variant="outline" size="sm">
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Product Status</h2>
                            <div className="space-y-3">
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'archived' })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Product Features</h2>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span>Featured Product</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNewProduct}
                                        onChange={(e) => setFormData({ ...formData, isNewProduct: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span>New Arrival</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isOnSale}
                                        onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span>On Sale</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Actions</h2>
                            <div className="space-y-3">
                                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Product'}
                                </Button>
                                <Link href="/admin/products">
                                    <Button type="button" variant="outline" size="lg" fullWidth>
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}