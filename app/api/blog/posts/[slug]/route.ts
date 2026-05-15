import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    const post = await BlogPost.findOne({ slug, publishedAt: { $lte: new Date() } }).lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    // Get related posts (same category)
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      category: post.category,
      publishedAt: { $lte: new Date() },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json({
      success: true,
      post,
      relatedPosts,
    });
  } catch (error) {
    console.error('Fetch blog post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}