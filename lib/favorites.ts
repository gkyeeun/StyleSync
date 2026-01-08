import { FashionItem } from "@/types/fashion"

// API 기반 favorites 함수들
export async function getFavoriteIds(): Promise<string[]> {
  try {
    const response = await fetch('/api/favorites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch favorites');
    }

    const favoriteIds = await response.json();
    return favoriteIds || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export async function toggleFavorite(itemId: string): Promise<void> {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ outfitId: itemId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle favorite');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

export async function isFavorite(itemId: string): Promise<boolean> {
  try {
    const favoriteIds = await getFavoriteIds();
    return favoriteIds.includes(itemId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

export async function getFavoriteItems(items: FashionItem[]): Promise<FashionItem[]> {
  try {
    const favorites = await getFavoriteIds();
    return items.filter(item => favorites.includes(item.id));
  } catch (error) {
    console.error('Error getting favorite items:', error);
    return [];
  }
}

// 동기 버전 (fallback for backward compatibility)
// 이 함수들은 localStorage를 사용하지만, 점진적으로 제거할 수 있습니다
export const getFavoriteIdsSync = (): string[] => {
  if (typeof window === "undefined") return []
  const favorites = localStorage.getItem("favorites")
  return favorites ? JSON.parse(favorites) : []
}

export const toggleFavoriteSync = (itemId: string): void => {
  if (typeof window === "undefined") return
  const favorites = getFavoriteIdsSync()
  const newFavorites = favorites.includes(itemId)
    ? favorites.filter(id => id !== itemId)
    : [...favorites, itemId]
  localStorage.setItem("favorites", JSON.stringify(newFavorites))
}

export const isFavoriteSync = (itemId: string): boolean => {
  if (typeof window === "undefined") return false
  const favorites = getFavoriteIdsSync()
  return favorites.includes(itemId)
}
