import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true
    },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true, index: true },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for faster queries
NewsletterSchema.index({ email: 1, isActive: 1 });

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);