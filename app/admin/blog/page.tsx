'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Button from '@/app/components/ui/Button';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  readTime: number;
  likes: number;
  comments: number;
  views: number;
  isFeatured: boolean;
  publishedAt: string;
  status: 'published' | 'draft';
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blog/posts');
      const data = await response.json();
      setPosts(data.posts);
      setFilteredPosts(data.posts);
      
      // Extract unique categories
     const uniqueCategories = [...new Set(data.posts.map((p: BlogPost) => p.category))] as string[];
setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, statusFilter, categoryFilter, posts]);

  const handleDelete = async () => {
    if (!deletingPost) return;

    try {
      const response = await fetch(`/api/admin/blog/posts/${deletingPost._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPosts();
        setShowDeleteModal(false);
        setDeletingPost(null);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedPosts.length} posts?`)) return;

    try {
      await Promise.all(
        selectedPosts.map(id =>
          fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' })
        )
      );
      await fetchPosts();
      setSelectedPosts([]);
    } catch (error) {
      console.error('Failed to bulk delete:', error);
    }
  };

  const toggleFeatured = async (postId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}/featured`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(p => p._id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    <div className="max-w-7xl mx-auto text-gray-600">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
          <p className="text-gray-600">
            Manage your blog content ({filteredPosts.length} posts)
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="primary" size="md">
            <PlusIcon className="w-5 h-5 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Total Posts</p>
          <p className="text-2xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-md p-4">
          <p className="text-sm text-green-600">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {posts.filter(p => p.status === 'published').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-md p-4">
          <p className="text-sm text-yellow-600">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">
            {posts.filter(p => p.status === 'draft').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-md p-4">
          <p className="text-sm text-purple-600">Total Views</p>
          <p className="text-2xl font-bold text-purple-600">
            {posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-md p-4">
          <p className="text-sm text-orange-600">Featured</p>
          <p className="text-2xl font-bold text-orange-600">
            {posts.filter(p => p.isFeatured).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {selectedPosts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected ({selectedPosts.length})
            </button>
          )}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onChange={toggleAllSelection}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <motion.tr
                  key={post._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => togglePostSelection(post._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1">{post.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <span className="capitalize">{post.category}</span>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="w-4 h-4 text-gray-400" />
                        <span>{post.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HeartIcon className="w-4 h-4 text-gray-400" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                   </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(post._id, post.isFeatured)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      {post.isFeatured ? (
                        <StarSolidIcon className="w-5 h-5" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>
                   </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 'published' ? (
                        <CheckCircleIcon className="w-3 h-3" />
                      ) : (
                        <XCircleIcon className="w-3 h-3" />
                      )}
                      <span className="capitalize">{post.status}</span>
                    </span>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/blog/${post._id}`}>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <PencilIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </Link>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <EyeIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setDeletingPost(post);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                   </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
             {` Are you sure you want to delete "${deletingPost.title}"? This action cannot be undone.`}
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleDelete} variant="primary" size="md">
                Delete
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingPost(null);
                }}
                variant="outline"
                size="md"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}