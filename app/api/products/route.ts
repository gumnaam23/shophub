import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

interface ProductQuery {
  category?: string;
  isFeatured?: boolean;
  isNewProduct?: boolean;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  $text?: {
    $search: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const isFeatured = searchParams.get('isFeatured');
    const isNew = searchParams.get('isNew');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || '-createdAt';

    const query: ProductQuery = {};

    if (category) query.category = category;
    if (isFeatured === 'true') query.isFeatured = true;
    if (isNew === 'true') query.isNewProduct = true;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET Products Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

interface ProductBody {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  comparePrice?: number;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  saleEnds?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: ProductBody = await request.json();

    const requiredFields: (keyof ProductBody)[] = ['name', 'description', 'price', 'images', 'category', 'stock'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('POST Product Error:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Product with this name already exists' },
        { status: 400 }
      );
    }

    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? error.message 
      : 'Failed to create product';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}