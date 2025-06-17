import { Outfit, ItemDetail } from "@/types/fashion";

export interface FashionItem {
  id: string;
  member: string;
  event: string;
  date: string;
  image: string[];
  brand: string;
  item: string;
  price: number;
  style: string[];
  link: string;
  description?: string;
}

const STORAGE_KEY = "fashionItems";
const MAX_ITEMS = 100; // 최대 저장 가능한 아이템 수

// 고유 ID 생성 함수
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// localStorage 용량 관리
function manageStorage(outfits: Outfit[]): Outfit[] {
  if (outfits.length > MAX_ITEMS) {
    // 가장 오래된 아이템부터 제거 (가장 앞에 있는 것이 최신이므로)
    const managed = outfits.slice(0, MAX_ITEMS);
    console.log('manageStorage: Reducing outfits to MAX_ITEMS', managed.length);
    return managed;
  }
  console.log('manageStorage: Outfits count within limit', outfits.length);
  return outfits;
}

export function saveOutfit(outfitData: Omit<Outfit, 'id' | 'isSaved'>): Outfit {
  try {
    console.log('saveOutfit: Attempting to save outfit', outfitData);
    const outfits = loadOutfits();
    const newOutfit: Outfit = {
      ...outfitData,
      id: generateUniqueId(),
      // Ensure image is always an array of strings
      image: Array.isArray(outfitData.image)
        ? outfitData.image.filter(img => typeof img === 'string')
        : [outfitData.image as any as string].filter(img => typeof img === 'string'), // Handle single string case
      // Ensure items is always an array of ItemDetail and handle price/style type conversion
      items: Array.isArray(outfitData.items) ? outfitData.items.map(item => ({
          ...item,
          price: Number(item.price) || 0, // Ensure price is number
          style: Array.isArray(item.style) ? item.style : [item.style as any as string] // Ensure style is array
        })) : [],
      isSaved: false // Default to not saved when created
    };
    
    outfits.unshift(newOutfit);
    const managedOutfits = manageStorage(outfits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(managedOutfits));
    return newOutfit;
  } catch (error) {
    console.error('Error saving outfit:', error);
    // 에러 발생 시 빈 배열로 초기화 또는 기존 데이터 유지 선택 가능
    // 여기서는 에러 발생 시 데이터를 저장하지 않고 기존 데이터 유지
    // localStorage.setItem(STORAGE_KEY, JSON.stringify([])); // 데이터를 날리는 대신
    throw error; // 에러를 던져서 호출한 곳에서 처리하도록 함
  }
}

export function loadOutfits(): Outfit[] {
  if (typeof window === "undefined") {
    console.log('loadOutfits: window is undefined, returning empty array');
    return [];
  }
  try {
    console.log('loadOutfits: Attempting to load data from localStorage');
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log('loadOutfits: No data found in localStorage, returning empty array');
      return [];
    }
    
    const outfits = JSON.parse(data);
    // Ensure loaded data conforms to Outfit structure
    console.log('loadOutfits: Successfully parsed data', outfits);
    return outfits.map((outfit: any) => ({
      ...outfit,
      image: Array.isArray(outfit.image) ? outfit.image : [], // Ensure image is array
      items: Array.isArray(outfit.items) ? outfit.items.map((item: any) => ({
      ...item,
          price: Number(item.price) || 0, // Ensure price is number
          style: Array.isArray(item.style) ? item.style : [], // Ensure style is array
          link: item.link || "", // Ensure link exists
          description: item.description || "" // Ensure description exists
        })) : [], // Ensure items is array of ItemDetail
      isSaved: outfit.isSaved === true // Ensure isSaved is boolean
    }));
  } catch (error) {
    console.error('Error loading outfits:', error);
    // Return empty array on load error
    return [];
  }
}

export function deleteOutfit(id: string): void {
  try {
    console.log('deleteOutfit: Attempting to delete outfit with id', id);
    const outfits = loadOutfits();
    console.log('deleteOutfit: Outfits before deletion', outfits);
    const updatedOutfits = outfits.filter(outfit => outfit.id !== id);
    console.log('deleteOutfit: Outfits after deletion', updatedOutfits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOutfits));
    console.log('deleteOutfit: Updated outfits saved to localStorage');
  } catch (error) {
    console.error('Error deleting outfit:', error);
  }
}

export function updateOutfit(updatedOutfit: Outfit): void {
  try {
    console.log('updateOutfit: Attempting to update outfit', updatedOutfit);
    const outfits = loadOutfits();
    console.log('updateOutfit: Outfits before update', outfits);
    const index = outfits.findIndex(outfit => outfit.id === updatedOutfit.id);
    console.log('updateOutfit: Found outfit index', index);
    if (index !== -1) {
      // Ensure updated outfit conforms to structure before saving
      outfits[index] = {
         ...updatedOutfit,
         // Removed price as it's not on Outfit type
         image: Array.isArray(updatedOutfit.image)
          ? updatedOutfit.image.filter(img => typeof img === 'string')
          : [updatedOutfit.image as any as string].filter(img => typeof img === 'string'),
         items: Array.isArray(updatedOutfit.items) ? updatedOutfit.items.map(item => ({
            ...item,
            price: Number(item.price) || 0,
            style: Array.isArray(item.style) ? item.style : [item.style as any as string]
          })) : [],
         isSaved: updatedOutfit.isSaved === true
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
    }
  } catch (error) {
    console.error('Error updating outfit:', error);
  }
}

// localStorage 초기화 함수 (keep if needed)
export function clearOutfits(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing outfits:', error);
  }
} 