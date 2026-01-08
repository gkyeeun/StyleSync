// app/search/SearchClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Outfit } from "@/types/fashion";
import { loadOutfits } from "@/lib/fashionStorage";
import { getFavoriteIds, toggleFavorite } from "@/lib/favorites";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

const handleToggleFavorite = (e: React.MouseEvent, outfitId: string) => {
  e.preventDefault();
  e.stopPropagation();
  toggleFavorite(outfitId);
};

const FashionCard = ({ outfit }: { outfit: Outfit }) => (
  <Link
    href={`/look/${encodeURIComponent(outfit.member)}/${outfit.date}/${encodeURIComponent(outfit.event)}`}
    key={outfit.id}
  >
    <Card className="overflow-hidden rounded-none transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          <Image
            src={Array.isArray(outfit.image) ? outfit.image[0] : outfit.image[0]}
            alt={`${outfit.member}의 ${outfit.event} 패션`}
            className="size-full object-cover"
            width={300}
            height={400}
          />
        </div>
      </CardContent>

      <CardFooter className="p-4">
        <div className="flex w-full items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{outfit.event}</h3>
            <p className="text-sm text-muted-foreground">{outfit.date}</p>

            <div className="flex flex-wrap gap-2">
              {outfit.items.map((itemDetail) =>
                itemDetail.style.map((style: any) => (
                  <Badge key={style} variant="secondary" className="rounded-none">
                    {style}
                  </Badge>
                ))
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={outfit.isSaved ? "text-red-500" : ""}
            onClick={(e) => handleToggleFavorite(e, outfit.id)}
          >
            <Heart className="size-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  </Link>
);

export default function SearchClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allOutfits = loadOutfits();

    const outfitsWithImages = allOutfits.filter(
      (outfit) =>
        Array.isArray(outfit.image) &&
        outfit.image.length > 0 &&
        outfit.image.some((img) => typeof img === "string" && img.trim() !== "")
    );

    const outfitsWithSavedStatus = outfitsWithImages.map((outfit) => ({
      ...outfit,
      isSaved: getFavoriteIds().includes(outfit.id),
    }));

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = outfitsWithSavedStatus.filter(
        (outfit) =>
          outfit.member.toLowerCase().includes(lowerCaseQuery) ||
          outfit.event.toLowerCase().includes(lowerCaseQuery) ||
          outfit.items.some(
            (itemDetail) =>
              itemDetail.brand.toLowerCase().includes(lowerCaseQuery) ||
              itemDetail.item.toLowerCase().includes(lowerCaseQuery) ||
              itemDetail.style.some((style: any) => style.toLowerCase().includes(lowerCaseQuery)) ||
              (itemDetail.description && itemDetail.description.toLowerCase().includes(lowerCaseQuery))
          )
      );
      setOutfits(filtered);
    } else {
      setOutfits([]);
    }

    setLoading(false);
  }, [searchQuery]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">'{searchQuery || ""}' 검색 결과</h1>

      {outfits.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {outfits.map((outfit) => (
            <FashionCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          '{searchQuery || ""}' 에 대한 검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}