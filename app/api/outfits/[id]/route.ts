import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Outfit, ItemDetail } from '@/types/fashion'

// GET: 특정 outfit 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: outfit, error } = await supabase
      .from('outfits')
      .select(`
        *,
        items (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!outfit) {
      return NextResponse.json(
        { error: 'Outfit not found' },
        { status: 404 }
      )
    }

    const formattedOutfit: Outfit = {
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
        name: item.name,
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

    return NextResponse.json(formattedOutfit)
  } catch (error: any) {
    console.error('Error fetching outfit:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch outfit' },
      { status: 500 }
    )
  }
}

// PUT: outfit 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const outfitData: Outfit = body

    // Outfit 업데이트
    const { error: outfitError } = await supabase
      .from('outfits')
      .update({
        member: outfitData.member,
        member_id: outfitData.memberId,
        event: outfitData.event,
        date: outfitData.date,
        images: outfitData.image || outfitData.images || [],
        description: outfitData.description,
        is_saved: outfitData.isSaved || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (outfitError) throw outfitError

    // 기존 items 삭제 후 새로 추가
    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .eq('outfit_id', id)

    if (deleteError) throw deleteError

    // 새 items 추가
    if (outfitData.items && outfitData.items.length > 0) {
      const itemsToInsert = outfitData.items.map((item) => ({
        outfit_id: id,
        name: item.name || '',
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

    // 업데이트된 outfit 반환
    const { data: updatedOutfit, error: fetchError } = await supabase
      .from('outfits')
      .select(`
        *,
        items (*)
      `)
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const formattedOutfit: Outfit = {
      id: updatedOutfit.id,
      member: updatedOutfit.member,
      memberId: updatedOutfit.member_id,
      event: updatedOutfit.event,
      date: updatedOutfit.date,
      image: updatedOutfit.images || [],
      images: updatedOutfit.images || [],
      description: updatedOutfit.description,
      isSaved: updatedOutfit.is_saved || false,
      items: (updatedOutfit.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
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

    return NextResponse.json(formattedOutfit)
  } catch (error: any) {
    console.error('Error updating outfit:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update outfit' },
      { status: 500 }
    )
  }
}

// DELETE: outfit 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // CASCADE로 items도 자동 삭제됨
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting outfit:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete outfit' },
      { status: 500 }
    )
  }
}
