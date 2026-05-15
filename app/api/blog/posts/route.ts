import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';



type BlogQuery = {
    status: 'published';
    category?: string;
    $or?: Array<{
        [key: string]: { $regex: string; $options: string };
    }>;
};

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');
        const skip = (page - 1) * limit;

        const query: BlogQuery = { status: 'published' };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        const [posts, total] = await Promise.all([
            BlogPost.find(query)
                .sort({ isFeatured: -1, publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BlogPost.countDocuments(query),
        ]);

        // Get featured post separately
        const featuredPost = await BlogPost.findOne({
            isFeatured: true,
            status: 'published'
        }).lean();

        // Get category counts
        const categoryCounts = await BlogPost.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        const categories = categoryCounts.map(c => ({
            id: c._id,
            name: c._id,
            count: c.count
        }));

        return NextResponse.json({
            success: true,
            posts,
            featuredPost: featuredPost || posts[0] || null,
            categories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Fetch blog posts error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blog posts' },
            { status: 500 }
        );
    }
}