"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Outfit } from "@/types/fashion";
import { loadOutfits, deleteOutfit } from "@/lib/fashionStorage";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

export default function LookDetail() {
  const params = useParams();
  const router = useRouter();
  const { member, date, event } = params as { member: string; date: string; event: string };
  const decodedMember = decodeURIComponent(member);
  const decodedEvent = decodeURIComponent(event);
  const [outfit, setOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    const allOutfits = loadOutfits();
    // 해당 착장(멤버+날짜+카테고리)에 속한 아웃핏 찾기
    const found = allOutfits.find(
      (outfit) =>
        outfit.member === decodedMember &&
        outfit.date === date &&
        outfit.event === decodedEvent
    );
    setOutfit(found || null);
  }, [member, date, event]);

  const handleDelete = () => {
    if (outfit && window.confirm('이 룩을 삭제하시겠습니까?')) {
      deleteOutfit(outfit.id);
      router.push('/');
    }
  };

  // 브랜드별 공식몰/대표몰 검색 URL 패턴
  const brandSearchUrls: Record<string, (item: string) => string> = {
    AMIRI: (item) => `https://www.amiri.com/en-us/search?q=${encodeURIComponent(item)}`,
    LANVIN: (item) => `https://www.lanvin.com/en/search/?q=${encodeURIComponent(item)}`,
    ZARA: (item) => `https://www.zara.com/kr/ko/search?searchTerm=${encodeURIComponent(item)}`,
    MUSINSA: (item) => `https://search.musinsa.com/search/musinsa/goods?q=${encodeURIComponent(item)}`,
    '29CM': (item) => `https://search.29cm.co.kr/search?keyword=${encodeURIComponent(item)}`,
    // 필요시 추가 브랜드
  };

  function getPurchaseLink(brand: string, item: string) {
    const upperBrand = brand.trim().toUpperCase();
    if (brandSearchUrls[upperBrand]) {
      return brandSearchUrls[upperBrand](item);
    }
    // fallback: 구글 검색
    return `https://www.google.com/search?q=${encodeURIComponent(brand + ' ' + item)}`;
  }

  if (!outfit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">No items found for this look.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-[#09090b]">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gray-200">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Look
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {outfit.image.map((img, index) => (
              <div key={index} className="relative aspect-[3/4] w-full">
                <img
                  src={img}
                  alt={`${outfit.member} fashion ${index + 1}`}
                  className="object-cover w-full h-full rounded-none"
                />
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{outfit.member}</h1>
              <p className="text-gray-400">{outfit.event} · {outfit.date}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Items</h2>
              <div className="space-y-4">
                {outfit.items.map((item, idx) => (
                  <Card key={idx} className="mb-2 bg-background dark:bg-[#18181b]">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="font-semibold text-lg">{item.brand}</div>
                          <div className="text-base">{item.item}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.currency} {item.price?.toLocaleString()}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.style.map((style) => (
                              <Badge key={style} variant="secondary" className="rounded-none bg-gray-100 text-gray-700 border-0 font-medium">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild variant="outline" className="mt-2 md:mt-0">
                          <a href={item.link || getPurchaseLink(item.brand, item.item)} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="w-4 h-4 mr-2" /> 구매하러 가기
                          </a>
                        </Button>
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-400 mt-2">{item.description}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 