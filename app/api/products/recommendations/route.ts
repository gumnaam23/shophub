import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import { Types } from 'mongoose';

interface RecommendationBody {
  cartItems: string[];
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '4');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const currentProduct = await Product.findById(productId).lean();
    
    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Find related products by same category
    const relatedProducts = await Product.find({
      _id: { $ne: new Types.ObjectId(productId) },
      category: currentProduct.category,
      stock: { $gt: 0 }
    })
    .sort({ rating: -1 })
    .limit(limit)
    .lean();

    return NextResponse.json({ products: relatedProducts });
    
  } catch (error) {
    console.error('Related products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related products', products: [] },
      { status: 500 }
    );
  }
}



interface RecommendationBody {
  cartItems: string[];
}

interface ProductFilter {
  _id: {
    $nin: Types.ObjectId[];
  };
  stock: {
    $gt: number;
  };
  category?: {
    $in: string[];
  };
  tags?: {
    $in: string[];
  };
}

interface FeaturedFilter {
  _id: {
    $nin: Types.ObjectId[];
  };
  isFeatured: boolean;
  stock: {
    $gt: number;
  };
}

interface BestSellerFilter {
  _id: {
    $nin: Types.ObjectId[];
  };
  rating: {
    $gte: number;
  };
  stock: {
    $gt: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body: RecommendationBody = await req.json();
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Convert string IDs to ObjectIds
    const cartObjectIds: Types.ObjectId[] = cartItems.map(id => new Types.ObjectId(id));

    // Get products from cart to understand user preferences
    const cartProducts = await Product.find({
      _id: { $in: cartObjectIds }
    }).lean();

    if (cartProducts.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Extract categories from cart items
    const categoriesFromCart: string[] = [...new Set(cartProducts.map((p: IProduct) => p.category))];
    
    // Extract tags from cart items
    const tagsFromCart: string[] = [...new Set(cartProducts.flatMap((p: IProduct) => p.tags || []))];

    // Build recommendation query
    const recommendationQuery: ProductFilter = {
      _id: { $nin: cartObjectIds },
      stock: { $gt: 0 }
    };

    // If there are categories, prioritize same category products
    if (categoriesFromCart.length > 0) {
      recommendationQuery.category = { $in: categoriesFromCart };
    }

    // If there are tags, add tag-based recommendation
    if (tagsFromCart.length > 0) {
      recommendationQuery.tags = { $in: tagsFromCart };
    }

    // Get recommended products
    let recommendedProducts = await Product.find(recommendationQuery)
      .sort({ 
        rating: -1,
        reviews: -1,
        createdAt: -1
      })
      .limit(8)
      .lean();

    // Get IDs of already recommended products
    const recommendedIds: Types.ObjectId[] = recommendedProducts.map(p => p._id);

    // If not enough recommendations, add featured products
    if (recommendedProducts.length < 4) {
      const featuredFilter: FeaturedFilter = {
        _id: { $nin: [...cartObjectIds, ...recommendedIds] },
        isFeatured: true,
        stock: { $gt: 0 }
      };
      
      const featuredProducts = await Product.find(featuredFilter)
        .limit(8 - recommendedProducts.length)
        .lean();
      
      recommendedProducts = [...recommendedProducts, ...featuredProducts];
    }

    // Update recommended IDs after adding featured products
    const updatedRecommendedIds: Types.ObjectId[] = recommendedProducts.map(p => p._id);

    // If still not enough, add best sellers
    if (recommendedProducts.length < 4) {
      const bestSellerFilter: BestSellerFilter = {
        _id: { $nin: [...cartObjectIds, ...updatedRecommendedIds] },
        rating: { $gte: 4 },
        stock: { $gt: 0 }
      };
      
      const bestSellers = await Product.find(bestSellerFilter)
        .sort({ rating: -1 })
        .limit(8 - recommendedProducts.length)
        .lean();
      
      recommendedProducts = [...recommendedProducts, ...bestSellers];
    }

    return NextResponse.json({ 
      products: recommendedProducts,
      recommendationCount: recommendedProducts.length
    });
    
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations', products: [] },
      { status: 500 }
    );
  }
}