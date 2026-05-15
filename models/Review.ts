import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  helpfulUsers: string[];
  reported: boolean;
  reportReason?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}


const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    images: [{ type: String }],
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    helpfulUsers: [{ type: String }],
    reported: { type: Boolean, default: false },
    reportReason: { type: String },
    isApproved: { type: Boolean, default: null },
  },
  { timestamps: true }
);

// Index for faster queries
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);