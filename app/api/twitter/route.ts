import { TwitterApi } from 'twitter-api-v2';
import { NextResponse } from 'next/server';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export async function GET() {
  try {
    const tweets = await client.v2.search('#enhypenfashion', {
      'media.fields': ['url', 'preview_image_url'],
      'tweet.fields': ['created_at', 'author_id'],
      expansions: ['attachments.media_keys', 'author_id'],
      max_results: 10,
    });

    const mediaTweets = tweets.data.filter(tweet => 
      tweet.attachments?.media_keys && tweet.attachments.media_keys.length > 0
    );

    return NextResponse.json({ tweets: mediaTweets });
  } catch (error) {
    console.error('Twitter API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
} 