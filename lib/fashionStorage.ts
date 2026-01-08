import { Outfit, ItemDetail } from "@/types/fashion";

// API 기반 저장/로드 함수들
export async function saveOutfit(outfitData: Omit<Outfit, 'id' | 'isSaved'>): Promise<Outfit> {
  try {
    console.log('saveOutfit: Attempting to save outfit', outfitData);
    
    const response = await fetch('/api/outfits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(outfitData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save outfit');
    }

    const newOutfit = await response.json();
    console.log('saveOutfit: Successfully saved outfit', newOutfit);
    return newOutfit;
  } catch (error: any) {
    console.error('Error saving outfit:', error);
    throw error;
  }
}

export async function loadOutfits(): Promise<Outfit[]> {
  try {
    console.log('loadOutfits: Attempting to load data from API');
    
    const response = await fetch('/api/outfits', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to load outfits');
    }

    const outfits = await response.json();
    console.log('loadOutfits: Successfully loaded outfits', outfits);
    
    // Ensure loaded data conforms to Outfit structure
    return outfits.map((outfit: any) => ({
      ...outfit,
      image: Array.isArray(outfit.image) ? outfit.image : [],
      images: Array.isArray(outfit.images) ? outfit.images : [],
      items: Array.isArray(outfit.items) ? outfit.items.map((item: any) => ({
        ...item,
        price: Number(item.price) || 0,
        style: Array.isArray(item.style) ? item.style : [],
        link: item.link || item.purchaseLink || "",
        description: item.description || "",
        currency: item.currency || "₩",
      })) : [],
      isSaved: outfit.isSaved === true,
    }));
  } catch (error) {
    console.error('Error loading outfits:', error);
    // Return empty array on load error
    return [];
  }
}

export async function deleteOutfit(id: string): Promise<void> {
  try {
    console.log('deleteOutfit: Attempting to delete outfit with id', id);
    
    const response = await fetch(`/api/outfits/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete outfit');
    }

    console.log('deleteOutfit: Successfully deleted outfit');
  } catch (error) {
    console.error('Error deleting outfit:', error);
    throw error;
  }
}

export async function updateOutfit(updatedOutfit: Outfit): Promise<void> {
  try {
    console.log('updateOutfit: Attempting to update outfit', updatedOutfit);
    
    const response = await fetch(`/api/outfits/${updatedOutfit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOutfit),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update outfit');
    }

    console.log('updateOutfit: Successfully updated outfit');
  } catch (error) {
    console.error('Error updating outfit:', error);
    throw error;
  }
}

// localStorage 초기화 함수 (keep for migration purposes)
export function clearOutfits(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("fashionItems");
  } catch (error) {
    console.error('Error clearing outfits:', error);
  }
}

// Alias for loadOutfits to maintain backward compatibility
export const loadFashionItems = loadOutfits;
