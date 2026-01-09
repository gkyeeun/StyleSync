import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // outfits 테이블에서 고유한 event 목록 가져오기
    const { data, error } = await supabase
      .from('outfits')
      .select('event')
      .order('event', { ascending: true });

    if (error) throw error;

    // 고유한 event 목록 추출
    const uniqueEvents = Array.from(new Set(data.map(item => item.event).filter(Boolean)));

    // 기본 event 목록
    const defaultEvents = ['공항', '방송', '행사', '화보', '위버스 셀카', '콘서트', '기타'];

    // 기본 event와 데이터베이스에서 가져온 event를 합치고 중복 제거
    const allEvents = Array.from(new Set([...defaultEvents, ...uniqueEvents]));

    return NextResponse.json({ events: allEvents });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
