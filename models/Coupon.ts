import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true, 
      trim: true 
    },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['percentage', 'fixed'], 
      required: true 
    },
    value: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    minPurchase: { 
      type: Number, 
      min: 0,
      default: 0 
    },
    maxDiscount: { 
      type: Number, 
      min: 0 
    },
    usageLimit: { 
      type: Number, 
      min: 1,
      default: null 
    },
    usedCount: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    validFrom: { 
      type: Date, 
      required: true,
      default: Date.now 
    },
    validTo: { 
      type: Date, 
      required: true 
    },
  },
  { timestamps: true }
);

// Index for faster lookups
CouponSchema.index({ code: 1, isActive: 1, validFrom: 1, validTo: 1 });

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);