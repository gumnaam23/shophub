import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    const post = await BlogPost.findOneAndUpdate(
      { slug },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      likes: post.likes,
    });
  } catch (error) {
    console.error('Like blog post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like post' },
      { status: 500 }
    );
  }
}