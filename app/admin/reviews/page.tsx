'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    StarIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon,
    MagnifyingGlassIcon,
    UserIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Button from '@/app/components/ui/Button';

interface Review {
    _id: string;
    productId: string;
    productName: string;
    productImage: string;
    productSlug: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
    verified: boolean;
    helpful: number;
    status: 'pending' | 'approved' | 'rejected';
    reported: boolean;
    reportReason?: string;
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/reviews');
            const data = await response.json();
            setReviews(data.reviews);
            setFilteredReviews(data.reviews);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = reviews;

        if (searchQuery) {
            filtered = filtered.filter(r =>
                r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.comment.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(r => r.status === statusFilter);
        }

        if (ratingFilter !== 'all') {
            filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
        }

        setFilteredReviews(filtered);
    }, [searchQuery, statusFilter, ratingFilter, reviews]);

    const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                await fetchReviews();
            }
        } catch (error) {
            console.error('Failed to update review status:', error);
        }
    };

    const deleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchReviews();
                if (selectedReview?._id === reviewId) {
                    setShowDetailsModal(false);
                    setSelectedReview(null);
                }
            }
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return { label: 'Approved', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircleIcon };
            case 'rejected':
                return { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-100', icon: XCircleIcon };
            default:
                return { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: FlagIcon };
        }
    };

    const stats = {
        total: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
        reported: reviews.filter(r => r.reported).length,
        averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0,
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Reviews Management</h1>
                <p className="text-gray-600">
                    Manage customer reviews and ratings ({stats.total} total reviews)
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <p className="text-sm text-gray-500">Total Reviews</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl shadow-md p-4">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-green-50 rounded-xl shadow-md p-4">
                    <p className="text-sm text-green-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="bg-red-50 rounded-xl shadow-md p-4">
                    <p className="text-sm text-red-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="bg-orange-50 rounded-xl shadow-md p-4">
                    <p className="text-sm text-orange-600">Reported</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.reported}</p>
                </div>
            </div>

            {/* Average Rating Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-md p-6 mb-8 text-gray-600">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90">Average Rating</p>
                        <p className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</p>
                        <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                                i < Math.floor(stats.averageRating) ? (
                                    <StarSolid key={i} className="w-5 h-5 text-white" />
                                ) : (
                                    <StarIcon key={i} className="w-5 h-5 text-white opacity-50" />
                                )
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-90">Based on {stats.total} reviews</p>
                    </div>
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
                            placeholder="Search by product, customer, or comment..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.map((review) => {
                    const statusConfig = getStatusConfig(review.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Product Info */}
                                <Link href={`/admin/products/${review.productId}`} className="md:w-48 flex-shrink-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={review.productImage}
                                                alt={review.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold hover:text-gray-600 line-clamp-2">
                                                {review.productName}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        i < review.rating ? (
                                                            <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                                                        ) : (
                                                            <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                                                        )
                                                    ))}
                                                </div>
                                                <span className="text-sm font-semibold">{review.title}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <UserIcon className="w-4 h-4" />
                                                    <span>{review.userName}</span>
                                                    {review.verified && (
                                                        <span className="text-green-600 text-xs ml-1">(Verified)</span>
                                                    )}
                                                </div>
                                                <span>•</span>
                                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                {review.helpful > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{review.helpful} found helpful</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                <span>{statusConfig.label}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedReview(review);
                                            setShowDetailsModal(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <EyeIcon className="w-5 h-5 text-gray-600" />
                                    </button>
                                    {review.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateReviewStatus(review._id, 'approved')}
                                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                            >
                                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                            </button>
                                            <button
                                                onClick={() => updateReviewStatus(review._id, 'rejected')}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <XCircleIcon className="w-5 h-5 text-red-600" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => deleteReview(review._id)}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <TrashIcon className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredReviews.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <p className="text-gray-500">No reviews found</p>
                </div>
            )}

            {/* Review Details Modal - Fixed Scroll */}
            <AnimatePresence>
                {showDetailsModal && selectedReview && (
                    <div className="fixed inset-0 z-[9999]">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setShowDetailsModal(false)}
                        />

                        {/* Modal Container - flex column to separate header/body/footer */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[90%] max-w-2xl max-h-[90vh] flex flex-col">
                            {/* Fixed Header */}
                            <div className="flex justify-between items-center p-6 pb-4 border-b">
                                <h2 className="text-2xl font-bold">Review Details</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Product Info */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3">Product Information</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                            {selectedReview.productImage ? (
                                                <Image
                                                    src={selectedReview.productImage}
                                                    alt={selectedReview.productName || 'Product'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Link
                                                href={`/products/${selectedReview.productSlug || selectedReview.productId}`}
                                                className="font-semibold hover:text-gray-600"
                                            >
                                                {selectedReview.productName || 'Product Name'}
                                            </Link>
                                            <p className="text-sm text-gray-500">ID: {selectedReview.productId}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3">Customer Information</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                            {selectedReview.userAvatar ? (
                                                <Image
                                                    src={selectedReview.userAvatar}
                                                    alt={selectedReview.userName || 'User'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <UserIcon className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{selectedReview.userName || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-500">User ID: {selectedReview.userId}</p>
                                            {selectedReview.verified && (
                                                <span className="text-xs text-green-600">✓ Verified Purchase</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3">Review</h3>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                i <= selectedReview.rating ? (
                                                    <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
                                                ) : (
                                                    <StarIcon key={i} className="w-5 h-5 text-gray-300" />
                                                )
                                            ))}
                                        </div>
                                        <span className="font-semibold">{selectedReview.title || 'No title'}</span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{selectedReview.comment || 'No comment'}</p>

                                    {selectedReview.images && selectedReview.images.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-500 mb-2">Attached Images:</p>
                                            <div className="flex space-x-2">
                                                {selectedReview.images.map((img, idx) => (
                                                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border">
                                                        <Image src={img} alt={`Review ${idx + 1}`} fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-3 border-t text-sm text-gray-500">
                                        <p>✓ Helpful: {selectedReview.helpful ?? 0} people found this helpful</p>
                                        <p>📅 Submitted: {new Date(selectedReview.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Report Info */}
                                {selectedReview.reported && (
                                    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                                            <FlagIcon className="w-4 h-4" />
                                            Report Information
                                        </h3>
                                        <p className="text-sm text-red-600">
                                            Reason: {selectedReview.reportReason || 'User reported this review as inappropriate'}
                                        </p>
                                    </div>
                                )}

                                {/* Current Status */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">Current Status</h3>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${selectedReview.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            selectedReview.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {selectedReview.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </div>
                            </div>

                            {/* Fixed Footer with Buttons */}
                            <div className="flex space-x-3 p-6 pt-4 border-t">
                                {selectedReview.status === 'pending' && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                updateReviewStatus(selectedReview._id, 'approved');
                                                setShowDetailsModal(false);
                                            }}
                                            variant="primary"
                                            size="md"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                                            Approve Review
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                updateReviewStatus(selectedReview._id, 'rejected');
                                                setShowDetailsModal(false);
                                            }}
                                            variant="outline"
                                            size="md"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                        >
                                            <XCircleIcon className="w-4 h-4 mr-2" />
                                            Reject Review
                                        </Button>
                                    </>
                                )}
                                <Button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this review?')) {
                                            deleteReview(selectedReview._id);
                                            setShowDetailsModal(false);
                                        }
                                    }}
                                    variant="outline"
                                    size="md"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete Review
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}