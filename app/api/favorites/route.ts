import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: 모든 favorite IDs 조회
export async function GET(request: NextRequest) {
  try {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('outfit_id')

    if (error) throw error

    const favoriteIds = favorites.map((f: any) => f.outfit_id)
    return NextResponse.json(favoriteIds)
  } catch (error: any) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST: favorite 추가/제거 (toggle)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { outfitId, userId } = body

    if (!outfitId) {
      return NextResponse.json(
        { error: 'outfitId is required' },
        { status: 400 }
      )
    }

    // 기존 favorite 확인
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('outfit_id', outfitId)
      .eq('user_id', userId || null)
      .single()

    if (existing) {
      // 이미 있으면 삭제 (toggle off)
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id)

      if (deleteError) throw deleteError
      return NextResponse.json({ favorited: false })
    } else {
      // 없으면 추가 (toggle on)
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          outfit_id: outfitId,
          user_id: userId || null,
        })

      if (insertError) throw insertError
      return NextResponse.json({ favorited: true })
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to toggle favorite' },
      { status: 500 }
    )
  }
}
