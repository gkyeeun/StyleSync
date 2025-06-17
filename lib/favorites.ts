import { FashionItem } from "@/types/fashion"

const FAVORITES_KEY = "favorites"

export const getFavoriteIds = (): string[] => {
  if (typeof window === "undefined") return []
  const favorites = localStorage.getItem(FAVORITES_KEY)
  return favorites ? JSON.parse(favorites) : []
}

export const toggleFavorite = (itemId: string): void => {
  if (typeof window === "undefined") return
  const favorites = getFavoriteIds()
  const newFavorites = favorites.includes(itemId)
    ? favorites.filter(id => id !== itemId)
    : [...favorites, itemId]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
}

export const isFavorite = (itemId: string): boolean => {
  if (typeof window === "undefined") return false
  const favorites = getFavoriteIds()
  return favorites.includes(itemId)
}

export function getFavoriteItems(items: FashionItem[]): FashionItem[] {
  const favorites = getFavoriteIds()
  return items.filter(item => favorites.includes(item.id))
} 