import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  // Existing fields
  email: string;
  name: string;
  password?: string;
  role: 'user' | 'admin';
  image?: string;
  emailVerified?: Date;
  isActive: boolean;
  
  // New settings fields
  phone?: string;
  bio?: string;
  newsletter: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  twoFactorAuth: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // Existing fields
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    image: { type: String },
    emailVerified: { type: Date },
    isActive: { type: Boolean, default: true },
    
    // New settings fields
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    newsletter: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    twoFactorAuth: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);