import mongoose, { Schema, Document } from 'mongoose';

export interface ICookiePreference extends Document {
  userId?: string;
  sessionId: string;
  preferences: {
    essential: boolean;
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
  };
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CookiePreferenceSchema = new Schema<ICookiePreference>(
  {
    userId: { type: String, index: true },
    sessionId: { type: String, required: true, index: true },
    preferences: {
      essential: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      functional: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Index for faster queries
CookiePreferenceSchema.index({ sessionId: 1, createdAt: -1 });
CookiePreferenceSchema.index({ userId: 1 });

export default mongoose.models.CookiePreference || 
  mongoose.model<ICookiePreference>('CookiePreference', CookiePreferenceSchema);