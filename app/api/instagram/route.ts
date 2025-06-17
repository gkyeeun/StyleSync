import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const response = await axios.get('https://www.instagram.com/enhypenfashion/');
    const $ = cheerio.load(response.data);
    
    const posts = [];
    $('article img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt');
      if (src) {
        posts.push({
          id: i.toString(),
          media_url: src,
          caption: alt || 'ENHYPEN Fashion',
          permalink: 'https://www.instagram.com/enhypenfashion/'
        });
      }
    });

    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error('Instagram Scraping Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
} 