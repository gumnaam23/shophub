import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  readTime: number;
  likes: number;
  comments: number;
  isFeatured: boolean;
  views: number;
  status: 'draft' | 'published' | 'archived';  // ✅ Add status
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, default: '/images/default-avatar.jpg' },
      bio: { type: String, default: '' },
    },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    readTime: { type: Number, default: 5 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }, // ✅ Add status field
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Generate slug from title before saving
BlogPostSchema.pre('save', function() {
  if (this.isModified('title') && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

// Indexes for faster queries
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ category: 1, publishedAt: -1 });
BlogPostSchema.index({ isFeatured: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ status: 1 }); // ✅ Add index for status
BlogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);