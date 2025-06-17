export type Style = string;

// Represents a single item within an outfit
export interface ItemDetail {
  brand: string;
  item: string;
  price: number;
  style: Style[];
  link: string; // Link for this specific item
  description?: string; // Description for this specific item (optional)
  currency: string; // Currency symbol (₩ or $)
}

// Represents a complete outfit/look associated with a photo
export interface Outfit {
  id: string;
  member: string;
  event: string;
  date: string;
  image: string[]; // One or more images for the outfit
  description?: string; // Overall description for the outfit (optional)
  items: ItemDetail[]; // Array of items included in this outfit
  isSaved?: boolean; // Saved status for the entire outfit
}

export interface Member {
  id: string;
  name: string;
  image: string;
  description: string;
}

// Keeping the existing Outfit and Event interfaces for now, though they might be refactored later
// based on how they are actually used or intended to be used.
// For the purpose of this change, we are focusing on replacing the current FashionItem usage
// with the new Outfit and ItemDetail structure for the main item data.

// export interface Outfit { // This seems to be a duplicate/different structure, will keep for now
//   id: string;
//   memberId: string;
//   event: string;
//   date: string;
//   image: string;
//   description: string;
//   purchaseOptions: PurchaseOption[];
// }

export interface PurchaseOption { // This seems related to the other Outfit type
  id: string;
  name: string;
  price: number;
  link: string;
}


export interface Event { // This seems related to the other Outfit type
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  outfits: Outfit[];
} 