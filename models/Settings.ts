import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  general: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    timezone: string;
    currency: string;
    language: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    logo?: string;
    favicon?: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    fromName: string;
  };
  payment: {
    stripeKey: string;
    stripeSecret: string;
    paypalClientId: string;
    paypalSecret: string;
    currency: string;
  };
  shipping: {
    freeShippingThreshold: number;
    domesticRate: number;
    internationalRate: number;
    estimatedDays: number;
  };
  notifications: {
    orderConfirmation: boolean;
    paymentReceived: boolean;
    orderShipped: boolean;
    lowStockAlert: boolean;
    customerReview: boolean;
  };
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    general: {
      storeName: { type: String, default: 'My Store' },
      storeEmail: { type: String, default: '' },
      storePhone: { type: String, default: '' },
      storeAddress: { type: String, default: '' },
      timezone: { type: String, default: 'UTC-5' },
      currency: { type: String, default: 'USD' },
      language: { type: String, default: 'en' },
    },
    appearance: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      primaryColor: { type: String, default: '#000000' },
      logo: { type: String, default: '' },
      favicon: { type: String, default: '' },
    },
    email: {
      smtpHost: { type: String, default: '' },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: '' },
      smtpPass: { type: String, default: '' },
      fromEmail: { type: String, default: '' },
      fromName: { type: String, default: '' },
    },
    payment: {
      stripeKey: { type: String, default: '' },
      stripeSecret: { type: String, default: '' },
      paypalClientId: { type: String, default: '' },
      paypalSecret: { type: String, default: '' },
      currency: { type: String, default: 'USD' },
    },
    shipping: {
      freeShippingThreshold: { type: Number, default: 50 },
      domesticRate: { type: Number, default: 5.99 },
      internationalRate: { type: Number, default: 15.99 },
      estimatedDays: { type: Number, default: 7 },
    },
    notifications: {
      orderConfirmation: { type: Boolean, default: true },
      paymentReceived: { type: Boolean, default: true },
      orderShipped: { type: Boolean, default: true },
      lowStockAlert: { type: Boolean, default: true },
      customerReview: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);