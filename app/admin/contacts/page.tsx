'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUturnLeftIcon as ReplyIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  repliedAt?: string;
  repliedBy?: string;
  replyMessage?: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, [currentPage, statusFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/contacts?page=${currentPage}&limit=${messagesPerPage}&status=${statusFilter}`);
      const data = await response.json();
      setMessages(data.messages);
      setFilteredMessages(data.messages);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = messages;

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
    
    // Mark as read if pending
    if (message.status === 'pending') {
      try {
        await fetch(`/api/admin/contacts/${message._id}`, {
          method: 'GET',
        });
        // Update local status
        setMessages(prev =>
          prev.map(m =>
            m._id === message._id ? { ...m, status: 'read' } : m
          )
        );
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) return;

    setReplying(true);
    try {
      const response = await fetch(`/api/admin/contacts/${selectedMessage._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyMessage }),
      });

      if (response.ok) {
        // Update local status
        setMessages(prev =>
          prev.map(m =>
            m._id === selectedMessage._id
              ? { ...m, status: 'replied', replyMessage }
              : m
          )
        );
        setShowReplyModal(false);
        setReplyMessage('');
        setShowDetailsModal(false);
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/admin/contacts/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMessages();
        if (selectedMessage?._id === messageId) {
          setShowDetailsModal(false);
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', icon: ClockIcon, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'read':
        return { label: 'Read', icon: EyeIcon, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'replied':
        return { label: 'Replied', icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100' };
      default:
        return { label: status, icon: ClockIcon, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
        <p className="text-gray-600">
          Manage customer inquiries and support requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <EnvelopeIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Read</p>
              <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Replied</p>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
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
              placeholder="Search by name, email, subject..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredMessages.map((message) => {
                const statusConfig = getStatusConfig(message.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.tr
                    key={message._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{message.name}</p>
                        <p className="text-sm text-gray-500">{message.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-1">{message.subject}</p>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {message.message.substring(0, 60)}...
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <TrashIcon className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Message Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowDetailsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Message Details</h2>
                <button onClick={() => setShowDetailsModal(false)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedMessage.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedMessage.email}</p>
                    <p><span className="font-medium">Received:</span> {formatDate(selectedMessage.createdAt)}</p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Message</h3>
                  <p className="font-medium mb-1">Subject: {selectedMessage.subject}</p>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Reply Information */}
                {selectedMessage.status === 'replied' && selectedMessage.replyMessage && (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Reply Sent</h3>
                    <p className="text-green-700 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                    <p className="text-sm text-green-600 mt-2">
                      Replied by {selectedMessage.repliedBy} on {selectedMessage.repliedAt && formatDate(selectedMessage.repliedAt)}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  {selectedMessage.status !== 'replied' && (
                    <Button
                      onClick={() => {
                        setShowReplyModal(true);
                      }}
                      variant="primary"
                      size="md"
                    >
                      <ReplyIcon className="w-5 h-5 mr-2" />
                      Reply to Customer
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(selectedMessage._id)}
                    variant="outline"
                    size="md"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowReplyModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Reply to {selectedMessage.name}</h2>
                <button onClick={() => setShowReplyModal(false)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Reply *
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={6}
                    placeholder="Write your response here..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleReply}
                    variant="primary"
                    size="md"
                    fullWidth
                    disabled={replying || !replyMessage.trim()}
                  >
                    {replying ? 'Sending...' : 'Send Reply'}
                  </Button>
                  <Button
                    onClick={() => setShowReplyModal(false)}
                    variant="outline"
                    size="md"
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}