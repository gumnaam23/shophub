'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: 'published' | 'draft';
  publishedAt?: string;
}

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPost>({
    _id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: [],
    isFeatured: false,
    status: 'draft',
  });
  const [newTag, setNewTag] = useState('');
  const [categories] = useState([
    'Fashion',
    'Trends',
    'Tips & Guides',
    'News',
    'Reviews',
    'Lifestyle',
  ]);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`);
      const data = await response.json();
      if (data.success) {
        setFormData(data.post);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-gray-600">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center text-gray-600 hover:text-black mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Posts
        </Link>
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-gray-600 mt-2">Update your blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium mb-2">
            Post Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter post title"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        {/* Slug */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium mb-2">
            Slug / URL
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
          />
          <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title</p>
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium mb-2">
            Excerpt *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            placeholder="Brief description of the post..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={12}
            placeholder="Write your post content here..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black font-mono text-sm"
            required
          />
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium mb-2">
            Featured Image URL *
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
            required
          />
          {formData.image && (
            <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
              <Image
                src={formData.image}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="bg-white rounded-xl shadow-md p-6">
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
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium mb-2">
              Featured Post
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Mark as featured post</span>
            </label>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium mb-2">
              Tags
            </label>
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

        {/* Actions */}
        <div className="flex space-x-3">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Link href="/admin/blog">
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}