"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Outfit } from "@/types/fashion"
import { useEffect, useState } from "react"
import { getFavoriteIds, toggleFavorite } from "@/lib/favorites"
import { loadOutfits } from "@/lib/fashionStorage"
import Image from "next/image"

export default function FavoritesPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [favoriteOutfits, setFavoriteOutfits] = useState<Outfit[]>([])

  useEffect(() => {
    const loaded = loadOutfits().map(outfit => ({
      ...outfit,
      isSaved: getFavoriteIds().includes(outfit.id)
    }));
    setOutfits(loaded);
  }, []);

  // 찜 상태가 변경될 때마다 아이템 목록 업데이트
  useEffect(() => {
    const favoriteIds = getFavoriteIds();
    const favoriteOutfits = outfits.filter(outfit => favoriteIds.includes(outfit.id));
    setFavoriteOutfits(favoriteOutfits);
  }, [outfits]);

  const handleToggleFavorite = (e: React.MouseEvent, outfitId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(outfitId);
    
    // 찜 상태 업데이트
    setOutfits(prevOutfits => 
      prevOutfits.map(outfit => ({
        ...outfit,
        isSaved: outfit.id === outfitId ? !outfit.isSaved : outfit.isSaved
      }))
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                My Favorites
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Check out your saved fashion items.
              </p>
            </div>

            {favoriteOutfits.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                <p className="text-lg text-gray-500">No saved items yet.</p>
                <Button asChild>
                  <Link href="/">Browse Fashion</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteOutfits.map((outfit) => (
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
                            {outfit.items.map((item, index) => (
                              <div key={index} className="mt-2">
                                <p className="mb-1 text-sm">{item.brand}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.style.map((style:any) => (
                                <Badge key={style} variant="secondary" className="rounded-none">
                                  {style}
                                </Badge>
                              ))}
                            </div>
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={(e) => handleToggleFavorite(e, outfit.id)}
                          >
                            <Heart className="size-5" />
                          </Button>
                        </div>
                      </CardFooter>
                      <CardFooter className="p-4 pt-0">
                        {outfit.items.map((item, index) => (
                          <Button key={index} className="mb-2 w-full rounded-none" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                              {item.brand} 구매하기
                          </a>
                        </Button>
                        ))}
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
} 