import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    await connectToDatabase();


    const searchQuery: {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } | { $in: RegExp[] } }>;
      category?: string;
    } = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ];
    }

    if (category) {
      searchQuery.category = category;
    }

    // Execute search
    const results = await Product.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Generate suggestions for misspelled searches
    const suggestions = [];
    if (query && results.length === 0) {
      const allProducts = await Product.find({}).select('name').limit(100);
      const words = query.toLowerCase().split(' ');
      const suggestionsSet = new Set();

      allProducts.forEach(product => {
        const productWords = product.name.toLowerCase().split(' ');
        words.forEach(word => {
          productWords.forEach((pWord: string) => {
            if (pWord.includes(word) && pWord !== word && pWord.length > 3) {
              suggestionsSet.add(pWord);
            }
          });
        });
      });

      suggestions.push(...Array.from(suggestionsSet).slice(0, 5));
    }

    const serializedResults = results.map(product => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
    }));

    return NextResponse.json({
      results: serializedResults,
      suggestions,
      total: serializedResults.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}