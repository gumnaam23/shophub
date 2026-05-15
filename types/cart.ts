import { Types } from 'mongoose';

export interface CartItemType {
  productId: Types.ObjectId | string;
  quantity: number;
  addedAt?: Date;
}

export interface CartType {
  userId: string;
  items: CartItemType[];
  updatedAt?: Date;
}

// For frontend use
export interface CartItemFrontend {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: number;
  isOnSale?: boolean;
  comparePrice?: number;
}


export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
    stock: number;
    isOnSale?: boolean;
    comparePrice?: number;
}