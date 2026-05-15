import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

interface CategoryQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  isActive?: boolean;
}

interface CategoryBody {
  name: string;
  image: string;
  description?: string;
  productCount?: number;
  isActive?: boolean;
  parentCategory?: string | null;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    const query: CategoryQuery = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    const categories = await Category.find(query)
      .limit(limit)
      .sort({ productCount: -1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    console.error('GET Categories Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: CategoryBody = await request.json();

    if (!body.name || !body.image) {
      return NextResponse.json(
        { success: false, error: 'Name and image are required' },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name: body.name,
      image: body.image,
      description: body.description || '',
      productCount: body.productCount || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      parentCategory: body.parentCategory || null,
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('POST Category Error:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? error.message 
      : 'Failed to create category';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}