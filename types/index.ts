export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  rating: number;
  reviews: number;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  saleEnds?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface ITestimonial {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  avatar: string;
  date: Date;
}

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  createdAt: Date;
}

export interface HomePageProps {
  featuredProducts: IProduct[];
  newArrivals: IProduct[];
  bestSellers: IProduct[];
  categories: ICategory[];
  testimonials: ITestimonial[];
  blogPosts: IBlogPost[];
}

export interface ICartItem {
  productId: string; // ObjectId → string
  quantity: number;
  addedAt: string; // Date → string (JSON)
}

export interface ICart {
  _id?: string;
  userId: string;
  items: ICartItem[];
  updatedAt: string;
}