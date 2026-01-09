import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Outfit, ItemDetail } from '@/types/fashion'

// GET: 모든 outfits 조회
export async function GET(request: NextRequest) {
  try {
    const { data: outfits, error } = await supabase
      .from('outfits')
      .select(`
        *,
        items (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // 데이터베이스 형식을 Outfit 형식으로 변환
    const formattedOutfits: Outfit[] = outfits.map((outfit: any) => ({
      id: outfit.id,
      member: outfit.member,
      memberId: outfit.member_id,
      event: outfit.event,
      date: outfit.date,
      image: outfit.images || [],
      images: outfit.images || [],
      description: outfit.description,
      isSaved: outfit.is_saved || false,
      items: (outfit.items || []).map((item: any) => ({
        id: item.id,
        name: item.name || '',
        item: item.name || '', // item 필드도 name과 동일하게 설정
        brand: item.brand,
        price: Number(item.price),
        purchaseLink: item.purchase_link || '',
        image: item.image || '',
        purchaseOptions: item.purchase_options || [],
        availability: item.availability,
        lastUpdated: item.last_updated,
        style: item.style || [],
        link: item.link || '',
        description: item.description || '',
        currency: item.currency || '₩',
      } as ItemDetail)),
    }))

    return NextResponse.json(formattedOutfits)
  } catch (error: any) {
    console.error('Error fetching outfits:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch outfits' },
      { status: 500 }
    )
  }
}

// POST: 새 outfit 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const outfitData: Omit<Outfit, 'id' | 'isSaved'> = body

    // Outfit 저장
    const { data: outfit, error: outfitError } = await supabase
      .from('outfits')
      .insert({
        member: outfitData.member,
        member_id: outfitData.memberId,
        event: outfitData.event,
        date: outfitData.date,
        images: outfitData.image || outfitData.images || [],
        description: outfitData.description,
        is_saved: false,
      })
      .select()
      .single()

    if (outfitError) throw outfitError

    // Items 저장
    if (outfitData.items && outfitData.items.length > 0) {
      const itemsToInsert = outfitData.items.map((item) => ({
        outfit_id: outfit.id,
        name: item.name || (item as any).item || '',
        brand: item.brand,
        price: item.price || 0,
        purchase_link: item.purchaseLink || item.link || '',
        image: item.image || '',
        purchase_options: item.purchaseOptions || [],
        availability: item.availability,
        last_updated: item.lastUpdated,
        style: item.style || [],
        link: item.link || '',
        description: item.description || '',
        currency: item.currency || '₩',
      }))

      const { error: itemsError } = await supabase
        .from('items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError
    }

    // 생성된 outfit과 items를 함께 반환
    const { data: createdOutfit, error: fetchError } = await supabase
      .from('outfits')
      .select(`
        *,
        items (*)
      `)
      .eq('id', outfit.id)
      .single()

    if (fetchError) throw fetchError

    // 형식 변환
    const formattedOutfit: Outfit = {
      id: createdOutfit.id,
      member: createdOutfit.member,
      memberId: createdOutfit.member_id,
      event: createdOutfit.event,
      date: createdOutfit.date,
      image: createdOutfit.images || [],
      images: createdOutfit.images || [],
      description: createdOutfit.description,
      isSaved: createdOutfit.is_saved || false,
      items: (createdOutfit.items || []).map((item: any) => ({
        id: item.id,
        name: item.name || '',
        item: item.name || '', // item 필드도 name과 동일하게 설정
        brand: item.brand,
        price: Number(item.price),
        purchaseLink: item.purchase_link || '',
        image: item.image || '',
        purchaseOptions: item.purchase_options || [],
        availability: item.availability,
        lastUpdated: item.last_updated,
        style: item.style || [],
        link: item.link || '',
        description: item.description || '',
        currency: item.currency || '₩',
      } as ItemDetail)),
    }

    return NextResponse.json(formattedOutfit, { status: 201 })
  } catch (error: any) {
    console.error('Error creating outfit:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create outfit' },
      { status: 500 }
    )
  }
}
